"use client";

import { useEffect, useRef } from "react";

const FONT_FAMILY = '"Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif';
const TITLE_LINES = ["Will you be my", "Valentines?"];
const MAX_PIXEL_RATIO = 1.12;
const TARGET_FRAME_MS = 1000 / 36;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function shuffleInPlace(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = items[index];

    items[index] = items[swapIndex];
    items[swapIndex] = current;
  }

  return items;
}

export default function CloudHeading() {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const maskCanvas = document.createElement("canvas");
    const maskContext = maskCanvas.getContext("2d", { willReadFrequently: true });
    const baseCanvas = document.createElement("canvas");
    const baseContext = baseCanvas.getContext("2d");
    const mouse = { active: false, x: 0, y: 0, vx: 0, vy: 0 };
    let animationFrame = 0;
    let lastFrameTime = 0;
    let particles = [];
    let width = 0;
    let height = 0;
    let pixelRatio = 1;

    function createCloudSprite(size) {
      const sprite = document.createElement("canvas");
      const spriteContext = sprite.getContext("2d");
      const center = size / 2;

      sprite.width = size;
      sprite.height = size;

      const shadow = spriteContext.createRadialGradient(
        center * 1.08,
        center * 1.16,
        size * 0.04,
        center,
        center,
        center * 0.96,
      );

      shadow.addColorStop(0, "rgba(111, 139, 158, 0.2)");
      shadow.addColorStop(0.5, "rgba(111, 139, 158, 0.1)");
      shadow.addColorStop(1, "rgba(111, 139, 158, 0)");
      spriteContext.fillStyle = shadow;
      spriteContext.fillRect(0, 0, size, size);

      const highlight = spriteContext.createRadialGradient(
        center * 0.82,
        center * 0.72,
        size * 0.04,
        center,
        center,
        center,
      );

      highlight.addColorStop(0, "rgba(255, 255, 255, 0.96)");
      highlight.addColorStop(0.35, "rgba(255, 255, 255, 0.66)");
      highlight.addColorStop(0.72, "rgba(246, 252, 255, 0.2)");
      highlight.addColorStop(1, "rgba(255, 255, 255, 0)");
      spriteContext.fillStyle = highlight;
      spriteContext.fillRect(0, 0, size, size);

      return sprite;
    }

    const cloudSprites = [72, 104, 136].map(createCloudSprite);

    function getMetrics() {
      const fontSize = Math.min(Math.max(width * 0.12, 78), 162);
      const lineHeight = fontSize * 1.03;
      const startY = height / 2 - lineHeight * 0.48;

      return { fontSize, lineHeight, startY };
    }

    function applyMaskTextStyle(fontSize) {
      maskContext.font = `italic 800 ${fontSize}px ${FONT_FAMILY}`;
      maskContext.textAlign = "center";
      maskContext.textBaseline = "middle";
      maskContext.lineJoin = "round";

      if ("letterSpacing" in maskContext) {
        maskContext.letterSpacing = `${fontSize * 0.035}px`;
      }
    }

    function applyBaseTextStyle(fontSize) {
      baseContext.font = `italic 800 ${fontSize}px ${FONT_FAMILY}`;
      baseContext.textAlign = "center";
      baseContext.textBaseline = "middle";
      baseContext.lineJoin = "round";

      if ("letterSpacing" in baseContext) {
        baseContext.letterSpacing = `${fontSize * 0.035}px`;
      }
    }

    function getMaskAlpha(imageData, pixelX, pixelY) {
      if (
        pixelX < 0 ||
        pixelX >= maskCanvas.width ||
        pixelY < 0 ||
        pixelY >= maskCanvas.height
      ) {
        return 0;
      }

      return imageData[(pixelY * maskCanvas.width + pixelX) * 4 + 3] / 255;
    }

    function getInteriorScore(imageData, pixelX, pixelY, sampleRadius) {
      const offset = Math.max(2, Math.round(sampleRadius * pixelRatio));
      const center = getMaskAlpha(imageData, pixelX, pixelY);
      const neighborhood = Math.min(
        getMaskAlpha(imageData, pixelX - offset, pixelY),
        getMaskAlpha(imageData, pixelX + offset, pixelY),
        getMaskAlpha(imageData, pixelX, pixelY - offset),
        getMaskAlpha(imageData, pixelX, pixelY + offset),
        getMaskAlpha(imageData, pixelX - offset, pixelY - offset),
        getMaskAlpha(imageData, pixelX + offset, pixelY + offset),
      );

      return Math.max(0, Math.min(1, center * 0.42 + neighborhood * 0.58));
    }

    function drawBaseText() {
      const { fontSize, lineHeight, startY } = getMetrics();

      baseContext.clearRect(0, 0, width, height);
      baseContext.save();
      applyBaseTextStyle(fontSize);

      baseContext.filter = "blur(2.2px)";
      baseContext.globalAlpha = 0.43;
      baseContext.lineWidth = Math.max(8, fontSize * 0.09);
      baseContext.strokeStyle = "rgba(255, 255, 255, 0.54)";
      baseContext.fillStyle = "rgba(255, 255, 255, 0.24)";

      TITLE_LINES.forEach((line, index) => {
        const y = startY + index * lineHeight + fontSize * 0.025;

        baseContext.strokeText(line, width / 2, y);
        baseContext.fillText(line, width / 2, y);
      });

      baseContext.filter = "blur(2px)";
      baseContext.globalAlpha = 0.52;
      baseContext.lineWidth = Math.max(6, fontSize * 0.055);
      baseContext.strokeStyle = "rgba(255, 255, 255, 0.58)";
      baseContext.fillStyle = "rgba(255, 255, 255, 0.34)";

      TITLE_LINES.forEach((line, index) => {
        const y = startY + index * lineHeight;

        baseContext.strokeStyle = "rgba(255, 255, 255, 0.72)";
        baseContext.fillStyle = "rgba(255, 255, 255, 0.46)";
        baseContext.strokeText(line, width / 2, y);
        baseContext.fillText(line, width / 2, y);
      });

      baseContext.restore();
      baseContext.filter = "none";
    }

    function buildParticles() {
      const rect = canvas.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);

      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
      baseCanvas.width = canvas.width;
      baseCanvas.height = canvas.height;

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      maskContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      baseContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);
      maskContext.clearRect(0, 0, width, height);
      baseContext.clearRect(0, 0, width, height);

      const { fontSize, lineHeight, startY } = getMetrics();

      applyMaskTextStyle(fontSize);
      maskContext.fillStyle = "#fff";
      maskContext.strokeStyle = "#fff";
      maskContext.lineWidth = fontSize * 0.08;

      TITLE_LINES.forEach((line, index) => {
        const y = startY + index * lineHeight;

        maskContext.strokeText(line, width / 2, y);
        maskContext.fillText(line, width / 2, y);
      });

      const imageData = maskContext.getImageData(
        0,
        0,
        maskCanvas.width,
        maskCanvas.height,
      ).data;
      const step = width < 560 ? 12 : 13;
      const sampleRadius = width < 560 ? 9 : 12;
      const maxParticles = width < 560 ? 720 : 1500;
      const nextParticles = [];

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const pixelX = Math.floor(x * pixelRatio);
          const pixelY = Math.floor(y * pixelRatio);
          const alpha = getMaskAlpha(imageData, pixelX, pixelY);

          if (alpha > 0.06 && Math.random() < 0.62 + alpha * 0.32) {
            const interior = getInteriorScore(
              imageData,
              pixelX,
              pixelY,
              sampleRadius,
            );
            const radius = randomBetween(9, 15) + interior * randomBetween(10, 18);

            nextParticles.push({
              homeX: x + randomBetween(-4, 4),
              homeY: y + randomBetween(-4, 4),
              x: x + randomBetween(-7, 7),
              y: y + randomBetween(-7, 7),
              vx: 0,
              vy: 0,
              radius,
              alpha: randomBetween(0.3, 0.44) + interior * 0.24,
              phase: randomBetween(0, Math.PI * 2),
              speed: randomBetween(0.00005, 0.00013),
              driftX: randomBetween(0.8, 1.8),
              driftY: randomBetween(0.45, 1.05),
              sprite: cloudSprites[Math.min(
                cloudSprites.length - 1,
                Math.floor(interior * cloudSprites.length),
              )],
            });
          }
        }
      }

      particles = shuffleInPlace(nextParticles).slice(0, maxParticles);
      drawBaseText();
    }

    function animate(time) {
      if (time - lastFrameTime < TARGET_FRAME_MS) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      lastFrameTime = time;
      context.clearRect(0, 0, width, height);
      context.drawImage(baseCanvas, 0, 0, width, height);

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];

        if (mouse.active) {
          const dx = particle.x - mouse.x;
          const dy = particle.y - mouse.y;
          const radius = 150;
          const distanceSquared = dx * dx + dy * dy;

          if (distanceSquared < radius * radius) {
            const force = (1 - distanceSquared / (radius * radius)) ** 2;

            particle.vx += mouse.vx * force * 0.026;
            particle.vy += mouse.vy * force * 0.026;
          }
        }

        particle.vx += (particle.homeX - particle.x) * 0.0011;
        particle.vy += (particle.homeY - particle.y) * 0.0011;
        particle.vx *= 0.958;
        particle.vy *= 0.958;
        particle.x += particle.vx;
        particle.y += particle.vy;

        const driftX = Math.cos(time * particle.speed + particle.phase) * particle.driftX;
        const driftY = Math.sin(time * particle.speed + particle.phase) * particle.driftY;
        const size = particle.radius * 2;

        context.globalAlpha = particle.alpha;
        context.drawImage(
          particle.sprite,
          particle.x + driftX - particle.radius,
          particle.y + driftY - particle.radius,
          size,
          size,
        );
      }

      context.globalAlpha = 1;
      mouse.vx *= 0.72;
      mouse.vy *= 0.72;
      animationFrame = requestAnimationFrame(animate);
    }

    function updateMouse(event) {
      const rect = canvas.getBoundingClientRect();
      const nextX = event.clientX - rect.left;
      const nextY = event.clientY - rect.top;

      mouse.vx = mouse.active ? nextX - mouse.x : 0;
      mouse.vy = mouse.active ? nextY - mouse.y : 0;
      mouse.active = true;
      mouse.x = nextX;
      mouse.y = nextY;
    }

    function clearMouse() {
      mouse.active = false;
      mouse.vx = 0;
      mouse.vy = 0;
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        return;
      }

      if (!animationFrame) {
        lastFrameTime = 0;
        animationFrame = requestAnimationFrame(animate);
      }
    }

    buildParticles();
    animationFrame = requestAnimationFrame(animate);

    const resizeObserver = new ResizeObserver(buildParticles);
    resizeObserver.observe(canvas);
    root.addEventListener("pointermove", updateMouse);
    root.addEventListener("pointerleave", clearMouse);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      root.removeEventListener("pointermove", updateMouse);
      root.removeEventListener("pointerleave", clearMouse);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div ref={rootRef} className="cloud-heading" aria-label="Will you be my Valentines?">
      <h1 className="cloud-heading-text">
        {TITLE_LINES.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h1>
      <canvas ref={canvasRef} className="cloud-heading-canvas" aria-hidden="true" />
    </div>
  );
}
