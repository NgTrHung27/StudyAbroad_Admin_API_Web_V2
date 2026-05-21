import { NextResponse } from "next/server";

/**
 * Standard API Response Format
 * 
 * Format:
 * {
 *   "statusCode": 200,
 *   "message": "Success",
 *   "data": { ... }
 * }
 */

export type ApiResponse<T = any> = {
  statusCode: number;
  message: string;
  data?: T;
  errors?: any;
};

// Success response
export function success<T>(data: T, message = "Success", statusCode = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      statusCode,
      message,
      data,
    },
    { status: statusCode }
  );
}

// Error response
export function error(message: string, statusCode = 400, errors?: any): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      statusCode,
      message,
      errors,
    },
    { status: statusCode }
  );
}

// Common responses
export const responses = {
  // 200 - OK
  ok: <T>(data: T, message = "Thành công") => success(data, message, 200),
  
  // 201 - Created
  created: <T>(data: T, message = "Tạo thành công") => success(data, message, 201),
  
  // 204 - No Content
  noContent: () => NextResponse.json(null, { status: 204 }),
  
  // 400 - Bad Request
  badRequest: (message = "Yêu cầu không hợp lệ") => error(message, 400),
  
  // 401 - Unauthorized
  unauthorized: (message = "Không có quyền truy cập") => error(message, 401),
  
  // 403 - Forbidden
  forbidden: (message = "Tài khoản bị cấm") => error(message, 403),
  
  // 404 - Not Found
  notFound: (message = "Không tìm thấy") => error(message, 404),
  
  // 409 - Conflict
  conflict: (message = "Dữ liệu đã tồn tại") => error(message, 409),
  
  // 500 - Internal Server Error
  serverError: (message = "Lỗi server") => error(message, 500),
};
