import { useState } from 'react';
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

const Index = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      title: "Категория B (легковой автомобиль)",
      category: "B",
      description: "Полный курс обучения вождению легкового автомобиля с нуля до получения прав",
      duration: "3 месяца",
      price: 35000,
      features: [
        "130 часов теории",
        "56 часов практики",
        "Современные автомобили",
        "Помощь в ГИБДД"
      ]
    },
    {
      id: 2,
      title: "Категория A (мотоцикл)",
      category: "A",
      description: "Обучение вождению мотоцикла для начинающих и опытных водителей",
      duration: "2 месяца",
      price: 28000,
      features: [
        "Теория ПДД",
        "18 часов практики",
        "Современные мотоциклы",
        "Экипировка включена"
      ]
    },
    {
      id: 3,
      title: "Категория C (грузовой автомобиль)",
      category: "C",
      description: "Профессиональная подготовка водителей грузовых автомобилей",
      duration: "4 месяца",
      price: 45000,
      features: [
        "Расширенная теория",
        "72 часа практики",
        "Грузовики разных типов",
        "Допуск к экзамену"
      ]
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
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    message: ''
  });



  const handleEnroll = (course: Course) => {
    setSelectedCourse(course);
    setIsEnrollDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://functions.poehali.dev/127ff586-f47f-450b-81c4-f7bc88a67fea', {
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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось отправить заявку. Попробуйте позже.",
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

      <section className="relative py-20 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://cdn.poehali.dev/projects/075299df-7d74-4170-ac20-fbae5ea2763c/files/286ba1cd-2127-4307-a1d1-04f03b03d31b.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/90 to-background/80" />
        
        <div className="container mx-auto animate-fade-in relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="text-left">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
                Научим водить с нуля
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Профессиональное обучение с опытными инструкторами
              </p>
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 h-auto"
                onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Выбрать курс
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center p-6 border-2 bg-background/95 backdrop-blur-sm">
                <Icon name="Award" className="text-primary mx-auto mb-3" size={40} />
                <p className="text-4xl font-bold mb-2">15</p>
                <p className="text-sm text-muted-foreground">лет опыта</p>
              </Card>
              <Card className="text-center p-6 border-2 bg-background/95 backdrop-blur-sm">
                <Icon name="Users" className="text-primary mx-auto mb-3" size={40} />
                <p className="text-4xl font-bold mb-2">5000+</p>
                <p className="text-sm text-muted-foreground">выпускников</p>
              </Card>
              <Card className="text-center p-6 border-2 bg-background/95 backdrop-blur-sm">
                <Icon name="TrendingUp" className="text-primary mx-auto mb-3" size={40} />
                <p className="text-4xl font-bold mb-2">96%</p>
                <p className="text-sm text-muted-foreground">сдают с 1 раза</p>
              </Card>
              <Card className="text-center p-6 border-2 bg-background/95 backdrop-blur-sm">
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
            {courses.map((course) => {
              const getCategoryIcon = (category: string) => {
                if (category === 'B') return 'Car';
                if (category === 'A') return 'Bike';
                if (category === 'C') return 'Truck';
                return 'Car';
              };
              
              const getFeatureIcon = (feature: string) => {
                if (feature.includes('теори')) return 'BookOpen';
                if (feature.includes('практик')) return 'Clock';
                if (feature.includes('автомобил') || feature.includes('мотоцикл') || feature.includes('Грузовик')) return 'Settings';
                if (feature.includes('ГИБДД') || feature.includes('экзамен') || feature.includes('Экипировка')) return 'CheckCircle2';
                return 'CircleDot';
              };

              return (
                <Card key={course.id} className="hover-scale flex flex-col border-2 hover:border-primary/50 transition-all">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="text-base px-4 py-1.5 bg-primary text-white rounded-full">
                        Категория {course.category}
                      </Badge>
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Icon name={getCategoryIcon(course.category)} className="text-primary" size={28} />
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold mb-2">{course.title}</CardTitle>
                    <CardDescription className="text-sm">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 pt-0">
                    <div className="space-y-3 mb-6">
                      {course.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="bg-primary/10 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                            <Icon name={getFeatureIcon(feature)} className="text-primary" size={14} />
                          </div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-primary">{course.price.toLocaleString()} ₽</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon name="Clock" size={16} className="text-primary" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      onClick={() => handleEnroll(course)} 
                      className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-base font-semibold"
                    >
                      Записаться
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="instructors" className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Наши инструкторы</h2>
            <p className="text-xl text-muted-foreground">Профессионалы своего дела</p>
          </div>

          <div className="space-y-6 mb-12">
            {instructors.map((instructor) => (
              <Card key={instructor.id} className="hover-scale border-2 hover:border-primary/50 transition-all overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 md:p-12 flex items-center justify-center md:w-64 flex-shrink-0">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-2xl">
                        <Icon name="User" className="text-white" size={64} />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg border-2 border-primary">
                        <div className="flex items-center gap-1">
                          <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={16} />
                          <span className="text-sm font-bold text-foreground">{instructor.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="flex-1 p-8 md:p-10">
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{instructor.name}</h3>
                        <p className="text-lg text-primary font-semibold mb-4">{instructor.specialization}</p>
                        <p className="text-muted-foreground mb-6 leading-relaxed">{instructor.bio}</p>
                      </div>
                      
                      <div className="flex gap-4 flex-wrap">
                        <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2">
                          <Icon name="Award" className="text-primary" size={20} />
                          <div>
                            <p className="text-xs text-muted-foreground">Рейтинг</p>
                            <p className="text-lg font-bold">{instructor.rating}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2">
                          <Icon name="Calendar" className="text-primary" size={20} />
                          <div>
                            <p className="text-xs text-muted-foreground">Лет опыта</p>
                            <p className="text-lg font-bold">{instructor.experience}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
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