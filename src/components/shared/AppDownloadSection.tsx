"use client";
import Image from "next/image";

// Replace these imports with your actual screenshot images
import screenLeft from "@/assets/images/app-screen-left.png";
import screenRight from "@/assets/images/app-screen-right.png";

// Replace these with your actual store links
const IOS_LINK = "https://apps.apple.com/us/app/ghafra/id6761885599";
const ANDROID_LINK = "https://play.google.com/store/apps/details?id=com.ghafra.ghafra";

export default function AppDownloadSection() {
  return (
    <section className="app-download-section">
      <div className="divider-line" />
      <h2>Download GhaFra App</h2>
      <p>
        Stay connected with the Ghanaian community in France. Access resources,
        events, and support — right from your phone.
      </p>

      <div className="phones-frame">
        {/* Left phone */}
        <div className="phone phone-left">
          <div className="phone-notch" />
          <div className="phone-screen">
            <Image
              src={screenLeft}
              alt="App screenshot showing community events"
              fill
              style={{ objectFit: "cover", borderRadius: "26px" }}
              sizes="160px"
            />
          </div>
        </div>

        {/* Right phone */}
        <div className="phone phone-right">
          <div className="phone-notch" />
          <div className="phone-screen">
            <Image
              src={screenRight}
              alt="App screenshot showing legal resources"
              fill
              style={{ objectFit: "cover", borderRadius: "26px" }}
              sizes="160px"
            />
          </div>
        </div>
      </div>

      <div className="download-btns">
        {/* iOS Button */}
        <a href={IOS_LINK} className="btn-store btn-ios" target="_blank" rel="noopener noreferrer">
          <svg className="btn-store-icon" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11" />
          </svg>
          <div className="btn-store-text">
            <span className="btn-sub">Download on the</span>
            <span className="btn-label">App Store</span>
          </div>
        </a>

        {/* Android Button */}
        <a href={ANDROID_LINK} className="btn-store btn-android" target="_blank" rel="noopener noreferrer">
          <svg className="btn-store-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3.18 23.76c.3.17.64.22.98.15l11.37-11.37-2.49-2.5L3.18 23.76zM20.59 10.4l-2.33-1.36-2.79 2.79 2.79 2.79 2.37-1.38c.68-.39.68-1.45-.04-1.84zM1.01 1.4C.96 1.56.94 1.73.94 1.92v19.96c0 .19.02.36.07.51l11.32-11.32L1.01 1.4zm15.52 9.1L5.16 1.12c-.32-.19-.67-.24-1-.18l11.37 11.38 1-2.82z" fill="#4CAF50" />
          </svg>
          <div className="btn-store-text">
            <span className="btn-sub">Get it on</span>
            <span className="btn-label">Google Play</span>
          </div>
        </a>
      </div>

      <style jsx>{`
        .app-download-section {
          background: #f8f6f2;
          padding: 72px 40px;
          text-align: center;
          font-family: Georgia, serif;
        }

        .divider-line {
          width: 48px;
          height: 4px;
          background: #c8102e;
          border-radius: 2px;
          margin: 0 auto 20px;
        }

        .app-download-section h2 {
          font-size: 38px;
          font-weight: 700;
          color: #c8a820;
          margin: 0 0 12px;
          font-family: Georgia, serif;
        }

        .app-download-section p {
          font-size: 16px;
          color: #555;
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
        }

        .phone {
          width: 160px;
          height: 290px;
          background: #1a1a1a;
          border-radius: 28px;
          border: 3px solid #333;
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
          padding: 14px 28px;
          border-radius: 14px;
          text-decoration: none;
          font-family: sans-serif;
          min-width: 180px;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
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
          background: white;
          color: #222;
          border: 2px solid #ddd;
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
      `}</style>
    </section>
  );
}