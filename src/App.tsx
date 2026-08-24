import { ShaderBackground } from "./components/ui/gem-smoke";
import Navbar from "./components/ui/Navbar";
import NestedCircularText from "./components/ui/NestedCircularText";
import DriftWall, { type DriftWallItem } from "./components/ui/DriftWall";
import SmoothScroll from "./components/ui/smooth-scroll";
import logoWhite from "./assets/logo-white.png";

const documentationItems: DriftWallItem[] = [
  { image: "https://picsum.photos/id/145/600/400", title: "Live session" },
  { image: "https://picsum.photos/id/180/600/400", title: "Sound check" },
  { image: "https://picsum.photos/id/201/600/400", title: "Studio notes" },
  { image: "https://picsum.photos/id/239/600/400", title: "Rehearsal" },
  { image: "https://picsum.photos/id/250/600/400", title: "Stage lights" },
  { image: "https://picsum.photos/id/275/600/400", title: "Field recording" },
  { image: "https://picsum.photos/id/292/600/400", title: "Band practice" },
  { image: "https://picsum.photos/id/312/600/400", title: "After hours" },
  { image: "https://picsum.photos/id/338/600/400", title: "Open mic" },
  { image: "https://picsum.photos/id/399/600/400", title: "Sound culture" },
  { image: "https://picsum.photos/id/431/600/400", title: "Backstage" },
  { image: "https://picsum.photos/id/453/600/400", title: "Creative process" },
  { image: "https://picsum.photos/id/488/600/400", title: "Cakrawala night" },
  { image: "https://picsum.photos/id/514/600/400", title: "Community" },
  { image: "https://picsum.photos/id/559/600/400", title: "Archive" },
];

function App() {
  return (
    <SmoothScroll>
      <main className="bg-black text-[#fff8e8]">
        <Navbar
          navItems={[
            { label: "Home", href: "#home" },
            { label: "About", href: "#about" },
            { label: "Member", href: "#members" },
            { label: "Documentation", href: "#documentation" },
          ]}
        />
        <section
          className="relative isolate min-h-[100svh] overflow-hidden bg-[#160606]"
          id="home"
        >
          <ShaderBackground className="absolute inset-0 -z-20 block h-full w-full" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(13,3,4,0.78),rgba(48,5,12,0.16)_65%,rgba(13,3,4,0.42))]" />
          <section
            className="mx-auto flex min-h-[100svh] max-w-[1200px] flex-col items-start justify-center px-[clamp(24px,7vw,104px)] pt-[clamp(32px,7vw,88px)] pb-32"
            aria-labelledby="hero-title"
          >
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.16em] text-white">
              CAKRAPONIK / 2026
            </p>
            <h1
              id="hero-title"
              className="m-0 max-w-[730px] text-[clamp(4.5rem,12vw,10.5rem)] font-medium leading-[0.84] tracking-[-0.05em] text-white"
            >
              Cakraphonic.
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
            <span>est 2024</span>
          </div>
        </section>
        <section
          id="about"
          className="bg-black px-[clamp(24px,7vw,104px)] py-24 text-white md:py-32"
          aria-labelledby="about-title"
        >
          <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-12 md:flex-row md:justify-between md:gap-20">
            <div className="max-w-2xl font-sans text-sm leading-relaxed text-white/75 md:flex-1">
              <h2
                id="about-title"
                className="mb-5 text-4xl font-bold tracking-tight text-white md:text-5xl"
              >
                kenal lebih dekat dengan
                <br />
                Cakraphonic
              </h2>
              <p>
                Cakraphonic adalah ruang bertemunya suara, ide, dan energi
                kreatif di Cakrawala University. Kami percaya musik bukan
                sekedar bunyi, ia adalah bahasa yang menyatukan orang-orang
                dengan latar berbeda menjadi satu frekuensi yang sama. Di sini,
                setiap mahasiswa punya tempat untuk berkarya, tumbuh, dan
                didengar, tanpa harus jadi yang paling jago dulu cukup jujur dan
                mau belajar.
              </p>
              <p className="mt-4">
                Kami tumbuh dari musik dan bergerak bersama siapa saja yang
                ingin membuat sesuatu yang jujur, berisik, dan berarti.
              </p>
              <p className="mt-4">
                Di sini, setiap nada punya tempat untuk berputar.
              </p>
            </div>
            <div className="flex shrink-0 items-center justify-center md:w-[min(34vw,240px)]">
              <img
                src={logoWhite}
                alt="Cakraphonic"
                className="h-auto w-[min(58vw,280px)] object-contain md:w-full"
              />
            </div>
          </div>
        </section>
        <section
          className="flex w-full flex-col items-center justify-center px-4 py-20"
          aria-labelledby="wheel-title"
        >
          <h2
            id="wheel-title"
            className="mb-16 text-center text-3xl font-bold text-white md:text-5xl"
          >
            Cakraphonic Wheel
          </h2>
          <NestedCircularText />
        </section>
        <section
          id="members"
          className="min-h-[100svh] w-full bg-black px-[clamp(24px,7vw,104px)] py-24 text-white md:py-32"
          aria-labelledby="members-title"
        >
          <div className="mx-auto max-w-[1200px]">
            <h2
              id="members-title"
              className="mb-5 text-3xl font-normal tracking-tight md:text-4xl"
            >
              Cakraphonic Member
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {["Vocal", "Guitar", "Bass", "Drums"].map((member) => (
                <article key={member} className="bg-white/15">
                  <div className="aspect-[4/3] bg-white/10" />
                  <div className="border-t border-black bg-white/20 px-3 py-2">
                    <p className="text-lg leading-none">Name</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/65">
                      {member}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section
          id="documentation"
          className="relative isolate h-[100svh] min-h-[100svh] w-full overflow-hidden bg-black text-white"
          aria-labelledby="documentation-title"
        >
          <h2
            id="documentation-title"
            className="absolute top-8 right-0 left-0 z-10 text-center text-3xl font-bold tracking-tight md:top-12 md:text-5xl"
          >
            Documentation
          </h2>
          <div className="absolute inset-0 flex h-full w-full items-center justify-center">
            <DriftWall
              items={documentationItems}
              columns={5}
              tileWidth={190}
              tileHeight={130}
              gap={18}
              tilt={16}
              turn={-14}
              perspective={1200}
              depth={120}
              speed={42}
              direction="up"
              variance={0.45}
              parallax={0.6}
              lift={64}
              fade={0.6}
              dim={0.55}
              overlayColor="#000000"
              className="mx-auto"
            />
          </div>
        </section>
      </main>
    </SmoothScroll>
  );
}

export default App;
