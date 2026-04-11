import nodemailer from "nodemailer";

interface BookingDetails {
    name: string;
    booking_ref: string;
    date: string;
    time: string;
    items: { title: string; price: string }[];
    total: number;
}

export async function sendReceiptEmail(to: string, booking: BookingDetails) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    const itemRows = booking.items
        .map(i => `<tr><td style="padding:10px 0;font-size:14px;border-bottom:1px solid #f0f0f0">${i.title}</td><td style="padding:10px 0;font-size:14px;text-align:right;border-bottom:1px solid #f0f0f0">${i.price}</td></tr>`)
        .join("");

    await transporter.sendMail({
        from: `"Tooth Gems by Nandi" <${process.env.GMAIL_USER}>`,
        to,
        subject: `Booking Confirmed — ${booking.booking_ref}`,
        html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#141414">
            <div style="background:#141414;padding:24px 32px;border-radius:12px 12px 0 0">
                <h1 style="color:#fff;font-size:22px;margin:0">💎 Tooth Gems by Nandi</h1>
            </div>
            <div style="border:1px solid #e5e5e5;border-top:none;border-radius:0 0 12px 12px;padding:32px">
                <p style="font-size:16px;margin-top:0">Hi ${booking.name},</p>
                <p style="font-size:15px;color:#444">Your booking is confirmed. Here are your details:</p>
                <div style="background:#f9f9f9;border-radius:8px;padding:16px 20px;margin:20px 0">
                    <p style="margin:0 0 8px;font-size:13px;color:#888">BOOKING REFERENCE</p>
                    <p style="margin:0 0 16px;font-size:18px;font-weight:700">${booking.booking_ref}</p>
                    <p style="margin:0;font-size:14px">📅 ${booking.date} at ${booking.time}</p>
                </div>
                <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
                    <thead>
                        <tr>
                            <th style="text-align:left;font-size:12px;color:#888;padding-bottom:8px;border-bottom:1px solid #e5e5e5">SERVICE</th>
                            <th style="text-align:right;font-size:12px;color:#888;padding-bottom:8px;border-bottom:1px solid #e5e5e5">PRICE</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemRows}
                        <tr>
                            <td style="padding-top:12px;font-size:15px;font-weight:700">Total</td>
                            <td style="padding-top:12px;font-size:15px;font-weight:700;text-align:right">R${booking.total}</td>
                        </tr>
                    </tbody>
                </table>
                <p style="font-size:14px;color:#555;margin-bottom:0">See you soon! If you have any questions, just reply to this email.</p>
            </div>
        </div>`,
    });
}

export async function sendClientWhatsApp(phone: string, booking: BookingDetails) {
    // WhatsApp notifications removed — client receives confirmation via email
}

export async function sendProviderEmail(booking: BookingDetails) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    const itemRows = booking.items
        .map(i => `<tr><td style="padding:10px 0;font-size:14px;border-bottom:1px solid #f0f0f0">${i.title}</td><td style="padding:10px 0;font-size:14px;text-align:right;border-bottom:1px solid #f0f0f0">${i.price}</td></tr>`)
        .join("");

    await transporter.sendMail({
        from: `"Tooth Gems by Nandi" <${process.env.GMAIL_USER}>`,
        to: process.env.PROVIDER_EMAIL,
        subject: `New Booking — ${booking.booking_ref}`,
        html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#141414">
            <div style="background:#141414;padding:24px 32px;border-radius:12px 12px 0 0">
                <h1 style="color:#fff;font-size:22px;margin:0">💎 New Booking Received</h1>
            </div>
            <div style="border:1px solid #e5e5e5;border-top:none;border-radius:0 0 12px 12px;padding:32px">
                <p style="font-size:16px;margin-top:0">You have a new appointment booking.</p>
                <div style="background:#f9f9f9;border-radius:8px;padding:16px 20px;margin:20px 0">
                    <p style="margin:0 0 8px;font-size:13px;color:#888">BOOKING REFERENCE</p>
                    <p style="margin:0 0 16px;font-size:18px;font-weight:700">${booking.booking_ref}</p>
                    <p style="margin:0 0 8px;font-size:14px">👤 <strong>Client:</strong> ${booking.name}</p>
                    <p style="margin:0;font-size:14px">📅 ${booking.date} at ${booking.time}</p>
                </div>
                <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
                    <thead>
                        <tr>
                            <th style="text-align:left;font-size:12px;color:#888;padding-bottom:8px;border-bottom:1px solid #e5e5e5">SERVICE</th>
                            <th style="text-align:right;font-size:12px;color:#888;padding-bottom:8px;border-bottom:1px solid #e5e5e5">PRICE</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemRows}
                        <tr>
                            <td style="padding-top:12px;font-size:15px;font-weight:700">Total</td>
                            <td style="padding-top:12px;font-size:15px;font-weight:700;text-align:right">R${booking.total}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>`,
    });
}
