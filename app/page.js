"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import CloudHeading from "./CloudHeading";
import catGun from "../assets/cat_gun.png";
import skyBackground from "../assets/sky.png";

export default function Home() {
  const router = useRouter();
  const [isNoHovered, setIsNoHovered] = useState(false);
  const [heartParticles, setHeartParticles] = useState([]);
  const particleId = useRef(0);
  const lastParticleAt = useRef(0);

  function handleNoMouseEnter() {
    setIsNoHovered(true);
    // Add the No-button behavior here when you are ready.
  }

  function handleNoMouseLeave() {
    setIsNoHovered(false);
  }

  function addHeartParticle(event) {
    const now = Date.now();

    if (now - lastParticleAt.current < 180) {
      return;
    }

    lastParticleAt.current = now;

    const rect = event.currentTarget.getBoundingClientRect();
    const id = particleId.current;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const drift = (Math.random() - 0.5) * 3.5;
    const scale = 1.15 + Math.random() * 0.45;

    particleId.current += 1;

    setHeartParticles((particles) => [
      ...particles.slice(-5),
      { id, x, y, drift, scale },
    ]);

    window.setTimeout(() => {
      setHeartParticles((particles) =>
        particles.filter((particle) => particle.id !== id),
      );
    }, 900);
  }

  return (
    <main
      className="valentine-page"
      style={{ "--valentine-sky": `url(${skyBackground.src})` }}
    >
      <Image
        className={`cat-gun ${isNoHovered ? "cat-gun-visible" : ""}`}
        src={catGun}
        alt=""
        aria-hidden="true"
        priority
      />

      <section className="proposal" aria-label="Valentine proposal">
        <CloudHeading />

        <div className="button-row">
          <button
            className="choice-button yes-button"
            type="button"
            onPointerEnter={addHeartParticle}
            onPointerMove={addHeartParticle}
            onClick={() => router.push("/anniversary")}
          >
            Yes
            <span className="particle-layer" aria-hidden="true">
              {heartParticles.map((particle) => (
                <span
                  className="heart-particle"
                  key={particle.id}
                  style={{
                    "--particle-x": `${particle.x}px`,
                    "--particle-y": `${particle.y}px`,
                    "--particle-drift": `${particle.drift}rem`,
                    "--particle-scale": particle.scale,
                  }}
                />
              ))}
            </span>
          </button>

          <button
            className="choice-button no-button"
            type="button"
            data-hovered={isNoHovered}
            onMouseEnter={handleNoMouseEnter}
            onMouseLeave={handleNoMouseLeave}
            onFocus={handleNoMouseEnter}
            onBlur={handleNoMouseLeave}
          >
            No
          </button>
        </div>
      </section>
    </main>
  );
}
