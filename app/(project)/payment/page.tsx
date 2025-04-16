"use client";

import { useStripe } from "@/app/hooks/useStripe";

export default function payment() {
    const {
        createPaymentStripeCheckout,
        createSubscriptionStripeCheckout,
        hadleCreateStripePortal
    } = useStripe();


    return (
        <div className="flex flex-col gap-10 items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Protected dashboard</h1>
            <button className="border round-md px-1" onClick={() => {
                createPaymentStripeCheckout({
                    testId: "123"
                })
            }}>Create payment with Stripe</button>

            <button className="border round-md px-1" onClick={() => {
                createSubscriptionStripeCheckout({
                    testId: "123"
                })
            }}>Create subscription with Stripe</button>
            
            <button className="border round-md px-1" onClick={() => {
                hadleCreateStripePortal({
                    testId: "123"
                })
            }}> Create payment portal with Stripe</button>
        </div>
    );
}