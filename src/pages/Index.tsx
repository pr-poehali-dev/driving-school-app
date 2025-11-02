import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

const API_URL = 'https://functions.poehali.dev/b0d7aa51-2c0f-4f88-bd58-959eec7781db';

const Index = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_URL}?table=courses`);
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    const fetchInstructors = async () => {
      try {
        const response = await fetch(`${API_URL}?table=instructors`);
        const data = await response.json();
        setInstructors(data);
      } catch (error) {
        console.error('Failed to fetch instructors:', error);
      }
    };

    fetchCourses();
    fetchInstructors();
  }, []);

  const handleEnroll = (course: Course) => {
    setSelectedCourse(course);
    setIsEnrollDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}?table=enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          course_id: selectedCourse?.id
        })
      });

      if (response.ok) {
        toast({
          title: "Заявка отправлена!",
          description: "Мы свяжемся с вами в ближайшее время.",
        });

        setFormData({ full_name: '', phone: '', email: '', message: '' });
        setIsEnrollDialogOpen(false);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте позже.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Icon name="Car" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">АвтоПрофи</h1>
                <p className="text-xs text-muted-foreground">Ваш путь к водительским правам</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#courses" className="text-sm font-medium hover:text-primary transition-colors">Курсы</a>
              <a href="#instructors" className="text-sm font-medium hover:text-primary transition-colors">Инструкторы</a>
              <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Контакты</a>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/admin'}
              >
                <Icon name="Settings" size={16} className="mr-2" />
                Админ
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto animate-fade-in">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="text-left">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
                Научим водить с нуля
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Современные автомобили, опытные инструкторы и индивидуальный подход к каждому ученику. 
                Получите права быстро и уверенно!
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 h-auto"
                  onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Выбрать курс
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg px-8 py-6 h-auto"
                  onClick={() => {
                    setSelectedCourse({
                      id: 0,
                      title: 'Пробное занятие',
                      category: 'Пробный урок',
                      description: 'Бесплатное пробное занятие',
                      duration: '45 минут',
                      price: 0,
                      features: []
                    });
                    setIsEnrollDialogOpen(true);
                  }}
                >
                  Пробный урок
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center p-6 border-2">
                <Icon name="Award" className="text-primary mx-auto mb-3" size={40} />
                <p className="text-4xl font-bold mb-2">15</p>
                <p className="text-sm text-muted-foreground">лет опыта</p>
              </Card>
              <Card className="text-center p-6 border-2">
                <Icon name="Users" className="text-primary mx-auto mb-3" size={40} />
                <p className="text-4xl font-bold mb-2">5000+</p>
                <p className="text-sm text-muted-foreground">выпускников</p>
              </Card>
              <Card className="text-center p-6 border-2">
                <Icon name="TrendingUp" className="text-primary mx-auto mb-3" size={40} />
                <p className="text-4xl font-bold mb-2">96%</p>
                <p className="text-sm text-muted-foreground">сдают с 1 раза</p>
              </Card>
              <Card className="text-center p-6 border-2">
                <Icon name="Car" className="text-primary mx-auto mb-3" size={40} />
                <p className="text-4xl font-bold mb-2">20+</p>
                <p className="text-sm text-muted-foreground">автомобилей</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="courses" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Наши курсы</h2>
            <p className="text-muted-foreground">Выберите подходящую категорию обучения</p>
          </div>

          <Card className="mb-12 border-2 border-primary overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-8 text-center">
              <h2 className="text-4xl font-bold mb-3">Первое занятие БЕСПЛАТНО</h2>
              <p className="text-xl opacity-90">Познакомьтесь с вождением и выберите свой курс</p>
            </div>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-muted/30 rounded-lg border-2 border-muted">
                  <Icon name="Clock" className="text-primary mx-auto mb-3" size={40} />
                  <p className="font-bold text-lg mb-1">45 минут</p>
                  <p className="text-sm text-muted-foreground">За рулем с инструктором</p>
                </div>
                <div className="text-center p-6 bg-muted/30 rounded-lg border-2 border-muted">
                  <Icon name="MapPin" className="text-primary mx-auto mb-3" size={40} />
                  <p className="font-bold text-lg mb-1">Удобное место</p>
                  <p className="text-sm text-muted-foreground">Встреча в вашем районе</p>
                </div>
                <div className="text-center p-6 bg-muted/30 rounded-lg border-2 border-muted">
                  <Icon name="UserCheck" className="text-primary mx-auto mb-3" size={40} />
                  <p className="font-bold text-lg mb-1">Опытный инструктор</p>
                  <p className="text-sm text-muted-foreground">Профессиональное обучение</p>
                </div>
              </div>
              <div className="text-center">
                <Button 
                  size="lg" 
                  className="text-xl py-7 px-12 shadow-lg hover:shadow-xl transition-shadow"
                  onClick={() => {
                    setSelectedCourse({
                      id: 0,
                      title: 'Пробное занятие',
                      category: 'Пробный урок',
                      description: 'Бесплатное пробное занятие',
                      duration: '45 минут',
                      price: 0,
                      features: []
                    });
                    setIsEnrollDialogOpen(true);
                  }}
                >
                  Записаться на пробное занятие
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card key={course.id} className="hover-scale flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="text-lg px-4 py-1 bg-primary">
                      Категория {course.category}
                    </Badge>
                    <Icon name="Car" className="text-primary" size={32} />
                  </div>
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-3 mb-4">
                    {course.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Icon name="CheckCircle2" className="text-primary mt-1 flex-shrink-0" size={18} />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold gradient-text">{course.price.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Clock" size={16} />
                    <span>{course.duration}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleEnroll(course)} 
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Записаться
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="instructors" className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Наши инструкторы</h2>
            <p className="text-xl text-muted-foreground">Профессионалы своего дела</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {instructors.map((instructor) => (
              <Card key={instructor.id} className="text-center hover-scale border-2 hover:shadow-2xl transition-all">
                <CardContent className="pt-10 pb-8">
                  <div className="relative w-28 h-28 mx-auto mb-6">
                    <div className="absolute inset-0 bg-primary/20 rounded-full"></div>
                    <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                      <Icon name="User" className="text-primary" size={56} />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-1">{instructor.name}</h3>
                  <p className="text-sm text-primary font-semibold mb-6">{instructor.specialization}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={16} />
                        <span className="text-xl font-bold">{instructor.rating}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Рейтинг</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xl font-bold mb-1">{instructor.experience}</p>
                      <p className="text-xs text-muted-foreground">Лет опыта</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{instructor.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-primary">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
                <Icon name="Calendar" className="text-primary mb-4" size={48} />
                <h3 className="text-xl font-bold mb-3">Пробное занятие бесплатно</h3>
                <p className="text-muted-foreground mb-5">Познакомьтесь с инструктором и оцените качество обучения</p>
                <Button 
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    setSelectedCourse({
                      id: 0,
                      title: 'Пробное занятие',
                      category: 'Пробный урок',
                      description: 'Познакомьтесь с инструктором бесплатно',
                      duration: '45 минут',
                      price: 0,
                      features: []
                    });
                    setIsEnrollDialogOpen(true);
                  }}
                >
                  Записаться на пробное
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-primary">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
                <Icon name="MessageCircle" className="text-primary mb-4" size={48} />
                <h3 className="text-xl font-bold mb-3">Консультация по выбору курса</h3>
                <p className="text-muted-foreground mb-5">Поможем подобрать программу обучения под ваши цели</p>
                <Button 
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    setSelectedCourse({
                      id: 0,
                      title: 'Консультация',
                      category: 'Консультация',
                      description: 'Бесплатная консультация по выбору курса',
                      duration: '30 минут',
                      price: 0,
                      features: []
                    });
                    setIsEnrollDialogOpen(true);
                  }}
                >
                  Получить консультацию
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-gradient-to-r from-secondary to-secondary/90 py-12 px-4 mt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Icon name="Car" className="text-white" size={20} />
                </div>
                <h3 className="text-xl font-bold">АвтоПрофи</h3>
              </div>
              <p className="text-sm text-white/80">Профессиональное обучение вождению с 2010 года</p>
            </div>
            
            <div className="text-white">
              <h4 className="font-bold mb-3">Контакты</h4>
              <div className="space-y-2 text-sm text-white/80">
                <p>+7 (495) 123-45-67</p>
                <p>info@autoprofi.ru</p>
                <p>Москва, ул. Примерная, 123</p>
              </div>
            </div>
            
            <div className="text-white">
              <h4 className="font-bold mb-3">Режим работы</h4>
              <div className="space-y-2 text-sm text-white/80">
                <p>Пн-Пт: 9:00 - 21:00</p>
                <p>Сб-Вс: 10:00 - 18:00</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-6 text-center">
            <p className="text-white/60 text-sm">© 2024 АвтоПрофи. Все права защищены.</p>
          </div>
        </div>
      </footer>

      <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Записаться на курс</DialogTitle>
            <DialogDescription>
              {selectedCourse?.title} - {selectedCourse?.price.toLocaleString()} ₽
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="full_name">Ваше имя *</Label>
              <Input
                id="full_name"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Иван Иванов"
              />
            </div>
            <div>
              <Label htmlFor="phone">Телефон *</Label>
              <Input
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+7 (999) 123-45-67"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@mail.ru"
              />
            </div>
            <div>
              <Label htmlFor="message">Комментарий</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Дополнительная информация"
                rows={3}
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              Отправить заявку
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;