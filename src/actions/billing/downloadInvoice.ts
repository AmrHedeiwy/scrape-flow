"use server";

import prisma from "@/lib/primsa";
import { stripe } from "@/lib/stripe/stripe";

import { auth } from "@clerk/nextjs/server";

export const DownloadInvoice = async (id: string) => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthenticated user");

  const purchase = await prisma.userPurchase.findUnique({
    where: {
      id,
      userId,
    },
  });
  if (!purchase) throw new Error("bad request");

  const session = await stripe.checkout.sessions.retrieve(purchase.stripeId);

  if (!session.invoice) throw new Error("invoice not found");

  const invoice = await stripe.invoices.retrieve(session.invoice as string);

  return invoice.hosted_invoice_url;
};
