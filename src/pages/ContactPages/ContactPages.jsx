import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './ContactPages.css';

export default function ContactPages() {
  return (
    <div className="contact-pages">
      <Header />
      <main className="contact-pages__main">
        <section className="contact-pages__intro">
          <div className="contact-pages__container">
            <h1 className="contact-pages__title">
              We are always happy to
              <br />
              assist you.
            </h1>
          </div>
        </section>

        <section className="contact-pages__form-section">
          <div className="contact-pages__container">
            <div className="contact-pages__card">
              <form className="contact-pages__form" onSubmit={(e) => e.preventDefault()}>
                <div className="contact-pages__grid">
                  <div className="contact-pages__col">
                    <label className="contact-pages__label">
                      Name
                      <input className="contact-pages__input" type="text" placeholder="Enter Full Name" />
                    </label>

                    <label className="contact-pages__label">
                      Email Id
                      <input className="contact-pages__input" type="email" placeholder="Enter Email address" />
                    </label>

                    <label className="contact-pages__label">
                      Phone no
                      <input className="contact-pages__input" type="tel" placeholder="eg: 1234578654786" />
                    </label>
                  </div>

                  <div className="contact-pages__col contact-pages__col--right">
                    <label className="contact-pages__label">
                      Message
                      <textarea className="contact-pages__textarea" placeholder="Enter Email address" />
                    </label>

                    <div className="contact-pages__actions">
                      <button className="contact-pages__btn" type="submit">
                        Leave us a Message
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
