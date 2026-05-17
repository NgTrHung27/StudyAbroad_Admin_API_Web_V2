import { Navbar } from "@/components/navbar";
import { BotMessageSquare } from "lucide-react";

export default function ChatbotPage() {
  return (
    <>
      <Navbar title="Trợ lý ảo" />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
          <div className="bg-muted/50 rounded-full p-6 mb-6">
            <BotMessageSquare className="h-16 w-16 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-main dark:text-main-foreground mb-2">
            Trợ lý ảo AI
          </h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Trợ lý ảo đang được phát triển. Tính năng chatbot AI sẽ giúp bạn trả lời 
            các câu hỏi liên quan đến du học và dịch vụ của CEMC.
          </p>
          <div className="text-sm text-muted-foreground">
            <p>Liên hệ: Services@mecltd.edu.vn</p>
            <p>Điện thoại: 0984122837</p>
          </div>
        </div>
      </main>
    </>
  );
}
