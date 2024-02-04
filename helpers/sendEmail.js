const nodemailer = require("nodemailer");
require("dotenv").config();

const { META_UA_FROM, META_UA_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: META_UA_FROM,
    pass: META_UA_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = (data) => {
  const email = { ...data, from: META_UA_FROM };
  return transporter.sendMail(email);
};

module.exports = sendEmail;
