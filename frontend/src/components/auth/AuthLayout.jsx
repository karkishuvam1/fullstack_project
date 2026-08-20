import "../../styles/auth.css";
export default function AuthLayout({ children }) {
  return (
    <div className="aur-root">
      <div className="aur-showroom">
        <div className="aur-grid" aria-hidden="true" />

        <div className="aur-brandmark">
          <div className="aur-mark">
            Aurel<em>i</em>a Motorworks
          </div>
          <div className="aur-tag">Exceptional automobiles, privately sourced</div>
        </div>

        <CarIllustration />

        <div className="aur-showroom-footer">
          <strong>Curated inventory.</strong> Verified provenance.
          <br />
          Members receive first viewing on new arrivals.
        </div>
      </div>

      <div className="aur-formside">
        <div className="aur-formwrap">{children}</div>
      </div>
    </div>
  );
}

// Simple line-art car that draws itself in with a CSS animation
// (see .aur-blueprint-path in auth.css)
function CarIllustration() {
  return (
    <svg
      className="aur-illustration"
      viewBox="0 0 600 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Line illustration of a coupe"
    >
      <path
        className="aur-blueprint-path"
        d="M30,190 L30,178 C30,178 58,150 92,140 C112,134 128,126 140,120
           C160,104 180,90 202,80 C232,67 282,64 320,67 C356,70 376,90 386,105
           C400,119 415,128 430,131 C460,134 492,141 520,151 C540,158 555,171 560,183
           L560,190 Z"
      />
      <path
        className="aur-blueprint-detail"
        d="M96,150 L520,150 M150,120 C190,100 260,88 320,90 C350,91 368,100 380,112"
      />
      <circle className="aur-blueprint-wheel" cx="150" cy="192" r="34" />
      <circle className="aur-blueprint-wheel" cx="150" cy="192" r="15" />
      <circle className="aur-blueprint-wheel" cx="468" cy="192" r="34" />
      <circle className="aur-blueprint-wheel" cx="468" cy="192" r="15" />
    </svg>
  );
}