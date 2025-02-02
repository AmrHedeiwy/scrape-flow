"use server";

import prisma from "@/lib/primsa";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const DeleteCredential = async (name: string) => {
  const { userId } = auth();
  if (!userId) throw new Error("Not authenticated");

  await prisma.credential.delete({
    where: {
      userId_name: {
        name,
        userId,
      },
    },
  });

  revalidatePath("/credentials");
};
