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
            <nav className="hidden md:flex gap-6">
              <a href="#courses" className="text-sm font-medium hover:text-primary transition-colors">Курсы</a>
              <a href="#instructors" className="text-sm font-medium hover:text-primary transition-colors">Инструкторы</a>
              <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Контакты</a>
              <a href="/admin" className="text-sm font-medium hover:text-primary transition-colors">Админ-панель</a>
            </nav>
          </div>
        </div>
      </header>

      <section className="py-20 px-4 bg-muted">
        <div className="container mx-auto text-center animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-black">
            Научим водить с нуля
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Современные автомобили, опытные инструкторы и индивидуальный подход к каждому ученику
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 hover-scale text-2xl px-12 py-8 h-auto" onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}>
              Выбрать курс
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            <Card className="hover-scale border-2 hover:border-primary transition-all">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon name="Award" className="text-primary" size={28} />
                </div>
                <CardTitle className="text-2xl">15 лет</CardTitle>
                <CardDescription>на рынке обучения</CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover-scale border-2 hover:border-secondary transition-all">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon name="Users" className="text-secondary" size={28} />
                </div>
                <CardTitle className="text-2xl">5000+</CardTitle>
                <CardDescription>выпускников</CardDescription>
              </CardHeader>
            </Card>
            <Card className="hover-scale border-2 hover:border-primary transition-all">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon name="TrendingUp" className="text-primary" size={28} />
                </div>
                <CardTitle className="text-2xl">96%</CardTitle>
                <CardDescription>сдают с первого раза</CardDescription>
              </CardHeader>
            </Card>
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
                <div className="text-center p-6 bg-muted/30 rounded-lg">
                  <Icon name="Clock" className="text-primary mx-auto mb-3" size={40} />
                  <p className="font-bold text-lg mb-1">45 минут</p>
                  <p className="text-sm text-muted-foreground">За рулем с инструктором</p>
                </div>
                <div className="text-center p-6 bg-muted/30 rounded-lg">
                  <Icon name="MapPin" className="text-primary mx-auto mb-3" size={40} />
                  <p className="font-bold text-lg mb-1">Удобное место</p>
                  <p className="text-sm text-muted-foreground">Встреча в вашем районе</p>
                </div>
                <div className="text-center p-6 bg-muted/30 rounded-lg">
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

      <section id="instructors" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Наши инструкторы</h2>
            <p className="text-muted-foreground">Профессионалы с многолетним опытом</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {instructors.map((instructor) => (
              <Card key={instructor.id} className="hover-scale">
                <CardHeader>
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Icon name="UserCircle" className="text-primary" size={64} />
                  </div>
                  <CardTitle className="text-center">{instructor.name}</CardTitle>
                  <CardDescription className="text-center">{instructor.specialization}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex justify-center items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={18} />
                      <span className="font-semibold">{instructor.rating}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {instructor.experience} лет опыта
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{instructor.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Остались вопросы?</CardTitle>
              <CardDescription>Свяжитесь с нами любым удобным способом</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                  <Icon name="Phone" className="text-primary mb-3" size={32} />
                  <h3 className="font-semibold mb-2">Телефон</h3>
                  <p className="text-sm text-muted-foreground">+7 (495) 123-45-67</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                  <Icon name="Mail" className="text-primary mb-3" size={32} />
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-sm text-muted-foreground">info@autoprofi.ru</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
                  <Icon name="MapPin" className="text-primary mb-3" size={32} />
                  <h3 className="font-semibold mb-2">Адрес</h3>
                  <p className="text-sm text-muted-foreground">Москва, ул. Примерная, 123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-secondary py-8 px-4 mt-20">
        <div className="container mx-auto text-center">
          <p className="text-white">© 2024 АвтоПрофи. Все права защищены.</p>
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