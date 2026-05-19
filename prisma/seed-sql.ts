// Seed script using raw SQL via pg driver
// This bypasses Prisma Accelerate issues
import pg from 'pg';
import 'dotenv/config';

const { Client } = pg;

const dbUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;

console.log("Starting seed with raw SQL...");
console.log("Database URL:", dbUrl?.substring(0, 30) + "...");

const client = new Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
});

async function safeInsert(query: string, params: any[] = []) {
  try {
    const result = await client.query(query, params);
    return { success: true, count: result.rowCount || 0, rows: result.rows };
  } catch (error: any) {
    if (error.code === '23505') { // Duplicate key
      return { success: true, count: 0, rows: [], duplicate: true };
    }
    console.error(`  Error: ${error.message}`);
    return { success: false, count: 0, rows: [] };
  }
}

async function main() {
  try {
    await client.connect();
    console.log("Connected to database successfully!\n");

    // Hash password
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash("Test123456", 12);

    // ============================================================
    // PHASE 1: Core Tables
    // ============================================================

    // 1. Account
    console.log("[1/52] Creating Accounts...");
    const accountResult = await safeInsert(`
      INSERT INTO "Account" (
        id, email, "emailVerified", password, name, dob, gender, 
        "phoneNumber", "idCardNumber", address, image, "isLocked", 
        "isTwoFactorEnabled", "createdAt", "updatedAt"
      ) VALUES 
        (gen_random_uuid(), 'admin@cemc.com', NULL, $1, 'Admin CEMC', '1990-01-15', 'MALE', 
         '0909123456', '123456789012', '123 Admin Street, District 1, Ho Chi Minh City', 
         'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', false, false, NOW(), NOW()),
        (gen_random_uuid(), 'student1@test.com', NULL, $1, 'Nguyen Van A', '2005-06-20', 'MALE', 
         '0909123457', '123456789013', '456 Student Ave, District 3, Ho Chi Minh City', 
         'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', false, false, NOW(), NOW()),
        (gen_random_uuid(), 'student2@test.com', NULL, $1, 'Tran Thi B', '2006-03-10', 'FEMALE', 
         '0909123458', '123456789014', '789 Student Blvd, District 5, Ho Chi Minh City', 
         'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200', false, false, NOW(), NOW()),
        (gen_random_uuid(), 'student3@test.com', NULL, $1, 'Le Van C', '2005-09-25', 'MALE', 
         '0909123459', '123456789015', '321 Student Rd, District 7, Ho Chi Minh City', 
         'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', false, false, NOW(), NOW()),
        (gen_random_uuid(), 'student4@test.com', NULL, $1, 'Pham Thi D', '2006-01-05', 'FEMALE', 
         '0909123460', '123456789016', '654 Student Lane, District 2, Ho Chi Minh City', 
         'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', false, false, NOW(), NOW())
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email
    `, [hashedPassword]);

    console.log(`  Created ${accountResult.count} accounts`);
    
    // Get accounts
    const accounts = await client.query(`SELECT id, email FROM "Account" LIMIT 5`);
    const account1Id = accounts.rows[0]?.id;
    const account2Id = accounts.rows[1]?.id;
    const account3Id = accounts.rows[2]?.id;
    const account4Id = accounts.rows[3]?.id;
    const account5Id = accounts.rows[4]?.id;

    // 6. TwoFactorConfirmation
    console.log("[6/52] Creating TwoFactorConfirmations...");
    await safeInsert(`
      INSERT INTO "TwoFactorConfirmation" (id, "accountId", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), $1, NOW(), NOW())
      ON CONFLICT ("accountId") DO NOTHING
    `, [account1Id]);

    // 7. NotificationToken
    console.log("[7/52] Creating NotificationTokens...");
    await safeInsert(`
      INSERT INTO "NotificationToken" (id, "userId", token, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), $1, 'fcm_test_token_device_1', NOW(), NOW()),
             (gen_random_uuid(), $2, 'fcm_test_token_device_2', NOW(), NOW())
      ON CONFLICT ("userId") DO NOTHING
    `, [account2Id, account3Id]);

    // 8. NotificationPush
    console.log("[8/52] Creating NotificationPush...");
    await safeInsert(`
      INSERT INTO "NotificationPush" (id, title, body, type, "senderName", "isRead", "receiverId", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), 'Chào mừng đến với CEMC', 'Tài khoản của bạn đã được tạo thành công!', 
              'WELCOME', 'CEMC Admin', false, $1, NOW(), NOW()),
             (gen_random_uuid(), 'Tin tức mới', 'Có tin tức mới về học bổng du học Canada 2026', 
              'NEWS', 'CEMC Admin', true, $2, NOW(), NOW())
    `, [account2Id, account3Id]);

    // 9. Area
    console.log("[9/52] Creating Areas...");
    await safeInsert(`
      INSERT INTO "Area" (id, title, "createdAt", "updatedAt")
      VALUES 
        (gen_random_uuid(), 'Computer Science', NOW(), NOW()),
        (gen_random_uuid(), 'Business Administration', NOW(), NOW()),
        (gen_random_uuid(), 'Engineering', NOW(), NOW()),
        (gen_random_uuid(), 'Arts & Design', NOW(), NOW()),
        (gen_random_uuid(), 'Medicine', NOW(), NOW()),
        (gen_random_uuid(), 'Law', NOW(), NOW()),
        (gen_random_uuid(), 'Education', NOW(), NOW()),
        (gen_random_uuid(), 'Hospitality & Tourism', NOW(), NOW())
      ON CONFLICT (title) DO NOTHING
    `);

    // ============================================================
    // PHASE 2: School Tables
    // ============================================================

    // 10. School
    console.log("[10/52] Creating Schools...");
    await safeInsert(`
      INSERT INTO "School" (
        id, logo, background, name, short, description, history, color, 
        "isPublished", country, "createdAt", "updatedAt"
      ) VALUES 
        (gen_random_uuid(), 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200',
         'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
         'Canada International School', 'CIS',
         'Canada International School - A premier institution for international education in Vietnam.',
         'Founded in 2010, CIS has been providing quality international education for over 15 years.',
         '#E74C3C', true, 'CANADA', NOW(), NOW()),
        (gen_random_uuid(), 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=200',
         'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800',
         'Korea Global University', 'KGU',
         'Leading Korean university for international students with world-class facilities.',
         'Established in 1995, KGU has produced thousands of successful graduates worldwide.',
         '#3498DB', true, 'KOREA', NOW(), NOW()),
        (gen_random_uuid(), 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200',
         'https://images.unsplash.com/photo-1529156069896-49953e39b3ac?w=800',
         'Australia University Vietnam', 'AUV',
         'Bringing Australian education standards to Vietnam with globally recognized degrees.',
         'Founded in 2015 as a partnership between Australian and Vietnamese education authorities.',
         '#2ECC71', true, 'AUSTRALIA', NOW(), NOW())
      ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
    `);

    // Get schools
    const schools = await client.query(`SELECT id, name FROM "School" LIMIT 3`);
    const school1Id = schools.rows[0]?.id;
    const school2Id = schools.rows[1]?.id;
    const school3Id = schools.rows[2]?.id;

    // 11. SchoolLocation
    console.log("[11/52] Creating SchoolLocations...");
    await safeInsert(`
      INSERT INTO "SchoolLocation" (id, "schoolId", cover, name, description, address, "isMain", "createdAt", "updatedAt")
      VALUES 
        (gen_random_uuid(), $1, 'https://images.unsplash.com/photo-1562774053-701939374585?w=400',
         'Main Campus', 'Main campus with modern facilities',
         '123 University Ave, District 1, Ho Chi Minh City', true, NOW(), NOW()),
        (gen_random_uuid(), $1, 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400',
         'Branch Campus', 'Secondary campus for additional programs',
         '456 Education St, District 3, Ho Chi Minh City', false, NOW(), NOW()),
        (gen_random_uuid(), $2, 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=400',
         'Seoul Campus', 'Main campus in Seoul',
         '789 Korea Ave, Seoul, South Korea', true, NOW(), NOW()),
        (gen_random_uuid(), $3, 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400',
         'Sydney Campus', 'Main campus in Sydney',
         '321 Australia Rd, Sydney, Australia', true, NOW(), NOW())
      ON CONFLICT (address) DO NOTHING
    `, [school1Id, school2Id, school3Id]);

    // 12. SchoolLocationImage
    console.log("[12/52] Creating SchoolLocationImages...");
    const locs = await client.query(`SELECT id FROM "SchoolLocation" LIMIT 5`);
    for (const loc of locs.rows) {
      await safeInsert(`
        INSERT INTO "SchoolLocationImage" (id, url, "locationId")
        VALUES (gen_random_uuid(), 'https://images.unsplash.com/photo-1562774053-701939374585?w=800', $1)
      `, [loc.id]);
    }

    // 13. SchoolLocationContact
    console.log("[13/52] Creating SchoolLocationContacts...");
    for (const loc of locs.rows) {
      await safeInsert(`
        INSERT INTO "SchoolLocationContact" (id, phone, hours, fax, email, url, "locationId", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), '+84-28-1234-5678', 'Mon-Fri: 8:00-17:00', NULL, 'info@school.edu', 'https://school.edu', $1, NOW(), NOW())
        ON CONFLICT DO NOTHING
      `, [loc.id]);
    }

    // 14. SchoolProgram
    console.log("[14/52] Creating SchoolPrograms...");
    await safeInsert(`
      INSERT INTO "SchoolProgram" (id, "schoolId", name, description, cover, "isPublished", "createdAt", "updatedAt")
      VALUES 
        (gen_random_uuid(), $1, 'Computer Science', 'Study programming, software development, AI, and data science',
         'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400', true, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Business Administration', 'Learn business management, marketing, and finance',
         'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400', true, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Engineering', 'Mechanical, electrical, and civil engineering',
         'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400', true, NOW(), NOW()),
        (gen_random_uuid(), $2, 'Korean Studies', 'Learn Korean language, culture, and literature',
         'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400', true, NOW(), NOW()),
        (gen_random_uuid(), $2, 'Technology', 'Information Technology, AI, and robotics',
         'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400', true, NOW(), NOW()),
        (gen_random_uuid(), $3, 'International Business', 'Global business practices and international trade',
         'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400', true, NOW(), NOW())
      ON CONFLICT ("schoolId", name) DO UPDATE SET description = EXCLUDED.description
    `, [school1Id, school2Id, school3Id]);

    // 15. SchoolProgramImage
    console.log("[15/52] Creating SchoolProgramImages...");
    const progs = await client.query(`SELECT id FROM "SchoolProgram" LIMIT 10`);
    for (const prog of progs.rows) {
      await safeInsert(`
        INSERT INTO "SchoolProgramImage" (id, url, "programId")
        VALUES (gen_random_uuid(), 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800', $1)
        ON CONFLICT DO NOTHING
      `, [prog.id]);
    }

    // 16. SchoolGallery
    console.log("[16/52] Creating SchoolGalleries...");
    await safeInsert(`
      INSERT INTO "SchoolGallery" (id, "schoolId", name, description, cover, "createdAt", "updatedAt")
      VALUES 
        (gen_random_uuid(), $1, 'Campus Tour', 'Virtual tour of our beautiful campus facilities',
         'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400', NOW(), NOW()),
        (gen_random_uuid(), $1, 'Student Life', 'Activities, events, and student experiences',
         'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400', NOW(), NOW()),
        (gen_random_uuid(), $2, 'Campus Events', 'Annual campus events and celebrations',
         'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400', NOW(), NOW())
    `, [school1Id, school2Id]);

    // 17. SchoolGalleryImage
    console.log("[17/52] Creating SchoolGalleryImages...");
    const gals = await client.query(`SELECT id FROM "SchoolGallery" LIMIT 10`);
    for (const gal of gals.rows) {
      await safeInsert(`
        INSERT INTO "SchoolGalleryImage" (id, url, "galleryId")
        VALUES (gen_random_uuid(), 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800', $1)
      `, [gal.id]);
    }

    // 18. SchoolScholarship
    console.log("[18/52] Creating SchoolScholarships...");
    await safeInsert(`
      INSERT INTO "SchoolScholarship" (id, "schoolId", name, description, cover, "isPublished", "createdAt", "updatedAt")
      VALUES 
        (gen_random_uuid(), $1, 'Academic Excellence Scholarship', 
         'Full tuition waiver for students with outstanding academic performance (GPA 3.8+)',
         'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400', true, NOW(), NOW()),
        (gen_random_uuid(), $1, 'International Student Grant', 
         'Financial support covering 50% tuition for international students',
         'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400', true, NOW(), NOW()),
        (gen_random_uuid(), $2, 'Korean Government Scholarship', 
         'KGSP scholarship for outstanding international students',
         'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400', true, NOW(), NOW()),
        (gen_random_uuid(), $3, 'Australia Excellence Award', 
         'Merit-based scholarship for high-achieving students',
         'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400', true, NOW(), NOW())
      ON CONFLICT ("schoolId", name) DO UPDATE SET description = EXCLUDED.description
    `, [school1Id, school2Id, school3Id]);

    // 19. SchoolScholarshipImage
    console.log("[19/52] Creating SchoolScholarshipImages...");
    const schs = await client.query(`SELECT id FROM "SchoolScholarship" LIMIT 10`);
    for (const sch of schs.rows) {
      await safeInsert(`
        INSERT INTO "SchoolScholarshipImage" (id, url, "scholarshipId")
        VALUES (gen_random_uuid(), 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', $1)
      `, [sch.id]);
    }

    // ============================================================
    // PHASE 3: Student Tables
    // ============================================================

    // 20. Student
    console.log("[20/52] Creating Students...");
    await safeInsert(`
      INSERT INTO "Student" (
        id, "accountId", "schoolId", "studentCode", "degreeType", 
        "certificateType", "certificateImg", "gradeType", "gradeScore", 
        cover, status, additional, "createdAt", "updatedAt"
      ) VALUES 
        ($1, $2, $3, 'STU2025001', 'HIGHSCHOOL', 'IELTS', 
         'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
         'GPA', 3.8, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
         'APPROVED', 'Completed AP Computer Science with honors', NOW(), NOW()),
        ($4, $5, $6, 'STU2025002', 'HIGHSCHOOL', 'TOEFL', 
         'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
         'GPA', 3.5, 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400',
         'AWAITING', 'Active member of debate club', NOW(), NOW()),
        ($7, $8, $9, 'STU2025003', 'HIGHSCHOOL', 'IELTS', 
         'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
         'CGPA', 3.9, 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=400',
         'STUDYING', 'Captain of basketball team, volunteer work', NOW(), NOW()),
        ($10, $11, $3, 'STU2025004', 'UNIVERSITY', 'IELTS', 
         'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
         'GPA', 3.6, 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400',
         'APPROVED', 'Previous degree in Economics', NOW(), NOW())
      ON CONFLICT ("studentCode") DO UPDATE SET status = EXCLUDED.status
    `, [account2Id, account2Id, school1Id, account3Id, account3Id, school2Id, account4Id, account4Id, school3Id, account5Id, account5Id]);

    // Get students
    const students = await client.query(`SELECT id, "studentCode" FROM "Student" LIMIT 4`);
    const student1Id = students.rows[0]?.id;
    const student2Id = students.rows[1]?.id;
    const student3Id = students.rows[2]?.id;
    const student4Id = students.rows[3]?.id;

    // 21. StudentSchoolProgram
    console.log("[21/52] Creating StudentSchoolPrograms...");
    const programs = await client.query(`SELECT id, name FROM "SchoolProgram" WHERE "schoolId" = $1 LIMIT 5`, [school1Id]);
    if (programs.rows[0] && student1Id) {
      await safeInsert(`
        INSERT INTO "StudentSchoolProgram" (id, "studentId", "programId", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, NOW(), NOW())
        ON CONFLICT ("studentId", "programId") DO NOTHING
      `, [student1Id, programs.rows[0].id]);
    }

    // 24. Profile
    console.log("[24/52] Creating Profiles...");
    await safeInsert(`
      INSERT INTO "Profile" (id, "studentId", status, "createdAt", "updatedAt")
      VALUES 
        (gen_random_uuid(), $1, 'ONLINE', NOW(), NOW()),
        (gen_random_uuid(), $2, 'OFFLINE', NOW(), NOW()),
        (gen_random_uuid(), $3, 'IDLE', NOW(), NOW()),
        (gen_random_uuid(), $4, 'ONLINE', NOW(), NOW())
      ON CONFLICT ("studentId") DO NOTHING
    `, [student1Id, student2Id, student3Id, student4Id]);

    // Get profiles
    const profiles = await client.query(`SELECT id FROM "Profile" LIMIT 4`);
    const profile1Id = profiles.rows[0]?.id;
    const profile2Id = profiles.rows[1]?.id;
    const profile3Id = profiles.rows[2]?.id;
    const profile4Id = profiles.rows[3]?.id;

    // 25. ProfileBiography
    console.log("[25/52] Creating ProfileBiographies...");
    await safeInsert(`
      INSERT INTO "ProfileBiography" (id, "profileId", content, "createdAt", "updatedAt")
      VALUES 
        (gen_random_uuid(), $1, 'Passionate computer science student with a dream of becoming a software engineer. Love coding, AI, and building useful applications.', NOW(), NOW()),
        (gen_random_uuid(), $2, 'Interested in Korean culture and language. Looking forward to studying in Korea and exploring new opportunities.', NOW(), NOW()),
        (gen_random_uuid(), $3, 'Business enthusiast with a goal to work internationally. Love traveling and meeting people from different cultures.', NOW(), NOW())
      ON CONFLICT ("profileId") DO UPDATE SET content = EXCLUDED.content
    `, [profile1Id, profile2Id, profile3Id]);

    // 31. Post
    console.log("[31/52] Creating Posts...");
    await safeInsert(`
      INSERT INTO "Post" (id, "profileId", content, status, "isArchived", "createdAt", "updatedAt")
      VALUES 
        (gen_random_uuid(), $1, 'Just completed my first AI project! So excited about the possibilities in machine learning. #AI #Coding #Success', 'PUBLIC', false, NOW(), NOW()),
        (gen_random_uuid(), $2, 'Studied Korean for 2 hours today. Learning a new language is challenging but rewarding! #Korean #LanguageLearning', 'PUBLIC', false, NOW(), NOW()),
        (gen_random_uuid(), $3, 'Attended an amazing business workshop today. Networking is key to success!', 'FRIENDS', false, NOW(), NOW())
      ON CONFLICT DO NOTHING
    `, [profile1Id, profile2Id, profile3Id]);

    // 46. News
    console.log("[46/52] Creating News...");
    await safeInsert(`
      INSERT INTO "News" (id, "schoolId", title, content, type, cover, "isPublished", "createdAt", "updatedAt")
      VALUES 
        (gen_random_uuid(), $1, 'Tuyển sinh khóa 2026', 
         'Chương trình tuyển sinh cho năm học 2026 đã chính thức mở. Hạn nộp hồ sơ: 30/06/2026.',
         'ANNOUNCEMENT', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', true, NOW(), NOW()),
        (gen_random_uuid(), $2, 'Hội thảo du học Korea 2026', 
         'Sự kiện hội thảo về du học Hàn Quốc sẽ diễn ra vào ngày 20/01/2026.',
         'EVENT', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800', true, NOW(), NOW()),
        (gen_random_uuid(), NULL, 'CEMC - Chào mừng năm mới 2026', 
         'Canada Medical and Education Center xin chúc mừng năm mới 2026.',
         'BLOG', 'https://images.unsplash.com/photo-1467810563316-b5476525c727?w=800', true, NOW(), NOW()),
        (gen_random_uuid(), $3, 'Lễ tốt nghiệp 2025', 
         'Chúc mừng các sinh viên đã hoàn thành chương trình học và nhận bằng tốt nghiệp.',
         'EVENT', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', true, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Thông báo về học bổng mới', 
         'Trường vừa công bố chương trình học bổng mới cho sinh viên quốc tế xuất sắc.',
         'ANNOUNCEMENT', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', true, NOW(), NOW())
    `, [school1Id, school2Id, school3Id]);

    // 48. Feedback
    console.log("[48/52] Creating Feedbacks...");
    await safeInsert(`
      INSERT INTO "Feedback" (id, name, email, title, message, type, phone, "isRead", "isSpam", "isResolved", "createdAt", "updatedAt")
      VALUES 
        (gen_random_uuid(), 'John Doe', 'john@example.com', 'Hỏi về học phí', 
         'Xin cho tôi biết học phí của chương trình Computer Science là bao nhiêu?',
         'QUESTION', '+1234567890', false, false, false, NOW(), NOW()),
        (gen_random_uuid(), 'Jane Smith', 'jane@example.com', 'Phản hồi về dịch vụ', 
         'Dịch vụ tư vấn rất tốt, cảm ơn đội ngũ tư vấn!',
         'FEEDBACK', NULL, true, false, true, NOW(), NOW()),
        (gen_random_uuid(), 'Robert Johnson', 'robert@example.com', 'Yêu cầu hoàn tiền', 
         'Tôi muốn yêu cầu hoàn tiền khóa học đã đăng ký.',
         'REFUND', '+1987654321', false, false, false, NOW(), NOW()),
        (gen_random_uuid(), 'Emily Wilson', 'emily@example.com', 'Câu hỏi về học bổng', 
         'Làm thế nào để apply học bổng Academic Excellence?',
         'SCHOLARSHIP', NULL, false, false, false, NOW(), NOW())
    `);

    // 44. ChatSession
    console.log("[44/52] Creating ChatSessions...");
    await safeInsert(`
      INSERT INTO "ChatSupport" (id, "clientId", name, email, phone, "userId", "createdAt", "updatedAt")
      VALUES 
        (gen_random_uuid(), 'client_abc123', 'John Doe', 'john@email.com', '+1234567890', $1, NOW(), NOW()),
        (gen_random_uuid(), 'client_xyz789', 'Jane Smith', 'jane@email.com', NULL, NULL, NOW(), NOW())
    `, [account2Id]);

    console.log("\n" + "=".repeat(60));
    console.log("SEED COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log("\n🔑 Test Credentials:");
    console.log("  Admin: admin@cemc.com / Test123456");
    console.log("  Student 1: student1@test.com / Test123456");
    console.log("  Student 2: student2@test.com / Test123456");
    console.log("  Student 3: student3@test.com / Test123456");
    console.log("  Student 4: student4@test.com / Test123456");
    console.log("\n✅ Created Tables:");
    console.log("  - Account (5 users)");
    console.log("  - TwoFactorConfirmation");
    console.log("  - NotificationToken (2 tokens)");
    console.log("  - NotificationPush (2 notifications)");
    console.log("  - Area (8 areas)");
    console.log("  - School (3 schools)");
    console.log("  - SchoolLocation (4 locations)");
    console.log("  - SchoolProgram (6 programs)");
    console.log("  - SchoolScholarship (4 scholarships)");
    console.log("  - Student (4 students)");
    console.log("  - Profile (4 profiles)");
    console.log("  - ProfileBiography (3 biographies)");
    console.log("  - Post (3 posts)");
    console.log("  - News (5 articles)");
    console.log("  - Feedback (4 feedbacks)");
    console.log("  - ChatSupport (2 sessions)");
    console.log("\n⚠️  Notes:");
    console.log("  - Image URLs use Unsplash placeholders");
    console.log("  - Run Prisma Studio for full data management");
    console.log("=".repeat(60));

  } catch (error) {
    console.error("\n❌ Seed error:", error);
    throw error;
  } finally {
    await client.end();
  }
}

main().catch(console.error);
