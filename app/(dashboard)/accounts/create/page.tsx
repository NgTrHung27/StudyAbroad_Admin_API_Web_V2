import { Navbar } from "@/components/navbar";
import { AccountForm } from "@/components/accounts/account-form";

export default function CreateAccountPage() {
  return (
    <>
      <Navbar title="Thêm tài khoản" />
      <main className="flex-1 overflow-auto p-6">
        <AccountForm />
      </main>
    </>
  );
}
