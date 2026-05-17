"use client";

import { useState } from "react";
import { News } from "@prisma/client";
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
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Filter,
  Calendar,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface NewsWithSchool extends News {
  school?: {
    id: string;
    name: string;
  } | null;
}

interface NewsTableProps {
  news: NewsWithSchool[];
}

const newsTypeConfig: Record<string, { label: string; className: string }> = {
  ANNOUNCEMENT: { label: "Thông báo", className: "bg-blue-100 text-blue-800" },
  EVENT: { label: "Sự kiện", className: "bg-purple-100 text-purple-800" },
  BLOG: { label: "Bài viết", className: "bg-green-100 text-green-800" },
};

export const NewsTable = ({ news }: NewsTableProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedNews, setSelectedNews] = useState<NewsWithSchool | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const filteredNews = news.filter((item) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(searchLower) ||
      item.content.toLowerCase().includes(searchLower);

    const matchesType = typeFilter === "all" || item.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredNews.length / pageSize);
  const paginatedNews = filteredNews.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleViewDetail = (item: NewsWithSchool) => {
    setSelectedNews(item);
    setShowDetailModal(true);
  };

  const handleDelete = (item: NewsWithSchool) => {
    setSelectedNews(item);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm tin tức..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Loại tin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="ANNOUNCEMENT">Thông báo</SelectItem>
              <SelectItem value="EVENT">Sự kiện</SelectItem>
              <SelectItem value="BLOG">Bài viết</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm tin tức
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white dark:bg-zinc-900">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px]">Hình ảnh</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead className="w-[120px]">Loại</TableHead>
              <TableHead className="w-[150px]">Trường</TableHead>
              <TableHead className="w-[120px]">Ngày tạo</TableHead>
              <TableHead className="w-[100px]">Trạng thái</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedNews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Không có dữ liệu tin tức
                </TableCell>
              </TableRow>
            ) : (
              paginatedNews.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                      {item.cover ? (
                        <Image
                          src={item.cover}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium line-clamp-2 max-w-[300px]">
                      {item.title}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={newsTypeConfig[item.type]?.className}
                    >
                      {newsTypeConfig[item.type]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      {item.school?.name ?? "CEMC"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {format(new Date(item.createdAt), "dd/MM/yyyy", { locale: vi })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.isPublished ? "default" : "secondary"}>
                      {item.isPublished ? "Đã đăng" : "Nháp"}
                    </Badge>
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
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
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
            {Math.min(page * pageSize, filteredNews.length)} trong{" "}
            {filteredNews.length} kết quả
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
            <DialogTitle>Chi tiết tin tức</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết của tin tức
            </DialogDescription>
          </DialogHeader>
          {selectedNews && (
            <div className="space-y-4">
              {selectedNews.cover && (
                <div className="relative h-48 w-full rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={selectedNews.cover}
                    alt={selectedNews.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{selectedNews.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Badge
                    variant="secondary"
                    className={newsTypeConfig[selectedNews.type]?.className}
                  >
                    {newsTypeConfig[selectedNews.type]?.label}
                  </Badge>
                  <span>
                    Ngày tạo:{" "}
                    {format(new Date(selectedNews.createdAt), "dd/MM/yyyy HH:mm", {
                      locale: vi,
                    })}
                  </span>
                  <Badge variant={selectedNews.isPublished ? "default" : "secondary"}>
                    {selectedNews.isPublished ? "Đã đăng" : "Nháp"}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  {selectedNews.school?.name ?? "CEMC"}
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Nội dung:</p>
                <div
                  className="text-sm whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedNews.content }}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Đóng
            </Button>
            <Button onClick={() => setShowDetailModal(false)}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
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
              Bạn có chắc chắn muốn xóa tin tức{" "}
              <strong>{selectedNews?.title}</strong>? Hành động này không thể hoàn
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
