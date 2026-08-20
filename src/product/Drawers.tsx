import { useState } from 'react';
import { Banknote, Bell, CheckCircle2, Send, ShieldCheck, WalletCards } from 'lucide-react';
import { Avatar } from '../components/UI';
import { formatNaira, fullName, relativeTime, usePlatform } from '../platform';

function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="drawer-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="drawer">
        <header>
          <h2>{title}</h2>
          <button onClick={onClose}>Close</button>
        </header>
        {children}
      </aside>
    </div>
  );
}

export function NotificationsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { me, state, markNotificationsRead } = usePlatform();
  const items = state.notifications.filter((item) => item.memberId === me?.id);
  return (
    <Drawer open={open} onClose={() => { markNotificationsRead(); onClose(); }} title="Notifications">
      <div className="drawer-list">
        {items.map((item) => (
          <article key={item.id} className={item.read ? '' : 'unread'}>
            <span className="kind">{item.kind}</span>
            <strong>{item.title}</strong>
            <p>{item.body}</p>
            <small>{relativeTime(item.at)}</small>
          </article>
        ))}
        {!items.length && <p className="empty-note">You're all caught up.</p>}
      </div>
    </Drawer>
  );
}

export function ChatDrawer({ tripId, open, onClose }: { tripId: string | null; open: boolean; onClose: () => void }) {
  const { state, me, sendMessage, memberById } = usePlatform();
  const [text, setText] = useState('');
  const messages = state.messages.filter((item) => item.tripId === tripId);
  const quick = ["I'm outside", "I'm at the gate", 'Please wait', "I'm looking for you"];
  return (
    <Drawer open={open && !!tripId} onClose={onClose} title="Trip chat">
      <div className="chat-thread">
        {messages.map((message) => {
          const mine = message.fromId === me?.id;
          const person = memberById(message.fromId);
          return (
            <div key={message.id} className={`bubble ${mine ? 'mine' : ''}`}>
              {!mine && <Avatar initials={person?.initials ?? 'PG'} color={person?.avatarColor} size={28} photo={person?.photo} />}
              <div>
                <strong>{person ? fullName(person) : 'Member'}</strong>
                <p>{message.text}</p>
                <small>{relativeTime(message.at)}</small>
              </div>
            </div>
          );
        })}
      </div>
      <div className="quick-row">
        {quick.map((item) => <button key={item} onClick={() => tripId && sendMessage(tripId, item)}>{item}</button>)}
      </div>
      <form className="chat-compose" onSubmit={(e) => { e.preventDefault(); if (tripId && text.trim()) { sendMessage(tripId, text); setText(''); } }}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Send a message" />
        <button type="submit"><Send size={16} /></button>
      </form>
    </Drawer>
  );
}

export function WalletDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { me, walletFor, availableBalance, pendingBalance } = usePlatform();
  const wallet = me ? walletFor(me.id) : null;
  return (
    <Drawer open={open} onClose={onClose} title="Wallet">
      <div className="wallet-hero">
        <WalletCards />
        <div>
          <span>Available</span>
          <strong>{formatNaira(availableBalance)}</strong>
          <small>Pending {formatNaira(pendingBalance)}</small>
        </div>
      </div>
      <div className="drawer-list">
        {wallet?.entries.slice(0, 12).map((entry) => (
          <article key={entry.id}>
            <span className="kind">{entry.type.replace('_', ' ')}</span>
            <strong>{entry.note}</strong>
            <p>{entry.amount < 0 ? '−' : '+'}{formatNaira(Math.abs(entry.amount))} · {entry.status}</p>
            <small>{relativeTime(entry.createdAt)}</small>
          </article>
        ))}
      </div>
      <p className="ledger-note"><ShieldCheck size={14} /> Every naira movement is an immutable ledger entry — not a mutable balance field.</p>
    </Drawer>
  );
}

export function HelpDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const faqs = [
    { q: 'How does matching work?', a: 'PadiGo scores route overlap, pickup and destination proximity, time window, driver rating and price. Community membership is a trust signal, not a replacement for verification.' },
    { q: 'When is payment released?', a: 'Your payment is authorised at booking and released to the driver after the trip is completed. Cancellations inside the window are refunded.' },
    { q: 'What is a ride PIN?', a: 'Each confirmed booking has a 4-digit PIN. The driver must enter it before the trip can start, so the wrong passenger never gets in.' },
    { q: 'Is this a live payment?', a: 'No. This prototype records ledger entries locally. Production will use Paystack or Flutterwave with webhook confirmation.' },
  ];
  return (
    <Drawer open={open} onClose={onClose} title="Help centre">
      <div className="drawer-list faqs">
        {faqs.map((item) => (
          <article key={item.q}>
            <strong>{item.q}</strong>
            <p>{item.a}</p>
          </article>
        ))}
        <article>
          <Bell size={16} />
          <strong>Need a human?</strong>
          <p>Safety issues use SOS. Everything else can be sent to support from an active trip.</p>
        </article>
      </div>
    </Drawer>
  );
}

export function SafetyDrawer({ open, onClose, onSos }: { open: boolean; onClose: () => void; onSos: () => void }) {
  const { me } = usePlatform();
  return (
    <Drawer open={open} onClose={onClose} title="Safety centre">
      <div className="drawer-list">
        <article>
          <CheckCircle2 size={16} />
          <strong>Emergency contacts</strong>
          <p>{me?.emergencyContacts[0] ? `${me.emergencyContacts[0].name} · ${me.emergencyContacts[0].phone}` : 'Add a contact in profile.'}</p>
        </article>
        <article>
          <Banknote size={16} />
          <strong>Payments are held</strong>
          <p>Seat contributions stay in a ledger until the trip completes or is refunded.</p>
        </article>
        <button className="btn btn-danger btn-block" onClick={onSos}>Open SOS</button>
      </div>
    </Drawer>
  );
}
