import LandingForm from "@/components/LandingForm";
import Starfield from "@/components/Starfield";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-12 text-white">
      <Starfield />
      <section className="relative z-10 w-full text-center">
        <p className="mb-5 text-xs uppercase tracking-[0.42em] text-neutral-500">GitAtlas</p>
        <h1 className="mx-auto mb-8 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-6xl">
          Explore a galaxy of commits.
        </h1>
        <LandingForm />
      </section>
    </main>
  );
}
