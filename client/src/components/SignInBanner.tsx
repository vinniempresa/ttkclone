import { useTranslation } from '@/contexts/TranslationContext';

export function SignInBanner() {
  const { t } = useTranslation();
  
  return (
    <div className="bg-tiktok-light-gray p-4 rounded space-y-2">
      <p className="text-sm text-tiktok-black">
        <a 
          href="#" 
          className="font-semibold underline hover:opacity-70 transition-opacity" 
          data-testid="link-sign-in"
        >
          {t.signIn}
        </a>{' '}
        {t.forFreeShipping}
      </p>
      <p className="text-sm text-tiktok-gray">
        {t.or}{' '}
        <a 
          href="#" 
          className="underline hover:opacity-70 transition-opacity" 
          data-testid="link-create-account"
        >
          {t.createAccount}
        </a>{' '}
        {t.toEnjoyFreeShipping}
      </p>
    </div>
  );
}
