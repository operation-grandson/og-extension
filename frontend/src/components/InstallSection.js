import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';

const InstallSection = ({ onInstallClick }) => {
  const browsers = [
    { name: 'Chrome Web Store', icon: '🌐', variant: 'primary' },
    { name: 'Firefox Add-ons', icon: '🦊', variant: 'success' },
    { name: 'Safari Extensions', icon: '🧭', variant: 'info' },
    { name: 'Edge Add-ons', icon: '⚡', variant: 'warning' }
  ];

  return (
    <Row className="my-5">
      <Col>
        <div className="text-center">
          <h2 className="h3 mb-4">Get Started Now</h2>
          <p className="lead mb-4">Choose your browser to install Operation Grandson</p>
          
          <div className="d-flex flex-wrap justify-content-center gap-3">
            {browsers.map((browser, index) => (
              <Button
                key={index}
                variant={browser.variant}
                size="lg"
                className="install-btn d-flex align-items-center gap-2 px-4 py-3"
                onClick={() => onInstallClick(browser.name)}
              >
                <span>{browser.icon}</span>
                {browser.name}
              </Button>
            ))}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default InstallSection;
