import crypto from "crypto";
import { prisma } from "./prisma";

/**
 * Generate a secure random token for password reset
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Clean up expired password reset tokens
 * This should be run periodically (e.g., via a cron job)
 */
export async function cleanupExpiredTokens(): Promise<number> {
  try {
    const result = await prisma.passwordResetToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
    return 0;
  }
}

/**
 * Validate and get user from reset token
 */
export async function validateResetToken(token: string) {
  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      return { valid: false, error: "Invalid reset token" };
    }

    if (resetToken.expiresAt < new Date()) {
      // Clean up expired token
      await prisma.passwordResetToken.delete({
        where: { token },
      });

      return { valid: false, error: "Reset token has expired" };
    }

    return {
      valid: true,
      user: {
        id: resetToken.user.id,
        email: resetToken.user.email,
        fullName: resetToken.user.fullName,
      }
    };
  } catch (error) {
    console.error('Error validating reset token:', error);
    return { valid: false, error: "Internal error validating token" };
  }
}