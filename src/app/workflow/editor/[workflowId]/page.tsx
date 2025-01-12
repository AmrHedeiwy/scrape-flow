import { waitFor } from "@/lib/helper/waitFor";
import prisma from "@/lib/primsa";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import React from "react";
import Editor from "../../_components/Editor";

const Page = async ({ params }: { params: { workflowId: string } }) => {
  const { workflowId } = params;
  const { userId } = auth();

  if (!userId) return <div>unauthenticated</div>;

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  });

  if (!workflow) return notFound();

  return <Editor workflow={workflow} />;
};

export default Page;
