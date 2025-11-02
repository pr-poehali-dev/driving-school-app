import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Instructor {
  id: number;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  bio: string;
}

interface InstructorsSectionProps {
  instructors: Instructor[];
}

const InstructorsSection = ({ instructors }: InstructorsSectionProps) => {
  return (
    <section id="instructors" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Наши инструкторы</h2>
          <p className="text-muted-foreground text-lg">
            Опытные профессионалы с лицензиями
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {instructors.map((instructor) => (
            <Card key={instructor.id} className="hover:shadow-lg transition-shadow border-2">
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="User" className="text-primary" size={32} />
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Icon name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                    {instructor.rating}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{instructor.name}</CardTitle>
                <CardDescription>
                  {instructor.specialization}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Award" size={16} className="text-muted-foreground" />
                    <span>{instructor.experience} лет опыта</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {instructor.bio}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstructorsSection;
