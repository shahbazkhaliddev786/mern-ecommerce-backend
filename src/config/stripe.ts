import Stripe from 'stripe';
import config from './config.js';

export const stripeClient = new Stripe(config.STRIPE_SECRET);