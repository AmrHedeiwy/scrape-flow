import React, { Suspense } from "react";

import { ArrowLeftRight, CoinsIcon } from "lucide-react";

import { GetAvailableCredits } from "@/actions/billing/getAvailableCredits";

import ReactCountupWrapper from "@/components/ReactCountupWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import CreditsPuchase from "./_components/CreditsPuchase";
import { Period } from "@/types/analytics";
import { GetCreditsUsageInPeriod } from "@/actions/analytics/getCreditsUsageInPeriod";
import CreditsUsageChart from "../(home)/_components/CreditsUsageChart";
import { GetUserPurchaseHistory } from "@/actions/billing/getUserPurchaseHistory";
import InvoiceButton from "./_components/InvoiceButton";

const BillingPage = () => {
  return (
    <div className="mx-auto space-y-8 p-4">
      <h1 className="text-3xl font-bold">Billing</h1>
      <Suspense fallback={<Skeleton className="h-[166px] w-full" />}>
        <BalanceCard />
      </Suspense>
      <CreditsPuchase />
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <CreditsUsageCard />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
        <TransactionHistoryCard />
      </Suspense>
    </div>
  );
};

const BalanceCard = async () => {
  const userBalance = await GetAvailableCredits();
  return (
    <Card className="flex flex-col justify-between overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background shadow-lg">
      <CardContent className="relative items-center p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="mb-1 text-lg font-semibold text-foreground">
              Available Credits
            </h3>

            <p className="text-4xl font-bold text-primary">
              <ReactCountupWrapper value={userBalance} />
            </p>
          </div>
          <CoinsIcon
            size={140}
            className="absolute bottom-0 right-0 text-primary opacity-20"
          />
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        When your credit balance reaches zero, your workflows will stop working
      </CardFooter>
    </Card>
  );
};

const CreditsUsageCard = async () => {
  // get usage for the current month to give user a better sense of how much credits they might need to purchase
  const period: Period = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  };

  const data = await GetCreditsUsageInPeriod(period);
  return (
    <CreditsUsageChart
      data={data}
      title="Credits consumed"
      description="Daily credits consumed in the current month"
    />
  );
};

const TransactionHistoryCard = async () => {
  const purchases = await GetUserPurchaseHistory();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <ArrowLeftRight className="h-6 w-6 text-primary" />
          Transaction History
        </CardTitle>
        <CardDescription>
          View your transaction history and download invoices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {purchases.length === 0 && (
          <p className="text-muted-foreground">No transations yet</p>
        )}
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="flex items-center justify-between border-b py-3 last:border-b-0"
          >
            <div>
              <p className="font-medium">{formatDate(purchase.date)}</p>
              <p className="text-sm text-muted-foreground">
                {purchase.description}
              </p>
            </div>

            <div className="text-right">
              <p className="font-medium">
                {formatAmount(purchase.amount, purchase.currency)}
              </p>
              <InvoiceButton id={purchase.id} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const formatAmount = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount / 100);
};

export default BillingPage;
