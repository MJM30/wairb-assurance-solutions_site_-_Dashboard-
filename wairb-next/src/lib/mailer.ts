import nodemailer from 'nodemailer';

export async function sendPaymentConfirmationEmail(
  clientEmail: string,
  clientName: string,
  typeAssurance: string
) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    console.warn("SMTP variables not fully defined in environment. Skipping email sending.");
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    } as any);

    await transporter.verify();

    const mailOptions = {
      from: SMTP_FROM,
      to: clientEmail,
      subject: `Confirmation de réception de votre paiement`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.5;">
          <p>Cher(e) Client(e) <strong>${clientName}</strong>,</p>
          <p>Nous vous confirmons la bonne réception de votre paiement relatif à votre contrat d'assurance.</p>
          <p>Votre règlement a été <strong>reçu et validé</strong> avec succès. Nous vous remercions pour votre confiance et votre diligence.</p>
          <p>Votre dossier est désormais à jour et votre couverture d'assurance est maintenue conformément aux conditions de votre contrat.</p>
          <p>Pour toute question ou information complémentaire, notre équipe reste à votre entière disposition.</p>
          <br/>
          <p>Cordialement,</p>
          <p><strong>Le Service Client</strong><br/><strong>WAIRB</strong></p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent successfully: %s to %s", info.messageId, clientEmail);
    return true;
  } catch (error) {
    console.error("Failed to send payment confirmation email:", error);
    return false;
  }
}
