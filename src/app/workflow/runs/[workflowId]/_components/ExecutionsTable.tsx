"use client";

import { GetWorkflowExecutions } from "@/actions/getWorkflowExecutions";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatesToDurationString } from "@/lib/helper/dates";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import ExecutionStatusIndicator from "./ExecutionStatusIndicator";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { Coins } from "lucide-react";
import { ICON_SIZE } from "@/constants/icon-size";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

type TInitalData = Awaited<ReturnType<typeof GetWorkflowExecutions>>;

const ExecutionsTable = ({
  workflowId,
  initialData,
}: {
  workflowId: string;
  initialData: TInitalData;
}) => {
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["executions", workflowId],
    initialData,
    queryFn: () => GetWorkflowExecutions(workflowId),
    refetchInterval: 5000, // 5 seconds
  });

  return (
    <div className="overflow-auto rounded-lg border shadow-md">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Consumed</TableHead>
            <TableHead className="text-right text-xs text-muted-foreground">
              Started at (desc)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="h-full gap-2 overflow-auto">
          {data.map((execution) => {
            const duration = DatesToDurationString(
              execution.completedAt,
              execution.startedAt,
            );
            const formattedStartedAt =
              execution.startedAt &&
              formatDistanceToNow(execution.startedAt, { addSuffix: true });

            return (
              <TableRow
                key={execution.id}
                className="cursor-pointer"
                onClick={() =>
                  router.push(
                    `/workflow/runs/${execution.workflowId}/${execution.id}`,
                  )
                }
              >
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold">{execution.id}</span>
                    <div className="text-xs text-muted-foreground">
                      <span>Triggered via</span>
                      <Badge variant="outline">{execution.trigger}</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <ExecutionStatusIndicator
                          status={execution.status as WorkflowExecutionStatus}
                        />
                        <span className="font-semibold capitalize">
                          {execution.status}
                        </span>
                      </div>
                      <div className="mx-5 text-xs text-muted-foreground">
                        {duration}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Coins size={ICON_SIZE.S} className="text-primary" />
                        <span className="font-semibold capitalize">
                          {execution.creditsConsumed}
                        </span>
                      </div>
                      <div className="mx-5 text-xs text-muted-foreground">
                        Credits
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formattedStartedAt}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExecutionsTable;
