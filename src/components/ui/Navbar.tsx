import { useEffect, useState, type ReactNode } from "react";
import { useLenis } from "lenis/react";
import SpecularButton from "./SpecularButton";

type NavItem = {
  label: string;
  href: string;
};

type NavbarProps = {
  navItems: NavItem[];
  threshold?: number;
  logoSrc?: string;
  logoAlt?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
  children?: ReactNode;
};

function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function useScrollPosition(threshold = 50): boolean {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let animationFrame = 0;

    const updateScrollState = () => {
      animationFrame = 0;
      setIsScrolled(window.scrollY > threshold);
    };

    const handleScroll = () => {
      if (animationFrame === 0) {
        animationFrame = requestAnimationFrame(updateScrollState);
      }
    };

    updateScrollState();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrame !== 0) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [threshold]);

  return isScrolled;
}

export default function Navbar({
  navItems,
  threshold = 50,
  className,
  children,
}: NavbarProps) {
  const isScrolled = useScrollPosition(threshold);
  const lenis = useLenis();

  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        "fixed inset-x-0 top-0 z-20 mx-auto grid w-max max-w-[calc(100%-2rem)] grid-cols-1 items-center overflow-hidden border px-4 transition-all duration-300 ease-in-out",
        isScrolled
          ? "top-4 rounded-full border-white/10 bg-black/70 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.24)] backdrop-blur-xl"
          : "rounded-full border-transparent bg-transparent py-6 shadow-none",
        className,
      )}
    >
      <div className="relative z-10 flex items-center justify-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em]">
        {navItems.map((item) => (
          <SpecularButton
            key={`${item.href}-${item.label}`}
            size="sm"
            radius={999}
            tint="#ffbc4c"
            tintOpacity={0.04}
            blur={8}
            textColor="rgba(255,248,232,0.78)"
            lineColor="#ffbc4c"
            baseColor="#8d431c"
            intensity={1}
            speed={0.35}
            autoAnimate
            className="nav-specular-button"
            onClick={() => {
              if (item.href.startsWith("#")) {
                const target = document.getElementById(item.href.slice(1));
                if (target && lenis) {
                  lenis.scrollTo(target, { duration: 1.2 });
                } else {
                  target?.scrollIntoView({ behavior: "smooth" });
                }
              } else {
                window.location.href = item.href;
              }
            }}
          >
            {item.label}
          </SpecularButton>
        ))}
        {children}
      </div>
    </nav>
  );
}
