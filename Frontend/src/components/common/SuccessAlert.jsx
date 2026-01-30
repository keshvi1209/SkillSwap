import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

export default function SuccessAlert({ onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-green-500/20 shadow-2xl shadow-green-900/20">
        <div className="p-2 bg-green-500/10 rounded-full text-green-400">
          <CheckCircle size={24} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Success</h4>
          <p className="text-xs text-green-200/70 font-medium">Changes have been saved successfully</p>
        </div>
      </div>
    </div>
  );
}
