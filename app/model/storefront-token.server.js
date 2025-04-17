
import { prisma } from "../db.server";
import { shopify } from "../shopify.server";

export async function ensureStorefrontAccessToken(session) {
  const shop = session.shop;

  // Check if token exists
  const shopData = await prisma.shop.findUnique({ where: { shop } });

  if (shopData?.storefrontAccessToken) {
    return shopData.storefrontAccessToken;
  }

  // Create token via Admin API
  const mutation = `
    mutation {
      storefrontAccessTokenCreate(input: {
        title: "RFQ App Token"
      }) {
        storefrontAccessToken {
          accessToken
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const client = new shopify.api.clients.Graphql({ session });
  const res = await client.query({ data: { query: mutation } });

  const token = res.body.data.storefrontAccessTokenCreate.storefrontAccessToken.accessToken;

  // Save in DB
  await prisma.shop.upsert({
    where: { shop },
    update: { storefrontAccessToken: token },
    create: { shop, storefrontAccessToken: token },
  });

  return token;
}
