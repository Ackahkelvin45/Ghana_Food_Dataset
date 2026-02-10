import { Resend } from 'resend'

export interface PasswordResetEmailData {
  to: string
  resetUrl: string
  userName: string
}

let resend: Resend | null = null

function getResendClient() {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey || apiKey === 'your_resend_api_key_here') {
      throw new Error('RESEND_API_KEY environment variable is not set or is using placeholder value')
    }
    resend = new Resend(apiKey)
  }
  return resend
}

export async function sendPasswordResetEmail(data: PasswordResetEmailData) {
  try {
    const { to, resetUrl, userName } = data

    const resendClient = getResendClient()
    const result = await resendClient.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
      to: [to],
      subject: 'Reset your password - Ghana Food Dataset',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Reset your password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #ee7c2b; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Ghana Food Dataset</h1>
          </div>

          <div style="background: white; border: 1px solid #ddd; border-radius: 0 0 8px 8px; padding: 30px;">
            <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>

            <p>Hello ${userName},</p>

            <p>You have requested to reset your password for your Ghana Food Dataset account. Click the button below to create a new password:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #ee7c2b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>

            <p><strong>Important:</strong> This link will expire in 1 hour for security reasons.</p>

            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>

            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666; font-size: 14px;">${resetUrl}</p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

            <p style="color: #666; font-size: 14px; margin-bottom: 0;">
              If you have any questions, please contact our support team.
            </p>
          </div>
        </body>
        </html>
      `,
    })

    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error('Failed to send password reset email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}