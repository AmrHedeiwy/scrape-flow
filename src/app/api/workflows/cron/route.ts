import { getAppUrl } from "@/lib/helper/app-url";
import prisma from "@/lib/primsa";
import { WorkflowStatus } from "@/types/workflow";

export async function GET(request: Request) {
  const now = new Date();
  const workflows = await prisma.workflow.findMany({
    select: { id: true },
    where: {
      status: WorkflowStatus.PUBLISHED,
      cron: { not: null },
      nextRunAt: { lte: now },
    },
  });

  for (const workflow of workflows) {
    triggerWorkflow(workflow.id);
  }

  return Response.json({ workflows: workflows }, { status: 200 });
}

function triggerWorkflow(workflowId: string) {
  const triggerApiUrl = getAppUrl(
    `api/workflows/execute?workflowId=${workflowId}`,
  );

  fetch(triggerApiUrl, {
    headers: { Authorization: `Bearer ${process.env.API_SECRET!}` },
    cache: "no-store",
    // signal: AbortSignal.timeout(5000), // timeout, @default 60 seconds
  }).catch((error) => {
    console.error(
      "Error triggering workflow with id:",
      workflowId,
      ":error->",
      error.message,
    );
  });
}
