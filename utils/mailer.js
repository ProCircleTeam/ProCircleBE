const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	// Service: 'gmail',
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
	tls: {
		rejectUnauthorized: false,
	},
	family: 4,
});

/**
 * Send email using nodemailer
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text body
 * @param {string} options.html - HTML body (optional)
 */
const sendMail = async ({to, subject, text, html}) => {
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to,
		subject,
		text,
		html,
	};

	return transporter.sendMail(mailOptions);
};

module.exports = {sendMail};
