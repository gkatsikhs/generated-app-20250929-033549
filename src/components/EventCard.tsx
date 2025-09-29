import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, MapPin } from 'lucide-react';
import type { Event } from '@shared/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
interface EventCardProps {
  event: Event;
}
export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Link to={`/event/${event.id}`} className="block group">
        <Card className="overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl dark:bg-gray-800 group-hover:shadow-glow-blue">
          <CardHeader className="p-0">
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <Badge variant="outline" className="text-blue-500 border-blue-500">
                {format(eventDate, 'MMM d')}
              </Badge>
              <div className="flex -space-x-2 overflow-hidden">
                {event.attendees.slice(0, 3).map((attendee) => (
                  <Avatar key={attendee.id} className="h-6 w-6 border-2 border-background">
                    <AvatarImage src={attendee.avatarUrl} />
                    <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
                {event.attendees.length > 3 && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                    +{event.attendees.length - 3}
                  </div>
                )}
              </div>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50 mb-2 truncate">{event.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{event.description}</p>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2 p-6 pt-0">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{format(eventDate, 'eeee, MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="mr-2 h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}