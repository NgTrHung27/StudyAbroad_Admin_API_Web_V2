import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Vui lòng nhập địa chỉ email hợp lệ",
  }),
  name: z.string().min(2, {
    message: "Tên phải có ít nhất 2 ký tự",
  }),
  password: z.string().min(6, {
    message: "Mật khẩu phải có ít nhất 6 ký tự",
  }),
  confirmPassword: z.string().min(6, {
    message: "Mật khẩu xác nhận phải có ít nhất 6 ký tự",
  }),
  idCardNumber: z.string().min(9, {
    message: "Căn cước công dân phải có ít nhất 9 ký tự",
  }),
  dob: z.date({
    required_error: "Vui lòng chọn ngày sinh",
  }),
  phoneNumber: z.string().min(10, {
    message: "Số điện thoại phải có ít nhất 10 số",
  }),
  addressLine: z.string().min(1, {
    message: "Vui lòng nhập địa chỉ",
  }),
  city: z.string().min(1, {
    message: "Vui lòng chọn tỉnh/thành phố",
  }),
  district: z.string().min(1, {
    message: "Vui lòng chọn quận/huyện",
  }),
  ward: z.string().min(1, {
    message: "Vui lòng chọn phường/xã",
  }),
  schoolName: z.string().min(1, {
    message: "Vui lòng chọn trường học",
  }),
  programName: z.string().min(1, {
    message: "Vui lòng chọn ngành đào tạo",
  }),
  gender: z.enum(["MALE", "FEMALE"], {
    required_error: "Vui lòng chọn giới tính",
  }),
  degreeType: z.enum(["HIGHSCHOOL", "UNIVERSITY"], {
    required_error: "Vui lòng chọn bậc đào tạo",
  }),
  gradeType: z.enum(["GPA", "CGPA"], {
    required_error: "Vui lòng chọn loại điểm",
  }),
  gradeScore: z.string().min(1, {
    message: "Vui lòng nhập điểm trung bình",
  }),
  certificateType: z.enum(["IELTS", "TOEFL"], {
    required_error: "Vui lòng chọn loại chứng chỉ",
  }),
  certificateImg: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Vui lòng nhập địa chỉ email hợp lệ",
  }),
  password: z.string().min(1, {
    message: "Vui lòng nhập mật khẩu",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Vui lòng nhập địa chỉ email hợp lệ",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Mật khẩu phải có ít nhất 6 ký tự",
  }),
  confirmPassword: z.string().min(6, {
    message: "Mật khẩu xác nhận phải có ít nhất 6 ký tự",
  }),
});

export const DeleteSchema = z.object({
  email: z.string().email({
    message: "Vui lòng nhập địa chỉ email hợp lệ",
  }),
  password: z.string().optional(),
});

export const FeedbackSchema = z.object({
  name: z.string().min(1, {
    message: "Vui lòng nhập tên",
  }),
  email: z.string().email({
    message: "Vui lòng nhập địa chỉ email hợp lệ",
  }),
  title: z.string().min(1, {
    message: "Vui lòng nhập tiêu đề",
  }),
  message: z.string().min(1, {
    message: "Vui lòng nhập nội dung",
  }),
  phone: z.string().optional(),
  image: z.string().optional(),
  url: z.string().optional(),
  schoolId: z.string().optional(),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type ResetSchemaType = z.infer<typeof ResetSchema>;
export type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>;
export type DeleteSchemaType = z.infer<typeof DeleteSchema>;
export type FeedbackSchemaType = z.infer<typeof FeedbackSchema>;
