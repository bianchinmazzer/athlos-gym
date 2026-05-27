import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient, createClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "admin" ? user : null;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const supabase = await createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { name, email, password, role } = await req.json();
  if (!name || !email || !password) return NextResponse.json({ error: "Faltan campos" }, { status: 400 });

  const adminClient = await createAdminClient();
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, role: role || "user" },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  console.log("Usuario creado, enviando email a:", email);

  try {
    const emailResult = await resend.emails.send({
      from: "Athlos Gym <noreply@athlosmh.com.ar>",
      to: email,
      subject: "¡Bienvenido a Athlos Gym! 💪",
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f1a; color: #f0f0f0; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #e8533a, #f4a340); padding: 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 2rem; letter-spacing: 0.08em; color: white;">ATHLOS GYM</h1>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: rgba(255,255,255,0.85); letter-spacing: 0.12em;">MONTE HERMOSO</p>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #f4a340; margin-top: 0;">¡Hola ${name}!</h2>
            <p style="color: #f0f0f0; line-height: 1.6;">
              Te damos la bienvenida a <strong style="color: #e8533a;">Athlos Gym</strong>. Ya tenés tu cuenta lista para acceder a tus rutinas personalizadas.
            </p>
            <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 3px solid #4ecdc4;">
              <p style="margin: 0 0 12px; color: #8a8a9a; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em;">Tus credenciales de acceso</p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #8a8a9a; width: 100px;">Email</td>
                  <td style="padding: 6px 0; color: #f0f0f0; font-weight: 600;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #8a8a9a;">Contraseña</td>
                  <td style="padding: 6px 0; color: #f0f0f0; font-weight: 600;">${password}</td>
                </tr>
              </table>
            </div>
            <p style="color: #8a8a9a; font-size: 0.85rem; line-height: 1.6;">
              Te recomendamos cambiar tu contraseña después del primer ingreso.
            </p>
            <div style="background: rgba(244,168,64,0.1); border-radius: 12px; padding: 16px; margin: 24px 0; border-left: 3px solid #f4a340;">
              <p style="margin: 0; color: #f4a340; font-size: 0.9rem;">
                📌 <strong>Recordá:</strong> no olvides abonar tu cuota cada mes para mantener tu cuenta activa.
              </p>
            </div>
            <div style="text-align: center; margin-top: 32px;">
              <a href="https://athlosmh.com.ar/login"
                 style="display: inline-block; background: linear-gradient(135deg, #e8533a, #f4a340); color: white; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: 600; letter-spacing: 0.06em; font-size: 1rem;">
                INGRESAR A MI CUENTA
              </a>
            </div>
            <p style="color: #8a8a9a; font-size: 0.75rem; text-align: center; margin-top: 32px;">
              Este email fue enviado por Athlos Gym — Monte Hermoso, Buenos Aires.
            </p>
          </div>
        </div>
      `,
    });
    console.log("Resultado email:", emailResult);
  } catch (emailError) {
    console.error("Error enviando email de bienvenida:", emailError);
  }

  return NextResponse.json({ user: data.user });
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id, name, role, password } = await req.json();
  const adminClient = await createAdminClient();

  // Update profile
  await adminClient.from("profiles").update({ name, role }).eq("id", id);

  // Optionally update password
  if (password) {
    await adminClient.auth.admin.updateUserById(id, { password });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await req.json();
  const adminClient = await createAdminClient();
  await adminClient.auth.admin.deleteUser(id);

  return NextResponse.json({ ok: true });
}
