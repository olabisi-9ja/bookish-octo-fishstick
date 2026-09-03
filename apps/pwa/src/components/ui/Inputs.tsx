import { useRef, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const fieldBase =
  'w-full h-12 rounded-xl border border-line bg-surface px-3.5 text-[15px] font-medium text-onsurface placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-forest-600/40 focus:border-forest-600 transition disabled:bg-surface-2 disabled:text-faint';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Field({ label, hint, error, id, className = '', ...rest }: FieldProps) {
  const fieldId = id ?? rest.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={fieldId} className="mb-1.5 block text-[13px] font-bold text-variant">
          {label}
        </label>
      )}
      <input
        id={fieldId}
        className={`${fieldBase} ${error ? 'border-red-500 focus:ring-red-400' : ''} ${className}`}
        aria-invalid={!!error}
        {...rest}
      />
      {error ? (
        <p className="mt-1.5 flex items-center gap-1 text-[12px] font-semibold text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[12px] text-faint">{hint}</p>
      ) : null}
    </div>
  );
}

export function PasswordField({ label, error, className = '', ...rest }: FieldProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={rest.id ?? rest.name} className="mb-1.5 block text-[13px] font-bold text-variant">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          className={`${fieldBase} pr-12 ${error ? 'border-red-500' : ''} ${className}`}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-lg text-faint hover:text-variant"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="mt-1.5 text-[12px] font-semibold text-red-600">{error}</p>}
    </div>
  );
}

export function SelectField({ label, children, className = '', ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <div className="w-full">
      {label && <label className="mb-1.5 block text-[13px] font-bold text-variant">{label}</label>}
      <select className={`${fieldBase} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%3E%3Cpath%20d%3D%22M1%201l5%205%205-5%22%20stroke%3D%22%23405959%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[right_14px_center] bg-no-repeat pr-10 ${className}`} {...rest}>
        {children}
      </select>
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: {
  options: { value: T; label: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div role="tablist" className={`inline-flex items-center gap-1 rounded-xl bg-surface-2 p-1 ${className}`}>
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`h-9 rounded-lg px-4 text-[13px] font-bold transition-colors tap ${
            value === o.value ? 'bg-white text-forest-900 shadow-sm' : 'text-variant hover:text-forest-900'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Six-digit OTP input with auto-advance and paste support. */
export function OtpInput({ length = 6, value, onChange, disabled }: { length?: number; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const setChar = (index: number, char: string) => {
    const digits = char.replace(/\D/g, '');
    if (!digits) return;
    const next = value.split('');
    for (let i = 0; i < digits.length && index + i < length; i++) next[index + i] = digits[i];
    const joined = next.join('').slice(0, length);
    onChange(joined);
    const focusAt = Math.min(index + digits.length, length - 1);
    refs.current[focusAt]?.focus();
  };

  return (
    <div className="flex justify-between gap-2" role="group" aria-label="Verification code">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={length}
          value={value[i] ?? ''}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          onPaste={(e) => {
            e.preventDefault();
            setChar(i, e.clipboardData.getData('text'));
          }}
          onChange={(e) => setChar(i, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus();
            if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
            if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus();
          }}
          className={`h-13 w-full max-w-[52px] rounded-xl border border-line bg-surface text-center font-mono text-xl font-bold text-onsurface focus:border-forest-600 focus:ring-2 focus:ring-forest-600/30 focus:outline-none disabled:opacity-50 ${i === 0 ? '' : ''}`}
        />
      ))}
    </div>
  );
}

/** Numeric stepper (seat selection). */
export function Stepper({ value, onChange, min = 1, max = 4 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl bg-surface-2 p-1">
      <button
        className="grid h-11 w-11 place-items-center rounded-lg bg-white text-forest-900 shadow-sm hover:bg-surface disabled:opacity-40"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease seats"
      >
        −
      </button>
      <span className="min-w-12 text-center text-lg font-extrabold text-forest-900" aria-live="polite">
        {value} seat{value > 1 ? 's' : ''}
      </span>
      <button
        className="grid h-11 w-11 place-items-center rounded-lg bg-forest-900 text-white hover:bg-forest-800 disabled:opacity-40"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase seats"
      >
        +
      </button>
    </div>
  );
}
