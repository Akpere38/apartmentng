import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP connection failed:', error);
  } else {
    console.log('✅ SMTP server is ready to send emails');
  }
});

// Generate verification token
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send verification email
export const sendVerificationEmail = async (email, name, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/agent/verify-email/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify Your Email - ApartmentNG',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0d9488 0%, #134e4a 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: #f8f9fa; padding: 40px 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #0d9488; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .button:hover { background: #0f766e; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 ApartmentNG</h1>
          </div>
          <div class="content">
            <h2>Welcome, ${name}! 👋</h2>
            <p>Thank you for registering as an agent on ApartmentNG. Please verify your email address to unlock all features.</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Or copy and paste this link into your browser:<br>
              <code style="background: #e5e7eb; padding: 8px; display: inline-block; margin-top: 8px; border-radius: 4px;">${verificationUrl}</code>
            </p>
            
            <div class="warning">
              <strong>⏰ Note:</strong> This verification link will expire in 24 hours.
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              If you didn't register for ApartmentNG, please ignore this email.
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ApartmentNG. All rights reserved.</p>
            <p>Premium Short-Let Apartments in Nigeria</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to ApartmentNG, ${name}!
      
      Please verify your email address by clicking the link below:
      ${verificationUrl}
      
      This link will expire in 24 hours.
      
      If you didn't register for ApartmentNG, please ignore this email.
      
      © ${new Date().getFullYear()} ApartmentNG
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send email change verification
export const sendEmailChangeVerification = async (newEmail, name, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/agent/verify-new-email/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: newEmail,
    subject: 'Confirm Your New Email - ApartmentNG',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0d9488 0%, #134e4a 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .content { background: #f8f9fa; padding: 40px 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #0d9488; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .button:hover { background: #0f766e; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 ApartmentNG</h1>
          </div>
          <div class="content">
            <h2>Verify Your New Email, ${name}</h2>
            <p>You requested to change your email address on ApartmentNG. Please verify this new email address to complete the change.</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify New Email</a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Or copy and paste this link into your browser:<br>
              <code style="background: #e5e7eb; padding: 8px; display: inline-block; margin-top: 8px; border-radius: 4px;">${verificationUrl}</code>
            </p>
            
            <div class="warning">
              <strong>⏰ Note:</strong> This verification link will expire in 24 hours.
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              If you didn't request this email change, please contact support immediately.
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ApartmentNG. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Verify Your New Email, ${name}
      
      You requested to change your email address on ApartmentNG.
      Please verify this new email by clicking the link below:
      ${verificationUrl}
      
      This link will expire in 24 hours.
      
      If you didn't request this change, please contact support immediately.
      
      © ${new Date().getFullYear()} ApartmentNG
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email change verification sent to ${newEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending email change verification:', error);
    throw new Error('Failed to send verification email');
  }
};

export default transporter;