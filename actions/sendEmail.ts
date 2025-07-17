"use server"

import nodemailer from "nodemailer";

export async function sendEmail(to: string, name: string, message: string, ctaLink?: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASS, // Use App Password instead of regular password
      },
    });

    const htmlTemplate = `
     <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation Email - Rent House INC</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      padding: 20px;
      margin: 0;
    }
    .email-container {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: #1877F2;
      color: white;
      text-align: center;
      padding: 20px;
      font-size: 18px;
      font-weight: bold;
      border-radius: 8px 8px 0 0;
      width: 100%;
    }
    .content {
      padding: 20px;
      font-size: 14px;
      color: #333;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: #1877F2;
      color: #fff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin-top: 20px;
      text-align: center;
    }
    .footer {
      background: #f4f4f4;
      text-align: center;
      padding: 15px;
      font-size: 14px;
      color: #777;
      border-radius: 0 0 8px 8px;
      width: 100%;
    }
    .footer a {
      color: #1877F2;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">Rent House INC - Confirmation</div>
    <div class="content">
      <p>Dear ${name},</p>
      <p>We are pleased to confirm receipt of your message with **Rent House INC**.</p>
      <p>Our team has received your inquiry and will get back to you as soon as possible. Your satisfaction is our priority, and we appreciate your patience.</p>
      <p>If you need urgent assistance, please do not hesitate to contact our support team.</p>
      <p><a href="mailto:support@rentcreeb.com" class="button">Contact Support</a></p>
    </div>
    <div class="footer">
      &copy; 2024 Rent House INC |  
      <a href="https://rentcreeb.com/unsubscribe?email=${to}">Unsubscribe</a>
    </div>
  </div>
</body>
</html>

`

    const mailOptions = {
      from: `"Rent House INC" <goodguys@rentcreeb.com>`,
      to,
      subject: `Dear ${name}, we've recieved your message.`,
      text: `Dear ${name},\n\n${message}\n\n${ctaLink ? `Take Action: ${ctaLink}` : ''}\n\nRegards,\nCompany Name`,
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, message: info.messageId };
  } catch (error: any) {
    console.error("Email sending failed:", error);
    return { success: false, message: error.message };
  }
}
