import PageContainer from '../../components/ui/PageContainer';
import './CV.css';

export default function CV() {
  return (
    <main className="cv">
      <PageContainer>
        <header className="cv-page-header">
          <h1>CURRICULUM VITAE</h1>
          <h2>Aleyna Gezici</h2>
        </header>

        <div className="cv-grid">
          
          {/* COLUMN 1: IDENTITY */}
          <div className="cv-col cv-identity">
            <div className="cv-photo-placeholder">
              <div className="cv-photo-inner"></div>
            </div>
            
            <div className="cv-contact-info">
              <span className="cv-label">M: </span>
              <a href="mailto:aleyna.gezici1@gmail.com">aleyna.gezici1@gmail.com</a>
            </div>

            <div className="cv-behance-group">
              <a href="https://www.behance.net/aleyngeziciportfolio" target="_blank" rel="noopener noreferrer" className="cv-behance-link">
                https://www.behance.net/<br/>aleyngeziciportfolio
              </a>
              
              <a href="https://www.behance.net/aleyngeziciportfolio" target="_blank" rel="noopener noreferrer" className="cv-qr-link" aria-label="Go to Behance Profile">
                <img src="/qr-behance.jpg" alt="Behance QR Code" className="cv-qr-img" />
              </a>
              <a href="https://www.behance.net/aleyngeziciportfolio" target="_blank" rel="noopener noreferrer" className="cv-behance-label" aria-label="Open my Behance profile in a new tab">
                MY BEHANCE <span>→</span>
              </a>
            </div>
          </div>

          {/* COLUMN 2: INTRO */}
          <div className="cv-col cv-intro">
            <h2 className="cv-resume-title">RÉSUMÉ</h2>
            
            <div className="cv-section">
              <h3 className="cv-section-title">CREATIVE JOURNEY</h3>
              <p className="cv-text">
                Hi! I'm Aleyna, a 2021 graduate in Interior Design. I worked as an office and site architect from 2021 to 2024. Since 2024, I have been working freelance on interior design and illustration projects (nearly two years). My experience focuses on residential and office projects across site surveys, concept development, project documentation, visualization, and on-site supervision. I look forward to contributing to new creative projects with a multidisciplinary approach.
              </p>
            </div>

            <div className="cv-section cv-softwares-section">
              <h3 className="cv-section-title">SOFTWARES</h3>
              <ul className="cv-software-list">
                <li><span className="cv-soft-abbr">Ps</span> Adobe Photoshop</li>
                <li><span className="cv-soft-abbr">Kr</span> Krita</li>
                <li><span className="cv-soft-abbr">Ac</span> AutoCAD</li>
                <li><span className="cv-soft-abbr">3d</span> 3D's Max</li>
                <li><span className="cv-soft-abbr">Cr</span> Corona</li>
                <li><span className="cv-soft-abbr">Vr</span> V-ray</li>
                <li><span className="cv-soft-abbr">Ms</span> Microsoft Office</li>
              </ul>
            </div>
          </div>

          {/* COLUMN 3: MIDDLE */}
          <div className="cv-col cv-middle">
            <div className="cv-section">
              <h3 className="cv-section-title">EDUCATION</h3>
              <div className="cv-list-item">
                <h4>Istanbul Bilgi University</h4>
                <p>&gt;Bachelor of Interior Design</p>
              </div>
              <div className="cv-list-item">
                <h4>Uskudar Cumhuriyet Anadolu H.S</h4>
                <p>&gt;Interior Design<br/>(Vocational Diploma)</p>
              </div>
            </div>

            <div className="cv-section">
              <h3 className="cv-section-title">LANGUAGE</h3>
              <div className="cv-lang-item">
                <div className="cv-lang-header">
                  <h4>Turkish</h4>
                </div>
                <div className="cv-lang-bar"><div className="cv-lang-fill cv-lang-native"></div></div>
                <p>(Native)</p>
              </div>
              <div className="cv-lang-item">
                <div className="cv-lang-header">
                  <h4>English</h4>
                </div>
                <div className="cv-lang-bar"><div className="cv-lang-fill cv-lang-pro"></div></div>
                <p>(Professional Working Proficiency)</p>
              </div>
            </div>

            <div className="cv-section">
              <h3 className="cv-section-title">REFERENCE</h3>
              <p className="cv-text cv-italic">References available upon request.</p>
              
              <div className="cv-list-item cv-ref-item">
                <h4>Şeyda Nur Akdem</h4>
                <p>&gt;Senior Interior Designer</p>
              </div>
              <div className="cv-list-item cv-ref-item">
                <h4>Ozan Yüce</h4>
                <p>&gt;Senior Interior Designer</p>
              </div>
            </div>
          </div>

          {/* COLUMN 4: EXPERIENCE */}
          <div className="cv-col cv-experience">
            <h3 className="cv-section-title">EXPERIENCE</h3>
            
            <div className="cv-job">
              <h4 className="cv-company">Independent</h4>
              <h5 className="cv-role">Interior Designer & Illustrator</h5>
              <p className="cv-meta">&gt;Freelance | 2024 - Present</p>
              <p className="cv-desc">&gt;Provided interior design concepts and commissioned illustrations while independently managing client communication and project delivery.</p>
            </div>

            <div className="cv-job">
              <h4 className="cv-company">HEM Architecture</h4>
              <h5 className="cv-role">Interior Architect</h5>
              <p className="cv-meta">&gt;July 2022 - Dec 2024</p>
              <p className="cv-desc">&gt;Developed interior design concepts, technical drawings, renderings, and managed on-site coordination and procurement processes.</p>
            </div>

            <div className="cv-job">
              <h4 className="cv-company">Portakal Ahşap</h4>
              <h5 className="cv-role">Interior Architect</h5>
              <p className="cv-meta">&gt;January 2022 - July 2022</p>
              <p className="cv-desc">&gt;Worked on office and furniture design projects while supporting client communication, sales processes and project presentations.</p>
            </div>

            <div className="cv-job">
              <h4 className="cv-company">Köprü Architecture</h4>
              <h5 className="cv-role">Interior Architecture Intern</h5>
              <p className="cv-meta">&gt;July 2019 - August 2019</p>
            </div>

            <div className="cv-job">
              <h4 className="cv-company">Cansu Cansoy</h4>
              <h5 className="cv-role">Interior Architecture Intern</h5>
              <p className="cv-meta">&gt;September 2016 - May 2017</p>
            </div>

          </div>

        </div>
      </PageContainer>
    </main>
  );
}
