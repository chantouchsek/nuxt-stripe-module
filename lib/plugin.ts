import { loadStripe } from '@stripe/stripe-js/pure'
import type { Plugin } from '@nuxt/types'
import type { Stripe, StripeElementLocale, CheckoutLocale } from '@stripe/stripe-js'
import type { Context } from '@nuxt/types/app'
import { StripeOption } from '~/lib/module'

export interface StripeOptions {
  locale: StripeElementLocale | CheckoutLocale
  reload?: boolean
}

let stripe: Stripe | null

function _isTrue (val: string) {
  return val === 'true'
}

function delayNextRetry (retryCount: number): Promise<void> {
  const delay = 2 ** retryCount * 500
  return new Promise(resolve => setTimeout(resolve, delay + delay * 0.2 * Math.random()))
}

export async function getStripeInstance ({ app, $config }: Context, options?: StripeOptions): Promise<Stripe | null> {
  if (options!.reload) {
    stripe = null
  }
  if (!stripe) {
    if (!options!.locale && _isTrue('<%= options.i18n %>')) {
      options!.locale = app.i18n.locale as StripeElementLocale | CheckoutLocale
    }
    let publishableKey = '<%= options.publishableKey %>'
    let apiVersion = '<%= options.apiVersion %>'

    const runtimeConfig: StripeOption = $config.stripe
    if (runtimeConfig) {
      if (runtimeConfig.publishableKey) publishableKey = runtimeConfig.publishableKey
      if (runtimeConfig.version) apiVersion = runtimeConfig.version
    }

    if (!publishableKey) {
      throw new Error('A Stripe publishable key is required.')
    }

    let retries = 0
    let msg = ''

    do {
      try {
        stripe = await loadStripe(publishableKey, { locale: options!.locale, apiVersion })
      } catch (e: any) {
        stripe = null
        retries++
        await delayNextRetry(retries)
        msg = e.message
      }
    } while (!stripe && retries < 3)

    if (!stripe) {
      throw new Error(`nuxt-stripe-js: Failed to load Stripe.js after ${retries} retries, ${msg}`)
    }
  }

  return stripe
}

const stripePlugin: Plugin = async (ctx, inject) => {
  let locale: StripeElementLocale | CheckoutLocale = 'en'
  if (ctx.app.i18n) {
    locale = ctx.app.i18n.locale as StripeElementLocale | CheckoutLocale
  }
  const stripeInstance = await getStripeInstance(ctx, { locale })
  inject('stripe', stripeInstance)
  ctx.app.stripe = stripeInstance
}

export { loadStripe }

export default stripePlugin
