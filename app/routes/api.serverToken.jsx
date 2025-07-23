// app/routes/api/checkout-link.jsx
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { StorefrontToken } from "../model/storefront-token.server";
import {GenerateCheckoutLink} from "../model/generateCheckoutLink"



export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const { lineItems } = await request.json();

  const tokenData = await StorefrontToken({ admin, session });
  const shop = session.shop;
  const get_storeFrontToken = tokenData.accessToken;

  const checkoutLink = await GenerateCheckoutLink({
    get_storeFrontToken,
    shop,
    lineItems,
  });
//console.log('get return data from GenerateCheckoutLink',checkoutLink);
  return json({ checkoutLink });
};
