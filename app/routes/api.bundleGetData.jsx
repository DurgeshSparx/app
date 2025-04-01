import { json } from "@remix-run/node";
import { shopify } from "../shopify.server";
import { cors } from "remix-utils/cors";



export async function action({ request }) {
  console.log('request data from frontend--->',request);
  const { name, items } = await request.json();
  console.log('name--->',name,'items-->',items);
  const allItem = items.map(
      (item) => `{
    sku: "${item.variantId}",
    inventoryQuantity: ${item.quantity}
  }`
    )
    .join(",");
console.log('allItem->',allItem)

  try {
    // const response = await shopify.graphql(
    //   `
    //   mutation {
    //     productCreate(input: {
    //       title: "${name}",
    //       productType: "Bundle",
    //       variants: [
    //         ${items
    //           .map(
    //             (item) => `{
    //           sku: "${item.variantId}",
    //           inventoryQuantity: ${item.quantity}
    //         }`
    //           )
    //           .join(",")}
    //       ]
    //     }) {
    //       product {
    //         id
    //         title
    //         variants(first: 1) {
    //           edges {
    //             node {
    //               id
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // `
    // );

    // const product = response.data.productCreate.product;
    // const variantId = product.variants.edges[0].node.id;

    return cors(request, json({ 
      success: true, 
      product: { id: '123', title: 'product.title' } 
    }), {
      origin: "https://dev-rfq.myshopify.com",  //s ✅ Allowed Origin
      methods: ["GET", "POST", "OPTIONS"],     // ✅ Allowed Methods
      headers: ["Content-Type", "Authorization"],  // ✅ Allowed Headers
    });
  } catch (error) {
    console.error(error);
    return cors(request, json({ success: false, error: "Failed to create bundle" }, { status: 500 }));
  }
}
