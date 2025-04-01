import {
    Box,
    Card,
    Layout,
    Link,
    List,
    Page,
    Text,
    BlockStack,
    FormLayout,
    TextField,
    Button,
  } from "@shopify/polaris";
  import { Form } from "@remix-run/react";
  import { TitleBar } from "@shopify/app-bridge-react";  
import { useState } from "react";
import { useNavigate } from "@remix-run/react";


export default function AdditionalScript() {
    const [textData, setTextData] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prev) => ({
    //         ...prev,
    //         [name]: value,
    //     }));
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setIsSubmitting(true);

    //     try {
    //         const response = await fetch("/app/submit", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(formData),
    //         });

    //         const result = await response.json();
    //         if (!response.ok) {
    //             setErrors(result.errors || {});
    //             setIsSubmitting(false);
    //             return;
    //         }
    //     } catch (error) {
    //         console.error("Submission failed", error);
    //         setErrors({ general: "An unexpected error occurred." });
    //         setIsSubmitting(false);
    //     }
    // };

    return (
        <Page>
        <TitleBar title="Additional Script" />
        <Layout>
        <Layout.Section variant="oneThird">
       
        <BlockStack gap="500">
                <Text as={"h2"} variant="headingLg">
                  Title
                </Text>
                <Text as={"p"}>
                  description text here
                </Text>
              </BlockStack>
          
          </Layout.Section>
          <Layout.Section>
            <Card>
              <BlockStack gap="300">
              <Form method="POST">
              <FormLayout>
               
                  <TextField
                  type="text"
                  name="userName"
                  value={textData}
                  onChange={(value) => setTextData(value)}
                  autoComplete="off"
                  multiline={20} 
                  />
               
               <Button  primary loading={isSubmitting}>Submit</Button>
                </FormLayout>
                </Form>
         
              </BlockStack>
            </Card>
          </Layout.Section>
        
        </Layout>
      </Page>



     
    );
}
