const resendApiUrl = "https://api.resend.com";

const welcomeText = `Hi there,

Thank you for joining our newsletter!

We're excited to have you with us. You'll receive updates on our latest news, announcements, training opportunities, and other valuable information from us.

Stay connected by following our Facebook page:
https://www.facebook.com/TrainingForRealEstateExcellence

Thank you for being part of our community. We look forward to keeping you informed!

Best regards,
Training For Real Estate Excellence`;

const welcomeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Training For Real Estate Excellence</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #F9F9F7; font-family: Georgia, 'Times New Roman', Times, serif; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #F9F9F7; padding-bottom: 40px; }
    .main-table { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e1ded7; box-shadow: 0 4px 15px rgba(27, 67, 46, 0.05); }
    .header { background-color: #1B432E; padding: 45px 30px; text-align: center; border-bottom: 4px solid #B39255; }
    .header h1 { color: #F9F9F7; font-size: 24px; margin: 0; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
    .content { padding: 40px 30px; color: #1B432E; line-height: 1.7; font-size: 16px; }
    .content p { margin: 0 0 20px; }
    .button-container { text-align: center; margin: 35px 0; }
    .btn { background-color: #B39255; color: #ffffff !important; text-decoration: none; padding: 14px 30px; border-radius: 4px; font-weight: bold; display: inline-block; font-size: 15px; letter-spacing: 0.5px; box-shadow: 0 2px 5px rgba(179, 146, 85, 0.3); text-transform: uppercase; }
    .footer { background-color: #F9F9F7; padding: 30px; text-align: center; font-size: 12px; color: #5c6f64; border-top: 1px solid #e1ded7; }
    .footer a { color: #1B432E; text-decoration: underline; }
  </style>
</head>
<body>
  <center class="wrapper">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="height: 40px;"><tr><td>&nbsp;</td></tr></table>
    <table class="main-table" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td class="header"><h1>Training For Real Estate Excellence</h1></td></tr>
      <tr><td class="content">
        <p>Hi there,</p>
        <p><strong>Thank you for joining our newsletter!</strong></p>
        <p>We're excited to have you with us. You'll receive updates on our latest news, announcements, training opportunities, and other valuable insights designed to help you build a flourishing real estate career.</p>
        <p>Stay connected with our community and get real-time updates by following our official Facebook page:</p>
        <div class="button-container"><a href="https://www.facebook.com/TrainingForRealEstateExcellence" target="_blank" class="btn">Follow Us on Facebook</a></div>
        <p>Thank you for being part of our community. We look forward to keeping you informed and helping you grow!</p>
        <hr style="border: 0; border-top: 1px solid #e1ded7; margin: 30px 0 25px;">
        <p style="margin-bottom: 0;">Best regards,<br><strong style="color: #1B432E;">Training For Real Estate Excellence</strong></p>
      </td></tr>
      <tr><td class="footer">
        <p style="margin: 0 0 10px;">You are receiving this email because you signed up for our newsletter.</p>
        <p style="margin: 0;"><a href="#" style="color: #B39255; text-decoration: none; font-weight: bold;">Unsubscribe</a> | <a href="https://www.facebook.com/TrainingForRealEstateExcellence" style="color: #1B432E; text-decoration: none; font-weight: bold;">Visit Facebook Page</a></p>
      </td></tr>
    </table>
  </center>
</body>
</html>`;

export async function subscribeWithResend(email) {
  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  const from = (process.env.RESEND_FROM || "").trim();
  if (!apiKey || !from) throw new Error("Resend newsletter service is not configured yet.");

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "User-Agent": "TreeAcademy/1.0",
  };
  let contactResponse;
  try {
    contactResponse = await fetch(`${resendApiUrl}/contacts`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email, unsubscribed: false }),
    });
  } catch (error) {
    console.error("Resend /contacts fetch failed:", error);
    throw new Error("fetch failed");
  }
  if (!contactResponse.ok && contactResponse.status !== 409) throw await resendError(contactResponse, "add this email to contacts");

  let emailResponse;
  try {
    emailResponse = await fetch(`${resendApiUrl}/emails`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        from,
        to: [email],
        subject: "Welcome to Training For Real Estate Excellence",
        text: welcomeText,
        html: welcomeHtml,
      }),
    });
  } catch (error) {
    console.error("Resend /emails fetch failed:", error);
    throw new Error("fetch failed");
  }
  if (!emailResponse.ok) throw await resendError(emailResponse, "send the welcome email");
}

async function resendError(response, action) {
  const details = await response.json().catch(() => ({}));
  if (response.status === 401 && details.name === "restricted_api_key") {
    return new Error("The Resend API key must have Full Access to add newsletter contacts. Create a Full Access key in Resend and update RESEND_API_KEY.");
  }
  const reason = typeof details.message === "string" ? `: ${details.message}` : "";
  return new Error(`Resend could not ${action} (HTTP ${response.status})${reason}`);
}
