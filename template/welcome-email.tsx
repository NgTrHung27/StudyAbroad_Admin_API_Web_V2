export const WelcomeEmail = ({
  name,
  studentCode,
}: {
  name: string;
  studentCode: string;
}) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ color: "#333" }}>Chào mừng bạn!</h1>
      <p>Xin chào {name},</p>
      <p>Chúc mừng bạn đã hoàn tất đăng ký thành công!</p>
      <p>Mã sinh viên của bạn là: <strong>{studentCode}</strong></p>
      <p>Bạn có thể đăng nhập vào hệ thống với email và mật khẩu đã đăng ký.</p>
      <p>Nếu cần hỗ trợ, vui lòng liên hệ với chúng tôi.</p>
      <p>Trân trọng,<br />Đội ngũ hỗ trợ</p>
    </div>
  );
};
