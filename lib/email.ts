import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

/**
 * Email configuration supporting both Resend API and SMTP
 *
 * Environment Variables:
 * - EMAIL_PROVIDER: 'resend' or 'smtp' (required)
 * - EMAIL_FROM: From address (required)
 *
 * For Resend:
 * - RESEND_API_KEY: API key from resend.com
 *
 * For SMTP:
 * - SMTP_HOST: SMTP server host
 * - SMTP_PORT: SMTP server port (default: 587)
 * - SMTP_USER: SMTP username
 * - SMTP_PASS: SMTP password
 * - SMTP_SECURE: Use TLS (default: false for port 587, true for 465)
 *
 * @example
 * // Simple usage in a Server Action
 * import { sendEmail } from '@/lib/email';
 *
 * export async function sendWelcomeEmail(userEmail: string) {
 *   "use server";
 *
 *   await sendEmail({
 *     to: userEmail,
 *     subject: "Welcome to unwhelm!",
 *     html: "<h1>Welcome!</h1><p>Thanks for joining unwhelm.</p>",
 *     text: "Welcome! Thanks for joining unwhelm.",
 *   });
 * }
 *
 * @example
 * // Sending to multiple recipients
 * await sendEmail({
 *   to: ['user1@example.com', 'user2@example.com'],
 *   subject: "Team Update",
 *   html: "<p>Here's your team update...</p>",
 * });
 *
 * @example
 * // Using the service directly for more control
 * import { getEmailService } from '@/lib/email';
 *
 * const emailService = getEmailService();
 * const fromAddress = emailService.getFromAddress();
 * const provider = emailService.getProvider();
 *
 * await emailService.sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Test',
 *   html: '<p>Test email</p>',
 * });
 */

type EmailProvider = 'resend' | 'smtp';

interface EmailConfig {
  provider: EmailProvider;
  from: string;
}

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private config: EmailConfig;
  private resend?: Resend;
  private transporter?: Transporter;

  constructor() {
    const provider = process.env.EMAIL_PROVIDER as EmailProvider;
    const from = process.env.EMAIL_FROM;

    if (!provider) {
      throw new Error('EMAIL_PROVIDER environment variable is required');
    }

    if (!from) {
      throw new Error('EMAIL_FROM environment variable is required');
    }

    if (provider !== 'resend' && provider !== 'smtp') {
      throw new Error('EMAIL_PROVIDER must be either "resend" or "smtp"');
    }

    this.config = { provider, from };

    if (provider === 'resend') {
      this.initializeResend();
    } else {
      this.initializeSMTP();
    }
  }

  private initializeResend() {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is required when using Resend provider');
    }

    this.resend = new Resend(apiKey);
  }

  private initializeSMTP() {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;

    if (!host) {
      throw new Error('SMTP_HOST environment variable is required when using SMTP provider');
    }

    if (!user) {
      throw new Error('SMTP_USER environment variable is required when using SMTP provider');
    }

    if (!pass) {
      throw new Error('SMTP_PASS environment variable is required when using SMTP provider');
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }

  async sendEmail({ to, subject, html, text }: SendEmailParams): Promise<void> {
    if (this.config.provider === 'resend') {
      await this.sendWithResend({ to, subject, html, text });
    } else {
      await this.sendWithSMTP({ to, subject, html, text });
    }
  }

  private async sendWithResend({ to, subject, html, text }: SendEmailParams): Promise<void> {
    if (!this.resend) {
      throw new Error('Resend client not initialized');
    }

    const recipients = Array.isArray(to) ? to : [to];

    await this.resend.emails.send({
      from: this.config.from,
      to: recipients,
      subject,
      html,
      text,
    });
  }

  private async sendWithSMTP({ to, subject, html, text }: SendEmailParams): Promise<void> {
    if (!this.transporter) {
      throw new Error('SMTP transporter not initialized');
    }

    const recipients = Array.isArray(to) ? to : [to];

    await this.transporter.sendMail({
      from: this.config.from,
      to: recipients,
      subject,
      html,
      text,
    });
  }

  getFromAddress(): string {
    return this.config.from;
  }

  getProvider(): EmailProvider {
    return this.config.provider;
  }
}

// Singleton instance - only initialize once
let emailServiceInstance: EmailService | null = null;

export function getEmailService(): EmailService {
  if (!emailServiceInstance) {
    emailServiceInstance = new EmailService();
  }
  return emailServiceInstance;
}

// Convenience function for sending emails
export async function sendEmail(params: SendEmailParams): Promise<void> {
  const service = getEmailService();
  await service.sendEmail(params);
}
