const nodemailer = require("nodemailer")

const sendMail = async (email, userName) => {
    const contactTemplate = `
    <div>
        
            <p style="margin-bottom: 100px;">
                Dear ${userName}, welcome to Persy Grow Investment Limited. Thank you so much for registering to be a member of our wonderful website. We hope you enjoy our website to the fullest. 
            </p>
        
        <p style="color:#2036ea ; text-align: center;"><i>The PGI Team.</i></p>
    </div>`;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL,
            pass: process.env.PASS,
        },
    });

    const mailOptions = {
        from: process.env.Gmail,
        to: email,
        subject: "PGI —— THrift Successfully Created",
        text: "PGI",
        html: contactTemplate,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = {sendMail}
