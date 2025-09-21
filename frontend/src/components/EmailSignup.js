import React from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';

const EmailSignup = ({ email, setEmail, onSubmit }) => {
  return (
    <Row className="my-5">
      <Col>
        <Card className="email-signup border-0 text-white">
          <Card.Body className="p-5 text-center">
            <Card.Title className="h3 mb-3">Join Families Building Better Conversations</Card.Title>
            <Card.Text className="mb-4">
              Be part of a movement to bring families closer together through understanding
            </Card.Text>
            
            <Form onSubmit={onSubmit} className="d-flex flex-column flex-md-row gap-3 justify-content-center align-items-center">
              <Form.Group className="mb-3 mb-md-0" style={{ minWidth: '300px' }}>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="email-input"
                />
              </Form.Group>
              <Button 
                type="submit" 
                variant="light" 
                size="lg"
                className="email-btn px-4"
              >
                Join the Movement
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default EmailSignup;
