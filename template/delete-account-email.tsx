export const DeleteAccountEmail = ({
  name,
  deleteLink,
}: {
  name: string;
  deleteLink: string;
}) => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ color: "#333" }}>Xóa tài khoản</h1>
      <p>Xin chào {name},</p>
      <p>Chúng tôi đã nhận được yêu cầu xóa tài khoản của bạn.</p>
      <p>Vui lòng click vào link bên dưới để xác nhận xóa tài khoản:</p>
      <a
        href={deleteLink}
        style={{
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: "#dc3545",
          color: "white",
          textDecoration: "none",
          borderRadius: "5px",
          margin: "20px 0",
        }}
      >
        Xóa tài khoản
      </a>
      <p>Link sẽ hết hạn sau 1 giờ.</p>
      <p>Nếu bạn không yêu cầu xóa tài khoản, vui lòng bỏ qua email này.</p>
      <p>Trân trọng,<br />Đội ngũ hỗ trợ</p>
    </div>
  );
};
