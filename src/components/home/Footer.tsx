import Icon from '@/components/ui/icon';

const Footer = () => {
  return (
    <footer className="bg-muted/50 py-8 px-4 border-t">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Icon name="Car" className="text-white" size={20} />
              </div>
              <span className="font-bold text-lg">АвтоПрофи</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Профессиональное обучение вождению с 2009 года
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Контакты</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>+7 (900) 123-45-67</p>
              <p>info@avtoprofi.ru</p>
              <p>г. Москва, ул. Примерная, д. 1</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Режим работы</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Пн-Пт: 9:00 - 20:00</p>
              <p>Сб-Вс: 10:00 - 18:00</p>
            </div>
          </div>
        </div>

        <div className="text-center pt-8 border-t text-sm text-muted-foreground">
          <p>&copy; 2024 АвтоПрофи. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
