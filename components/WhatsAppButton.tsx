"use client";

import { useEffect, useState } from "react";

type Advisor = {
  name: string;
  role: string;
  initials: string;
  phone: string;
};

const ADVISORS: Advisor[] = [
  {
    name: "Andrés",
    role: "Atención general",
    initials: "AV",
    phone: "573225217753",
  },
  {
    name: "Stiven",
    role: "Asesoría nutricional",
    initials: "SP",
    phone: "573012344785",
  },
];

function advisorHref({ name, phone }: Advisor) {
  const message = `Hola ${name}, vengo del sitio de Peptigene y quiero más información`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function WhatsAppButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      {open && (
        <div
          className="wa-overlay"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      {open && (
        <div
          className="wa-panel"
          role="dialog"
          aria-label="Elige un asesor de WhatsApp"
        >
          <div className="wa-panel-header">
            <div>
              <p className="wa-panel-title">¿Necesitas ayuda?</p>
              <p className="wa-panel-subtitle">Elige un asesor para conversar</p>
            </div>
            <button
              type="button"
              className="wa-close"
              aria-label="Cerrar panel de asesores"
              onClick={() => setOpen(false)}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="wa-advisors">
            {ADVISORS.map((advisor) => (
              <a
                key={advisor.phone}
                href={advisorHref(advisor)}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-advisor"
                aria-label={`Escribir a ${advisor.name}, ${advisor.role}, por WhatsApp`}
              >
                <span className="wa-avatar" aria-hidden="true">
                  {advisor.initials}
                </span>
                <span className="wa-advisor-info">
                  <span className="wa-advisor-name">{advisor.name}</span>
                  <span className="wa-advisor-role">{advisor.role}</span>
                  <span className="wa-online">
                    <span className="wa-online-dot" aria-hidden="true" />
                    En línea
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        className={`wa-button ${open ? "is-open" : ""}`}
        aria-label={open ? "Cerrar asesores de WhatsApp" : "Abrir asesores de WhatsApp"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <svg
            viewBox="0 0 24 24"
            className="wa-icon"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg
            viewBox="0 0 32 32"
            className="wa-icon"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M16.001 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.6 4.46 1.74 6.4L3.2 28.8l6.56-1.72a12.74 12.74 0 0 0 6.24 1.62h.01c7.06 0 12.8-5.74 12.8-12.8s-5.74-12.8-12.81-12.8Zm0 23.4h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4.02 1.06 1.07-3.92-.25-.4a10.58 10.58 0 0 1-1.62-5.63c0-5.87 4.78-10.65 10.66-10.65 2.85 0 5.52 1.11 7.53 3.13a10.58 10.58 0 0 1 3.12 7.53c0 5.88-4.78 10.66-10.65 10.66Zm5.84-7.98c-.32-.16-1.9-.94-2.19-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.18-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55-.18-.01-.4-.01-.61-.01-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66 0 1.57 1.14 3.08 1.3 3.29.16.21 2.25 3.43 5.45 4.81.76.33 1.36.53 1.82.68.77.24 1.46.21 2.01.13.61-.09 1.9-.78 2.17-1.53.27-.74.27-1.38.19-1.52-.08-.13-.29-.21-.61-.37Z" />
          </svg>
        )}
      </button>

      <style jsx>{`
        .wa-overlay {
          position: fixed;
          inset: 0;
          z-index: 9998;
          background: transparent;
        }

        .wa-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          padding: 0;
          border: none;
          cursor: pointer;
          border-radius: 9999px;
          background-color: #25d366;
          color: #ffffff;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
          animation: wa-pulse 2s infinite;
          transition: transform 0.2s ease, background-color 0.2s ease;
        }

        .wa-button.is-open {
          animation: none;
          background-color: #1f9d54;
        }

        .wa-button:hover {
          transform: scale(1.08);
        }

        .wa-icon {
          width: 32px;
          height: 32px;
        }

        .wa-panel {
          position: fixed;
          bottom: 100px;
          right: 24px;
          z-index: 9999;
          width: 320px;
          max-width: calc(100vw - 32px);
          overflow: hidden;
          border-radius: 16px;
          background-color: #ffffff;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
          animation: wa-appear 0.2s ease-out;
        }

        .wa-panel-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding: 18px 20px;
          background-color: #064e3b;
        }

        .wa-panel-title {
          margin: 0;
          color: #ffffff;
          font-size: 16px;
          font-weight: 700;
        }

        .wa-panel-subtitle {
          margin: 4px 0 0;
          color: #84f0c1;
          font-size: 13px;
        }

        .wa-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          flex-shrink: 0;
          padding: 0;
          border: none;
          cursor: pointer;
          border-radius: 9999px;
          background-color: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          transition: background-color 0.2s ease;
        }

        .wa-close:hover {
          background-color: rgba(255, 255, 255, 0.24);
        }

        .wa-advisors {
          display: flex;
          flex-direction: column;
          background-color: #ffffff;
        }

        .wa-advisor {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          text-decoration: none;
          color: inherit;
          transition: background-color 0.15s ease;
        }

        .wa-advisor + .wa-advisor {
          border-top: 1px solid #e5e7eb;
        }

        .wa-advisor:hover {
          background-color: #f0fdf8;
        }

        .wa-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 46px;
          flex-shrink: 0;
          border-radius: 9999px;
          background-color: #25d366;
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .wa-advisor-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .wa-advisor-name {
          color: #111827;
          font-size: 15px;
          font-weight: 700;
        }

        .wa-advisor-role {
          color: #6b7280;
          font-size: 13px;
        }

        .wa-online {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
          color: #059669;
          font-size: 12px;
        }

        .wa-online-dot {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background-color: #25d366;
          animation: wa-blink 1.4s infinite;
        }

        @keyframes wa-appear {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
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

        @keyframes wa-blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
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
          .wa-button,
          .wa-online-dot {
            animation: none;
          }
          .wa-panel {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
