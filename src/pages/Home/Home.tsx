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
            I do not just design spaces,
            <br />
            I transform lives.
          </p>

          <Link className="hero-button" to="/portfolio">
            EXPLORE PORTFOLIO
            <span>→</span>
          </Link>
        </div>

        <div className="hero-book-placeholder">
          <Link to="/portfolio" className="book" aria-label="Explore Portfolio">
            <div className="book-back"></div>
            <div className="book-pages-right"></div>
            <div className="book-pages-top"></div>
            <div className="book-spine"></div>
            <div className="book-front">
              <div className="book-inner-border"></div>
              <span>INTERIOR ARCHITECT</span>

              <div className="book-title">
                PORTFOLIO
              </div>

              <div className="book-logo">ag</div>
            </div>
          </Link>
        </div>
      </section>

      <div className="hero-footer">
        <span>ISTANBUL / TURKEY</span>
      </div>

      <div className="home-paw-signature" aria-hidden="true">
        <span className="paw-mark paw-mark-one" />
        <span className="paw-mark paw-mark-two" />
        <span className="paw-mark paw-mark-three" />
        <span className="paw-mark paw-mark-four" />
      </div>
    </main>
  )
}
