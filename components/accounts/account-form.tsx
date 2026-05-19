"use client";

import { createAccount } from "@/action/account";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { StudentStatus } from "@prisma/client";

const accountFormSchema = z.object({
  email: z.string().email({ message: "Vui lòng nhập email hợp lệ" }),
  name: z.string().min(2, { message: "Tên phải có ít nhất 2 ký tự" }),
  phoneNumber: z.string().min(10, { message: "Số điện thoại phải có ít nhất 10 số" }),
  dob: z.string().min(1, { message: "Vui lòng chọn ngày sinh" }),
  address: z.string().min(1, { message: "Vui lòng nhập địa chỉ" }),
  idCardNumber: z.string().min(9, { message: "CCCD phải có ít nhất 9 ký tự" }),
  studentCode: z.string().optional(),
  status: z.nativeEnum(StudentStatus, {
    required_error: "Vui lòng chọn trạng thái",
  }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export const AccountForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      name: "",
      phoneNumber: "",
      dob: "",
      address: "",
      idCardNumber: "",
      studentCode: "",
      status: StudentStatus.AWAITING,
    },
  });

  const onSubmit = async (data: AccountFormValues) => {
    setIsLoading(true);

    try {
      const result = await createAccount({
        email: data.email,
        name: data.name,
        phoneNumber: data.phoneNumber,
        dob: new Date(data.dob),
        address: data.address,
        idCardNumber: data.idCardNumber,
        studentCode: data.studentCode,
        status: data.status,
      });

      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
        router.push("/accounts");
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("Đã xảy ra lỗi khi tạo tài khoản");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Tạo tài khoản mới</h2>
          <p className="text-muted-foreground">Điền thông tin để tạo tài khoản mới</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ tên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày sinh</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idCardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CCCD/CMND</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số CCCD/CMND" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="studentCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã học sinh (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập mã học sinh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={StudentStatus.AWAITING}>Chờ duyệt</SelectItem>
                      <SelectItem value={StudentStatus.APPROVED}>Đã duyệt</SelectItem>
                      <SelectItem value={StudentStatus.STUDYING}>Đang học</SelectItem>
                      <SelectItem value={StudentStatus.DROPPED}>Đã nghỉ</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Địa chỉ</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập địa chỉ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-main dark:bg-main-component text-white"
            >
              {isLoading ? "Đang xử lý..." : "Tạo tài khoản"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
