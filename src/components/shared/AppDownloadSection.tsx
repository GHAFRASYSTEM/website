'use client'
import Image from 'next/image'
import appScreenLeft from '@/assets/images/app-screen-left.png'
import appScreenRight from '@/assets/images/app-screen-right.png'
import type { HomeContent } from '@/lib/types'

export default function AppDownloadSection({
  content,
}: {
  content: HomeContent['appDownloadSection']
}) {
  const secondaryImageAlt = content.secondaryAppImageAlt || content.appImageAlt

  return (
    <section className="app-download-section">
      <div className="divider-line" />
      {content.eyebrow ? (
        <span className="section-eyebrow">{content.eyebrow}</span>
      ) : null}
      <h2 className="section-title font-heading text-3xl font-bold gradient-title md:text-4xl">
        {content.title}
      </h2>
      <p>{content.body}</p>

      <div className="phones-frame">
        {/* Left phone */}
        <div className="phone phone-left">
          <div className="phone-notch" />
          <div className="phone-screen">
            <Image
              src={appScreenLeft}
              alt={content.appImageAlt}
              fill
              style={{ objectFit: 'cover', borderRadius: '26px' }}
              sizes="(max-width: 640px) 120px, 160px"
            />
          </div>
        </div>

        {/* Right phone */}
        <div className="phone phone-right">
          <div className="phone-notch" />
          <div className="phone-screen">
            <Image
              src={appScreenRight}
              alt={secondaryImageAlt}
              fill
              style={{ objectFit: 'cover', borderRadius: '26px' }}
              sizes="(max-width: 640px) 120px, 160px"
            />
          </div>
        </div>
      </div>

      <div className="download-btns">
        {/* iOS Button */}
        <a
          href={content.appStoreButton.link}
          className="btn-store btn-ios"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            className="btn-store-icon"
            viewBox="0 0 24 24"
            fill="white"
            aria-hidden="true"
          >
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11" />
          </svg>
          <div className="btn-store-text">
            <span className="btn-sub">{content.appStoreButton.pretitle}</span>
            <span className="btn-label">{content.appStoreButton.title}</span>
          </div>
        </a>

        {/* Android Button */}
        <a
          href={content.googlePlayButton.link}
          className="btn-store btn-android"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            className="btn-store-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M3.18 23.76c.3.17.64.22.98.15l11.37-11.37-2.49-2.5L3.18 23.76zM20.59 10.4l-2.33-1.36-2.79 2.79 2.79 2.79 2.37-1.38c.68-.39.68-1.45-.04-1.84zM1.01 1.4C.96 1.56.94 1.73.94 1.92v19.96c0 .19.02.36.07.51l11.32-11.32L1.01 1.4zm15.52 9.1L5.16 1.12c-.32-.19-.67-.24-1-.18l11.37 11.38 1-2.82z"
              fill="#4CAF50"
            />
          </svg>
          <div className="btn-store-text">
            <span className="btn-sub">{content.googlePlayButton.pretitle}</span>
            <span className="btn-label">{content.googlePlayButton.title}</span>
          </div>
        </a>
      </div>

      <style jsx>{`
        .app-download-section {
          background: var(--site-surface-muted);
          padding: 64px 20px;
          text-align: center;
          transition:
            background-color 0.25s ease,
            color 0.25s ease;
        }

        .divider-line {
          width: 48px;
          height: 4px;
          background: #c8102e;
          border-radius: 2px;
          margin: 0 auto 20px;
        }

        .section-eyebrow {
          display: inline-block;
          margin-bottom: 12px;
          font-size: 0.75rem;
          font-family: inherit;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #306c43;
        }

        .section-title {
          margin: 0 0 12px;
        }

        .app-download-section p {
          font-size: 16px;
          font-family: inherit;
          color: var(--site-foreground-soft);
          margin: 0 auto 48px;
          max-width: 480px;
          line-height: 1.6;
        }

        .phones-frame {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          margin: 0 auto 48px;
          max-width: 420px;
          position: relative;
          width: 100%;
        }

        .phone {
          width: 160px;
          height: 290px;
          background: #1a1a1a;
          border-radius: 28px;
          border: 3px solid rgba(20, 29, 26, 0.85);
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
        }

        .phone-left {
          transform: rotate(-8deg) translateX(24px);
          z-index: 1;
          margin-bottom: 12px;
        }

        .phone-right {
          transform: rotate(8deg) translateX(-24px);
          z-index: 1;
          margin-bottom: 12px;
        }

        .phone-notch {
          width: 60px;
          height: 18px;
          background: #1a1a1a;
          border-radius: 0 0 12px 12px;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
        }

        .phone-screen {
          position: absolute;
          inset: 0;
          border-radius: 26px;
          overflow: hidden;
        }

        .download-btns {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .btn-store {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 14px 22px;
          border-radius: 14px;
          text-decoration: none;
          font-family: sans-serif;
          min-width: 180px;
          transition:
            transform 0.15s ease,
            box-shadow 0.15s ease;
        }

        .btn-store:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .btn-ios {
          background: #c8102e;
          color: white;
          border: none;
        }

        .btn-android {
          background: var(--site-surface);
          color: var(--site-foreground-strong);
          border: 2px solid rgba(117, 143, 131, 0.24);
        }

        .btn-store-icon {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
        }

        .btn-store-text {
          text-align: left;
        }

        .btn-sub {
          font-size: 10px;
          opacity: 0.75;
          display: block;
          margin-bottom: 1px;
        }

        .btn-label {
          font-size: 16px;
          font-weight: 700;
          display: block;
        }

        @media (max-width: 640px) {
          .app-download-section {
            padding: 56px 16px;
          }

          .app-download-section p {
            margin: 0 auto 32px;
          }

          .phones-frame {
            max-width: 300px;
            margin-bottom: 32px;
          }

          .phone {
            width: 120px;
            height: 220px;
            border-radius: 24px;
          }

          .phone-left {
            transform: rotate(-6deg) translateX(16px);
          }

          .phone-right {
            transform: rotate(6deg) translateX(-16px);
          }

          .phone-screen {
            border-radius: 22px;
          }

          .btn-store {
            width: 100%;
            justify-content: center;
            min-width: 0;
          }
        }

        @media (max-width: 420px) {
          .phones-frame {
            max-width: 256px;
            margin-bottom: 28px;
          }

          .phone {
            width: 104px;
            height: 192px;
            border-radius: 22px;
          }

          .phone-left {
            transform: rotate(-5deg) translateX(10px);
          }

          .phone-right {
            transform: rotate(5deg) translateX(-10px);
          }

          .phone-notch {
            width: 52px;
            height: 16px;
          }

          .phone-screen {
            border-radius: 20px;
          }

          .btn-store {
            gap: 10px;
            padding: 12px 16px;
          }

          .btn-label {
            font-size: 15px;
          }
        }
      `}</style>
    </section>
  )
}
