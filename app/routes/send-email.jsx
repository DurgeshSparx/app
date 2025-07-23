import { Form, useActionData } from "@remix-run/react";
import nodemailer from "nodemailer";

export const action = async ({ request }) => {
  //const formData = await request.formData();
  const to = 'durgeshdixitsharma@gmail.com'; //formData.get("to");
  const subject = 'dev testing'; //formData.get("subject");
  const text = 'this is the text data'; //formData.get("text");

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    return { message: "Email sent successfully!" };
  } catch (error) {
    return { error: "Failed to send email: " + error.message };
  }
};

export default function SendEmail() {
  const actionData = useActionData();

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Send an Email</h1>
      <Form method="post">
        <div>
          <label htmlFor="to">Recipient Email:</label>
          <input type="email" name="to" id="to" required />
        </div>
        <div>
          <label htmlFor="subject">Subject:</label>
          <input type="text" name="subject" id="subject" required />
        </div>
        <div>
          <label htmlFor="text">Message:</label>
          <textarea name="text" id="text" required></textarea>
        </div>
        <button type="submit">Send Email</button>
      </Form>
      {actionData?.message && <p style={{ color: "green" }}>{actionData.message}</p>}
      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
    </div>
  );
}