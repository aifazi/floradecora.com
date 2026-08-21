export default function SitePlanHero() {
  return (
    <svg
      viewBox="0 0 900 900"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Line drawing of a themed garden master plan, showing winding paths, planting beds and a water feature"
    >
      {/* site boundary */}
      <rect
        x="40" y="40" width="820" height="820" rx="4"
        stroke="#7C9473" strokeOpacity="0.35" strokeWidth="1"
        className="plan-fade"
      />

      {/* winding main path */}
      <path
        d="M 60 780 C 200 720, 180 560, 320 520 C 460 480, 420 340, 560 280 C 660 238, 700 160, 840 120"
        stroke="#DED0AC"
        strokeWidth="14"
        strokeLinecap="round"
        className="plan-line"
      />
      <path
        d="M 60 780 C 200 720, 180 560, 320 520 C 460 480, 420 340, 560 280 C 660 238, 700 160, 840 120"
        stroke="#16261C"
        strokeOpacity="0.5"
        strokeWidth="14"
        strokeDasharray="2 20"
        strokeLinecap="round"
        className="plan-line plan-line-delay1"
      />

      {/* secondary path branch */}
      <path
        d="M 320 520 C 250 600, 150 610, 100 700"
        stroke="#DED0AC"
        strokeWidth="8"
        strokeLinecap="round"
        className="plan-line plan-line-delay1"
      />

      {/* water feature, organic pond */}
      <path
        d="M 560 620 C 620 590, 700 610, 715 670 C 730 730, 660 770, 590 750 C 520 730, 500 650, 560 620 Z"
        stroke="#7C9473"
        strokeWidth="3"
        className="plan-line plan-line-delay2"
      />
      <path
        d="M 585 660 C 620 645, 665 655, 675 685 C 685 715, 645 735, 610 725 C 575 715, 560 675, 585 660 Z"
        stroke="#7C9473"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        className="plan-line plan-line-delay2"
      />

      {/* themed garden — circular butterfly garden beds */}
      <g className="plan-fade plan-fade-delay">
        <circle cx="200" cy="260" r="90" stroke="#C08A2E" strokeWidth="2" />
        <circle cx="200" cy="260" r="60" stroke="#C08A2E" strokeOpacity="0.5" strokeWidth="1.5" />
        <circle cx="200" cy="260" r="30" stroke="#C08A2E" strokeOpacity="0.3" strokeWidth="1.5" />
      </g>

      {/* planting bed clusters (trees / shrubs as dot clusters) */}
      <g className="plan-fade plan-fade-delay" fill="#586B51">
        <circle cx="150" cy="180" r="5" />
        <circle cx="170" cy="160" r="4" />
        <circle cx="130" cy="150" r="4.5" />
        <circle cx="245" cy="330" r="5" />
        <circle cx="270" cy="350" r="4" />
        <circle cx="700" cy="220" r="5" />
        <circle cx="725" cy="200" r="4" />
        <circle cx="745" cy="230" r="4.5" />
        <circle cx="470" cy="360" r="5" />
        <circle cx="495" cy="340" r="4" />
        <circle cx="640" cy="700" r="5" />
        <circle cx="660" cy="680" r="4" />
      </g>

      {/* plan annotation lines */}
      <g className="plan-fade plan-fade-delay" stroke="#C08A2E" strokeOpacity="0.6" strokeWidth="1">
        <line x1="200" y1="170" x2="200" y2="110" />
        <line x1="560" y1="690" x2="620" y2="690" />
      </g>

      {/* north marker */}
      <g className="plan-fade plan-fade-delay" transform="translate(780,760)">
        <line x1="0" y1="0" x2="0" y2="-34" stroke="#DED0AC" strokeWidth="1.5" />
        <path d="M 0 -34 L -6 -22 L 6 -22 Z" fill="#DED0AC" />
      </g>
    </svg>
  );
}
