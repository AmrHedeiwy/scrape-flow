import { getCreditsPack, PackId } from "@/types/billing";
import { writeFile } from "fs";
import "server-only";

import Stripe from "stripe";
import prisma from "../primsa";

export const HandleCheckoutSessionCompleted = async (
  event: Stripe.Checkout.Session,
) => {
  if (!event.metadata) throw new Error("missing metadata");
  const { userId, packId } = event.metadata;

  if (!userId) throw new Error("missing user id");
  if (!packId) throw new Error("missing pack id");

  const purchasePack = getCreditsPack(packId as PackId);
  if (!purchasePack) throw new Error("purchase pack not found");

  await prisma.userBalance.upsert({
    where: {
      userId: userId,
    },
    create: {
      userId,
      credits: purchasePack.credits,
    },
    update: {
      credits: {
        increment: purchasePack.credits,
      },
    },
  });

  await prisma.userPurchase.create({
    data: {
      userId,
      stripeId: event.id,
      description: `${purchasePack.name} - ${purchasePack.credits} credits`,
      amount: event.amount_total!,
      currency: event.currency!,
    },
  });
};
