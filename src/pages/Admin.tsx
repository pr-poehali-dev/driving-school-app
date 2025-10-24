import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: number;
  title: string;
  category: string;
  description: string;
  duration: string;
  price: number;
  features: string[];
}

interface Instructor {
  id: number;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  bio: string;
}

interface Enrollment {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  course_id: number;
  message: string;
  status: string;
  created_at: string;
}

const API_URL = 'https://functions.poehali.dev/b0d7aa51-2c0f-4f88-bd58-959eec7781db';
const ADMIN_PASSWORD = 'AutoProfi2024!';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingTable, setEditingTable] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('adminAuth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      toast({
        title: "Успешно",
        description: "Добро пожаловать в админ-панель"
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Неверный пароль",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    toast({
      title: "Выход",
      description: "Вы вышли из системы"
    });
  };

  const fetchData = async (table: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?table=${table}`);
      const data = await response.json();
      
      if (table === 'courses') setCourses(data);
      if (table === 'instructors') setInstructors(data);
      if (table === 'enrollments') setEnrollments(data);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (table: string, id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту запись?')) return;
    
    try {
      await fetch(`${API_URL}?table=${table}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      
      toast({
        title: "Успешно",
        description: "Запись удалена"
      });
      
      fetchData(table);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить запись",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (table: string, item: any) => {
    setEditingTable(table);
    setEditingItem({ ...item });
    setEditDialogOpen(true);
  };

  const openCreateDialog = (table: string) => {
    setEditingTable(table);
    if (table === 'courses') {
      setEditingItem({ title: '', category: '', description: '', duration: '', price: 0, features: [] });
    } else if (table === 'instructors') {
      setEditingItem({ name: '', specialization: '', experience: 0, rating: 0, bio: '' });
    } else if (table === 'enrollments') {
      setEditingItem({ full_name: '', phone: '', email: '', course_id: null, message: '', status: 'new' });
    }
    setEditDialogOpen(true);
  };

  const saveRecord = async () => {
    try {
      const method = editingItem.id ? 'PUT' : 'POST';
      const url = editingItem.id ? `${API_URL}?table=${editingTable}` : `${API_URL}?table=${editingTable}`;
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      
      toast({
        title: "Успешно",
        description: editingItem.id ? "Запись обновлена" : "Запись создана"
      });
      
      setEditDialogOpen(false);
      setEditingItem(null);
      fetchData(editingTable);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить запись",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchData('courses');
    fetchData('instructors');
    fetchData('enrollments');
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-muted to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
              <Icon name="Lock" className="text-white" size={32} />
            </div>
            <CardTitle className="text-2xl">Вход в админ-панель</CardTitle>
            <CardDescription>Введите пароль для доступа к системе управления</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  required
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                <Icon name="LogIn" size={16} className="mr-2" />
                Войти
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/'}
              >
                <Icon name="Home" size={16} className="mr-2" />
                На главную
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Icon name="Shield" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Админ-панель</h1>
                <p className="text-xs text-muted-foreground">Управление данными автошколы</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleLogout} variant="outline">
                <Icon name="LogOut" size={16} className="mr-2" />
                Выйти
              </Button>
              <Button onClick={() => window.location.href = '/'} variant="outline">
                <Icon name="Home" size={16} className="mr-2" />
                На главную
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="enrollments" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="enrollments" onClick={() => fetchData('enrollments')}>
              <Icon name="Users" size={16} className="mr-2" />
              Заявки
            </TabsTrigger>
            <TabsTrigger value="courses" onClick={() => fetchData('courses')}>
              <Icon name="BookOpen" size={16} className="mr-2" />
              Курсы
            </TabsTrigger>
            <TabsTrigger value="instructors" onClick={() => fetchData('instructors')}>
              <Icon name="GraduationCap" size={16} className="mr-2" />
              Инструкторы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="enrollments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Заявки на обучение</CardTitle>
                  <CardDescription>Всего заявок: {enrollments.length}</CardDescription>
                </div>
                <Button onClick={() => openCreateDialog('enrollments')} size="sm">
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
                        {enrollments.map((enrollment) => (
                          <TableRow key={enrollment.id}>
                            <TableCell className="font-medium">{enrollment.id}</TableCell>
                            <TableCell>{enrollment.full_name}</TableCell>
                            <TableCell>{enrollment.phone}</TableCell>
                            <TableCell>{enrollment.email || '—'}</TableCell>
                            <TableCell>{enrollment.course_id}</TableCell>
                            <TableCell className="max-w-xs truncate">{enrollment.message || '—'}</TableCell>
                            <TableCell>
                              <Badge variant={enrollment.status === 'new' ? 'default' : 'secondary'}>
                                {enrollment.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(enrollment.created_at).toLocaleDateString('ru-RU')}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditDialog('enrollments', enrollment)}
                                >
                                  <Icon name="Pencil" size={14} />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteRecord('enrollments', enrollment.id)}
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
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Курсы обучения</CardTitle>
                  <CardDescription>Всего курсов: {courses.length}</CardDescription>
                </div>
                <Button onClick={() => openCreateDialog('courses')} size="sm">
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
                                  onClick={() => openEditDialog('courses', course)}
                                >
                                  <Icon name="Pencil" size={14} />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteRecord('courses', course.id)}
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
          </TabsContent>

          <TabsContent value="instructors">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Инструкторы</CardTitle>
                  <CardDescription>Всего инструкторов: {instructors.length}</CardDescription>
                </div>
                <Button onClick={() => openCreateDialog('instructors')} size="sm">
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
                                  onClick={() => openEditDialog('instructors', instructor)}
                                >
                                  <Icon name="Pencil" size={14} />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteRecord('instructors', instructor.id)}
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
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem?.id ? 'Редактирование записи' : 'Создание записи'}
            </DialogTitle>
            <DialogDescription>
              Таблица: {editingTable}
            </DialogDescription>
          </DialogHeader>
          
          {editingTable === 'courses' && editingItem && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Название курса</Label>
                <Input
                  id="title"
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Категория</Label>
                <Input
                  id="category"
                  value={editingItem.category || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="duration">Длительность</Label>
                <Input
                  id="duration"
                  value={editingItem.duration || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, duration: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="price">Цена (₽)</Label>
                <Input
                  id="price"
                  type="number"
                  value={editingItem.price || 0}
                  onChange={(e) => setEditingItem({ ...editingItem, price: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="features">Особенности (через запятую)</Label>
                <Textarea
                  id="features"
                  value={Array.isArray(editingItem.features) ? editingItem.features.join(', ') : ''}
                  onChange={(e) => setEditingItem({ ...editingItem, features: e.target.value.split(',').map(f => f.trim()) })}
                  rows={3}
                />
              </div>
            </div>
          )}

          {editingTable === 'instructors' && editingItem && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">ФИО инструктора</Label>
                <Input
                  id="name"
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="specialization">Специализация</Label>
                <Input
                  id="specialization"
                  value={editingItem.specialization || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, specialization: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="experience">Опыт (лет)</Label>
                <Input
                  id="experience"
                  type="number"
                  value={editingItem.experience || 0}
                  onChange={(e) => setEditingItem({ ...editingItem, experience: parseInt(e.target.value) || 0 })}
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
                  onChange={(e) => setEditingItem({ ...editingItem, rating: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="bio">Биография</Label>
                <Textarea
                  id="bio"
                  value={editingItem.bio || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, bio: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
          )}

          {editingTable === 'enrollments' && editingItem && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name">ФИО</Label>
                <Input
                  id="full_name"
                  value={editingItem.full_name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, full_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  value={editingItem.phone || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editingItem.email || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="course_id">ID курса</Label>
                <Input
                  id="course_id"
                  type="number"
                  value={editingItem.course_id || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, course_id: parseInt(e.target.value) || null })}
                />
              </div>
              <div>
                <Label htmlFor="message">Сообщение</Label>
                <Textarea
                  id="message"
                  value={editingItem.message || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, message: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="status">Статус</Label>
                <Input
                  id="status"
                  value={editingItem.status || 'new'}
                  onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={saveRecord} className="bg-primary hover:bg-primary/90">
              <Icon name="Save" size={16} className="mr-2" />
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;