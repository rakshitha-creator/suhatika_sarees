import './AboutUs.css';

export default function AboutUs() {
  return (
    <section className="about-us">
      <div className="about-us__inner">
        <h2 className="about-us__heading">
          Crafted with Heritage.
          <br />
          Worn with Pride.
        </h2>
        <p className="about-us__text">
          Every saree we create carries a story – woven with tradition, designed with elegance, and finished with perfection. Our silk sarees are inspired by India's rich textile heritage, combining timeless craftsmanship with contemporary aesthetics. We believe a saree is not just attire – it is emotion, culture, and identity.
        </p>
        <a href="/about" className="about-us__cta">
          Know Our Story
        </a>
      </div>
    </section>
  );
}
