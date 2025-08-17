import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        search: 'Search',
        apply: 'Apply',
        saved: 'Saved',
        profile: 'Profile'
      },
      hero: {
        title1: 'Detroit Resource',
        title2: 'Navigator',
        subtitle: "Find government services, social programs, and community resources all in one place. Get personalized help for your family's needs.",
        getStarted: 'Get Started - 5 Minutes',
        cta: 'Start Your Search'
      },
      onboarding: {
        title: 'Detroit Resource Navigator',
        subtitle: 'Find the help you need in just 5 minutes'
      },
      dashboard: {
        quickActions: 'Quick Actions',
        recommended: 'Recommended for You',
        important: 'Important Reminders'
      }
    }
  },
  es: {
    translation: {
      nav: {
        home: 'Inicio',
        search: 'Buscar',
        apply: 'Aplicar',
        saved: 'Guardado',
        profile: 'Perfil'
      },
      hero: {
        title1: 'Navegador de',
        title2: 'Recursos de Detroit',
        subtitle: 'Encuentra servicios gubernamentales, programas sociales y recursos comunitarios en un solo lugar. Obtén ayuda personalizada para tu familia.',
        getStarted: 'Comenzar - 5 Minutos',
        cta: 'Comienza tu búsqueda'
      },
      onboarding: {
        title: 'Navegador de Recursos de Detroit',
        subtitle: 'Encuentra ayuda en solo 5 minutos'
      },
      dashboard: {
        quickActions: 'Acciones rápidas',
        recommended: 'Recomendado para ti',
        important: 'Recordatorios importantes'
      }
    }
  },
  ar: {
    translation: {
      nav: {
        home: 'الرئيسية',
        search: 'بحث',
        apply: 'التقديم',
        saved: 'المحفوظات',
        profile: 'الملف الشخصي'
      },
      hero: {
        title1: 'مُوجِّه موارد',
        title2: 'ديترويت',
        subtitle: 'اعثر على الخدمات الحكومية والبرامج الاجتماعية والموارد المجتمعية في مكان واحد. احصل على مساعدة مخصصة لاحتياجات عائلتك.',
        getStarted: 'ابدأ - 5 دقائق',
        cta: 'ابدأ البحث'
      },
      onboarding: {
        title: 'مُوجِّه موارد ديترويت',
        subtitle: 'اعثر على المساعدة في 5 دقائق'
      },
      dashboard: {
        quickActions: 'إجراءات سريعة',
        recommended: 'موصى به لك',
        important: 'تذكيرات مهمة'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;