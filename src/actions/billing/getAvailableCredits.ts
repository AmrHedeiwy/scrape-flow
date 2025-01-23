"use server";

import prisma from "@/lib/primsa";
import { auth } from "@clerk/nextjs/server";

export const GetAvailableCredits = async () => {
  const { userId } = auth();

  if (!userId) throw new Error("Unauthenticated user");

  const balance = await prisma.userBalance.findUnique({
    where: { userId },
  });

  return !balance ? -1 : balance.credits;
};
