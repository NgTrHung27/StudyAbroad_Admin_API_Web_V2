"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Loader2, CheckCircle, XCircle, Trash2, Mail } from "lucide-react";
import Link from "next/link";

const DeleteAccountContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Mode determines whether we are requesting a delete link (request) or verifying one (confirm)
  const [mode, setMode] = useState<"request" | "confirm">(token ? "confirm" : "request");

  // State for Request Mode
  const [email, setEmail] = useState("");
  const [requestStatus, setRequestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [requestMessage, setRequestMessage] = useState("");

  // State for Confirm Mode
  const [confirmStatus, setConfirmStatus] = useState<"loading" | "success" | "error">("loading");
  const [confirmMessage, setConfirmMessage] = useState("Đang xác nhận xóa tài khoản...");

  // Confirm token effect
  useEffect(() => {
    if (!token) return;

    const confirmDeletion = async () => {
      try {
        const response = await fetch("/api/auth/delete/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setConfirmStatus("success");
          setConfirmMessage(data.message || "Tài khoản của bạn đã được xóa thành công khỏi hệ thống.");
        } else {
          setConfirmStatus("error");
          setConfirmMessage(data.error || "Không thể thực hiện xóa tài khoản. Mã xác thực đã hết hạn hoặc không tồn tại.");
        }
      } catch (error) {
        setConfirmStatus("error");
        setConfirmMessage("Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.");
      }
    };

    confirmDeletion();
  }, [token]);

  // Request deletion handler
  const handleRequestDeletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setRequestStatus("loading");
    setRequestMessage("");

    try {
      const response = await fetch("/api/auth/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setRequestStatus("success");
        setRequestMessage("Yêu cầu thành công! Chúng tôi đã gửi một email chứa liên kết xác nhận xóa tài khoản đến hộp thư của bạn. Vui lòng kiểm tra email.");
      } else {
        setRequestStatus("error");
        setRequestMessage(data.error || "Yêu cầu xóa tài khoản thất bại. Email không tồn tại hoặc có lỗi xảy ra.");
      }
    } catch (error) {
      setRequestStatus("error");
      setRequestMessage("Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.");
    }
  };

  if (mode === "confirm") {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-white/80 backdrop-blur-md dark:bg-zinc-900/80 rounded-3xl shadow-2xl max-w-md w-full border border-white/50 dark:border-zinc-800 transition-all duration-300">
        <h1 className="text-3xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500 dark:from-red-400 dark:to-orange-300">
          Xóa Tài Khoản
        </h1>

        <div className="flex items-center justify-center w-full mb-8">
          {confirmStatus === "loading" && <Loader2 className="h-20 w-20 animate-spin text-red-500 drop-shadow-md" />}
          {confirmStatus === "success" && <CheckCircle className="h-20 w-20 text-emerald-500 drop-shadow-md" />}
          {confirmStatus === "error" && <XCircle className="h-20 w-20 text-red-500 drop-shadow-md" />}
        </div>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-10 px-4 text-base font-medium leading-relaxed">
          {confirmMessage}
        </p>

        {confirmStatus !== "loading" && (
          <Link
            href="/"
            className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 w-full text-center"
          >
            Quay lại trang chủ
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-10 bg-white/80 backdrop-blur-md dark:bg-zinc-900/80 rounded-3xl shadow-2xl max-w-md w-full border border-white/50 dark:border-zinc-800 transition-all duration-300">
      <div className="bg-red-100 dark:bg-red-950/50 p-4 rounded-full mb-6">
        <Trash2 className="h-10 w-10 text-red-600 dark:text-red-400" />
      </div>

      <h1 className="text-3xl font-extrabold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500 dark:from-red-400 dark:to-orange-300">
        Xóa Tài Khoản
      </h1>

      {requestStatus === "success" ? (
        <div className="text-center">
          <div className="flex items-center justify-center w-full mb-6">
            <CheckCircle className="h-16 w-16 text-emerald-500 drop-shadow-md" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-8 px-2 text-base font-medium leading-relaxed">
            {requestMessage}
          </p>
          <Link
            href="/"
            className="px-8 py-3.5 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-850 hover:to-gray-950 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 w-full inline-block text-center"
          >
            Quay lại trang chủ
          </Link>
        </div>
      ) : (
        <form onSubmit={handleRequestDeletion} className="w-full">
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8 text-sm px-2">
            Nhập email tài khoản của bạn. Chúng tôi sẽ gửi một liên kết xác nhận xóa tài khoản đến email này để xác thực quyền sở hữu.
          </p>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
              <Mail className="h-5 w-5" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email của bạn"
              disabled={requestStatus === "loading"}
              className="pl-11 pr-4 py-3.5 w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-550 focus:border-transparent transition-all duration-200"
            />
          </div>

          {requestStatus === "error" && (
            <div className="flex items-start gap-2.5 p-3.5 mb-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
              <XCircle className="h-5 w-5 shrink-0 text-red-500" />
              <span>{requestMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={requestStatus === "loading"}
            className="flex items-center justify-center gap-2 px-8 py-3.5 w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 disabled:from-red-400 disabled:to-orange-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:transform-none transition-all duration-200"
          >
            {requestStatus === "loading" ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Gửi yêu cầu xóa"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

const DeleteAccountPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900 p-6">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center p-10 bg-white/80 backdrop-blur-md dark:bg-zinc-900/80 rounded-3xl shadow-2xl max-w-md w-full border border-white/50 dark:border-zinc-800">
            <Loader2 className="h-20 w-20 animate-spin text-red-500 drop-shadow-md" />
            <p className="mt-8 text-gray-600 dark:text-gray-300 font-medium text-lg">Đang tải...</p>
          </div>
        }
      >
        <DeleteAccountContent />
      </Suspense>

      <div className="mt-8 max-w-md w-full bg-white/70 backdrop-blur-md dark:bg-zinc-900/70 p-6 rounded-2xl border border-white/50 dark:border-zinc-800 shadow-lg text-xs text-gray-500 dark:text-gray-400 space-y-3">
        <h2 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
          Chính sách Xóa tài khoản & Dữ liệu - Ứng dụng Multinational Study Abroad
        </h2>
        <p>
          Trang web này được cung cấp bởi nhà phát triển <strong>CEMC LTD.CO</strong> dành riêng cho người dùng ứng dụng di động <strong>Multinational Study Abroad</strong> để yêu cầu xóa tài khoản và dữ liệu liên quan theo chính sách bảo mật của Google Play Store.
        </p>
        <div>
          <span className="font-medium text-gray-600 dark:text-gray-300">Các bước yêu cầu xóa:</span>
          <ol className="list-decimal list-inside mt-1 ml-1 space-y-1">
            <li>Nhập địa chỉ email đã dùng để đăng ký tài khoản của bạn vào biểu mẫu trên.</li>
            <li>Bấm nút <strong>"Gửi yêu cầu xóa"</strong>. Hệ thống sẽ gửi một email xác thực đến địa chỉ của bạn.</li>
            <li>Mở email từ hệ thống và bấm vào nút <strong>"Xóa tài khoản"</strong> trong vòng 1 giờ để xác nhận việc xóa.</li>
          </ol>
        </div>
        <div>
          <span className="font-medium text-gray-600 dark:text-gray-300">Loại dữ liệu sẽ bị xóa vĩnh viễn:</span>
          <p className="mt-0.5">
            Thông tin tài khoản cá nhân (tên, email, số điện thoại, mật khẩu, ngày sinh, địa chỉ, ảnh đại diện, số CMND/CCCD), và hồ sơ học sinh liên quan (điểm số, loại chứng chỉ học tập, trường học đăng ký).
          </p>
        </div>
        <div>
          <span className="font-medium text-gray-600 dark:text-gray-300">Lưu giữ dữ liệu:</span>
          <p className="mt-0.5">
            Mọi dữ liệu của bạn sẽ bị xóa ngay lập tức khi bạn xác thực yêu cầu qua email. Một số dữ liệu giao dịch hoặc logs lịch sử liên quan đến hệ thống có thể được lưu trữ ẩn danh tối đa 30 ngày để phục vụ yêu cầu kiểm toán và bảo mật hệ thống trước khi bị xóa bỏ hoàn toàn.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountPage;
