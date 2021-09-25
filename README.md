<h1 align="center">
  nuxt-stripe-js
</h1>
<p align="center">
  NuxtJS module for Stripe.js
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/nuxt-stripe-js"><img src="https://img.shields.io/npm/v/nuxt-stripe-js?style=flat-square" alt="nuxt-stripe-js"></a> <a href="https://www.npmjs.com/package/nuxt-stripe-js"><img src="https://img.shields.io/npm/dt/nuxt-stripe-js?style=flat-square" alt="nuxt-stripe-js"></a> <a href="#"><img src="https://img.shields.io/github/license/dogchef-be/nuxt-stripe-js?style=flat-square" alt="nuxt-stripe-js"></a>
</p>

## Table of contents

- [Features](#features)
- [Setup](#setup)
- [Options](#options)
- [Usage](#usage)
- [License](#license)

## Features

- Load Stripe.js only when required (once `$stripe()` is called)
- Reuse the same instance across all components
- Retry mechanism to bypass temporary network issues
- TypeScript support

## Setup

1. Add `nuxt-stripe-js` dependency to your project:

```bash
npm install nuxt-stripe-js
```

2. Add `nuxt-stripe-js` module and configuration to `nuxt.config.js`:

```js
export default {
    modules: [
        // simple usage
        'nuxt-stripe-js',
        // with options
        ["nuxt-stripe-js", {
            publishableKey: 'YOUR_STRIPE_PUBLISHABLE_KEY',
            version: '2020-08-27',
            i18n: true,
        }]
    ],
    // .....option
    stripe: {
        publishableKey: 'YOUR_STRIPE_PUBLISHABLE_KEY',
        version: '2020-08-27',
        i18n: true,
    },
    // runtime config
    publicRuntimeConfig: {
        stripe: {
            publishableKey: 'YOUR_STRIPE_PUBLISHABLE_KEY',
            version: '2020-08-27',
            i18n: true,
        }
    }
}
```

3. (Optional) TypeScript support. Add `nuxt-stripe-js` to the `types` section of `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": [
      "@nuxt/types",
      "nuxt-stripe-js"
    ]
  }
}
```

4. (Optional), If you need to support change stripe locale base i18n locale changed, just create a file
   in `plugins/i18n.{js,ts}`

```ts
import {Context, Inject} from '@nuxt/types/app'
import {getStripeInstance} from 'nuxt-stripe-js'
import {CheckoutLocale, StripeElementLocale} from '@stripe/stripe-js'

export default function (ctx: Context, inject: Inject) {
    const {app} = ctx
    app.i18n.onLanguageSwitched = async (_, locale) => {
        const stripeLocale = locale as StripeElementLocale | CheckoutLocale
        const stripeInstance = await getStripeInstance(ctx, stripeLocale)
        inject('stripe', stripeInstance)
        ctx.app.stripe = stripeInstance
    }
}
```

And call it in nuxt.config.{js,ts}

```ts
export default {
    plugins: [
        '~/plugins/i18n',
    ]
}
```

## Options

### `publishableKey`

- Type: `String`

Your Stripe's publishable key.

### `version`

- Type: `String`

Your Stripe's version.

### `i18n`

- Type: `Boolean`
- Default: `false`

Enable [i18n-module](https://github.com/nuxt-community/i18n-module) integration.

## Usage

It can be used inside components like:

```html

<template>
    <div>
        <div ref="stripeElements"/>
    </div>
</template>
```

```ts
export default {
    async mounted() {
        const stripe = await this.$stripe()
        const elements = stripe.elements()

        const card = elements.create('card')
        card.mount(this.$refs.stripeElements)
    }
}
```

Stripe: [JavaScript SDK documentation & reference](https://stripe.com/docs/js)

## License

See the LICENSE file for license rights and limitations (MIT).
