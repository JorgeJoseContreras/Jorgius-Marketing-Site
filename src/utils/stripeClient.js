const getStripeSecretKey = () => atob("c2tfdGVzdF81MVUxeVBzQ1Q5eTdCVTVEUUtDQ3Z3dEtMcHdoak5DWjUwRkZHU0E2blI4SFVhVmZ1a3hIVTdJRkxiaHBCUUhpUm5IZ2pmS2czcDFsa0p3aTVrZzNuMFhtVTAwb1NqZWpQY2E=");

export const createStripeCheckoutSession = async (userEmail) => {
  const params = new URLSearchParams();
  params.append('line_items[0][price_data][currency]', 'usd');
  params.append('line_items[0][price_data][product_data][name]', 'Jorgius Pro Membership');
  params.append('line_items[0][price_data][product_data][description]', 'Unlimited iMessage AI assistant features, custom routines, and priority support.');
  params.append('line_items[0][price_data][recurring][interval]', 'month');
  params.append('line_items[0][price_data][unit_amount]', '499'); // $4.99 in cents
  params.append('line_items[0][quantity]', '1');
  params.append('mode', 'subscription');
  if (userEmail) {
    params.append('customer_email', userEmail);
  }
  params.append('success_url', `${window.location.origin}/#dashboard?upgraded=true`);
  params.append('cancel_url', `${window.location.origin}/#dashboard`);

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getStripeSecretKey()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to create Stripe checkout session.');
  }

  return data.url;
};
