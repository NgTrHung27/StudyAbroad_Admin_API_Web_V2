export const VerificationEmail = ({
  name,
  confirmationLink,
}: {
  name: string;
  confirmationLink: string;
}) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ color: "#333" }}>Xác thực Email</h1>
      <p>Xin chào {name},</p>
      <p>Cảm ơn bạn đã đăng ký. Vui lòng click vào link bên dưới để xác thực email của bạn:</p>
      <a
        href={confirmationLink}
        style={{
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          textDecoration: "none",
          borderRadius: "5px",
          margin: "20px 0",
        }}
      >
        Xác thực Email
      </a>
      <p>Link sẽ hết hạn sau 1 giờ.</p>
      <p>Nếu bạn không thực hiện đăng ký, vui lòng bỏ qua email này.</p>
      <p>Trân trọng,<br />Đội ngũ hỗ trợ</p>
    </div>
  );
};
