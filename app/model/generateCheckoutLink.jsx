
export const GenerateCheckoutLink = async ({ get_storeFrontToken, shop, lineItems }) => {
  console.log("lineItems List -->", lineItems);

  const response = await fetch(`https://${shop}/api/2024-01/graphql.json`, {
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": get_storeFrontToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation cartCreate($input: CartInput) {
          cartCreate(input: $input) {
            cart {
              id
              checkoutUrl
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        input: {
          lines: lineItems.map(item => ({
            merchandiseId: item.variantId,
            quantity: item.quantity,
          })),
        },
      },
    }),
  });

  const responseJson = await response.json();

  if (responseJson.errors) {
    console.error("GraphQL Errors:", responseJson.errors);
    return null;
  }

  const cart = responseJson.data.cartCreate.cart;
  if (cart) {
    console.log("✅ Checkout Link:", cart.checkoutUrl);
    return cart.checkoutUrl;
  } else {
    console.error("Cart creation failed:", responseJson.data.cartCreate.userErrors);
    return null;
  }
};