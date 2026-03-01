import './WhyChoose.css';

const benefits = [
  'Pure premium silk fabrics',
  'Handcrafted detailing',
  'Elegant color combinations',
  'Perfect for weddings & festive occasions',
  'Quality assurance in every weave',
];

export default function WhyChoose() {
  return (
    <section className="why-choose">
      <div className="why-choose__inner">
        <h2 className="why-choose__title">
          Why Choose Our Silk
          <br />
          Sarees?
        </h2>
        <ul className="why-choose__list">
          {benefits.map((item, i) => (
            <li key={i} className="why-choose__item">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
