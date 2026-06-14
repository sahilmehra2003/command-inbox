import { resend } from "@/config/resend.config";
import VerificationEmail from "@/emails/verification-email";
import ForgotPasswordEmail from "@/emails/forgot-password-email";
import WelcomeEmail from "@/emails/welcome-email";



interface SendVerificationEmailParameters {
    email: string,
    name: string,
    verificationUrl: string
}

interface ForgotPasswordEmailParameters {
    email: string,
    name: string,
    resetUrl: string
}

interface WelcomeEmailParameters {
    email:string
    name: string,
    dashboardUrl: string
}

export const sendUserVerificationEmail = async ({ email, name, verificationUrl }: SendVerificationEmailParameters) => {
    const { data, error } = await resend.emails.send({
        from: "Command Inbox <onboarding@resend.dev>",
        to: email,
        subject: "Verify your account",
        react: VerificationEmail({
            name,
            verificationUrl
        })
    })
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export async function sendForgotPasswordEmail({
    email,
    name,
    resetUrl,
}: ForgotPasswordEmailParameters) {
    const { data, error } = await resend.emails.send({
        from: "Command Inbox <onboarding@resend.dev>",
        to: email,
        subject: "Reset your password",
        react: ForgotPasswordEmail({
            name,
            resetUrl,
        }),
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function sendWelcomeEmail({
    email,
    name,
    dashboardUrl,
}: WelcomeEmailParameters) {
    const { data, error } = await resend.emails.send({
        from: "Command Inbox <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to Command Inbox!",
        react: WelcomeEmail({
            name,
            dashboardUrl,
        }),
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
