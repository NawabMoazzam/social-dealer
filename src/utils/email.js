import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === "465", // true for SSL, false for TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmailToBuyer = async (to, roomID, buyerPassword) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: "Room Access Details",
      html: `
      <h1>Room Access Details</h1>
      <p>Room ID: ${roomID}</p>
      <p>Buyer Password: ${buyerPassword}</p>
      <p>Please keep these details safe.</p>
      <p>Thank you for using our service!</p>
      <p>Best regards,</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendEmailToSeller = async (to, roomID, sellerPassword) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: "Room Access Details",
      html: `
      <h1>Room Access Details</h1>
      <p>Room ID: ${roomID}</p>
      <p>Seller Password: ${sellerPassword}</p>
      <p>Please keep these details safe.</p>
      <p>Thank you for using our service!</p>
      <p>Best regards,</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
