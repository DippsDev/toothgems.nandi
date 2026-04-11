import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );
}

export async function POST(req: NextRequest) {
    try {
        const { name, message, rating } = await req.json();

        if (!name?.trim() || !message?.trim()) {
            return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
        }

        const supabase = getSupabase();
        const { error } = await supabase.from("feedback").insert({
            name: name.trim(),
            message: message.trim(),
            rating: rating ?? null,
        });

        if (error) {
            console.error("Feedback insert error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Unexpected error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const supabase = getSupabase();
        const { data, error } = await supabase
            .from("feedback")
            .select("id, name, message, rating, created_at")
            .order("created_at", { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ feedback: data ?? [] });
    } catch (err) {
        console.error("Unexpected error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
