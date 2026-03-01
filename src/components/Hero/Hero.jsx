import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true" />
      <div className="hero__card">
        <h1 className="hero__title">
          Where Tradition Meets Timeless
          <br />
          Elegance
        </h1>
        <a href="/collections" className="hero__cta">
          Explore Collections
        </a>
      </div>
    </section>
  );
}