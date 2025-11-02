import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import LoginForm from '@/components/admin/LoginForm';
import EnrollmentsTab from '@/components/admin/EnrollmentsTab';
import CoursesTab from '@/components/admin/CoursesTab';
import InstructorsTab from '@/components/admin/InstructorsTab';
import EditDialog from '@/components/admin/EditDialog';
import { Course, Instructor, Enrollment } from '@/components/admin/types';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      title: "Категория B (легковой автомобиль)",
      category: "B",
      description: "Полный курс обучения вождению легкового автомобиля с нуля до получения прав",
      duration: "3 месяца",
      price: 35000,
      features: ["130 часов теории", "56 часов практики", "Современные автомобили", "Помощь в ГИБДД"]
    },
    {
      id: 2,
      title: "Категория A (мотоцикл)",
      category: "A",
      description: "Обучение вождению мотоцикла для начинающих и опытных водителей",
      duration: "2 месяца",
      price: 28000,
      features: ["Теория ПДД", "18 часов практики", "Современные мотоциклы", "Экипировка включена"]
    },
    {
      id: 3,
      title: "Категория C (грузовой автомобиль)",
      category: "C",
      description: "Профессиональная подготовка водителей грузовых автомобилей",
      duration: "4 месяца",
      price: 45000,
      features: ["Расширенная теория", "72 часа практики", "Грузовики разных типов", "Допуск к экзамену"]
    }
  ]);
  const [instructors, setInstructors] = useState<Instructor[]>([
    {
      id: 1,
      name: "Иванов Сергей Петрович",
      specialization: "Категории B, C",
      experience: 15,
      rating: 4.9,
      bio: "Мастер производственного обучения высшей категории. Более 1000 выпускников."
    },
    {
      id: 2,
      name: "Петрова Анна Викторовна",
      specialization: "Категория B",
      experience: 8,
      rating: 4.8,
      bio: "Терпеливый инструктор с индивидуальным подходом к каждому ученику."
    },
    {
      id: 3,
      name: "Смирнов Дмитрий Александрович",
      specialization: "Категории A, B",
      experience: 12,
      rating: 4.95,
      bio: "Специалист по обучению вождению мотоциклов и автомобилей."
    }
  ]);
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

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLoginError = (message: string) => {
    toast({
      title: "Ошибка",
      description: message,
      variant: "destructive"
    });
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
      const response = await fetch(`https://functions.poehali.dev/b0d7aa51-2c0f-4f88-bd58-959eec7781db?table=${table}`);
      const data = await response.json();
      
      if (table === 'courses') {
        setCourses(data);
      } else if (table === 'instructors') {
        setInstructors(data);
      } else if (table === 'enrollments') {
        setEnrollments(data);
      }
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
      const response = await fetch(`https://functions.poehali.dev/b0d7aa51-2c0f-4f88-bd58-959eec7781db?table=${table}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      
      if (response.ok) {
        if (table === 'courses') {
          setCourses(courses.filter(c => c.id !== id));
        } else if (table === 'instructors') {
          setInstructors(instructors.filter(i => i.id !== id));
        } else if (table === 'enrollments') {
          setEnrollments(enrollments.filter(e => e.id !== id));
        }
        
        toast({
          title: "Успешно",
          description: "Запись удалена"
        });
      }
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
      const response = await fetch(`https://functions.poehali.dev/b0d7aa51-2c0f-4f88-bd58-959eec7781db?table=${editingTable}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      
      if (response.ok) {
        if (editingItem.id) {
          if (editingTable === 'courses') {
            setCourses(courses.map(c => c.id === editingItem.id ? editingItem : c));
          } else if (editingTable === 'instructors') {
            setInstructors(instructors.map(i => i.id === editingItem.id ? editingItem : i));
          } else if (editingTable === 'enrollments') {
            setEnrollments(enrollments.map(e => e.id === editingItem.id ? editingItem : e));
          }
          toast({
            title: "Успешно",
            description: "Запись обновлена"
          });
        } else {
          const data = await response.json();
          const newItem = { ...editingItem, id: data.id };
          
          if (editingTable === 'courses') {
            setCourses([...courses, newItem]);
          } else if (editingTable === 'instructors') {
            setInstructors([...instructors, newItem]);
          } else if (editingTable === 'enrollments') {
            setEnrollments([...enrollments, newItem]);
          }
          
          toast({
            title: "Успешно",
            description: "Запись создана"
          });
        }
        
        setEditDialogOpen(false);
        setEditingItem(null);
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить запись",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.setItem('adminAuth', 'true');
      fetchData('enrollments');
      fetchData('courses');
      fetchData('instructors');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} onError={handleLoginError} />;
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
            <EnrollmentsTab
              enrollments={enrollments}
              loading={loading}
              onEdit={(enrollment) => openEditDialog('enrollments', enrollment)}
              onDelete={(id) => deleteRecord('enrollments', id)}
              onCreate={() => openCreateDialog('enrollments')}
            />
          </TabsContent>

          <TabsContent value="courses">
            <CoursesTab
              courses={courses}
              loading={loading}
              onEdit={(course) => openEditDialog('courses', course)}
              onDelete={(id) => deleteRecord('courses', id)}
              onCreate={() => openCreateDialog('courses')}
            />
          </TabsContent>

          <TabsContent value="instructors">
            <InstructorsTab
              instructors={instructors}
              loading={loading}
              onEdit={(instructor) => openEditDialog('instructors', instructor)}
              onDelete={(id) => deleteRecord('instructors', id)}
              onCreate={() => openCreateDialog('instructors')}
            />
          </TabsContent>
        </Tabs>
      </div>

      <EditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        editingTable={editingTable}
        editingItem={editingItem}
        onItemChange={setEditingItem}
        onSave={saveRecord}
      />
    </div>
  );
};

export default Admin;