import { Bell, Settings, ChevronLeft, HelpCircle } from 'lucide-react';

interface AppHeaderProps {
  subtitle: string;
  title: string;
  showNotificationDot?: boolean;
  backHref?: string;
  onBack?: () => void;
  onNotifications?: () => void;
  onSettings?: () => void;
  onHelp?: () => void;
}

export const AppHeader = ({
  subtitle,
  title,
  showNotificationDot = false,
  onBack,
  onNotifications,
  onSettings,
  onHelp
}: AppHeaderProps) => {
  return (
    <header className="shrink-0 pt-14 px-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack ? (
            <button
              onClick={onBack}
              className="h-11 w-11 rounded-2xl bg-white ring-1 ring-black/10 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.45)] flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all outline-none"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
          ) : (
            <div className="h-9 w-9 rounded-2xl bg-[#1D6B4F] ring-1 ring-black/10 flex items-center justify-center overflow-hidden">
              <img
                src="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/b1cbfc0e-79d5-45d7-9749-3bc14aed3a08/1771507502618-bf5a3efd/LOGO-BEIGE.png"
                alt="Natty"
                className="h-6 w-auto"
              />
            </div>
          )}
          <div className="leading-tight">
            <p className="text-[12px] text-slate-600 font-sans">{subtitle}</p>
            <h1 className="text-[18px] font-display tracking-tight">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onNotifications && (
            <button
              onClick={onNotifications}
              className="relative h-11 w-11 rounded-2xl bg-white ring-1 ring-black/10 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.45)] flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all outline-none"
            >
              <Bell className="w-5 h-5 text-slate-700" />
              {showNotificationDot && (
                <span className="absolute top-3 right-3 h-2 w-2 bg-[#E8956F] rounded-full ring-2 ring-white"></span>
              )}
            </button>
          )}
          {onSettings && (
            <button
              onClick={onSettings}
              className="h-11 w-11 rounded-2xl bg-white ring-1 ring-black/10 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.45)] flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all outline-none"
            >
              <Settings className="w-5 h-5 text-slate-700" />
            </button>
          )}
          {onHelp && (
            <button
              onClick={onHelp}
              className="h-11 w-11 rounded-2xl bg-white ring-1 ring-black/10 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.45)] flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all outline-none"
            >
              <HelpCircle className="w-5 h-5 text-slate-700" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
