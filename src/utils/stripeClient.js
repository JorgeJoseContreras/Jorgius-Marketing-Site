const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/5kQ00j7WE5ew4BE7MjaVa00";

export const createStripeCheckoutSession = async (userEmail) => {
  // Directly use the official Stripe Payment Link created for Jorgius Pro ($4.99/mo)
  const url = new URL(STRIPE_PAYMENT_LINK);
  if (userEmail) {
    url.searchParams.append('prefilled_email', userEmail);
  }
  return url.toString();
};
