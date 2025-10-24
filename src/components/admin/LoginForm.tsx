import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { ADMIN_PASSWORD } from './types';

interface LoginFormProps {
  onLogin: () => void;
  onError: (message: string) => void;
}

const LoginForm = ({ onLogin, onError }: LoginFormProps) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      onError('Неверный пароль');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <Icon name="Lock" className="text-white" size={32} />
          </div>
          <CardTitle className="text-2xl">Вход в админ-панель</CardTitle>
          <CardDescription>Введите пароль для доступа к системе управления</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                required
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              <Icon name="LogIn" size={16} className="mr-2" />
              Войти
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = '/'}
            >
              <Icon name="Home" size={16} className="mr-2" />
              На главную
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
