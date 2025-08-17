import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function getStoredFeedback(): any[] {
  try {
    const raw = localStorage.getItem('drn_feedback');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFeedback(entry: any) {
  const prev = getStoredFeedback();
  prev.unshift({ ...entry, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
  localStorage.setItem('drn_feedback', JSON.stringify(prev.slice(0, 100)));
}

export default function Feedback() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', category: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    saveFeedback(form);
    setSubmitted(true);
    setForm({ name: '', email: '', category: '', message: '' });
  };

  return (
    <AppLayout>
      <div className="p-4 space-y-4">
        <div className="bg-primary rounded-xl p-6 text-primary-foreground">
          <h1 className="text-2xl font-bold mb-2">{t('feedback.title')}</h1>
          <p className="text-primary-foreground/90">{t('feedback.subtitle')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('feedback.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            {submitted && (
              <div className="mb-4 text-sm text-success">{t('feedback.thanks')}</div>
            )}
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">{t('feedback.name')}</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="email">{t('feedback.email')}</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="category">{t('feedback.category')}</Label>
                <Input id="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="message">{t('feedback.message')}</Label>
                <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <div className="flex justify-end">
                <Button type="submit">{t('feedback.submit')}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}