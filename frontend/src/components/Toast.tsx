import { Check, Info, XCircle } from 'lucide-react';
import type { ToastData } from '../types';

export default function Toast({ toast }: { toast: ToastData }) {
  const Icon = toast.tone === 'error' ? XCircle : toast.tone === 'info' ? Info : Check;
  return <div className="toast" role="status"><span className={`toast-icon ${toast.tone ?? 'success'}`}><Icon size={14} /></span><span>{toast.message}</span></div>;
}
