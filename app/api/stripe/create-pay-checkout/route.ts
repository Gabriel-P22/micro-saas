import { auth } from "@/app/lib/auth";
import stripe from "@/app/lib/stripe";
import { getOrCreateCustomer } from "@/app/server/stripe/get-customer-id";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { testId, customerEmail } = await req.json();

    const price = process.env.STRIPE_PRODUCT_PRICE_ID;

    const metadata = {
        testId,
        price
    };

    if(!price) {
        return NextResponse.json({ error: "Price not found"}, { status: 500 });
    };

    const session = await auth();
    const userId = session?.user?.id as string;
    const userEmail = session?.user?.email as string;

    if(!userId || !userEmail) {
        return NextResponse.json({ error: "Unathorized"}, { status: 401 });
    };

    const customerId = await getOrCreateCustomer(userId, userEmail);
    
    try {

        const session = await stripe.checkout.sessions.create({
            line_items: [{ price, quantity: 1}],
            mode: "payment",
            payment_method_types: ["card", "boleto"],
            success_url: `${req.headers.get("origin")}/success`,
            cancel_url: `${req.headers.get("origin")}/`,
            ...(customerEmail && { customer_email: customerEmail}),
            metadata,
            customer: customerId
        });

        if (!session.url) {
            return NextResponse.json({ error: "Session URL not found"}, { status: 500 });
        }

        return NextResponse.json({id: session.id }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.error();
    };
}