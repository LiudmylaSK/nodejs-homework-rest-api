const { HttpError, ctrlWrapper, sendEmail } = require("../helpers");
const { User } = require("../models/users");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const gravatar = require("gravatar");
const path = require("path");

const fs = require("fs/promises");
const Jimp = require("jimp");
const crypto = require("node:crypto");

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = crypto.randomUUID();

  const verifyEmail = {
    to: email,
    subject: "Verify your email",
    html: `<h1>Verify your email</h1>
    <p>Please click the link below to confirm your email</p>
    <a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Verify</a>`,
    text: `Verify your email
    Please click the link below to confirm your email
   ${BASE_URL}/api/users/verify/${verificationToken}`,
  };

  await sendEmail(verifyEmail);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<h1>Verify your email</h1>
    <p>Please click the link below to confirm your email</p>
    <a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Verify</a>`,
    text: `Verify your email
    Please click the link below to confirm your email
   ${BASE_URL}/api/users/verify/${user.verificationToken}`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  if (!user.verify) {
    throw HttpError(401, "Email is not verified");
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    throw HttpError(401, "Email or password invalid!");
  }

  const { _id: id } = user;
  const payload = { id };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
  await User.findByIdAndUpdate(user._id, { token });

  res
    .status(200)
    .json({ token, user: { email, subscription: user.subscription } });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json({});
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};

const subscription = async (req, res) => {
  const { _id } = req.user;
  const userSubscription = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });
  if (!userSubscription) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(userSubscription);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  if (!req.file) {
    throw HttpError(400, "Avatar file not transferred");
  }

  const { path: tempUpload, originalname } = req.file;

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  const resizeFile = await Jimp.read(tempUpload);
  resizeFile.resize(250, 250).write(tempUpload);

  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  subscription: ctrlWrapper(subscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
