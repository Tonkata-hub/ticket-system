import nodemailer from "nodemailer";

/**
 * Generate a 6-digit verification code
 * @returns {string} 6-digit code
 */
export function generateVerificationCode() {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send verification email using SMTP
 * @param {string} email - Recipient email
 * @param {string} code - Verification code
 * @returns {Promise<boolean>} Success status
 */
export async function sendVerificationEmail(email, code) {
	try {
		// Check if email configuration is available
		if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
			console.log(`\n🔐 VERIFICATION CODE FOR ${email}: ${code}\n`);
			console.log(`📧 Email configuration missing - check your .env.local file`);
			console.log(`⏰ Code expires in 15 minutes`);
			console.log(`\n`);
			return true; // Still return true so registration doesn't fail
		}

		// Create transporter with SMTP configuration
		const transporter = nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: parseInt(process.env.EMAIL_PORT) || 587,
			secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD,
			},
		});

		// Email content
		const mailOptions = {
			from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
			to: email,
			subject: "Verify Your Email - IT Support Ticket System",
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
					<div style="background-color: #3056d3; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
						<h1 style="margin: 0; font-size: 24px;">IT Support Ticket System</h1>
					</div>
					<div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e9ecef;">
						<h2 style="color: #3056d3; margin-top: 0;">Verify Your Email Address</h2>
						<p style="font-size: 16px; line-height: 1.5; color: #333;">Thank you for registering with our IT Support Ticket System! To complete your registration, please use the verification code below:</p>
						
						<div style="background-color: #ffffff; padding: 25px; text-align: center; margin: 25px 0; border: 2px solid #3056d3; border-radius: 8px;">
							<h1 style="color: #3056d3; font-size: 36px; letter-spacing: 8px; margin: 0; font-weight: bold;">${code}</h1>
						</div>
						
						<p style="font-size: 14px; color: #666; margin-bottom: 20px;">
							<strong>Important:</strong> This code will expire in 15 minutes for security reasons.
						</p>
						
						<div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 20px 0;">
							<p style="margin: 0; font-size: 14px; color: #856404;">
								<strong>Security Notice:</strong> If you didn't create an account with our system, please ignore this email. No further action is required.
							</p>
						</div>
						
						<p style="font-size: 14px; color: #666; margin-top: 25px;">
							Need help? Contact us at <a href="mailto:support@itsupport77.com" style="color: #3056d3;">support@itsupport77.com</a>
						</p>
					</div>
				</div>
			`,
		};

		// Send email
		await transporter.sendMail(mailOptions);
		console.log(`✅ Verification email sent successfully to ${email}`);
		return true;
	} catch (error) {
		console.error("Error sending verification email:", error);
		// Fallback to console log if email fails
		console.log(`\n🔐 VERIFICATION CODE FOR ${email}: ${code}\n`);
		console.log(`📧 Email sending failed - using fallback method`);
		console.log(`⏰ Code expires in 15 minutes`);
		console.log(`\n`);
		return true; // Still return true so registration doesn't fail
	}
}

/**
 * Send password reset email using SMTP
 * @param {string} email - Recipient email
 * @param {string} resetToken - Password reset token
 * @returns {Promise<boolean>} Success status
 */
export async function sendPasswordResetEmail(email, resetToken) {
	try {
		// Check if email configuration is available
		if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
			console.log(`\n🔑 PASSWORD RESET TOKEN FOR ${email}: ${resetToken}\n`);
			console.log(`📧 Email configuration missing - check your .env.local file`);
			return true;
		}

		// Create transporter with SMTP configuration
		const transporter = nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: parseInt(process.env.EMAIL_PORT) || 587,
			secure: process.env.EMAIL_SECURE === "true",
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD,
			},
		});

		// Email content
		const mailOptions = {
			from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
			to: email,
			subject: "Password Reset - IT Support Ticket System",
			html: `
				<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
					<div style="background-color: #3056d3; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
						<h1 style="margin: 0; font-size: 24px;">IT Support Ticket System</h1>
					</div>
					<div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e9ecef;">
						<h2 style="color: #3056d3; margin-top: 0;">Password Reset Request</h2>
						<p style="font-size: 16px; line-height: 1.5; color: #333;">You requested a password reset for your account. Click the button below to reset your password:</p>
						
						<div style="text-align: center; margin: 30px 0;">
							<a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}" 
							   style="background-color: #3056d3; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
								Reset Password
							</a>
						</div>
						
						<p style="font-size: 14px; color: #666; margin-bottom: 20px;">
							<strong>Important:</strong> This link will expire in 1 hour for security reasons.
						</p>
						
						<div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 20px 0;">
							<p style="margin: 0; font-size: 14px; color: #856404;">
								<strong>Security Notice:</strong> If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
							</p>
						</div>
						
						<p style="font-size: 14px; color: #666; margin-top: 25px;">
							Need help? Contact us at <a href="mailto:support@itsupport77.com" style="color: #3056d3;">support@itsupport77.com</a>
						</p>
					</div>
				</div>
			`,
		};

		// Send email
		await transporter.sendMail(mailOptions);
		console.log(`✅ Password reset email sent successfully to ${email}`);
		return true;
	} catch (error) {
		console.error("Error sending password reset email:", error);
		// Fallback to console log if email fails
		console.log(`\n🔑 PASSWORD RESET TOKEN FOR ${email}: ${resetToken}\n`);
		console.log(`📧 Email sending failed - using fallback method`);
		return true;
	}
}
