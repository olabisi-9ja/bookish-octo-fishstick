import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Headphones, Send } from 'lucide-react';
import { Page, StatusChip, Skeleton } from '../../components/ui/Misc';
import { Button } from '../../components/ui/Button';
import { Field, SelectField } from '../../components/ui/Inputs';
import { supportService, HELP_CATEGORIES } from '../../services/supportService';
import { useComuta } from '../../store';
import { relativeTime } from '../../utils/format';
import type { SupportTicket } from '../../types';

export function Support() {
  const navigate = useNavigate();
  const session = useComuta((s) => s.session);
  const tickets = session ? supportService.myTickets(session.userId) : [];

  return (
    <Page>
      <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">Help center</h1>
      <p className="mt-1 text-[13.5px] text-variant">What do you need help with?</p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {HELP_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => navigate('/app/rider/support/new', { state: { category: c } })}
            className="rounded-xl border border-line bg-white px-2 py-3.5 text-[12.5px] font-extrabold text-onsurface tap hover:border-forest-600"
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-[15px] font-extrabold text-onsurface">Your tickets</h2>
        <button onClick={() => navigate('/app/rider/support/new')} className="text-[13px] font-extrabold text-forest-700 tap">
          New ticket
        </button>
      </div>

      <div className="mt-3 space-y-2.5">
        {tickets.length === 0 && (
          <div className="rounded-2xl border border-line bg-white px-6 py-10 text-center">
            <Headphones size={28} className="mx-auto text-faint" />
            <p className="mt-3 text-[14px] font-extrabold text-onsurface">No tickets yet</p>
            <p className="mt-1 text-[13px] text-variant">We usually reply within a few hours.</p>
          </div>
        )}
        {tickets.map((t) => (
          <button
            key={t.id}
            onClick={() => navigate(`/app/rider/support/${t.id}`)}
            className="flex w-full items-center gap-3 rounded-2xl border border-line-soft bg-white p-4 text-left shadow-soft tap"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-extrabold text-onsurface">{t.subject}</p>
              <p className="mt-0.5 text-[12px] font-semibold text-variant">{relativeTime(t.createdAt)}</p>
            </div>
            <StatusChip
              label={t.status === 'open' ? 'Open' : t.status === 'in_progress' ? 'In progress' : 'Resolved'}
              tone={t.status === 'open' ? 'neutral' : t.status === 'in_progress' ? 'amber' : 'green'}
              dot
            />
            <ChevronRight size={16} className="text-faint" />
          </button>
        ))}
      </div>
    </Page>
  );
}

export function NewTicket() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = useComuta((s) => s.session);
  const [subject, setSubject] = useState((location.state as { category?: string } | null)?.category ?? 'Booking');
  const [description, setDescription] = useState('');
  const [tripRef, setTripRef] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const send = async () => {
    if (!session) return;
    if (description.trim().length < 10) {
      setError('Give us a little more detail so we can help.');
      return;
    }
    setSending(true);
    const res = await supportService.createTicket({
      userId: session.userId,
      subject,
      description: description.trim(),
      tripRef: tripRef.trim() || undefined,
    });
    setSending(false);
    if (res.ok) navigate(`/app/rider/support/${res.id}`, { replace: true });
  };

  return (
    <Page>
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-variant hover:text-forest-900 tap">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-[22px] font-extrabold tracking-tight text-onsurface">New ticket</h1>

      <div className="mt-4 space-y-4">
        <SelectField label="Category" value={subject} onChange={(e) => setSubject(e.target.value)}>
          {HELP_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </SelectField>
        <Field label="Trip reference (optional)" placeholder="e.g. CMT-4F2K" value={tripRef} onChange={(e) => setTripRef(e.target.value)} />
        <div>
          <label className="mb-1.5 block text-[13px] font-bold text-variant" htmlFor="desc">
            What happened?
          </label>
          <textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Tell us what went wrong and what you'd like us to fix…"
            className="w-full rounded-xl border border-line bg-surface p-3.5 text-[14px] font-medium outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/30"
          />
        </div>
        {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-[13px] font-semibold text-red-600">{error}</p>}
        <Button block loading={sending} onClick={send}>
          Submit ticket
        </Button>
      </div>
    </Page>
  );
}

export function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ticket = useComuta((s) => s.tickets.find((t) => t.id === id));
  const replyTicket = useComuta((s) => s.replyTicket);
  const [draft, setDraft] = useState('');

  if (!ticket) {
    return (
      <Page>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="mt-3 h-48 w-full" />
      </Page>
    );
  }

  const send = async () => {
    if (!draft.trim()) return;
    await supportService.reply(ticket.id, draft.trim());
    setDraft('');
  };

  return (
    <Page>
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-variant hover:text-forest-900 tap">
        <ArrowLeft size={16} /> Back
      </button>
      <div className="flex items-center justify-between">
        <h1 className="max-w-[75%] truncate text-[20px] font-extrabold tracking-tight text-onsurface">{ticket.subject}</h1>
        <StatusChip
          label={ticket.status === 'open' ? 'Open' : ticket.status === 'in_progress' ? 'In progress' : 'Resolved'}
          tone={ticket.status === 'open' ? 'neutral' : ticket.status === 'in_progress' ? 'amber' : 'green'}
          dot
        />
      </div>

      <div className="mt-4 space-y-3">
        {ticket.messages.map((m) => (
          <div key={m.id} className={`max-w-[85%] rounded-2xl px-4 py-3 ${m.from === 'user' ? 'ml-auto rounded-br-md bg-forest-900 text-white' : 'mr-auto rounded-bl-md border border-line bg-white'}`}>
            <p className="text-[13.5px] leading-relaxed">{m.text}</p>
            <p className={`mt-1 text-[10.5px] font-semibold ${m.from === 'user' ? 'text-white/50' : 'text-faint'}`}>
              {m.from === 'user' ? 'You' : 'COMUTA support'} · {relativeTime(m.at)}
            </p>
          </div>
        ))}
      </div>

      {ticket.status !== 'resolved' && (
        <div className="mt-4 flex items-end gap-2 rounded-2xl border border-line bg-white p-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={2}
            placeholder="Reply…"
            className="flex-1 resize-none bg-transparent px-2 py-1.5 text-[14px] outline-none"
          />
          <button onClick={send} disabled={!draft.trim()} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-forest-900 text-white disabled:opacity-40 tap" aria-label="Send reply">
            <Send size={17} />
          </button>
        </div>
      )}
    </Page>
  );
}


