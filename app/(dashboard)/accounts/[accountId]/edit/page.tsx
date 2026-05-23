import { Navbar } from "@/components/navbar";
import { GetAccountById } from "@/lib/account";
import { EditAccountForm } from "@/components/accounts/edit-account-form";
import { notFound } from "next/navigation";

type Props = {
  params: {
    accountId: string;
  };
};

export default async function EditAccountPage({ params }: Props) {
  const account = await GetAccountById(params.accountId);

  if (!account) {
    notFound();
  }

  return (
    <>
      <Navbar
        title="Chỉnh sửa tài khoản"
        description={`Chỉnh sửa tài khoản "${account.name}"`}
      />
      <main className="flex-1 overflow-auto p-6">
        <EditAccountForm account={account} />
      </main>
    </>
  );
}
