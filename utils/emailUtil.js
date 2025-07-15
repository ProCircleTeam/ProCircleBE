const Queue = require("bull");

const emailQueue = new Queue("email", {
  redis: { host: "127.0.0.1", port: 6379 },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

const parseEmailJobs = (pairs) => {
  const jobs = [];

  for (const [userA, userB] of pairs) {
    // Email to userA about userB
    jobs.push({
      data: {
        to: userA.email,
        subject: `Your Accountability Partner: ${userB.name}`,
        html: `
          <p>Hi ${userA.name},</p>
          <p>Your partner ${userB.name} has the goal:</p>
          <blockquote>${userB.goal}</blockquote>
          <p>Wishing you both success!</p>
        `,
      },
    });

    // Email to userB about userA
    jobs.push({
      data: {
        to: userB.email,
        subject: `Your Accountability Partner: ${userA.name}`,
        html: `
          <p>Hi ${userB.name},</p>
          <p>Your partner ${userA.name} has the goal:</p>
          <blockquote>${userA.goal}</blockquote>
          <p>Stay focused and good luck!</p>
        `,
      },
    });
  }

  return jobs;
};

module.exports = { emailQueue, parseEmailJobs };
