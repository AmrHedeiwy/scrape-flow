import ReactCountupWrapper from "@/components/ReactCountupWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import React from "react";

const StatsCard = ({
  title,
  icon: Icon,
  value,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
}) => {
  return (
    <Card className="relative h-full overflow-hidden">
      <CardHeader className="flex pb-2">
        <CardTitle>{title}</CardTitle>
        <Icon
          size={120}
          className="absolute -bottom-4 -right-8 stroke-primary text-muted-foreground opacity-10"
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">
          <ReactCountupWrapper value={value} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
