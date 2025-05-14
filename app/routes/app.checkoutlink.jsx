// // app/routes/api/checkout-link.jsx
// import { json } from "@remix-run/node";
// import { authenticate } from "../shopify.server";
// //import { ensureStorefrontAccessToken } from "../model/storefront-token.server";
// import "@shopify/shopify-app-remix/adapters/node";







// export const action = async ({ request }) => {
//   const shopify = await authenticate.admin(request);


//  const { lineItems } = await request.json(); // [{ variantId, quantity }]

//  const storefrontAccessToken =  process.env.SHOPIFY_STOREFRONT_API;
 
//   console.log('request data from frontend--->',request);
// console.log('got the line item list-->',lineItems);
// console.log('session->',shopify.session);
// console.log('shop name',shopify.session.shop);
// console.log('storefrontAccessToken->',storefrontAccessToken);

// // https://shopify.dev/docs/api/shopify-app-remix/v3/unauthenticated/unauthenticated-storefront



//   const shop = shopify.session.shop

//   const { storefront } = await unauthenticated.storefront(shop);
//   console.log('storefront->',storefront);
//   // const response_graphql = await storefront.graphql(
//   //   `


 
// };

// export const loader = async ({ request }) => {
// const { admin } = await authenticate.admin(request);

// const response = await admin.graphql(
//   `#graphql
//   mutation StorefrontAccessTokenCreate($input: StorefrontAccessTokenInput!) {
//     storefrontAccessTokenCreate(input: $input) {
//       userErrors {
//         field
//         message
//       }
//       shop {
//         id
//       }
//       storefrontAccessToken {
//         accessScopes {
//           handle
//         }
//         accessToken
//         title
//       }
//     }
//   }`,
//   {
//     variables: {
//       "input": {
//         "title": "New Storefront Access Token"
//       }
//     },
//   },
// );

// const data = await response.json();
// console.log(data);
// }
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import  prisma  from "../db.server"; // adjust the path based on your project
import { useLoaderData } from "@remix-run/react";


// export async function ensureStorefrontAccessToken(session) {
//   const admin = useLoaderData();
//   console.log('session---->>>',session);
//   console.log('shopify data ---',shopify);
//   const shop = session.shop;

//   // Check if token exists
//   // const shopData = await prisma.shop.findUnique({ where: { shop } });



// const data = await response.json();
// console.log('data --->>>',data);
// return data;
// }



export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  return { admin, session };
  
};

export default async function StorefrontToken() {
  const { admin, session } = useLoaderData();
  const shop = session.shop;
console.log('shop-->',shop);
  // Check if token exists
  const existingTokenEntry = await prisma.Shop_Storefront_Token.findUnique({
    where: { shop: shop },
  });
    //console.log('existingTokenEntry--->',existingTokenEntry);
  if (existingTokenEntry) {
    return json({ accessToken: existingTokenEntry.storefrontAccessToken });
  }

  // If Storefront Token not exists, create a new Storefront Token
  const response = await admin.graphql(
    `#graphql
      mutation StorefrontAccessTokenCreate($input: StorefrontAccessTokenInput!) {
        storefrontAccessTokenCreate(input: $input) {
          userErrors {
            field
            message
          }
          storefrontAccessToken {
            accessToken
            title
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `Storefront Token - ${shop}`,
        },
      },
    }
  );

  const data = await response.json();
  const newToken = data.data.storefrontAccessTokenCreate.storefrontAccessToken.accessToken;
    //console.log('newToken->',newToken);
  // Save to DB
  await prisma.Shop_Storefront_Token.create({
    data: {
      shop,
      storefrontAccessToken: newToken,
    },
  });

  return json({ accessToken: newToken });
  
}


