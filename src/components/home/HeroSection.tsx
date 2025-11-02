import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const HeroSection = () => {
  return (
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
  );
};

export default HeroSection;
