"use client";

import { useState } from "react";
import { SchoolCard } from "@/data/schools";
import { format } from "date-fns";
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
  Globe,
  MapPin,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Country } from "@prisma/client";

interface SchoolsTableProps {
  schools: SchoolCard[];
}

const countryConfig: Record<string, { label: string; flag: string }> = {
  CANADA: { label: "Canada", flag: "🇨🇦" },
  KOREA: { label: "Korea", flag: "🇰🇷" },
  AUSTRALIA: { label: "Australia", flag: "🇦🇺" },
};

export const SchoolsTable = ({ schools }: SchoolsTableProps) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSchool, setSelectedSchool] = useState<SchoolCard | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const filteredSchools = schools.filter((school) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      school.name.toLowerCase().includes(searchLower) ||
      school.short?.toLowerCase().includes(searchLower) ||
      school.country.toLowerCase().includes(searchLower);

    const matchesCountry = countryFilter === "all" || school.country === countryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && school.isPublished) ||
      (statusFilter === "unpublished" && !school.isPublished);

    return matchesSearch && matchesCountry && matchesStatus;
  });

  const totalPages = Math.ceil(filteredSchools.length / pageSize);
  const paginatedSchools = filteredSchools.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleViewDetail = (school: SchoolCard) => {
    setSelectedSchool(school);
    setShowDetailModal(true);
  };

  const handleDelete = (school: SchoolCard) => {
    setSelectedSchool(school);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm trường học..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <Globe className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Quốc gia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="CANADA">Canada</SelectItem>
              <SelectItem value="KOREA">Korea</SelectItem>
              <SelectItem value="AUSTRALIA">Australia</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="published">Đã đăng</SelectItem>
              <SelectItem value="unpublished">Nháp</SelectItem>
            </SelectContent>
          </Select>
          <Link href="/schools/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm trường
            </Button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white dark:bg-zinc-900">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[80px]">Logo</TableHead>
              <TableHead>Tên trường</TableHead>
              <TableHead className="w-[120px]">Mã</TableHead>
              <TableHead className="w-[120px]">Quốc gia</TableHead>
              <TableHead className="w-[100px]">Trạng thái</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSchools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Không có dữ liệu trường học
                </TableCell>
              </TableRow>
            ) : (
              paginatedSchools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                      {school.logo ? (
                        <Image
                          src={school.logo}
                          alt={school.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <SchoolIcon />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/schools/${school.id}`}
                      className="font-medium hover:underline"
                    >
                      {school.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{school.short ?? school.country}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>{countryConfig[school.country]?.flag}</span>
                      <span>{countryConfig[school.country]?.label}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={school.isPublished ? "default" : "secondary"}>
                      {school.isPublished ? "Đã đăng" : "Nháp"}
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
                        <DropdownMenuItem asChild>
                          <Link href={`/schools/${school.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/schools/${school.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDelete(school)}
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
            {Math.min(page * pageSize, filteredSchools.length)} trong{" "}
            {filteredSchools.length} trường học
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
            <DialogTitle>Chi tiết trường học</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết của trường học
            </DialogDescription>
          </DialogHeader>
          {selectedSchool && (
            <div className="space-y-4">
              <div className="relative h-40 w-full rounded-lg overflow-hidden bg-muted">
                {selectedSchool.background ? (
                  <Image
                    src={selectedSchool.background}
                    alt={selectedSchool.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <SchoolIcon className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted -mt-12 border-4 border-background">
                  {selectedSchool.logo ? (
                    <Image
                      src={selectedSchool.logo}
                      alt={selectedSchool.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <SchoolIcon />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedSchool.name}</h3>
                  <Badge variant="outline">{selectedSchool.short ?? selectedSchool.country}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Quốc gia</p>
                  <p className="flex items-center gap-1">
                    <span>{countryConfig[selectedSchool.country]?.flag}</span>
                    <span>{countryConfig[selectedSchool.country]?.label}</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                  <Badge variant={selectedSchool.isPublished ? "default" : "secondary"}>
                    {selectedSchool.isPublished ? "Đã đăng" : "Nháp"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
              Đóng
            </Button>
            <Button asChild>
              <Link href={`/schools/${selectedSchool?.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </Link>
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
              Bạn có chắc chắn muốn xóa trường{" "}
              <strong>{selectedSchool?.name}</strong>? Hành động này không thể hoàn
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

function SchoolIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
