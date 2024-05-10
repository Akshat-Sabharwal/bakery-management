const nodemailer = require("nodemailer");

const sendEmail = () => {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "46a5a13d75977f",
      pass: "f53d603d008ffe",
    },
  });

  transporter.sendMail({
    from: "Akshat Sabharwal <akshatsabharwal35@gmail.com>",
    to: "someone@gmail.com",
    subject: "bs",
    message: "chal bsdk",
  });
};

sendEmail();
