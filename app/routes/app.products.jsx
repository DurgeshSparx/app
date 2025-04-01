import React, { useState } from "react";
import { Page, Layout, Card, DataTable, TextField } from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { useLoaderData, useActionData } from "@remix-run/react";
import { authenticate } from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
    query {
      products(first: 10, reverse: true) {
        edges {
          node {
            id
            title
            handle
            
          }
        }
      }
    }`,
  );
  const data = await response.json();
  const {
    data: {
      products: { edges },
    },
  } = data;
  return edges;
}

const Products = () => {
  const [searchText, setSearchText] = useState("");
  const getProducts = useLoaderData();
  const actionData = useActionData();
  const appbridge = useAppBridge();

  console.log(actionData);
  console.log(getProducts);

  // Filter products based on search input
  const filteredProducts = getProducts.filter((product) =>
    product.node.title.toLowerCase().includes(searchText.toLowerCase())
  );

  // Convert data for DataTable
  const rows = filteredProducts.map((product) => [
    product.node.id,
    product.node.title,
    product.node.handle
  ]);

  return (
    <Page fullWidth>
      <Layout>
        <TitleBar title="Product List" />
        <Layout.Section>
        {/* Render Products as Cards */}
        {getProducts.map((product) => (
            <Card key={product.node.id} sectioned>
              <p onClick={() => appbridge.toast.show(`Product name - ${product.node.title}`)} >
                {product.node.title}
              </p>
            </Card>
          ))}



          {/* Search Input */}
          <TextField
            label="Search"
            value={searchText}
            onChange={(value) => setSearchText(value)}
            autoComplete="off"
            placeholder="Search products..."
          />

          

          {/* Data Table */}
          <Card>
            <DataTable
              columnContentTypes={["text", "text", "text"]}
              headings={["id","Product", "Handle",]}
              rows={rows}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Products;
