"use server";

import { symmtericEncrypt } from "@/lib/encryption";
import prisma from "@/lib/primsa";
import {
  CreateCredentialsSchema,
  TCreateCredentialsSchema,
} from "@/schema/credential";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const CreateCredential = async (form: TCreateCredentialsSchema) => {
  const { success, data } = CreateCredentialsSchema.safeParse(form);
  if (!success) throw new Error("Invalid form data");

  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const encryptedValue = symmtericEncrypt(data.value);
  const result = await prisma.credential.create({
    data: {
      userId,
      name: data.name,
      value: encryptedValue,
    },
  });

  if (!result) throw new Error("Failed to create credential");

  revalidatePath("/credentials");
};
