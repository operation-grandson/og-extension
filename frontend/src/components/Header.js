import React from 'react';
import { Badge } from 'react-bootstrap';

const Header = () => {
  return (
    <header className="header text-center mb-5">
      <div className="logo-container">
        <div className="logo"></div>
      </div>
      <h1 className="title">Operation Grandson</h1>
      <p className="subtitle">Building Bridges Through Better Conversations</p>
      <p className="tagline">Helping families stay connected across generations and perspectives</p>
      
      <div className="mt-4">
        <Badge bg="light" text="dark" className="me-2 mb-2">🤝 Bridge differences</Badge>
        <Badge bg="light" text="dark" className="me-2 mb-2">💬 Better conversations</Badge>
        <Badge bg="light" text="dark" className="mb-2">👨‍👩‍👧‍👦 Family first</Badge>
      </div>
    </header>
  );
};

export default Header;
