const transporter = require('../config/nodemailer');
const fs = require('fs');
const path = require('path');

exports.sendOrderEmail = async (req, res) => {
  try {
    const { customer, items, orderTotal } = req.body;

    // Validate input
    if (!customer || !items || !orderTotal) {
      return res.status(400).json({
        success: false,
        error: 'Customer info, items, and order total are required'
      });
    }

    // Get current date
    const today = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Define logo path
    const logoPath = path.join(__dirname, '../assets/goldenbh_logo.png');

    // Generate products HTML
    const productsHtml = items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.unitPrice.toFixed(2)}€</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.totalPrice.toFixed(2)}€</td>
      </tr>
    `).join('');

    // Admin Email
    const mailOptions = {
      from:  process.env.EMAIL_FROM ,
      to: process.env.EMAIL_FROM,
      replyTo: customer.email,
      subject: `Nouvelle commande de ${customer.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 700px;
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
                    color: #38598b;
                    font-size: 22px;
                    margin: 0;
                    flex-grow: 1;
                }
                .customer-info {
                    background-color: #f9f9f9;
                    padding: 15px;
                    border-left: 4px solid #38598b;
                    margin: 20px 0;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                th {
                    background-color: #38598b;
                    color: white;
                    padding: 10px;
                    text-align: left;
                }
                td {
                    padding: 8px;
                    border-bottom: 1px solid #eee;
                }
                .total {
                    text-align: right;
                    font-weight: bold;
                    font-size: 1.2em;
                    margin-top: 20px;
                    color: #38598b;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    font-style: italic;
                    color: #7f8c8d;
                    border-top: 1px solid #eee;
                    padding-top: 15px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <img src="cid:logo" alt="Company Logo" class="logo">
                <h1 class="title">Nouvelle Commande</h1>
            </div>
            
            <div class="customer-info">
                <h3 style="margin-top: 0;">Informations client</h3>
                <p><strong>Nom:</strong> ${customer.name}</p>
                <p><strong>Email:</strong> ${customer.email}</p>
                <p><strong>Téléphone/WhatsApp:</strong> ${customer.phone}</p>
                ${customer.notes ? `<p><strong>Message:</strong> ${customer.notes}</p>` : ''}
                <p><strong>Date:</strong> ${today}</p>
            </div>
            
            <h3>Détails de la commande</h3>
            <table>
                <thead>
                    <tr>
                        <th>Produit</th>
                        <th style="text-align: center;">Quantité</th>
                        <th style="text-align: right;">Prix unitaire</th>
                        <th style="text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${productsHtml}
                </tbody>
            </table>
            
            <div class="total">
                Total de la commande: ${orderTotal.toFixed(2)}€
            </div>
            
            <div class="footer">
                <p>Cette commande a été passée via le site web. Veuillez contacter le client pour confirmer.</p>
            </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: 'goldenbh_logo.png',
          path: logoPath,
          cid: 'logo'
        }
      ]
    };

    await transporter.sendMail(mailOptions);

    // Customer Email
    if (customer.email) {
      const customerMailOptions = {
        from: process.env.EMAIL_FROM || 'no-reply@yourdomain.com',
        to: customer.email,
        subject: 'Confirmation de votre commande',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
              <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { text-align: center; margin-bottom: 20px; }
                  .logo { height: 60px; width: auto; }
                  .thank-you { color: #38598b; font-size: 20px; text-align: center; margin: 20px 0; }
                  .order-summary { margin: 20px 0; }
                  .contact { margin-top: 30px; font-size: 14px; color: #666; }
              </style>
          </head>
          <body>
              <div class="header">
                  <img src="cid:logo" alt="Company Logo" class="logo">
              </div>
              
              <div class="thank-you">
                  Merci pour votre commande, ${customer.name} !
              </div>
              
              <p>Nous avons bien reçu votre commande et la traiterons dans les plus brefs délais.</p>
              
              <div class="order-summary">
                  <p><strong>Numéro de commande:</strong> ${Date.now()}</p>
                  <p><strong>Date:</strong> ${today}</p>
                  <p><strong>Total:</strong> ${orderTotal.toFixed(2)}€</p>
              </div>
              
              <p>Vous recevrez une confirmation supplémentaire lorsque votre commande sera expédiée.</p>
              
              <div class="contact">
                  <p>Pour toute question, contactez-nous à <a href="mailto:contact@yourdomain.com">contact@yourdomain.com</a> ou par WhatsApp au +123 456 7890.</p>
              </div>
          </body>
          </html>
        `,
        attachments: [
          {
            filename: 'goldenbh_logo.png',
            path: logoPath,
            cid: 'logo'
          }
        ]
      };

      await transporter.sendMail(customerMailOptions);
    }

    res.status(200).json({
      success: true,
      message: 'Order received and confirmation emails sent'
    });
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process order',
      details: error.message
    });
  }
};
