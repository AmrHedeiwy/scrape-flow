"use server";

import prisma from "@/lib/primsa";
import { auth } from "@clerk/nextjs/server";

export const GetCredentialsForUser = async () => {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");

  return await prisma.credential.findMany({
    where: {
      userId,
    },
    orderBy: { name: "asc" },
  });
};
