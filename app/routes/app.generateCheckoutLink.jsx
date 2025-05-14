// app/routes/api/checkout-link.jsx
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import {StorefrontToken}  from "../model/storefront-token.server";
//import { Storefront } from "@shopify/shopify-api";

//import "@shopify/shopify-app-remix/adapters/node";

// export const action = async ({ request }) => {
//   const shopify = await authenticate.admin(request);
//   const { admin, session } = await authenticate.admin(request);

//  const { lineItems } = await request.json(); // [{ variantId, quantity }]
//  const tokenData = await StorefrontToken({ admin, session });
//  const get_storeFrontToken = tokenData.accessToken;
//  console.log('token--->', get_storeFrontToken);
// console.log('lineItems--->',lineItems);

// const storefront = new Storefront({
//        domain: session.shop,
//        storefrontAccessToken: get_storeFrontToken,
//      });

//      const response = await storefront.graphql(`{blogs(first: 10) { edges { node { id } } } }`);

//      const productData = await response.json();
//      console.log('productData-->',productData);   
//  return null;

// //  import { LoaderArgs, json } from "@remix-run/node";
// //  import { unauthenticated } from "../shopify.server";
// //  import { getMyAppData } from "~/db/model.server";
 
// //  export const loader = async ({ request }) => {
// //    const shop = getShopFromExternalRequest(request);
// //    const { session } = await unauthenticated.storefront(shop);
// //    return json(await getMyAppData({shop: session.shop));
// //  };

// //  import { ActionArgs } from "@remix-run/node";
// // import { authenticate } from "../shopify.server";





// };

export async function GenerateCheckoutLink({get_storeFrontToken,shop,lineItems}){
       console.log('lineItems List-->',lineItems);
       const response = await fetch(`https://${shop}/api/2024-01/graphql.json`, {
              method: "POST",
              headers: {
                "X-Shopify-Storefront-Access-Token": get_storeFrontToken,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query: `
                  mutation cartCreate($input: CartInput) {
                    cartCreate(input: $input) {
                      cart {
                        id
                        checkoutUrl
                      }
                      userErrors {
                        field
                        message
                      }
                    }
                  }
                `,
                variables: {
                  input: {
                    lines: [
                            {
                            merchandiseId: 'gid://shopify/ProductVariant/44848784179389',
                            quantity: 1
                            }
                            ]
                  }
                }
              }),
            });
                const responseJson = await response.json();
                if (responseJson.errors) {
                     console.error("GraphQL Errors:", responseJson.errors);
                     return null;
                   }
                 
                   const cart = responseJson.data.cartCreate.cart;
                   if (cart) {
                     console.log("✅ Checkout Link:", cart.checkoutUrl);
                     return cart.checkoutUrl;
                   } else {
                     console.error("Cart creation failed:", responseJson.data.cartCreate.userErrors);
                     return null;
                   }
              //   console.log("✅ Checkout Link:", responseJson.data);
              //  // return responseJson.data.cartCreate.cart.checkoutUrl;
              //  return null;
} 