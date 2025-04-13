"use server";

import prisma from "@/db/db";

const sampleArticles = [
  // Original articles
  {
    title:
      "Tech Giants Agree to New AI Safety Measures Following White House Summit",
    content:
      "Seven leading technology companies have committed to new AI safety measures during a meeting at the White House. The voluntary commitments include testing AI systems for security risks before release, sharing information about AI safety, and investing in cybersecurity. The Biden administration pushed for the measures amid growing concerns about AI's potential risks.",
    imageUrls: [
      "https://images.unsplash.com/photo-1496979551903-46e46589a88b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
    ],
    videoUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    isVideo: true,
    source: "The Washington Post",
    sourceLogoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/The_Logo_of_The_Washington_Post_Newspaper.svg/512px-The_Logo_of_The_Washington_Post_Newspaper.svg.png",
    categoryId: 3, // Technology
  },
  {
    title: "New Study Reveals Promising Treatment for Alzheimer's Disease",
    content:
      "Researchers at Johns Hopkins University have discovered a new treatment approach that significantly slows Alzheimer's progression in clinical trials. The treatment targets specific protein formations in the brain responsible for neural degeneration. In the 18-month study involving 412 patients, those receiving the treatment showed 47% less cognitive decline compared to the control group.",
    imageUrls: [
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
    ],
    source: "National Health Journal",
    sourceLogoUrl: null,
    categoryId: 6, // Health
  },
  {
    title: "NBA Finals MVP Signs Record-Breaking Contract Extension",
    content:
      'The reigning NBA Finals MVP has signed a five-year contract extension worth $290 million with his current team, making it the largest deal in league history. The 28-year-old superstar led his team to their first championship in franchise history last season, averaging 31.2 points per game in the playoffs. Team officials called the signing "our top priority".',
    imageUrls: [
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
    ],
    source: "ESPN",
    sourceLogoUrl:
      "https://a.espncdn.com/combiner/i?img=%2Fi%2Fespn%2Fespn_logos%2Fespn_red.png",
    categoryId: 7, // Sports
  },
  {
    title:
      "Central Bank Holds Interest Rates Steady Despite Inflation Concerns",
    content:
      "The Federal Reserve announced today it will maintain current interest rates, despite inflation running above its 2% target. In the press conference, the Fed Chair cited improving labor market conditions and expectations that inflation will moderate in coming months. Market analysts had widely expected this decision, though some critics argue the central bank is risking prolonged inflation.",
    imageUrls: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
    ],
    source: "Financial Times",
    sourceLogoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Financial_Times_corporate_logo.svg/640px-Financial_Times_corporate_logo.svg.png",
    categoryId: 4, // Business
  },

  // Gondia-specific news articles
  {
    title: "Gondia Rice Festival Celebrates Record Harvest",
    content:
      "The annual Gondia Rice Festival drew record crowds this weekend, celebrating the district's bumper crop. Local farmers reported a 15% increase in yield compared to last year despite challenging weather conditions. The event featured traditional dances, cooking competitions, and agricultural exhibitions. Agriculture minister praised Gondia's innovative farming techniques during the inauguration ceremony.",
    imageUrls: [
      "https://images.unsplash.com/photo-1536617621572-1d5f1e6269a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
    ],
    source: "Lokmat Times",
    sourceLogoUrl: null,
    categoryId: 9, // Gondia
  },
  {
    title: "Gondia Education Hub: New Engineering College Approved",
    content:
      "The Maharashtra State Government has approved the establishment of a new engineering college in Gondia district. The institution, set to open next academic year, will offer specialized programs in agricultural engineering and renewable energy technology. This development is part of the state's initiative to create educational opportunities in rural areas and support local industries.",
    imageUrls: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
    ],
    source: "Maharashtra Times",
    sourceLogoUrl: null,
    categoryId: 9, // Gondia
  },
  {
    title: "Gondia Wildlife Sanctuary Reports Increase in Tiger Population",
    content:
      "Recent wildlife census at Navegaon-Nagzira Tiger Reserve in Gondia district shows a 20% increase in tiger population over the last two years. Conservation efforts, anti-poaching measures, and habitat restoration have contributed to this success. The sanctuary has also seen growth in populations of other endangered species, making it a biodiversity hotspot in central India.",
    imageUrls: [
      "https://images.unsplash.com/photo-1549366021-9f761d450615?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",

      "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
      "https://images.unsplash.com/photo-1543682704-15fd2a5b320d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
      "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
    ],
    source: "National Geographic India",
    sourceLogoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/National_Geographic_Channel.svg/640px-National_Geographic_Channel.svg.png",
    categoryId: 9, // Gondia
  },
  {
    title: "Gondia Railway Station to Get Major Upgrade",
    content:
      "Indian Railways has announced a ₹45 crore modernization project for Gondia Junction railway station. The project includes new platforms, improved passenger amenities, and digital ticketing systems. Work is scheduled to begin next month and will be completed in phases to minimize disruption to train services. This upgrade recognizes Gondia's importance as a key railway junction in eastern Maharashtra.",
    imageUrls: [
      "https://images.unsplash.com/photo-1474487548417-781cb71495f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
    ],
    source: "Indian Railways News",
    sourceLogoUrl: null,
    categoryId: 9, // Gondia
  },
  {
    title: "Gondia Launches Innovative Water Conservation Project",
    content:
      "The Gondia District Administration has initiated a pioneering water conservation project that combines traditional knowledge with modern technology. The project involves the restoration of ancient water bodies, construction of check dams, and implementation of drip irrigation systems. Community participation has been remarkable, with over 200 villages actively involved in the initiative.",
    imageUrls: [
      "https://images.unsplash.com/photo-1436262513933-a0b06755c784?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
    ],
    source: "Maharashtra Water Resources",
    sourceLogoUrl: null,
    categoryId: 9, // Gondia
  },

  // Additional Maharashtra news
  {
    title: "Maharashtra Government Announces New Startup Policy",
    content:
      "The Maharashtra cabinet has approved a comprehensive new startup policy aimed at establishing the state as India's premier startup hub. The policy includes tax benefits, simplified regulatory procedures, and a ₹500 crore venture fund. Special incentives are offered for startups in rural areas and those founded by women entrepreneurs. The government aims to support 10,000 startups over the next five years.",
    imageUrls: [
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
    ],
    source: "Economic Times",
    sourceLogoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/The_Economic_Times_logo.svg/640px-The_Economic_Times_logo.svg.png",
    categoryId: 10, // Maharashtra
  },
  {
    title: "Maharashtra Schools Implement New Digital Learning Initiative",
    content:
      "Over 5,000 schools across Maharashtra will implement an innovative digital learning program starting next academic year. The initiative includes tablet distribution to students, interactive smart classrooms, and teacher training in digital pedagogy. The program aims to bridge the urban-rural educational divide and prepare students for an increasingly digital workplace.",
    imageUrls: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80",
    ],
    source: "Maharashtra Education",
    sourceLogoUrl: null,
    categoryId: 11, // Education
  },
];

async function seed() {
  const defaultUser = await prisma.user.upsert({
    where: { username: "demoUser" },
    update: {},
    create: {
      username: "demoUser",
      password: "password123",
      role: "PUBLISHER",
    },
  });

  const defaultCategory = await prisma.category.upsert({
    where: { name: "demoCategory" },
    update: {},
    create: {
      name: "demoCategory",
    },
  });

  let inserted = 0;

  for (const article of sampleArticles) {
    if (!article.categoryId) {
      console.warn(
        `⚠️ Skipping article "${article.title}" due to missing categoryId`
      );
      continue;
    }

    const exists = await prisma.article.findFirst({
      where: { title: article.title },
    });
    if (exists) {
      console.log(`⏭ Skipping "${article.title}" (already exists)`);
      continue;
    }

    await prisma.article.create({
      data: {
        ...article,
        categoryId: defaultCategory.id,
        author: "system",
        submittedById: defaultUser.id,
      },
    });

    inserted++;
  }

  console.log(`✅ Seeded ${inserted} articles`);
}
