import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { sendReceiptEmail, sendClientWhatsApp, sendProviderEmail } from "@/lib/notifications";

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { booking_ref, service_slug, items, total, date, time, name, phone, email } = body;

        if (!booking_ref || !service_slug || !items || !date || !time || !name || !phone) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const supabase = getSupabase();

        const { error } = await supabase.from("bookings").insert({
            booking_ref,
            service_slug,
            items,
            total,
            date,
            time,
            name,
            phone,
            email: email || null,
        });

        if (error) {
            console.error("Booking insert error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Fire notifications — don't block the response if they fail
        const notificationPayload = { name, phone, booking_ref, date, time, items, total };
        await Promise.allSettled([
            email ? sendReceiptEmail(email, notificationPayload) : Promise.resolve(),
            sendClientWhatsApp(phone, notificationPayload),
            sendProviderEmail(notificationPayload),
        ]);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Unexpected error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const date = searchParams.get("date");
        const slug = searchParams.get("slug");

        if (!date || !slug) {
            return NextResponse.json({ error: "Missing date or slug" }, { status: 400 });
        }

        const supabase = getSupabase();

        const { data, error } = await supabase
            .from("bookings")
            .select("time")
            .eq("date", date)
            .eq("service_slug", slug);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const bookedTimes = (data ?? []).map((b: { time: string }) => b.time);
        return NextResponse.json({ bookedTimes });
    } catch (err) {
        console.error("Unexpected error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
