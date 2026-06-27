import React from "react";

interface MouthAnatomySVGProps {
  type: string; // e.g., "spread", "round", "wide", "neutral"
  className?: string;
}

export function MouthAnatomySVG({ type, className = "" }: MouthAnatomySVGProps) {
  // A stylized sagittal (side profile) view of mouth/throat
  // We change the lip shape and tongue curve based on type.

  const getPaths = () => {
    switch (type) {
      case "spread":
      case "i":
      case "e":
        return {
          lips: "M 80 50 Q 85 45 90 50 Q 85 55 80 50", // Narrow opening
          tongue: "M 40 80 Q 60 40 80 65", // High front tongue
        };
      case "round":
      case "u":
      case "o":
        return {
          lips: "M 80 40 C 95 40 95 60 80 60", // Pushed out, round
          tongue: "M 40 80 Q 50 60 75 70", // High back
        };
      case "wide":
      case "a":
        return {
          lips: "M 75 35 Q 90 50 75 65", // Wide opening
          tongue: "M 40 80 Q 60 75 80 75", // Low tongue
        };
      case "consonant_teeth":
      case "th":
      case "f":
      case "v":
        return {
          lips: "M 80 45 Q 85 50 80 55", // Neutral
          tongue: "M 40 80 Q 60 50 85 48", // Tongue between teeth or touching
        };
      default:
        return {
          lips: "M 80 45 Q 85 50 80 55", // Neutral
          tongue: "M 40 80 Q 60 60 80 65", // Neutral tongue
        };
    }
  };

  const { lips, tongue } = getPaths();

  return (
    <svg viewBox="0 0 120 120" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Face Profile */}
      <path d="M 60 10 C 20 10 20 110 60 110 L 100 110 L 100 10 Z" fill="#ffe0bd" />
      
      {/* Nose and Upper Lip Profile */}
      <path d="M 60 10 C 80 10 90 20 90 30 C 90 35 85 40 80 40 C 75 40 75 35 70 35" stroke="#e5c09e" strokeWidth="2" strokeLinecap="round" />
      
      {/* Palate / Roof of mouth */}
      <path d="M 30 50 Q 50 35 75 40" stroke="#f472b6" strokeWidth="4" fill="none" strokeLinecap="round" />
      
      {/* Throat / Pharynx */}
      <path d="M 30 50 L 30 110 M 40 80 L 40 110" stroke="#f472b6" strokeWidth="4" fill="none" />

      {/* Teeth */}
      <rect x="75" y="40" width="4" height="6" fill="white" rx="1" />
      <rect x="73" y="55" width="4" height="6" fill="white" rx="1" />

      {/* Tongue */}
      <path d={tongue} stroke="#fb7185" strokeWidth="8" fill="none" strokeLinecap="round" />

      {/* Lips */}
      <path d={lips} stroke="#f43f5e" strokeWidth="6" fill="none" strokeLinecap="round" />
      
      {/* Chin */}
      <path d="M 75 65 C 80 75 75 90 60 110" stroke="#e5c09e" strokeWidth="2" fill="none" />
    </svg>
  );
}
