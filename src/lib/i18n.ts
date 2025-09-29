import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { format, type Locale } from 'date-fns';
import { enUS, el } from 'date-fns/locale';
// Lightweight replacement for lodash.get to remove dependency
const get = (obj: any, path: string, defaultValue: any) => {
  const result = path.split('.').reduce((r, p) => r?.[p], obj);
  return result === undefined ? defaultValue : result;
};
type Language = 'en' | 'el';
interface I18nState {
  lang: Language;
  setLang: (lang: Language) => void;
}
const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      lang: 'en',
      setLang: (lang) => set({ lang })
    }),
    {
      name: 'eventide-language-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
const translations = {
  en: {
    header: {
      title: 'Eventide',
      createEvent: 'Create Event',
      profile: 'Profile',
      logout: 'Log out'
    },
    footer: {
      builtWith: 'Built with ❤️ at Cloudflare'
    },
    dashboard: {
      title: 'Events Dashboard',
      subtitle: "Here's what's happening in your group.",
      upcomingEvents: 'Upcoming Events',
      pastEvents: 'Past Events',
      noUpcomingEvents: 'No upcoming events. Why not create one?',
      noPastEvents: 'No past events yet.'
    },
    login: {
      subtitle: 'Sign in to plan your next event',
      signIn: 'Sign In',
      signingIn: 'Signing In...',
      noAccount: "Don't have an account?",
      signUp: 'Sign Up',
      fail: 'Login failed. Please check your credentials.'
    },
    signup: {
      title: 'Create an Account',
      subtitle: 'Join Eventide to start planning',
      creatingAccount: 'Creating Account...',
      haveAccount: 'Already have an account?',
      success: 'Account created successfully!',
      fail: 'Failed to create account.',
      errors: {
        nameMin: 'Name must be at least 2 characters.',
        emailInvalid: 'Please enter a valid email address.',
        passwordMin: 'Password must be at least 8 characters.'
      }
    },
    eventDetails: {
      back: 'Back to all events',
      about: 'About this event',
      details: 'Details',
      organizedBy: 'Organized by',
      yourRsvp: 'Your RSVP',
      updateRsvp: 'Update RSVP',
      rsvpNow: 'RSVP Now',
      guestList: 'Guest List ({count} Going)',
      attendeeTooltip: '{adults} Adults, {kids} Kids',
      deleteSuccess: 'Event deleted successfully.',
      pdfFail: 'Failed to generate PDF.'
    },
    eventForm: {
      createTitle: 'Create a New Event',
      createSubtitle: 'Fill in the details below to get your party started.',
      editTitle: 'Edit Event',
      editSubtitle: 'Update the details for your event.',
      labels: {
        title: 'Event Title',
        description: 'Description',
        location: 'Location',
        date: 'Date & Time',
        imageUrl: 'Event Image URL'
      },
      placeholders: {
        title: 'e.g., Summer BBQ Bash',
        description: 'Tell us more about the event...',
        location: 'e.g., Central Park',
        date: 'Pick a date'
      },
      buttons: {
        create: 'Create Event',
        save: 'Save Changes'
      },
      createSuccess: 'Event created successfully!',
      updateSuccess: 'Event updated successfully!',
      errors: {
        titleMin: 'Title must be at least 3 characters long.',
        descriptionMin: 'Description must be at least 10 characters long.',
        locationMin: 'Location is required.',
        imageUrlInvalid: 'Please enter a valid image URL.'
      }
    },
    profile: {
      updateSuccess: 'Name updated successfully!',
      avatarSuccess: 'Profile picture updated!',
      avatarModal: {
        title: 'Change Profile Picture',
        description: 'Enter a new image URL for your profile picture.',
        label: 'Image URL'
      },
      tabs: {
        organizing: 'Organizing ({count})',
        attending: 'Attending ({count})'
      },
      empty: {
        organizing: "You haven't organized any events yet.",
        attending: "You haven't RSVP'd 'going' to any events yet."
      },
      errors: {
        nameMin: 'Name must be at least 2 characters.',
        avatarInvalid: 'Please enter a valid URL.'
      }
    },
    rsvp: {
      going: 'Going',
      maybe: 'Maybe',
      notGoing: "Can't Go",
      updateSuccess: 'Your RSVP has been updated!',
      modal: {
        title: 'Update your RSVP',
        description: "Let the host know if you're coming and who you're bringing.",
        adults: 'Adults',
        kids: 'Kids',
        submit: 'Submit RSVP'
      }
    },
    deleteDialog: {
      title: 'Are you absolutely sure?',
      description: 'This action cannot be undone. This will permanently delete the event and remove all associated data from our servers.'
    },
    pdf: {
      date: 'Date',
      location: 'Location',
      name: 'Name',
      email: 'Email',
      status: 'Status',
      adults: 'Adults',
      kids: 'Kids'
    },
    common: {
      error: 'Error',
      loading: 'Loading...',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      cancel: 'Cancel',
      delete: 'Delete',
      save: 'Save Changes',
      errorUnexpected: 'An unexpected error occurred.'
    }
  },
  el: {
    header: {
      title: 'Eventide',
      createEvent: 'Δημιουργία Εκδήλωσης',
      profile: 'Προφί��',
      logout: 'Αποσύνδεση'
    },
    footer: {
      builtWith: 'Φτιάχτηκε με ❤️ στην Cloudflare'
    },
    dashboard: {
      title: 'Πίνακας Εκδηλώσεων',
      subtitle: 'Δείτε τι συμβαίνει στην ομάδα σας.',
      upcomingEvents: 'Προσεχείς Εκδηλώσεις',
      pastEvents: 'Παλαιότερες Εκδηλώσεις',
      noUpcomingEvents: 'Δεν υπάρχουν προσεχείς εκδηλώσεις. Γιατί δεν δημιουργείτε μία;',
      noPastEvents: 'Δεν υπάρχουν παλαιότερες εκδηλώσεις ακόμη.'
    },
    login: {
      subtitle: 'Συνδεθείτε για να οργανώσετε την επόμενη εκδήλωσή σας',
      signIn: 'Σύνδεση',
      signingIn: 'Γίνεται σ��νδεση...',
      noAccount: 'Δεν έχετε λογαριασμό;',
      signUp: 'Εγγραφή',
      fail: 'Η σύνδεση απέτυχε. Ελέγξτε τα στοιχεία σας.'
    },
    signup: {
      title: 'Δημιουργία Λογαριασμού',
      subtitle: 'Εγγραφείτε στο Eventide για να ξεκινήσετε τον προγραμματισμό',
      creatingAccount: 'Δημιουργία Λογαριασμού...',
      haveAccount: 'Έχετε ήδη λογαριασμό;',
      success: 'Ο λογαριασμός δημιουργήθηκε με επιτυχία!',
      fail: 'Η δημιουργία λογαριασμού απέτυχε.',
      errors: {
        nameMin: 'Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες.',
        emailInvalid: 'Παρακαλώ εισάγετε μια έγκυρη διεύθυνση email.',
        passwordMin: 'Ο κωδικός πρόσβασης πρέπει να έχει τουλάχιστον 8 χαρακτήρες.'
      }
    },
    eventDetails: {
      back: 'Πίσω σε όλες τι�� εκδηλώσεις',
      about: 'Σχετικά με αυτή την εκδήλωση',
      details: 'Λεπτομέρειες',
      organizedBy: 'Διοργανώθηκε από',
      yourRsvp: 'Η Δήλωσή σας',
      updateRsvp: 'Ενημέρωση Δήλωσης',
      rsvpNow: 'Δηλώστε Συμμετοχή',
      guestList: 'Λίστα Καλεσμένων ({count} θα Παρευρεθούν)',
      attendeeTooltip: '{adults} Ενήλικες, {kids} Παιδιά',
      deleteSuccess: 'Η εκδήλωση διαγράφηκε με επιτυχία.',
      pdfFail: 'Η δημιουργία του PDF απέτυχε.'
    },
    eventForm: {
      createTitle: 'Δημιουργία Νέας Εκδήλωσης',
      createSubtitle: 'Συμπληρώστε τις παρακάτω λεπτομέρειες για να ξεκινήσετε το πάρ��ι σας.',
      editTitle: 'Επεξεργασία Εκδήλωσης',
      editSubtitle: 'Ενημ��ρώστε τις λεπτομέρειες για την εκδήλωσή σας.',
      labels: {
        title: 'Τίτλος Εκδήλωσης',
        description: 'Περιγραφή',
        location: 'Τοποθεσία',
        date: 'Ημερομηνία & Ώρα',
        imageUrl: 'URL Εικόνας Εκδήλωσης'
      },
      placeholders: {
        title: 'π.χ., Καλοκαιρινό BBQ Πάρτι',
        description: 'Πείτε μας περισσότερα για την εκδήλωση...',
        location: 'π.χ., Κεντρικό Πάρκο',
        date: 'Επιλέξτε ημερομηνία'
      },
      buttons: {
        create: 'Δημιουργία Εκδήλωσης',
        save: 'Αποθήκευση Αλλαγών'
      },
      createSuccess: 'Η εκδήλωση δημιουργήθηκε με επιτυχία!',
      updateSuccess: 'Η εκδήλωση ενημερώθηκε με επιτυχία!',
      errors: {
        titleMin: 'Ο τίτλος πρέπει να έχει τουλάχιστον 3 χαρακτήρες.',
        descriptionMin: 'Η περιγραφή πρέπει να έχει τουλάχιστον 10 χαρακτήρες.',
        locationMin: 'Η τοποθεσία είναι υποχρεωτική.',
        imageUrlInvalid: 'Παρακαλώ εισάγετε ένα έγκυρο URL εικόνας.'
      }
    },
    profile: {
      updateSuccess: 'Το όνομα ενημερώθηκε με επιτυχία!',
      avatarSuccess: 'Η εικόνα προφίλ ενημερώθηκε!',
      avatarModal: {
        title: 'Αλλαγή Εικόνας Προφίλ',
        description: 'Εισάγετε ένα νέο URL εικόνας για την εικόνα προφίλ σας.',
        label: 'URL Εικόνας'
      },
      tabs: {
        organizing: 'Οργανώ��ετε ({count})',
        attending: 'Συμμετέχετε ({count})'
      },
      empty: {
        organizing: 'Δεν έχετε οργανώσει καμία ε��δήλωση ακόμη.',
        attending: 'Δεν έχετε δηλώσει "θα πάω" σε καμία εκδήλωση ακόμη.'
      },
      errors: {
        nameMin: 'Το όνομα πρέπει να έχει τουλάχιστον 2 χαρακτήρες.',
        avatarInvalid: 'Παρακαλώ εισάγετε ένα έγκυρο URL.'
      }
    },
    rsvp: {
      going: 'Θα πάω',
      maybe: 'Ίσως',
      notGoing: 'Δεν μπορώ',
      updateSuccess: 'Η δήλωσή σας ενημερώθηκε!',
      modal: {
        title: 'Ενημερώστε τη δήλωσή σας',
        description: 'Ενημερώστε τον διοργανωτή αν έρχεστε και ποιον φέρνετε μαζί σας.',
        adults: 'Ενήλικες',
        kids: 'Παιδιά',
        submit: 'Υποβολή Δήλωσης'
      }
    },
    deleteDialog: {
      title: 'Είστε απολύτως σί��ουροι;',
      description: 'Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Θα διαγράψει οριστικά την εκδήλωση και θα αφαιρέσει όλα τα σχετικά ��εδομένα από τους διακομιστές μας.'
    },
    pdf: {
      date: 'Ημερομηνία',
      location: 'Τοποθεσία',
      name: 'Όνομα',
      email: 'Email',
      status: 'Κατάσταση',
      adults: 'Ενήλικες',
      kids: 'Παιδιά'
    },
    common: {
      error: 'Σφάλμα',
      loading: '��όρτωση...',
      email: 'Email',
      password: 'Κωδικός Πρόσβασης',
      name: 'Όνομα',
      cancel: 'Ακύρωση',
      delete: 'Διαγραφή',
      save: 'Αποθήκευση Αλλαγών',
      errorUnexpected: 'Παρουσιάστηκε ένα μη αναμενόμενο σφάλμα.'
    }
  }
};
const locales: Record<Language, Locale> = { en: enUS, el };
export function useTranslations() {
  const { lang, setLang } = useI18nStore();
  const t = (key: string, vars: Record<string, string | number> = {}) => {
    let translation = get(translations[lang], key, key) as string;
    Object.entries(vars).forEach(([varKey, varValue]) => {
      translation = translation.replace(`{${varKey}}`, String(varValue));
    });
    return translation;
  };
  const formatDate = (date: Date | number, formatStr: string) => {
    return format(date, formatStr, { locale: locales[lang] });
  };
  return { t, formatDate, lang, setLang };
}