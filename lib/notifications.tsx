import nodemailer from "nodemailer";

interface BookingDetails {
    name: string;
    phone: string;
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
                            <td style="padding-top:12px;font-size:15px;font-weight:700;text-align:right">P${booking.total}</td>
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

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const availableUrl = `${baseUrl}/api/bookings/respond?ref=${booking.booking_ref}&action=available`;
    const unavailableUrl = `${baseUrl}/api/bookings/respond?ref=${booking.booking_ref}&action=unavailable`;

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
                    <p style="margin:0 0 8px;font-size:14px">📞 <strong>Phone:</strong> <a href="tel:${booking.phone}" style="color:#141414">${booking.phone}</a></p>
                    <p style="margin:0;font-size:14px">📅 ${booking.date} at ${booking.time}</p>
                </div>
                <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
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
                            <td style="padding-top:12px;font-size:15px;font-weight:700;text-align:right">P${booking.total}</td>
                        </tr>
                    </tbody>
                </table>
                <p style="font-size:14px;color:#555;margin-bottom:12px">Please confirm your availability for this appointment:</p>
                <div style="display:flex;gap:12px">
                    <a href="${availableUrl}" style="display:inline-block;padding:12px 24px;background:#141414;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;margin-right:12px">✅ Available</a>
                    <a href="${unavailableUrl}" style="display:inline-block;padding:12px 24px;background:#fff;color:#141414;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;border:1px solid #141414">❌ Not Available</a>
                </div>
            </div>
        </div>`,
    });
}

export async function sendAvailabilityUpdateEmail(
    to: string,
    booking: BookingDetails,
    status: "confirmed" | "unavailable"
) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    const isConfirmed = status === "confirmed";

    await transporter.sendMail({
        from: `"Tooth Gems by Nandi" <${process.env.GMAIL_USER}>`,
        to,
        subject: isConfirmed
            ? `Appointment Confirmed — ${booking.booking_ref}`
            : `Appointment Update — ${booking.booking_ref}`,
        html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#141414">
            <div style="background:#141414;padding:24px 32px;border-radius:12px 12px 0 0">
                <h1 style="color:#fff;font-size:22px;margin:0">💎 Tooth Gems by Nandi</h1>
            </div>
            <div style="border:1px solid #e5e5e5;border-top:none;border-radius:0 0 12px 12px;padding:32px">
                <p style="font-size:16px;margin-top:0">Hi ${booking.name},</p>
                ${isConfirmed
                ? `<p style="font-size:15px;color:#444">Great news — your appointment has been <strong>confirmed</strong>. We'll see you on <strong>${booking.date} at ${booking.time}</strong>.</p>`
                : `<p style="font-size:15px;color:#444">Unfortunately, Nandi is not available on <strong>${booking.date} at ${booking.time}</strong>.</p>
                   <p style="font-size:15px;color:#444">You're welcome to <a href="https://toothgems-nandi.vercel.app" style="color:#141414;font-weight:600">visit the website</a> and pick a new date and time that works for you — or sit tight and Nandi will reach out directly to find a slot that works for both of you.</p>
                   <p style="font-size:14px;color:#888">We're sorry for the inconvenience and appreciate your patience. 💎</p>`
            }
                <div style="background:#f9f9f9;border-radius:8px;padding:16px 20px;margin:20px 0">
                    <p style="margin:0 0 8px;font-size:13px;color:#888">BOOKING REFERENCE</p>
                    <p style="margin:0 0 8px;font-size:18px;font-weight:700">${booking.booking_ref}</p>
                    <p style="margin:0;font-size:14px">📅 ${booking.date} at ${booking.time}</p>
                </div>
                <p style="font-size:14px;color:#555;margin-bottom:0">If you have any questions, reply to this email.</p>
            </div>
        </div>`,
    });
}
