
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const supabase = await createClient();

    // Verify the logged-in user.
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "You must be logged in." },
        { status: 401 }
      );
    }

    // Verify admin access.
    const { data: admin, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (adminError || !admin) {
      return NextResponse.json(
        { success: false, error: "Admin access required." },
        { status: 403 }
      );
    }

    // Validate the product ID.
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isSafeInteger(productId) || productId <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid product ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      slug,
      name,
      category,
      price,
      image,
      description,
      brand,
      rating,
      inStock,
    } = body;

    if (
      !slug?.trim() ||
      !name?.trim() ||
      !category?.trim() ||
      price === undefined ||
      price === null ||
      !image?.trim() ||
      !description?.trim() ||
      !brand?.trim()
    ) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid price." },
        { status: 400 }
      );
    }

    if (
      rating !== undefined &&
      (typeof rating !== "number" ||
        !Number.isFinite(rating) ||
        rating < 0 ||
        rating > 5)
    ) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 0 and 5." },
        { status: 400 }
      );
    }

    if (typeof inStock !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Invalid stock status." },
        { status: 400 }
      );
    }

    // Update the product.
    const { data, error } = await supabase
      .from("products")
      .update({
        slug: slug.trim(),
        name: name.trim(),
        category: category.trim(),
        price,
        image: image.trim(),
        description: description.trim(),
        brand: brand.trim(),
        rating: rating ?? 0,
        in_stock: inStock,
      })
      .eq("id", productId)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Update product error:", error);

      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
      product: data,
    });
  } catch (error) {
    console.error("Admin update product API error:", error);

    return NextResponse.json(
      { success: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const supabase = await createClient();

    // Verify the logged-in user.
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "You must be logged in." },
        { status: 401 }
      );
    }

    // Verify admin access.
    const { data: admin, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (adminError || !admin) {
      return NextResponse.json(
        { success: false, error: "Admin access required." },
        { status: 403 }
      );
    }

    // Validate the product ID.
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isSafeInteger(productId) || productId <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid product ID." },
        { status: 400 }
      );
    }

    // Get the product image before deleting the product.
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("id, image")
      .eq("id", productId)
      .maybeSingle();

    if (fetchError) {
      console.error("Fetch product error:", fetchError);

      return NextResponse.json(
        { success: false, error: "Could not find the product." },
        { status: 500 }
      );
    }

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found." },
        { status: 404 }
      );
    }

    // Delete the product from the database.
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (deleteError) {
      console.error("Delete product error:", deleteError);

      // Protect products that are part of existing orders.
      if (deleteError.code === "23503") {
        return NextResponse.json(
          {
            success: false,
            error:
              "This product cannot be deleted because it is part of an existing order.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { success: false, error: "Could not delete the product." },
        { status: 500 }
      );
    }

    // Clean up the image only if it belongs to our Supabase Storage bucket.
    const storageMarker = "/storage/v1/object/public/product-images/";
    const imageUrl = product.image;

    if (imageUrl.includes(storageMarker)) {
      const imagePath = imageUrl.split(storageMarker)[1];

      if (imagePath) {
        // Check whether another product uses the same image.
        const { data: otherProducts, error: imageCheckError } =
          await supabase
            .from("products")
            .select("id")
            .eq("image", imageUrl)
            .limit(1);

        if (!imageCheckError && (!otherProducts || otherProducts.length === 0)) {
          const { error: storageError } = await supabase.storage
            .from("product-images")
            .remove([decodeURIComponent(imagePath)]);

          if (storageError) {
            console.error("Image cleanup error:", storageError);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Admin delete product API error:", error);

    return NextResponse.json(
      { success: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}
