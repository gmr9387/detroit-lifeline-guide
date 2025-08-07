// Browser-native internationalization service
// Provides multi-language support with browser language detection

interface TranslationKeys {
  // Navigation
  'nav.dashboard': string;
  'nav.programs': string;
  'nav.applications': string;
  'nav.profile': string;
  
  // Common actions
  'common.search': string;
  'common.apply': string;
  'common.save': string;
  'common.cancel': string;
  'common.submit': string;
  'common.edit': string;
  'common.delete': string;
  'common.back': string;
  'common.next': string;
  'common.previous': string;
  'common.loading': string;
  'common.error': string;
  'common.success': string;
  
  // Dashboard
  'dashboard.welcome': string;
  'dashboard.recommendations': string;
  'dashboard.applications': string;
  'dashboard.favorites': string;
  'dashboard.recent': string;
  
  // Programs
  'programs.title': string;
  'programs.search': string;
  'programs.filter': string;
  'programs.category': string;
  'programs.noResults': string;
  'programs.eligibility': string;
  'programs.benefits': string;
  'programs.documents': string;
  'programs.contact': string;
  
  // Applications
  'applications.status.saved': string;
  'applications.status.started': string;
  'applications.status.submitted': string;
  'applications.status.approved': string;
  'applications.status.denied': string;
  
  // Categories
  'category.employment': string;
  'category.childcare': string;
  'category.housing': string;
  'category.healthcare': string;
  'category.food': string;
  'category.utilities': string;
  'category.financial': string;
  'category.business': string;
  
  // Form validation
  'validation.required': string;
  'validation.email': string;
  'validation.phone': string;
  'validation.zipCode': string;
  'validation.minLength': string;
  'validation.maxLength': string;
  
  // Errors
  'error.networkError': string;
  'error.notFound': string;
  'error.serverError': string;
  'error.locationDenied': string;
  'error.offline': string;
}

// Translation data
const translations: Record<string, Partial<TranslationKeys>> = {
  'en': {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.programs': 'Programs',
    'nav.applications': 'Applications',
    'nav.profile': 'Profile',
    
    // Common actions
    'common.search': 'Search',
    'common.apply': 'Apply',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    
    // Dashboard
    'dashboard.welcome': 'Welcome to Detroit Navigator',
    'dashboard.recommendations': 'Recommended for You',
    'dashboard.applications': 'Your Applications',
    'dashboard.favorites': 'Saved Programs',
    'dashboard.recent': 'Recently Viewed',
    
    // Programs
    'programs.title': 'Available Programs',
    'programs.search': 'Search programs...',
    'programs.filter': 'Filter',
    'programs.category': 'Category',
    'programs.noResults': 'No programs found matching your criteria',
    'programs.eligibility': 'Eligibility Requirements',
    'programs.benefits': 'Benefits',
    'programs.documents': 'Required Documents',
    'programs.contact': 'Contact Information',
    
    // Applications
    'applications.status.saved': 'Saved',
    'applications.status.started': 'In Progress',
    'applications.status.submitted': 'Submitted',
    'applications.status.approved': 'Approved',
    'applications.status.denied': 'Denied',
    
    // Categories
    'category.employment': 'Employment & Training',
    'category.childcare': 'Child Care & Family',
    'category.housing': 'Housing',
    'category.healthcare': 'Healthcare',
    'category.food': 'Food & Nutrition',
    'category.utilities': 'Utility & Energy',
    'category.financial': 'Financial & Banking',
    'category.business': 'Entrepreneurship',
    
    // Form validation
    'validation.required': 'This field is required',
    'validation.email': 'Please enter a valid email address',
    'validation.phone': 'Please enter a valid phone number',
    'validation.zipCode': 'Please enter a valid ZIP code',
    'validation.minLength': 'Must be at least {min} characters',
    'validation.maxLength': 'Must be no more than {max} characters',
    
    // Errors
    'error.networkError': 'Network connection error. Please check your internet connection.',
    'error.notFound': 'The requested resource was not found.',
    'error.serverError': 'Server error. Please try again later.',
    'error.locationDenied': 'Location access was denied. Please enable location services.',
    'error.offline': 'You are currently offline. Some features may not be available.'
  },
  
  'es': {
    // Navigation
    'nav.dashboard': 'Tablero',
    'nav.programs': 'Programas',
    'nav.applications': 'Aplicaciones',
    'nav.profile': 'Perfil',
    
    // Common actions
    'common.search': 'Buscar',
    'common.apply': 'Aplicar',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.submit': 'Enviar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    
    // Dashboard
    'dashboard.welcome': 'Bienvenido a Detroit Navigator',
    'dashboard.recommendations': 'Recomendado para Ti',
    'dashboard.applications': 'Tus Aplicaciones',
    'dashboard.favorites': 'Programas Guardados',
    'dashboard.recent': 'Visto Recientemente',
    
    // Programs
    'programs.title': 'Programas Disponibles',
    'programs.search': 'Buscar programas...',
    'programs.filter': 'Filtrar',
    'programs.category': 'Categoría',
    'programs.noResults': 'No se encontraron programas que coincidan con sus criterios',
    'programs.eligibility': 'Requisitos de Elegibilidad',
    'programs.benefits': 'Beneficios',
    'programs.documents': 'Documentos Requeridos',
    'programs.contact': 'Información de Contacto',
    
    // Applications
    'applications.status.saved': 'Guardado',
    'applications.status.started': 'En Progreso',
    'applications.status.submitted': 'Enviado',
    'applications.status.approved': 'Aprobado',
    'applications.status.denied': 'Denegado',
    
    // Categories
    'category.employment': 'Empleo y Capacitación',
    'category.childcare': 'Cuidado Infantil y Familia',
    'category.housing': 'Vivienda',
    'category.healthcare': 'Atención Médica',
    'category.food': 'Alimentación y Nutrición',
    'category.utilities': 'Servicios Públicos y Energía',
    'category.financial': 'Financiero y Bancario',
    'category.business': 'Emprendimiento',
    
    // Form validation
    'validation.required': 'Este campo es obligatorio',
    'validation.email': 'Por favor ingrese una dirección de correo válida',
    'validation.phone': 'Por favor ingrese un número de teléfono válido',
    'validation.zipCode': 'Por favor ingrese un código postal válido',
    'validation.minLength': 'Debe tener al menos {min} caracteres',
    'validation.maxLength': 'Debe tener no más de {max} caracteres',
    
    // Errors
    'error.networkError': 'Error de conexión de red. Por favor verifique su conexión a internet.',
    'error.notFound': 'El recurso solicitado no fue encontrado.',
    'error.serverError': 'Error del servidor. Por favor intente más tarde.',
    'error.locationDenied': 'Se denegó el acceso a la ubicación. Por favor habilite los servicios de ubicación.',
    'error.offline': 'Actualmente está sin conexión. Algunas funciones pueden no estar disponibles.'
  },
  
  'ar': {
    // Navigation
    'nav.dashboard': 'لوحة القيادة',
    'nav.programs': 'البرامج',
    'nav.applications': 'التطبيقات',
    'nav.profile': 'الملف الشخصي',
    
    // Common actions
    'common.search': 'بحث',
    'common.apply': 'تطبيق',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.submit': 'إرسال',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    
    // Dashboard
    'dashboard.welcome': 'مرحباً بك في ديترويت نافيجيتور',
    'dashboard.recommendations': 'موصى لك',
    'dashboard.applications': 'طلباتك',
    'dashboard.favorites': 'البرامج المحفوظة',
    'dashboard.recent': 'تم عرضها مؤخراً',
    
    // Programs
    'programs.title': 'البرامج المتاحة',
    'programs.search': 'البحث عن البرامج...',
    'programs.filter': 'تصفية',
    'programs.category': 'الفئة',
    'programs.noResults': 'لم يتم العثور على برامج تطابق معاييرك',
    'programs.eligibility': 'متطلبات الأهلية',
    'programs.benefits': 'الفوائد',
    'programs.documents': 'الوثائق المطلوبة',
    'programs.contact': 'معلومات الاتصال',
    
    // Categories
    'category.employment': 'التوظيف والتدريب',
    'category.childcare': 'رعاية الأطفال والأسرة',
    'category.housing': 'الإسكان',
    'category.healthcare': 'الرعاية الصحية',
    'category.food': 'الغذاء والتغذية',
    'category.utilities': 'المرافق والطاقة',
    'category.financial': 'المالية والمصرفية',
    'category.business': 'ريادة الأعمال'
  }
};

class I18nService {
  private currentLanguage: string;
  private fallbackLanguage: string = 'en';
  private supportedLanguages: string[] = ['en', 'es', 'ar'];

  constructor() {
    this.currentLanguage = this.detectBrowserLanguage();
  }

  // Detect browser language using navigator.language
  private detectBrowserLanguage(): string {
    // Get browser languages in order of preference
    const browserLanguages = [
      navigator.language,
      ...(navigator.languages || [])
    ];

    // Find the first supported language
    for (const lang of browserLanguages) {
      const langCode = lang.split('-')[0].toLowerCase();
      if (this.supportedLanguages.includes(langCode)) {
        return langCode;
      }
    }

    return this.fallbackLanguage;
  }

  // Get current language
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  // Set language
  setLanguage(language: string): void {
    if (this.supportedLanguages.includes(language)) {
      this.currentLanguage = language;
      
      // Save to storage for persistence
      localStorage.setItem('detroit_navigator_language', language);
      
      // Update document language
      document.documentElement.lang = language;
      
      // Update document direction for RTL languages
      document.documentElement.dir = this.isRTL(language) ? 'rtl' : 'ltr';
      
      // Trigger language change event
      window.dispatchEvent(new CustomEvent('languageChange', { 
        detail: { language } 
      }));
    }
  }

  // Check if language is RTL
  private isRTL(language: string): boolean {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    return rtlLanguages.includes(language);
  }

  // Get supported languages
  getSupportedLanguages(): Array<{ code: string; name: string; nativeName: string }> {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية' }
    ];
  }

  // Translate a key
  t(key: keyof TranslationKeys, params?: Record<string, string | number>): string {
    const languageTranslations = translations[this.currentLanguage] || {};
    const fallbackTranslations = translations[this.fallbackLanguage] || {};
    
    let translation = languageTranslations[key] || fallbackTranslations[key] || key;

    // Replace parameters in translation
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, String(value));
      });
    }

    return translation;
  }

  // Format numbers according to locale
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    try {
      return new Intl.NumberFormat(this.getLocale(), options).format(number);
    } catch (error) {
      return number.toString();
    }
  }

  // Format currency
  formatCurrency(amount: number, currency: string = 'USD'): string {
    try {
      return new Intl.NumberFormat(this.getLocale(), {
        style: 'currency',
        currency
      }).format(amount);
    } catch (error) {
      return `$${amount}`;
    }
  }

  // Format date
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    try {
      return new Intl.DateTimeFormat(this.getLocale(), options).format(date);
    } catch (error) {
      return date.toLocaleDateString();
    }
  }

  // Format relative time (e.g., "2 hours ago")
  formatRelativeTime(date: Date): string {
    try {
      const rtf = new Intl.RelativeTimeFormat(this.getLocale(), { numeric: 'auto' });
      const now = new Date();
      const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
      
      if (Math.abs(diffInSeconds) < 60) {
        return rtf.format(diffInSeconds, 'second');
      } else if (Math.abs(diffInSeconds) < 3600) {
        return rtf.format(Math.floor(diffInSeconds / 60), 'minute');
      } else if (Math.abs(diffInSeconds) < 86400) {
        return rtf.format(Math.floor(diffInSeconds / 3600), 'hour');
      } else {
        return rtf.format(Math.floor(diffInSeconds / 86400), 'day');
      }
    } catch (error) {
      return date.toLocaleDateString();
    }
  }

  // Get full locale code
  private getLocale(): string {
    const localeMap: Record<string, string> = {
      'en': 'en-US',
      'es': 'es-US',
      'ar': 'ar-SA'
    };
    
    return localeMap[this.currentLanguage] || 'en-US';
  }

  // Initialize from stored preference
  initFromStorage(): void {
    const storedLanguage = localStorage.getItem('detroit_navigator_language');
    if (storedLanguage && this.supportedLanguages.includes(storedLanguage)) {
      this.setLanguage(storedLanguage);
    } else {
      this.setLanguage(this.detectBrowserLanguage());
    }
  }

  // Get text direction
  getTextDirection(): 'ltr' | 'rtl' {
    return this.isRTL(this.currentLanguage) ? 'rtl' : 'ltr';
  }

  // Plural rules
  getPlural(count: number, options: { zero?: string; one?: string; other: string }): string {
    try {
      const pr = new Intl.PluralRules(this.getLocale());
      const rule = pr.select(count);
      
      if (count === 0 && options.zero) return options.zero;
      if (rule === 'one' && options.one) return options.one;
      return options.other;
    } catch (error) {
      return count === 1 ? (options.one || options.other) : options.other;
    }
  }

  // List formatting
  formatList(items: string[], type: 'conjunction' | 'disjunction' = 'conjunction'): string {
    try {
      const lf = new Intl.ListFormat(this.getLocale(), { 
        style: 'long', 
        type 
      });
      return lf.format(items);
    } catch (error) {
      return items.join(', ');
    }
  }
}

// React hook for using i18n in components
export function useI18n() {
  const i18n = i18nService;
  
  // Listen for language changes
  React.useEffect(() => {
    const handleLanguageChange = () => {
      // Force re-render when language changes
      forceUpdate();
    };
    
    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);
  
  return {
    t: i18n.t.bind(i18n),
    currentLanguage: i18n.getCurrentLanguage(),
    setLanguage: i18n.setLanguage.bind(i18n),
    supportedLanguages: i18n.getSupportedLanguages(),
    textDirection: i18n.getTextDirection(),
    formatNumber: i18n.formatNumber.bind(i18n),
    formatCurrency: i18n.formatCurrency.bind(i18n),
    formatDate: i18n.formatDate.bind(i18n),
    formatRelativeTime: i18n.formatRelativeTime.bind(i18n),
    getPlural: i18n.getPlural.bind(i18n),
    formatList: i18n.formatList.bind(i18n)
  };
}

// Force update helper
function forceUpdate() {
  // This would be implemented using React state in the actual hook
  // For now, we'll dispatch a custom event
  window.dispatchEvent(new CustomEvent('forceUpdate'));
}

export const i18nService = new I18nService();
export default i18nService;