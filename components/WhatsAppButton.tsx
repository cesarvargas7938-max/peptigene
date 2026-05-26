"use client";

const PHONE = "573225217753";
const MESSAGE = "Hola, vengo del sitio web de Peptigene y quiero más información";

export function WhatsAppButton() {
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="wa-button"
    >
      <span className="wa-tooltip" aria-hidden="true">
        Escríbenos
      </span>
      <svg
        viewBox="0 0 32 32"
        className="wa-icon"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M16.001 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.6 4.46 1.74 6.4L3.2 28.8l6.56-1.72a12.74 12.74 0 0 0 6.24 1.62h.01c7.06 0 12.8-5.74 12.8-12.8s-5.74-12.8-12.81-12.8Zm0 23.4h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4.02 1.06 1.07-3.92-.25-.4a10.58 10.58 0 0 1-1.62-5.63c0-5.87 4.78-10.65 10.66-10.65 2.85 0 5.52 1.11 7.53 3.13a10.58 10.58 0 0 1 3.12 7.53c0 5.88-4.78 10.66-10.65 10.66Zm5.84-7.98c-.32-.16-1.9-.94-2.19-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.18-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55-.18-.01-.4-.01-.61-.01-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66 0 1.57 1.14 3.08 1.3 3.29.16.21 2.25 3.43 5.45 4.81.76.33 1.36.53 1.82.68.77.24 1.46.21 2.01.13.61-.09 1.9-.78 2.17-1.53.27-.74.27-1.38.19-1.52-.08-.13-.29-.21-.61-.37Z" />
      </svg>

      <style jsx>{`
        .wa-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          border-radius: 9999px;
          background-color: #25d366;
          color: #ffffff;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
          animation: wa-pulse 2s infinite;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .wa-icon {
          width: 32px;
          height: 32px;
        }

        .wa-button:hover {
          transform: scale(1.08);
        }

        .wa-tooltip {
          position: absolute;
          right: calc(100% + 14px);
          top: 50%;
          transform: translateY(-50%) scale(0.9);
          white-space: nowrap;
          background-color: #1f2937;
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .wa-tooltip::after {
          content: "";
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 6px solid transparent;
          border-left-color: #1f2937;
        }

        .wa-button:hover .wa-tooltip {
          opacity: 1;
          transform: translateY(-50%) scale(1);
        }

        @keyframes wa-pulse {
          0% {
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18),
              0 0 0 0 rgba(37, 211, 102, 0.6);
          }
          70% {
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18),
              0 0 0 16px rgba(37, 211, 102, 0);
          }
          100% {
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18),
              0 0 0 0 rgba(37, 211, 102, 0);
          }
        }

        @media (max-width: 640px) {
          .wa-button {
            width: 56px;
            height: 56px;
          }
          .wa-icon {
            width: 30px;
            height: 30px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wa-button {
            animation: none;
          }
        }
      `}</style>
    </a>
  );
}
