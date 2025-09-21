import React from 'react';
import { Card } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer mt-5">
      <Card className="border-0 bg-light">
        <Card.Body className="text-center p-4">
          <Card.Title className="h5 mb-3">
            <strong>Operation Grandson</strong> - Where every conversation builds connection
          </Card.Title>
          <div className="mb-3">
            <a href="#" className="text-muted text-decoration-none me-3">Privacy Policy</a>
            <a href="#" className="text-muted text-decoration-none me-3">Terms of Service</a>
            <a href="#" className="text-muted text-decoration-none">Contact</a>
          </div>
          <small className="text-muted">
            © 2024 Operation Grandson. Bringing families together, one conversation at a time.
          </small>
        </Card.Body>
      </Card>
    </footer>
  );
};

export default Footer;
