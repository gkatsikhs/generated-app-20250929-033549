import { useEffect } from 'react';
import { useEventStore } from '@/stores/event-store';
import { EventCard } from '@/components/EventCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
export function HomePage() {
  const events = useEventStore((state) => state.events);
  const isLoading = useEventStore((state) => state.isLoading);
  const error = useEventStore((state) => state.error);
  const fetchEvents = useEventStore((state) => state.fetchEvents);
  const { t } = useTranslations();
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);
  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date());
  const pastEvents = events.filter(event => new Date(event.date) < new Date());
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50 mb-4">
          {t('dashboard.title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
          {t('dashboard.subtitle')}
        </p>
      </motion.div>
      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('common.error')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-gray-800 dark:text-gray-200 mb-8">
          {t('dashboard.upcomingEvents')}
        </h2>
        {isLoading ? renderSkeletons() : upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">{t('dashboard.noUpcomingEvents')}</p>
          </div>
        )}
      </section>
      <section className="mt-24">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-800 dark:text-gray-200 mb-8">
          {t('dashboard.pastEvents')}
        </h2>
        {isLoading ? renderSkeletons() : pastEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event) => (
              <div key={event.id} className="opacity-70">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        ) : (
          !isLoading && <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">{t('dashboard.noPastEvents')}</p>
          </div>
        )}
      </section>
    </div>
  );
}