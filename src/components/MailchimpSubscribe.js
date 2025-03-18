// components/MailchimpSubscribe.js
import React, { useState } from "react";
import { Row, Col, Form, Button, InputGroup, Alert } from "react-bootstrap";

/**
 * Mailchimp subscription form component styled with React Bootstrap
 * @param {Object} props Component props
 * @param {string} props.className Additional CSS classes
 * @param {string} props.placeholder Placeholder text for email input
 * @param {string} props.buttonText Text for the submit button
 * @param {string} props.buttonVariant Bootstrap button variant
 * @param {Object} props.formProps Additional props for Form component
 * @returns {JSX.Element} Rendered component
 */
const MailchimpSubscribe = ({
  className = "",
  placeholder = "Your Email",
  buttonText = "Subscribe",
  buttonVariant = "primary",
  formProps = {},
}) => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    // We don't prevent default because we want the form to actually submit to Mailchimp
    // This will open in a new tab due to the target="_blank" attribute

    if (!email || !email.includes("@")) {
      e.preventDefault();
      setMessage({
        type: "danger",
        text: "Please enter a valid email address",
      });
      return;
    }

    setSubmitting(true);
    // The form will handle the actual submission to Mailchimp
    // We just need to show a success message before the page changes
    setMessage({ type: "success", text: "Thanks for subscribing!" });

    // Reset after submission (though user will likely be redirected by Mailchimp)
    setTimeout(() => {
      setSubmitting(false);
    }, 2000);
  };

  return (
    <Row className={className + " bt-3"}>
      <Col xs={12}>
        <h3>Want to receive free tutorials?</h3>
        <p>
          Get a free tutorial delivered right to your inbox each month...sign up
          now!
        </p>
      </Col>
      <Col xs={12}>
        {message && (
          <Alert
            variant={message.type}
            onClose={() => setMessage(null)}
            dismissible
          >
            {message.text}
          </Alert>
        )}

        <Form
          id='mc-embedded-subscribe-form'
          className='validate'
          action='//naturalmusicstore.us12.list-manage.com/subscribe/post?u=3555d06362fd1009fbd0784ad&amp;id=ff59552330'
          method='post'
          name='mc-embedded-subscribe-form'
          target='_blank'
          noValidate
          onSubmit={handleSubmit}
          {...formProps}
        >
          <InputGroup className='mb-3'>
            <Form.Control
              type='email'
              name='EMAIL'
              id='mce-EMAIL'
              className='required email'
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label='Email address'
            />
            <Button
              variant={buttonVariant}
              type='submit'
              name='subscribe'
              id='mc-embedded-subscribe'
              disabled={submitting}
            >
              {submitting ? "Subscribing..." : buttonText}
            </Button>
          </InputGroup>
          <div
            style={{ position: "absolute", left: "-5000px" }}
            aria-hidden='true'
          >
            <input
              type='text'
              name='b_3555d06362fd1009fbd0784ad_ff59552330'
              tabIndex='-1'
            />
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default MailchimpSubscribe;
