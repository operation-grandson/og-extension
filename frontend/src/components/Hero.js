import React from 'react';
import { Card } from 'react-bootstrap';

const Hero = () => {
  return (
    <Card className="text-center mb-5 border-0 shadow-lg">
      <Card.Body className="p-5">
        <div className="mb-4">
          <span className="display-1">🔍</span>
        </div>
        <Card.Title className="display-4 fw-bold mb-3">
          Start Better Conversations Today
        </Card.Title>
        <Card.Text className="lead mb-4">
          Available for all major browsers - install in seconds, strengthen family bonds for years
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Hero;
