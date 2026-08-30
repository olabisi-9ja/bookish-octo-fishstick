import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, FileText, RefreshCw, ShieldCheck, UploadCloud } from 'lucide-react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Field, SelectField } from '../../components/ui/Inputs';
import { VerificationSuccessArt, ErrorArt } from '../../components/illustrations/Illustrations';
import { authService } from '../../services/authService';
import { useComuta } from '../../store';
import { ID_TYPES } from '../../constants';
import { DURATION, EASE } from '../../constants';

type Step = 'intro' | 'form' | 'upload' | 'processing' | 'approved' | 'rejected';

export function Kyc() {
  const [step, setStep] = useState<Step>('intro');
  const [idType, setIdType] = useState<string>(ID_TYPES[0]);
  const [idNumber, setIdNumber] = useState('');
  const [fileName, setFileName] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const session = useComuta((s) => s.session);

  const submit = async () => {
    if (!session) return;
    setError('');
    setStep('processing');
    // simulate processing then approve
    const res = await authService.submitVerification(session.userId, idType, fileName);
    setStep(res.status === 'verified' ? 'approved' : 'rejected');
  };

  useEffect(() => {
    if (step !== 'upload') return;
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(t);
          setTimeout(submit, 400);
          return 100;
        }
        return p + 8;
      });
    }, 160);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const selectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFileName(f.name);
      setStep('upload');
    }
  };

  if (step === 'approved' || step === 'rejected') {
    const approved = step === 'approved';
    return (
      <AuthLayout narrow>
        <div className="mx-auto max-w-[230px]">{approved ? <VerificationSuccessArt /> : <ErrorArt />}</div>
        <h1 className="mt-4 text-center text-[26px] font-extrabold tracking-tight text-onsurface">
          {approved ? 'Identity verified' : 'Verification rejected'}
        </h1>
        <p className="mt-2 text-center text-[14px] leading-relaxed text-variant">
          {approved
            ? 'Your identity is verified. You can now book shared commutes and travel with confidence.'
            : 'We couldn’t confirm your document. Please try again with a clearer photo.'}
        </p>
        <Button block className="mt-8" onClick={() => navigate('/role', { replace: true })}>
          Continue
        </Button>
        {!approved && (
          <Button block variant="secondary" className="mt-2" onClick={() => setStep('form')}>
            <RefreshCw size={16} /> Retry
          </Button>
        )}
      </AuthLayout>
    );
  }

  return (
    <AuthLayout narrow>
      {/* stepper */}
      <div className="flex gap-1.5" aria-hidden>
        {['intro', 'form', 'upload'].map((s) => (
          <span key={s} className={`h-1 flex-1 rounded-full transition-colors ${stepIndex(s) <= stepIndex(step) ? 'bg-forest-700' : 'bg-line'}`} />
        ))}
      </div>

      {step === 'intro' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DURATION.standard, ease: EASE }}>
          <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-900">
            <ShieldCheck size={26} className="text-lime-500" />
          </div>
          <h1 className="mt-5 text-[26px] font-extrabold tracking-tight text-onsurface">Verify your identity</h1>
          <p className="mt-2 text-[14px] leading-relaxed text-variant">
            COMUTA is a trusted network. Verifying who you are helps every rider and driver travel with confidence. It takes about two minutes.
          </p>
          <ul className="mt-6 space-y-3">
            {['Uses an official Nigerian ID', 'Your document is never public', 'One-time verification'].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-[14px] font-semibold text-onsurface">
                <CheckCircle2 size={17} className="text-forest-700" /> {item}
              </li>
            ))}
          </ul>
          <Button block className="mt-8" onClick={() => setStep('form')}>
            Start verification
          </Button>
        </motion.div>
      )}

      {step === 'form' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DURATION.standard, ease: EASE }}>
          <h1 className="mt-6 text-[26px] font-extrabold tracking-tight text-onsurface">Choose an ID</h1>
          <p className="mt-2 text-[14px] text-variant">Select the document you'd like to verify with.</p>
          <div className="mt-7 space-y-4">
            <SelectField label="ID type" value={idType} onChange={(e) => setIdType(e.target.value)}>
              {ID_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </SelectField>
            <Field
              name="idNumber"
              label={`${idType} number`}
              placeholder={idType === 'NIN' ? '11-digit NIN' : 'Document number'}
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              required
            />
            <div>
              <p className="mb-1.5 text-[13px] font-bold text-variant">Upload document</p>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-28 w-full flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-line bg-surface-2 text-variant hover:border-forest-600 hover:text-forest-900 transition-colors tap"
              >
                <UploadCloud size={22} />
                <span className="text-[13px] font-bold">Tap to upload a photo</span>
                <span className="text-[11px] font-semibold text-faint">JPG or PNG, max 8 MB</span>
              </button>
              <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={selectFile} />
            </div>
            {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-[13px] font-semibold text-red-600">{error}</p>}
            <Button block disabled={!idNumber.trim()} onClick={() => { if (!fileName) { fileRef.current?.click(); } else submit(); }}>
              {fileName ? 'Submit for review' : 'Upload document first'}
            </Button>
          </div>
        </motion.div>
      )}

      {step === 'upload' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DURATION.standard, ease: EASE }}>
          <h1 className="mt-6 text-[26px] font-extrabold tracking-tight text-onsurface">Uploading your document</h1>
          <p className="mt-2 text-[14px] text-variant">Please keep this screen open while your document uploads.</p>
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-line bg-white p-4">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-forest-50">
              <FileText size={20} className="text-forest-700" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold text-onsurface">{fileName || 'document.jpg'}</p>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                <motion.div
                  className="h-full rounded-full bg-forest-700"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.15 }}
                />
              </div>
            </div>
            <span className="text-[12px] font-extrabold text-forest-700">{progress}%</span>
          </div>
          {fileName && progress === 0 && (
            <Button block variant="secondary" className="mt-4" onClick={() => setStep('form')}>
              Choose a different file
            </Button>
          )}
        </motion.div>
      )}

      {step === 'processing' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center pt-10">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
            className="grid h-16 w-16 place-items-center rounded-full border-4 border-surface-2 border-t-forest-700"
          />
          <h1 className="mt-6 text-center text-[22px] font-extrabold tracking-tight text-onsurface">Reviewing your document</h1>
          <p className="mt-2 max-w-xs text-center text-[14px] text-variant">This usually takes a few seconds. We'll let you know the moment it's done.</p>
        </motion.div>
      )}
    </AuthLayout>
  );
}

function stepIndex(s: string) {
  return s === 'intro' ? 0 : s === 'form' ? 1 : 2;
}
