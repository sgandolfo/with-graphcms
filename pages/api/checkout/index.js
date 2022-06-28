import Stripe from 'stripe';
import graphql from '../../../lib/graphql';
import getProductDetailById from '../../../lib/graphql/queries/getProductDetailsById';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const shipping_address_collection = {
  allowed_countries: ['BE', 'US'],
};

export const shipping_options = [
  {
    shipping_rate_data: {
      type: 'fixed_amount',
      fixed_amount: {
        amount: 0,
        currency: 'EUR'
      },
      display_name: 'Free Shipping',
      delivery_estimate: {
        minimum: {
          unit: 'business_day',
          value: 3
        },
        maximum: {
          unit: 'business_day',
          value: 5
        },
      },
    },
  },
  {
    shipping_rate_data: {
      type: 'fixed_amount',
      fixed_amount: {
        amount: 499,
        currency: 'EUR'
      },
      display_name: 'Next day air',
      delivery_estimate: {
        minimum: {
          unit: 'business_day',
          value: 1
        },
        maximum: {
          unit: 'business_day',
          value: 1
        },
      },
    },
  }
];

const handler = async (req, res) => {
  const { items } = req.body;
  const { products } = await graphql.request(getProductDetailById, {
    ids: Object.keys(items)
  });

  const line_items = products.map((product) => ({
    // User can change the quantity during checkout
    adjustable_quantity: {
      enabled: true,
      minimum: 1
    },
    price_data: {
      // of course, it can be any currency of your choice
      currency: 'EUR',
      product_data: {
        name: product.name,
        images: product.images.map((img) => img.url),
      },
      // Please note that GraphCMS already returns the price in the format required by Stripe: €4.99, for instance, shouldbe
      // passed to Stripe as 499
      unit_amount: product.price,
    },
    quantity: items[product.id],
  }));

  const session = await stripe.checkout.sessions.create({
    mode: 'payment', // can also be 'subscription' or 'setup'
    line_items,
    payment_method_types: ['card', 'sepa_debit'],
    shipping_address_collection,
    shipping_options,
    // The server doesn't know the current URL, so we need to
    // write it into an environment variable depending on the current environment
    // Locally, it should be URL=http://localhost:3000
    success_url: `${process.env.URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.URL}/cart`,
  });

  res.status(200).json({ session });
};

export default handler;