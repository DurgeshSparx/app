// app/routes/api/checkout-link.jsx
import { json } from "@remix-run/node";
import { shopify } from "../shopify.server";
import { cors } from "remix-utils/cors";
import { ensureStorefrontAccessToken } from "../model/storefront-token.server";

export const action = async ({ request }) => {

 const { lineItems, auth } = await request.json(); // [{ variantId, quantity }]
 const session = auth.session;
 const storefrontAccessToken = await ensureStorefrontAccessToken(session);
 
  console.log('request data from frontend--->',request);
console.log('got the line item list-->',lineItems);
console.log('session->',session);
console.log('shop name',session.shop);
console.log('storefrontAccessToken->',storefrontAccessToken);


  // const response = await fetch(`https://${session.shop}/api/2024-01/graphql.json`, {
  //   method: "POST",
  //   headers: {
  //     "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     query: `
  //       mutation checkoutCreate($input: CheckoutCreateInput!) {
  //         checkoutCreate(input: $input) {
  //           checkout {
  //             id
  //             webUrl
  //           }
  //           userErrors {
  //             field
  //             message
  //           }
  //         }
  //       }
  //     `,
  //     variables: {
  //       input: {
  //         lineItems,
  //       },
  //     },
  //   }),
  // });

  // const data = await response.json();
  // console.log("✅ Checkout Link:", data.data.checkoutCreate.checkout.webUrl);

  // return json({
  //   checkoutUrl: data.data.checkoutCreate.checkout.webUrl,
  // });
  // Dummy return for now
  return json({
    message: "Request received",
   // shop: session.shop,
    lineItems,
  });
};
