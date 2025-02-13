"use server";

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/primsa";
import { Period } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

const { COMPLETED, FAILED } = WorkflowExecutionStatus;

export const GetStatsCardsValues = async (period: Period) => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthenticated user");

  const dataRange = PeriodToDateRange(period);
  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      startedAt: {
        gte: dataRange.startDate,
        lte: dataRange.endDate,
      },
      status: {
        in: [COMPLETED, FAILED],
      },
    },
    select: {
      creditsConsumed: true,
      phases: {
        where: {
          creditsConsumed: {
            not: null,
          },
        },
        select: {
          creditsConsumed: true,
        },
      },
    },
    orderBy: {
      startedAt: "asc",
    },
  });

  const stats = {
    workflowExecutions: executions.length,
    creditsConsumed: executions.reduce(
      (acc, execution) => acc + execution.creditsConsumed,
      0,
    ),
    phaseExecutions: executions.reduce((acc, execution) => {
      return acc + execution.phases.length;
    }, 0),
  };

  return stats;
};
