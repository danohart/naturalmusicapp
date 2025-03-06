// pages/login.js
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import { Row, Col, Form, Button, Card, Alert, Spinner } from "react-bootstrap";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const router = useRouter();

  // Get the redirect URL from query parameters or default to homepage
  const { redirect } = router.query;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    const result = await login(username, password);

    if (result.success) {
      router.push(redirect || "/");
    } else {
      setError(result.error);
    }
  };

  return (
    <Row className='justify-content-center'>
      <Col md={6} lg={5}>
        <Card className='shadow-sm'>
          <Card.Body className='p-4'>
            <div className='text-center mb-4'>
              <h2 className='fw-bold'>Sign in to your account</h2>
            </div>

            {error && <Alert variant='danger'>{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className='mb-3'>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  id='username'
                  type='text'
                  placeholder='Enter username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className='mb-4'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  id='password'
                  type='password'
                  placeholder='Enter password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <div className='d-grid'>
                <Button
                  variant='primary'
                  type='submit'
                  disabled={loading}
                  className='py-2'
                >
                  {loading ? (
                    <>
                      <Spinner
                        as='span'
                        animation='border'
                        size='sm'
                        role='status'
                        aria-hidden='true'
                        className='me-2'
                      />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
