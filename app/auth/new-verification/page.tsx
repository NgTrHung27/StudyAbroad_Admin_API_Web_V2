"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

const NewVerificationContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("Đang xác thực...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Vui lòng cung cấp mã xác thực trong đường dẫn (token).");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch("/api/auth/new-verification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Xác thực email thành công. Bạn có thể đóng trang này hoặc quay về trang chủ.");
        } else {
          setStatus("error");
          setMessage(data.error || "Xác thực email thất bại. Mã có thể đã hết hạn hoặc không hợp lệ.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Đã xảy ra lỗi trong quá trình xác thực email. Vui lòng thử lại sau.");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center p-10 bg-white/80 backdrop-blur-md dark:bg-zinc-900/80 rounded-3xl shadow-2xl max-w-md w-full border border-white/50 dark:border-zinc-800 transition-all duration-300">
      <h1 className="text-3xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
        Xác thực Email
      </h1>
      
      <div className="flex items-center justify-center w-full mb-8">
        {status === "loading" && <Loader2 className="h-20 w-20 animate-spin text-blue-500 drop-shadow-md" />}
        {status === "success" && <CheckCircle className="h-20 w-20 text-emerald-500 drop-shadow-md" />}
        {status === "error" && <XCircle className="h-20 w-20 text-red-500 drop-shadow-md" />}
      </div>

      <p className="text-center text-gray-600 dark:text-gray-300 mb-10 px-4 text-base font-medium leading-relaxed">
        {message}
      </p>

      {status !== "loading" && (
        <Link 
          href="/" 
          className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 w-full text-center"
        >
          Quay lại trang chủ
        </Link>
      )}
    </div>
  );
};

const NewVerificationPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900 p-6">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center p-10 bg-white/80 backdrop-blur-md dark:bg-zinc-900/80 rounded-3xl shadow-2xl max-w-md w-full border border-white/50 dark:border-zinc-800">
          <Loader2 className="h-20 w-20 animate-spin text-blue-500 drop-shadow-md" />
          <p className="mt-8 text-gray-600 dark:text-gray-300 font-medium text-lg">Đang tải...</p>
        </div>
      }>
        <NewVerificationContent />
      </Suspense>
    </div>
  );
};

export default NewVerificationPage;
