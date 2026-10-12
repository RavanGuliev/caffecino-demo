import { useState } from "react";

const FALLBACK = "/images/caffecino.png";

// Şəkil yüklənənə qədər skeleton göstərir, xəta olarsa loqoya keçir
export default function SmartImage({ src, alt = "", className = "", imgClassName = "", ...rest }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`${/\b(absolute|fixed)\b/.test(className) ? "" : "relative"} overflow-hidden bg-sand ${className}`}>
      {!loaded && <div className="absolute inset-0 skeleton" />}
      <img
        src={src || FALLBACK}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = FALLBACK;
          setLoaded(true);
        }}
        className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${imgClassName}`}
        {...rest}
      />
    </div>
  );
}
