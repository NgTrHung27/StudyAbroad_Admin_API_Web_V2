import { db } from "../lib/db";

async function main() {
  console.log("Starting seed...");

  // Create News
  const school1 = await db.school.create({
    data: {
      name: "Canada International School",
      logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200",
      background: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
      short: "CIS",
      description: "Canada International School - A premier institution for international education in Vietnam.",
      history: "Founded in 2010, CIS has been providing quality international education.",
      color: "#E74C3C",
      isPublished: true,
      country: "CANADA" as any,
    },
  });

  const school2 = await db.school.create({
    data: {
      name: "Korea Global University",
      logo: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=200",
      background: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800",
      short: "KGU",
      description: "Leading Korean university for international students.",
      color: "#3498DB",
      isPublished: true,
      country: "KOREA" as any,
    },
  });

  const school3 = await db.school.create({
    data: {
      name: "Australia University Vietnam",
      logo: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200",
      background: "https://images.unsplash.com/photo-1529156069896-49953e39b3ac?w=800",
      short: "AUV",
      description: "Bringing Australian education standards to Vietnam.",
      color: "#2ECC71",
      isPublished: true,
      country: "AUSTRALIA" as any,
    },
  });

  console.log("Created schools:", { school1, school2, school3 });

  // Create School Programs
  const programs = await db.schoolProgram.createMany({
    data: [
      { schoolId: school1.id, name: "Computer Science", description: "Study programming and software development", cover: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400", isPublished: true },
      { schoolId: school1.id, name: "Business Administration", description: "Learn business management", cover: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400", isPublished: true },
      { schoolId: school1.id, name: "Engineering", description: "Mechanical and electrical engineering", cover: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400", isPublished: true },
      { schoolId: school2.id, name: "Korean Studies", description: "Learn Korean language and culture", cover: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400", isPublished: true },
      { schoolId: school2.id, name: "Technology", description: "Information Technology and AI", cover: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400", isPublished: true },
      { schoolId: school3.id, name: "International Business", description: "Global business practices", cover: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400", isPublished: true },
    ],
  });
  console.log("Created programs:", programs);

  // Create School Locations
  const locations = await db.schoolLocation.createMany({
    data: [
      { schoolId: school1.id, name: "Main Campus", address: "123 University Ave, District 1, Ho Chi Minh City", cover: "https://images.unsplash.com/photo-1562774053-701939374585?w=400", isMain: true },
      { schoolId: school1.id, name: "Branch Campus", address: "456 Education St, District 3, Ho Chi Minh City", cover: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400", isMain: false },
      { schoolId: school2.id, name: "Seoul Campus", address: "789 Korea Ave, Seoul", cover: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=400", isMain: true },
      { schoolId: school3.id, name: "Sydney Campus", address: "321 Australia Rd, Sydney", cover: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400", isMain: true },
    ],
  });
  console.log("Created locations:", locations);

  // Create School Galleries
  const galleries = await db.schoolGallery.createMany({
    data: [
      { schoolId: school1.id, name: "Campus Tour", description: "Virtual tour of our beautiful campus", cover: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400" },
      { schoolId: school1.id, name: "Student Life", description: "Activities and events", cover: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400" },
      { schoolId: school2.id, name: "Campus Events", description: "Annual campus events", cover: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400" },
    ],
  });
  console.log("Created galleries:", galleries);

  // Create School Scholarships
  const scholarships = await db.schoolScholarship.createMany({
    data: [
      { schoolId: school1.id, name: "Academic Excellence Scholarship", description: "Full tuition waiver for top students", cover: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400", isPublished: true },
      { schoolId: school1.id, name: "International Student Grant", description: "Financial support for international students", cover: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400", isPublished: true },
      { schoolId: school2.id, name: "Korean Government Scholarship", description: "KGSP scholarship program", cover: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400", isPublished: true },
    ],
  });
  console.log("Created scholarships:", scholarships);

  // Create News
  const news = await db.news.createMany({
    data: [
      {
        schoolId: school1.id,
        title: "Tuyển sinh khóa 2026",
        content: "Chương trình tuyển sinh cho năm học 2026 đã chính thức mở. Hạn nộp hồ sơ: 30/06/2026. Đặc biệt, chúng tôi cung cấp 50% học bổng cho sinh viên xuất sắc.",
        type: "ANNOUNCEMENT",
        cover: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
        isPublished: true,
      },
      {
        schoolId: school2.id,
        title: "Hội thảo du học Korea 2026",
        content: "Sự kiện hội thảo về du học Hàn Quốc sẽ diễn ra vào ngày 20/01/2026 tại Trung tâm Hội nghị Quốc gia.",
        type: "EVENT",
        cover: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
        isPublished: true,
      },
      {
        schoolId: null,
        title: "CEMC - Chào mừng năm mới 2026",
        content: "Canada Medical and Education Center xin chúc mừng năm mới 2026. Cảm ơn quý phụ huynh và học sinh đã đồng hành cùng chúng tôi.",
        type: "BLOG",
        cover: "https://images.unsplash.com/photo-1467810563316-b5476525c727?w=800",
        isPublished: true,
      },
      {
        schoolId: school3.id,
        title: "Lễ tốt nghiệp 2025",
        content: "Chúc mừng các sinh viên đã hoàn thành chương trình học và nhận bằng tốt nghiệp.",
        type: "EVENT",
        cover: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
        isPublished: true,
      },
    ],
  });
  console.log("Created news:", news);

  // Create Feedbacks
  const feedbacks = await db.feedback.createMany({
    data: [
      {
        name: "John Doe",
        email: "john@example.com",
        title: "Hỏi về học phí",
        message: "Xin cho tôi biết học phí của chương trình Computer Science là bao nhiêu?",
        type: "QUESTION",
        phone: "+1234567890",
        isRead: false,
        isResolved: false,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        title: "Phản hồi về dịch vụ",
        message: "Dịch vụ tư vấn rất tốt, cảm ơn đội ngũ tư vấn!",
        type: "FEEDBACK",
        isRead: true,
        isResolved: true,
      },
      {
        name: "Robert Johnson",
        email: "robert@example.com",
        title: "Yêu cầu hoàn tiền",
        message: "Tôi muốn yêu cầu hoàn tiền khóa học đã đăng ký.",
        type: "REFUND",
        phone: "+1987654321",
        isRead: false,
        isResolved: false,
      },
      {
        name: "Emily Wilson",
        email: "emily@example.com",
        title: "Câu hỏi về học bổng",
        message: "Làm thế nào để apply học bổng Academic Excellence?",
        type: "SCHOLARSHIP",
        isRead: false,
        isResolved: false,
      },
    ],
  });
  console.log("Created feedbacks:", feedbacks);

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
