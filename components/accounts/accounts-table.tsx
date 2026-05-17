"use client";

import { useState } from "react";
import { AccountLib } from "@/types/auth";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AccountsTableProps {
  accounts: AccountLib[];
}

const statusConfig: Record<string, { label: string; className: string }> = {
  AWAITING: { label: "Chờ duyệt", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
  STUDYING: { label: "Đang học", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  APPROVED: { label: "Đã duyệt", className: "bg-green-100 text-green-800 hover:bg-green-100" },
  DROPPED: { label: "Đã nghỉ", className: "bg-red-100 text-red-800 hover:bg-red-100" },
};

export const AccountsTable = ({ accounts }: AccountsTableProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAccount, setSelectedAccount] = useState<AccountLib | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const filteredAccounts = accounts.filter((account) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      account.name.toLowerCase().includes(searchLower) ||
      account.email.toLowerCase().includes(searchLower) ||
      account.student?.studentCode?.toLowerCase().includes(searchLower) ||
      account.phoneNumber.includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      account.student?.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAccounts.length / pageSize);
  const paginatedAccounts = filteredAccounts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleViewDetail = (account: AccountLib) => {
    setSelectedAccount(account);
    setShowDetailModal(true);
  };

  const handleDelete = (account: AccountLib) => {
    setSelectedAccount(account);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm tên, email, mã học sinh..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="AWAITING">Chờ duyệt</SelectItem>
              <SelectItem value="STUDYING">Đang học</SelectItem>
              <SelectItem value="APPROVED">Đã duyệt</SelectItem>
              <SelectItem value="DROPPED">Đã nghỉ</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm tài khoản
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white dark:bg-zinc-900">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[120px]">Mã HS</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>SĐT</TableHead>
              <TableHead>Ngày sinh</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAccounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Không có dữ liệu tài khoản
                </TableCell>
              </TableRow>
            ) : (
              paginatedAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">
                    {account.student?.studentCode ?? (
                      <span className="text-muted-foreground">Chưa có</span>
                    )}
                  </TableCell>
                  <TableCell>{account.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {account.email}
                  </TableCell>
                  <TableCell>{account.phoneNumber}</TableCell>
                  <TableCell>
                    {format(new Date(account.dob), "dd/MM/yyyy", { locale: vi })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        statusConfig[account.student?.status ?? "AWAITING"]?.className
                      }
                    >
                      {statusConfig[account.student?.status ?? "AWAITING"]?.label}
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
                        <DropdownMenuItem onClick={() => handleViewDetail(account)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDelete(account)}
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
            {Math.min(page * pageSize, filteredAccounts.length)} trong{" "}
            {filteredAccounts.length} kết quả
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chi tiết tài khoản</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết của tài khoản
            </DialogDescription>
          </DialogHeader>
          {selectedAccount && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Họ tên</p>
                  <p>{selectedAccount.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{selectedAccount.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">SĐT</p>
                  <p>{selectedAccount.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mã HS</p>
                  <p>{selectedAccount.student?.studentCode ?? "Chưa có"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ngày sinh</p>
                  <p>
                    {format(new Date(selectedAccount.dob), "dd/MM/yyyy", { locale: vi })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                  <Badge
                    variant="secondary"
                    className={
                      statusConfig[selectedAccount.student?.status ?? "AWAITING"]?.className
                    }
                  >
                    {statusConfig[selectedAccount.student?.status ?? "AWAITING"]?.label}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Địa chỉ</p>
                  <p>{selectedAccount.address}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">CCCD/CMND</p>
                  <p>{selectedAccount.idCardNumber}</p>
                </div>
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
              Bạn có chắc chắn muốn xóa tài khoản{" "}
              <strong>{selectedAccount?.name}</strong>? Hành động này không thể hoàn tác.
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
