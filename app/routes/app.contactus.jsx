import {
  Box,
  Card,
  Page,
  Text,
  Button,
  FormLayout,
  TextField,
  Toast,
  Frame,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { Form, json, useActionData } from "@remix-run/react";
import { useState, useEffect } from "react";
// last step connect database and insert new data
import prisma from "../db.server";

export const action = async ({ request }) => {
  let settings = await request.formData();
  settings = Object.fromEntries(settings);
  console.log("settings data -->", settings);

  await prisma.Contectus.create({
    data: {
      neme: settings.userName,
      email: settings.email,
      subject: settings.subject,
      Collaborator_request_code: settings.CollaboratorRC,
      Content: settings.content
    },
  })

  return json({ success: true, message: "Thank you, we will connect soon" });
};

export default function ContactUs() {
  const app = useAppBridge(); // useAppBridge ko yaha call karo
  const actionData = useActionData(); // Action response le rahe hain
  const [showList, setShowList] = useState(false);

  const [toastActive, setToastActive] = useState(false);
  const [contactus, setContactus] = useState({
    userName: "",
    email: "",
    subject: "[request a quote] I need support",
    CollaboratorRC: "",
    content: "",
  });

  const handleFormInput = (e, name) => {
    setContactus((prevValue) => ({ ...prevValue, [name]: e }));
  };

  // Show toast when actionData is received
// 🔥 Form Reset After Successful Submission
useEffect(() => {
  if (actionData?.success) {
    app.toast.show(actionData.message);
    setContactus({
      userName: "",
      email: "",
      subject: "[request a quote] I need support",
      CollaboratorRC: "",
      content: "",
    });
  }
}, [actionData, app]);

  return (
    <Frame>
      <Page title="Contact Us"
      primaryAction={{
        content: "My inquiry",
        onAction: () => {
          console.log("Button clicked!");
        }
      }}
      >
    
        <Card>
          <Form method="POST">
            <FormLayout>
              <FormLayout.Group>
                <TextField
                  type="text"
                  label="Your name (*)"
                  name="userName"
                  value={contactus.userName}
                  placeholder="Your name ..."
                  onChange={(e) => handleFormInput(e, "userName")}
                  autoComplete="off"
                />
                <TextField
                  type="email"
                  label="Your email (*)"
                  name="email"
                  value={contactus.email}
                  placeholder="Your email"
                  onChange={(e) => handleFormInput(e, "email")}
                  autoComplete="off"
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField
                  type="text"
                  label="Subject (*)"
                  name="subject"
                  value={contactus.subject}
                  onChange={(e) => handleFormInput(e, "subject")}
                  autoComplete="off"
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField
                  type="text"
                  label="Collaborator request code"
                  name="CollaboratorRC"
                  value={contactus.CollaboratorRC}
                  onChange={(e) => handleFormInput(e, "CollaboratorRC")}
                  autoComplete="off"
                  helpText="To find the 4-digit access code, please navigate to your Shopify store admin → Settings → Users. Scroll down to the section Collaborators, and there's your code"
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField
                  type="text"
                  label="Content (*)"
                  name="content"
                  value={contactus.content}
                  onChange={(e) => handleFormInput(e, "content")}
                  autoComplete="off"
                  multiline={4}
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <Button submit={true} variant="primary">Submit</Button>
              </FormLayout.Group>
            </FormLayout>
          </Form>
        </Card>


      </Page>
    </Frame>
  );
}
