"use server";

import prisma from "@/lib/primsa";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const DeleteWorkflow = async (id: string) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await prisma.workflow.delete({
    where: {
      id,
      userId,
    },
  });

  revalidatePath("/workflows");
};
