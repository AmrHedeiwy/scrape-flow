"use client";

import React from "react";

import { Area, Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartColumnStackedIcon } from "lucide-react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { GetCreditsUsageInPeriod } from "@/actions/analytics/getCreditsUsageInPeriod";

type ChartData = Awaited<ReturnType<typeof GetCreditsUsageInPeriod>>;
const chartConfig = {
  success: {
    label: "Successfull Phases Credits",
    color: "hsl(var(--chart-2))",
  },
  failed: {
    label: "Failed Phases Credits",
    color: "hsl(var(--chart-1))",
  },
};

const CreditsUsageChart = ({
  data,
  title,
  description,
}: {
  data: ChartData;
  title: string;
  description: string;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <ChartColumnStackedIcon className="h-6 w-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-[200px] w-full" config={chartConfig}>
          <BarChart
            data={data}
            height={200}
            accessibilityLayer
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={"date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip
              content={<ChartTooltipContent className="w-[250px]" />}
            />
            <Bar
              fillOpacity={0.8}
              radius={[0, 0, 4, 4]}
              fill="var(--color-success)"
              stroke="var(--color-success)"
              dataKey={"success"}
              stackId={"a"}
            />
            <Bar
              fillOpacity={0.8}
              radius={[4, 4, 0, 0]}
              fill="var(--color-failed)"
              stroke="var(--color-failed)"
              dataKey={"failed"}
              stackId={"b"}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CreditsUsageChart;
