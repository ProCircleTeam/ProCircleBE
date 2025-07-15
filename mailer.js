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

emailQueue.on("active", (job) => {
  console.log(`🚚 Processing ${job.name}`);
});

emailQueue.on("completed", (job) => {
  console.log(`>>>>> Completed ${job.name}`);
});

emailQueue.on("failed", (job, err) => {
  console.error(`XXXXX Failed ${job.name}: ${err.message}`);
});

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
    console.error(`Failed to send to ${job.data.to}:`, error.message);
    throw error;
  }
});
