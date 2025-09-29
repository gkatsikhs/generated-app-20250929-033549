import { useState, useEffect, type ReactNode } from 'react';
import { useEventStore } from '@/stores/event-store';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Check, HelpCircle, X, Loader2, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { Attendee, AttendeeStatus } from '@shared/types';
import { useTranslations } from '@/lib/i18n';
interface RsvpDialogProps {
  children: ReactNode;
  eventId: string;
  currentUserRsvp?: Attendee;
}
export function RsvpDialog({ children, eventId, currentUserRsvp }: RsvpDialogProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslations();
  const [status, setStatus] = useState<AttendeeStatus>(currentUserRsvp?.status || 'not_going');
  const [adults, setAdults] = useState(Number(currentUserRsvp?.adults) || 1);
  const [kids, setKids] = useState(Number(currentUserRsvp?.kids) || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const rsvpAction = useEventStore((state) => state.rsvp);
  useEffect(() => {
    if (open) {
      if (currentUserRsvp) {
        setStatus(currentUserRsvp.status);
        setAdults(Number(currentUserRsvp.adults) || 1);
        setKids(Number(currentUserRsvp.kids) || 0);
      } else {
        setStatus('not_going');
        setAdults(1);
        setKids(0);
      }
    }
  }, [currentUserRsvp, open]);
  const handleRsvp = async () => {
    setIsSubmitting(true);
    try {
      const finalAdults = status === 'going' ? Math.max(1, adults) : adults;
      const finalKids = status === 'going' ? kids : 0;
      await rsvpAction(eventId, { status, adults: finalAdults, kids: finalKids });
      toast.success(t('rsvp.updateSuccess'));
      setOpen(false);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const NumberInput = ({ label, value, setValue, min = 0 }: { label: string; value: number; setValue: (v: number) => void; min?: number }) => (
    <div className="flex items-center justify-between">
      <Label htmlFor={label.toLowerCase()} className="text-lg">{label}</Label>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setValue(Math.max(min, value - 1))}>
          <Minus className="h-4 w-4" />
        </Button>
        <Input id={label.toLowerCase()} type="number" value={value} readOnly className="w-16 h-8 text-center" />
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setValue(value + 1)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('rsvp.modal.title')}</DialogTitle>
          <DialogDescription>{t('rsvp.modal.description')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <ToggleGroup
            type="single"
            value={status}
            onValueChange={(value) => value && setStatus(value as AttendeeStatus)}
            className="w-full grid grid-cols-3 gap-2"
          >
            <ToggleGroupItem value="going" className="data-[state=on]:bg-green-500 data-[state=on]:text-white h-12 text-base"><Check className="h-5 w-5 mr-2" /> {t('rsvp.going')}</ToggleGroupItem>
            <ToggleGroupItem value="maybe" className="data-[state=on]:bg-yellow-500 data-[state=on]:text-white h-12 text-base"><HelpCircle className="h-5 w-5 mr-2" /> {t('rsvp.maybe')}</ToggleGroupItem>
            <ToggleGroupItem value="not_going" className="data-[state=on]:bg-red-500 data-[state=on]:text-white h-12 text-base"><X className="h-5 w-5 mr-2" /> {t('rsvp.notGoing')}</ToggleGroupItem>
          </ToggleGroup>
          {status === 'going' && (
            <div className="space-y-4 rounded-md border p-4">
              <NumberInput label={t('rsvp.modal.adults')} value={adults} setValue={setAdults} min={1} />
              <NumberInput label={t('rsvp.modal.kids')} value={kids} setValue={setKids} />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleRsvp} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('rsvp.modal.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}