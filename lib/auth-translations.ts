export interface AuthTranslations {
  loginTitle: string
  loginDescription: string
  registerTitle: string
  registerDescription: string
  email: string
  emailPlaceholder: string
  password: string
  passwordPlaceholder: string
  fullName: string
  fullNamePlaceholder: string
  confirmPassword: string
  passwordHint: string
  rememberMe: string
  forgotPassword: string
  selectRole: string
  student: string
  instructor: string
  agreeTo: string
  terms: string
  privacy: string
  and: string
  signIn: string
  createAccount: string
  or: string
  newTo: string
  alreadyHaveAccount: string
  continueGoogle: string
  continueGithub: string
  showPassword: string
  hidePassword: string
  emailRequired: string
  emailInvalid: string
  passwordRequired: string
  fullNameRequired: string
  passwordLength: string
  confirmPasswordRequired: string
  passwordsDoNotMatch: string
  termsRequired: string
  invalidCredentials: string
  signInFailed: string
  signUpFailed: string
  emailAlreadyRegistered: string
  checkEmail: string
  emailNotConfirmed: string
  rateLimited: string
  callbackFailed: string
  oauthComingSoon: string
  authUnavailable: string
  tryAgain: string
  loading: string
}

const ENGLISH_AUTH: AuthTranslations = {
  loginTitle: 'Welcome back',
  loginDescription: 'Sign in to continue your quantum learning journey.',
  registerTitle: 'Create your account',
  registerDescription: 'Join thousands of learners building the future of quantum computing.',
  email: 'Email',
  emailPlaceholder: 'you@example.com',
  password: 'Password',
  passwordPlaceholder: '••••••••',
  fullName: 'Full name',
  fullNamePlaceholder: 'Ada Lovelace',
  confirmPassword: 'Confirm password',
  passwordHint: 'At least 8 characters',
  rememberMe: 'Remember me',
  forgotPassword: 'Forgot password?',
  selectRole: 'Select role',
  student: 'Student',
  instructor: 'Instructor',
  agreeTo: 'I agree to the',
  terms: 'Terms of Service',
  privacy: 'Privacy Policy',
  and: 'and',
  signIn: 'Sign In',
  createAccount: 'Create Account',
  or: 'or',
  newTo: 'New to SankalpQ?',
  alreadyHaveAccount: 'Already have an account?',
  continueGoogle: 'Continue with Google',
  continueGithub: 'Continue with GitHub',
  showPassword: 'Show password',
  hidePassword: 'Hide password',
  emailRequired: 'Email address is required',
  emailInvalid: 'Please enter a valid email address',
  passwordRequired: 'Password is required',
  fullNameRequired: 'Full name is required',
  passwordLength: 'Password must be at least 8 characters',
  confirmPasswordRequired: 'Confirm password is required',
  passwordsDoNotMatch: 'Passwords do not match',
  termsRequired: 'You must accept the Terms of Service to continue',
  invalidCredentials: 'The email or password is incorrect.',
  signInFailed: 'Unable to sign in right now. Please try again.',
  signUpFailed: 'Unable to create your account right now. Please try again.',
  emailAlreadyRegistered: 'An account with this email already exists. Try signing in instead.',
  checkEmail: 'Account created. Check your email to confirm your account before signing in.',
  emailNotConfirmed: 'Please verify your email before signing in.',
  rateLimited: 'Too many attempts. Please wait a moment and try again.',
  callbackFailed: 'Authentication link is invalid or has expired. Please sign in.',
  oauthComingSoon: 'Social login is coming soon.',
  authUnavailable: 'Authentication is not configured yet. Add the Supabase environment variables to enable sign-in.',
  tryAgain: 'Please try again.',
  loading: 'Loading',
}

const AUTH_OVERRIDES: Record<string, Partial<AuthTranslations>> = {
  HI: {
    loginTitle: 'वापसी पर स्वागत है', loginDescription: 'अपनी क्वांटम सीखने की यात्रा जारी रखने के लिए साइन इन करें।',
    registerTitle: 'अपना खाता बनाएँ', registerDescription: 'क्वांटम कंप्यूटिंग का भविष्य बनाने वाले हजारों शिक्षार्थियों से जुड़ें।',
    email: 'ईमेल', password: 'पासवर्ड', fullName: 'पूरा नाम', confirmPassword: 'पासवर्ड की पुष्टि करें',
    rememberMe: 'मुझे याद रखें', forgotPassword: 'पासवर्ड भूल गए?', selectRole: 'भूमिका चुनें', student: 'छात्र', instructor: 'प्रशिक्षक',
    signIn: 'साइन इन', createAccount: 'खाता बनाएँ', or: 'या', newTo: 'SankalpQ पर नए हैं?', alreadyHaveAccount: 'क्या आपका खाता पहले से है?',
    continueGoogle: 'Google से जारी रखें', continueGithub: 'GitHub से जारी रखें', showPassword: 'पासवर्ड दिखाएँ', hidePassword: 'पासवर्ड छिपाएँ',
    emailRequired: 'ईमेल पता आवश्यक है', emailInvalid: 'मान्य ईमेल पता दर्ज करें', passwordRequired: 'पासवर्ड आवश्यक है', fullNameRequired: 'पूरा नाम आवश्यक है',
    passwordLength: 'पासवर्ड कम से कम 8 अक्षरों का होना चाहिए', confirmPasswordRequired: 'पासवर्ड की पुष्टि आवश्यक है', passwordsDoNotMatch: 'पासवर्ड मेल नहीं खाते',
    termsRequired: 'जारी रखने के लिए सेवा की शर्तें स्वीकार करें', invalidCredentials: 'ईमेल या पासवर्ड गलत है।', checkEmail: 'खाता बन गया। पुष्टि के लिए अपना ईमेल देखें।',
    emailNotConfirmed: 'साइन इन करने से पहले कृपया अपना ईमेल सत्यापित करें।', rateLimited: 'बहुत सारे प्रयास। कृपया थोड़ी देर प्रतीक्षा करें और पुन: प्रयास करें।',
    callbackFailed: 'प्रमाणीकरण लिंक अमान्य है या समाप्त हो गया है। कृपया साइन इन करें।', oauthComingSoon: 'सोशल लॉगिन जल्द ही उपलब्ध होगा।',
  },
  MR: {
    loginTitle: 'पुन्हा स्वागत आहे', loginDescription: 'तुमचा क्वांटम शिक्षण प्रवास सुरू ठेवण्यासाठी साइन इन करा.',
    registerTitle: 'तुमचे खाते तयार करा', registerDescription: 'क्वांटम कॉम्प्युटिंगचे भविष्य घडवणाऱ्या हजारो विद्यार्थ्यांमध्ये सामील व्हा.',
    email: 'ईमेल', password: 'पासवर्ड', fullName: 'पूर्ण नाव', confirmPassword: 'पासवर्डची पुष्टी करा', rememberMe: 'मला लक्षात ठेवा',
    forgotPassword: 'पासवर्ड विसरलात?', selectRole: 'भूमिका निवडा', student: 'विद्यार्थी', instructor: 'प्रशिक्षक', signIn: 'साइन इन',
    createAccount: 'खाते तयार करा', or: 'किंवा', newTo: 'SankalpQ वर नवीन आहात?', alreadyHaveAccount: 'आधीच खाते आहे?',
    continueGoogle: 'Google सह सुरू ठेवा', continueGithub: 'GitHub सह सुरू ठेवा', showPassword: 'पासवर्ड दाखवा', hidePassword: 'पासवर्ड लपवा',
    emailRequired: 'ईमेल पत्ता आवश्यक आहे', emailInvalid: 'वैध ईमेल पत्ता टाका', passwordRequired: 'पासवर्ड आवश्यक आहे', fullNameRequired: 'पूर्ण नाव आवश्यक आहे',
    passwordLength: 'पासवर्ड किमान ८ अक्षरांचा असावा', confirmPasswordRequired: 'पासवर्डची पुष्टी आवश्यक आहे', passwordsDoNotMatch: 'पासवर्ड जुळत नाहीत',
    termsRequired: 'पुढे जाण्यासाठी सेवा अटी स्वीकारा', invalidCredentials: 'ईमेल किंवा पासवर्ड चुकीचा आहे.', checkEmail: 'खाते तयार झाले. पुष्टी करण्यासाठी ईमेल तपासा.',
    emailNotConfirmed: 'साइन इन करण्यापूर्वी कृपया आपला ईमेल सत्यापित करा.', rateLimited: 'खूप प्रयत्न केले. कृपया थोडा वेळ थांबा आणि पुन्हा प्रयत्न करा.',
    callbackFailed: 'प्रमाणीकरण लिंक अवैध आहे किंवा कालबाह्य झाली आहे. कृपया साइन इन करा.', oauthComingSoon: 'सोशल लॉगिन लवकरच उपलब्ध होईल.',
  },
  AR: {
    loginTitle: 'مرحباً بعودتك', loginDescription: 'سجّل الدخول لمتابعة رحلة تعلم الحوسبة الكمومية.',
    registerTitle: 'أنشئ حسابك', registerDescription: 'انضم إلى آلاف المتعلمين الذين يبنون مستقبل الحوسبة الكمومية.',
    email: 'البريد الإلكتروني', password: 'كلمة المرور', fullName: 'الاسم الكامل', confirmPassword: 'تأكيد كلمة المرور', rememberMe: 'تذكرني',
    forgotPassword: 'هل نسيت كلمة المرور؟', selectRole: 'اختر الدور', student: 'طالب', instructor: 'مدرّس', signIn: 'تسجيل الدخول',
    createAccount: 'إنشاء حساب', or: 'أو', newTo: 'جديد على SankalpQ؟', alreadyHaveAccount: 'لديك حساب بالفعل؟',
    continueGoogle: 'المتابعة باستخدام Google', continueGithub: 'المتابعة باستخدام GitHub', showPassword: 'إظهار كلمة المرور', hidePassword: 'إخفاء كلمة المرور',
    emailRequired: 'البريد الإلكتروني مطلوب', emailInvalid: 'أدخل بريداً إلكترونياً صالحاً', passwordRequired: 'كلمة المرور مطلوبة', fullNameRequired: 'الاسم الكامل مطلوب',
    passwordLength: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل', confirmPasswordRequired: 'تأكيد كلمة المرور مطلوب', passwordsDoNotMatch: 'كلمتا المرور غير متطابقتين',
    termsRequired: 'يجب قبول شروط الخدمة للمتابعة', invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.', checkEmail: 'تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتأكيد الحساب.',
    emailNotConfirmed: 'يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول.', rateLimited: 'محاولات كثيرة جداً. يرجى الانتظار لحظة والمحاولة مرة أخرى.',
    callbackFailed: 'رابط المصادقة غير صالح أو انتهت صلاحيته. يرجى تسجيل الدخول.', oauthComingSoon: 'تسجيل الدخول عبر المنصات الاجتماعية سيتوفر قريباً.',
  },
}

export function getAuthTranslations(code: string): AuthTranslations {
  return { ...ENGLISH_AUTH, ...(AUTH_OVERRIDES[code] ?? {}) }
}
