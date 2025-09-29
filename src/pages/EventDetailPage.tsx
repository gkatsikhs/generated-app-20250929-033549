import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEventStore } from '@/stores/event-store';
import { useAuthStore } from '@/stores/auth-store';
import { ArrowLeft, Calendar, Check, MapPin, User, Users, X, HelpCircle, Loader2, Edit, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import type { Event } from '@shared/types';
import { Toaster, toast } from '@/components/ui/sonner';
import { DeleteEventDialog } from '@/components/DeleteEventDialog';
import { RsvpDialog } from '@/components/RsvpDialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { generateAttendeePdf } from '@/lib/pdf-generator';
import { useTranslations } from '@/lib/i18n';
export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deleteEvent = useEventStore((state) => state.deleteEvent);
  const fetchEvents = useEventStore((state) => state.fetchEvents);
  const event = useEventStore((state) => state.events.find((e) => e.id === id));
  const isLoading = useEventStore((state) => state.isLoading);
  const user = useAuthStore(state => state.user);
  const { t, formatDate } = useTranslations();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  useEffect(() => {
    if (!event) {
      fetchEvents();
    }
  }, [id, event, fetchEvents]);
  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteEvent(id);
      toast.success(t('eventDetails.deleteSuccess'));
      navigate('/');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };
  const handleExportPdf = () => {
    if (!event) return;
    setIsExportingPdf(true);
    try {
      setTimeout(() => {
        generateAttendeePdf(event, t);
        setIsExportingPdf(false);
      }, 500);
    } catch (error) {
      toast.error(t('eventDetails.pdfFail'));
      setIsExportingPdf(false);
    }
  };
  const rsvpCounts = useMemo(() => {
    if (!event) return { going: 0, maybe: 0, not_going: 0, total_going: 0 };
    return event.attendees.reduce((acc, attendee) => {
      acc[attendee.status] = (acc[attendee.status] || 0) + 1;
      if (attendee.status === 'going') {
        acc.total_going += attendee.adults + attendee.kids;
      }
      return acc;
    }, { going: 0, maybe: 0, not_going: 0, total_going: 0 });
  }, [event]);
  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }
  if (!event) {
    return (
      <div className="container max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
        <p className="text-muted-foreground mb-6">This event may not exist or you may not have permission to view it.</p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }
  const isCreator = user?.id === event.creator.id;
  const eventDate = new Date(event.date);
  const currentUserAttendee = event.attendees.find(a => a.id === user?.id);
  const statusIcons = {
    going: <Check className="h-4 w-4 text-green-500" />,
    maybe: <HelpCircle className="h-4 w-4 text-yellow-500" />,
    not_going: <X className="h-4 w-4 text-red-500" />,
  };
  return (
    <>
      <Toaster richColors />
      <DeleteEventDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('eventDetails.back')}
            </Link>
          </Button>
        </div>
        <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl shadow-lg">
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 w-full flex justify-between items-end">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{event.title}</h1>
            {isCreator && (
              <div className="flex gap-2">
                <Button variant="secondary" size="icon" onClick={handleExportPdf} disabled={isExportingPdf}>
                  {isExportingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                </Button>
                <Button asChild size="icon">
                  <Link to={`/event/${id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="destructive" size="icon" onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">{t('eventDetails.about')}</h2>
              <p className="text-lg text-muted-foreground">{event.description}</p>
            </div>
            <Separator />
            <div>
              <h2 className="text-2xl font-semibold mb-4">{t('eventDetails.details')}</h2>
              <div className="space-y-4 text-lg">
                <div className="flex items-center">
                  <Calendar className="mr-4 h-6 w-6 text-blue-500" />
                  <span className="text-foreground">{formatDate(eventDate, 'eeee, MMMM d, yyyy, h:mm a')}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-4 h-6 w-6 text-blue-500" />
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:underline hover:text-blue-500 transition-colors"
                  >
                    {event.location}
                  </a>
                </div>
                <div className="flex items-start">
                  <User className="mr-4 h-6 w-6 text-blue-500 mt-1" />
                  <div>
                    <span className="text-foreground">{t('eventDetails.organizedBy')} </span>
                    <span className="font-semibold">{event.creator.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>{t('eventDetails.yourRsvp')}</CardTitle>
              </CardHeader>
              <CardContent>
                <RsvpDialog eventId={event.id} currentUserRsvp={currentUserAttendee}>
                  <Button className="w-full" size="lg">
                    {currentUserAttendee ? t('eventDetails.updateRsvp') : t('eventDetails.rsvpNow')}
                  </Button>
                </RsvpDialog>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    {t('eventDetails.guestList', { count: rsvpCounts.total_going })}
                  </div>
                </CardTitle>
                <div className="text-sm text-muted-foreground flex justify-around pt-2">
                    <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-green-500" /> {rsvpCounts.going} {t('rsvp.going')}</span>
                    <span className="flex items-center gap-1.5"><HelpCircle className="h-4 w-4 text-yellow-500" /> {rsvpCounts.maybe} {t('rsvp.maybe')}</span>
                    <span className="flex items-center gap-1.5"><X className="h-4 w-4 text-red-500" /> {rsvpCounts.not_going} {t('rsvp.notGoing')}</span>
                </div>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <ul className="space-y-4">
                    {event.attendees.map(attendee => (
                      <li key={attendee.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={attendee.avatarUrl} alt={attendee.name} />
                            <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{attendee.name}</span>
                          {attendee.status === 'going' && (attendee.adults + attendee.kids) > 1 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span tabIndex={0}>
                                  <Badge variant="secondary">+{attendee.adults + attendee.kids - 1}</Badge>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{t('eventDetails.attendeeTooltip', { adults: attendee.adults, kids: attendee.kids })}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        <Badge variant="secondary" className="capitalize flex items-center gap-1.5">
                          {statusIcons[attendee.status]}
                          {t(`rsvp.${attendee.status.replace('_', '')}`)}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </TooltipProvider>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </>
  );
}