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
              İletişime<br />
              geçelim.
            </h1>
            <Divider className="contact-divider" />
            <p className="contact-text">
              Yeni bir projeyi konuşmak, portfolyo detaylarını görüşmek veya tasarım üzerine fikir alışverişinde bulunmak için iletişime geçebilirsiniz.
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
                aria-label="Behance profilini yeni sekmede aç"
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
