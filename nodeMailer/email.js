import {
  VERIFICATION_EMAIL_TEMPLATE,
  SEND_WELCOME_EMAIL,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplate.js";
import { sendMail } from "./sendMail.js";

export const sendVerificationEmail = async (email, verificationToken, name) => {
  try {
    await sendMail({
      email: email,
      subject: "Verify your email",
      message: VERIFICATION_EMAIL_TEMPLATE.replace("{name}", name).replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.log(`Error sending verification email`, error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const currentYear = new Date().getFullYear();
  try {
    await sendMail({
      email: email,
      subject: "Verify your email",
      message: SEND_WELCOME_EMAIL.replace("{name}", name).replace(
        "{currentYear}",
        currentYear
      ),
    });

    console.log("Welcome email sent successfully");
  } catch (error) {
    console.log(`Error sending email`, error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (email, name, resetURL) => {
  try {
    await sendMail({
      email: email,
      subject: "Reset your password",
      message: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{name}", name).replace(
        "{resetURL}",
        resetURL
      ),
      category: "Password Reset",
    });
  } catch (error) {
    console.log(`Error sending password reset email`, error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email, name) => {
  try {
    await sendMail({
      email: email,
      subject: "Password Reset Successful",
      message: PASSWORD_RESET_SUCCESS_TEMPLATE.replace("{name}", name),
      category: "Password Reset",
    });

    console.log("Password reset email sent successfully", sendMail);
  } catch (error) {
    console.log(`Error sending passwor reset success email`, error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};
