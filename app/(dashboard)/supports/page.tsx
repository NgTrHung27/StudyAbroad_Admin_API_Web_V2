import { Navbar } from "@/components/navbar";
import { GetAllFeedback } from "@/lib/feedback";
import { FeedbackTable } from "@/components/feedbacks/feedback-table";
import { Feedback } from "@prisma/client";

export default async function SupportsPage() {
  let feedbacks: (Feedback & {
    school: { id: string; name: string; logo: string; country: string } | null;
  })[] = [];

  try {
    const result = await GetAllFeedback();
    feedbacks = result ?? [];
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
  }

  return (
    <>
      <Navbar title="Hỗ trợ người dùng" />
      <main className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-main dark:text-main-foreground">
              Hỗ trợ người dùng
            </h1>
            <p className="text-muted-foreground">
              Quản lý các phản hồi và hỗ trợ từ người dùng
            </p>
          </div>
          <FeedbackTable feedbacks={feedbacks} />
        </div>
      </main>
    </>
  );
}
