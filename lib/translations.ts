export type TranslationSet = {
  header: {
    nav: {
      learn: string
      explore: string
      labs: string
      resources: string
      about: string
    }
    selectLanguage: string
    languageOptions: string
    home: string
    signIn: string
    getStarted: string
    openMenu: string
    closeMenu: string
  }
  hero: {
    eyebrow: string
    headlineLead: string
    headlineMaster: string
    headlineAccent: string
    description: string
    startLearning: string
    explorePlatform: string
    trustedBy: string
    learnersWorldwide: string
  }
  features: {
    learning: { title: string; description: string }
    circuit: { title: string; description: string }
    experiment: { title: string; description: string }
    assistance: { title: string; description: string }
  }
  stats: {
    activeLearners: string
    circuitsBuilt: string
    experimentsRun: string
    quantumConcepts: string
    learnerRating: string
  }
  app: {
    dashboard: string
    courses: string
    circuitBuilder: string
    simulator: string
    aiTutor: string
    challenges: string
    dashboardNavigation: string
    closeNavigation: string
    openNavigation: string
    dashboardHome: string
    logOut: string
  }
  aiTutor: AiTutorTranslations
  dashboard: DashboardTranslations
}

export type AiTutorTranslations = {
  title: string
  subtitle: string
  contextLabel: string
  currentLesson: string
  noActiveLesson: string
  student: string
  tutor: string
  placeholder: string
  send: string
  welcomeTitle: string
  welcomeDescription: string
  thinking: string
  clearConversation: string
  messageListLabel: string
  requestError: string
  authError: string
  tryAgain: string
}

const ENGLISH_AI_TUTOR: AiTutorTranslations = {
  title: 'AI Tutor',
  subtitle: 'Your personal quantum-computing learning assistant',
  contextLabel: 'Learning context',
  currentLesson: 'Current lesson',
  noActiveLesson: 'No active lesson yet',
  student: 'Student',
  tutor: 'AI Tutor',
  placeholder: 'Ask a question about quantum computing…',
  send: 'Send',
  welcomeTitle: 'What would you like to explore?',
  welcomeDescription: 'Ask about qubits, gates, algorithms, or anything in your current lesson.',
  thinking: 'AI Tutor is thinking…',
  clearConversation: 'Clear conversation',
  messageListLabel: 'Conversation with AI Tutor',
  requestError: "I couldn't connect to the AI Tutor right now. Please try again in a moment.",
  authError: 'Please sign in to continue.',
  tryAgain: 'Try again',
}

const HINDI_AI_TUTOR: AiTutorTranslations = {
  title: 'AI ट्यूटर',
  subtitle: 'आपका व्यक्तिगत क्वांटम-कंप्यूटिंग सीखने का सहायक',
  contextLabel: 'सीखने का संदर्भ',
  currentLesson: 'वर्तमान पाठ',
  noActiveLesson: 'अभी कोई सक्रिय पाठ नहीं है',
  student: 'शिक्षार्थी',
  tutor: 'AI ट्यूटर',
  placeholder: 'क्वांटम कंप्यूटिंग के बारे में प्रश्न पूछें…',
  send: 'भेजें',
  welcomeTitle: 'आप क्या जानना चाहेंगे?',
  welcomeDescription: 'क्यूबिट, गेट, एल्गोरिदम या अपने वर्तमान पाठ के बारे में पूछें।',
  thinking: 'AI ट्यूटर सोच रहा है…',
  clearConversation: 'बातचीत साफ़ करें',
  messageListLabel: 'AI ट्यूटर के साथ बातचीत',
  requestError: 'अभी AI ट्यूटर से कनेक्ट नहीं हो सका। कृपया कुछ देर बाद फिर कोशिश करें।',
  authError: 'जारी रखने के लिए साइन इन करें।',
  tryAgain: 'फिर कोशिश करें',
}

export type DashboardTranslations = {
  welcomeBack: (name: string) => string
  leftOff: string
  learningPathComplete: string
  resuming: string
  allCourseLevelsCompleted: string
  lessonsComplete: (completed: number, total: number) => string
  lessonProgress: (current: number, total: number) => string
  reviewCourses: string
  resume: string
  currentLearningProgress: string
  modules: string
  streak: string
  streakDays: (days: number) => string
  circuitsBuilt: string
  badges: string
  courses: string
  qubitsToAlgorithms: string
  circuitBuilder: string
  dragDropBuild: string
  simulator: string
  runAndExplore: string
  aiTutor: string
  askAnytime: string
  challenges: string
  testYourUnderstanding: string
  recommendedNext: string
  recentActivity: string
  complete: string
  progressDialAriaLabel: (completion: number) => string
  learningStatistics: string
  dashboardActivityAndModules: string
  recommendations: {
    reviseEntanglement: string
    tryBellState: string
    continueDeutschJozsa: string
  }
  activity: {
    completedQuantumGates: string
    builtBellState: string
    scoredSuperposition: string
    startedQuantumEntanglement: string
    relativeDays: (days: number) => string
  }
}

const ENGLISH_DASHBOARD: DashboardTranslations = {
  welcomeBack: name => `Welcome back, ${name}`,
  leftOff: "Here's where you left off.",
  learningPathComplete: 'Learning path complete',
  resuming: 'Resuming',
  allCourseLevelsCompleted: 'All course levels completed',
  lessonsComplete: (completed, total) => `${completed} of ${total} lessons complete`,
  lessonProgress: (current, total) => `Lesson ${current} of ${total}`,
  reviewCourses: 'Review courses',
  resume: 'Resume',
  currentLearningProgress: 'Current learning progress',
  modules: 'Modules',
  streak: 'Streak',
  streakDays: days => `${days} days`,
  circuitsBuilt: 'Circuits built',
  badges: 'Badges',
  courses: 'Courses',
  qubitsToAlgorithms: 'Qubits to algorithms',
  circuitBuilder: 'Circuit builder',
  dragDropBuild: 'Drag, drop, build',
  simulator: 'Simulator',
  runAndExplore: 'Run and explore',
  aiTutor: 'AI tutor',
  askAnytime: 'Ask, anytime',
  challenges: 'Challenges',
  testYourUnderstanding: 'Test your understanding',
  recommendedNext: 'Recommended next',
  recentActivity: 'Recent activity',
  complete: 'Complete',
  progressDialAriaLabel: completion => `${completion}% complete`,
  learningStatistics: 'Learning statistics',
  dashboardActivityAndModules: 'Dashboard activity and modules',
  recommendations: {
    reviseEntanglement: 'Revise: Entanglement',
    tryBellState: 'Try: Bell-State Challenge',
    continueDeutschJozsa: 'Continue to: Deutsch-Jozsa Algorithm',
  },
  activity: {
    completedQuantumGates: 'Completed Quantum Gates',
    builtBellState: 'Built a Bell State circuit',
    scoredSuperposition: 'Scored 90% on Superposition',
    startedQuantumEntanglement: 'Started Quantum Entanglement',
    relativeDays: days => `${days}d`,
  },
}

const HINDI_DASHBOARD: DashboardTranslations = {
  welcomeBack: name => `वापसी पर स्वागत है, ${name}`,
  leftOff: 'आपने यहाँ से सीखना छोड़ा था।',
  learningPathComplete: 'लर्निंग पथ पूरा हुआ',
  resuming: 'जारी है',
  allCourseLevelsCompleted: 'सभी पाठ्यक्रम स्तर पूरे हो गए',
  lessonsComplete: (completed, total) => `${total} में से ${completed} पाठ पूरे हुए`,
  lessonProgress: (current, total) => `${total} में से पाठ ${current}`,
  reviewCourses: 'पाठ्यक्रम देखें',
  resume: 'जारी रखें',
  currentLearningProgress: 'वर्तमान सीखने की प्रगति',
  modules: 'मॉड्यूल',
  streak: 'लगातार सीखने के दिन',
  streakDays: days => `${days} दिन`,
  circuitsBuilt: 'बनाए गए सर्किट',
  badges: 'बैज',
  courses: 'पाठ्यक्रम',
  qubitsToAlgorithms: 'क्यूबिट से एल्गोरिदम तक',
  circuitBuilder: 'सर्किट बिल्डर',
  dragDropBuild: 'खींचें, छोड़ें, बनाएँ',
  simulator: 'सिमुलेटर',
  runAndExplore: 'चलाएँ और जानें',
  aiTutor: 'AI ट्यूटर',
  askAnytime: 'कभी भी पूछें',
  challenges: 'चुनौतियाँ',
  testYourUnderstanding: 'अपनी समझ परखें',
  recommendedNext: 'आगे के सुझाव',
  recentActivity: 'हाल की गतिविधि',
  complete: 'पूरा',
  progressDialAriaLabel: completion => `${completion}% पूरा`,
  learningStatistics: 'सीखने के आँकड़े',
  dashboardActivityAndModules: 'डैशबोर्ड गतिविधि और मॉड्यूल',
  recommendations: {
    reviseEntanglement: 'दोबारा सीखें: एंटैंगलमेंट',
    tryBellState: 'आज़माएँ: बेल-स्टेट चुनौती',
    continueDeutschJozsa: 'जारी रखें: ड्यूश-जोज़्सा एल्गोरिदम',
  },
  activity: {
    completedQuantumGates: 'क्वांटम गेट्स पूरे किए',
    builtBellState: 'बेल स्टेट सर्किट बनाया',
    scoredSuperposition: 'सुपरपोज़िशन पर 90% अंक',
    startedQuantumEntanglement: 'क्वांटम एंटैंगलमेंट शुरू किया',
    relativeDays: days => `${days} दिन`,
  },
}

const ENGLISH: TranslationSet = {
  header: {
    nav: {
      learn: 'Learn',
      explore: 'Explore',
      labs: 'Labs',
      resources: 'Resources',
      about: 'About Us',
    },
    selectLanguage: 'Select language',
    languageOptions: 'Language options',
    home: 'SankalpQ home',
    signIn: 'Sign In',
    getStarted: 'Get Started',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  hero: {
    eyebrow: 'Quantum Learning. Reinvented.',
    headlineLead: 'Learn. Build. Simulate.',
    headlineMaster: 'Master',
    headlineAccent: 'Quantum Computing.',
    description:
      'SankalpQ is an all-in-one platform to learn quantum concepts, build circuits, run simulations, and get AI-powered assistance every step of the way.',
    startLearning: 'Start Learning',
    explorePlatform: 'Explore Platform',
    trustedBy: 'Trusted by',
    learnersWorldwide: 'learners and educators worldwide',
  },
  features: {
    learning: {
      title: 'Interactive Learning',
      description:
        'Follow guided lessons, visual explanations, and progression paths that make quantum concepts easier to apply.',
    },
    circuit: {
      title: 'Build & Visualize',
      description:
        'Assemble gates on a drag-and-drop circuit canvas, then inspect the logic behind every operation.',
    },
    experiment: {
      title: 'Simulate & Experiment',
      description:
        'Run experiments, compare outcomes, and explore how quantum algorithms behave before using real hardware.',
    },
    assistance: {
      title: 'AI-Powered Assistance',
      description:
        'Get contextual hints, debugging guidance, and personalized next steps while you learn and build.',
    },
  },
  stats: {
    activeLearners: 'Active Learners',
    circuitsBuilt: 'Circuits Built',
    experimentsRun: 'Experiments Run',
    quantumConcepts: 'Quantum Concepts',
    learnerRating: 'Learner Rating',
  },
  app: {
    dashboard: 'Dashboard',
    courses: 'Courses',
    circuitBuilder: 'Circuit Builder',
    simulator: 'Simulator',
    aiTutor: 'AI Tutor',
    challenges: 'Challenges',
    dashboardNavigation: 'Dashboard navigation',
    closeNavigation: 'Close navigation',
    openNavigation: 'Open navigation',
    dashboardHome: 'SankalpQ dashboard',
    logOut: 'Log out',
  },
    aiTutor: ENGLISH_AI_TUTOR,
    dashboard: ENGLISH_DASHBOARD,
}

export const TRANSLATIONS: Record<string, TranslationSet> = {
  EN: ENGLISH,
  HI: {
    header: {
      nav: { learn: 'सीखें', explore: 'खोजें', labs: 'लैब्स', resources: 'संसाधन', about: 'हमारे बारे में' },
      selectLanguage: 'भाषा चुनें', languageOptions: 'भाषा विकल्प', home: 'संकल्पQ होम',
      signIn: 'साइन इन', getStarted: 'शुरू करें', openMenu: 'मेन्यू खोलें', closeMenu: 'मेन्यू बंद करें',
    },
    hero: {
      eyebrow: 'क्वांटम लर्निंग। नए अंदाज़ में।', headlineLead: 'सीखें। बनाएँ। सिमुलेट करें।', headlineMaster: 'महारत पाएँ', headlineAccent: 'क्वांटम कंप्यूटिंग में।',
      description: 'क्वांटम अवधारणाएँ सीखें, सर्किट बनाएँ, सिमुलेशन चलाएँ और हर कदम पर AI की मदद पाएँ।',
      startLearning: 'सीखना शुरू करें', explorePlatform: 'प्लेटफ़ॉर्म देखें', trustedBy: 'भरोसा करते हैं', learnersWorldwide: 'दुनिया भर के शिक्षार्थी और शिक्षक',
    },
    features: {
      learning: { title: 'इंटरैक्टिव लर्निंग', description: 'निर्देशित पाठों, विज़ुअल समझ और प्रगति पथों से क्वांटम अवधारणाओं को आसानी से लागू करना सीखें।' },
      circuit: { title: 'बनाएँ और विज़ुअलाइज़ करें', description: 'ड्रैग-एंड-ड्रॉप सर्किट कैनवास पर गेट जोड़ें और हर ऑपरेशन के पीछे का लॉजिक समझें।' },
      experiment: { title: 'सिमुलेट करें और प्रयोग करें', description: 'प्रयोग चलाएँ, परिणामों की तुलना करें और वास्तविक हार्डवेयर से पहले क्वांटम एल्गोरिदम को परखें।' },
      assistance: { title: 'AI सहायता', description: 'सीखते और बनाते समय संदर्भानुकूल संकेत, डिबगिंग मार्गदर्शन और अगले कदम पाएँ।' },
    },
    stats: { activeLearners: 'सक्रिय शिक्षार्थी', circuitsBuilt: 'बने हुए सर्किट', experimentsRun: 'चलाए गए प्रयोग', quantumConcepts: 'क्वांटम अवधारणाएँ', learnerRating: 'शिक्षार्थी रेटिंग' },
    app: { dashboard: 'डैशबोर्ड', courses: 'पाठ्यक्रम', circuitBuilder: 'सर्किट बिल्डर', simulator: 'सिमुलेटर', aiTutor: 'AI ट्यूटर', challenges: 'चुनौतियाँ', dashboardNavigation: 'डैशबोर्ड नेविगेशन', closeNavigation: 'नेविगेशन बंद करें', openNavigation: 'नेविगेशन खोलें', dashboardHome: 'संकल्पQ डैशबोर्ड', logOut: 'लॉग आउट' },
    aiTutor: HINDI_AI_TUTOR,
    dashboard: HINDI_DASHBOARD,
  },
  BN: {
    header: {
      nav: { learn: 'শিখুন', explore: 'অন্বেষণ', labs: 'ল্যাব', resources: 'রিসোর্স', about: 'আমাদের সম্পর্কে' },
      selectLanguage: 'ভাষা বেছে নিন', languageOptions: 'ভাষার বিকল্প', home: 'সঙ্কল্পQ হোম', signIn: 'সাইন ইন', getStarted: 'শুরু করুন', openMenu: 'মেনু খুলুন', closeMenu: 'মেনু বন্ধ করুন',
    },
    hero: {
      eyebrow: 'কোয়ান্টাম লার্নিং। নতুনভাবে।', headlineLead: 'শিখুন। তৈরি করুন। সিমুলেট করুন।', headlineMaster: 'আয়ত্ত করুন', headlineAccent: 'কোয়ান্টাম কম্পিউটিং।',
      description: 'কোয়ান্টাম ধারণা শিখুন, সার্কিট তৈরি করুন, সিমুলেশন চালান এবং প্রতিটি ধাপে AI সহায়তা পান।', startLearning: 'শেখা শুরু করুন', explorePlatform: 'প্ল্যাটফর্ম দেখুন', trustedBy: 'আস্থা রাখেন', learnersWorldwide: 'বিশ্বের শিক্ষার্থী ও শিক্ষকরা',
    },
    features: {
      learning: { title: 'ইন্টার‌্যাক্টিভ লার্নিং', description: 'গাইডেড পাঠ, ভিজ্যুয়াল ব্যাখ্যা ও অগ্রগতির পথ ধরে কোয়ান্টাম ধারণা প্রয়োগ করতে শিখুন।' },
      circuit: { title: 'তৈরি ও ভিজ্যুয়ালাইজ করুন', description: 'ড্র্যাগ-এন্ড-ড্রপ সার্কিট ক্যানভাসে গেট সাজিয়ে প্রতিটি অপারেশনের যুক্তি দেখুন।' },
      experiment: { title: 'সিমুলেট ও পরীক্ষা করুন', description: 'পরীক্ষা চালান, ফলাফল তুলনা করুন এবং বাস্তব হার্ডওয়্যারের আগে কোয়ান্টাম অ্যালগরিদম দেখুন।' },
      assistance: { title: 'AI সহায়তা', description: 'শেখা ও তৈরি করার সময় প্রাসঙ্গিক ইঙ্গিত, ডিবাগিং নির্দেশনা এবং পরবর্তী পদক্ষেপ পান।' },
    },
    stats: { activeLearners: 'সক্রিয় শিক্ষার্থী', circuitsBuilt: 'তৈরি সার্কিট', experimentsRun: 'চালানো পরীক্ষা', quantumConcepts: 'কোয়ান্টাম ধারণা', learnerRating: 'শিক্ষার্থী রেটিং' },
    app: { dashboard: 'ড্যাশবোর্ড', courses: 'কোর্স', circuitBuilder: 'সার্কিট বিল্ডার', simulator: 'সিমুলেটর', aiTutor: 'AI টিউটর', challenges: 'চ্যালেঞ্জ', dashboardNavigation: 'ড্যাশবোর্ড নেভিগেশন', closeNavigation: 'নেভিগেশন বন্ধ করুন', openNavigation: 'নেভিগেশন খুলুন', dashboardHome: 'সঙ্কল্পQ ড্যাশবোর্ড', logOut: 'লগ আউট' },
    aiTutor: ENGLISH_AI_TUTOR,
    dashboard: ENGLISH_DASHBOARD,
  },
  TA: {
    header: {
      nav: { learn: 'கற்க', explore: 'ஆராய', labs: 'ஆய்வகங்கள்', resources: 'வளங்கள்', about: 'எங்களைப் பற்றி' },
      selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்', languageOptions: 'மொழி விருப்பங்கள்', home: 'சங்கல்பQ முகப்பு', signIn: 'உள்நுழைக', getStarted: 'தொடங்குங்கள்', openMenu: 'மெனுவைத் திறக்கவும்', closeMenu: 'மெனுவை மூடவும்',
    },
    hero: {
      eyebrow: 'குவாண்டம் கற்றல். புதிய அனுபவம்.', headlineLead: 'கற்கவும். உருவாக்கவும். சிமுலேட் செய்யவும்.', headlineMaster: 'தேர்ச்சி பெறுங்கள்', headlineAccent: 'குவாண்டம் கம்ப்யூட்டிங்கில்.',
      description: 'குவாண்டம் கருத்துகளைக் கற்று, சர்க்யூட்களை உருவாக்கி, சிமுலேஷன்களை இயக்கி, ஒவ்வொரு படியிலும் AI உதவியைப் பெறுங்கள்.', startLearning: 'கற்கத் தொடங்குங்கள்', explorePlatform: 'தளத்தைப் பாருங்கள்', trustedBy: 'நம்புகின்றனர்', learnersWorldwide: 'உலகெங்கும் உள்ள கற்றவர்கள் மற்றும் ஆசிரியர்கள்',
    },
    features: {
      learning: { title: 'ஊடாடும் கற்றல்', description: 'வழிகாட்டப்பட்ட பாடங்கள், காட்சிப்படுத்தல்கள் மற்றும் முன்னேற்றப் பாதைகள் மூலம் குவாண்டம் கருத்துகளைக் கற்றுக்கொள்ளுங்கள்.' },
      circuit: { title: 'உருவாக்கி காட்சிப்படுத்துங்கள்', description: 'டிராக்-அண்ட்-டிராப் சர்க்யூட் கேன்வாஸில் கேட்களை அமைத்து, ஒவ்வொரு செயல்பாட்டின் தர்க்கத்தையும் பாருங்கள்.' },
      experiment: { title: 'சிமுலேட் செய்து பரிசோதியுங்கள்', description: 'பரிசோதனைகளை இயக்கி, முடிவுகளை ஒப்பிட்டு, உண்மையான வன்பொருளுக்கு முன் குவாண்டம் அல்காரிதம்களை ஆராயுங்கள்.' },
      assistance: { title: 'AI உதவி', description: 'கற்கும் மற்றும் உருவாக்கும் போது சூழலுக்கேற்ற குறிப்புகள், பிழைத்திருத்த வழிகாட்டுதல் மற்றும் அடுத்த படிகளைப் பெறுங்கள்.' },
    },
    stats: { activeLearners: 'செயலில் உள்ள கற்றவர்கள்', circuitsBuilt: 'உருவாக்கிய சர்க்யூட்கள்', experimentsRun: 'இயக்கிய பரிசோதனைகள்', quantumConcepts: 'குவாண்டம் கருத்துகள்', learnerRating: 'கற்றவர் மதிப்பீடு' },
    app: { dashboard: 'டாஷ்போர்டு', courses: 'பாடங்கள்', circuitBuilder: 'சர்க்யூட் பில்டர்', simulator: 'சிமுலேட்டர்', aiTutor: 'AI டியூட்டர்', challenges: 'சவால்கள்', dashboardNavigation: 'டாஷ்போர்டு வழிசெலுத்தல்', closeNavigation: 'வழிசெலுத்தலை மூடவும்', openNavigation: 'வழிசெலுத்தலைத் திறக்கவும்', dashboardHome: 'சங்கல்பQ டாஷ்போர்டு', logOut: 'வெளியேறு' },
    aiTutor: ENGLISH_AI_TUTOR,
    dashboard: ENGLISH_DASHBOARD,
  },
  MR: {
    header: {
      nav: { learn: 'शिका', explore: 'अन्वेषण करा', labs: 'लॅब्स', resources: 'संसाधने', about: 'आमच्याबद्दल' },
      selectLanguage: 'भाषा निवडा', languageOptions: 'भाषेचे पर्याय', home: 'संकल्पQ होम', signIn: 'साइन इन', getStarted: 'सुरुवात करा', openMenu: 'मेनू उघडा', closeMenu: 'मेनू बंद करा',
    },
    hero: {
      eyebrow: 'क्वांटम लर्निंग. नव्या पद्धतीने.', headlineLead: 'शिका. तयार करा. सिम्युलेट करा.', headlineMaster: 'प्रभुत्व मिळवा', headlineAccent: 'क्वांटम कॉम्प्युटिंगवर.', description: 'क्वांटम संकल्पना शिका, सर्किट तयार करा, सिम्युलेशन चालवा आणि प्रत्येक टप्प्यावर AI ची मदत मिळवा.', startLearning: 'शिकायला सुरुवात करा', explorePlatform: 'प्लॅटफॉर्म पाहा', trustedBy: 'विश्वास ठेवतात', learnersWorldwide: 'जगभरातील विद्यार्थी आणि शिक्षक',
    },
    features: {
      learning: { title: 'परस्परसंवादी शिक्षण', description: 'मार्गदर्शित धडे, दृश्य स्पष्टीकरणे आणि प्रगतीच्या मार्गांनी क्वांटम संकल्पना वापरायला शिका.' },
      circuit: { title: 'तयार करा आणि पाहा', description: 'ड्रॅग-अँड-ड्रॉप सर्किट कॅनव्हासवर गेट्स लावा आणि प्रत्येक ऑपरेशनमागील लॉजिक समजून घ्या.' },
      experiment: { title: 'सिम्युलेट करा आणि प्रयोग करा', description: 'प्रयोग चालवा, परिणामांची तुलना करा आणि प्रत्यक्ष हार्डवेअरपूर्वी क्वांटम अल्गोरिदम तपासा.' },
      assistance: { title: 'AI सहाय्य', description: 'शिकताना आणि तयार करताना संदर्भानुसार सूचना, डीबगिंग मार्गदर्शन आणि पुढील पावले मिळवा.' },
    },
    stats: { activeLearners: 'सक्रिय विद्यार्थी', circuitsBuilt: 'तयार केलेली सर्किट्स', experimentsRun: 'चालवलेले प्रयोग', quantumConcepts: 'क्वांटम संकल्पना', learnerRating: 'विद्यार्थी रेटिंग' },
    app: { dashboard: 'डॅशबोर्ड', courses: 'अभ्यासक्रम', circuitBuilder: 'सर्किट बिल्डर', simulator: 'सिम्युलेटर', aiTutor: 'AI ट्यूटर', challenges: 'आव्हाने', dashboardNavigation: 'डॅशबोर्ड नेव्हिगेशन', closeNavigation: 'नेव्हिगेशन बंद करा', openNavigation: 'नेव्हिगेशन उघडा', dashboardHome: 'संकल्पQ डॅशबोर्ड', logOut: 'लॉग आउट' },
    aiTutor: ENGLISH_AI_TUTOR,
    dashboard: ENGLISH_DASHBOARD,
  },
  ZH: {
    header: {
      nav: { learn: '学习', explore: '探索', labs: '实验室', resources: '资源', about: '关于我们' },
      selectLanguage: '选择语言', languageOptions: '语言选项', home: 'SankalpQ 首页', signIn: '登录', getStarted: '开始使用', openMenu: '打开菜单', closeMenu: '关闭菜单',
    },
    hero: {
      eyebrow: '量子学习，焕然一新。', headlineLead: '学习。构建。模拟。', headlineMaster: '掌握', headlineAccent: '量子计算。', description: '学习量子概念，构建电路，运行模拟，并在每一步获得 AI 辅助。', startLearning: '开始学习', explorePlatform: '探索平台', trustedBy: '受到信赖', learnersWorldwide: '来自全球的学习者和教育者',
    },
    features: {
      learning: { title: '互动学习', description: '通过引导课程、可视化讲解和进阶路径，更轻松地应用量子概念。' },
      circuit: { title: '构建与可视化', description: '在拖放式电路画布上排列量子门，并查看每个操作背后的逻辑。' },
      experiment: { title: '模拟与实验', description: '运行实验、比较结果，在接触真实硬件前探索量子算法的表现。' },
      assistance: { title: 'AI 智能辅助', description: '学习和构建过程中，获得上下文提示、调试指导和个性化下一步建议。' },
    },
    stats: { activeLearners: '活跃学习者', circuitsBuilt: '已构建电路', experimentsRun: '已运行实验', quantumConcepts: '量子概念', learnerRating: '学习者评分' },
    app: { dashboard: '仪表盘', courses: '课程', circuitBuilder: '电路构建器', simulator: '模拟器', aiTutor: 'AI 导师', challenges: '挑战', dashboardNavigation: '仪表盘导航', closeNavigation: '关闭导航', openNavigation: '打开导航', dashboardHome: 'SankalpQ 仪表盘', logOut: '退出登录' },
    aiTutor: ENGLISH_AI_TUTOR,
    dashboard: ENGLISH_DASHBOARD,
  },
  ES: {
    header: {
      nav: { learn: 'Aprender', explore: 'Explorar', labs: 'Laboratorios', resources: 'Recursos', about: 'Sobre nosotros' },
      selectLanguage: 'Seleccionar idioma', languageOptions: 'Opciones de idioma', home: 'Inicio de SankalpQ', signIn: 'Iniciar sesión', getStarted: 'Comenzar', openMenu: 'Abrir menú', closeMenu: 'Cerrar menú',
    },
    hero: {
      eyebrow: 'Aprendizaje cuántico. Reinventado.', headlineLead: 'Aprende. Construye. Simula.', headlineMaster: 'Domina', headlineAccent: 'la computación cuántica.', description: 'Aprende conceptos cuánticos, construye circuitos, ejecuta simulaciones y recibe ayuda de IA en cada paso.', startLearning: 'Empezar a aprender', explorePlatform: 'Explorar la plataforma', trustedBy: 'Más de', learnersWorldwide: 'estudiantes y educadores de todo el mundo confían en nosotros',
    },
    features: {
      learning: { title: 'Aprendizaje interactivo', description: 'Sigue lecciones guiadas, explicaciones visuales y rutas de progreso para aplicar conceptos cuánticos.' },
      circuit: { title: 'Construye y visualiza', description: 'Organiza puertas en un lienzo de circuitos y revisa la lógica detrás de cada operación.' },
      experiment: { title: 'Simula y experimenta', description: 'Ejecuta experimentos, compara resultados y explora algoritmos cuánticos antes del hardware real.' },
      assistance: { title: 'Asistencia con IA', description: 'Obtén pistas contextuales, ayuda para depurar y próximos pasos personalizados mientras aprendes.' },
    },
    stats: { activeLearners: 'Estudiantes activos', circuitsBuilt: 'Circuitos creados', experimentsRun: 'Experimentos ejecutados', quantumConcepts: 'Conceptos cuánticos', learnerRating: 'Valoración de estudiantes' },
    app: { dashboard: 'Panel', courses: 'Cursos', circuitBuilder: 'Constructor de circuitos', simulator: 'Simulador', aiTutor: 'Tutor de IA', challenges: 'Desafíos', dashboardNavigation: 'Navegación del panel', closeNavigation: 'Cerrar navegación', openNavigation: 'Abrir navegación', dashboardHome: 'Panel de SankalpQ', logOut: 'Cerrar sesión' },
    aiTutor: ENGLISH_AI_TUTOR,
    dashboard: ENGLISH_DASHBOARD,
  },
  FR: {
    header: {
      nav: { learn: 'Apprendre', explore: 'Explorer', labs: 'Laboratoires', resources: 'Ressources', about: 'À propos' },
      selectLanguage: 'Choisir la langue', languageOptions: 'Options de langue', home: 'Accueil SankalpQ', signIn: 'Se connecter', getStarted: 'Commencer', openMenu: 'Ouvrir le menu', closeMenu: 'Fermer le menu',
    },
    hero: {
      eyebrow: 'L’apprentissage quantique. Réinventé.', headlineLead: 'Apprenez. Construisez. Simulez.', headlineMaster: 'Maîtrisez', headlineAccent: 'l’informatique quantique.', description: 'Apprenez les concepts quantiques, construisez des circuits, lancez des simulations et bénéficiez d’une aide IA à chaque étape.', startLearning: 'Commencer à apprendre', explorePlatform: 'Explorer la plateforme', trustedBy: 'Déjà adopté par', learnersWorldwide: 'des apprenants et des enseignants dans le monde entier',
    },
    features: {
      learning: { title: 'Apprentissage interactif', description: 'Suivez des leçons guidées, des explications visuelles et des parcours pour appliquer les concepts quantiques.' },
      circuit: { title: 'Construire et visualiser', description: 'Assemblez des portes sur un canevas de circuit et examinez la logique de chaque opération.' },
      experiment: { title: 'Simuler et expérimenter', description: 'Lancez des expériences, comparez les résultats et explorez les algorithmes quantiques avant le matériel réel.' },
      assistance: { title: 'Assistance par IA', description: 'Recevez des indications contextuelles, de l’aide au débogage et des étapes personnalisées pour progresser.' },
    },
    stats: { activeLearners: 'Apprenants actifs', circuitsBuilt: 'Circuits construits', experimentsRun: 'Expériences lancées', quantumConcepts: 'Concepts quantiques', learnerRating: 'Évaluation des apprenants' },
    app: { dashboard: 'Tableau de bord', courses: 'Cours', circuitBuilder: 'Constructeur de circuits', simulator: 'Simulateur', aiTutor: 'Tuteur IA', challenges: 'Défis', dashboardNavigation: 'Navigation du tableau de bord', closeNavigation: 'Fermer la navigation', openNavigation: 'Ouvrir la navigation', dashboardHome: 'Tableau de bord SankalpQ', logOut: 'Se déconnecter' },
    aiTutor: ENGLISH_AI_TUTOR,
    dashboard: ENGLISH_DASHBOARD,
  },
  AR: {
    header: {
      nav: { learn: 'تعلّم', explore: 'استكشف', labs: 'المختبرات', resources: 'الموارد', about: 'من نحن' },
      selectLanguage: 'اختر اللغة', languageOptions: 'خيارات اللغة', home: 'الصفحة الرئيسية لـ SankalpQ', signIn: 'تسجيل الدخول', getStarted: 'ابدأ الآن', openMenu: 'افتح القائمة', closeMenu: 'أغلق القائمة',
    },
    hero: {
      eyebrow: 'تعلّم الكم. بطريقة جديدة.', headlineLead: 'تعلّم. ابنِ. حاكِ.', headlineMaster: 'أتقن', headlineAccent: 'الحوسبة الكمّية.', description: 'تعلّم مفاهيم الكم، وابنِ الدوائر، وشغّل المحاكاة، واحصل على مساعدة بالذكاء الاصطناعي في كل خطوة.', startLearning: 'ابدأ التعلّم', explorePlatform: 'استكشف المنصة', trustedBy: 'يثق بنا', learnersWorldwide: 'من المتعلمين والمعلمين حول العالم',
    },
    features: {
      learning: { title: 'تعلّم تفاعلي', description: 'اتبع دروسًا موجّهة وشروحات مرئية ومسارات تقدّم لتطبيق مفاهيم الكم بسهولة.' },
      circuit: { title: 'ابنِ وتصور', description: 'رتّب البوابات على لوحة دوائر بالسحب والإفلات، وافهم المنطق وراء كل عملية.' },
      experiment: { title: 'حاكِ وجرّب', description: 'شغّل التجارب وقارن النتائج واستكشف الخوارزميات الكمّية قبل استخدام العتاد الحقيقي.' },
      assistance: { title: 'مساعدة بالذكاء الاصطناعي', description: 'احصل على تلميحات مناسبة للسياق وإرشادات لتصحيح الأخطاء وخطوات تالية مخصصة.' },
    },
    stats: { activeLearners: 'متعلمون نشطون', circuitsBuilt: 'دوائر مبنية', experimentsRun: 'تجارب منفذة', quantumConcepts: 'مفاهيم كمّية', learnerRating: 'تقييم المتعلمين' },
    app: { dashboard: 'لوحة التحكم', courses: 'الدورات', circuitBuilder: 'منشئ الدوائر', simulator: 'المحاكي', aiTutor: 'المعلّم الذكي', challenges: 'التحديات', dashboardNavigation: 'التنقل في لوحة التحكم', closeNavigation: 'إغلاق التنقل', openNavigation: 'فتح التنقل', dashboardHome: 'لوحة تحكم SankalpQ', logOut: 'تسجيل الخروج' },
    aiTutor: ENGLISH_AI_TUTOR,
    dashboard: ENGLISH_DASHBOARD,
  },
  PT: {
    header: {
      nav: { learn: 'Aprender', explore: 'Explorar', labs: 'Laboratórios', resources: 'Recursos', about: 'Sobre nós' },
      selectLanguage: 'Selecionar idioma', languageOptions: 'Opções de idioma', home: 'Início SankalpQ', signIn: 'Entrar', getStarted: 'Começar', openMenu: 'Abrir menu', closeMenu: 'Fechar menu',
    },
    hero: {
      eyebrow: 'Aprendizado quântico. Reinventado.', headlineLead: 'Aprenda. Construa. Simule.', headlineMaster: 'Domine', headlineAccent: 'a computação quântica.', description: 'Aprenda conceitos quânticos, construa circuitos, execute simulações e receba assistência de IA em cada etapa.', startLearning: 'Começar a aprender', explorePlatform: 'Explorar a plataforma', trustedBy: 'Mais de', learnersWorldwide: 'alunos e educadores do mundo todo confiam em nós',
    },
    features: {
      learning: { title: 'Aprendizado interativo', description: 'Siga aulas guiadas, explicações visuais e trilhas de progresso para aplicar conceitos quânticos.' },
      circuit: { title: 'Construa e visualize', description: 'Monte portas em um canvas de circuitos e examine a lógica por trás de cada operação.' },
      experiment: { title: 'Simule e experimente', description: 'Execute experimentos, compare resultados e explore algoritmos quânticos antes do hardware real.' },
      assistance: { title: 'Assistência com IA', description: 'Receba dicas contextuais, orientação para depuração e próximos passos personalizados enquanto aprende.' },
    },
    stats: { activeLearners: 'Alunos ativos', circuitsBuilt: 'Circuitos criados', experimentsRun: 'Experimentos executados', quantumConcepts: 'Conceitos quânticos', learnerRating: 'Avaliação dos alunos' },
    app: { dashboard: 'Painel', courses: 'Cursos', circuitBuilder: 'Construtor de circuitos', simulator: 'Simulador', aiTutor: 'Tutor de IA', challenges: 'Desafios', dashboardNavigation: 'Navegação do painel', closeNavigation: 'Fechar navegação', openNavigation: 'Abrir navegação', dashboardHome: 'Painel SankalpQ', logOut: 'Sair' },
    aiTutor: ENGLISH_AI_TUTOR,
    dashboard: ENGLISH_DASHBOARD,
  },
}

export function getTranslations(code: string): TranslationSet {
  return TRANSLATIONS[code] ?? ENGLISH
}
