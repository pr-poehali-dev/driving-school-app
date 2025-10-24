import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import { Instructor } from './types';

interface InstructorsTabProps {
  instructors: Instructor[];
  loading: boolean;
  onEdit: (instructor: Instructor) => void;
  onDelete: (id: number) => void;
  onCreate: () => void;
}

const InstructorsTab = ({ instructors, loading, onEdit, onDelete, onCreate }: InstructorsTabProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Инструкторы</CardTitle>
          <CardDescription>Всего инструкторов: {instructors.length}</CardDescription>
        </div>
        <Button onClick={onCreate} size="sm">
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить инструктора
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Icon name="Loader2" className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>ФИО</TableHead>
                  <TableHead>Специализация</TableHead>
                  <TableHead>Опыт (лет)</TableHead>
                  <TableHead>Рейтинг</TableHead>
                  <TableHead>Биография</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instructors.map((instructor) => (
                  <TableRow key={instructor.id}>
                    <TableCell className="font-medium">{instructor.id}</TableCell>
                    <TableCell>{instructor.name}</TableCell>
                    <TableCell>{instructor.specialization}</TableCell>
                    <TableCell>{instructor.experience}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={14} />
                        <span className="font-semibold">{instructor.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">{instructor.bio}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(instructor)}
                        >
                          <Icon name="Pencil" size={14} />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(instructor.id)}
                        >
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InstructorsTab;
