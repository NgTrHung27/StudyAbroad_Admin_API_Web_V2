"use client";

import { useEdgeStore } from "@/lib/edgestore";
import { createNews } from "@/action/news";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ChevronLeft, Image as ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { NewsType } from "@prisma/client";

const newsFormSchema = z.object({
  title: z.string().min(1, { message: "Vui lòng nhập tiêu đề" }),
  content: z.string().min(1, { message: "Vui lòng nhập nội dung" }),
  cover: z.string().optional(),
  type: z.nativeEnum(NewsType, {
    required_error: "Vui lòng chọn loại tin tức",
  }),
  isPublished: z.boolean().default(false),
});

type NewsFormValues = z.infer<typeof newsFormSchema>;

export const NewsForm = () => {
  const router = useRouter();
  const { edgestore } = useEdgeStore();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      content: "",
      cover: "",
      type: NewsType.ANNOUNCEMENT,
      isPublished: false,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    form.setValue("cover", "");
  };

  const uploadImage = async () => {
    if (!file) return null;

    try {
      const res = await edgestore.publicFiles.upload({ file });
      return res.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Lỗi khi tải lên hình ảnh");
      return null;
    }
  };

  const onSubmit = async (data: NewsFormValues, publish: boolean) => {
    setIsLoading(true);

    try {
      let coverUrl = data.cover;
      if (file) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          coverUrl = uploadedUrl;
        }
      }

      const result = await createNews({
        title: data.title,
        content: data.content,
        cover: coverUrl || "",
        isPublished: publish,
        type: data.type,
      });

      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
        router.push("/news");
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating news:", error);
      toast.error("Đã xảy ra lỗi khi tạo tin tức");
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
          <h2 className="text-2xl font-bold">Tạo tin tức mới</h2>
          <p className="text-muted-foreground">Điền thông tin để tạo tin tức mới</p>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiêu đề</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tiêu đề tin tức" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại tin tức</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại tin tức" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={NewsType.ANNOUNCEMENT}>Thông báo</SelectItem>
                    <SelectItem value={NewsType.EVENT}>Sự kiện</SelectItem>
                    <SelectItem value={NewsType.BLOG}>Bài viết</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Ảnh đại diện</FormLabel>
            {preview ? (
              <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={removeFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="cover-upload"
                />
                <label
                  htmlFor="cover-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  <span className="text-muted-foreground">Nhấn để chọn ảnh</span>
                </label>
              </div>
            )}
          </div>

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nội dung</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập nội dung tin tức"
                    className="min-h-[200px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={form.handleSubmit((data) => onSubmit(data, false))}
              disabled={isLoading}
            >
              Lưu nháp
            </Button>
            <Button
              type="button"
              onClick={form.handleSubmit((data) => onSubmit(data, true))}
              disabled={isLoading}
              className="bg-main dark:bg-main-component text-white"
            >
              {isLoading ? "Đang xử lý..." : "Đăng tin tức"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
