import { responses } from "@/lib/api-response";
import { DataCountries } from "@/lib/country";

export async function GET() {
  try {
    const countries = DataCountries;
    return responses.ok(countries);
  } catch (error) {
    console.error("[GET COUNTRY ERROR]", error);
    return responses.serverError("Lấy thông tin địa chỉ thất bại");
  }
}
