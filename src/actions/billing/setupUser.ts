"use server";

import prisma from "@/lib/primsa";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const SetupUser = async () => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthenticated user");

  const balance = await prisma.userBalance.findUnique({
    where: { userId },
  });
  if (!balance) {
    // free 100 credits
    await prisma.userBalance.create({
      data: {
        userId,
        credits: 100,
      },
    });
  }

  redirect("/");
};
