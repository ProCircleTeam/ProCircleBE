const nodemailer = require("nodemailer");
const { emailQueue } = require("./utils/emailUtil");

// Setup Nodemailer transporter (use env variables in prod)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

console.log("<<<<<<<< Email worker is running >>>>>>>>> ");

emailQueue.process(10, async (job) => {
  try {
    console.log(`Attempt #${job.attemptsMade + 1} for ${job.name}`);
    const { to, subject, html } = job.data;

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      html,
    });

    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send to ${job.data.to}:`, err.message);
    throw error;
  }
});
