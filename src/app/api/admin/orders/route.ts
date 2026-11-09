
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();

        // Verify that the user is logged in.
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Please sign in to access orders." },
                { status: 401 },
            );
        }

        // Verify that the logged-in user is an admin.
        const { data: admin, error: adminError } = await supabase
            .from("admin_users")
            .select("user_id")
            .eq("user_id", user.id)
            .maybeSingle();

        if (adminError || !admin) {
            return NextResponse.json(
                { error: "You are not authorized to view all orders." },
                { status: 403 },
            );
        }

        // Retrieve all orders and their associated items.
        const { data: orders, error: ordersError } = await supabase
            .from("orders")
            .select(`
        id,
        user_id,
        full_name,
        email,
        shipping_address,
        shipping_city,
        shipping_state,
        shipping_zip,
        phone,
        total,
        status,
        created_at,
        order_items (
          id,
          product_id,
          product_name,
          quantity,
          unit_price
        )
      `)
            .order("created_at", { ascending: false });

        if (ordersError) {
            console.error("Admin orders fetch failed:", ordersError.message);

            return NextResponse.json(
                { error: "Unable to retrieve orders right now." },
                { status: 500 },
            );
        }

        return NextResponse.json({ orders: orders ?? [] });
    } catch (error) {
        console.error("Admin orders API error:", error);

        return NextResponse.json(
            { error: "An unexpected error occurred while retrieving orders." },
            { status: 500 },
        );
    }
}
