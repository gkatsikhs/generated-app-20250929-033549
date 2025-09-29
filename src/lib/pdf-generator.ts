import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import type { Event } from '@shared/types';
export const generateAttendeePdf = (event: Event, t: (key: string) => string) => {
  const doc = new jsPDF();
  const eventDate = new Date(event.date);
  // Add header
  doc.setFontSize(20);
  doc.text(event.title, 14, 22);
  doc.setFontSize(12);
  doc.text(`${t('pdf.date')}: ${format(eventDate, 'eeee, MMMM d, yyyy')}`, 14, 30);
  doc.text(`${t('pdf.location')}: ${event.location}`, 14, 36);
  // Define table columns and rows
  const head = [[
    t('pdf.name'),
    t('pdf.email'),
    t('pdf.status'),
    t('pdf.adults'),
    t('pdf.kids')
  ]];
  const body = event.attendees.map(attendee => [
    attendee.name,
    attendee.email,
    t(`rsvp.${attendee.status.replace('_', '')}`),
    attendee.status === 'going' ? attendee.adults.toString() : 'N/A',
    attendee.status === 'going' ? attendee.kids.toString() : 'N/A',
  ]);
  // Add table using autoTable
  autoTable(doc, {
    head,
    body,
    startY: 45,
    headStyles: {
      fillColor: [59, 130, 246], // Blue from color palette
    },
    styles: {
      cellPadding: 2,
      fontSize: 10,
    },
  });
  // Save the PDF
  doc.save(`${event.title.replace(/\s/g, '_')}_attendees.pdf`);
};