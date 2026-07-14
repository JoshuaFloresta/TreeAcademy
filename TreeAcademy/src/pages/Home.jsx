import { useState } from 'react';
import Header from '../compoonets/landing/Header';
import Hero from '../compoonets/landing/Hero';
import Features from '../compoonets/landing/Features';
import Instructors from '../compoonets/landing/Intructor';
import Syllabus from '../compoonets/landing/Syllabus';
import Testimonials from '../compoonets/landing/Testimonials';
import FAQ from '../compoonets/landing/FAQs';
import Enrollment from '../compoonets/landing/Enrollment';
import Masterclass from '../compoonets/landing/Masterclass';
import Newsletter from '../compoonets/landing/Newsletter';
import Footer from '../compoonets/landing/FooterSection';

export default function Home() {
  const [enrollmentOpen, setEnrollmentOpen] = useState(false);

  return (
    <main>
      <Header onEnroll={() => setEnrollmentOpen(true)} />
      <Hero onEnroll={() => setEnrollmentOpen(true)} />
      <Features />
      <Instructors />
      <Syllabus />
      <Testimonials />
      <FAQ />
      <Enrollment isOpen={enrollmentOpen} onOpen={() => setEnrollmentOpen(true)} onClose={() => setEnrollmentOpen(false)} />
      <Masterclass />
      <Newsletter />
      <Footer />
    </main>
  );
}
