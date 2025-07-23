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
import { useAppBridge } from "@shopify/app-bridge-react";
//import { loader } from "../model/token.server";



// export const loader = async ({ request }) => {
  
//    const session = await authenticate.admin(request);
  
//   // const unauth = await unauthenticated.storefront("dev-rfq.myshopify.com");

//   // return json({  unauth });
//   }


export default function CreateCheckoutLink() {
  const app = useAppBridge(); // useAppBgride ko yaha call karo
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
        quantity: variant.quantity,
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
    console.log('return from servertoken...',data);
    setCheckoutUrl(data.checkoutLink);
   
  };

  useEffect(()=>{
    console.log('new productList-->',productList);
    if (checkoutUrl) {
      console.log('checkout Url-->', checkoutUrl);
    }
  
   
  },[productList,checkoutUrl])


  const handleDeleteVariant = (productIndex, variantIndex) => {
    const updatedList = [...productList];
    updatedList[productIndex].variants.splice(variantIndex, 1);
  
    // Remove product if no variants remain
    if (updatedList[productIndex].variants.length === 0) {
      updatedList.splice(productIndex, 1);
      setCheckoutUrl('');
    }
  
    setProductList(updatedList);
  };
  
  const handleQuantityChange = (productIndex, variantIndex, newQty) => {
    const updatedList = [...productList];
    updatedList[productIndex].variants[variantIndex].quantity = newQty;
    setProductList(updatedList);
  };
 
const handleCopy = async () => {
  if (checkoutUrl) {
    try {
      await navigator.clipboard.writeText(checkoutUrl);
    
      app.toast.show("✅ Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }
};

  return (
    <Page
      title="Generate Checkout Link"
      primaryAction={{
        content: "Generate",
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
        {productList.length > 0 && (
  <Card title="Selected Products" sectioned>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left", padding: "8px" }}>Product</th>
          <th style={{ textAlign: "left", padding: "8px" }}>Variant</th>
          <th style={{ textAlign: "left", padding: "8px" }}>Price</th>
          <th style={{ textAlign: "left", padding: "8px" }}>Qty</th>
          <th style={{ textAlign: "left", padding: "8px" }}>Action</th>
        </tr>
      </thead>
      <tbody>
        {productList.map((product, productIndex) =>
          product.variants.map((variant, variantIndex) => (
            <tr key={`${product.id}-${variant.id}`}>
              <td style={{ padding: "8px" }}>{product.title}</td>
              <td style={{ padding: "8px" }}>{variant.title}</td>
              <td style={{ padding: "8px" }}>₹{variant.price.toFixed(2)}</td>
              <td style={{ padding: "8px", width: "80px" }}>
                <TextField
                  type="number"
                  value={String(variant.quantity)}
                  onChange={(value) =>
                    handleQuantityChange(productIndex, variantIndex, parseInt(value))
                  }
                  autoComplete="off"
                />
              </td>
              <td style={{ padding: "8px" }}>
              <Button
                variant="plain"
                destructive
                icon={DeleteIcon}
                onClick={() => handleDeleteVariant(productIndex, variantIndex)}
              />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </Card>
)}
{checkoutUrl && (
  <Card title="Checkout Link" sectioned>
    <BlockStack gap="300">
      <TextField
        label="Generated Checkout URL"
        value={checkoutUrl}
        readOnly
        autoComplete="off"
      />
   
             
    </BlockStack>
    <InlineGrid columns="auto">
     <Button  fullWidth={false} size="medium" variant="primary" onClick={handleCopy}>Copy</Button>
     
     </InlineGrid>
  </Card>
)}

      </Form>

      <PageActions
        primaryAction={{
          content: "Generate",
          onAction: handleSubmit,
          disabled: productList.length === 0,
        }}
        secondaryActions={[{ content: "Delete", icon: DeleteIcon }]}
      />
    </Page>
  );
}
