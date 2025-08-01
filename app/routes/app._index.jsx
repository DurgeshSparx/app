import { useEffect } from "react";
import {
  EmptyState,
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        product: {
          title: `${color} Snowboard`,
        },
      },
    },
  );
  const responseJson = await response.json();
  const product = responseJson.data.productCreate.product;
  const variantId = product.variants.edges[0].node.id;
  const variantResponse = await admin.graphql(
    `#graphql
    mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "100.00" }],
      },
    },
  );
  const variantResponseJson = await variantResponse.json();

  return {
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants,
  };
};

export default function Index() {
  // const fetcher = useFetcher();
  // const shopify = useAppBridge();
  // const isLoading =
  //   ["loading", "submitting"].includes(fetcher.state) &&
  //   fetcher.formMethod === "POST";
  // const productId = fetcher.data?.product?.id.replace(
  //   "gid://shopify/Product/",
  //   "",
  // );

  // useEffect(() => {
  //   if (productId) {
  //     shopify.toast.show("Product created");
  //   }
  // }, [productId, shopify]);
  // const generateProduct = () => fetcher.submit({}, { method: "POST" });


  const productPicker = async () => {
    const selected = await shopify.resourcePicker({
        type: 'product',
        action: 'add',
        multiple: true,
    });

    if (selected) {
      console.log('sected product ID',selected);
    } else {
      console.log('Picker was cancelled by the user');
    }
  }


  return (
    <Page>
      <TitleBar title="Generate Checkout Link">
      
      </TitleBar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
           
          <Card sectioned>
    <EmptyState
      heading="Improve your revenue and conversion"
      action={{
        content: 'Generate New Link',
        url: "/app/createCheckoutLink", // Remix rout
        //onAction: productPicker, // 👈 function call yahan se hoga
    }}
      secondaryAction={{
        content: 'Learn more',
        url: 'https://help.shopify.com',
      }}
      image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
    >
      <p>Create direct checkout links, landing pages and pre-loaded cart pages that boost your revenue and conversion — in just a few steps</p>
    </EmptyState>
  </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
