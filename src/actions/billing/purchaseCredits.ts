"use server";

import { getAppUrl } from "@/lib/helper/app-url";
import { stripe } from "@/lib/stripe/stripe";
import { getCreditsPack, PackId } from "@/types/billing";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const PurchaseCredits = async (packId: PackId) => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthenticated user");

  const selectedPack = getCreditsPack(packId);
  if (!selectedPack) throw new Error("invalid pack");

  const priceId = selectedPack.priceId;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    invoice_creation: { enabled: true },
    success_url: getAppUrl("billing"),
    cancel_url: getAppUrl("billing"),
    metadata: {
      userId,
      packId,
    },
    line_items: [{ quantity: 1, price: priceId }],
  });

  if (!session.url) throw new Error("cannot create stripe session");

  redirect(session.url);
};
