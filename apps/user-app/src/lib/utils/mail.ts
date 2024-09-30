import { Resend } from "resend";

import { config } from "@/lib/utils/config";
import { EmailVerification, PasswordReset } from "@/components/templates/mail";

const resend = new Resend(config.resendApiKey);

/**
 * Sends a verification email to the user 
 */
export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  const verifyLink = `${config.route}/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    react: EmailVerification({ verifyLink }),
  });
};

/**
 * Sends a password reset email to the user 
 */
export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
  const resetLink = `${config.route}/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    react: PasswordReset({ resetLink }),
  });
};