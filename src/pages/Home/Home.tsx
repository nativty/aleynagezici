import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <main className="home">
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">INTERIOR ARCHITECT</p>

          <h1>
            Aleyna
            <br />
            Gezici
          </h1>

          <div className="hero-line" />

          <p className="hero-description">
            Mekânları sadece tasarlamıyorum,
            <br />
            yaşamları dönüştürüyorum.
          </p>

          <Link className="hero-button" to="/portfolio">
            PORTFOLYOYU KEŞFET
            <span>→</span>
          </Link>
        </div>

        <div className="hero-book-placeholder">
          <Link to="/portfolio" className="book" aria-label="Portfolyoyu İncele">
            <div className="book-back"></div>
            <div className="book-pages-right"></div>
            <div className="book-pages-top"></div>
            <div className="book-spine"></div>
            <div className="book-front">
              <div className="book-inner-border"></div>
              <span>INTERIOR ARCHITECT</span>

              <div className="book-title">
                PORTFOLIO
                <small>2026</small>
              </div>

              <div className="book-logo">ag</div>
            </div>
          </Link>
        </div>
      </section>

      <div className="hero-footer">
        <span>ISTANBUL / TURKEY</span>
        <button 
          className="scroll-btn" 
          onClick={() => {
            document.getElementById('explore-target')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          SCROLL TO EXPLORE ↓
        </button>
      </div>

      <div id="explore-target" className="home-explore-target"></div>
    </main>
  )
}
