import { db } from "@/app/lib/firebase";
import "server-only";

import Stripe from "stripe";

export async function handlerStripeCancelSubscribe(event: Stripe.CustomerSubscriptionDeletedEvent) {
    console.log("Access removed. Subscription removed and email sent to customer");
            
    const customerId = event.data.object.customer;

    const userRef = await db.collection("users").where("stripeCustomerId", "==", customerId).get();

    if (!userRef.empty) {
        console.log("User not found");
        return;
    }

    const userId = userRef.docs[0].id;

    await db.collection("users").doc(userId).update({
        subscriptionStatus: "inactive"
    });
}