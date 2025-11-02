import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Course {
  id: number;
  title: string;
  category: string;
  description: string;
  duration: string;
  price: number;
  features: string[];
}

interface EnrollmentDialogProps {
  isOpen: boolean;
  selectedCourse: Course | null;
  formData: {
    full_name: string;
    phone: string;
    email: string;
    message: string;
  };
  onFormChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const EnrollmentDialog = ({ 
  isOpen, 
  selectedCourse, 
  formData, 
  onFormChange, 
  onSubmit,
  onClose 
}: EnrollmentDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Запись на курс</DialogTitle>
          <DialogDescription>
            {selectedCourse?.title}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="full_name">ФИО *</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => onFormChange('full_name', e.target.value)}
              required
              placeholder="Иванов Иван Иванович"
            />
          </div>

          <div>
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => onFormChange('phone', e.target.value)}
              required
              placeholder="+7 (900) 123-45-67"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onFormChange('email', e.target.value)}
              placeholder="example@mail.ru"
            />
          </div>

          <div>
            <Label htmlFor="message">Комментарий</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => onFormChange('message', e.target.value)}
              placeholder="Дополнительная информация..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            Отправить заявку
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentDialog;
