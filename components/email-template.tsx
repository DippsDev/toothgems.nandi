import * as React from "react";

interface EmailTemplateProps {
    name: string;
    booking_ref: string;
    date: string;
    time: string;
    items: { title: string; price: string }[];
    total: number;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
    name,
    booking_ref,
    date,
    time,
    items,
    total,
}) => (
    <div style={{ fontFamily: "sans-serif", maxWidth: 480, margin: "0 auto", color: "#141414" }}>
        <div style={{ background: "#141414", padding: "24px 32px", borderRadius: "12px 12px 0 0" }}>
            <h1 style={{ color: "#fff", fontSize: 22, margin: 0 }}>💎 Tooth Gems by Nandi</h1>
        </div>
        <div style={{ border: "1px solid #e5e5e5", borderTop: "none", borderRadius: "0 0 12px 12px", padding: "32px" }}>
            <p style={{ fontSize: 16, marginTop: 0 }}>Hi {name},</p>
            <p style={{ fontSize: 15, color: "#444" }}>Your booking is confirmed. Here are your details:</p>

            <div style={{ background: "#f9f9f9", borderRadius: 8, padding: "16px 20px", margin: "20px 0" }}>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: "#888" }}>BOOKING REFERENCE</p>
                <p style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700 }}>{booking_ref}</p>
                <p style={{ margin: "0 0 4px", fontSize: 14 }}>📅 {date} at {time}</p>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: "left", fontSize: 12, color: "#888", paddingBottom: 8, borderBottom: "1px solid #e5e5e5" }}>SERVICE</th>
                        <th style={{ textAlign: "right", fontSize: 12, color: "#888", paddingBottom: 8, borderBottom: "1px solid #e5e5e5" }}>PRICE</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.title}>
                            <td style={{ padding: "10px 0", fontSize: 14, borderBottom: "1px solid #f0f0f0" }}>{item.title}</td>
                            <td style={{ padding: "10px 0", fontSize: 14, textAlign: "right", borderBottom: "1px solid #f0f0f0" }}>{item.price}</td>
                        </tr>
                    ))}
                    <tr>
                        <td style={{ paddingTop: 12, fontSize: 15, fontWeight: 700 }}>Total</td>
                        <td style={{ paddingTop: 12, fontSize: 15, fontWeight: 700, textAlign: "right" }}>P{total}</td>
                    </tr>
                </tbody>
            </table>

            <p style={{ fontSize: 14, color: "#555", marginBottom: 0 }}>
                See you soon! If you have any questions, just reply to this email.
            </p>
        </div>
    </div>
);
