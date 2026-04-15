import LandingForm from "@/components/LandingForm";
import DotField from "@/components/DotField";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 py-12 text-white">
      <DotField
        dotRadius={1.25}
        dotSpacing={26}
        cursorRadius={220}
        cursorForce={0.1}
        bulgeOnly
        bulgeStrength={5}
        sparkle={false}
        waveAmplitude={0}
        dotColor="#fff"
      />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-[1] mx-auto h-72 max-w-5xl -translate-y-1/2 bg-black/70 blur-3xl" />
      <section className="relative z-10 w-full text-center">
        <p className="mb-5 text-xs uppercase tracking-[0.42em] text-neutral-300 drop-shadow-[0_2px_18px_rgba(0,0,0,0.95)]">
          GitAtlas
        </p>
        <h1 className="mx-auto mb-8 max-w-3xl text-4xl font-semibold leading-tight text-white drop-shadow-[0_4px_28px_rgba(0,0,0,1)] sm:text-6xl">
          Explore a galaxy of commits.
        </h1>
        <LandingForm />
      </section>
    </main>
  );
}
