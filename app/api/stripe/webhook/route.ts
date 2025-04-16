import stripe from "@/app/lib/stripe";
import { handlerStripeCancelSubscribe } from "@/app/server/stripe/handler-cancel";
import { handlerStripeSubscription } from "@/app/server/stripe/handler-subscription";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const secret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
    try {

    const body = await req.text();

    const headersList = await headers();

    const signature = headersList.get("stripe-signature");

    if (!signature || !secret) {
        return NextResponse.json({ error: "No signature or secret" }, { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(body, signature, secret)

    switch (event.type) {
        case "checkout.session.completed":
            const metadata = event.data.object.metadata;

            if (metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID) {
                await handlerStripePayment(event);
            }

            if (metadata?.price === process.env.STRIPE_SUBSCRIPTION_ID) {
                await handlerStripeSubscription(event);
            }

            break;
        case "checkout.session.expired":
            console.log("Payment expire");
            break;
        case "checkout.session.async_payment_succeeded":
            break;
        case "checkout.session.async_payment_failed":
            break;
        case "customer.subscription.created":
            console.log("Wellcome to micro saas");
            break;
        case "customer.subscription.deleted":
            await handlerStripeCancelSubscribe(event);
            break;
        default:
            console.log(`unhandled event type ${event.type}`);
            break;
    }

    return NextResponse.json({ message: "Webhook received"}, { status: 200 });

    } catch (error) {

    }
}

function handlerStripePayment(event: Stripe.CheckoutSessionCompletedEvent) {
    throw new Error("Function not implemented.");
}
