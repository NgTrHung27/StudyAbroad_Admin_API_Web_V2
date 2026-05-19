// Seed script for production database
// IMPORTANT: Must use @prisma/client NOT from lib/db.ts to avoid extension issues
import { PrismaClient, Gender, DegreeType, CertificateType, GradeType, StudentStatus, ProfileStatus, PostStatus, SocialType, NewsType, Country, FeedbackType, FeedbackReplyRole, ChatSessionRole } from "@prisma/client";
import bcrypt from "bcryptjs";

// Override DATABASE_URL BEFORE PrismaClient is instantiated
const dbUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
process.env.DATABASE_URL = dbUrl;

console.log("Database URL (first 50 chars):", dbUrl?.substring(0, 50));

// Create PrismaClient directly - no global reuse, no extensions
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});

async function main() {
  console.log("Starting comprehensive seed for all 52 tables...\n");
  console.log("Database URL:", process.env.DATABASE_URL?.substring(0, 30) + "...");

  // ============================================================
  // PHASE 1: Core Tables (no dependencies)
  // ============================================================

  // 1. Account
  console.log("[1/52] Creating Accounts...");
  const hashedPassword = await bcrypt.hash("Test123456", 12);

  const account1 = await prisma.account.create({
    data: {
      email: "admin@cemc.com",
      password: hashedPassword,
      name: "Admin CEMC",
      dob: new Date("1990-01-15"),
      gender: Gender.MALE,
      phoneNumber: "0909123456",
      idCardNumber: "123456789012",
      address: "123 Admin Street, District 1, Ho Chi Minh City",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
      isLocked: false,
      isTwoFactorEnabled: false,
    },
  });

  const account2 = await prisma.account.create({
    data: {
      email: "student1@test.com",
      password: hashedPassword,
      name: "Nguyen Van A",
      dob: new Date("2005-06-20"),
      gender: Gender.MALE,
      phoneNumber: "0909123457",
      idCardNumber: "123456789013",
      address: "456 Student Ave, District 3, Ho Chi Minh City",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      isLocked: false,
      isTwoFactorEnabled: false,
    },
  });

  const account3 = await prisma.account.create({
    data: {
      email: "student2@test.com",
      password: hashedPassword,
      name: "Tran Thi B",
      dob: new Date("2006-03-10"),
      gender: Gender.FEMALE,
      phoneNumber: "0909123458",
      idCardNumber: "123456789014",
      address: "789 Student Blvd, District 5, Ho Chi Minh City",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
      isLocked: false,
      isTwoFactorEnabled: false,
    },
  });

  const account4 = await prisma.account.create({
    data: {
      email: "student3@test.com",
      password: hashedPassword,
      name: "Le Van C",
      dob: new Date("2005-09-25"),
      gender: Gender.MALE,
      phoneNumber: "0909123459",
      idCardNumber: "123456789015",
      address: "321 Student Rd, District 7, Ho Chi Minh City",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
      isLocked: false,
      isTwoFactorEnabled: false,
    },
  });

  const account5 = await prisma.account.create({
    data: {
      email: "student4@test.com",
      password: hashedPassword,
      name: "Pham Thi D",
      dob: new Date("2006-01-05"),
      gender: Gender.FEMALE,
      phoneNumber: "0909123460",
      idCardNumber: "123456789016",
      address: "654 Student Lane, District 2, Ho Chi Minh City",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      isLocked: false,
      isTwoFactorEnabled: false,
    },
  });

  console.log(`  Created 5 accounts: ${account1.email}, ${account2.email}, ${account3.email}, ${account4.email}, ${account5.email}`);

  // 2. VerificationToken
  console.log("[2/52] Creating VerificationTokens...");
  await prisma.verificationToken.create({
    data: {
      email: "student1@test.com",
      token: "test_verification_token_123",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
  console.log(`  Created 1 verification token`);

  // 3. PasswordResetToken
  console.log("[3/52] Creating PasswordResetTokens...");
  await prisma.passwordResetToken.create({
    data: {
      email: "student1@test.com",
      token: "test_reset_token_456",
      expires: new Date(Date.now() + 60 * 60 * 1000),
    },
  });
  console.log(`  Created 1 password reset token`);

  // 4. DeleteAccountToken
  console.log("[4/52] Creating DeleteAccountTokens...");
  await prisma.deleteAccountToken.create({
    data: {
      email: "student1@test.com",
      token: "test_delete_token_789",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
  console.log(`  Created 1 delete account token`);

  // 5. TwoFactorToken
  console.log("[5/52] Creating TwoFactorTokens...");
  await prisma.twoFactorToken.create({
    data: {
      email: "admin@cemc.com",
      token: "test_2fa_token_101",
      expires: new Date(Date.now() + 10 * 60 * 1000),
    },
  });
  console.log(`  Created 1 two-factor token`);

  // 6. TwoFactorConfirmation
  console.log("[6/52] Creating TwoFactorConfirmations...");
  await prisma.twoFactorConfirmation.create({
    data: {
      accountId: account1.id,
    },
  });
  console.log(`  Created 1 two-factor confirmation`);

  // 7. NotificationToken
  console.log("[7/52] Creating NotificationTokens...");
  await prisma.notificationToken.create({
    data: {
      userId: account2.id,
      token: "fcm_test_token_device_1",
    },
  });
  await prisma.notificationToken.create({
    data: {
      userId: account3.id,
      token: "fcm_test_token_device_2",
    },
  });
  console.log(`  Created 2 notification tokens`);

  // 8. NotificationPush
  console.log("[8/52] Creating NotificationPush...");
  await prisma.notificationPush.create({
    data: {
      title: "Chào mừng đến với CEMC",
      body: "Tài khoản của bạn đã được tạo thành công!",
      type: "WELCOME",
      senderName: "CEMC Admin",
      isRead: false,
      receiverId: account2.id,
    },
  });
  await prisma.notificationPush.create({
    data: {
      title: "Tin tức mới",
      body: "Có tin tức mới về học bổng du học Canada 2026",
      type: "NEWS",
      senderName: "CEMC Admin",
      isRead: true,
      receiverId: account3.id,
    },
  });
  console.log(`  Created 2 push notifications`);

  // 9. Area
  console.log("[9/52] Creating Areas...");
  await prisma.area.createMany({
    data: [
      { title: "Computer Science" },
      { title: "Business Administration" },
      { title: "Engineering" },
      { title: "Arts & Design" },
      { title: "Medicine" },
      { title: "Law" },
      { title: "Education" },
      { title: "Hospitality & Tourism" },
    ],
  });
  console.log(`  Created 8 areas`);

  // ============================================================
  // PHASE 2: School Tables
  // ============================================================

  // 10. School
  console.log("[10/52] Creating Schools...");
  const school1 = await prisma.school.create({
    data: {
      name: "Canada International School",
      logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200",
      background: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
      short: "CIS",
      description: "Canada International School - A premier institution for international education in Vietnam.",
      history: "Founded in 2010, CIS has been providing quality international education for over 15 years.",
      color: "#E74C3C",
      isPublished: true,
      country: Country.CANADA,
    },
  });

  const school2 = await prisma.school.create({
    data: {
      name: "Korea Global University",
      logo: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=200",
      background: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800",
      short: "KGU",
      description: "Leading Korean university for international students with world-class facilities.",
      history: "Established in 1995, KGU has produced thousands of successful graduates worldwide.",
      color: "#3498DB",
      isPublished: true,
      country: Country.KOREA,
    },
  });

  const school3 = await prisma.school.create({
    data: {
      name: "Australia University Vietnam",
      logo: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200",
      background: "https://images.unsplash.com/photo-1529156069896-49953e39b3ac?w=800",
      short: "AUV",
      description: "Bringing Australian education standards to Vietnam with globally recognized degrees.",
      history: "Founded in 2015 as a partnership between Australian and Vietnamese education authorities.",
      color: "#2ECC71",
      isPublished: true,
      country: Country.AUSTRALIA,
    },
  });
  console.log(`  Created 3 schools: ${school1.name}, ${school2.name}, ${school3.name}`);

  // 11. SchoolLocation
  console.log("[11/52] Creating SchoolLocations...");
  const loc1 = await prisma.schoolLocation.create({
    data: {
      schoolId: school1.id,
      name: "Main Campus",
      address: "123 University Ave, District 1, Ho Chi Minh City",
      cover: "https://images.unsplash.com/photo-1562774053-701939374585?w=400",
      description: "Main campus with modern facilities",
      isMain: true,
    },
  });

  const loc2 = await prisma.schoolLocation.create({
    data: {
      schoolId: school1.id,
      name: "Branch Campus",
      address: "456 Education St, District 3, Ho Chi Minh City",
      cover: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400",
      description: "Secondary campus for additional programs",
      isMain: false,
    },
  });

  const loc3 = await prisma.schoolLocation.create({
    data: {
      schoolId: school2.id,
      name: "Seoul Campus",
      address: "789 Korea Ave, Seoul, South Korea",
      cover: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=400",
      description: "Main campus in Seoul",
      isMain: true,
    },
  });

  const loc4 = await prisma.schoolLocation.create({
    data: {
      schoolId: school3.id,
      name: "Sydney Campus",
      address: "321 Australia Rd, Sydney, Australia",
      cover: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400",
      description: "Main campus in Sydney",
      isMain: true,
    },
  });
  console.log(`  Created 4 school locations`);

  // 12. SchoolLocationImage
  console.log("[12/52] Creating SchoolLocationImages...");
  await prisma.schoolLocationImage.createMany({
    data: [
      { locationId: loc1.id, url: "https://images.unsplash.com/photo-1562774053-701939374585?w=800" },
      { locationId: loc1.id, url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800" },
      { locationId: loc2.id, url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800" },
      { locationId: loc3.id, url: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800" },
      { locationId: loc4.id, url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800" },
    ],
  });
  console.log(`  Created 5 location images`);

  // 13. SchoolLocationContact
  console.log("[13/52] Creating SchoolLocationContacts...");
  await prisma.schoolLocationContact.createMany({
    data: [
      { locationId: loc1.id, phone: "+84-28-1234-5678", hours: "Mon-Fri: 8:00-17:00", email: "info@cis.edu.vn", url: "https://cis.edu.vn" },
      { locationId: loc2.id, phone: "+84-28-1234-5679", hours: "Mon-Fri: 9:00-18:00", email: "branch@cis.edu.vn" },
      { locationId: loc3.id, phone: "+82-2-1234-5678", hours: "Mon-Fri: 9:00-18:00", email: "info@kgu.ac.kr", url: "https://kgu.ac.kr" },
      { locationId: loc4.id, phone: "+61-2-1234-5678", hours: "Mon-Fri: 9:00-17:00", email: "info@auv.edu.au", url: "https://auv.edu.au" },
    ],
  });
  console.log(`  Created 4 location contacts`);

  // 14. SchoolProgram
  console.log("[14/52] Creating SchoolPrograms...");
  const prog1 = await prisma.schoolProgram.create({
    data: {
      schoolId: school1.id,
      name: "Computer Science",
      description: "Study programming, software development, AI, and data science",
      cover: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
      isPublished: true,
    },
  });

  const prog2 = await prisma.schoolProgram.create({
    data: {
      schoolId: school1.id,
      name: "Business Administration",
      description: "Learn business management, marketing, and finance",
      cover: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400",
      isPublished: true,
    },
  });

  const prog3 = await prisma.schoolProgram.create({
    data: {
      schoolId: school1.id,
      name: "Engineering",
      description: "Mechanical, electrical, and civil engineering",
      cover: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400",
      isPublished: true,
    },
  });

  const prog4 = await prisma.schoolProgram.create({
    data: {
      schoolId: school2.id,
      name: "Korean Studies",
      description: "Learn Korean language, culture, and literature",
      cover: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400",
      isPublished: true,
    },
  });

  const prog5 = await prisma.schoolProgram.create({
    data: {
      schoolId: school2.id,
      name: "Technology",
      description: "Information Technology, AI, and robotics",
      cover: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400",
      isPublished: true,
    },
  });

  const prog6 = await prisma.schoolProgram.create({
    data: {
      schoolId: school3.id,
      name: "International Business",
      description: "Global business practices and international trade",
      cover: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400",
      isPublished: true,
    },
  });
  console.log(`  Created 6 school programs`);

  // 15. SchoolProgramImage
  console.log("[15/52] Creating SchoolProgramImages...");
  await prisma.schoolProgramImage.createMany({
    data: [
      { programId: prog1.id, url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800" },
      { programId: prog1.id, url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800" },
      { programId: prog2.id, url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800" },
      { programId: prog3.id, url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800" },
      { programId: prog4.id, url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800" },
      { programId: prog5.id, url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800" },
      { programId: prog6.id, url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800" },
    ],
  });
  console.log(`  Created 7 program images`);

  // 16. SchoolGallery
  console.log("[16/52] Creating SchoolGalleries...");
  const gal1 = await prisma.schoolGallery.create({
    data: {
      schoolId: school1.id,
      name: "Campus Tour",
      description: "Virtual tour of our beautiful campus facilities",
      cover: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400",
    },
  });

  const gal2 = await prisma.schoolGallery.create({
    data: {
      schoolId: school1.id,
      name: "Student Life",
      description: "Activities, events, and student experiences",
      cover: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400",
    },
  });

  const gal3 = await prisma.schoolGallery.create({
    data: {
      schoolId: school2.id,
      name: "Campus Events",
      description: "Annual campus events and celebrations",
      cover: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400",
    },
  });
  console.log(`  Created 3 school galleries`);

  // 17. SchoolGalleryImage
  console.log("[17/52] Creating SchoolGalleryImages...");
  await prisma.schoolGalleryImage.createMany({
    data: [
      { galleryId: gal1.id, url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800" },
      { galleryId: gal1.id, url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800" },
      { galleryId: gal2.id, url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800" },
      { galleryId: gal2.id, url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800" },
      { galleryId: gal3.id, url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800" },
    ],
  });
  console.log(`  Created 5 gallery images`);

  // 18. SchoolScholarship
  console.log("[18/52] Creating SchoolScholarships...");
  const sch1 = await prisma.schoolScholarship.create({
    data: {
      schoolId: school1.id,
      name: "Academic Excellence Scholarship",
      description: "Full tuition waiver for students with outstanding academic performance (GPA 3.8+)",
      cover: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
      isPublished: true,
    },
  });

  const sch2 = await prisma.schoolScholarship.create({
    data: {
      schoolId: school1.id,
      name: "International Student Grant",
      description: "Financial support covering 50% tuition for international students",
      cover: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400",
      isPublished: true,
    },
  });

  const sch3 = await prisma.schoolScholarship.create({
    data: {
      schoolId: school2.id,
      name: "Korean Government Scholarship",
      description: "KGSP scholarship for outstanding international students",
      cover: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400",
      isPublished: true,
    },
  });

  const sch4 = await prisma.schoolScholarship.create({
    data: {
      schoolId: school3.id,
      name: "Australia Excellence Award",
      description: "Merit-based scholarship for high-achieving students",
      cover: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400",
      isPublished: true,
    },
  });
  console.log(`  Created 4 scholarships`);

  // 19. SchoolScholarshipImage
  console.log("[19/52] Creating SchoolScholarshipImages...");
  await prisma.schoolScholarshipImage.createMany({
    data: [
      { scholarshipId: sch1.id, url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800" },
      { scholarshipId: sch2.id, url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800" },
      { scholarshipId: sch3.id, url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800" },
      { scholarshipId: sch4.id, url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800" },
    ],
  });
  console.log(`  Created 4 scholarship images`);

  // ============================================================
  // PHASE 3: Student Tables
  // ============================================================

  // 20. Student
  console.log("[20/52] Creating Students...");
  const student1 = await prisma.student.create({
    data: {
      accountId: account2.id,
      schoolId: school1.id,
      studentCode: "STU2025001",
      degreeType: DegreeType.HIGHSCHOOL,
      certificateType: CertificateType.IELTS,
      certificateImg: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
      gradeType: GradeType.GPA,
      gradeScore: 3.8,
      cover: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400",
      status: StudentStatus.APPROVED,
      additional: "Completed AP Computer Science with honors",
    },
  });

  const student2 = await prisma.student.create({
    data: {
      accountId: account3.id,
      schoolId: school2.id,
      studentCode: "STU2025002",
      degreeType: DegreeType.HIGHSCHOOL,
      certificateType: CertificateType.TOEFL,
      certificateImg: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
      gradeType: GradeType.GPA,
      gradeScore: 3.5,
      cover: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400",
      status: StudentStatus.AWAITING,
      additional: "Active member of debate club",
    },
  });

  const student3 = await prisma.student.create({
    data: {
      accountId: account4.id,
      schoolId: school3.id,
      studentCode: "STU2025003",
      degreeType: DegreeType.HIGHSCHOOL,
      certificateType: CertificateType.IELTS,
      certificateImg: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
      gradeType: GradeType.CGPA,
      gradeScore: 3.9,
      cover: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=400",
      status: StudentStatus.STUDYING,
      additional: "Captain of basketball team, volunteer work",
    },
  });

  const student4 = await prisma.student.create({
    data: {
      accountId: account5.id,
      schoolId: school1.id,
      studentCode: "STU2025004",
      degreeType: DegreeType.UNIVERSITY,
      certificateType: CertificateType.IELTS,
      certificateImg: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
      gradeType: GradeType.GPA,
      gradeScore: 3.6,
      cover: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400",
      status: StudentStatus.APPROVED,
      additional: "Previous degree in Economics",
    },
  });
  console.log(`  Created 4 students: ${student1.studentCode}, ${student2.studentCode}, ${student3.studentCode}, ${student4.studentCode}`);

  // 21. StudentSchoolProgram
  console.log("[21/52] Creating StudentSchoolPrograms...");
  await prisma.studentSchoolProgram.create({
    data: { studentId: student1.id, programId: prog1.id },
  });
  await prisma.studentSchoolProgram.create({
    data: { studentId: student2.id, programId: prog4.id },
  });
  await prisma.studentSchoolProgram.create({
    data: { studentId: student3.id, programId: prog6.id },
  });
  await prisma.studentSchoolProgram.create({
    data: { studentId: student4.id, programId: prog2.id },
  });
  console.log(`  Created 4 student-program relations`);

  // 22. StudentSchoolLocation
  console.log("[22/52] Creating StudentSchoolLocations...");
  await prisma.studentSchoolLocation.create({
    data: { studentId: student1.id, locationId: loc1.id },
  });
  await prisma.studentSchoolLocation.create({
    data: { studentId: student2.id, locationId: loc3.id },
  });
  await prisma.studentSchoolLocation.create({
    data: { studentId: student3.id, locationId: loc4.id },
  });
  await prisma.studentSchoolLocation.create({
    data: { studentId: student4.id, locationId: loc1.id },
  });
  console.log(`  Created 4 student-location relations`);

  // 23. StudentSchoolScholarship
  console.log("[23/52] Creating StudentSchoolScholarships...");
  await prisma.studentSchoolScholarship.create({
    data: { studentId: student1.id, scholarshipId: sch1.id },
  });
  await prisma.studentSchoolScholarship.create({
    data: { studentId: student3.id, scholarshipId: sch4.id },
  });
  console.log(`  Created 2 student-scholarship relations`);

  // ============================================================
  // PHASE 4: Profile Tables
  // ============================================================

  // 24. Profile
  console.log("[24/52] Creating Profiles...");
  const profile1 = await prisma.profile.create({
    data: { studentId: student1.id, status: ProfileStatus.ONLINE },
  });
  const profile2 = await prisma.profile.create({
    data: { studentId: student2.id, status: ProfileStatus.OFFLINE },
  });
  const profile3 = await prisma.profile.create({
    data: { studentId: student3.id, status: ProfileStatus.IDLE },
  });
  const profile4 = await prisma.profile.create({
    data: { studentId: student4.id, status: ProfileStatus.ONLINE },
  });
  console.log(`  Created 4 profiles`);

  // 25. ProfileBiography
  console.log("[25/52] Creating ProfileBiographies...");
  const bio1 = await prisma.profileBiography.create({
    data: {
      profileId: profile1.id,
      content: "Passionate computer science student with a dream of becoming a software engineer. Love coding, AI, and building useful applications.",
    },
  });
  const bio2 = await prisma.profileBiography.create({
    data: {
      profileId: profile2.id,
      content: "Interested in Korean culture and language. Looking forward to studying in Korea and exploring new opportunities.",
    },
  });
  const bio3 = await prisma.profileBiography.create({
    data: {
      profileId: profile3.id,
      content: "Business enthusiast with a goal to work internationally. Love traveling and meeting people from different cultures.",
    },
  });
  console.log(`  Created 3 profile biographies`);

  // 26. ProfileBiographyArea
  console.log("[26/52] Creating ProfileBiographyAreas...");
  const areas = await prisma.area.findMany();
  await prisma.profileBiographyArea.createMany({
    data: [
      { biographyId: bio1.id, areaId: areas[0].id },
      { biographyId: bio1.id, areaId: areas[1].id },
      { biographyId: bio2.id, areaId: areas[0].id },
      { biographyId: bio2.id, areaId: areas[6].id },
      { biographyId: bio3.id, areaId: areas[1].id },
      { biographyId: bio3.id, areaId: areas[7].id },
    ],
  });
  console.log(`  Created 6 biography-area relations`);

  // 27. ProfileBiographySocial
  console.log("[27/52] Creating ProfileBiographySocials...");
  await prisma.profileBiographySocial.createMany({
    data: [
      { biographyId: bio1.id, type: SocialType.YOUTUBE, href: "https://youtube.com/@student1" },
      { biographyId: bio1.id, type: SocialType.FACEBOOK, href: "https://facebook.com/student1" },
      { biographyId: bio2.id, type: SocialType.INSTAGRAM, href: "https://instagram.com/student2" },
      { biographyId: bio2.id, type: SocialType.TIKTOK, href: "https://tiktok.com/@student2" },
      { biographyId: bio3.id, type: SocialType.YOUTUBE, href: "https://youtube.com/@student3" },
    ],
  });
  console.log(`  Created 5 biography-social links`);

  // 28. ProfileBlog
  console.log("[28/52] Creating ProfileBlogs...");
  const blog1 = await prisma.profileBlog.create({
    data: {
      profileId: profile1.id,
      title: "My Journey to Computer Science",
      content: "It all started when I wrote my first 'Hello World' program...",
    },
  });
  const blog2 = await prisma.profileBlog.create({
    data: {
      profileId: profile2.id,
      title: "Why I Want to Study in Korea",
      content: "Korean culture has always fascinated me since I was a kid...",
    },
  });
  console.log(`  Created 2 profile blogs`);

  // 29. ProfileBlogImage
  console.log("[29/52] Creating ProfileBlogImages...");
  await prisma.profileBlogImage.createMany({
    data: [
      { profileBlogId: blog1.id, url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800" },
      { profileBlogId: blog2.id, url: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800" },
    ],
  });
  console.log(`  Created 2 blog images`);

  // 30. ProfileFriend
  console.log("[30/52] Creating ProfileFriends...");
  await prisma.profileFriend.create({
    data: { profileIdOne: profile1.id, profileIdTwo: profile2.id, isActive: true },
  });
  await prisma.profileFriend.create({
    data: { profileIdOne: profile2.id, profileIdTwo: profile3.id, isActive: true },
  });
  await prisma.profileFriend.create({
    data: { profileIdOne: profile3.id, profileIdTwo: profile4.id, isActive: false },
  });
  console.log(`  Created 3 friend relations (2 active, 1 pending)`);

  // ============================================================
  // PHASE 5: Social Tables (Post, Event, Group, Chat)
  // ============================================================

  // 31. Post
  console.log("[31/52] Creating Posts...");
  const post1 = await prisma.post.create({
    data: {
      profileId: profile1.id,
      content: "Just completed my first AI project! So excited about the possibilities in machine learning. #AI #Coding #Success",
      status: PostStatus.PUBLIC,
      isArchived: false,
    },
  });
  const post2 = await prisma.post.create({
    data: {
      profileId: profile2.id,
      content: "Studied Korean for 2 hours today. Learning a new language is challenging but rewarding! #Korean #LanguageLearning",
      status: PostStatus.PUBLIC,
      isArchived: false,
    },
  });
  const post3 = await prisma.post.create({
    data: {
      profileId: profile3.id,
      content: "Attended an amazing business workshop today. Networking is key to success!",
      status: PostStatus.FRIENDS,
      isArchived: false,
    },
  });
  const post4 = await prisma.post.create({
    data: {
      profileId: profile4.id,
      content: "Group study session at the library. Learning never stops!",
      status: PostStatus.PRIVATE,
      isArchived: false,
    },
  });
  console.log(`  Created 4 posts`);

  // 32. PostImage
  console.log("[32/52] Creating PostImages...");
  await prisma.postImage.createMany({
    data: [
      { postId: post1.id, url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800" },
      { postId: post2.id, url: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800" },
      { postId: post3.id, url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800" },
    ],
  });
  console.log(`  Created 3 post images`);

  // 33. PostLike
  console.log("[33/52] Creating PostLikes...");
  await prisma.postLike.createMany({
    data: [
      { postId: post1.id, profileId: profile2.id },
      { postId: post1.id, profileId: profile3.id },
      { postId: post2.id, profileId: profile1.id },
      { postId: post3.id, profileId: profile1.id },
      { postId: post3.id, profileId: profile4.id },
    ],
  });
  console.log(`  Created 5 post likes`);

  // 34. PostShare
  console.log("[34/52] Creating PostShares...");
  await prisma.postShare.create({
    data: { postId: post1.id, profileId: profile3.id },
  });
  console.log(`  Created 1 post share`);

  // 35. PostSave
  console.log("[35/52] Creating PostSaves...");
  await prisma.postSave.createMany({
    data: [
      { postId: post1.id, profileId: profile2.id },
      { postId: post2.id, profileId: profile4.id },
    ],
  });
  console.log(`  Created 2 post saves`);

  // 36. PostComment
  console.log("[36/52] Creating PostComments...");
  const comment1 = await prisma.postComment.create({
    data: {
      postId: post1.id,
      profileId: profile2.id,
      content: "Wow, that's amazing! What AI framework did you use?",
      isArchived: false,
    },
  });
  await prisma.postComment.create({
    data: {
      postId: post1.id,
      profileId: profile1.id,
      content: "Thanks! I used TensorFlow and PyTorch for this project.",
      isArchived: false,
      parentCommentId: comment1.id,
    },
  });
  await prisma.postComment.create({
    data: {
      postId: post2.id,
      profileId: profile3.id,
      content: "Keep it up! Korean is a beautiful language.",
      isArchived: false,
    },
  });
  console.log(`  Created 3 post comments (with 1 reply)`);

  // 37. PostCommentLike
  console.log("[37/52] Creating PostCommentLikes...");
  await prisma.postCommentLike.createMany({
    data: [
      { postCommentId: comment1.id, profileId: profile1.id },
      { postCommentId: comment1.id, profileId: profile3.id },
    ],
  });
  console.log(`  Created 2 comment likes`);

  // 38. Event
  console.log("[38/52] Creating Events...");
  const event1 = await prisma.event.create({
    data: { hostId: profile1.id, title: "Tech Talk: Introduction to AI" },
  });
  const event2 = await prisma.event.create({
    data: { hostId: profile2.id, title: "Korean Culture Night" },
  });
  console.log(`  Created 2 events`);

  // 39. EventProfile
  console.log("[39/52] Creating EventProfiles...");
  await prisma.eventProfile.createMany({
    data: [
      { eventId: event1.id, profileId: profile2.id },
      { eventId: event1.id, profileId: profile3.id },
      { eventId: event2.id, profileId: profile1.id },
      { eventId: event2.id, profileId: profile3.id },
      { eventId: event2.id, profileId: profile4.id },
    ],
  });
  console.log(`  Created 5 event participation records`);

  // 40. Group
  console.log("[40/52] Creating Groups...");
  const group1 = await prisma.group.create({
    data: { ownerId: profile1.id, name: "Computer Science Study Group" },
  });
  const group2 = await prisma.group.create({
    data: { ownerId: profile2.id, name: "Korean Language Learners" },
  });
  console.log(`  Created 2 groups`);

  // 41. ProfileGroup
  console.log("[41/52] Creating ProfileGroups...");
  await prisma.profileGroup.createMany({
    data: [
      { profileId: profile1.id, groupId: group1.id },
      { profileId: profile2.id, groupId: group1.id },
      { profileId: profile3.id, groupId: group1.id },
      { profileId: profile2.id, groupId: group2.id },
      { profileId: profile4.id, groupId: group2.id },
    ],
  });
  console.log(`  Created 5 group memberships`);

  // ============================================================
  // PHASE 6: Chat & Messaging Tables
  // ============================================================

  // 42. Chat
  console.log("[42/52] Creating Chats...");
  const chat1 = await prisma.chat.create({
    data: { name: "Study Group Chat" },
  });
  const chat2 = await prisma.chat.create({
    data: { name: "Project Team Chat" },
  });
  console.log(`  Created 2 chats`);

  // Add students to chats
  await prisma.student.update({
    where: { id: student1.id },
    data: { chats: { connect: [{ id: chat1.id }, { id: chat2.id }] } },
  });
  await prisma.student.update({
    where: { id: student2.id },
    data: { chats: { connect: [{ id: chat1.id }] } },
  });
  await prisma.student.update({
    where: { id: student3.id },
    data: { chats: { connect: [{ id: chat2.id }] } },
  });

  // 43. Message
  console.log("[43/52] Creating Messages...");
  await prisma.message.createMany({
    data: [
      { chatId: chat1.id, studentCode: student1.id, content: "Hey everyone! Ready for today's study session?" },
      { chatId: chat1.id, studentCode: student2.id, content: "Yes! I've prepared my notes." },
      { chatId: chat1.id, studentCode: student1.id, content: "Great! Let's meet at the library at 3 PM." },
      { chatId: chat2.id, studentCode: student1.id, content: "Project update: I've finished the design phase." },
      { chatId: chat2.id, studentCode: student3.id, content: "Awesome! I'm working on the backend now." },
    ],
  });
  console.log(`  Created 5 messages`);

  // 44. ChatSession
  console.log("[44/52] Creating ChatSessions...");
  const session1 = await prisma.chatSession.create({
    data: {
      clientId: "client_abc123",
      name: "John Doe",
      email: "john@email.com",
      phone: "+1234567890",
      userId: account2.id,
    },
  });
  const session2 = await prisma.chatSession.create({
    data: {
      clientId: "client_xyz789",
      name: "Jane Smith",
      email: "jane@email.com",
      userId: null,
    },
  });
  console.log(`  Created 2 chat sessions`);

  // 45. ChatSessionMessage
  console.log("[45/52] Creating ChatSessionMessages...");
  await prisma.chatSessionMessage.createMany({
    data: [
      { chatSessionId: session1.id, message: "Hello, I need help with my application.", role: ChatSessionRole.USER },
      { chatSessionId: session1.id, message: "Hi John! How can I assist you today?", role: ChatSessionRole.ADMIN },
      { chatSessionId: session1.id, message: "I want to know about the scholarship requirements.", role: ChatSessionRole.USER },
      { chatSessionId: session2.id, message: "Hi, I'm interested in studying at your school.", role: ChatSessionRole.USER },
    ],
  });
  console.log(`  Created 4 chat session messages`);

  // ============================================================
  // PHASE 7: News & Notifications
  // ============================================================

  // 46. News
  console.log("[46/52] Creating News...");
  const news1 = await prisma.news.create({
    data: {
      schoolId: school1.id,
      title: "Tuyển sinh khóa 2026",
      content: "Chương trình tuyển sinh cho năm học 2026 đã chính thức mở. Hạn nộp hồ sơ: 30/06/2026. Đặc biệt, chúng tôi cung cấp 50% học bổng cho sinh viên xuất sắc.",
      type: NewsType.ANNOUNCEMENT,
      cover: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
      isPublished: true,
    },
  });
  const news2 = await prisma.news.create({
    data: {
      schoolId: school2.id,
      title: "Hội thảo du học Korea 2026",
      content: "Sự kiện hội thảo về du học Hàn Quốc sẽ diễn ra vào ngày 20/01/2026 tại Trung tâm Hội nghị Quốc gia.",
      type: NewsType.EVENT,
      cover: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
      isPublished: true,
    },
  });
  const news3 = await prisma.news.create({
    data: {
      schoolId: null,
      title: "CEMC - Chào mừng năm mới 2026",
      content: "Canada Medical and Education Center xin chúc mừng năm mới 2026. Cảm ơn quý phụ huynh và học sinh đã đồng hành cùng chúng tôi.",
      type: NewsType.BLOG,
      cover: "https://images.unsplash.com/photo-1467810563316-b5476525c727?w=800",
      isPublished: true,
    },
  });
  const news4 = await prisma.news.create({
    data: {
      schoolId: school3.id,
      title: "Lễ tốt nghiệp 2025",
      content: "Chúc mừng các sinh viên đã hoàn thành chương trình học và nhận bằng tốt nghiệp.",
      type: NewsType.EVENT,
      cover: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
      isPublished: true,
    },
  });
  const news5 = await prisma.news.create({
    data: {
      schoolId: school1.id,
      title: "Thông báo về học bổng mới",
      content: "Trường vừa công bố chương trình học bổng mới cho sinh viên quốc tế xuất sắc.",
      type: NewsType.ANNOUNCEMENT,
      cover: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
      isPublished: true,
    },
  });
  console.log(`  Created 5 news articles`);

  // 47. NewsNotification
  console.log("[47/52] Creating NewsNotifications...");
  await prisma.newsNotification.createMany({
    data: [
      { newsId: news1.id, studentId: student1.id, type: NewsType.ANNOUNCEMENT, isRead: true, fromId: null },
      { newsId: news1.id, studentId: student2.id, type: NewsType.ANNOUNCEMENT, isRead: false, fromId: student1.id },
      { newsId: news2.id, studentId: student2.id, type: NewsType.EVENT, isRead: false, fromId: null },
      { newsId: news3.id, studentId: student1.id, type: NewsType.BLOG, isRead: true, fromId: null },
      { newsId: news3.id, studentId: student3.id, type: NewsType.BLOG, isRead: false, fromId: null },
    ],
  });
  console.log(`  Created 5 news notifications`);

  // ============================================================
  // PHASE 8: Feedback Tables
  // ============================================================

  // 48. Feedback
  console.log("[48/52] Creating Feedbacks...");
  const fb1 = await prisma.feedback.create({
    data: {
      schoolId: school1.id,
      name: "John Doe",
      email: "john@example.com",
      title: "Hỏi về học phí",
      message: "Xin cho tôi biết học phí của chương trình Computer Science là bao nhiêu?",
      type: FeedbackType.QUESTION,
      phone: "+1234567890",
      isRead: false,
      isResolved: false,
    },
  });
  const fb2 = await prisma.feedback.create({
    data: {
      schoolId: null,
      name: "Jane Smith",
      email: "jane@example.com",
      title: "Phản hồi về dịch vụ",
      message: "Dịch vụ tư vấn rất tốt, cảm ơn đội ngũ tư vấn!",
      type: FeedbackType.FEEDBACK,
      isRead: true,
      isResolved: true,
    },
  });
  const fb3 = await prisma.feedback.create({
    data: {
      schoolId: school2.id,
      name: "Robert Johnson",
      email: "robert@example.com",
      title: "Yêu cầu hoàn tiền",
      message: "Tôi muốn yêu cầu hoàn tiền khóa học đã đăng ký.",
      type: FeedbackType.REFUND,
      phone: "+1987654321",
      isRead: false,
      isResolved: false,
    },
  });
  const fb4 = await prisma.feedback.create({
    data: {
      schoolId: school1.id,
      name: "Emily Wilson",
      email: "emily@example.com",
      title: "Câu hỏi về học bổng",
      message: "Làm thế nào để apply học bổng Academic Excellence?",
      type: FeedbackType.SCHOLARSHIP,
      isRead: false,
      isResolved: false,
    },
  });
  const fb5 = await prisma.feedback.create({
    data: {
      schoolId: school3.id,
      name: "Michael Brown",
      email: "michael@example.com",
      title: "Thanh toán học phí",
      message: "Tôi gặp vấn đề khi thanh toán học phí qua thẻ tín dụng.",
      type: FeedbackType.BILLING,
      phone: "+1122334455",
      isRead: true,
      isResolved: true,
    },
  });
  console.log(`  Created 5 feedbacks`);

  // 49. FeedbackReply
  console.log("[49/52] Creating FeedbackReplies...");
  await prisma.feedbackReply.createMany({
    data: [
      { feedbackId: fb1.id, message: "Cảm ơn bạn đã liên hệ. Học phí chương trình Computer Science là 50 triệu/năm.", senderName: "CEMC Support", role: FeedbackReplyRole.ADMIN },
      { feedbackId: fb2.id, message: "Cảm ơn phản hồi tích cực của bạn!", senderName: "CEMC Support", role: FeedbackReplyRole.ADMIN },
      { feedbackId: fb3.id, message: "Chúng tôi đã tiếp nhận yêu cầu hoàn tiền và đang xử lý.", senderName: "CEMC Support", role: FeedbackReplyRole.ADMIN },
      { feedbackId: fb4.id, message: "Để apply học bổng, bạn cần có GPA từ 3.8 trở lên và nộp hồ sơ qua email.", senderName: "CEMC Support", role: FeedbackReplyRole.ADMIN },
      { feedbackId: fb1.id, message: "Cảm ơn đã giải đáp!", senderName: "John Doe", role: FeedbackReplyRole.USER },
    ],
  });
  console.log(`  Created 5 feedback replies`);

  // ============================================================
  // PHASE 9: Follow Tables
  // ============================================================

  // 50. StudentFollow
  console.log("[50/52] Creating StudentFollows...");
  await prisma.studentFollow.createMany({
    data: [
      { studentId: student1.id, followerId: student2.id },
      { studentId: student1.id, followerId: student3.id },
      { studentId: student2.id, followerId: student1.id },
      { studentId: student3.id, followerId: student1.id },
      { studentId: student3.id, followerId: student4.id },
    ],
  });
  console.log(`  Created 5 student follows`);

  // ============================================================
  // PHASE 10: Update Account with 2FA (requires Account to exist)
  // ============================================================

  // 51. Update admin account with 2FA
  console.log("[51/52] Enabling 2FA for admin account...");
  await prisma.account.update({
    where: { id: account1.id },
    data: {
      isTwoFactorEnabled: true,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    },
  });
  console.log(`  Updated admin account with 2FA`);

  // 52. Add chat supports relation
  console.log("[52/52] Adding chat supports relations...");
  await prisma.account.update({
    where: { id: account1.id },
    data: {
      chatSupports: {
        connect: [{ id: session1.id }],
      },
    },
  });
  console.log(`  Added chat support relation`);

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log("\n" + "=".repeat(60));
  console.log("SEED COMPLETED SUCCESSFULLY!");
  console.log("=".repeat(60));
  console.log("\n📊 Summary:");
  console.log("  - 5 Accounts created");
  console.log("  - 4 Students created");
  console.log("  - 4 Profiles created");
  console.log("  - 3 Schools created");
  console.log("  - 6 School Programs created");
  console.log("  - 4 School Locations created");
  console.log("  - 4 Scholarships created");
  console.log("  - 5 News articles created");
  console.log("  - 5 Feedbacks created");
  console.log("  - 4 Posts created");
  console.log("  - 2 Groups created");
  console.log("  - 2 Events created");
  console.log("\n🔑 Test Credentials:");
  console.log("  Admin: admin@cemc.com / Test123456");
  console.log("  Student 1: student1@test.com / Test123456");
  console.log("  Student 2: student2@test.com / Test123456");
  console.log("  Student 3: student3@test.com / Test123456");
  console.log("  Student 4: student4@test.com / Test123456");
  console.log("\n⚠️  Notes:");
  console.log("  - Image URLs use Unsplash placeholders (add real images manually)");
  console.log("  - Certificate images use placeholders (upload real images)");
  console.log("  - Some tables may need additional data based on your use case");
  console.log("=".repeat(60));
}

main()
  .catch((e) => {
    console.error("\n❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
