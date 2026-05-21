import { responses } from "@/lib/api-response";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";
import { generateVerificationToken } from "@/lib/tokens";
import { RegisterSchema } from "@/types/auth";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    body.dob = new Date(body.dob);

    const validatedFields = RegisterSchema.safeParse(body);

    if (!validatedFields.success) {
      return responses.badRequest("Trường dữ liệu không hợp lệ", 406);
    }

    const {
      confirmPassword,
      city,
      district,
      ward,
      addressLine,
      schoolName,
      programName,
      gradeScore,
      email,
      idCardNumber,
      certificateImg,
      certificateType,
      degreeType,
      dob,
      gender,
      gradeType,
      name,
      password,
      phoneNumber,
    } = validatedFields.data;

    const exisitingAccountEmail = await db.account.findUnique({
      where: { email },
    });

    const exisitingAccountIdCard = await db.account.findUnique({
      where: { idCardNumber },
    });

    if (exisitingAccountEmail) {
      return responses.conflict("Email đã được sử dụng");
    }

    if (exisitingAccountIdCard) {
      return responses.conflict("Căn cước công dân đã được sử dụng");
    }

    if (password && confirmPassword && password !== confirmPassword) {
      return responses.badRequest("Mật khẩu không trùng khớp", 406);
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : "";
    const address = `${addressLine}, ${ward}, ${district}, ${city}`;

    const existingSchool = await db.school.findUnique({
      where: { name: schoolName },
    });

    if (!existingSchool) {
      return responses.notFound("Không tìm thấy trường học");
    }

    const existingProgram = await db.schoolProgram.findUnique({
      where: {
        schoolId_name: {
          schoolId: existingSchool.id,
          name: programName,
        },
      },
    });

    if (!existingProgram) {
      return responses.notFound("Không tìm thấy ngành đào tạo");
    }

    const account = await db.account.create({
      data: {
        address,
        email,
        dob,
        gender,
        idCardNumber,
        name,
        password: hashedPassword,
        phoneNumber,
        student: {
          create: {
            certificateImg: certificateImg ?? "",
            certificateType,
            degreeType,
            gradeScore: parseFloat(gradeScore),
            gradeType,
            schoolId: existingSchool.id,
            program: {
              create: {
                programId: existingProgram.id,
              },
            },
          },
        },
      },
      select: {
        id: true,
        image: true,
        name: true,
        email: true,
        emailVerified: true,
        isTwoFactorEnabled: true,
      },
    });

    const verificationToken = await generateVerificationToken(account.email);

    await sendVerificationEmail(
      account.name,
      process.env.NODE_SENDER_EMAIL || "noreply@example.com",
      verificationToken.email,
      verificationToken.token
    );

    return responses.created(
      { account },
      "Đăng ký thành công, vui lòng check hòm thư email để xác thực người dùng"
    );
  } catch (error) {
    console.error("[REGISTER ERROR]", error);

    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return responses.conflict("Căn cước công dân đã được sử dụng");
    }

    if (error instanceof SyntaxError) {
      return responses.badRequest("Định dạng JSON không hợp lệ");
    }

    return responses.serverError("Đăng ký thất bại");
  }
}
