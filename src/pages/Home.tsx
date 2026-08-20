import Hero from '../components/Hero';
import Courses from '../components/Courses';
import Catalog from '../components/Catalog';
import Kids from '../components/Kids';
import Numbers from '../components/Numbers';
import WhyUs from '../components/WhyUs';
import HowItWorks from '../components/HowItWorks';
import Certificate from '../components/Certificate';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';

export default function Home() {
  return (
    <>
      <Hero ready={true} />
      <Courses />
      <Catalog />
      <Kids />
      <Numbers />
      <WhyUs />
      <HowItWorks />
      <Certificate />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
}