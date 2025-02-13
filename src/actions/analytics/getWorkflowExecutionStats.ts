"use server";

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/primsa";

import { auth } from "@clerk/nextjs/server";

import { Period } from "@/types/analytics";
import { eachDayOfInterval, format } from "date-fns";
import { WorkflowExecutionStatus } from "@/types/workflow";

type Stats = Record<string, { success: number; failed: number }>;

export const GetWorkflowExecutionStats = async (period: Period) => {
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
    },
  });

  const dateFormat = "yyyy-MM-dd";

  const stats: Stats = eachDayOfInterval({
    start: dataRange.startDate,
    end: dataRange.endDate,
  })
    .map((date) => format(date, dateFormat))
    .reduce((acc, date) => {
      acc[date] = {
        success: 0,
        failed: 0,
      };

      return acc;
    }, {} as any);

  executions.forEach((execution) => {
    const date = format(execution.startedAt!, dateFormat);
    if (execution.status === WorkflowExecutionStatus.COMPLETED) {
      ++stats[date].success;
    }
    if (execution.status === WorkflowExecutionStatus.FAILED) {
      ++stats[date].failed;
    }
  });

  const result = Object.entries(stats).map(([date, infos]) => ({
    date,
    ...infos,
  }));

  return result;
};
