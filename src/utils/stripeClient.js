const STRIPE_PRO_PAYMENT_LINK = "https://buy.stripe.com/bJe4gz5Ow36o4BE5EbaVa02";
const STRIPE_ULTRA_PAYMENT_LINK = "https://buy.stripe.com/dRm5kD0uc8qIgkm1nVaVa03";

export const createStripeCheckoutSession = async (userEmail, plan = 'pro', userId = '') => {
  const link = plan === 'ultra' ? STRIPE_ULTRA_PAYMENT_LINK : STRIPE_PRO_PAYMENT_LINK;
  const url = new URL(link);
  if (userEmail) {
    url.searchParams.append('prefilled_email', userEmail);
  }
  if (userId) {
    url.searchParams.append('client_reference_id', userId);
  }
  const refCode = localStorage.getItem('jorgius_ref');
  if (refCode) {
    url.searchParams.append('ref_by', refCode);
  }
  return url.toString();
};
