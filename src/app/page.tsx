import { Header } from "@/components/layout/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <h1 className="text-h1">Build skills that actually move you forward.</h1>
      </main>
    </>
  );
}
