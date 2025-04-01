import {
    Box,
    Card,
    Layout,
    Link,
    List,
    Page,
    Text,
    BlockStack,
    Button,
  } from "@shopify/polaris";
  import { TitleBar } from "@shopify/app-bridge-react";

  import { authenticate } from "../shopify.server";
  
  import { useLoaderData } from "@remix-run/react";

  export const loader = async ({ request }) => {
    const { session } = await authenticate.admin(request);
    const RFQ_SHOPIFY_THEME_EXTENSION_ID = process.env.SHOPIFY_RFQ_FORM_ID;
    console.log('session-',session);
    return new Response(JSON.stringify({ session, RFQ_SHOPIFY_THEME_EXTENSION_ID }), {
        headers: { "Content-Type": "application/json" },
      });
   
  }
  
  export default function Settings() {
    const {session, RFQ_SHOPIFY_THEME_EXTENSION_ID} = useLoaderData();
  console.log('session->',session);
    return (
      <Page>
        <TitleBar title="Settings" />
        <Layout>
        <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="200">
            <Button onClick={()=>{
                window.open(`https://${session.shop}/admin/themes/current/editor?context=apps&template=product&activateAppId=${RFQ_SHOPIFY_THEME_EXTENSION_ID}/enable_RFQ`);
            }} variant="primary">Enable your app</Button>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Card>
              <BlockStack gap="300">
                <Text as="p" variant="bodyMd">
                  The app template comes with an additional page which
                  demonstrates how to create multiple pages within app navigation
                  using{" "}
                  <Link
                    url="https://shopify.dev/docs/apps/tools/app-bridge"
                    target="_blank"
                    removeUnderline
                  >
                    App Bridge
                  </Link>
                  .
                </Text>
                <Text as="p" variant="bodyMd">
              
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        
        </Layout>
      </Page>
    );
  }