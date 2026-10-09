import { supabase } from "./supabase";

export async function startPayment(
  amountKobo: number,
  description: string
) {
  const { data: { session }, error } =
    await supabase.auth.getSession();

  if (error || !session) {
    throw new Error("Please sign in first.");
  }

  const response = await fetch(
    "/.netlify/functions/initialize-payment",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        amountKobo,
        description
      })
    }
  );

  const result = await response.json();

  if (!response.ok || !result.checkoutUrl) {
    throw new Error(result.error ?? "Unable to start payment.");
  }

  window.location.assign(result.checkoutUrl);
}
