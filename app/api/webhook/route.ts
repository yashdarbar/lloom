import Stripe from "stripe";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
//import { db } from "@/lib/db";

const db = new PrismaClient();

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;
    let event: Stripe.Event;

    try {
        event = Stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`webhook error: ${error.message}`, {
            status: 400,
        });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;

    if (event.type === "checkout.session.completed") {
        if (!userId || !courseId) {
            return new NextResponse("webhook error: missing metadata", {
                status: 400,
            });
        }

        await db.purchase.create({
            data: {
                userId: userId,
                courseId: courseId,
            },
        });
    } else {
        return new NextResponse(
            `webhook error: unhandled event tyep ${event.type}`,
            { status: 200 }
        );
    }
    return new NextResponse(null, { status: 200 });
}
