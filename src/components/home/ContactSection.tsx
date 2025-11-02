import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Контакты</h2>
          <p className="text-muted-foreground text-lg">
            Свяжитесь с нами удобным способом
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2">
            <Icon name="Phone" className="text-primary mx-auto mb-4" size={32} />
            <h3 className="font-semibold mb-2">Телефон</h3>
            <a href="tel:+79001234567" className="text-sm text-muted-foreground hover:text-primary">
              +7 (900) 123-45-67
            </a>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2">
            <Icon name="Mail" className="text-primary mx-auto mb-4" size={32} />
            <h3 className="font-semibold mb-2">Email</h3>
            <a href="mailto:info@avtoprofi.ru" className="text-sm text-muted-foreground hover:text-primary">
              info@avtoprofi.ru
            </a>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2">
            <Icon name="MapPin" className="text-primary mx-auto mb-4" size={32} />
            <h3 className="font-semibold mb-2">Адрес</h3>
            <p className="text-sm text-muted-foreground">
              г. Москва, ул. Примерная, д. 1
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
