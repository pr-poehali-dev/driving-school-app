import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Enrollment } from './types';

interface EnrollmentsTabProps {
  enrollments: Enrollment[];
  loading: boolean;
  onEdit: (enrollment: Enrollment) => void;
  onDelete: (id: number) => void;
  onCreate: () => void;
}

const EnrollmentsTab = ({ enrollments, loading, onEdit, onDelete, onCreate }: EnrollmentsTabProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Заявки на обучение</CardTitle>
          <CardDescription>Всего заявок: {enrollments.length}</CardDescription>
        </div>
        <Button onClick={onCreate} size="sm">
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить заявку
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
                  <TableHead>Телефон</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Курс ID</TableHead>
                  <TableHead>Комментарий</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      Заявок пока нет
                    </TableCell>
                  </TableRow>
                ) : (
                  enrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell className="font-medium">{enrollment.id}</TableCell>
                      <TableCell>{enrollment.full_name}</TableCell>
                      <TableCell>{enrollment.phone}</TableCell>
                      <TableCell>{enrollment.email || '—'}</TableCell>
                      <TableCell>{enrollment.course_id || '—'}</TableCell>
                      <TableCell className="max-w-xs truncate">{enrollment.message || '—'}</TableCell>
                      <TableCell>
                        <Badge variant={enrollment.status === 'new' ? 'default' : 'secondary'}>
                          {enrollment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{enrollment.created_at ? new Date(enrollment.created_at).toLocaleDateString('ru-RU') : '—'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(enrollment)}
                          >
                            <Icon name="Pencil" size={14} />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDelete(enrollment.id!)}
                          >
                            <Icon name="Trash2" size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnrollmentsTab;