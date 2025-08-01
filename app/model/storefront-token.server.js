import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import  prisma  from "../db.server"; // adjust the path based on your project

export  async function StorefrontToken({ admin, session }) {
  const shop = session.shop;
  // Check if token exists
  const existingTokenEntry = await prisma.Shop_Storefront_Token.findUnique({
    where: { shop: shop },
  });
    //console.log('existingTokenEntry--->',existingTokenEntry);
  if (existingTokenEntry) {
    return { accessToken: existingTokenEntry.storefrontAccessToken };
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
  // Save to DB
  await prisma.Shop_Storefront_Token.create({
    data: {
      shop,
      storefrontAccessToken: newToken,
    },
  });
  //console.log('new Token generate->',newToken);
  return { accessToken: newToken };
  
}


