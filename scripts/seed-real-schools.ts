const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const SCHOOLS_DATA = [
  {
    name: "Cornerstone International Community College of Canada",
    short: "CICCC",
    description: "<p>Trường Cao đẳng Cộng đồng Quốc tế Cornerstone (CICCC) là trường cao đẳng tư thục tọa lạc tại Vancouver, Canada, chuyên đào tạo các ngành Công nghệ, Kinh doanh và Khách sạn. Trường cung cấp các chương trình Co-op thực tập hưởng lương giúp sinh viên có kinh nghiệm làm việc thực tế.</p>",
    history: "<p>Được thành lập vào năm 1980, Cornerstone đã đào tạo hàng ngàn sinh viên quốc tế với mục tiêu cung cấp nền giáo dục chất lượng cao kết hợp với kinh nghiệm làm việc tại Canada.</p>",
    logo: "https://ciccc.ca/wp-content/uploads/2021/04/CICCC-Logo-1.png",
    background: "https://ciccc.ca/wp-content/uploads/2021/04/Homepage-Banner-1.jpg",
    color: "#2563eb", // blue
    isPublished: true,
    country: "CANADA",
    locations: [
      {
        name: "Tech Campus",
        address: "609 W Hastings St, Vancouver, BC V6B 4W4, Canada",
        isMain: true,
        cover: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
        description: "Cơ sở vật chất hiện đại dành cho sinh viên ngành Công nghệ."
      },
      {
        name: "Hospitality Campus",
        address: "896 W 8th Ave, Vancouver, BC V5Z 3Y1, Canada",
        isMain: false,
        cover: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
        description: "Trung tâm đào tạo Quản trị Khách sạn."
      }
    ],
    programs: [
      {
        name: "Web & Mobile App Development",
        description: "Chương trình chuyên sâu 2 năm (1 năm học + 1 năm Co-op) về phát triển web và ứng dụng di động.",
        cover: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
        isPublished: true
      },
      {
        name: "Hospitality Management",
        description: "Chương trình Quản trị Khách sạn 2 năm kết hợp thực tập có hưởng lương (Co-op).",
        cover: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
        isPublished: true
      }
    ],
    galleries: [
      {
        name: "Campus Tour 2024",
        description: "Hình ảnh cơ sở vật chất mới nhất của trường.",
        cover: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80"
      }
    ],
    scholarships: [
      {
        name: "Tech Excellence Scholarship",
        description: "Học bổng trị giá $2,000 CAD dành cho sinh viên có thành tích xuất sắc đầu vào ngành công nghệ.",
        cover: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
        isPublished: true
      }
    ],
    news: [
      {
        title: "Khai giảng khóa Web Development mùa Thu 2024",
        content: "<p>Chào mừng các tân sinh viên khóa Web Development mùa Thu 2024. Trường đã chuẩn bị cơ sở vật chất tốt nhất để đón các bạn.</p>",
        type: "ANNOUNCEMENT",
        cover: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
        isPublished: true
      }
    ]
  },
  {
    name: "Metropolitan Community College",
    short: "MCC",
    description: "<p>Metropolitan Community College (MCC) tọa lạc tại Vancouver, British Columbia. Trường được công nhận bởi PTIB và cung cấp các khóa đào tạo nghề chất lượng cao trong các lĩnh vực kinh doanh, công nghệ, và nhà hàng khách sạn.</p>",
    history: "<p>Thành lập từ năm 1993, MCC đã liên tục cập nhật chương trình để đáp ứng nhu cầu thị trường lao động tại Vancouver.</p>",
    logo: "https://metropolitancollege.ca/wp-content/uploads/2021/08/logo-mcc.png",
    background: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
    color: "#b91c1c", // red
    isPublished: true,
    country: "CANADA",
    locations: [
      {
        name: "Vancouver Downtown Campus",
        address: "322 Water Street, Vancouver, BC",
        isMain: true,
        cover: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
        description: "Cơ sở chính tại trung tâm Vancouver."
      }
    ],
    programs: [
      {
        name: "Business Communication Co-op",
        description: "Chương trình Giao tiếp Kinh doanh bao gồm kỳ thực tập Co-op, giúp nâng cao kỹ năng làm việc trong môi trường kinh doanh quốc tế.",
        cover: "https://images.unsplash.com/photo-1552581234-26160f608093?w=800&q=80",
        isPublished: true
      },
      {
        name: "Hospitality Management Co-op",
        description: "Học về quản trị khách sạn và nhà hàng, kèm cơ hội làm việc tại các khách sạn 4-5 sao ở Vancouver.",
        cover: "https://images.unsplash.com/photo-1582719478250-c894e4dc929e?w=800&q=80",
        isPublished: true
      }
    ],
    galleries: [
      {
        name: "Sinh viên MCC",
        description: "Hoạt động sinh viên tại MCC.",
        cover: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80"
      }
    ],
    scholarships: [
      {
        name: "Entrance Award 2024",
        description: "Học bổng đầu vào trị giá $1,000 dành cho sinh viên quốc tế.",
        cover: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
        isPublished: true
      }
    ],
    news: [
      {
        title: "Tuyển sinh khóa Hospitality mùa Thu",
        content: "<p>MCC hiện đang nhận hồ sơ cho chương trình Hospitality Management kỳ mùa thu với nhiều suất học bổng hấp dẫn.</p>",
        type: "ANNOUNCEMENT",
        cover: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
        isPublished: true
      }
    ]
  },
  {
    name: "Sprott Shaw College",
    short: "SSC",
    description: "<p>Sprott Shaw College là một trong những trường cao đẳng lâu đời nhất tại British Columbia, cung cấp hơn 130 chương trình đào tạo đa dạng từ chăm sóc sức khỏe, kinh doanh, giáo dục mầm non, đến du lịch và khách sạn.</p>",
    history: "<p>Trường được thành lập năm 1903 bởi Robert James Sprott và William Henry Shaw, với lịch sử hơn 120 năm phát triển, trở thành một tổ chức giáo dục uy tín trên toàn tỉnh bang BC.</p>",
    logo: "https://sprottshaw.com/wp-content/themes/sprottshaw/assets/images/sprott-shaw-college-logo-horizontal.svg",
    background: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    color: "#b91c1c", // red
    isPublished: true,
    country: "CANADA",
    locations: [
      {
        name: "Vancouver Campus",
        address: "1000 - 900 West Hastings Street, Vancouver, BC V6C 1E5",
        isMain: true,
        cover: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
        description: "Cơ sở trung tâm Vancouver sầm uất."
      },
      {
        name: "Surrey Campus",
        address: "Suite 301, 13678 - 100th Avenue, Surrey, BC V3T 1H9",
        isMain: false,
        cover: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
        description: "Cơ sở tại Surrey với cơ sở vật chất hiện đại cho ngành y tế."
      }
    ],
    programs: [
      {
        name: "Early Childhood Education",
        description: "Chương trình Giáo dục Mầm non chất lượng cao, cung cấp chứng chỉ để hành nghề tại Canada.",
        cover: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
        isPublished: true
      },
      {
        name: "Practical Nursing",
        description: "Chương trình Điều dưỡng Thực hành, đào tạo chuyên sâu y tế với cơ hội việc làm lớn tại Canada.",
        cover: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80",
        isPublished: true
      }
    ],
    galleries: [
      {
        name: "Nursing Labs",
        description: "Cơ sở thực hành ngành Điều dưỡng.",
        cover: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&q=80"
      }
    ],
    scholarships: [
      {
        name: "SSC International Grant",
        description: "Hỗ trợ học phí trị giá lên đến $3,000 CAD cho các chương trình dài hạn.",
        cover: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
        isPublished: true
      }
    ],
    news: [
      {
        title: "Tự hào kỉ niệm 120 năm thành lập",
        content: "<p>Sprott Shaw College tự hào đánh dấu cột mốc 120 năm đào tạo ra hàng ngàn sinh viên ưu tú.</p>",
        type: "EVENT",
        cover: "https://images.unsplash.com/photo-1523580494112-071d3117465e?w=800&q=80",
        isPublished: true
      }
    ]
  },
  {
    name: "University Canada West",
    short: "UCW",
    description: "<p>University Canada West (UCW) là trường đại học tư thục danh tiếng nằm ở trung tâm Vancouver. Trường tập trung vào các chương trình kinh doanh và quản trị ứng dụng thực tế, được sinh viên quốc tế vô cùng ưa chuộng.</p>",
    history: "<p>Được thành lập vào năm 2004, UCW đã phát triển nhanh chóng nhờ các chương trình MBA và cử nhân kinh doanh linh hoạt, bám sát nhu cầu thị trường.</p>",
    logo: "https://www.ucanwest.ca/wp-content/uploads/2021/04/UCW-Logo-Color.svg",
    background: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    color: "#0f172a", // slate
    isPublished: true,
    country: "CANADA",
    locations: [
      {
        name: "Vancouver House Campus",
        address: "1461 Granville St, Vancouver, BC V6Z 0E5",
        isMain: true,
        cover: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
        description: "Cơ sở Vancouver House kiến trúc độc đáo, đạt nhiều giải thưởng quốc tế."
      },
      {
        name: "West Pender Campus",
        address: "626 W Pender St #100, Vancouver, BC V6B 1V9",
        isMain: false,
        cover: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
        description: "Cơ sở tại West Pender thuận lợi giao thông và gần các doanh nghiệp."
      }
    ],
    programs: [
      {
        name: "Master of Business Administration (MBA)",
        description: "Chương trình MBA hàng đầu được công nhận bởi ACBSP và NCMA, trang bị kiến thức lãnh đạo chiến lược.",
        cover: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
        isPublished: true
      },
      {
        name: "Bachelor of Commerce",
        description: "Cử nhân thương mại, xây dựng kiến thức nền tảng về quản lý kinh doanh hiện đại.",
        cover: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
        isPublished: true
      }
    ],
    galleries: [
      {
        name: "Vancouver House Architecture",
        description: "Vẻ đẹp của cơ sở Vancouver House.",
        cover: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
      }
    ],
    scholarships: [
      {
        name: "Americas Tuition",
        description: "Học bổng tự động áp dụng mức học phí ưu đãi dành cho các nước thuộc danh sách Americas Tuition.",
        cover: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
        isPublished: true
      }
    ],
    news: [
      {
        title: "Khai trương khuôn viên Vancouver House",
        content: "<p>Khuôn viên học tập đẳng cấp mới mang lại môi trường giáo dục thế kỷ 21 cho sinh viên UCW.</p>",
        type: "EVENT",
        cover: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
        isPublished: true
      }
    ]
  },
  {
    name: "University of the Fraser Valley",
    short: "UFV",
    description: "<p>University of the Fraser Valley (UFV) là trường đại học công lập nằm tại thung lũng Fraser xinh đẹp, phía đông Vancouver. UFV nổi bật với môi trường thân thiện, quy mô lớp học nhỏ và các chương trình giáo dục ứng dụng.</p>",
    history: "<p>Thành lập năm 1974, từ một trường cao đẳng cộng đồng, UFV đã vươn lên trở thành một trường đại học công lập uy tín, được công nhận trên toàn quốc và quốc tế.</p>",
    logo: "https://www.ufv.ca/media/assets/ufv-logo.svg",
    background: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    color: "#166534", // green
    isPublished: true,
    country: "CANADA",
    locations: [
      {
        name: "Abbotsford Campus",
        address: "33844 King Rd, Abbotsford, BC V2S 7M8",
        isMain: true,
        cover: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
        description: "Khuôn viên chính rộng lớn với cảnh quan tuyệt đẹp tại Abbotsford."
      },
      {
        name: "Chilliwack Campus",
        address: "45190 Caen Ave, Chilliwack, BC V2R 0N3",
        isMain: false,
        cover: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
        description: "Cơ sở tại Chilliwack với không gian xanh mướt và yên bình."
      }
    ],
    programs: [
      {
        name: "Bachelor of Science in Nursing",
        description: "Chương trình Cử nhân Điều dưỡng chuẩn mực cao của hệ thống giáo dục công lập.",
        cover: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
        isPublished: true
      },
      {
        name: "Bachelor of Business Administration",
        description: "Cử nhân Quản trị Kinh doanh, mở rộng cơ hội nghề nghiệp trong nhiều ngành.",
        cover: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
        isPublished: true
      }
    ],
    galleries: [
      {
        name: "UFV Green Campus",
        description: "Cảnh đẹp khuôn viên đại học vào mùa xuân.",
        cover: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80"
      }
    ],
    scholarships: [
      {
        name: "UFV International Excellence Scholarship",
        description: "Học bổng trị giá $20,000 chia đều cho 4 năm học dành cho sinh viên có thành tích xuất sắc nhất.",
        cover: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
        isPublished: true
      }
    ],
    news: [
      {
        title: "Chào đón sinh viên quốc tế đến với UFV",
        content: "<p>Môi trường học tập tại UFV luôn nồng nhiệt chào đón sự đa dạng và đóng góp từ các du học sinh trên toàn cầu.</p>",
        type: "BLOG",
        cover: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
        isPublished: true
      }
    ]
  }
];

function generateStudentNames() {
  const firstNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"];
  const lastNames = ["Anh", "Bình", "Cường", "Dung", "Hải", "Hương", "Linh", "Minh", "Nam", "Phong", "Thảo", "Trang", "Tuấn", "Yến"];
  
  const f = firstNames[Math.floor(Math.random() * firstNames.length)];
  const l = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${f} ${l}`;
}

function generateRandomPhoneNumber() {
  let phone = "09";
  for (let i = 0; i < 8; i++) {
    phone += Math.floor(Math.random() * 10).toString();
  }
  return phone;
}

function generateRandomIdCard() {
  let idCard = "001";
  for (let i = 0; i < 9; i++) {
    idCard += Math.floor(Math.random() * 10).toString();
  }
  return idCard;
}

async function main() {
  console.log("Start seeding schools data...");
  const hashedPassword = await bcrypt.hash("password123", 10);
  
  for (const s of SCHOOLS_DATA) {
    // 1. Create or Update School
    let school = await prisma.school.findFirst({
      where: { name: s.name }
    });

    if (school) {
      school = await prisma.school.update({
        where: { id: school.id },
        data: {
          short: s.short,
          description: s.description,
          history: s.history,
          logo: s.logo,
          background: s.background,
          color: s.color,
          isPublished: s.isPublished,
          country: s.country,
        }
      });
      console.log(`Updated school: ${s.name}`);
    } else {
      school = await prisma.school.create({
        data: {
          name: s.name,
          short: s.short,
          description: s.description,
          history: s.history,
          logo: s.logo,
          background: s.background,
          color: s.color,
          isPublished: s.isPublished,
          country: s.country,
        }
      });
      console.log(`Created school: ${s.name}`);
    }

    // 2. Insert Locations
    for (const loc of s.locations) {
      await prisma.schoolLocation.upsert({
        where: { address: loc.address },
        update: {
          name: loc.name,
          isMain: loc.isMain,
          cover: loc.cover,
          description: loc.description,
          schoolId: school.id
        },
        create: {
          name: loc.name,
          address: loc.address,
          isMain: loc.isMain,
          cover: loc.cover,
          description: loc.description,
          schoolId: school.id
        }
      });
    }

    // 3. Insert Programs
    for (const prog of s.programs) {
      await prisma.schoolProgram.upsert({
        where: {
          schoolId_name: {
            schoolId: school.id,
            name: prog.name
          }
        },
        update: {
          description: prog.description,
          cover: prog.cover,
          isPublished: prog.isPublished
        },
        create: {
          name: prog.name,
          description: prog.description,
          cover: prog.cover,
          isPublished: prog.isPublished,
          schoolId: school.id
        }
      });
    }

    // 4. Insert Galleries
    for (const gal of s.galleries) {
      const existingGallery = await prisma.schoolGallery.findFirst({
        where: { schoolId: school.id, name: gal.name }
      });
      if (!existingGallery) {
        await prisma.schoolGallery.create({
          data: {
            name: gal.name,
            description: gal.description,
            cover: gal.cover,
            schoolId: school.id
          }
        });
      }
    }

    // 5. Insert Scholarships
    for (const schol of s.scholarships) {
      await prisma.schoolScholarship.upsert({
        where: {
          schoolId_name: {
            schoolId: school.id,
            name: schol.name
          }
        },
        update: {
          description: schol.description,
          cover: schol.cover,
          isPublished: schol.isPublished
        },
        create: {
          name: schol.name,
          description: schol.description,
          cover: schol.cover,
          isPublished: schol.isPublished,
          schoolId: school.id
        }
      });
    }

    // 6. Insert News
    for (const n of s.news) {
      const existingNews = await prisma.news.findFirst({
        where: { schoolId: school.id, title: n.title }
      });
      if (!existingNews) {
        await prisma.news.create({
          data: {
            title: n.title,
            content: n.content,
            type: n.type,
            cover: n.cover,
            isPublished: n.isPublished,
            schoolId: school.id
          }
        });
      }
    }

    // 7. Create 3 Students for each school
    for (let i = 1; i <= 3; i++) {
      const studentName = generateStudentNames();
      const email = `student${i}_${school.short.toLowerCase()}@example.com`;
      
      const existingAccount = await prisma.account.findUnique({
        where: { email: email }
      });

      if (!existingAccount) {
        // Create account
        const account = await prisma.account.create({
          data: {
            email: email,
            password: hashedPassword,
            name: studentName,
            dob: new Date(2000, 1, 1),
            gender: Math.random() > 0.5 ? 'MALE' : 'FEMALE',
            phoneNumber: generateRandomPhoneNumber(),
            idCardNumber: generateRandomIdCard() + i.toString() + school.short,
            address: "Ho Chi Minh City, Vietnam",
            image: `https://i.pravatar.cc/150?u=${email}`,
          }
        });

        // Create student profile
        const studentCode = `STU-${school.short}-${i}-${Date.now().toString().slice(-4)}`;
        const student = await prisma.student.create({
          data: {
            studentCode: studentCode,
            degreeType: "HIGHSCHOOL",
            certificateType: "IELTS",
            certificateImg: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
            gradeType: "GPA",
            gradeScore: parseFloat((Math.random() * (4.0 - 2.5) + 2.5).toFixed(1)),
            cover: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f",
            status: "STUDYING",
            accountId: account.id,
            schoolId: school.id,
          }
        });

        // Add them to the first program and first location
        const programs = await prisma.schoolProgram.findMany({ where: { schoolId: school.id } });
        const locations = await prisma.schoolLocation.findMany({ where: { schoolId: school.id } });
        const scholarships = await prisma.schoolScholarship.findMany({ where: { schoolId: school.id } });

        if (programs.length > 0) {
          await prisma.studentSchoolProgram.create({
            data: {
              studentId: student.id,
              programId: programs[0].id
            }
          });
        }

        if (locations.length > 0) {
          await prisma.studentSchoolLocation.create({
            data: {
              studentId: student.id,
              locationId: locations[0].id
            }
          });
        }
        
        // Randomly assign scholarship
        if (scholarships.length > 0 && Math.random() > 0.5) {
          await prisma.studentSchoolScholarship.create({
            data: {
              studentId: student.id,
              scholarshipId: scholarships[0].id
            }
          });
        }
        
        console.log(`Created student ${studentName} (${email}) for school ${school.name}`);
      }
    }
    
    // Create some feedbacks
    const feedbacksCount = await prisma.feedback.count({ where: { schoolId: school.id } });
    if (feedbacksCount === 0) {
       await prisma.feedback.create({
         data: {
           name: generateStudentNames(),
           title: "Môi trường học tập tuyệt vời",
           type: "FEEDBACK",
           email: "student@example.com",
           message: "Tôi rất thích cơ sở vật chất ở đây, giáo viên thân thiện và hỗ trợ nhiệt tình.",
           schoolId: school.id
         }
       });
       await prisma.feedback.create({
         data: {
           name: generateStudentNames(),
           title: "Chương trình đào tạo hữu ích",
           type: "FEEDBACK",
           email: "student2@example.com",
           message: "Nhờ kỳ học ở đây tôi đã có kỹ năng vững chắc.",
           schoolId: school.id
         }
       });
    }
  }
  
  console.log("Seeding complete!");
}

main().catch(e => {
  console.error(e);
}).finally(async () => {
  await prisma.$disconnect();
});
