import { Navbar } from "@/components/navbar";

export default function CreateAccountPage() {
  return (
    <>
      <Navbar title="Thêm tài khoản" />
      <main className="py-20 px-10 text-main dark:text-main-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Thêm tài khoản</h1>
          <p className="text-muted-foreground mt-2">
            Trang thêm tài khoản đang được phát triển
          </p>
        </div>
      </main>
    </>
  );
}
