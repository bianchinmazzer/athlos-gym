import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    }

    await resend.emails.send({
      from: "Athlos Gym Web <noreply@athlosgym.com>",
      to: process.env.CONTACT_EMAIL!,
      replyTo: email,
      subject: `Nuevo mensaje de ${name} — Athlos Gym`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #f0f0f0; padding: 32px; border-radius: 12px;">
          <h2 style="color: #e8533a; margin-top: 0;">Nuevo mensaje desde la web</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #8a8a9a; width: 100px;">Nombre</td>
              <td style="padding: 8px 0; font-weight: 500;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #8a8a9a;">Email</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #4ecdc4;">${email}</a></td>
            </tr>
          </table>
          <div style="margin-top: 24px; padding: 16px; background: rgba(255,255,255,0.04); border-radius: 8px; border-left: 3px solid #e8533a;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="margin-top: 24px; color: #8a8a9a; font-size: 12px;">Este email fue enviado desde athlosgym.com</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
