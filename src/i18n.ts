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
        important: 'Important Reminders',
        viewAll: 'View All',
        learnMore: 'Learn More',
        urgent: 'Urgent',
        myApplications: 'My Applications',
        appliedOn: 'Applied',
        statuses: {
          saved: 'Saved',
          started: 'In Progress',
          submitted: 'Submitted',
          approved: 'Approved',
          denied: 'Denied'
        },
        shareTitle: 'Share Detroit Resource Navigator',
        shareDesc: 'Help a friend find housing, food, child care, and more.',
        shareButton: 'Share',
        copyLink: 'Copy Link',
        copied: 'Link copied!'
      },
      programs: {
        browse: 'Browse Programs',
        availableLabel: 'programs available',
        searchPlaceholder: 'Search programs, benefits, or keywords...',
        allCategories: 'All Categories',
        filteredBy: 'Filtered by:',
        clearFilters: 'Clear Filters',
        noResults: 'No programs found matching your criteria.',
        viewDetails: 'View Details',
        keyBenefits: 'Key Benefits:',
        languages: 'Languages:'
      },
      detail: {
        back: 'Back',
        contactInfo: 'Contact Information',
        phone: 'Phone',
        hours: 'Hours',
        address: 'Address',
        visitWebsite: 'Visit Website',
        languagesAvailable: 'Languages Available:',
        programBenefits: 'Program Benefits',
        eligibility: 'Eligibility Requirements',
        requiredDocuments: 'Required Documents',
        checkOff: 'Check off documents as you gather them',
        documentsReady: 'Documents Ready',
        applyNow: 'Apply Now',
        saveProgress: 'Save Application Progress',
        important: 'Important',
        importantNote: 'This will take you to the official application website. Make sure you have all required documents ready before starting your application.'
      },
      feedback: {
        title: 'Feedback',
        subtitle: 'Tell us what you need or what we can improve',
        name: 'Name (optional)',
        email: 'Email (optional)',
        category: 'Category',
        message: 'Message',
        submit: 'Submit',
        thanks: 'Thank you for your feedback!'
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
        important: 'Recordatorios importantes',
        viewAll: 'Ver todo',
        learnMore: 'Más información',
        urgent: 'Urgente',
        myApplications: 'Mis solicitudes',
        appliedOn: 'Solicitada',
        statuses: {
          saved: 'Guardado',
          started: 'En progreso',
          submitted: 'Enviada',
          approved: 'Aprobada',
          denied: 'Denegada'
        },
        shareTitle: 'Comparte el Navegador de Recursos de Detroit',
        shareDesc: 'Ayuda a un amigo a encontrar vivienda, alimentos, cuidado infantil y más.',
        shareButton: 'Compartir',
        copyLink: 'Copiar enlace',
        copied: '¡Enlace copiado!'
      },
      programs: {
        browse: 'Explorar programas',
        availableLabel: 'programas disponibles',
        searchPlaceholder: 'Buscar programas, beneficios o palabras clave...',
        allCategories: 'Todas las categorías',
        filteredBy: 'Filtrado por:',
        clearFilters: 'Limpiar filtros',
        noResults: 'No se encontraron programas que coincidan con tus criterios.',
        viewDetails: 'Ver detalles',
        keyBenefits: 'Beneficios clave:',
        languages: 'Idiomas:'
      },
      detail: {
        back: 'Atrás',
        contactInfo: 'Información de contacto',
        phone: 'Teléfono',
        hours: 'Horario',
        address: 'Dirección',
        visitWebsite: 'Visitar sitio web',
        languagesAvailable: 'Idiomas disponibles:',
        programBenefits: 'Beneficios del programa',
        eligibility: 'Requisitos de elegibilidad',
        requiredDocuments: 'Documentos requeridos',
        checkOff: 'Marca los documentos a medida que los reúnas',
        documentsReady: 'Documentos listos',
        applyNow: 'Aplicar ahora',
        saveProgress: 'Guardar progreso de la solicitud',
        important: 'Importante',
        importantNote: 'Esto te llevará al sitio oficial de la solicitud. Asegúrate de tener todos los documentos requeridos antes de empezar.'
      },
      feedback: {
        title: 'Comentarios',
        subtitle: 'Cuéntanos qué necesitas o qué podemos mejorar',
        name: 'Nombre (opcional)',
        email: 'Correo (opcional)',
        category: 'Categoría',
        message: 'Mensaje',
        submit: 'Enviar',
        thanks: '¡Gracias por tus comentarios!'
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
        important: 'تذكيرات مهمة',
        viewAll: 'عرض الكل',
        learnMore: 'اعرف المزيد',
        urgent: 'عاجل',
        myApplications: 'طلباتي',
        appliedOn: 'تم التقديم',
        statuses: {
          saved: 'محفوظ',
          started: 'قيد التقدم',
          submitted: 'تم الإرسال',
          approved: 'مقبول',
          denied: 'مرفوض'
        },
        shareTitle: 'شارك مُوجِّه موارد ديترويت',
        shareDesc: 'ساعد صديقًا في العثور على السكن والطعام ورعاية الأطفال والمزيد.',
        shareButton: 'مشاركة',
        copyLink: 'نسخ الرابط',
        copied: 'تم نسخ الرابط!'
      },
      programs: {
        browse: 'تصفح البرامج',
        availableLabel: 'برامج متاحة',
        searchPlaceholder: 'ابحث عن البرامج أو المزايا أو الكلمات المفتاحية...',
        allCategories: 'كل الفئات',
        filteredBy: 'مصفاة حسب:',
        clearFilters: 'مسح المرشحات',
        noResults: 'لا توجد برامج مطابقة لمعاييرك.',
        viewDetails: 'عرض التفاصيل',
        keyBenefits: 'الفوائد الرئيسية:',
        languages: 'اللغات:'
      },
      detail: {
        back: 'رجوع',
        contactInfo: 'معلومات الاتصال',
        phone: 'الهاتف',
        hours: 'الساعات',
        address: 'العنوان',
        visitWebsite: 'زيارة الموقع',
        languagesAvailable: 'اللغات المتاحة:',
        programBenefits: 'فوائد البرنامج',
        eligibility: 'متطلبات الأهلية',
        requiredDocuments: 'المستندات المطلوبة',
        checkOff: 'ضع علامة عند جمع المستندات',
        documentsReady: 'المستندات الجاهزة',
        applyNow: 'قدّم الآن',
        saveProgress: 'حفظ التقدم في الطلب',
        important: 'مهم',
        importantNote: 'سيأخذك هذا إلى موقع التقديم الرسمي. تأكد من توفر جميع المستندات المطلوبة قبل البدء.'
      },
      feedback: {
        title: 'ملاحظات',
        subtitle: 'أخبرنا بما تحتاجه أو ما يمكننا تحسينه',
        name: 'الاسم (اختياري)',
        email: 'البريد الإلكتروني (اختياري)',
        category: 'الفئة',
        message: 'الرسالة',
        submit: 'إرسال',
        thanks: 'شكرًا لملاحظاتك!'
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