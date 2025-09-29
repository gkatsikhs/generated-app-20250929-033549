import { useAuthStore } from '@/stores/auth-store';
import { useEventStore } from '@/stores/event-store';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { Mail, CalendarPlus, CalendarCheck2, Edit, Check, X, Loader2, Camera } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventCard } from '@/components/EventCard';
import { useEffect, useState } from 'react';
import type { Event } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/lib/i18n';
export function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const events = useEventStore((state) => state.events);
  const fetchEvents = useEventStore((state) => state.fetchEvents);
  const { t } = useTranslations();
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isSubmittingName, setIsSubmittingName] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [isSubmittingAvatar, setIsSubmittingAvatar] = useState(false);
  useEffect(() => {
    if (events.length === 0) {
      fetchEvents();
    }
  }, [events.length, fetchEvents]);
  useEffect(() => {
    setName(user?.name || '');
    setAvatarUrl(user?.avatarUrl || '');
  }, [user]);
  const handleSaveName = async () => {
    if (name.trim().length < 2) {
      toast.error(t('profile.errors.nameMin'));
      return;
    }
    setIsSubmittingName(true);
    try {
      await updateUser({ name });
      toast.success(t('profile.updateSuccess'));
      setIsEditingName(false);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsSubmittingName(false);
    }
  };
  const handleSaveAvatar = async () => {
    try {
        new URL(avatarUrl);
    } catch (_) {
        toast.error(t('profile.errors.avatarInvalid'));
        return;
    }
    setIsSubmittingAvatar(true);
    try {
        await updateUser({ avatarUrl });
        toast.success(t('profile.avatarSuccess'));
        setIsAvatarDialogOpen(false);
    } catch (error) {
        toast.error((error as Error).message);
    } finally {
        setIsSubmittingAvatar(false);
    }
  };
  if (!user) {
    return (
      <div className="container max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p>{t('common.loading')}</p>
      </div>
    );
  }
  const organizedEvents = events.filter(event => event.creator.id === user.id);
  const attendingEvents = events.filter(event =>
    event.attendees.some(attendee => attendee.id === user.id && attendee.status === 'going')
  );
  const EventList = ({ events, emptyMessage }: { events: Event[], emptyMessage: string }) => (
    <div className="mt-6">
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
  return (
    <>
    <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t('profile.avatarModal.title')}</DialogTitle>
                <DialogDescription>{t('profile.avatarModal.description')}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="avatarUrl" className="text-right">{t('profile.avatarModal.label')}</Label>
                    <Input id="avatarUrl" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsAvatarDialogOpen(false)}>{t('common.cancel')}</Button>
                <Button onClick={handleSaveAvatar} disabled={isSubmittingAvatar}>
                    {isSubmittingAvatar && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('common.save')}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
    >
      <Card className="overflow-hidden shadow-lg mb-12">
        <CardHeader className="bg-muted/50 p-8 flex flex-col items-center text-center">
          <div className="relative group">
            <Avatar className="h-24 w-24 mb-4 border-4 border-background shadow-md">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="text-3xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="icon" className="absolute bottom-4 right-0 rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setIsAvatarDialogOpen(true)}>
                <Camera className="h-4 w-4" />
            </Button>
          </div>
          {!isEditingName ? (
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsEditingName(true)}>
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 w-full max-w-sm">
              <Input value={name} onChange={(e) => setName(e.target.value)} className="text-2xl font-bold h-12 text-center" />
              <Button size="icon" onClick={handleSaveName} disabled={isSubmittingName}>
                {isSubmittingName ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={() => { setIsEditingName(false); setName(user.name); }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex items-center text-lg text-muted-foreground mt-2">
            <Mail className="mr-2 h-5 w-5" />
            <span>{user.email}</span>
          </div>
        </CardHeader>
      </Card>
      <Tabs defaultValue="organizing" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="organizing">
            <CalendarPlus className="mr-2 h-4 w-4" />
            {t('profile.tabs.organizing', { count: organizedEvents.length })}
          </TabsTrigger>
          <TabsTrigger value="attending">
            <CalendarCheck2 className="mr-2 h-4 w-4" />
            {t('profile.tabs.attending', { count: attendingEvents.length })}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="organizing">
          <EventList events={organizedEvents} emptyMessage={t('profile.empty.organizing')} />
        </TabsContent>
        <TabsContent value="attending">
          <EventList events={attendingEvents} emptyMessage={t('profile.empty.attending')} />
        </TabsContent>
      </Tabs>
    </motion.div>
    </>
  );
}