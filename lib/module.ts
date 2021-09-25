import { resolve } from 'path'
import { getStripeInstance } from './plugin'

export interface StripeOption {
  i18n?: boolean
  version?: string
  stripeAccount?: string
  publishableKey?: string
}

export { getStripeInstance }

declare module 'vue/types/vue' {
  // eslint-disable-next-line no-unused-vars
  interface Vue {
    $stripe: typeof getStripeInstance
  }
}

declare module '@nuxt/types' {
  // eslint-disable-next-line no-unused-vars
  interface NuxtAppOptions {
    $stripe: typeof getStripeInstance
  }

  // eslint-disable-next-line no-unused-vars
  interface Context {
    $stripe: typeof getStripeInstance
  }
}

export default function StripeModule (this: any, moduleOptions?: StripeOption) {
  const defaults = { i18n: false }

  const options: StripeOption = Object.assign({}, defaults, this.options.stripe, moduleOptions)

  this.addPlugin({
    options,
    ssr: false,
    fileName: 'nuxt-stripe-js.js',
    src: resolve(__dirname, 'plugin.js')
  })
}
