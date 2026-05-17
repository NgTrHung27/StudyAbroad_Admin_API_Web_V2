export const ResetPasswordEmail = ({
  name,
  resetLink,
}: {
  name: string;
  resetLink: string;
}) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ color: "#333" }}>Khôi phục mật khẩu</h1>
      <p>Xin chào {name},</p>
      <p>Chúng tôi đã nhận được yêu cầu khôi phục mật khẩu cho tài khoản của bạn.</p>
      <p>Vui lòng click vào link bên dưới để đặt lại mật khẩu mới:</p>
      <a
        href={resetLink}
        style={{
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "white",
          textDecoration: "none",
          borderRadius: "5px",
          margin: "20px 0",
        }}
      >
        Đặt lại mật khẩu
      </a>
      <p>Link sẽ hết hạn sau 1 giờ.</p>
      <p>Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng bỏ qua email này.</p>
      <p>Trân trọng,<br />Đội ngũ hỗ trợ</p>
    </div>
  );
};
