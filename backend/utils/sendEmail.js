const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Check Gmail connection
    await transporter.verify();

    const mailOptions = {
      from: `"ShopNest Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 25px;
            border: 1px solid #ddd;
            border-radius: 10px;
          "
        >
          ${message}
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("=================================");
    console.log("EMAIL SENT SUCCESSFULLY");
    console.log("To:", email);
    console.log("Message ID:", info.messageId);
    console.log("=================================");

    return true;
  } catch (error) {
    console.error("=================================");
    console.error("EMAIL ERROR:", error.message);
    console.error("=================================");

    return false;
  }
};

module.exports = sendEmail;