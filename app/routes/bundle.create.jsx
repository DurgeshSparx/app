import { json } from "@remix-run/node";
import shopify from "../shopify.server";

export async function action({ request }) {
  const { name, items } = await request.json();

  try {
    const response = await shopify.graphql(
      `
      mutation {
        productCreate(input: {
          title: "${name}",
          productType: "Bundle",
          variants: [
            ${items
              .map(
                (item) => `{
              sku: "${item.variantId}",
              inventoryQuantity: ${item.quantity}
            }`
              )
              .join(",")}
          ]
        }) {
          product {
            id
            title
            variants(first: 1) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    `
    );

    const product = response.data.productCreate.product;
    const variantId = product.variants.edges[0].node.id;

    return json({ success: true, product: { id: product.id, title: product.title, variants: [{ id: variantId }] } });
  } catch (error) {
    console.error(error);
    return json({ success: false, error: "Failed to create bundle" }, { status: 500 });
  }
}
