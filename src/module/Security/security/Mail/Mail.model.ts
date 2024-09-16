import nodemailer from 'nodemailer';
class Mail {
    constructor() {
    }
    Tohtml(code: string): string {
        const valiny: string = `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Authy 2 Facteur Verification</title>
        </head>
        
        <body>
            <div
                style="display: flex;align-items:center;justify-content: center; background-color: aliceblue;height: 100vh;padding: 12px;">
                <div
                    style="padding: 12px;width: 400px;height: min-content; background-color: white;border-radius: 7px;font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;">
                    <div style="display: flex;align-items:center;justify-content: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" height="100" width="100"
                    viewBox="0 0 640 512"><!--!Font Awesome Free 6.5.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.-->
                    <path fill="#8679be"
                        d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0l57.4-43c23.9-59.8 79.7-103.3 146.3-109.8l13.9-10.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176V384c0 35.3 28.7 64 64 64H360.2C335.1 417.6 320 378.5 320 336c0-5.6 .3-11.1 .8-16.6l-26.4 19.8zM640 336a144 144 0 1 0 -288 0 144 144 0 1 0 288 0zm-76.7-43.3c6.2 6.2 6.2 16.4 0 22.6l-72 72c-6.2 6.2-16.4 6.2-22.6 0l-40-40c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L480 353.4l60.7-60.7c6.2-6.2 16.4-6.2 22.6 0z" />
                </svg>
                    </div>
                    <div>
                        <h3>Authy One time verification:</h3>
                    </div>
                    <div style="font-size:small;">
                        <p>Hello, this code only works in the following minutes, in case the code is invalid, please resend a
                            new one. </p>
                    </div>
                    <div>
                        <p>your verification code:</p>
                        <div
                            style="background-color: ghostwhite;height:min-content;width:min-content;display: flex;align-items:center;justify-content: center;padding: 5px;;">
                            <div>${code}</div><button style="margin-left:3px;">copy</button>
                        </div>
                    </div>
                    <br>
                    <div style="font-size:small;">
                        If you did not request this verification, please ignore this email. Also, ensure that your password is
                        secure and that you have not shared your account with anyone.
                    </div>
                    <p style="font-size:small;">Thank you for trusting <a href="#">Authy.</a></p>
                    <p style="font-size:small;">Best regards,</p>
                    <p style="font-size:small;">The <a href="#">youngdev</a> Team.</p>
                </div>
            </div>
        </body>
        
        </html>
   `;

        return valiny;
    }
    tohtmlForgot(link: string, name: string): string {
        const response = `
        <!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vérification par code</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }

    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .email-header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 1px solid #dddddd;
      border-radius: 8px 8px 0 0;
    }

    .email-header h1 {
      margin: 0;
      font-size: 24px;
      color: #333333;
    }

    .email-body {
      padding: 20px 0;
      text-align: center;
    }

    .email-body p {
      margin: 0 0 10px;
      font-size: 16px;
      color: #555555;
    }

    .email-body .code {
      display: inline-block;
      margin: 20px 0;
      padding: 10px 20px;
      font-size: 24px;
      font-weight: bold;
      color: #ffffff;
      background-color: #1d4ed8;
      border-radius: 5px;
      text-decoration: none;
    }

    .email-footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #dddddd;
    }

    .email-footer p {
      margin: 0;
      font-size: 14px;
      color: #999999;
    }
  </style>
</head>

<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Reset password link</h1>
    </div>
    <div class="email-body">
      <p>Hi ${name},</p>
      <p>We hope this message finds you well. To complete the process, please follow the provided link.:</p>
      <a href="${link}">${link}</a>
    </div>
    <div class="email-footer">
      <p>Best regards,</p>
      <p>your helpful assistant from Authy</p>
    </div>
  </div>
</body>
</html>
        `
        return response;

    }
    async sendEmailCode(to: string, code: string) {
        await this.sendEmailnodemailer("Code de confirmation", to, this.Tohtml(code));
    }
    async sendEmailForgotPass(to: string, link: string, name: string) {
        await this.sendEmailnodemailer("Link to recover your Authy account password", to, this.tohtmlForgot(link, name));
    }
    async sendEmailnodemailer(subject: string, to: string, html: string) {
        const mymail = 'contact@youngdev.mg';
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: mymail,
                pass: 'gardhvbskefiaaua',
            },
        });

        const mailOptions = {
            from: mymail,
            to: 'mofogasy70@gmail.com',
            subject: subject,
            html: html,
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            //console.log('E-mail envoyé : ' + info.response);
        } catch (error) {
            console.error(error);
        }
    }

}

export default Mail;





