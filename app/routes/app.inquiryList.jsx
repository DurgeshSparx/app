import {
    Card,
    ResourceList,
    Avatar,
    ResourceItem,
    Text,
  } from '@shopify/polaris';
  import React from 'react';
 // import {getMainThemeId} from "../model/getMainThemeId"
  export default async function ResourceListExample() {
    // const themeID = await getMainThemeId();
    // console.log('themeID',themeID);
    return (
        <Page title="Contact Us">
        <Card>
            <ResourceList
            resourceName={{singular: 'customer', plural: 'customers'}}
            items={[
                {
                id: '110',
                url: '#',
                name: 'Mae Jemison',
                location: 'Decatur, USA',
                latestOrderUrl: '#',
                },
                {
                id: '210',
                url: '#',
                name: 'Ellen Ochoa',
                location: 'Los Angeles, USA',
                latestOrderUrl: '#',
                },
            ]}
            renderItem={(item) => {
                const {id, url, name, location, latestOrderUrl} = item;
                const media = <Avatar customer size="md" name={name} />;
                const shortcutActions = latestOrderUrl
                ? [
                    {
                        content: 'View latest order',
                        accessibilityLabel: `View ${name}’s latest order`,
                        url: latestOrderUrl,
                    },
                    ]
                : undefined;
    
                return (
                <ResourceItem
                    id={id}
                    url={url}
                    media={media}
                    accessibilityLabel={`View details for ${name}`}
                    shortcutActions={shortcutActions}
                    persistActions
                >
                    <Text variant="bodyMd" fontWeight="bold" as="h3">
                    {name}
                    </Text>
                    <div>{location}</div>
                </ResourceItem>
                );
            }}
            />
        </Card>
        </Page>
    );
  }