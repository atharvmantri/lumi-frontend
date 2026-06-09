import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Tools from '@/components/Tools';
import HowItWorks from '@/components/HowItWorks';
import Privacy from '@/components/Privacy';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Tools />
        <HowItWorks />
        <Privacy />
      </main>
      <Footer />
    </>
  );
}
