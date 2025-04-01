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
  FormLayout,
  TextField,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { Form } from "@remix-run/react";
import { useState } from "react";

export default function ContactUs() {
  const [contactus,setContactus] = useState({
    userName:'',
    email:'',
    subject:'[request a quote] I need support',
    CollaboratorRC:'',
    content:'',
  });

  const handleFormInput =(e, name)=>{
    setContactus((prevValue) => ({ ...prevValue, [name]: e }));

  }
      return (
        <Page title="Contact Us">
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
                  onChange={(e)=>{handleFormInput(e, "userName")}}
                  autoComplete="off"
                  />
                <TextField
                  type="email"
                  label="Your email (*)"
                  name="email"
                  value={contactus.email}
                  placeholder="Your email"
                  onChange={(e)=>{handleFormInput(e, "email")}}
                  autoComplete="off"
                />
                </FormLayout.Group>
                <FormLayout.Group>
                <TextField
                  type="text"
                  label="Subject (*)"
                  name="subject"
                  value={contactus.subject}
                  onChange={(e)=>{handleFormInput(e, "subject")}}
                  autoComplete="off"
                />
                </FormLayout.Group>
                <FormLayout.Group>
                <TextField
                  type="text"
                  label="Collaborator request code"
                  name="CollaboratorRC"
                  value={contactus.CollaboratorRC}
                  onChange={(e)=>{handleFormInput(e, "CollaboratorRC")}}
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
                  onChange={(e)=>{handleFormInput(e, "content")}}
                  autoComplete="off"
                  multiline={4} 
                 />
                </FormLayout.Group>
                <FormLayout.Group>
                <Button type="submit" variant="primary">Submit</Button>
                </FormLayout.Group>
                
                
    
  </FormLayout>
  </Form>
          </Card>
        </Page>
     
  );
}

