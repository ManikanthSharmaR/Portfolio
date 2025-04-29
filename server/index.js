const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 9000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/send-mail", async (req, res) => {
    const { name, email, subject, message } = req.body;

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: "your_ethereal_user@ethereal.email",
            pass: "your_ethereal_password",
        },
    });

    let mailOptions = {
        from: `"Contact Form" <contact@yourdomain.com>`,
        to: "recipient@example.com",
        subject: subject || "New Contact Form Submission",
        text: `You have received a new message from your contact form:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        res.json({ success: true, message: "Mail sent successfully", info });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, error: error.toString() });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});