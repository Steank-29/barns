const transporter = require('../config/nodemailer');
const fs = require('fs');
const path = require('path');

exports.sendEmail = async (req, res) => {
  try {
    const { email1, email, subject, message } = req.body;

    // Validate input
    if (!email || !message) {
      return res.status(400).json({ error: 'Email and message are required' });
    }

    // Get current date
    const today = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Read and encode logo
    const logoPath = path.join(__dirname, '../assets/goldenbh_logo.png');

    const mailOptions = {
      from: email1,
      to: process.env.GMAIL_USER, // or your receiving email
      replyTo: email,
      subject: subject || 'New message from contact form',
      text: `
        From: ${email}

        ${message}
        
        Contact Information:
        Email: contact@yourdomain.com
        Phone: +123 456 7890
        WhatsApp: +123 456 7890
        
        Date: ${today}
        
        Thank you for contacting us! 😊
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 15px;
                }
                .logo {
                    height: 60px;
                    width: auto;
                    margin-right: 15px;
                }
                .title {
                    text-align: center;
                    color: #2c3e50;
                    font-size: 22px;
                    margin: 0;
                    flex-grow: 1;
                }
                .message {
                    background-color: #f9f9f9;
                    padding: 15px;
                    border-left: 4px solid #3498db;
                    margin: 20px 0;
                }
                .contact-info {
                    margin: 25px 0;
                    padding: 15px;
                    background-color: #f5f5f5;
                    border-radius: 5px;
                    font-size: 14px;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    font-style: italic;
                    color: #7f8c8d;
                    border-top: 1px solid #eee;
                    padding-top: 15px;
                }
                .info-item {
                    margin: 8px 0;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <img src="data:image/png;base64,${logoPath}" alt="Company Logo" class="logo">
                <h1 class="title">New Contact Message</h1>
            </div>
            
            <div class="message">
                <p><strong>From:</strong> ${email1}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
            
            <div class="contact-info">
                <h3 style="margin-top:0;">Our Contact Information</h3>
                <div class="info-item"><strong>📧 Email:</strong> contact@yourdomain.com</div>
                <div class="info-item"><strong>📞 Phone:</strong> +123 456 7890</div>
                <div class="info-item"><strong>💬 WhatsApp:</strong> +123 456 7890</div>
                <div class="info-item"><strong>📅 Date:</strong> ${today}</div>
            </div>
            
            <div class="footer">
                <p>Thank you for contacting us! We'll respond within 24 hours. 😊</p>
                <p><small>This is an automated message, please do not reply directly.</small></p>
            </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};