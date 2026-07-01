import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const createTransporter = () => {
  // If we have a Gmail address, we can use the Gmail service directly
  if (process.env.EMAIL_USER && process.env.EMAIL_USER.endsWith('@gmail.com')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // If credentials are placeholders or mock, return a mock transporter that logs to console
  if (
    process.env.EMAIL_USER === 'mock_user' ||
    process.env.EMAIL_PASS === 'mock_pass' ||
    !process.env.EMAIL_HOST
  ) {
    return {
      sendMail: async (options) => {
        console.log('\n--- [MOCK EMAIL SENT] ---');
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Body: ${options.text || options.html}`);
        console.log('-------------------------\n');
        return { messageId: 'mock-id-' + Date.now() };
      },
    };
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const transporter = createTransporter();

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"Research Connect" <${process.env.EMAIL_USER || 'noreply@researchconnect.com'}>`,
    to: email,
    subject: 'Verify Your Email - Research Connect',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 5px;">
        <h2 style="color: #4f46e5; text-align: center;">Welcome to Research Connect!</h2>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email Address</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b7280;">${verificationUrl}</p>
        <hr style="border: 0; border-top: 1px solid #f0f0f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">This link will expire in 24 hours.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5174'}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Research Connect" <${process.env.EMAIL_USER || 'noreply@researchconnect.com'}>`,
    to: email,
    subject: 'Reset Your Password - Research Connect',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 5px;">
        <h2 style="color: #4f46e5; text-align: center;">Reset Your Password</h2>
        <p>You requested a password reset. Please click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b7280;">${resetUrl}</p>
        <hr style="border: 0; border-top: 1px solid #f0f0f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">This link will expire in 1 hour.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
