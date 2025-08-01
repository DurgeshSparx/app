import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app" rel="home">
          Home
        </Link>
        <Link to="/app/additionalscript">Additional Script</Link>
        <Link to="/app/storefrontToken">storefrontAccessToken</Link>
        <Link to="/app/products">Products</Link>
        <Link to="/app/contactus">Contact Us</Link>
        <Link to="/app/settings">Settings</Link>
        <Link to="/app/dataTable">Data Table</Link>
        <Link to="/app/collection">Collection</Link>
        <Link to="/api/getCollections">get Collections</Link>
        <Link to="/app/inquiryList">inquiry list</Link>
        <Link to="/app/ResourceListWithBulkActionsAndPagination">ResourceListWithBulkActionsAndPagination</Link>
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
