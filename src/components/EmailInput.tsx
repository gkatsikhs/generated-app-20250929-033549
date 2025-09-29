import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
interface EmailInputProps {
  emails: string[];
  setEmails: (emails: string[]) => void;
  className?: string;
}
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function EmailInput({ emails, setEmails, className }: EmailInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addEmail();
    } else if (e.key === 'Backspace' && inputValue === '' && emails.length > 0) {
      removeEmail(emails[emails.length - 1]);
    }
  };
  const addEmail = () => {
    const email = inputValue.trim();
    if (!email) return;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return;
    }
    if (emails.includes(email)) {
      setError('Email already added');
      return;
    }
    setEmails([...emails, email]);
    setInputValue('');
    setError(null);
  };
  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };
  return (
    <div className={cn("border rounded-md p-2 flex flex-wrap gap-2 items-center", className)}>
      {emails.map((email) => (
        <Badge key={email} variant="secondary" className="py-1 px-2 text-sm">
          {email}
          <button
            type="button"
            onClick={() => removeEmail(email)}
            className="ml-2 rounded-full hover:bg-muted-foreground/20 p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <div className="flex-1 min-w-[150px]">
        <Input
          type="email"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
          onBlur={addEmail}
          placeholder="Add guest email..."
          className="border-none shadow-none focus-visible:ring-0 h-8 p-0"
        />
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>
    </div>
  );
}