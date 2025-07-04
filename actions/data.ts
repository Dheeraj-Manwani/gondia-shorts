"use server";

import prisma from "@/db/db";
import { ArticleType } from "@prisma/client/index.js";
import { sampleArticles } from "@/lib/data";

export async function seed() {
  const defaultUser = await prisma.user.upsert({
    where: { email: "demoUser@demo.com" },
    update: {},
    create: {
      name: "demoUser",
      password: "password123",
      role: "PUBLISHER",
      email: "demoUser@demo.com",
      number: "1234567890",
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

    console.log(`creating "${article.title}" 🟡`);
    await prisma.article.create({
      data: {
        ...article,
        slug: article.slug || article.title.toLowerCase().replace(/\s+/g, "-"),
        type: (article.type as ArticleType) || "IMAGE",
        categoryId: defaultCategory.id,
        author: "system",
        submittedById: defaultUser.id,
        sourceLogoUrl: article.sourceLogoUrl || "https://example.com/logo.png",
        source: article.source || "Demo Source",
      },
    });

    inserted++;
  }

  console.log(`✅ Seeded ${inserted} articles`);
}
