import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price: "price_1RHto6FRobeeSk133ILNtspx", // PRICE ID 
          quantity: 1,
        },
      ],
      metadata: { name },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/retrospectiva/${encodeURIComponent(email)}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pagamento?cancel=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Erro ao criar sessão Stripe:", error);
    return NextResponse.json({ error: "Erro ao criar pagamento" }, { status: 500 });
  }
}
