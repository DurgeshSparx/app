  
import { json } from "@remix-run/node"; // Remix response helper
import { authenticate } from "../shopify.server";
export const loader = async ({ request }) => {
  try {
    console.log("Request Headers:", request.headers);
        // Authenticate Shopify Admin API ( when we create own endpoints then we can't used withot access token )
        //  const { admin, session } = await authenticate.admin(request);
    

    // Example: Query Parameters ko read karna
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");

    // if (!shop) {
    //   return json({ success: false, message: "Shop parameter is required" }, { status: 400 });
    // }

    // Example Response
    return json({
      success: true,
      message: "GET API is working!",
      data: { name:"durgesh", company:"sparx it solution pvt. ltd" },
    });
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
}
