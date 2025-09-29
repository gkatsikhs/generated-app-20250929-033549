import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { useEventStore } from '@/stores/event-store';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Toaster, toast } from '@/components/ui/sonner';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from '@/lib/i18n';
import { el } from 'date-fns/locale';
import { EmailInput } from '@/components/EmailInput';
export function EventFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addEvent = useEventStore((state) => state.addEvent);
  const updateEvent = useEventStore((state) => state.updateEvent);
  const getEventById = useEventStore((state) => state.getEventById);
  const fetchEvents = useEventStore((state) => state.fetchEvents);
  const { t, formatDate, lang } = useTranslations();
  const eventFormSchema = z.object({
    title: z.string().min(3, t('eventForm.errors.titleMin')),
    description: z.string().min(10, t('eventForm.errors.descriptionMin')),
    location: z.string().min(3, t('eventForm.errors.locationMin')),
    date: z.date(),
    imageUrl: z.string().url(t('eventForm.errors.imageUrlInvalid')),
    invitedEmails: z.array(z.string().email()).optional(),
  });
  type EventFormValues = z.infer<typeof eventFormSchema>;
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = Boolean(id);
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2070&auto=format&fit=crop',
      invitedEmails: [],
    },
  });
  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      const event = getEventById(id);
      if (event) {
        form.reset({ ...event, date: new Date(event.date), invitedEmails: event.invitedEmails || [] });
        setIsLoading(false);
      } else {
        fetchEvents().then(() => {
          const fetchedEvent = useEventStore.getState().getEventById(id);
          if (fetchedEvent) {
            form.reset({ ...fetchedEvent, date: new Date(fetchedEvent.date), invitedEmails: fetchedEvent.invitedEmails || [] });
          }
          setIsLoading(false);
        });
      }
    }
  }, [id, isEditMode, getEventById, form, fetchEvents]);
  const onSubmit = async (data: EventFormValues) => {
    try {
      const eventData = { ...data, date: data.date.toISOString() };
      if (isEditMode && id) {
        await updateEvent(id, eventData);
        toast.success(t('eventForm.updateSuccess'));
        setTimeout(() => navigate(`/event/${id}`), 1500);
      } else {
        const newEvent = await addEvent(eventData);
        toast.success(t('eventForm.createSuccess'));
        setTimeout(() => navigate(`/event/${newEvent.id}`), 1500);
      }
    } catch (error) {
      toast.error((error as Error).message || t('common.errorUnexpected'));
    }
  };
  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="text-center mb-12 space-y-4">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>
        <div className="space-y-8">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
    );
  }
  return (
    <>
      <Toaster richColors />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            {isEditMode ? t('eventForm.editTitle') : t('eventForm.createTitle')}
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            {isEditMode ? t('eventForm.editSubtitle') : t('eventForm.createSubtitle')}
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('eventForm.labels.title')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('eventForm.placeholders.title')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('eventForm.labels.description')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('eventForm.placeholders.description')} className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('eventForm.labels.location')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('eventForm.placeholders.location')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t('eventForm.labels.date')}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                          >
                            {field.value ? formatDate(field.value, 'PPP') : <span>{t('eventForm.placeholders.date')}</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar locale={lang === 'el' ? el : undefined} mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date() || date < new Date("1900-01-01")} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('eventForm.labels.imageUrl')}</FormLabel>
                  <FormControl>
                    <Input placeholder="https://images.unsplash.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="invitedEmails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invite Guests</FormLabel>
                  <FormControl>
                    <EmailInput
                      emails={field.value || []}
                      setEmails={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Add guest emails. Press Enter or comma to add.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full md:w-auto">
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? t('eventForm.buttons.save') : t('eventForm.buttons.create')}
            </Button>
          </form>
        </Form>
      </motion.div>
    </>
  );
}