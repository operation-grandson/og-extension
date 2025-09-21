import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import InstallSection from './components/InstallSection';
import EmailSignup from './components/EmailSignup';
import Footer from './components/Footer';

function App() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Animate cards on scroll
    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'slideInUp 0.6s ease forwards';
        }
      });
    });

    cards.forEach(card => observer.observe(card));

    // Animate mascot indicators
    const indicators = document.querySelectorAll('.mascot-indicator');
    indicators.forEach(indicator => {
      indicator.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.2)';
      });
      indicator.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
      });
    });

    // Cleanup function
    return () => {
      observer.disconnect();
      indicators.forEach(indicator => {
        indicator.removeEventListener('mouseenter', () => {});
        indicator.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert('Welcome to the family! We\'ll be in touch soon with early access.');
      setEmail('');
    }
  };

  const handleInstallClick = (browser) => {
    alert(`Extension will be available soon for ${browser}! Thanks for wanting to strengthen family connections.`);
  };

  return (
    <div className="App">
      {/* Floating decorative elements */}
      <div className="floating-element">💬</div>
      <div className="floating-element">👥</div>
      <div className="floating-element">❤️</div>

      <Container className="py-4">

        <Header />
        
        <Hero />
        
        <Row className="my-5">
          <Col>
            <Card className="family-connection border-primary">
              <Card.Body className="p-4">
                <div className="text-center mb-3">
                  <span className="card-icon">💙</span>
                </div>
                <Card.Title className="text-center h3 mb-3">Bringing Families Closer Together</Card.Title>
                <Card.Text className="text-center mb-4">
                  Operation Grandson helps bridge the conversation gap between family members by providing context and conversation starters around the content you're reading online. Our AI companion gently guides discussions and helps everyone understand different perspectives.
                </Card.Text>
                
                <div className="conversation-preview">
                  <div className="conversation-bubble user">
                    <div className="conversation-label">You're reading an article about climate policy</div>
                    <span className="mascot-indicator"></span>
                    <em>"This looks like a reliable source with multiple expert citations"</em>
                  </div>
                  <div className="conversation-bubble family">
                    <div className="conversation-label">Weekly family digest email</div>
                    💡 <strong>Conversation starter:</strong> "I noticed you've been reading about environmental policy. Here are some balanced perspectives that might interest our whole family..."
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="my-5">
          <Col>
            <Card>
              <Card.Body className="p-4">
                <div className="text-center mb-3">
                  <span className="card-icon">🔍</span>
                </div>
                <Card.Title className="text-center h3 mb-3">How It Works</Card.Title>
                <Card.Text className="text-center mb-4">
                  Our browser extension quietly analyzes web content as you browse, checking sources and providing gentle feedback through visual indicators. Most importantly, it helps create meaningful talking points for family conversations.
                </Card.Text>
                
                <div className="highlight-box">
                  <strong>💡 The Magic Moment:</strong> Instead of arguments over "fake news," families get conversation starters like "I saw you were reading about this topic - here's what I found interesting about it..."
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <InstallSection onInstallClick={handleInstallClick} />

        <Features />

        <Row className="my-5">
          <Col>
            <Card>
              <Card.Body className="p-4">
                <div className="text-center mb-3">
                  <span className="card-icon">❤️</span>
                </div>
                <Card.Title className="text-center h3 mb-3">Real Families, Real Connections</Card.Title>
                <Card.Text className="text-center">
                  <em>"Instead of avoiding political topics at dinner, we now have the most interesting conversations. Operation Grandson gives us starting points that help us understand each other instead of arguing."</em>
                </Card.Text>
                <Card.Text className="text-center mt-3">
                  <em>"My mom and I were on opposite sides of everything. Now we share articles through the app and actually listen to each other's perspectives. It's brought us so much closer."</em>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <EmailSignup 
          email={email} 
          setEmail={setEmail} 
          onSubmit={handleEmailSubmit} 
        />

        <Footer />
      </Container>
    </div>
  );
}

export default App;
