import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export const metadata = {
  title: "Đăng ký | CEMC Co,. Ltd",
  description: "Tạo tài khoản mới",
};

const SignUpPage = () => {
  return (
    <>
      <Image fill alt="background" src={"/login.jpg"} className="blur-sm" />
      <div className="flex h-full w-full items-center justify-center">
        <SignUp fallbackRedirectUrl={"/"} />
      </div>
    </>
  );
};

export default SignUpPage;
