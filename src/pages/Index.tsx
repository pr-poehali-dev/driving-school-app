import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/home/Header';
import HeroSection from '@/components/home/HeroSection';
import CoursesSection from '@/components/home/CoursesSection';
import InstructorsSection from '@/components/home/InstructorsSection';
import ContactSection from '@/components/home/ContactSection';
import Footer from '@/components/home/Footer';
import EnrollmentDialog from '@/components/home/EnrollmentDialog';

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

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://functions.poehali.dev/b0d7aa51-2c0f-4f88-bd58-959eec7781db?table=enrollments', {
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
      <Header />
      <HeroSection />
      <CoursesSection courses={courses} onEnroll={handleEnroll} />
      <InstructorsSection instructors={instructors} />
      <ContactSection />
      <Footer />
      <EnrollmentDialog
        isOpen={isEnrollDialogOpen}
        selectedCourse={selectedCourse}
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
        onClose={() => setIsEnrollDialogOpen(false)}
      />
    </div>
  );
};

export default Index;
