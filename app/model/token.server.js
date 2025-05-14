// app/loaders/createCheckoutLink.server.js

import {  unauthenticated } from "../shopify.server";
import { json } from "@remix-run/node";

export async function loader({ request }) {

  //const session = await authenticate.admin(request);
  const unauth = await unauthenticated.storefront("dev-rfq.myshopify.com");

  return json({  unauth });
}

