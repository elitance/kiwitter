import nodemailer = require('nodemailer');
import fs = require('fs');

const profile: any = JSON.parse(fs.readFileSync('./profile.json', 'utf-8'));
const transporter: nodemailer.Transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: profile.email.address,
        pass: profile.email.password
    }
});

export = {
    verify: (to: string, id: number): void => {
        transporter.sendMail({
            from: profile.email.address,
            to,
            subject: 'Verification Code for Your Kiwitter Account',
            html: `
            <div style="font-family: Google Sans !important">
                <h1>Welcome to Kiwitter!</h1>
                <p style="font-size: 16px; font-family: Roboto !important">
                    We are very proud to have a great user like you!
                    Only one step left for your account: verification.
                    Please verify your account by clicking button below.
                </p>
                <a href="http://localhost/account/verify?type=email&id=${id}" style="margin-top: 30px; font-weight: 500; font-family: Google Sans !important; font-size: 18px; color: white; background: #1da1f2; border-radius: 25px; height: 50px; width: 150px; display: flex; align-items: center; justify-content: center; text-decoration: none;">Verify</a>
            </div>
            `,
            text: 'Welcome to Kiwitter!'
        });
    }
}