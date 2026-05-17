import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  EMAIL_FROM,
} = process.env;

let transporter;

const createTransporter = () => {
  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: SMTP_SECURE === "true",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  return nodemailer.createTransport({
    jsonTransport: true,
  });
};

export const getMailer = () => {
  if (!transporter) {
    transporter = createTransporter();
  }

  return transporter;
};

export const sendVerificationEmail = async ({ to, username, verifyUrl }) => {
  const mailer = getMailer();

  const info = await mailer.sendMail({
    from: EMAIL_FROM || SMTP_USER || "no-reply@secondhandstore.local",
    to,
    subject: "Verify your email address",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2 style="margin-bottom: 8px;">Verify your account</h2>
        <p>Hi ${username},</p>
        <p>Thanks for signing up. Please verify your email address to activate your account.</p>
        <p>
          <a
            href="${verifyUrl}"
            style="display:inline-block;padding:12px 20px;background:#0284c7;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;"
          >
            Verify email
          </a>
        </p>
        <p>If the button does not work, open this link:</p>
        <p>${verifyUrl}</p>
        <p>This link will expire in 24 hours.</p>
      </div>
    `,
  });

  if (!SMTP_HOST) {
    console.log("Email verification preview:", info.message?.toString?.() || info);
  }

  return info;
};
