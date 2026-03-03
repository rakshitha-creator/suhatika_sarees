import Header from '../../components/Header/Header';
import Hero from '../../components/Hero/Hero';
import NewArrival from '../../components/NewArrival/NewArrival';
import AboutUs from '../../components/AboutUs/AboutUs';
import Collections from '../../components/Collections/Collections';
import WhyChoose from '../../components/WhyChoose/WhyChoose';
import Celebrate from '../../components/Celebrate/Celebrate';
import Footer from '../../components/Footer/Footer';
import './AboutPages.css';

export default function AboutPages() {
  return (
    <div className="about-pages">
      <Header />
      <Hero />
      <NewArrival />
      <AboutUs />
      <Collections />
      <WhyChoose />
      <Celebrate />
      <Footer />
    </div>
  );
}
