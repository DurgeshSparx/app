import { json } from "@remix-run/node";
import { shopify } from "../shopify.server";
import { cors } from "remix-utils/cors";



export async function action({ request }) {

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }


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
  

    return cors(
      request, 
      json({ success: true, product: { id: "123", title: "product.durgesh" } }),
      {
        origin: "https://dev-rfq.myshopify.com",  // Change this to your allowed domain in production
        methods: ["GET", "POST", "OPTIONS"],
        headers: ["Content-Type", "Authorization"],
      }
    );
  } catch (error) {
    console.error(error);
    return cors(
      request, 
      json({ success: false, error: "Failed to create bundle" }, { status: 500 }),
      {
        origin: "https://dev-rfq.myshopify.com", 
        methods: ["GET", "POST", "OPTIONS"],
        headers: ["Content-Type", "Authorization"],
      }
    );
  }
}
