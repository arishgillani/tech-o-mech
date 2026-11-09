
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const allowedStatuses = [
    "placed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
] as const;

type OrderStatus = (typeof allowedStatuses)[number];

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();

        // Check authentication
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 }
            );
        }

        // Check admin permissions
        const { data: admin, error: adminError } = await supabase
            .from("admin_users")
            .select("user_id")
            .eq("user_id", user.id)
            .maybeSingle();

        if (adminError || !admin) {
            return NextResponse.json(
                { error: "Access denied. Admin only." },
                { status: 403 }
            );
        }

        // Get and validate order ID
        const { id } = await params;
        const orderId = Number(id);

        if (!Number.isInteger(orderId) || orderId <= 0) {
            return NextResponse.json(
                { error: "Invalid order ID." },
                { status: 400 }
            );
        }

        // Get new status
        const body = await request.json();
        const status = body.status as OrderStatus;

        if (!allowedStatuses.includes(status)) {
            return NextResponse.json(
                { error: "Invalid order status." },
                { status: 400 }
            );
        }

        // Update order status in Supabase
        const { data: updatedOrder, error: updateError } = await supabase
            .from("orders")
            .update({ status })
            .eq("id", orderId)
            .select("id, status")
            .single();

        if (updateError) {
            console.error("Update order status error:", updateError);

            return NextResponse.json(
                { error: "Failed to update order status." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "Order status updated successfully.",
            order: updatedOrder,
        });
    } catch (error) {
        console.error("Admin order PATCH error:", error);

        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
