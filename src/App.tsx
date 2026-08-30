import { useState } from "react";
import { ShaderBackground } from "./components/ui/gem-smoke";
import Navbar from "./components/ui/Navbar";
import StaggeredMenu from "./components/ui/StaggeredMenu";
import DriftWall, { type DriftWallItem } from "./components/ui/DriftWall";
import SmoothScroll from "./components/ui/smooth-scroll";
import logoWhite from "./assets/logo-white.png";
import daps from "./assets/dapps.jpg";
import SGA from "./assets/SGA.png";
import andrew from "./assets/andrew-guitarist.jpeg";
import jeje from "./assets/jeje.jpeg";
import farhan from "./assets/farhan.jpeg";
import vanya from "./assets/vanyaa.jpeg";
import panji from "./assets/panji2.jpeg";
import aldi from "./assets/aldi.jpeg";
import kelvin from "./assets/kelvin.jpeg";
import altap from "./assets/altap.jpeg";
import banu from "./assets/banu.jpeg";
import khay from "./assets/khayy.jpeg";
import panji2 from "./assets/panji.jpeg";
import dovi from "./assets/dovi.jpeg";

const documentationItems: DriftWallItem[] = [
  { image: panji2, title: "Live session" },
  { image: panji2, title: "Live session" },
  { image: panji2, title: "Live session" },
  { image: panji2, title: "Live session" },
  { image: panji2, title: "Live session" },
  { image: panji2, title: "Live session" },
  { image: panji2, title: "Live session" },
  { image: panji2, title: "Live session" },
  { image: panji2, title: "Live session" },
  { image: panji2, title: "Live session" },
  { image: panji2, title: "Live session" },
];

const partnerships = [
  { name: "Cakrawala University", type: "Campus" },
  { name: "Student Assosiation Goverment", type: "Organization", image: SGA },
  { name: "Cakrawala Festival", type: "Event" },
];

const members = [
  { name: "Dovi", type: "President", image: dovi },
  { name: "Altap", type: "Vice President", image: altap },
  { name: "Vanya", type: "Manager", image: vanya },
  { name: "Banu", type: "Secretary", image: banu },
  { name: "Andrew", type: "Guitarist", image: andrew },
  { name: "Farhan", type: "guitarist", image: farhan },
  { name: "Kelvin", type: "Bassist", image: kelvin },
  { name: "Jauza", type: "Singer", image: jeje },
  { name: "Dhafi", type: "Drummer", image: daps },
  //{ name: "Zilan", type: "Bassist" },
  { name: "Khay", type: "Singer", image: khay },
  { name: "Panji", type: "Singer", image: panji },
  //{ name: "Dizza", type: "Singer" },
  { name: "Aldhi", type: "Pianist", image: aldi },
];

function MemberGrid() {
  const [showTalent, setShowTalent] = useState(false);
  const [activeMember, setActiveMember] = useState<string | null>(null);

  const visibleMembers = showTalent
    ? members.filter((item) =>
        /guitar|drummer|bassist|singer|pianist/i.test(item.type),
      )
    : members.filter((item) =>
        /manager|president|producer|vice president|secretary/i.test(item.type),
      );

  return (
    <>
      <div className="mb-5 flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex min-w-0 flex-col items-start gap-1 md:flex-row md:items-baseline md:gap-3">
          <h2
            id="members-title"
            className="text-3xl font-bold tracking-tight md:text-5xl"
          >
            Meet Our Member
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#d6b56d] md:text-lg">
            {showTalent ? "Talent" : "Management"}
          </span>
        </div>
        <button
          type="button"
          aria-label={showTalent ? "Show management" : "Meet our talent"}
          aria-pressed={showTalent}
          className="flex min-w-0 max-w-[48%] shrink-0 items-center justify-end gap-1 text-right text-[11px] uppercase tracking-[0.08em] text-white transition-colors hover:text-[#d6b56d] sm:gap-2 sm:text-sm sm:tracking-[0.12em]"
          onClick={() => setShowTalent((current) => !current)}
        >
          <span className="truncate">
            {showTalent ? "Management" : "Meet Our Talent"}
          </span>
          <span aria-hidden="true" className="shrink-0 text-2xl leading-none">
            {showTalent ? "←" : "→"}
          </span>
        </button>
      </div>
      <div className="member-grid-scroll">
        <div
          key={showTalent ? "talent" : "management"}
          className={`member-grid member-grid--transition grid pb-4 ${
            showTalent ? "" : "member-grid--management"
          }`}
        >
          {visibleMembers.map((item, index) => (
            <article
              key={`${item.name}-${index}`}
              tabIndex={0}
              role="button"
              aria-pressed={activeMember === item.name}
              onClick={() =>
                setActiveMember((current) =>
                  current === item.name ? null : item.name,
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveMember((current) =>
                    current === item.name ? null : item.name,
                  );
                }
              }}
              className={`group flex min-h-[320px] snap-center flex-col overflow-hidden rounded-md border-2 bg-white/15 p-2 transition-all duration-300 md:min-h-[400px] ${
                activeMember === item.name
                  ? "border-[#d6b56d] bg-[#d6b56d]/15 shadow-[0_0_24px_rgba(214,181,109,0.2)]"
                  : "border-white/30 hover:border-[#d6b56d] hover:bg-[#d6b56d]/15 hover:shadow-[0_0_24px_rgba(214,181,109,0.2)]"
              }`}
            >
              <div className="h-[250px] overflow-hidden p-4 md:h-[320px]">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={`Foto ${item.name}`}
                    draggable={false}
                    className={`h-full w-full rounded-sm object-cover transition-all duration-300 group-hover:grayscale-0 ${
                      activeMember === item.name ? "grayscale-0" : "grayscale"
                    }`}
                  />
                ) : (
                  <div className="h-full w-full rounded-sm bg-white/10" />
                )}
              </div>
              <div className="mt-auto px-3 py-2">
                <p className="text-lg font-bold leading-none">{item.name}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/65">
                  {item.type}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <SmoothScroll>
      <main className="bg-black text-[#fff8e8]">
        <StaggeredMenu
          className="md:hidden"
          logoUrl={logoWhite}
          position="right"
          colors={["#8d431c", "#d6b56d"]}
          displayItemNumbering
          items={[
            { label: "Home", ariaLabel: "Go to home section", link: "#home" },
            {
              label: "About",
              ariaLabel: "Go to about section",
              link: "#about",
            },
            {
              label: "Member",
              ariaLabel: "Go to member section",
              link: "#members",
            },
            {
              label: "Partnership",
              ariaLabel: "Go to partnership section",
              link: "#partnership",
            },
            {
              label: "Documentation",
              ariaLabel: "Go to documentation section",
              link: "#documentation",
            },
            {
              label: "Join Us",
              ariaLabel: "Join Cakraphonic",
              link: "#join-us",
            },
          ]}
        />
        <Navbar
          className="hidden md:grid"
          navItems={[
            { label: "Home", href: "#home" },
            { label: "About", href: "#about" },
            { label: "Member", href: "#members" },
            { label: "partnership", href: "#partnership" },
            { label: "Documentation", href: "#documentation" },
            { label: "Join Us", href: "#join-us" },
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
              CAKRAPHONIK / 2026
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
          <div className="mx-auto max-w-[1200px] flex-col items-center gap-12 md:flex-row md:justify-between md:gap-20 mt-20">
            <div className="max-w-2xl font-sans text-sm leading-relaxed text-white/75 md:flex-1">
              <h2 className="mb-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
                Vision
              </h2>
              <p>
                Cakraphonic merupakan salah satu Unit Kegiatan Mahasiswa (UKM)
                di Universitas Cakrawala yang bergerak di bidang seni musik.
                Organisasi ini bertujuan untuk mengembangkan minat dan bakat
                mahasiswa di bidang musik, serta meningkatkan kompetensi dan
                profesionalisme anggota, baik dalam bidang musik itu sendiri
                maupun dalam penyelenggaraan (event organizing) acara musik,
                baik di lingkungan internal kampus maupun eksternal.
              </p>
            </div>
          </div>
          <div className="mx-auto  max-w-[1200px] flex-col items-center gap-12 md:flex-row md:justify-between md:gap-20 mt-20">
            <div className="max-w-2xl font-sans text-sm leading-relaxed text-white/75 md:flex-1">
              <h2 className="mb-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
                Mision
              </h2>
              <ol className="list-decimal space-y-4 pl-5">
                <li className="pl-2">
                  Menyediakan wadah dan sarana bagi mahasiswa untuk
                  mengembangkan minat, bakat, dan kompetensi di bidang musik
                  secara berkelanjutan.
                </li>
                <li className="pl-2">
                  Membentuk dan mengembangkan unit-unit musik (band) sebagai
                  wadah aktualisasi diri serta representasi organisasi dalam
                  berbagai kegiatan dan kompetisi.
                </li>
                <li className="pl-2">
                  Menyelenggarakan event musik secara profesional dan
                  meningkatkan kompetensi anggota dalam bidang manajemen acara
                  (event organizing), baik di lingkungan internal Universitas
                  Cakrawala maupun eksternal.
                </li>
              </ol>
            </div>
          </div>
        </section>
        <section
          id="members"
          className="relative isolate min-h-0 w-full overflow-hidden bg-[#160606] px-[clamp(24px,7vw,104px)] py-12 text-white md:min-h-[100svh] md:py-32"
          aria-labelledby="members-title"
        >
          <ShaderBackground className="absolute inset-0 -z-20 block h-full w-full" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(13,3,4,0.78),rgba(48,5,12,0.16)_65%,rgba(13,3,4,0.42))]" />
          <div className="relative z-10 mx-auto max-w-[1200px]">
            <MemberGrid />
          </div>
        </section>
        <section
          id="partnership"
          className="flex min-h-0 w-full items-center bg-black px-[clamp(24px,7vw,104px)] py-12 text-white md:min-h-[100svh] md:py-32"
          aria-labelledby="partnership-title"
        >
          <div className="mx-auto w-full max-w-[1200px]">
            <h2
              className="mb-5 text-3xl font-bold tracking-tight md:text-5xl"
              id="partnership-title"
            >
              Cakraphonic Partnership
            </h2>
            <div className="member-grid-scroll">
              <div className="partnership-grid grid gap-3 md:gap-5">
                {partnerships.map((item) => (
                  <article
                    key={item.name}
                    className="group flex min-h-[300px] snap-center flex-col overflow-hidden rounded-md border-2 border-white/30 bg-white/15 p-2 transition-all duration-300 hover:border-[#d6b56d] hover:bg-[#d6b56d]/15 hover:shadow-[0_0_24px_rgba(214,181,109,0.2)] md:min-h-[360px]"
                  >
                    <div className="h-[220px] overflow-hidden p-4 md:h-[280px]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={`Foto ${item.name}`}
                          className="h-full w-full rounded-sm object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
                        />
                      ) : (
                        <div className="h-full w-full rounded-sm bg-white/10" />
                      )}
                    </div>
                    <div className="mt-auto px-3 py-2">
                      <p className="text-lg font-bold leading-none">
                        {item.name}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/65">
                        {item.type}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
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
        <section
          id="join-us"
          className="flex min-h-[70svh] items-center justify-center bg-black px-[clamp(24px,7vw,104px)] py-20 text-center text-white md:min-h-[80svh] md:py-32"
          aria-labelledby="join-us-title"
        >
          <div className="mx-auto max-w-4xl">
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#d6b56d] md:text-xs">
              Cakraphonic Open Recruitment
            </p>
            <h2
              id="join-us-title"
              className="text-[clamp(2.75rem,8vw,7rem)] font-bold uppercase leading-[0.9] tracking-[-0.04em]"
            >
              We Want Your Talent To Grow!
            </h2>
            <p className="mx-auto mt-7 max-w-xl text-sm leading-relaxed text-white/65 md:text-base">
              Punya minat dan bakat di bidang musik? Mari tumbuh, berkarya, dan
              membuat sesuatu yang berarti bersama Cakraphonic.
            </p>
            <a
              href="https://wa.me/6281617770096?text=Halo%20Cakraphonic%2C%20saya%20ingin%20mendaftar."
              target="_blank"
              rel="noreferrer"
              className="mt-9 inline-flex min-h-12 items-center justify-center rounded-full border border-[#d6b56d] bg-[#d6b56d] px-7 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-black transition-colors duration-300 hover:bg-transparent hover:text-[#d6b56d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d6b56d] md:px-9 md:text-sm"
            >
              Chat via WhatsApp
            </a>
          </div>
        </section>
        <footer className="bg-[#232323] px-6 py-10 text-white sm:px-8 md:px-[clamp(24px,7vw,104px)] md:py-16">
          <div className="mx-auto max-w-[1200px]">
            <div className="grid gap-8 md:grid-cols-[1fr_0.8fr] md:gap-20">
              <div>
                <img
                  src={logoWhite}
                  alt="Cakraphonic"
                  className="h-auto w-[min(28vw,90px)] object-contain md:w-[220px]"
                />
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/80 md:mt-8 md:text-base">
                  Cakraphonic adalah ruang bertemunya suara, ide, dan energi
                  kreatif di Cakrawala University.
                </p>
              </div>
              <address className="not-italic md:pt-8">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#d6b56d]">
                  Visit Us
                </p>
                <p className="max-w-sm text-sm leading-relaxed text-white/85 sm:text-base">
                  Jl. Kemang Timur No.1, RT.14/RW.8, Pejaten Baru., Ps. Minggu,
                  Jakarta Selatan, DKI Jakarta 12510
                </p>
              </address>
            </div>
            <div className="mt-8 flex flex-col items-start gap-4 border-t border-[#d6b56d]/70 pt-5 md:mt-14 md:flex-row md:items-center md:justify-between md:pt-6">
              <p className="text-sm text-white/70">
                © 2026 Cakrawala University. All Rights Reserved.
              </p>
              <a
                href="https://www.instagram.com/cakraphonic/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex text-sm font-semibold uppercase tracking-[0.12em] text-[#d6b56d] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d6b56d]"
              >
                Instagram
              </a>
            </div>
          </div>
        </footer>
      </main>
    </SmoothScroll>
  );
}

export default App;
