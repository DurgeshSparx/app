import {
  FormLayout,
  TextField,
  Page,
  PageActions,
  Card,
  Text,
  BlockStack,
  InlineGrid,
  Button,
} from "@shopify/polaris";
import { DeleteIcon } from "@shopify/polaris-icons";
import { Form, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
//import { loader } from "../model/token.server";



// export const loader = async ({ request }) => {
  
//    const session = await authenticate.admin(request);
  
//   // const unauth = await unauthenticated.storefront("dev-rfq.myshopify.com");

//   // return json({  unauth });
//   }


export default function CreateCheckoutLink() {
//   
//   const { unauth } = useLoaderData();
// console.log('unauthenticated-->',unauth,'token->>',sftoken);

  const [productList, setProductList] = useState([]);
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [offer, setOffer] = useState("0");

  const handleSelectProduct = async () => {
    const selections = await window.shopify.resourcePicker({
      type: "product",
      action: "select",
      multiple: true,
      filter: {
        query: "(gift_card:false) AND (inventory_total:>1)",
        variants: true,
      },
    });

    if (selections) {
      const selectedProducts = selections.map((product) => ({
        title: product.title,
        id: product.id,
        variants: product.variants.map((variant) => ({
          id: variant.id,
          title: variant.title,
          quantity: 1,
          price: parseFloat(variant.price),
          originalPrice: parseFloat(variant.price),
        })),
        quantity: 1,
        featuredImage: product.images?.[0]?.originalSrc || "",
        offer: parseFloat(offer),
      }));

      setProductList(selectedProducts);

      if (formErrors.selectedProducts) {
        setFormErrors({ ...formErrors, selectedProducts: undefined });
      }
    } else {
      setProductList([]);
    }
  };

  const handleSubmit = async () => {
    const lineItems = productList.flatMap((product) =>
      product.variants.map((variant) => ({
        variantId: variant.id,
        quantity: 1,
      }))
    );
console.log('lineItems',lineItems);
    const res = await fetch("/api/serverToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        lineItems
      }),
    });

    const data = await res.json();
    console.log('return from servertoken...');
    // setCheckoutUrl(data.checkoutUrl);
   
  };

  useEffect(()=>{
    console.log('productList-->',productList);
  },[productList])



  return (
    <Page
      title="Generate Checkout Link"
      primaryAction={{
        content: "Save",
        onAction: handleSubmit,
        disabled: productList.length === 0,
      }}
    >
      <Form method="POST">
        <Card>
          <FormLayout>
            <FormLayout.Group>
              <TextField
                type="text"
                label="Link Title (*)"
                name="linkTitle"
                value=""
                placeholder="Link Title ..."
                autoComplete="off"
              />
            </FormLayout.Group>
          </FormLayout>
        </Card>

        <Card roundedAbove="sm">
          <BlockStack gap="200">
            <InlineGrid
              columns="1fr auto"
              background="bg-surface-secondary"
              padding="400"
            >
              <Text as="h2" variant="headingSm">
                Select Product
              </Text>

              <Button onClick={handleSelectProduct}>Select</Button>
            </InlineGrid>
          </BlockStack>
        </Card>
      </Form>

      <PageActions
        primaryAction={{
          content: "Save",
          onAction: handleSubmit,
          disabled: productList.length === 0,
        }}
        secondaryActions={[{ content: "Delete", icon: DeleteIcon }]}
      />
    </Page>
  );
}
