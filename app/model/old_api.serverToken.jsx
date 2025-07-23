
// app/routes/api/checkout-link.jsx
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import {StorefrontToken}  from "./storefront-token.server";
import {GenerateCheckoutLink} from "../routes/app.generateCheckoutLink";

export const action = async ({ request }) => {
  const shopify = await authenticate.admin(request);
  const { admin, session } = await authenticate.admin(request);

 const { lineItems } = await request.json(); // [{ variantId, quantity }]
 const tokenData = await StorefrontToken({ admin, session });
 const shop = session.shop;
 const get_storeFrontToken = tokenData.accessToken;

   const GenerateCheckoutLink = async ({get_storeFrontToken,shop,lineItems})=>{
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
                       merchandiseId: 'gid://shopify/ProductVariant/7960666308797',
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
 //const checkoutLink = await GenerateCheckoutLink({get_storeFrontToken,shop,lineItems});
 console.log('token--->', get_storeFrontToken);
console.log('lineItems--->',lineItems);
console.log('checkoutLink--->',await GenerateCheckoutLink);
 
 return await GenerateCheckoutLink;




};
