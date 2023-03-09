import Stripe from 'stripe'
import { useUser } from '../context/user'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'

// @ts-ignore
const Pricing = ({ plans }) => {
  // @ts-ignore
  const { user, login, isLoading } = useUser()

  // @ts-ignore
  const processSubscription = (planId) => async () => {
    const { data } = await axios.get(`/api/subscription/${planId}`)
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)
    await stripe?.redirectToCheckout({ sessionId: data?.id })
  }

  const showSubscribeButton = !!user && !user.is_subscribed
  const showCreateAccountButton = !user
  const showManageSubscriptionButton = !!user && user.is_subscribed

  return (
    <div className="w-full max-w-3xl mx-auto py-16 flex justify-around">
      {/* @ts-ignore */}
      {plans.map((plan) => (
        <div key={plan.id} className="w-80 h-40 rounded shadow px-6 py-4">
          <h2 className="text-xl">{plan.name}</h2>
          <p className="text-gray-500">
            ${plan.price / 100} / {plan.interval}
          </p>
          {!isLoading && (
            <div>
              {showSubscribeButton && (
                <button onClick={processSubscription(plan.id)}>
                  Subscribe
                </button>
              )}
              {showCreateAccountButton && (
                <button onClick={login}>Create Account</button>
              )}
              {showManageSubscriptionButton && (
                <Link href="/dashboard">Manage Subscription</Link>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export const getStaticProps = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15'
  })

  const { data: prices } = await stripe.prices.list()

  const plans = await Promise.all(
    prices.map(async (price) => {
      // @ts-ignore
      const product = await stripe.products.retrieve(price.product)
      return {
        id: price.id,
        name: product.name,
        price: price.unit_amount,
        // @ts-ignore
        interval: price.recurring.interval,
        currency: price.currency
      }
    })
  )

  // @ts-ignore
  const sortedPlans = plans.sort((a, b) => a.price - b.price)

  return {
    props: {
      plans: sortedPlans
    }
  }
}

export default Pricing
