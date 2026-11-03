
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type OrderRequestItem = {
  productId: number;
  quantity: number;
};

type OrderRequest = {
  items: OrderRequestItem[];
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Please sign in before placing an order." },
        { status: 401 },
      );
    }

    let body: OrderRequest;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    const {
      items,
      fullName,
      email,
      address,
      city,
      state,
      zipCode,
      phone,
    } = body;

    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      items.length > 50 ||
      typeof fullName !== "string" ||
      !fullName.trim() ||
      typeof email !== "string" ||
      email.trim().toLowerCase() !== user.email?.toLowerCase() ||
      typeof address !== "string" ||
      !address.trim() ||
      typeof city !== "string" ||
      !city.trim() ||
      typeof state !== "string" ||
      !state.trim() ||
      typeof zipCode !== "string" ||
      !zipCode.trim() ||
      (phone !== undefined && typeof phone !== "string")
    ) {
      return NextResponse.json(
        { error: "Please provide valid shipping information and cart items." },
        { status: 400 },
      );
    }

    const quantities = new Map<number, number>();

    for (const item of items) {
      if (
        !item ||
        !Number.isSafeInteger(item.productId) ||
        item.productId <= 0 ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity <= 0 ||
        item.quantity > 99
      ) {
        return NextResponse.json(
          { error: "One or more cart items are invalid." },
          { status: 400 },
        );
      }

      const combinedQuantity =
        (quantities.get(item.productId) ?? 0) + item.quantity;

      if (combinedQuantity > 99) {
        return NextResponse.json(
          { error: "Maximum quantity per product is 99." },
          { status: 400 },
        );
      }

      quantities.set(item.productId, combinedQuantity);
    }

    const productIds = [...quantities.keys()];

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, price")
      .in("id", productIds);

    if (productsError) {
      console.error("Product lookup failed:", productsError.message);

      return NextResponse.json(
        { error: "Unable to verify your products right now." },
        { status: 500 },
      );
    }

    if (!products || products.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more products are no longer available." },
        { status: 400 },
      );
    }

    for (const product of products) {
      const price = Number(product.price);

      if (!Number.isFinite(price) || price < 0) {
        return NextResponse.json(
          { error: "A product has an invalid price." },
          { status: 500 },
        );
      }
    }

    const orderItems = products.map((product) => ({
      product_id: product.id,
      quantity: quantities.get(product.id)!,
    }));

    const { data: orderId, error: orderError } = await supabase.rpc(
      "create_demo_order",
      {
        p_user_id: user.id,
        p_full_name: fullName.trim(),
        p_email: user.email!,
        p_address: address.trim(),
        p_city: city.trim(),
        p_state: state.trim(),
        p_zip_code: zipCode.trim(),
        p_phone: phone?.trim() || null,
        p_items: orderItems,
      },
    );

    if (orderError) {
      console.error("Order creation failed:", orderError.message);

      return NextResponse.json(
        { error: "We couldn't place your order. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Demo order placed successfully.",
        orderId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Order API failed:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred while placing your order." },
      { status: 500 },
    );
  }
}
