import type { ReactNode } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

export function Avatar({ initials, color = '#d96e4b', size = 44, photo }: { initials: string; color?: string; size?: number; photo?: string }) {
  if (photo) {
    return <span className="avatar photo" style={{ width: size, height: size }}><img src={photo} alt={initials} loading="lazy" /></span>;
  }
  return <span className="avatar" style={{ background: color, width: size, height: size, fontSize: size * 0.31 }}>{initials}</span>;
}

export function VerifiedBadge({ text = 'Verified' }: { text?: string }) {
  return <span className="verified-badge"><CheckCircle2 size={13} fill="currentColor" />{text}</span>;
}

export function Modal({ open, onClose, children, wide = false }: { open: boolean; onClose: () => void; children: ReactNode; wide?: boolean }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal-card ${wide ? 'wide' : ''}`}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><X size={20} /></button>
        {children}
      </div>
    </div>
  );
}

export function Toast({ message, visible }: { message: string; visible: boolean }) {
  return <div className={`toast ${visible ? 'show' : ''}`}><CheckCircle2 size={18} />{message}</div>;
}

export function Stepper({ active, total }: { active: number; total: number }) {
  return <div className="stepper">{Array.from({ length: total }).map((_, i) => <span key={i} className={i < active ? 'active' : ''} />)}</div>;
}
