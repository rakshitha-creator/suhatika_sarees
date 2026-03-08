import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Collections from '../../components/Collections/Collections';
import './CollectionPages.css'; 

export default function CollectionPages() {
  return (
    <div className="collection-pages">
      <Header />

      <main className="collection-pages__main">
        <section className="collection-pages__hero">
          <div className="collection-pages__hero-bg" aria-hidden="true" />
          <div className="collection-pages__hero-card">
            <h1 className="collection-pages__hero-title">
              Where Tradition Meets Timeless
              <br />
              Elegance
            </h1>
            <a href="#/collections" className="collection-pages__hero-cta">
              Explore Collections
            </a>
          </div>
        </section>

        <Collections />

        <section className="collection-pages__discover">
          <div className="collection-pages__discover-inner">
            <h2 className="collection-pages__discover-title">
              Discover Our Exquisite Silk Collections
            </h2>

            <p className="collection-pages__discover-text">
              Each collection is thoughtfully curated to celebrate the richness
              of tradition and the elegance of modern design. From vibrant
              festive hues to timeless wedding classics, our silk sarees are
              crafted to make every occasion unforgettable.
            </p>

            <p className="collection-pages__discover-text">
              Every piece reflects fine craftsmanship, luxurious texture, and
              intricate detailing — designed for women who appreciate
              authenticity and grace.
            </p>
          </div>
        </section>

        <section className="collection-pages__cta">
          <div className="collection-pages__cta-inner">
            <div className="collection-pages__cta-content">
              <h2 className="collection-pages__cta-title">
                Elegance woven into every thread.
              </h2>

              <p className="collection-pages__cta-text">
                Explore the newest additions to our premium silk collection.
              </p>
            </div>

            <a href="#/collections" className="collection-pages__cta-btn">
              View All Collections
            </a>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}