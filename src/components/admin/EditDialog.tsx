import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface EditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTable: string;
  editingItem: any;
  onItemChange: (item: any) => void;
  onSave: () => void;
}

const EditDialog = ({ open, onOpenChange, editingTable, editingItem, onItemChange, onSave }: EditDialogProps) => {
  if (!editingItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingItem?.id ? 'Редактирование записи' : 'Создание записи'}
          </DialogTitle>
          <DialogDescription>
            Таблица: {editingTable}
          </DialogDescription>
        </DialogHeader>
        
        {editingTable === 'courses' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Название курса</Label>
              <Input
                id="title"
                value={editingItem.title || ''}
                onChange={(e) => onItemChange({ ...editingItem, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="category">Категория</Label>
              <Input
                id="category"
                value={editingItem.category || ''}
                onChange={(e) => onItemChange({ ...editingItem, category: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={editingItem.description || ''}
                onChange={(e) => onItemChange({ ...editingItem, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="duration">Длительность</Label>
              <Input
                id="duration"
                value={editingItem.duration || ''}
                onChange={(e) => onItemChange({ ...editingItem, duration: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="price">Цена (₽)</Label>
              <Input
                id="price"
                type="number"
                value={editingItem.price || 0}
                onChange={(e) => onItemChange({ ...editingItem, price: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="features">Особенности (через запятую)</Label>
              <Textarea
                id="features"
                value={Array.isArray(editingItem.features) ? editingItem.features.join(', ') : ''}
                onChange={(e) => onItemChange({ ...editingItem, features: e.target.value.split(',').map(f => f.trim()) })}
                rows={3}
              />
            </div>
          </div>
        )}

        {editingTable === 'instructors' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">ФИО инструктора</Label>
              <Input
                id="name"
                value={editingItem.name || ''}
                onChange={(e) => onItemChange({ ...editingItem, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="specialization">Специализация</Label>
              <Input
                id="specialization"
                value={editingItem.specialization || ''}
                onChange={(e) => onItemChange({ ...editingItem, specialization: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="experience">Опыт (лет)</Label>
              <Input
                id="experience"
                type="number"
                value={editingItem.experience || 0}
                onChange={(e) => onItemChange({ ...editingItem, experience: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="rating">Рейтинг (0-5)</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={editingItem.rating || 0}
                onChange={(e) => onItemChange({ ...editingItem, rating: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="bio">Биография</Label>
              <Textarea
                id="bio"
                value={editingItem.bio || ''}
                onChange={(e) => onItemChange({ ...editingItem, bio: e.target.value })}
                rows={4}
              />
            </div>
          </div>
        )}

        {editingTable === 'enrollments' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="full_name">ФИО</Label>
              <Input
                id="full_name"
                value={editingItem.full_name || ''}
                onChange={(e) => onItemChange({ ...editingItem, full_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                value={editingItem.phone || ''}
                onChange={(e) => onItemChange({ ...editingItem, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editingItem.email || ''}
                onChange={(e) => onItemChange({ ...editingItem, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="course_id">ID курса</Label>
              <Input
                id="course_id"
                type="number"
                value={editingItem.course_id || ''}
                onChange={(e) => onItemChange({ ...editingItem, course_id: parseInt(e.target.value) || null })}
              />
            </div>
            <div>
              <Label htmlFor="message">Сообщение</Label>
              <Textarea
                id="message"
                value={editingItem.message || ''}
                onChange={(e) => onItemChange({ ...editingItem, message: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="status">Статус</Label>
              <Input
                id="status"
                value={editingItem.status || 'new'}
                onChange={(e) => onItemChange({ ...editingItem, status: e.target.value })}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={onSave} className="bg-primary hover:bg-primary/90">
            <Icon name="Save" size={16} className="mr-2" />
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
