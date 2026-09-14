import { Specialty, Doctor, Appointment, MedicalRecord, Prescription, Review, BlogArticle, User } from '../types';

export const DOCTOR_DEFAULT_AVATAR = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaia678yAXVtva77Nr4PPbVP8AjxoJgeeRVeZQEBurhw&s=10';

export const INITIAL_SPECIALTIES: Specialty[] = [
  {
    id: 'general',
    name: 'پزشک عمومی',
    englishName: 'General Practice',
    icon: 'Stethoscope',
    doctorCount: 10,
    description: 'تشخیص اولیه، چکاپ کلی، سرماخوردگی و تجویز آزمایش‌های عمومی'
  },
  {
    id: 'cardiology',
    name: 'قلب و عروق',
    englishName: 'Cardiology',
    icon: 'HeartPulse',
    doctorCount: 10,
    description: 'تست ورزش، اکوکاردیوگرافی، نوار قلب و کنترل فشار خون'
  },
  {
    id: 'dermatology',
    name: 'پوست، مو و زیبایی',
    englishName: 'Dermatology',
    icon: 'Sparkles',
    doctorCount: 10,
    description: 'درمان آکنه، ریزش مو، تزریق بوتاکس و ژل، پاکسازی و لیزر'
  },
  {
    id: 'gynecology',
    name: 'زنان، زایمان و نازایی',
    englishName: 'Gynecology',
    icon: 'Baby',
    doctorCount: 10,
    description: 'مراقبت‌های بارداری، سونوگرافی، تست پاپ اسمیر و درمان عفونت‌ها'
  },
  {
    id: 'psychiatry',
    name: 'روانپزشکی و اعصاب و روان',
    englishName: 'Psychiatry',
    icon: 'Brain',
    doctorCount: 10,
    description: 'درمان افسردگی، اضطراب، وسواس، اختلالات خواب و روان‌درمانی'
  },
  {
    id: 'pediatrics',
    name: 'کودکان و اطفال',
    englishName: 'Pediatrics',
    icon: 'Baby',
    doctorCount: 10,
    description: 'رشد و تغذیه نوزاد، واکسیناسیون، بیماری‌های عفونی اطفال'
  },
  {
    id: 'internal',
    name: 'بیماری‌های داخلی',
    englishName: 'Internal Medicine',
    icon: 'Activity',
    doctorCount: 10,
    description: 'کنترل دیابت، چربی خون، کبد چرب و مشکلات گوارشی و کلیوی'
  },
  {
    id: 'neurology',
    name: 'مغز و اعصاب (نورولوژی)',
    englishName: 'Neurology',
    icon: 'Zap',
    doctorCount: 10,
    description: 'درمان سردرد، میگرن، صرع، ام‌اس، نوار عصب و عضله'
  },
  {
    id: 'orthopedics',
    name: 'استخوان و مفاصل (ارتوپدی)',
    englishName: 'Orthopedics',
    icon: 'Bone',
    doctorCount: 10,
    description: 'درمان دیسک کمر، زانودرد، شکستگی‌ها و آسیب‌های ورزشی'
  },
  {
    id: 'ophthalmology',
    name: 'چشم‌پزشکی',
    englishName: 'Ophthalmology',
    icon: 'Eye',
    doctorCount: 10,
    description: 'تعیین شماره چشم، جراحی لازک و لیزیک، آب مروارید'
  },
  {
    id: 'ent',
    name: 'گوش، حلق و بینی',
    englishName: 'ENT',
    icon: 'Ear',
    doctorCount: 10,
    description: 'جراحی زیبایی بینی، سینوزیت، شستشوی گوش و اختلالات شنوایی'
  },
  {
    id: 'nutrition',
    name: 'تغذیه و رژیم‌درمانی',
    englishName: 'Nutrition',
    icon: 'Apple',
    doctorCount: 10,
    description: 'رژیم لاغری و چاقی، آنالیز ترکیب بدن، تغذیه ورزشکاران'
  }
];

export const CITIES = [
  'همه شهرها',
  'تهران',
  'مشهد',
  'اصفهان',
  'شیراز',
  'تبریز',
  'کرج',
  'قم',
  'اهواز',
  'رشت',
  'کرمانشاه'
];

export const INSURANCES = [
  'تأمین اجتماعی',
  'بیمه سلامت (خدمات درمانی)',
  'نیروهای مسلح',
  'بیمه تکمیلی ایران',
  'بیمه دی',
  'بیمه دانا',
  'آتیه‌سازان حافظ',
  'بیمه البرز',
  'بیمه آسیا'
];

// Helper lists for generating 10 doctors per specialty
const DOCTOR_FIRST_NAMES_MALE = ['محمد', 'علی', 'امیر', 'رضا', 'حسین', 'مهدی', 'بابک', 'کامران', 'شهاب', 'آارش', 'میثم', 'حمید', 'بهزاد', 'سینا', 'پیمان', 'فرزاد'];
const DOCTOR_FIRST_NAMES_FEMALE = ['مریم', 'سارا', 'زهرا', 'فاطمه', 'نرگس', 'سمیرا', 'نسیم', 'پریسا', 'مینا', 'شیرین', 'الهام', 'نیلوفر', 'نسرین', 'بهار', 'مهدیه'];
const DOCTOR_LAST_NAMES = ['رضایی', 'کاظمی', 'شریفی', 'ابراهیمی', 'نوری', 'احمدی', 'حسینی', 'محمدی', 'موسوی', 'قاسمی', 'مرادی', 'جعفری', 'طاهری', 'صادقی', 'نجفی', 'کریمی', 'رحیمی', 'سلیمانی', 'عباسی', 'باغبان'];
const CITIES_LIST = ['تهران', 'مشهد', 'اصفهان', 'شیراز', 'تبریز', 'کرج', 'قم', 'اهواز', 'رشت', 'کرمانشاه'];

function generateDoctorsList(): Doctor[] {
  const doctors: Doctor[] = [
    // Include initial core doctors with exact IDs doc-1 to doc-6
    {
      id: 'doc-1',
      name: 'دکتر مریم رضایی',
      title: 'فوق تخصص قلب و عروق و اکوکاردیوگرافی پیشرفته',
      specialtyId: 'cardiology',
      specialtyName: 'قلب و عروق',
      medicalCode: 'م-۱۴۸۹۲',
      city: 'تهران',
      address: 'تهران، خیابان ولیعصر، بالاتر از ظفر، برج پزشکی شهریار، طبقه ۵',
      location: { lat: 35.7621, lng: 51.4112 },
      avatar: DOCTOR_DEFAULT_AVATAR,
      rating: 4.9,
      reviewCount: 312,
      experienceYears: 16,
      biography: 'دانش‌آموخته دانشگاه علوم پزشکی تهران، دارنده بورد تخصصی قلب و عروق و دوره تکمیلی اکوکاردیوگرافی پیشرفته از ایتالیا. عضو انجمن قلب ایران و اروپا.',
      insurances: ['تأمین اجتماعی', 'بیمه سلامت (خدمات درمانی)', 'بیمه تکمیلی ایران', 'بیمه دانا'],
      consultationTypes: ['text', 'voice', 'video'],
      prices: { text: 150000, voice: 190000, video: 240000 },
      isVerified: true,
      status: 'active',
      hospitalOrClinic: 'بیمارستان دی و کلینیک تخصصی قلب مهر',
      onlineStatus: 'online',
      workingHours: [
        { day: 'شنبه', dayIndex: 0, slots: ['09:00', '09:30', '10:00', '10:30', '16:00', '16:30', '17:00'] },
        { day: 'یکشنبه', dayIndex: 1, slots: ['09:00', '09:30', '10:00', '11:00', '16:00', '16:30'] },
        { day: 'دوشنبه', dayIndex: 2, slots: ['09:30', '10:00', '10:30', '16:00', '17:00'] },
        { day: 'چهارشنبه', dayIndex: 4, slots: ['10:00', '10:30', '11:00', '16:30', '17:00'] }
      ]
    },
    {
      id: 'doc-2',
      name: 'دکتر علیرضا کاظمی',
      title: 'متخصص پوست، مو، زیبایی و لیزر',
      specialtyId: 'dermatology',
      specialtyName: 'پوست، مو و زیبایی',
      medicalCode: 'م-۲۳۱۰۴',
      city: 'تهران',
      address: 'تهران، سعادت‌آباد، سرو غربی، پلاک ۴۲، ساختام پزشکی نیکان',
      location: { lat: 35.7812, lng: 51.3721 },
      avatar: DOCTOR_DEFAULT_AVATAR,
      rating: 4.8,
      reviewCount: 245,
      experienceYears: 12,
      biography: 'متخصص پوست و مو از دانشگاه شهید بهشتی، رتبه برتر بورد کشوری. متخصص در تزریقات زیبایی طبیعی، کلاژن‌سازی، کاشت مو و درمان ضایعات پوستی.',
      insurances: ['تأمین اجتماعی', 'بیمه تکمیلی ایران', 'بیمه دی'],
      consultationTypes: ['text', 'video', 'voice'],
      prices: { text: 160000, voice: 200000, video: 260000 },
      isVerified: true,
      status: 'active',
      hospitalOrClinic: 'کلینیک تخصصی زیبایی ارمغان',
      onlineStatus: 'online',
      workingHours: [
        { day: 'شنبه', dayIndex: 0, slots: ['11:00', '11:30', '12:00', '17:00', '17:30', '18:00'] },
        { day: 'سه شنبه', dayIndex: 3, slots: ['11:00', '11:30', '16:00', '16:30', '17:00'] },
        { day: 'چهارشنبه', dayIndex: 4, slots: ['10:30', '11:00', '17:00', '17:30'] }
      ]
    },
    {
      id: 'doc-3',
      name: 'دکتر سارا شریفی',
      title: 'متخصص زنان، زایمان و نازایی - فلوشیپ لاپاراسکوپی',
      specialtyId: 'gynecology',
      specialtyName: 'زنان، زایمان و نازایی',
      medicalCode: 'م-۱۷۴۳۲',
      city: 'مشهد',
      address: 'مشهد، خیابان احمدآباد، بین پرستار ۱ و ۳، ساختمان پزشکان امید',
      location: { lat: 36.2972, lng: 59.5821 },
      avatar: DOCTOR_DEFAULT_AVATAR,
      rating: 4.9,
      reviewCount: 418,
      experienceYears: 18,
      biography: 'استاد دانشگاه علوم پزشکی مشهد، سابقه بیش از ۴۰۰۰ زایمان موفق و مراقبت‌های ویژه نازایی. جراح متخصص جراحی‌های کم‌تهاجمی زنان.',
      insurances: ['تأمین اجتماعی', 'بیمه سلامت (خدمات درمانی)', 'نیروهای مسلح', 'آتیه‌سازان حافظ'],
      consultationTypes: ['text', 'voice', 'video'],
      prices: { text: 140000, voice: 180000, video: 220000 },
      isVerified: true,
      status: 'active',
      hospitalOrClinic: 'بیمارستان مهر و رضوی مشهد',
      onlineStatus: 'online',
      workingHours: [
        { day: 'شنبه', dayIndex: 0, slots: ['09:00', '09:30', '10:00', '10:30', '11:00'] },
        { day: 'یکشنبه', dayIndex: 1, slots: ['16:00', '16:30', '17:00', '17:30'] },
        { day: 'دوشنبه', dayIndex: 2, slots: ['09:00', '09:30', '10:00', '10:30'] }
      ]
    },
    {
      id: 'doc-4',
      name: 'دکتر کامران ابراهیمی',
      title: 'متخصص اعصاب و روان (روانپزشک) و رواندرمانگر',
      specialtyId: 'psychiatry',
      specialtyName: 'روانپزشکی و اعصاب و روان',
      medicalCode: 'م-۱۹۸۵۱',
      city: 'اصفهان',
      address: 'اصفهان، خیابان آمادگاه، مجتمع پزشکی کلینیکال، طبقه سوم',
      location: { lat: 32.6546, lng: 51.6680 },
      avatar: DOCTOR_DEFAULT_AVATAR,
      rating: 4.7,
      reviewCount: 189,
      experienceYears: 14,
      biography: 'روانپزشک و مشاور خانواده با تمرکز بر درمان اختلالات اضطرابی، پانیک، افسردگی و مشاوره زوجین. رویکرد شناختی-رفتاری (CBT).',
      insurances: ['تأمین اجتماعی', 'بیمه سلامت (خدمات درمانی)', 'بیمه دی'],
      consultationTypes: ['text', 'voice', 'video'],
      prices: { text: 170000, voice: 220000, video: 280000 },
      isVerified: true,
      status: 'active',
      hospitalOrClinic: 'مرکز مشاوره و سلامت روان اصفهان',
      onlineStatus: 'online',
      workingHours: [
        { day: 'شنبه', dayIndex: 0, slots: ['14:00', '15:00', '16:00', '17:00'] },
        { day: 'دوشنبه', dayIndex: 2, slots: ['14:00', '15:00', '16:00', '17:00'] },
        { day: 'چهارشنبه', dayIndex: 4, slots: ['14:00', '15:00', '16:00'] }
      ]
    },
    {
      id: 'doc-5',
      name: 'دکتر حسین نوری',
      title: 'متخصص جراحی استخوان و مفاصل (ارتوپدی)',
      specialtyId: 'orthopedics',
      specialtyName: 'استخوان و مفاصل (ارتوپدی)',
      medicalCode: 'م-۱۲۳۴۵',
      city: 'شیراز',
      address: 'شیراز، خیابان زند، نرسیده به ۲۰ متری، ساختمان پزشکی آراد',
      location: { lat: 29.6103, lng: 52.5311 },
      avatar: DOCTOR_DEFAULT_AVATAR,
      rating: 4.85,
      reviewCount: 290,
      experienceYears: 20,
      biography: 'فلوشیپ تعویض مفصل زانو و ورزشی از آلمان. درمان دیسک کمر، آرتروز شدید و آسیب‌های رباط صلیبی.',
      insurances: ['تأمین اجتماعی', 'بیمه سلامت (خدمات درمانی)', 'نیروهای مسلح', 'بیمه البرز'],
      consultationTypes: ['text', 'voice', 'video'],
      prices: { text: 150000, voice: 200000, video: 250000 },
      isVerified: true,
      status: 'active',
      hospitalOrClinic: 'بیمارستان چمران و کلینیک ارتوپدی پارس',
      onlineStatus: 'offline',
      workingHours: [
        { day: 'یکشنبه', dayIndex: 1, slots: ['10:00', '10:30', '11:00', '17:00', '17:30'] },
        { day: 'سه شنبه', dayIndex: 3, slots: ['10:00', '10:30', '11:00', '17:00'] }
      ]
    },
    {
      id: 'doc-6',
      name: 'دکتر نسترن احمدی',
      title: 'پزشک عمومی و مشاور پلتفرم سلامت',
      specialtyId: 'general',
      specialtyName: 'پزشک عمومی',
      medicalCode: 'م-۳۱۰۲۹',
      city: 'تهران',
      address: 'تهران، خیابان شریعتی، بالاتر از سیدخندان، درمانگاه شبانه‌روزی آفتاب',
      location: { lat: 35.7421, lng: 51.4412 },
      avatar: DOCTOR_DEFAULT_AVATAR,
      rating: 4.95,
      reviewCount: 512,
      experienceYears: 8,
      biography: 'مشاور آنلاین و پاسخگویی سریع به سؤالات پزشکی عمومی، آزمایش‌ها، چکاپ سلامت و تجویز نسخه الکترونیک معتبر بیمه‌ای.',
      insurances: ['تأمین اجتماعی', 'بیمه سلامت (خدمات درمانی)', 'بیمه تکمیلی ایران', 'بیمه دانا', 'بیمه دی'],
      consultationTypes: ['text', 'voice', 'video'],
      prices: { text: 110000, voice: 150000, video: 180000 },
      isVerified: true,
      status: 'active',
      hospitalOrClinic: 'درمانگاه شبانه‌روزی آفتاب',
      onlineStatus: 'online',
      workingHours: [
        { day: 'شنبه', dayIndex: 0, slots: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'] },
        { day: 'یکشنبه', dayIndex: 1, slots: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
        { day: 'دوشنبه', dayIndex: 2, slots: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00'] },
        { day: 'سه شنبه', dayIndex: 3, slots: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00'] },
        { day: 'چهارشنبه', dayIndex: 4, slots: ['08:00', '09:00', '10:00', '11:00'] }
      ]
    }
  ];

  let docCounter = 7;

  // Generate additional doctors for each specialty to guarantee at least 10 doctors per specialty
  INITIAL_SPECIALTIES.forEach((specialty) => {
    const existingCount = doctors.filter((d) => d.specialtyId === specialty.id).length;
    const needed = 10 - existingCount;

    for (let i = 0; i < needed; i++) {
      const isFemale = (docCounter + i) % 2 === 0;
      const firstName = isFemale
        ? DOCTOR_FIRST_NAMES_FEMALE[(docCounter + i) % DOCTOR_FIRST_NAMES_FEMALE.length]
        : DOCTOR_FIRST_NAMES_MALE[(docCounter + i) % DOCTOR_FIRST_NAMES_MALE.length];
      const lastName = DOCTOR_LAST_NAMES[(docCounter * 3 + i * 7) % DOCTOR_LAST_NAMES.length];
      const city = CITIES_LIST[(docCounter + i) % CITIES_LIST.length];
      const codeNum = 10000 + (docCounter * 137) % 89999;

      doctors.push({
        id: `doc-${docCounter}`,
        name: `دکتر ${firstName} ${lastName}`,
        title: `متخصص ${specialty.name} و مشاوره آنلاین`,
        specialtyId: specialty.id,
        specialtyName: specialty.name,
        medicalCode: `م-${codeNum}`,
        city: city,
        address: `${city}، خیابان اصلی، مرکز پزشکی و سلامت آنلاین شماره ${i + 1}`,
        location: { lat: 35.7 + (i * 0.01), lng: 51.4 + (i * 0.01) },
        avatar: DOCTOR_DEFAULT_AVATAR,
        rating: Number((4.5 + ((i % 5) * 0.1)).toFixed(1)),
        reviewCount: 45 + (i * 18),
        experienceYears: 6 + (i % 15),
        biography: `دارای بورد تخصصی در زمینه ${specialty.name}، عضو انجمن پزشکی کشور با سابقه درخشان در ویزیت و مشاوره آنلاین و حضوری بیماران.`,
        insurances: ['تأمین اجتماعی', 'بیمه سلامت (خدمات درمانی)', 'بیمه تکمیلی ایران'],
        consultationTypes: ['text', 'voice', 'video'],
        prices: {
          text: 120000 + (i % 4) * 10000,
          voice: 160000 + (i % 4) * 15000,
          video: 200000 + (i % 4) * 20000
        },
        isVerified: true,
        status: 'active',
        hospitalOrClinic: `کلینیک تخصصی ${specialty.name} ${city}`,
        onlineStatus: (i % 2 === 0) ? 'online' : 'offline',
        workingHours: [
          { day: 'شنبه', dayIndex: 0, slots: ['09:00', '10:00', '11:00', '16:00', '17:00'] },
          { day: 'دوشنبه', dayIndex: 2, slots: ['09:30', '10:30', '16:30', '17:30'] },
          { day: 'چهارشنبه', dayIndex: 4, slots: ['10:00', '11:00', '17:00'] }
        ]
      });

      docCounter++;
    }
  });

  return doctors;
}

export const INITIAL_DOCTORS: Doctor[] = generateDoctorsList();

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-101',
    trackingCode: 'MED-984210',
    patientId: 'patient-1',
    patientName: 'علی ضیائی',
    patientPhone: '09123456789',
    doctorId: 'doc-1',
    doctorName: 'دکتر مریم رضایی',
    doctorTitle: 'فوق تخصص قلب و عروق',
    doctorAvatar: DOCTOR_DEFAULT_AVATAR,
    specialtyName: 'قلب و عروق',
    type: 'video',
    date: '1403/05/15',
    time: '16:30',
    price: 240000,
    insuranceUsed: 'بیمه تکمیلی ایران',
    status: 'scheduled',
    symptoms: 'احساس تپش قلب پس از فعالیت ورزشی و درد خفیف قفسه سینه',
    createdAt: '1403/05/10'
  },
  {
    id: 'app-102',
    trackingCode: 'MED-771203',
    patientId: 'patient-1',
    patientName: 'علی ضیائی',
    patientPhone: '09123456789',
    doctorId: 'doc-6',
    doctorName: 'دکتر نسترن احمدی',
    doctorTitle: 'پزشک عمومی',
    doctorAvatar: DOCTOR_DEFAULT_AVATAR,
    specialtyName: 'پزشک عمومی',
    type: 'text',
    date: '1403/05/02',
    time: '10:00',
    price: 110000,
    insuranceUsed: 'تأمین اجتماعی',
    status: 'completed',
    symptoms: 'بررسی جواب آزمایش خون سالیانه و کمبود ویتامین D',
    createdAt: '1403/05/01'
  }
];

export const INITIAL_MEDICAL_RECORD: MedicalRecord = {
  id: 'med-rec-1',
  patientId: 'patient-1',
  bloodType: 'O+',
  allergies: ['پنی‌سیلین', 'گرد و غبار'],
  chronicDiseases: ['فشار خون خفیف'],
  currentMedications: ['قرص لوزارتان ۲۵ میلی‌گرم روزانه', 'ویتامین D3 ماهانه'],
  pastSurgeries: ['عمل جراحی آپاندیس (۱۳۹۸)'],
  emergencyContact: {
    name: 'رضا ضیائی',
    phone: '09129876543',
    relation: 'برادر'
  },
  uploadedFiles: [
    {
      id: 'file-1',
      title: 'آزمایش جامع خون و چربی',
      date: '1403/04/20',
      url: '#',
      type: 'lab'
    },
    {
      id: 'file-2',
      title: 'نوار قلب (ECG) چکاپ',
      date: '1402/11/15',
      url: '#',
      type: 'other'
    }
  ]
};

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'presc-1',
    appointmentId: 'app-102',
    trackingCode: 'RX-90812345',
    doctorId: 'doc-6',
    doctorName: 'دکتر نسترن احمدی',
    medicalCode: 'م-۳۱۰۲۹',
    patientId: 'patient-1',
    patientName: 'علی ضیائی',
    patientNationalId: '0019283746',
    date: '1403/05/02',
    diagnosis: 'کمبود سرمی ویتامین D3 و چربی خون مرزی',
    items: [
      {
        drugName: 'Pearl Vitamin D3 50,000 IU',
        dosage: 'هر ماه یک عدد بعد از غذا',
        quantity: 4,
        description: 'دوره ۴ ماهه میل شود'
      },
      {
        drugName: 'Cap Omega-3 1000 mg',
        dosage: 'روزانه یک عدد همراه با وعده اصلی',
        quantity: 30
      }
    ],
    labTests: ['سنجش 25-hydroxy Vitamin D3 چهار ماه بعد'],
    instructions: 'کاهش مصرف نمک و چربی‌های اشباع، روزانه ۳۰ دقیقه پیاده‌روی تند.'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    doctorId: 'doc-1',
    patientId: 'p-200',
    patientName: 'محمدحسین رضایی',
    rating: 5,
    comment: 'خانم دکتر بسیار صبور و بااخلاق هستند. روند درمان مادرم را با دقت کامل در مشاوره آنلاین بررسی کردند و بسیار راضی بودیم.',
    date: '1403/05/01',
    consultationType: 'voice',
    waitDuration: 'کمتر از ۵ دقیقه',
    doctorResponse: 'با سلام و احترام، خوشحالم که حال مادرتان بهتر است. سلامت باشید.',
    isApproved: true
  },
  {
    id: 'rev-2',
    doctorId: 'doc-1',
    patientId: 'p-201',
    patientName: 'زهرا موسوی',
    rating: 5,
    comment: 'مشاوره تصویری کیفیت عالی داشت. نسخه آنلاین بلافاصله در سامانه تأمین اجتماعی ثبت شد.',
    date: '1403/04/28',
    consultationType: 'video',
    isApproved: true
  },
  {
    id: 'rev-3',
    doctorId: 'doc-2',
    patientId: 'p-202',
    patientName: 'امیر سامان',
    rating: 4,
    comment: 'تشخیص عالی برای مشکل جوش و آکنه صورت داشتند. داروها بعد دو هفته تأثیر خوبی گذاشت.',
    date: '1403/04/25',
    consultationType: 'text',
    isApproved: true
  }
];

export const INITIAL_BLOG_ARTICLES: BlogArticle[] = [
  {
    id: 'blog-1',
    title: '۱۰ نشانه مهم فشار خون بالا که نباید نادیده بگیرید',
    category: 'سلامت قلب',
    author: 'دکتر مریم رضایی',
    authorRole: 'متخصص قلب و عروق',
    readTime: '۵ دقیقه',
    date: '۱۰ مرداد ۱۴۰۳',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    summary: 'فشار خون بالا به عنوان قاتل خاموش شناخته می‌شود. آشنایی با علائم اولیه و راهکارهای پیشگیری به موقع می‌تواند از سکته‌های قلبی و مغزی جلوگیری کند.',
    content: `فشار خون بالا یکی از شایع‌ترین بیماری‌های مزمن در سراسر جهان است. متأسفانه بسیاری از افراد تا زمان بروز عوارض شدید از بیماری خود بی‌خبر هستند.
    
### مهم‌ترین علائم فشار خون بالا:
۱. سردردهای مداوم به‌ویژه در ناحیه پشت سر و هنگام صبح
۲. سرگیجه و احساس سبکی سر
۳. تاری دید یا دیدن نقاط سیاه
۴. احساس تپش قلب و سنگینی در قفسه سینه
۵. تنگ شدن نفس هنگام فعالیت‌های معمولی

### راهکارهای کنترل:
- کاهش مصرف نمک و غذاهای فراوری شده
- فعالیت ورزشی منظم حداقل ۱۵۰ دقیقه در هفته
- کنترل وزن و مدیریت استرس روزانه
- چکاپ منظم فشار خون توسط پزشک`,
    tags: ['فشار خون', 'سلامت قلب', 'پیشگیری']
  },
  {
    id: 'blog-2',
    title: 'راهنمای مراقبت از پوست در فصل تابستان و هوای گرم',
    category: 'پوست و زیبایی',
    author: 'دکتر علیرضا کاظمی',
    authorRole: 'متخصص پوست و مو',
    readTime: '۴ دقیقه',
    date: '۰۵ مرداد ۱۴۰۳',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=80',
    summary: 'اشعه ماورای بنفش خورشید در تابستان می‌تواند باعث ایجاد لک، پیری زودرس و آسیب پوستی شود. روش‌های صحیح محافظت از پوست را بخوانید.',
    content: `تابستان فصلی زیبا اما پرچالش برای سلامت پوست است. افزایش شدت نور آفتاب و تعریق زیاد می‌تواند مشکلات پوستی را تشدید کند.

### نکات کلیدی مراقبت تابستانی:
- استفاده سخاوتمندانه از ضدآفتاب با SPF ۳۰ به بالا
- تجدید ضدآفتاب هر ۲ ساعت یک‌بار
- استفاده از آبرسان‌های برپایه آب و سبک
- نوشیدن حداقل ۸ لیوان آب در روز
- استفاده از کلاه نقاب‌دار و عینک آفتابی استاندارد`,
    tags: ['پوست', 'ضدآفتاب', 'مراقبت تابستانی']
  },
  {
    id: 'blog-3',
    title: 'تأثیر اضطراب بر سلامت جسمانی و راه‌های کنترل آن',
    category: 'بهداشت روان',
    author: 'دکتر کامران ابراهیمی',
    authorRole: 'متخصص روانپزشکی',
    readTime: '۶ دقیقه',
    date: '۰۱ مرداد ۱۴۰۳',
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=800&auto=format&fit=crop&q=80',
    summary: 'استرس و اضطراب مزمن علاوه بر روح، بر تمام ارگان‌های بدن از جمله دستگاه گوارش، سیستم ایمنی و قلب اثر مخرب دارد.',
    content: `ارتباط تنگاتنگی میان ذهن و جسم وجود دارد. وقتی دچار اضطراب می‌شوید، هورمون کورتیزول در بدن ترشح شده و بدن را در حالت آماده‌باش قرار می‌دهد.

### راهکارهای تکنیکال آرام‌سازی:
- تنفس دیافراگمی (چهار ثانیه دم، چهار ثانیه حبس، شش ثانیه بازدم)
- پیاده‌روی و تمرینات کششی
- کاهش مصرف کافئین و نوشیدنی‌های انرژی‌زا
- بهره‌گیری از مشاوره روانپزشکی در صورت مداومت علائم`,
    tags: ['اضطراب', 'سلامت روان', 'استرس']
  }
];

export const CURRENT_USER_PATIENT: User = {
  id: 'patient-1',
  name: 'علی ضیائی',
  phone: '09123456789',
  email: 'aliziaye1382@gmail.com',
  role: 'patient',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
  nationalId: '0019283746',
  birthDate: '1372/06/15',
  gender: 'male',
  city: 'تهران',
  walletBalance: 850000
};

export const CURRENT_USER_DOCTOR: User = {
  id: 'doc-1',
  name: 'دکتر مریم رضایی',
  phone: '09121112233',
  email: 'doc.rezaei@snappdoctor.ir',
  role: 'doctor',
  avatar: DOCTOR_DEFAULT_AVATAR,
  nationalId: '0021345678',
  birthDate: '1360/02/10',
  gender: 'female',
  city: 'تهران',
  walletBalance: 4250000
};

export const CURRENT_USER_ADMIN: User = {
  id: 'admin-1',
  name: 'مدیر ارشد سامانه',
  phone: '09120000000',
  email: 'admin@healthportal.ir',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
  walletBalance: 12500000
};
