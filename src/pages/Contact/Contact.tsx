import PageContainer from '../../components/ui/PageContainer';
import Divider from '../../components/ui/Divider';
import './Contact.css';

export default function Contact() {
  return (
    <main className="contact">
      <PageContainer className="contact-container">
        <div className="contact-grid">
          
          {/* Left Column: Intro */}
          <div className="contact-intro">
            <span className="contact-eyebrow">CONTACT</span>
            <h1 className="contact-title">
              Let's work<br />
              together.
            </h1>
            <Divider className="contact-divider" />
            <p className="contact-text">
              To discuss a new project, review portfolio details, or exchange ideas about design, feel free to get in touch.
            </p>
          </div>

          {/* Right Column: Information */}
          <div className="contact-details">
            
            <div className="contact-info-block">
              <span className="contact-label">E-MAIL</span>
              <a href="mailto:aleyna.gezici1@gmail.com" className="contact-link">
                aleyna.gezici1@gmail.com
              </a>
            </div>

            <div className="contact-info-block">
              <span className="contact-label">BEHANCE</span>
              <a 
                href="https://www.behance.net/aleyngeziciportfolio" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="contact-link"
                aria-label="Open Behance profile in a new tab"
              >
                behance.net/aleyngeziciportfolio
              </a>
            </div>

            <div className="contact-cta-wrapper">
              <a href="mailto:aleyna.gezici1@gmail.com" className="contact-cta">
                E-MAIL ME <span>→</span>
              </a>
            </div>
            
          </div>

        </div>
      </PageContainer>
    </main>
  );
}
