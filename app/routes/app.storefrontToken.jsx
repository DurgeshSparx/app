import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import  prisma  from "../db.server"; // adjust the path based on your project
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;
console.log('shop name-->',shop)
const tokens = await prisma.Contectus.findMany(); // table name
    console.log("Prisma Connected. Tokens:", tokens);
  // Check if token exists
  const existingTokenEntry = await prisma.Shop_Storefront_Token.findUnique({
    where: { shop: shop },
  });
console.log('existingTokenEntry--->',existingTokenEntry);
  if (existingTokenEntry) {
    console.log('inside the if condition--',existingTokenEntry.storefrontAccessToken);
    return json({ accessToken: existingTokenEntry.storefrontAccessToken });
  }

  // If not exists, create a new one
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
console.log('response',response);
  const data = await response.json();
  console.log('data',data);
  const newToken = data.data.storefrontAccessTokenCreate.storefrontAccessToken.accessToken;
console.log('newToken->',newToken);
  // Save to DB
  await prisma.Shop_Storefront_Token.create({
    data: {
      shop,
      storefrontAccessToken: newToken,
    },
  });

  return json({ accessToken: newToken });
};

export default function StorefrontToken() {
  const data = useLoaderData();

  return (
    <div>
      <h2>Storefront Access Token:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
