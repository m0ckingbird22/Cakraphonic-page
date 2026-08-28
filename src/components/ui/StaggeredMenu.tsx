import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { gsap } from "gsap";
import "./StaggeredMenu.css";

type StaggeredMenuItem = {
  label: string;
  ariaLabel: string;
  link: string;
};

type StaggeredMenuSocialItem = {
  label: string;
  link: string;
};

type StaggeredMenuProps = {
  position?: "left" | "right";
  colors?: string[];
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  logoUrl?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  changeMenuColorOnOpen?: boolean;
  closeOnClickAway?: boolean;
  className?: string;
};

export default function StaggeredMenu({
  position = "right",
  colors = ["#8d431c", "#d6b56d"],
  items = [],
  socialItems = [],
  displaySocials = false,
  displayItemNumbering = true,
  logoUrl,
  menuButtonColor = "#fff8e8",
  openMenuButtonColor = "#160606",
  accentColor = "#d6b56d",
  changeMenuColorOnOpen = true,
  closeOnClickAway = true,
  className = "",
}: StaggeredMenuProps) {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const panelRef = useRef<HTMLElement>(null);
  const layersRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const layers =
      layersRef.current?.querySelectorAll<HTMLElement>(".sm-prelayer");
    const button = buttonRef.current;
    if (!panel || !layers) return;

    const offscreen = position === "left" ? -100 : 100;
    const elements = [panel, ...Array.from(layers)];
    gsap.set(elements, { xPercent: offscreen });
    gsap.set(button, { color: menuButtonColor });

    return () => {
      gsap.killTweensOf([...elements, button]);
    };
  }, [menuButtonColor, position]);

  const toggleMenu = useCallback(() => {
    const panel = panelRef.current;
    const layers =
      layersRef.current?.querySelectorAll<HTMLElement>(".sm-prelayer");
    const button = buttonRef.current;
    if (!panel || !layers) return;

    const nextOpen = !openRef.current;
    openRef.current = nextOpen;
    setOpen(nextOpen);

    const offscreen = position === "left" ? -100 : 100;
    const layerElements = Array.from(layers);
    const itemLabels = panel.querySelectorAll<HTMLElement>(
      ".sm-panel-item-label",
    );
    const socialLinks = panel.querySelectorAll<HTMLElement>(".sm-socials-link");
    const timeline = gsap.timeline();

    if (nextOpen) {
      gsap.set(itemLabels, { yPercent: 140, rotate: 8 });
      gsap.set(socialLinks, { y: 20, opacity: 0 });
      timeline
        .to(layerElements, {
          xPercent: 0,
          duration: 0.5,
          stagger: 0.07,
          ease: "power4.out",
        })
        .to(
          panel,
          { xPercent: 0, duration: 0.65, ease: "power4.out" },
          "-=0.36",
        )
        .to(
          itemLabels,
          {
            yPercent: 0,
            rotate: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power4.out",
          },
          "-=0.35",
        )
        .to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            stagger: 0.06,
            ease: "power3.out",
          },
          "-=0.45",
        );
      if (changeMenuColorOnOpen) {
        gsap.to(button, { color: openMenuButtonColor, duration: 0.3 });
      }
    } else {
      timeline
        .to([panel, ...layerElements], {
          xPercent: offscreen,
          duration: 0.35,
          ease: "power3.in",
        })
        .set(itemLabels, { yPercent: 140, rotate: 8 })
        .set(socialLinks, { y: 20, opacity: 0 });
      if (changeMenuColorOnOpen) {
        gsap.to(button, { color: menuButtonColor, duration: 0.3 });
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor, position]);

  useEffect(() => {
    if (!open || !closeOnClickAway) return;
    const handleClickAway = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        toggleMenu();
      }
    };
    document.addEventListener("mousedown", handleClickAway);
    return () => document.removeEventListener("mousedown", handleClickAway);
  }, [closeOnClickAway, open, toggleMenu]);

  return (
    <div
      className={`staggered-menu-wrapper ${className}`}
      data-position={position}
      data-open={open || undefined}
      style={{ "--sm-accent": accentColor } as CSSProperties}
    >
      <div ref={layersRef} className="sm-prelayers" aria-hidden="true">
        {colors.slice(0, 3).map((color, index) => (
          <div
            key={`${color}-${index}`}
            className="sm-prelayer"
            style={{ background: color }}
          />
        ))}
      </div>
      <header className="staggered-menu-header">
        {logoUrl && (
          <img className="sm-logo-img" src={logoUrl} alt="Cakraphonic" />
        )}
        <button
          ref={buttonRef}
          className="sm-toggle"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="staggered-menu-panel"
          onClick={toggleMenu}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <span
            className={`sm-icon ${open ? "is-open" : ""}`}
            aria-hidden="true"
          >
            <span />
            <span />
          </span>
        </button>
      </header>
      <aside
        id="staggered-menu-panel"
        ref={panelRef}
        className="staggered-menu-panel"
        aria-hidden={!open}
      >
        <div className="sm-panel-inner">
          <ul
            className="sm-panel-list"
            data-numbering={displayItemNumbering || undefined}
          >
            {items.map((item, index) => (
              <li className="sm-panel-item-wrap" key={`${item.label}-${index}`}>
                <a
                  className="sm-panel-item"
                  href={item.link}
                  aria-label={item.ariaLabel}
                  onClick={toggleMenu}
                >
                  <span className="sm-panel-item-label">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
          {displaySocials && socialItems.length > 0 && (
            <div className="sm-socials">
              <p className="sm-socials-title">Socials</p>
              <div className="sm-socials-list">
                {socialItems.map((item) => (
                  <a
                    key={item.label}
                    className="sm-socials-link"
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
