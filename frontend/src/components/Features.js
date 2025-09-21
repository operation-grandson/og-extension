import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const Features = () => {
  const features = [
    {
      icon: '💬',
      title: 'Conversation Starters',
      description: 'Transform content into meaningful family discussions with AI-generated talking points'
    },
    {
      icon: '🔍',
      title: 'Gentle Source Checking',
      description: 'Quiet visual indicators help you understand content reliability without judgment'
    },
    {
      icon: '📧',
      title: 'Family Digest',
      description: 'Optional weekly summaries help family members understand each other\'s interests'
    },
    {
      icon: '🌉',
      title: 'Bridge Perspectives',
      description: 'Find common ground by understanding different viewpoints on the same topics'
    },
    {
      icon: '🤝',
      title: 'Respectful Dialogue',
      description: 'Tools to help family conversations stay loving even when opinions differ'
    },
    {
      icon: '🔒',
      title: 'Privacy Centered',
      description: 'Your family\'s conversations stay private - you control all sharing'
    }
  ];

  return (
    <Row className="my-5">
      <Col>
        <h2 className="text-center mb-5 h3">Features</h2>
        <Row className="g-4">
          {features.map((feature, index) => (
            <Col key={index} md={6} lg={4}>
              <Card className="h-100 feature border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="feature-icon mb-3">
                    {feature.icon}
                  </div>
                  <Card.Title className="h5 mb-3">{feature.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {feature.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};

export default Features;
