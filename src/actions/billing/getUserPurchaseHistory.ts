"use server";

import prisma from "@/lib/primsa";
import { auth } from "@clerk/nextjs/server";

export const GetUserPurchaseHistory = async () => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthenticated user");

  return prisma.userPurchase.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
};
