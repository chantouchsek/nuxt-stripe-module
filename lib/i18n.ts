import { Context, Inject } from '@nuxt/types/app'
import { getStripeInstance } from './module'
import type { CheckoutLocale, StripeElementLocale } from '@stripe/stripe-js'

export default function (ctx: Context, inject: Inject) {
  const { app } = ctx
  app.i18n.onLanguageSwitched = async (_, locale) => {
    const stripeLocale = locale as StripeElementLocale | CheckoutLocale
    const stripeInstance = await getStripeInstance(ctx, { locale: stripeLocale, reload: true })
    inject('stripe', stripeInstance)
    ctx.app.stripe = stripeInstance
  }
}
