import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Verify the logged-in user.
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

    // 2. Verify that the user is an admin.
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

    // 3. Read the submitted product information.
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

    // 4. Validate required fields.
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

    // 5. Insert the product into Supabase.
    const { data, error } = await supabase
      .from("products")
      .insert({
        slug: slug.trim(),
        name: name.trim(),
        category: category.trim(),
        price,
        image: image.trim(),
        description: description.trim(),
        brand: brand.trim(),
        rating: typeof rating === "number" ? rating : 0,
        in_stock: typeof inStock === "boolean" ? inStock : true,
      })
      .select()
      .single();

    if (error) {
      console.error("Add product error:", error);

      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product added successfully.",
        product: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin products API error:", error);

    return NextResponse.json(
      { success: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}