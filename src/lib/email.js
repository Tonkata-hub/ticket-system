import nodemailer from "nodemailer";

/**
 * Generate a 6-digit verification code
 * @returns {string} 6-digit code
 */
export function generateVerificationCode() {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send verification email (placeholder for testing)
 * @param {string} email - Recipient email
 * @param {string} code - Verification code
 * @returns {Promise<boolean>} Success status
 */
export async function sendVerificationEmail(email, code) {
	try {
		// For testing: just console.log the code
		console.log(`\n🔐 VERIFICATION CODE FOR ${email}: ${code}\n`);
		console.log(`📧 Email would be sent to: ${email}`);
		console.log(`⏰ Code expires in 15 minutes`);
		console.log(`\n`);

		// TODO: Implement actual email sending with nodemailer
		// const transporter = nodemailer.createTransporter({
		//     host: process.env.EMAIL_HOST,
		//     port: process.env.EMAIL_PORT,
		//     secure: false,
		//     auth: {
		//         user: process.env.EMAIL_USER,
		//         pass: process.env.EMAIL_PASSWORD,
		//     },
		// });

		// const mailOptions = {
		//     from: process.env.EMAIL_FROM,
		//     to: email,
		//     subject: 'Verify Your Email - Ticket System',
		//     html: `
		//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
		//             <h2 style="color: #3056d3;">Verify Your Email Address</h2>
		//             <p>Thank you for registering! Please use the following code to verify your email address:</p>
		//             <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
		//                 <h1 style="color: #3056d3; font-size: 32px; letter-spacing: 5px; margin: 0;">${code}</h1>
		//             </div>
		//             <p>This code will expire in 15 minutes.</p>
		//             <p>If you didn't create an account, please ignore this email.</p>
		//         </div>
		//     `,
		// };

		// await transporter.sendMail(mailOptions);

		return true;
	} catch (error) {
		console.error("Error sending verification email:", error);
		return false;
	}
}

/**
 * Send password reset email (placeholder for future use)
 * @param {string} email - Recipient email
 * @param {string} resetToken - Password reset token
 * @returns {Promise<boolean>} Success status
 */
export async function sendPasswordResetEmail(email, resetToken) {
	try {
		console.log(`\n🔑 PASSWORD RESET TOKEN FOR ${email}: ${resetToken}\n`);
		// TODO: Implement actual email sending
		return true;
	} catch (error) {
		console.error("Error sending password reset email:", error);
		return false;
	}
}
