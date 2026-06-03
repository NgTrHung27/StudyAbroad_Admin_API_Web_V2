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
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-lg max-w-md w-full border border-gray-100 dark:border-zinc-800">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        Xác thực Email
      </h1>
      
      <div className="flex items-center justify-center w-full mb-6">
        {status === "loading" && <Loader2 className="h-16 w-16 animate-spin text-blue-500" />}
        {status === "success" && <CheckCircle className="h-16 w-16 text-emerald-500" />}
        {status === "error" && <XCircle className="h-16 w-16 text-red-500" />}
      </div>

      <p className="text-center text-gray-600 dark:text-gray-300 mb-8 px-4 text-sm">
        {message}
      </p>

      {status !== "loading" && (
        <Link 
          href="/" 
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors w-full text-center"
        >
          Quay lại trang chủ
        </Link>
      )}
    </div>
  );
};

const NewVerificationPage = () => {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-lg max-w-md w-full border border-gray-100 dark:border-zinc-800">
        <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
        <p className="mt-6 text-gray-600 dark:text-gray-300">Đang tải...</p>
      </div>
    }>
      <NewVerificationContent />
    </Suspense>
  );
};

export default NewVerificationPage;
