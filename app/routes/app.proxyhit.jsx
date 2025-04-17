import { json } from "@remix-run/node";
import { shopify } from "../shopify.server";
import { cors } from "remix-utils/cors";



export async function action({ request }) {

  console.log('hit proxy ... request data from frontend--->',request);
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
  

    return cors(request,  json({ success: true, product: { id: "123", title: "product.durgesh" } })  );
  } catch (error) {
    console.error(error);
    return cors(request,  json({ success: false, error: "Failed to create bundle" }, { status: 500 }));
  }
}
