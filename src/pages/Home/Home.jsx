import Header from '../../components/Header/Header';
import Hero from '../../components/Hero/Hero';
import NewArrival from '../../components/NewArrival/NewArrival';
import AboutUs from '../../components/AboutUs/AboutUs';
import WhyChoose from '../../components/WhyChoose/WhyChoose';
import Celebrate from '../../components/Celebrate/Celebrate';
import Footer from '../../components/Footer/Footer';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <Header />
      <Hero />
      <NewArrival />
      <AboutUs />
      <WhyChoose />
      <Celebrate />
      <Footer />
    </div>
  );
}
