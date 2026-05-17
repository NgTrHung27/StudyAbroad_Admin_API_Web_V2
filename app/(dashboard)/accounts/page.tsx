import { Navbar } from "@/components/navbar";
import { GetAccountLib } from "@/lib/account";
import { AccountLib } from "@/types/auth";
import { AccountsTable } from "@/components/accounts/accounts-table";

export default async function AccountsPage() {
  let accounts: AccountLib[] = [];

  try {
    const result = await GetAccountLib();
    accounts = result ?? [];
  } catch (error) {
    console.error("Error fetching accounts:", error);
  }

  return (
    <>
      <Navbar title="Quản lý tài khoản" />
      <main className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-main dark:text-main-foreground">
              Quản lý tài khoản
            </h1>
            <p className="text-muted-foreground">
              Quản lý danh sách tài khoản học sinh và tài khoản người dùng
            </p>
          </div>
          <AccountsTable accounts={accounts} />
        </div>
      </main>
    </>
  );
}
