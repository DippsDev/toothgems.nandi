import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { sendAvailabilityUpdateEmail } from "@/lib/notifications";

// Uses the service role key so it can update rows (bypasses RLS)
function getSupabaseAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const ref = searchParams.get("ref");
    const action = searchParams.get("action"); // "available" | "unavailable"

    if (!ref || !action || !["available", "unavailable"].includes(action)) {
        return new NextResponse("Invalid request.", { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Fetch the booking
    const { data: booking, error: fetchError } = await supabase
        .from("bookings")
        .select("*")
        .eq("booking_ref", ref)
        .single();

    if (fetchError || !booking) {
        return new NextResponse("Booking not found.", { status: 404 });
    }

    if (booking.status !== "pending") {
        return new NextResponse(
            `<html><body style="font-family:sans-serif;text-align:center;padding:60px">
                <h2>Already responded</h2>
                <p>This booking has already been marked as <strong>${booking.status}</strong>.</p>
            </body></html>`,
            { status: 200, headers: { "Content-Type": "text/html" } }
        );
    }

    const newStatus = action === "available" ? "confirmed" : "unavailable";

    const { error: updateError } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("booking_ref", ref);

    if (updateError) {
        console.error("Status update error:", updateError);
        return new NextResponse("Failed to update booking.", { status: 500 });
    }

    // Notify the customer if they provided an email
    if (booking.email) {
        await sendAvailabilityUpdateEmail(booking.email, booking, newStatus).catch(console.error);
    }

    const message = newStatus === "confirmed"
        ? "You've confirmed your availability. The customer has been notified."
        : "You've marked yourself as unavailable. The customer has been notified and this slot is now blocked.";

    return new NextResponse(
        `<html><body style="font-family:sans-serif;text-align:center;padding:60px;color:#141414">
            <h2 style="font-size:24px">💎 Tooth Gems by Nandi</h2>
            <p style="font-size:16px;color:#444;max-width:400px;margin:0 auto">${message}</p>
        </body></html>`,
        { status: 200, headers: { "Content-Type": "text/html" } }
    );
}
