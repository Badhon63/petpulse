import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { productId, title, price, buyerEmail } = await req.json();

    if (!productId || !title || !price || !buyerEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const headersList = await headers();
    const origin = headersList.get("origin");

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
            },
            unit_amount: Math.round(Number(price) * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: buyerEmail,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&productId=${productId}`,
      cancel_url: `${origin}/checkout/${productId}`,
      metadata: {
        productId,
        buyerEmail,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const error = err as Error & { statusCode?: number };
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 },
    );
  }
}
