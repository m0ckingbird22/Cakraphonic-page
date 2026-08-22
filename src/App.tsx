import { ShaderBackground } from "./components/ui/gem-smoke";

function App() {
  return (
    <main className="relative isolate min-h-[100svh] overflow-hidden bg-[#160606] text-[#fff8e8]">
      <ShaderBackground className="absolute inset-0 -z-20 block h-full w-full" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(13,3,4,0.78),rgba(48,5,12,0.16)_65%,rgba(13,3,4,0.42))]" />
      <section
        className="mx-auto flex min-h-[100svh] max-w-[1200px] flex-col items-start justify-center px-[clamp(24px,7vw,104px)] pt-[clamp(32px,7vw,88px)] pb-32"
        aria-labelledby="hero-title"
      >
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.16em] text-[#ffbc4c]">
          CAKRAPONIK / 2026
        </p>
        <h1
          id="hero-title"
          className="m-0 max-w-[730px] text-[clamp(4.5rem,12vw,10.5rem)] font-medium leading-[0.84] tracking-[-0.05em]"
        >
          Cakraphonic
        </h1>
        <p className="mt-[34px] mb-7 max-w-[330px] text-base leading-[1.55] text-[rgba(255,248,232,0.76)]">
          UKM Musik Cakrawala University
        </p>
      </section>
      <div
        id="explore"
        className="absolute right-[clamp(24px,7vw,104px)] bottom-8 left-[clamp(24px,7vw,104px)] flex justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-[rgba(255,248,232,0.55)] max-[600px]:flex-col max-[600px]:gap-[18px]"
      >
        <span>Music / Visual / Culture</span>
      </div>
    </main>
  );
}

export default App;
