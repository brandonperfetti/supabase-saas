import { supabase } from '../../../utils/supabase'
// @ts-ignore
import cookie from 'cookie'
import Stripe from 'stripe'

// @ts-ignore
const handler = async (req, res) => {
  const { user } = await supabase.auth.api.getUserByCookie(req)

  if (!user) {
    return res.status(401).send('Unauthorized')
  }

  const token =
    req.headers.cookie && cookie.parse(req.headers.cookie)['sb-access-token']

  if (token) {
    supabase.auth.session = () => ({
      access_token: token,
      token_type: 'Bearer',
      user
    })
  }

  const {
    data: { stripe_customer }
  } = await supabase
    .from('profile')
    .select('stripe_customer')
    .eq('id', user.id)
    .single()

  const stripe = await new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15'
  })

  const { priceId } = req.query

  const lineItems = [
    {
      price: priceId,
      quantity: 1
    }
  ]

  const session = await stripe.checkout.sessions.create({
    customer: stripe_customer,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: lineItems,
    success_url: `${process.env.CLIENT_URL}/payment/success`,
    cancel_url: `${process.env.CLIENT_URL}/payment/cancelled`
  })

  res.send({
    id: session.id
  })
}

export default handler
