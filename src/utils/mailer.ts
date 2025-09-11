import nodemailer from 'nodemailer'

export function createTransport() {
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS

  if (!user || !pass) {
    throw new Error('EMAIL_USER or EMAIL_PASS is not set')
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
}

export async function sendVerificationEmail(toEmail: string, verifyUrl: string) {
  const transporter = createTransport()

  const html = `
    <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="margin:0 0 16px">Verify your email</h2>
      <p style="margin:0 0 16px">Click the button below to verify your email and continue setting up your SnapEvent profile.</p>
      <p style="margin:24px 0"><a href="${verifyUrl}" style="background:#111827;color:#fff;border-radius:8px;padding:12px 16px;text-decoration:none;display:inline-block">Verify Email</a></p>
      <p style="color:#6b7280;margin:16px 0">Or copy and paste this link into your browser:<br/>${verifyUrl}</p>
      <p style="color:#9ca3af;margin-top:24px;font-size:12px">If you did not request this, you can ignore this email.</p>
    </div>
  `

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Verify your email for SnapEvent',
    html,
  })
}


