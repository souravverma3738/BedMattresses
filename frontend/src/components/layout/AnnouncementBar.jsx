import { useState } from 'react';
import { X } from 'lucide-react';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-[#1C1917] text-[#FAFAF9] py-2.5 px-4 text-center relative" data-testid="announcement-bar">
      <p className="text-sm font-medium tracking-wide">
        <span className="text-[#BC4C2E] font-semibold">WINTER SALE</span> — Up to 50% off selected beds + FREE delivery on orders over £500
        <span className="hidden sm:inline"> | Use code: <span className="font-bold">SLEEP50</span></span>
      </p>
      <button 
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
        aria-label="Close announcement"
        data-testid="close-announcement"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
