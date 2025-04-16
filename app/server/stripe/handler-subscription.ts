import { db } from "@/app/lib/firebase";
import { subscribe } from "diagnostics_channel";
import "server-only";

import Stripe from "stripe";

export async function handlerStripeSubscription(event: Stripe.CheckoutSessionCompletedEvent) {
    if (event.data.object.payment_status === "paid") {
        console.log("Access completed. Send email to customer");

        const metadata = event.data.object.metadata;

        const userId = metadata?.userId;

        if (!userId) {
            console.log("User ID not found");
            return;
        }

        await db.collection("users").doc(userId).update({
            stripeSubscriptionId: event.data.object.subscription,
            subscriptionStatus: "active"
        });
    }
}