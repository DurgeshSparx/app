import { authenticate } from "../shopify.server";
export const loader = async ({ request }) => {
    await authenticate.admin(request);
  
    return null;
  };
export const getMainThemeId = async (admin) => {
    const res = await admin.graphql(`
      query {
        themes(first: 1, roles: MAIN) {
          edges {
            node {
              id
              name
              role
            }
          }
        }
      }
    `);
    const data = await res.json();
    return data?.data?.themes?.edges[0]?.node?.id;
  };
  