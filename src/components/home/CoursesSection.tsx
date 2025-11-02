import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Course {
  id: number;
  title: string;
  category: string;
  description: string;
  duration: string;
  price: number;
  features: string[];
}

interface CoursesSectionProps {
  courses: Course[];
  onEnroll: (course: Course) => void;
}

const CoursesSection = ({ courses, onEnroll }: CoursesSectionProps) => {
  return (
    <section id="courses" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Наши курсы</h2>
          <p className="text-muted-foreground text-lg">
            Выберите подходящую категорию для обучения
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow border-2">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {course.category}
                  </Badge>
                  <Icon name="BookOpen" className="text-primary" size={24} />
                </div>
                <CardTitle className="text-xl">{course.title}</CardTitle>
                <CardDescription className="text-sm">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Clock" size={16} className="text-muted-foreground" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Wallet" size={16} className="text-muted-foreground" />
                    <span className="font-bold text-lg">{course.price.toLocaleString()} ₽</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium mb-2">Что включено:</p>
                    <ul className="space-y-1">
                      {course.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Icon name="Check" size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => onEnroll(course)}
                >
                  Записаться
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
