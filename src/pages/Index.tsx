import { useState, useEffect } from 'react';
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
    const fetchData = async () => {
      try {
        const [coursesRes, instructorsRes] = await Promise.all([
          fetch('https://functions.poehali.dev/b0d7aa51-2c0f-4f88-bd58-959eec7781db?table=courses'),
          fetch('https://functions.poehali.dev/b0d7aa51-2c0f-4f88-bd58-959eec7781db?table=instructors')
        ]);

        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          setCourses(coursesData);
        }

        if (instructorsRes.ok) {
          const instructorsData = await instructorsRes.json();
          setInstructors(instructorsData);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    fetchData();
  }, []);

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