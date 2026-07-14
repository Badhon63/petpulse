import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";

async function createOrderOnServer(
  productId: string,
  buyerEmail: string,
  buyerName: string,
) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, buyerEmail, buyerName, paid: true }),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; productId?: string }>;
}) {
  const { session_id, productId } = await searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const { status, customer_details } = session;
  const customerEmail = customer_details?.email;
  const customerName = customer_details?.name || "";

  if (status === "open") {
    redirect("/");
  }

  if (status === "complete" && productId && customerEmail) {
    await createOrderOnServer(productId, customerEmail, customerName);

    return (
      <div className="max-w-md mx-auto px-4 py-20 grow flex items-center justify-center">
        <div className="bg-white border border-gray-100 rounded-3xl p-4 sm:p-10 shadow-sm text-center w-full">
          <div className="text-4xl mb-3">🎉</div>
          <h1 className="text-xl font-bold text-gray-950 tracking-tight">
            Payment Successful!
          </h1>
          <p className="text-gray-400 text-xs mt-2 mb-6">
            We appreciate your business! A confirmation has been sent to{" "}
            <span className="font-semibold text-gray-700">{customerEmail}</span>
            .
          </p>
          <a
            href="/dashboard/user/orders/mine"
            className="inline-block bg-amber-500 text-white px-5 py-2 rounded-xl hover:bg-amber-600 shadow-sm transition font-bold text-sm"
          >
            View My Orders
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <p className="text-gray-500 font-medium">
        Something went wrong confirming your payment.
      </p>
    </div>
  );
}
