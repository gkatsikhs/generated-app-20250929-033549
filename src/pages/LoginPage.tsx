import React from 'react';
import { motion } from 'framer-motion';
import { PartyPopper } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/lib/i18n';
export function LoginPage() {
  const { loginWithRedirect } = useAuth0();
  const { t } = useTranslations();
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent dark:from-blue-900/30 opacity-50"></div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
              <PartyPopper className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold">{t('header.title')}</CardTitle>
            <CardDescription>{t('login.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => loginWithRedirect()} className="w-full" size="lg">
              {t('login.signIn')}
            </Button>
          </CardContent>
          <CardFooter className="text-center text-sm">
            <p className="w-full">
              {t('login.noAccount')}{' '}
              <button onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })} className="font-semibold text-blue-500 hover:underline">
                {t('login.signUp')}
              </button>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}