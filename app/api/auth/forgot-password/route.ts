import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { generateResetToken } from "@/src/lib/auth-utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailTrimmed = email.trim().toLowerCase();

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: emailTrimmed },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        message: "If an account with that email exists, we've sent a password reset link."
      });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Save token to database
    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Send email
    const resetUrl = `${process.env.AUTH_URL}/reset-password?token=${resetToken}`;

    try {
      // Dynamically import email functionality to avoid build-time issues
      const { sendPasswordResetEmail } = await import("@/src/lib/email");

      const emailResult = await sendPasswordResetEmail({
        to: user.email,
        resetUrl,
        userName: user.fullName,
      });

      if (!emailResult.success) {
        console.error('Failed to send password reset email:', emailResult.error);
        return NextResponse.json(
          { error: "Failed to send email. Please try again later." },
          { status: 500 }
        );
      }
    } catch (emailError) {
      console.error('Email service error:', emailError);
      // For development/demo purposes, you might want to log the reset URL
      console.log(`Password reset URL (for development): ${resetUrl}`);

      // Return success response even if email fails, for security reasons
      // (don't reveal if email service is configured or not)
      return NextResponse.json({
        message: "If an account with that email exists, we've sent a password reset link."
      });
    }

    return NextResponse.json({
      message: "If an account with that email exists, we've sent a password reset link."
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}