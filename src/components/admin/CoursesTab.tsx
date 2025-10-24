import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Course } from './types';

interface CoursesTabProps {
  courses: Course[];
  loading: boolean;
  onEdit: (course: Course) => void;
  onDelete: (id: number) => void;
  onCreate: () => void;
}

const CoursesTab = ({ courses, loading, onEdit, onDelete, onCreate }: CoursesTabProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Курсы обучения</CardTitle>
          <CardDescription>Всего курсов: {courses.length}</CardDescription>
        </div>
        <Button onClick={onCreate} size="sm">
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить курс
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
                  <TableHead>Название</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Длительность</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead>Особенности</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.id}</TableCell>
                    <TableCell className="max-w-xs">{course.title}</TableCell>
                    <TableCell>
                      <Badge className="bg-gradient-to-r from-primary to-secondary">
                        {course.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{course.description}</TableCell>
                    <TableCell>{course.duration}</TableCell>
                    <TableCell className="font-semibold">{course.price.toLocaleString()} ₽</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {course.features?.map((feature, idx) => (
                          <div key={idx} className="text-sm text-muted-foreground">• {feature}</div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(course)}
                        >
                          <Icon name="Pencil" size={14} />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(course.id)}
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

export default CoursesTab;
