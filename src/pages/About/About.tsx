import { Link } from 'react-router-dom';
import PageContainer from '../../components/ui/PageContainer';
import SectionTitle from '../../components/ui/SectionTitle';
import Divider from '../../components/ui/Divider';
import './About.css';

export default function About() {
  return (
    <main className="about">
      <PageContainer>
        {/* 1. INTRO */}
        <section className="about-intro">
          <SectionTitle subtitle="ABOUT" title="Aleyna Gezici" />
          <p className="about-lead">
            Hello, I am a multidisciplinary Interior Designer and Illustrator. I shape my design language through my deep connection with art, bringing together different disciplines to produce unique and holistic works. For me, design means giving a space its identity and ensuring that every detail speaks the same language. Spaces are not just places we pass through, stay in, or commute to every day; spaces provide us with an experience. What turns our state of being there into a memory is the spirit that spaces carry. Design and creativity are a teamwork in which the spirit also collaborates.
          </p>
          <Divider />
        </section>

        {/* 2. EXPERIENCE & APPROACH */}
        <section className="about-section">
          <div className="about-section-header">
            <SectionTitle subtitle="01" title="Professional Experience" />
          </div>
          <div className="about-text-content">
            <p>
              I started my professional career in Istanbul in 2022. During this period, I gained experience in different stages of design by taking part in various office and residential projects in different and exclusive districts of Istanbul. I took an active role in all stages of the project, from concept design and design development to technical drawing and application details, from project coordination to site supervision. I adopted a holistic working approach that ensures design does not just remain an idea but is implemented correctly during the application process.
            </p>
          </div>
        </section>

        {/* 3. MANAGEMENT & VISION */}
        <section className="about-section">
          <div className="about-section-header">
            <SectionTitle subtitle="02" title="Vision & Management" />
          </div>
          <div className="about-text-content">
            <p>
              These experiences allowed me to evaluate the creative aspect of the design process together with its technical and operational requirements, and to effectively manage the process between different disciplines, teams, and project stakeholders.
            </p>
          </div>
        </section>

        {/* 5. CLOSING */}
        <section className="about-closing" style={{ marginTop: '60px' }}>
          <h2>"Let's create something timeless."</h2>
          <Link to="/contact" className="about-contact-link">
            İLETİŞİME GEÇ
          </Link>
        </section>
      </PageContainer>
    </main>
  );
}
