"use client";

import { useState } from "react";
import { Feedback, FeedbackType } from "@prisma/client";
import { format } from "date-fns";
import { vi } from "date-fns/locale/vi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreHorizontal,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Reply,
  Trash2,
  Filter,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Building2,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FeedbackWithSchool extends Feedback {
  school?: {
    id: string;
    name: string;
    logo: string;
    country: string;
  } | null;
  replies?: Array<{
    id: string;
    message: string;
    senderName: string;
    role: string;
    createdAt: Date;
  }>;
}

interface FeedbackTableProps {
  feedbacks: FeedbackWithSchool[];
}

const feedbackTypeConfig: Record<string, { label: string; className: string }> = {
  FEEDBACK: { label: "Phản hồi", className: "bg-blue-100 text-blue-800" },
  SYSTEM: { label: "Hệ thống", className: "bg-gray-100 text-gray-800" },
  REFUND: { label: "Hoàn tiền", className: "bg-orange-100 text-orange-800" },
  BILLING: { label: "Thanh toán", className: "bg-yellow-100 text-yellow-800" },
  SUBSCRIPTION: { label: "Đăng ký", className: "bg-purple-100 text-purple-800" },
  SCHOLARSHIP: { label: "Học bổng", className: "bg-green-100 text-green-800" },
  PROCEDURE: { label: "Thủ tục", className: "bg-indigo-100 text-indigo-800" },
  GENERAL: { label: "Chung", className: "bg-cyan-100 text-cyan-800" },
  QUESTION: { label: "Câu hỏi", className: "bg-teal-100 text-teal-800" },
};

export const FeedbackTable = ({ feedbacks }: FeedbackTableProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackWithSchool | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");

  const filteredFeedbacks = feedbacks.filter((item) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(searchLower) ||
      item.email.toLowerCase().includes(searchLower) ||
      item.title.toLowerCase().includes(searchLower) ||
      item.message.toLowerCase().includes(searchLower);

    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "resolved" && item.isResolved) ||
      (statusFilter === "pending" && !item.isResolved);

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredFeedbacks.length / pageSize);
  const paginatedFeedbacks = filteredFeedbacks.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleViewDetail = (item: FeedbackWithSchool) => {
    setSelectedFeedback(item);
    setShowDetailModal(true);
  };

  const handleReply = (item: FeedbackWithSchool) => {
    setSelectedFeedback(item);
    setReplyMessage("");
    setShowReplyModal(true);
  };

  const handleDelete = (item: FeedbackWithSchool) => {
    setSelectedFeedback(item);
    setShowDeleteConfirm(true);
  };

  const handleMarkResolved = (item: FeedbackWithSchool) => {
    setSelectedFeedback(item);
    setShowDetailModal(false);
    // Call API to mark as resolved
    console.log("Mark as resolved:", item.id);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm phản hồi..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="FEEDBACK">Phản hồi</SelectItem>
              <SelectItem value="QUESTION">Câu hỏi</SelectItem>
              <SelectItem value="REFUND">Hoàn tiền</SelectItem>
              <SelectItem value="SCHOLARSHIP">Học bổng</SelectItem>
              <SelectItem value="GENERAL">Chung</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="pending">Chưa xử lý</SelectItem>
              <SelectItem value="resolved">Đã xử lý</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white dark:bg-zinc-900">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Người gửi</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead className="w-[120px]">Loại</TableHead>
              <TableHead className="w-[100px]">Trạng thái</TableHead>
              <TableHead className="w-[150px]">Ngày gửi</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedFeedbacks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Không có dữ liệu phản hồi
                </TableCell>
              </TableRow>
            ) : (
              paginatedFeedbacks.map((item) => (
                <TableRow key={item.id} className={!item.isRead ? "bg-blue-50/50 dark:bg-blue-950/20" : ""}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="line-clamp-1 max-w-[250px]">{item.title}</p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={feedbackTypeConfig[item.type]?.className}
                    >
                      {feedbackTypeConfig[item.type]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.isResolved ? (
                      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Đã xử lý
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        <XCircle className="mr-1 h-3 w-3" />
                        Chưa xử lý
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">
                      {format(new Date(item.createdAt), "dd/MM/yyyy", { locale: vi })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(item.createdAt), "HH:mm", { locale: vi })}
                    </p>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewDetail(item)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReply(item)}>
                          <Reply className="mr-2 h-4 w-4" />
                          Trả lời
                        </DropdownMenuItem>
                        {!item.isResolved && (
                          <DropdownMenuItem onClick={() => handleMarkResolved(item)}>
                            <Check className="mr-2 h-4 w-4" />
                            Đánh dấu đã xử lý
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDelete(item)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị {(page - 1) * pageSize + 1} -{" "}
            {Math.min(page * pageSize, filteredFeedbacks.length)} trong{" "}
            {filteredFeedbacks.length} kết quả
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Trang {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết phản hồi</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết của phản hồi
            </DialogDescription>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className={feedbackTypeConfig[selectedFeedback.type]?.className}
                >
                  {feedbackTypeConfig[selectedFeedback.type]?.label}
                </Badge>
                {selectedFeedback.isResolved ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Đã xử lý
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <XCircle className="mr-1 h-3 w-3" />
                    Chưa xử lý
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Người gửi</p>
                  <p className="font-medium">{selectedFeedback.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {selectedFeedback.email}
                  </p>
                </div>
                {selectedFeedback.phone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Điện thoại</p>
                    <p className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {selectedFeedback.phone}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ngày gửi</p>
                  <p>
                    {format(new Date(selectedFeedback.createdAt), "dd/MM/yyyy HH:mm", {
                      locale: vi,
                    })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Tiêu đề</p>
                <p className="font-medium">{selectedFeedback.title}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Nội dung</p>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedFeedback.message}</p>
                </div>
              </div>

              {selectedFeedback.replies && selectedFeedback.replies.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Phản hồi ({selectedFeedback.replies.length})
                  </p>
                  <div className="space-y-2">
                    {selectedFeedback.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={`p-3 rounded-lg ${
                          reply.role === "ADMIN"
                            ? "bg-blue-50 dark:bg-blue-950/30 ml-4"
                            : "bg-muted mr-4"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium">{reply.senderName}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(reply.createdAt), "dd/MM/yyyy HH:mm", {
                              locale: vi,
                            })}
                          </p>
                        </div>
                        <p className="text-sm">{reply.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Đóng
            </Button>
            <Button onClick={() => handleReply(selectedFeedback!)}>
              <Reply className="mr-2 h-4 w-4" />
              Trả lời
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Modal */}
      <Dialog open={showReplyModal} onOpenChange={setShowReplyModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Trả lời phản hồi</DialogTitle>
            <DialogDescription>
              Gửi phản hồi đến {selectedFeedback?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">Tin nhắn:</p>
          <Textarea
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Nhập nội dung trả lời..."
            className="min-h-[120px]"
          />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReplyModal(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                console.log("Send reply:", replyMessage);
                setShowReplyModal(false);
              }}
              disabled={!replyMessage.trim()}
            >
              <Reply className="mr-2 h-4 w-4" />
              Gửi phản hồi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa phản hồi từ{" "}
              <strong>{selectedFeedback?.name}</strong>? Hành động này không thể hoàn
              tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={() => setShowDeleteConfirm(false)}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
