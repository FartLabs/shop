# FartLabs Shop

The [FartLabs](https://fartlabs.org) shop! Built with [Deno](https://deno.land/)
and [Fresh](https://fresh.deno.dev/), powered by
[Shopify](https://www.shopify.com), and deployed to the edge with
[Deno Deploy](https://deno.com/deploy).

Using SSR, islands architecture, and being deployed close to users, this shop
has a perfect Lighthouse score of 100.
[_Learn how you can build an e-commerce site with a perfect Lighthouse score._](https://github.com/denoland/merch)

## Develop locally

- Make sure to install Deno:
  https://deno.land/manual/getting_started/installation
- Clone the repository
- Set up Shopify credentials in the `.env`, follows `.env.example`.
- Start the project in local mode:

  ```bash
  deno task start
  ```

This will watch the project directory and restart as necessary.

## Shopify setup

- Create a new account or use an existing one.
  <https://accounts.shopify.com/store-login>
- Create a new app. https://\<yourshopname>.myshopify.com/admin/settings/apps
- Once your app has been created, select use it. Then select "Storefront API
  integration" link
- Next, check Storefront API access scopes
  - `unauthenticated_read_product_listings` access should be fine to get you
    started.
  - Add more scopes if you require additional permissions.

## Deploy to global

Sign in to [dash.deno.com](https://dash.deno.com), create a new project, and
then link to your clone version of the repository. Please ensure add shopify
secret before link:

![Screen Shot 2](./static/screen_shot_2.png)

Our shop is built with [Fresh](https://fresh.deno.dev) and
[Shopify's storefront API](https://shopify.dev/api/storefront), is server-side
rendered (SSR) with some
[islands of interactivity](https://fresh.deno.dev/docs/concepts/islands) and
deployed close to users on the edge. Sending only what the client needs keeps
the site lean and fast, earning it a perfect
[Lighthouse score](https://pagespeed.web.dev/). You can follow the Fresh
"Getting Started" guide here: <https://fresh.deno.dev/docs/getting-started>.
