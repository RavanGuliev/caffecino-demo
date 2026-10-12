import { forwardRef } from "react";

export function Button({ variant = "primary", size = "md", className = "", loading, children, ...props }) {
  const variants = {
    primary: "bg-brand-800 text-white hover:bg-brand-700 shadow-sm",
    secondary: "bg-white text-brand-900 ring-1 ring-sand hover:ring-brand-300",
    ghost: "text-brand-900/70 hover:bg-brand-50 hover:text-brand-900",
    danger: "bg-red-600 text-white hover:bg-red-700",
    "danger-ghost": "text-red-600 hover:bg-red-50",
  };
  const sizes = { sm: "h-8 px-3 text-xs gap-1.5", md: "h-10 px-4 text-sm gap-2", icon: "h-9 w-9 justify-center" };
  return (
    <button
      className={`inline-flex items-center rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  );
}

export function Spinner({ className = "h-6 w-6" }) {
  return <span className={`inline-block rounded-full border-2 border-current border-r-transparent animate-spin ${className}`} />;
}

export function Field({ label, error, hint, required, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="block text-xs font-semibold text-brand-950/70 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      )}
      {children}
      {error ? (
        <span className="block text-xs text-red-600 mt-1">{error}</span>
      ) : (
        hint && <span className="block text-xs text-brand-950/45 mt-1">{hint}</span>
      )}
    </label>
  );
}

const inputCls = (error) =>
  `w-full rounded-xl bg-white px-3.5 text-sm text-brand-950 ring-1 outline-none transition placeholder:text-brand-950/35 focus:ring-2 ${
    error ? "ring-red-300 focus:ring-red-400" : "ring-sand focus:ring-brand-500"
  }`;

export const Input = forwardRef(function Input({ error, className = "", ...props }, ref) {
  return <input ref={ref} className={`${inputCls(error)} h-10 ${className}`} {...props} />;
});

export function Textarea({ error, className = "", ...props }) {
  return <textarea rows={3} className={`${inputCls(error)} py-2.5 resize-y ${className}`} {...props} />;
}

export function Select({ error, className = "", children, ...props }) {
  return (
    <select className={`${inputCls(error)} h-10 pr-8 ${className}`} {...props}>
      {children}
    </select>
  );
}

export function Toggle({ checked, onChange, label, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2.5 disabled:opacity-50"
    >
      <span className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-brand-600" : "bg-brand-950/15"}`}>
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
      </span>
      {label && <span className="text-sm font-medium text-brand-950/80">{label}</span>}
    </button>
  );
}

export function Card({ className = "", children }) {
  return <div className={`rounded-2xl bg-white ring-1 ring-sand ${className}`}>{children}</div>;
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-950">{title}</h1>
        {subtitle && <p className="text-sm text-brand-950/55 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatusPill({ active, onClick, labels }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition ${
        active ? "bg-brand-100 text-brand-800 hover:bg-brand-200" : "bg-brand-950/5 text-brand-950/50 hover:bg-brand-950/10"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-brand-500" : "bg-brand-950/30"}`} />
      {active ? labels[0] : labels[1]}
    </button>
  );
}

export function EmptyState({ text, action }) {
  return (
    <div className="py-16 text-center">
      <img src="/images/caffecino.png" alt="" className="mx-auto h-14 w-14 rounded-2xl opacity-60" />
      <p className="mt-4 text-sm text-brand-950/50">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Thumb({ src, className = "h-11 w-11" }) {
  return (
    <img
      src={src || "/images/caffecino.png"}
      alt=""
      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/images/caffecino.png"; }}
      className={`rounded-xl object-cover bg-sand shrink-0 ${className}`}
    />
  );
}
