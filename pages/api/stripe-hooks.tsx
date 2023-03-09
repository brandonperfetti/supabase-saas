import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { buffer } from 'micro'
import { getServiceSupabase, supabase } from '../../utils/supabase'

export const config = { api: { bodyParser: false } }

// @ts-ignore
const handler = async (req, res: NextApiResponse) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15'
  })
  const signature = req.headers['stripe-signature']
  const signingSecret = process.env.STRIPE_SIGNING_SECRET!
  const reqBuffer = await buffer(req)

  let event

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret)
  } catch (error) {
    console.log('error', error)
    // @ts-ignore
    return res.status(400).send(`Webhook error: ${error.message}`)
  }
  const supabase = getServiceSupabase()
  switch (event.type) {
    case 'customer.subscription.updated':
      await supabase
        .from('profile')
        .update({
          is_subscribed: true,
          // @ts-ignore
          interval: event.data.object.items.data[0].plan.interval
        })
        // @ts-ignore
        .eq('stripe_customer', event.data.object.customer)
      break
    case 'customer.subscription.deleted':
      await supabase
        .from('profile')
        .update({
          is_subscribed: false,
          // @ts-ignore
          interval: null
        })
        // @ts-ignore
        .eq('stripe_customer', event.data.object.customer)
      break
  }
  console.log('event', event)

  res.send({ received: true })
}

export default handler
