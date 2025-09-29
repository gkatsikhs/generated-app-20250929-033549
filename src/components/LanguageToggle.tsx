import { Button } from '@/components/ui/button';
import { useTranslations } from '@/lib/i18n';
export function LanguageToggle() {
  const { lang, setLang } = useTranslations();
  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'el' : 'en');
  };
  return (
    <Button
      onClick={toggleLanguage}
      variant="ghost"
      size="sm"
      className="text-sm font-medium w-10"
    >
      {lang === 'en' ? 'EN' : 'ΕΛ'}
    </Button>
  );
}