import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Header = () => {
  return (
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
  );
};

export default Header;
