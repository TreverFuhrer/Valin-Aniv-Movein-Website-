"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import bird from "../../assets/bird.png";
import letter from "../../assets/letter.png";
import websiteBackground from "../../assets/website_background.png";
import wordLayer1 from "../../assets/words/Layer 1.png";
import wordLayer2 from "../../assets/words/Layer 2.png";
import wordLayer3 from "../../assets/words/Layer 3.png";
import wordLayer4 from "../../assets/words/Layer 4.png";
import wordLayer5 from "../../assets/words/Layer 5.png";
import wordLayer6 from "../../assets/words/Layer 6.png";
import wordLayer7 from "../../assets/words/Layer 7.png";
import wordLayer8 from "../../assets/words/Layer 8.png";
import wordLayer9 from "../../assets/words/Layer 9.png";
import wordLayer10 from "../../assets/words/Layer 10.png";
import wordLayer11 from "../../assets/words/Layer 11.png";
import wordLayer12 from "../../assets/words/Layer 12.png";
import wordLayer13 from "../../assets/words/Layer 13.png";
import wordLayer14 from "../../assets/words/Layer 14.png";
import wordLayer15 from "../../assets/words/Layer 15.png";
import wordLayer16 from "../../assets/words/Layer 16.png";
import wordLayer17 from "../../assets/words/Layer 17.png";
import wordLayer18 from "../../assets/words/Layer 18.png";
import wordLayer19 from "../../assets/words/Layer 19.png";
import wordLayer20 from "../../assets/words/Layer 20.png";
import wordLayer21 from "../../assets/words/Layer 21.png";
import wordLayer22 from "../../assets/words/Layer 22.png";
import wordLayer23 from "../../assets/words/Layer 23.png";
import wordLayer24 from "../../assets/words/Layer 24.png";
import wordLayer25 from "../../assets/words/Layer 25.png";
import wordLayer26 from "../../assets/words/Layer 26.png";
import wordLayer27 from "../../assets/words/Layer 27.png";
import wordLayer28 from "../../assets/words/Layer 28.png";
import wordLayer29 from "../../assets/words/Layer 29.png";
import wordLayer30 from "../../assets/words/Layer 30.png";
import wordLayer31 from "../../assets/words/Layer 31.png";
import wordLayer32 from "../../assets/words/Layer 32.png";
import wordLayer33 from "../../assets/words/Layer 33.png";
import wordLayer34 from "../../assets/words/Layer 34.png";
import wordLayer35 from "../../assets/words/Layer 35.png";
import wordLayer36 from "../../assets/words/Layer 36.png";
import wordLayer37 from "../../assets/words/Layer 37.png";

const SHORT_DELAY = 230;
const MEDIUM_DELAY = 620;
const LONG_DELAY = 980;

const WORD_LAYERS = [
  { image: wordLayer1, alt: "I", delayBefore: 0 },
  { image: wordLayer2, alt: "love", delayBefore: SHORT_DELAY },
  { image: wordLayer3, alt: "you", delayBefore: SHORT_DELAY },
  { image: wordLayer4, alt: "so,", delayBefore: SHORT_DELAY },
  { image: wordLayer5, alt: "my", delayBefore: MEDIUM_DELAY },
  { image: wordLayer6, alt: "infallible", delayBefore: SHORT_DELAY },
  { image: wordLayer7, alt: "love.", delayBefore: SHORT_DELAY },
  { image: wordLayer8, alt: "Your", delayBefore: MEDIUM_DELAY },
  { image: wordLayer9, alt: "eye's", delayBefore: SHORT_DELAY },
  { image: wordLayer10, alt: "sparkle,", delayBefore: SHORT_DELAY },
  { image: wordLayer11, alt: "out", delayBefore: MEDIUM_DELAY },
  { image: wordLayer12, alt: "shines", delayBefore: SHORT_DELAY },
  { image: wordLayer13, alt: "the", delayBefore: SHORT_DELAY },
  { image: wordLayer14, alt: "stars.", delayBefore: LONG_DELAY },
  { image: wordLayer15, alt: "And", delayBefore: MEDIUM_DELAY },
  { image: wordLayer16, alt: "your", delayBefore: SHORT_DELAY },
  { image: wordLayer17, alt: "voice,", delayBefore: SHORT_DELAY },
  { image: wordLayer18, alt: "can", delayBefore: MEDIUM_DELAY },
  { image: wordLayer19, alt: "out", delayBefore: SHORT_DELAY },
  { image: wordLayer20, alt: "sing", delayBefore: SHORT_DELAY },
  { image: wordLayer21, alt: "the", delayBefore: SHORT_DELAY },
  { image: wordLayer22, alt: "birds.", delayBefore: LONG_DELAY },
  { image: wordLayer23, alt: "Oh", delayBefore: MEDIUM_DELAY },
  { image: wordLayer24, alt: "how", delayBefore: SHORT_DELAY },
  { image: wordLayer25, alt: "I", delayBefore: SHORT_DELAY },
  { image: wordLayer26, alt: "love", delayBefore: SHORT_DELAY },
  { image: wordLayer27, alt: "you", delayBefore: SHORT_DELAY },
  { image: wordLayer28, alt: "so,", delayBefore: SHORT_DELAY },
  { image: wordLayer29, alt: "Happy", delayBefore: MEDIUM_DELAY },
  { image: wordLayer30, alt: "Valentines,", delayBefore: SHORT_DELAY },
  { image: wordLayer31, alt: "Happy", delayBefore: MEDIUM_DELAY },
  { image: wordLayer32, alt: "Anniversary,", delayBefore: SHORT_DELAY },
  { image: wordLayer33, alt: "and", delayBefore: MEDIUM_DELAY },
  { image: wordLayer34, alt: "Happy", delayBefore: SHORT_DELAY },
  { image: wordLayer35, alt: "move", delayBefore: SHORT_DELAY },
  { image: wordLayer36, alt: "in", delayBefore: SHORT_DELAY },
  { image: wordLayer37, alt: "day!", delayBefore: SHORT_DELAY },
];

const WORD_LINES = [
  { layers: [1, 2, 3, 4] },
  { layers: [5, 6, 7], indent: true },
  { layers: [8, 9, 10] },
  { layers: [11, 12, 13, 14], indent: true },
  { layers: [15, 16, 17] },
  { layers: [18, 19, 20, 21, 22], indent: true },
  { layers: [23, 24, 25, 26, 27, 28] },
  { layers: [29, 30, 31, 32, 33, 34, 35, 36, 37], final: true },
];

export default function AnniversaryPage() {
  const letterRef = useRef(null);
  const animationFrame = useRef(0);
  const sequenceTimers = useRef([]);
  const [letterState, setLetterState] = useState({
    phase: "perched",
    rotation: 0,
    x: 0,
    y: 0,
  });
  const [sequenceStarted, setSequenceStarted] = useState(false);
  const [visibleLayerCount, setVisibleLayerCount] = useState(0);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationFrame.current);
      sequenceTimers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function dropLetter() {
    if (letterState.phase !== "perched" || !letterRef.current) {
      return;
    }

    const letterBox = letterRef.current.getBoundingClientRect();
    const startY = 0;
    const floorY = window.innerHeight - letterBox.bottom - 12;
    const startTime = performance.now();
    const initialVelocity = 0;
    const gravity = 0.0019;
    const spin = Math.random() > 0.5 ? 28 : -28;

    setLetterState((current) => ({
      ...current,
      phase: "falling",
    }));

    function animate(now) {
      const elapsed = now - startTime;
      const y = Math.min(
        floorY,
        startY + initialVelocity * elapsed + 0.5 * gravity * elapsed * elapsed,
      );
      const progress = floorY <= 0 ? 1 : y / floorY;
      const rotation = spin * Math.sin(progress * Math.PI * 0.85);
      const hasLanded = y >= floorY;

      setLetterState({
        phase: hasLanded ? "fallen" : "falling",
        rotation,
        x: Math.sin(elapsed * 0.006) * 8 * (1 - progress * 0.35),
        y,
      });

      if (!hasLanded) {
        animationFrame.current = requestAnimationFrame(animate);
      }
    }

    cancelAnimationFrame(animationFrame.current);
    animationFrame.current = requestAnimationFrame(animate);
  }

  function startWordSequence() {
    sequenceTimers.current.forEach((timer) => window.clearTimeout(timer));
    sequenceTimers.current = [];
    setSequenceStarted(true);
    setVisibleLayerCount(0);

    let elapsed = 0;

    WORD_LAYERS.forEach((word, index) => {
      elapsed += word.delayBefore;

      const timer = window.setTimeout(() => {
        setVisibleLayerCount(index + 1);
      }, elapsed);

      sequenceTimers.current.push(timer);
    });
  }

  function handleLetterClick() {
    if (letterState.phase === "perched") {
      dropLetter();
      return;
    }

    if (letterState.phase === "fallen") {
      startWordSequence();
    }
  }

  return (
    <main
      className="anniversary-page"
      style={{ backgroundImage: `url(${websiteBackground.src})` }}
    >
      <div className="bird-letter-stack">
        <Image className="bird-image" src={bird} alt="" priority />
        <button
          ref={letterRef}
          className={`letter-button letter-${letterState.phase}`}
          type="button"
          aria-label={letterState.phase === "fallen" ? "Reveal message" : "Drop letter"}
          onClick={handleLetterClick}
          style={{
            transform: `translate3d(${letterState.x}px, ${letterState.y}px, 0) rotate(${letterState.rotation}deg)`,
          }}
        >
          <Image className="letter-image" src={letter} alt="" priority />
        </button>
      </div>

      <section
        className={`word-sequence ${sequenceStarted ? "word-sequence-started" : ""}`}
        aria-live="polite"
      >
        <p className="sr-only">
          I love you so, my infallible love. Your eye's sparkle, out shines the
          stars. And your voice, can out sing the birds. Oh how I love you so,
          Happy Valentines, Happy Anniversary, and Happy move in day!
        </p>

        {WORD_LINES.map((line, lineIndex) => (
          <div
            className={`word-line ${line.indent ? "word-line-indent" : ""} ${
              line.final ? "word-line-final" : ""
            }`}
            key={lineIndex}
          >
            {line.layers.map((layerNumber) => {
              const word = WORD_LAYERS[layerNumber - 1];

              return (
                <Image
                  className={`word-image ${
                    visibleLayerCount >= layerNumber ? "word-image-visible" : ""
                  }`}
                  src={word.image}
                  alt=""
                  aria-hidden="true"
                  key={layerNumber}
                />
              );
            })}
          </div>
        ))}
      </section>
    </main>
  );
}
