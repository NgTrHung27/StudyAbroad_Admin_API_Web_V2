import { render } from "@react-email/render";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "gabayan170@gmail.com",
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export const sendVerificationEmail = async (
  name: string,
  senderEmail: string,
  email: string,
  token: string
) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_URL}/auth/new-verification?token=${token}`;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333;">Xác thực Email</h1>
      <p>Xin chào ${name},</p>
      <p>Cảm ơn bạn đã đăng ký. Vui lòng click vào link bên dưới để xác thực email của bạn:</p>
      <a href="${confirmLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Xác thực Email</a>
      <p>Link sẽ hết hạn sau 1 giờ.</p>
      <p>Nếu bạn không thực hiện đăng ký, vui lòng bỏ qua email này.</p>
      <p>Trân trọng,<br/>Đội ngũ hỗ trợ</p>
    </div>
  `;

  const options = {
    from: senderEmail,
    to: email,
    subject: "Xác thực email của bạn",
    html: emailHtml,
  };

  try {
    await transporter.sendMail(options);
  } catch (error) {
    console.log("Error sending verification email:", error);
  }
};

export const sendPasswordResetEmail = async (
  name: string,
  email: string,
  token: string
) => {
  const resetLink = `${process.env.NEXT_PUBLIC_URL}/auth/new-password?token=${token}`;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333;">Khôi phục mật khẩu</h1>
      <p>Xin chào ${name},</p>
      <p>Chúng tôi đã nhận được yêu cầu khôi phục mật khẩu cho tài khoản của bạn.</p>
      <p>Vui lòng click vào link bên dưới để đặt lại mật khẩu mới:</p>
      <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Đặt lại mật khẩu</a>
      <p>Link sẽ hết hạn sau 1 giờ.</p>
      <p>Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng bỏ qua email này.</p>
      <p>Trân trọng,<br/>Đội ngũ hỗ trợ</p>
    </div>
  `;

  const options = {
    from: process.env.EMAIL_USER || "gabayan170@gmail.com",
    to: email,
    subject: "Khôi phục mật khẩu",
    html: emailHtml,
  };

  try {
    await transporter.sendMail(options);
  } catch (error) {
    console.log("Error sending password reset email:", error);
  }
};

export const sendDeleteAccountEmail = async (
  name: string,
  email: string,
  token: string
) => {
  const deleteLink = `${process.env.NEXT_PUBLIC_URL}/auth/delete-account?token=${token}`;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333;">Xóa tài khoản</h1>
      <p>Xin chào ${name},</p>
      <p>Chúng tôi đã nhận được yêu cầu xóa tài khoản của bạn.</p>
      <p>Vui lòng click vào link bên dưới để xác nhận xóa tài khoản:</p>
      <a href="${deleteLink}" style="display: inline-block; padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Xóa tài khoản</a>
      <p>Link sẽ hết hạn sau 1 giờ.</p>
      <p>Nếu bạn không yêu cầu xóa tài khoản, vui lòng bỏ qua email này.</p>
      <p>Trân trọng,<br/>Đội ngũ hỗ trợ</p>
    </div>
  `;

  const options = {
    from: process.env.EMAIL_USER || "gabayan170@gmail.com",
    to: email,
    subject: "Xác nhận xóa tài khoản",
    html: emailHtml,
  };

  try {
    await transporter.sendMail(options);
  } catch (error) {
    console.log("Error sending delete account email:", error);
  }
};

export const sendWelcomeEmail = async (
  name: string,
  studentCode: string,
  email: string
) => {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333;">Chào mừng bạn!</h1>
      <p>Xin chào ${name},</p>
      <p>Chúc mừng bạn đã hoàn tất đăng ký thành công!</p>
      <p>Mã sinh viên của bạn là: <strong>${studentCode}</strong></p>
      <p>Bạn có thể đăng nhập vào hệ thống với email và mật khẩu đã đăng ký.</p>
      <p>Nếu cần hỗ trợ, vui lòng liên hệ với chúng tôi.</p>
      <p>Trân trọng,<br/>Đội ngũ hỗ trợ</p>
    </div>
  `;

  const options = {
    from: process.env.EMAIL_USER || "gabayan170@gmail.com",
    to: email,
    subject: "Chào mừng bạn đến với hệ thống",
    html: emailHtml,
  };

  try {
    await transporter.sendMail(options);
  } catch (error) {
    console.log("Error sending welcome email:", error);
  }
};
