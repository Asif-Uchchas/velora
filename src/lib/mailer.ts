import "server-only";
import nodemailer from "nodemailer";
import { buildOrderText, zoneLabel, type OrderSummary } from "@/lib/order-message";
import { formatTaka } from "@/lib/formatters";
import { formatBdPhone } from "@/lib/phone";

let transporter: nodemailer.Transporter | null = null;

/** True when Gmail SMTP credentials are set, so the server can send order emails itself. */
export function isMailConfigured() {
    return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

function getTransporter() {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;
    if (!user || !pass) return null;
    transporter ??= nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass },
    });
    return transporter;
}

export function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function orderHtml(order: OrderSummary, adminUrl: string) {
    const e = escapeHtml;
    const rows = order.items
        .map(
            (item) => `<tr>
<td style="padding:8px 0;border-bottom:1px solid #e2e8f0">${e(item.name)}</td>
<td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:center">${item.quantity}</td>
<td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:right">${e(formatTaka(item.price * item.quantity))}</td>
</tr>`
        )
        .join("");

    return `<!doctype html><html><body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
<div style="max-width:560px;margin:0 auto;padding:24px">
<div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:24px">
<p style="margin:0 0 4px;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:.06em">New order request (email)</p>
<h1 style="margin:0 0 16px;font-size:20px">${e(order.orderNumber)}</h1>
<table style="width:100%;border-collapse:collapse;font-size:14px">
<thead><tr><th style="text-align:left;padding-bottom:8px">Item</th><th style="padding-bottom:8px">Qty</th><th style="text-align:right;padding-bottom:8px">Amount</th></tr></thead>
<tbody>${rows}</tbody>
</table>
<p style="font-size:14px;margin:16px 0 4px">Subtotal: <strong>${e(formatTaka(order.subtotal))}</strong></p>
<p style="font-size:14px;margin:0 0 4px">Delivery (${e(zoneLabel(order.deliveryZone))}): <strong>${e(formatTaka(order.deliveryFee))}</strong></p>
<p style="font-size:16px;margin:0 0 16px">Total (COD): <strong>${e(formatTaka(order.total))}</strong></p>
<hr style="border:0;border-top:1px solid #e2e8f0;margin:16px 0">
<p style="font-size:14px;margin:0 0 4px"><strong>${e(order.customerName)}</strong></p>
<p style="font-size:14px;margin:0 0 4px">${e(formatBdPhone(order.customerPhone))}${order.customerEmail ? ` · ${e(order.customerEmail)}` : ""}</p>
<p style="font-size:14px;margin:0 0 4px">${e(order.address)}, ${e(order.district)}</p>
${order.note ? `<p style="font-size:14px;margin:8px 0 0;color:#475569">Note: ${e(order.note)}</p>` : ""}
<p style="margin:24px 0 0"><a href="${e(adminUrl)}" style="display:inline-block;background:#4f46e5;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-size:14px;font-weight:bold">Open in admin</a></p>
</div></div></body></html>`;
}

/** Sends the order to the store. Returns false if mail is not configured or sending failed. */
export async function sendOrderEmail(order: OrderSummary, to: string, adminUrl: string): Promise<boolean> {
    const t = getTransporter();
    if (!t) {
        console.error("sendOrderEmail: GMAIL_USER / GMAIL_APP_PASSWORD not configured");
        return false;
    }
    try {
        await t.sendMail({
            from: `"Velora Orders" <${process.env.GMAIL_USER}>`,
            to,
            replyTo: order.customerEmail || undefined,
            subject: `New order ${order.orderNumber} — ${formatTaka(order.total)}`,
            text: buildOrderText(order, adminUrl),
            html: orderHtml(order, adminUrl),
        });
        return true;
    } catch (error) {
        console.error("sendOrderEmail failed:", error);
        return false;
    }
}
