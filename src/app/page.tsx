import { Header } from "@/components/layout/Header";
import { Categories } from "@/components/sections/Categories";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Categories />
        <Contact />
      </main>
    </>
  );
}
