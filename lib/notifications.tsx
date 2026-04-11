import React from "react";
import { Resend } from "resend";
import twilio from "twilio";
import { EmailTemplate } from "@/components/email-template";

interface BookingDetails {
    name: string;
    booking_ref: string;
    date: string;
    time: string;
    items: { title: string; price: string }[];
    total: number;
}

export async function sendReceiptEmail(to: string, booking: BookingDetails) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
        from: "Tooth Gems by Nandi <bookings@yourdomain.com>",
        to,
        subject: `Booking Confirmed — ${booking.booking_ref}`,
        react: <EmailTemplate {...booking} />,
    });
}

export async function sendClientWhatsApp(phone: string, booking: BookingDetails) {
    const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM!,
        to: `whatsapp:${phone}`,
        body: `Hi ${booking.name} 👋 Your tooth gem appointment is confirmed!\n\n📅 ${booking.date} at ${booking.time}\nRef: ${booking.booking_ref}\n\nSee you then! 💎`,
    });
}

export async function sendProviderWhatsApp(booking: BookingDetails) {
    const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const itemsList = booking.items.map(i => i.title).join(", ");

    await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM!,
        to: process.env.PROVIDER_WHATSAPP!,
        body: `New booking 💎\n\nClient: ${booking.name}\nDate: ${booking.date} at ${booking.time}\nServices: ${itemsList}\n\nAre you available? Please confirm.`,
    });
}
