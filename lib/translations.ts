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
  student?: StudentTranslations
}

export type CourseContentTranslation = {
  title: string
  description: string
}

export type LessonContentTranslation = {
  title: string
}

export type ChallengeContentTranslation = {
  title: string
  shortDescription: string
  description: string
  goal: string
  availabilityNote?: string
  options?: Record<string, string>
  hints?: string[]
  explanation?: string
}

export type StudentTranslations = {
  common: {
    level: string
    levels: string
    lesson: string
    lessons: string
    complete: string
    completed: string
    notStarted: string
    inProgress: string
    upcoming: string
    previous: string
    next: string
    min: string
    xp: string
    close: string
    cancel: string
    reset: string
    save: string
    clear: string
    run: string
    undo: string
    redo: string
    and: string
  }
  courses: {
    eyebrow: string
    title: string
    description: string
    overall: string
    continueLearning: string
    continue: string
    levels: string
    curriculum: string
    courseLevels: string
    overallCompletion: string
    reviewCourse: string
    startCourse: string
    continueCourse: string
    quizSaved: string
    quizUnlock: string
    conceptIntroduction: string
    startWithIdea: string
    coreExplanation: string
    howItWorks: string
    interactiveExample: string
    exampleSteps: string
    tryItYourself: string
    openIdea: string
    openCircuit: string
    knowledgeCheck: string
    checkUnderstanding: string
    chooseAnswer: string
    correct: string
    notQuite: string
    checkAnswer: string
    tryAgain: string
    lessonProgress: (completed: number, total: number) => string
    completionLabel: (name: string) => string
    content: Record<string, CourseContentTranslation>
    lessons: Record<string, LessonContentTranslation>
  }
  challenges: {
    eyebrow: string
    title: string
    description: string
    yourPractice: string
    progress: string
    completed: string
    currentLevel: string
    accuracy: string
    bestScore: string
    history: string
    recent: string
    retryNeeded: string
    attempt: string
    type: Record<string, string>
    difficulty: Record<string, { title: string; description: string }>
    status: Record<string, string>
    challengeCount: (count: number) => string
    best: (score: number) => string
    content: Record<string, ChallengeContentTranslation>
    goal: string
    details: string
    upTo: string
    workspace: string
    chooseExpectedOutput: string
    chooseGate: string
    buildCircuit: string
    repairCircuit: string
    selectAnswer: string
    submitAnswer: string
    allChallenges: string
    backToChallenges: string
    progressiveHints: string
    hintsRevealed: (visible: number, total: number) => string
    revealClue: (count: number) => string
    allHintsRevealed: string
    emptyHint: string
    challengeComplete: string
    notThereYet: string
    computedDistribution: string
    hintsUsed: string
    time: string
    xpEarned: string
    nextChallenge: string
    retry: string
    openInCircuitBuilder: string
    submitCircuit: string
    circuitControls: string
    circuitToAnalyze: string
    stateTransformation: string
    challengesCompletedAria: (level: string) => string
    typeShort: Record<string, string>
  }
  simulator: {
    eyebrow: string
    title: string
    description: string
    localBackendReady: string
    educationalMock: string
    configure: string
    setup: string
    circuit: string
    circuitSource: string
    savedCircuits: string
    exampleCircuits: string
    executionSettings: string
    shots: string
    repeatedMeasurements: string
    backend: string
    available: string
    comingSoon: string
    runSimulation: string
    runningSimulation: string
    editInBuilder: string
    completed: string
    results: string
    localNotice: string
    execution: string
    executionSummary: string
    localCompute: string
    outcomes: string
    gateOperations: string
    measurements: string
    circuitDepth: string
    beforeMeasurement: string
    stateVector: string
    distribution: string
    measurementProbabilities: string
    counts: string
    measurementResults: string
    outcome: string
    frequency: string
    whyThisHappened: string
    resultExplanation: string
    probabilityNote: string
    singleQubit: string
    blochVector: string
  }
  builder: {
    title: string
    description: string
    hint: string
    gatePalette: string
    singleQubit: string
    parameterized: string
    multiQubit: string
    measurement: string
    clickTarget: string
    clickCell: string
    controlFirst: string
    target: string
    properties: string
    selectGate: string
    gateProperties: string
    moment: string
    controlQubit: string
    targetQubit: string
    classicalBit: string
    angle: string
    degrees: string
    removeGate: string
    circuitToolbar: string
    circuitName: string
    clickToRename: string
    removeQubit: string
    addQubit: string
    clearGates: string
    examples: string
    starterCircuits: string
    shots: string
    running: string
    simulator: string
    saveCircuit: string
    jsonModel: string
    jsonRepresentation: string
    qubits: (count: number) => string
    operations: (count: number) => string
    runningOn: (shots: string) => string
    gates: Record<string, { label: string; description: string }>
    starters: Record<string, string>
  }
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

const MARATHI_AI_TUTOR: AiTutorTranslations = {
  title: 'AI शिक्षक',
  subtitle: 'तुमचा वैयक्तिक क्वांटम-कम्प्युटिंग शिकवणी सहाय्यक',
  contextLabel: 'शिकण्याचा संदर्भ',
  currentLesson: 'सध्याचा धडा',
  noActiveLesson: 'अद्याप कोणताही सक्रिय धडा नाही',
  student: 'विद्यार्थी',
  tutor: 'AI शिक्षक',
  placeholder: 'क्वांटम कम्प्युटिंगबद्दल प्रश्न विचारा…',
  send: 'पाठवा',
  welcomeTitle: 'तुम्हाला काय शोधायचे आहे?',
  welcomeDescription: 'क्यूबिट्स, गेट्स, अल्गोरिदम किंवा सध्याच्या धड्याबद्दल काहीही विचारा.',
  thinking: 'AI शिक्षक विचार करत आहे…',
  clearConversation: 'संभाषण साफ करा',
  messageListLabel: 'AI शिक्षकासोबतचे संभाषण',
  requestError: 'आत्ता AI शिक्षकाशी जोडता आले नाही. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.',
  authError: 'पुढे जाण्यासाठी साइन इन करा.',
  tryAgain: 'पुन्हा प्रयत्न करा',
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
  content?: {
    lessons: Record<string, string>
    challenges: Record<string, string>
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

const ENGLISH_STUDENT: StudentTranslations = {
  common: {
    level: 'Level', levels: 'Levels', lesson: 'Lesson', lessons: 'Lessons', complete: 'Complete', completed: 'Completed',
    notStarted: 'Not started', inProgress: 'In progress', upcoming: 'Upcoming', previous: 'Previous', next: 'Next', min: 'min', xp: 'XP',
    close: 'Close', cancel: 'Cancel', reset: 'Reset', save: 'Save', clear: 'Clear', run: 'Run', undo: 'Undo', redo: 'Redo', and: 'and',
  },
  courses: {
    eyebrow: 'Learning paths', title: 'Courses', description: 'Learn quantum computing in four guided levels, from qubits to practical algorithms.', overall: 'overall',
    continueLearning: 'Continue learning', continue: 'Continue', levels: 'Levels', curriculum: 'Curriculum', courseLevels: 'Course levels', overallCompletion: 'Overall completion',
    reviewCourse: 'Review course', startCourse: 'Start course', continueCourse: 'Continue learning', quizSaved: 'Your quiz result is saved locally with your lesson progress.', quizUnlock: 'Answer the knowledge check to unlock lesson completion.', conceptIntroduction: 'Concept introduction', startWithIdea: 'Start with the idea', coreExplanation: 'Core explanation', howItWorks: 'How it works', interactiveExample: 'Interactive example', exampleSteps: 'Example steps', tryItYourself: 'Try it yourself', openIdea: 'Open this idea in Circuit Builder', openCircuit: 'Open circuit', knowledgeCheck: 'Knowledge check', checkUnderstanding: 'Check your understanding', chooseAnswer: 'Choose one answer', correct: 'Correct', notQuite: 'Not quite', checkAnswer: 'Check answer', tryAgain: 'Try again', lessonProgress: (completed, total) => `${completed} of ${total} complete`,
    completionLabel: name => `${name} progress`,
    content: {
      'course-fundamentals': { title: 'Quantum Fundamentals', description: 'Build a precise mental model of qubits, amplitudes, superposition, and measurement.' },
      'course-gates': { title: 'Quantum Gates', description: 'Understand the operations that transform quantum states and compose useful circuits.' },
      'course-circuits': { title: 'Quantum Circuits', description: 'Read, design, and reason about multi-qubit circuits, correlation, and entanglement.' },
      'course-algorithms': { title: 'Quantum Algorithms', description: 'Connect quantum primitives to algorithmic patterns such as Deutsch–Jozsa and Grover.' },
    },
    lessons: {},
  },
  challenges: {
    eyebrow: 'Your practice', title: 'Quantum Challenges', description: 'Apply each concept by building, repairing, and reasoning about circuits.', yourPractice: 'Your practice', progress: 'Challenge progress',
    completed: 'Completed', currentLevel: 'Current level', accuracy: 'Accuracy', bestScore: 'Best score', history: 'History', recent: 'Recent challenges', retryNeeded: 'Retry needed',
    attempt: 'Attempt', type: { 'build-circuit': 'Build the circuit', 'predict-output': 'Predict the output', 'fix-circuit': 'Fix the circuit', 'identify-gate': 'Identify the gate', algorithm: 'Algorithm challenge' },
    difficulty: {
      beginner: { title: 'Beginner', description: 'Single-qubit gates, superposition, and measurement.' },
      intermediate: { title: 'Intermediate', description: 'Controlled gates, correlation, and Bell states.' },
      advanced: { title: 'Advanced', description: 'Quantum algorithm construction and analysis.' },
    },
    status: { upcoming: 'Upcoming', completed: 'Completed', inProgress: 'In progress', notStarted: 'Not started' },
    challengeCount: count => `${count} challenge${count === 1 ? '' : 's'}`, best: score => `Best ${score}`,
    content: {
      'build-superposition': { title: 'Build Equal Superposition', shortDescription: 'Prepare |+> from a qubit initialized in |0>.', description: 'Place gates on the wire so the final quantum state is (|0> + |1>)/sqrt(2). Equivalent circuits are accepted.', goal: 'Prepare |+>, giving 50% probability for both |0> and |1>.' },
      'predict-hadamard-output': { title: 'Predict a Hadamard Measurement', shortDescription: 'Predict the output distribution of a one-qubit circuit.', description: 'The qubit begins in |0>, passes through the shown circuit, and is measured in the computational basis.', goal: 'Choose the measurement distribution produced by the circuit.' },
      'identify-x-gate': { title: 'Identify the Bit-Flip Gate', shortDescription: 'Find the operation that maps |0> to |1>.', description: 'A single qubit starts in |0> and must finish in |1> with certainty. Identify the gate that performs this transformation.', goal: 'Select the gate that deterministically flips the computational basis value.' },
      'build-bell-state': { title: 'Create a Bell State', shortDescription: 'Entangle two qubits into the Phi-plus Bell state.', description: 'Starting from |00>, build any equivalent circuit whose final state is (|00> + |11>)/sqrt(2).', goal: 'Prepare correlated outcomes: 50% |00>, 50% |11>, with the correct relative phase.' },
      'fix-bell-state': { title: 'Repair the Bell Circuit', shortDescription: 'Correct a controlled gate that points the wrong way.', description: 'This circuit creates superposition but fails to entangle its qubits. Inspect the controlled operation and repair the circuit.', goal: 'Finish with the Phi-plus Bell state (|00> + |11>)/sqrt(2).' },
      'grover-amplitude-amplification': { title: 'Grover Amplitude Amplification', shortDescription: 'Build an oracle and amplify a marked two-qubit state.', description: 'An advanced construction challenge covering phase oracles, diffusion, and amplitude amplification.', goal: 'Amplify a marked basis state using one Grover iteration.', availabilityNote: 'Upcoming with the Quantum Algorithms course level.' },
    },
    goal: 'Goal', details: 'Challenge details', upTo: 'Up to', workspace: 'Workspace', chooseExpectedOutput: 'Choose the expected output', chooseGate: 'Choose the gate', buildCircuit: 'Build your circuit', repairCircuit: 'Repair the circuit', selectAnswer: 'Select one answer', submitAnswer: 'Submit answer', allChallenges: 'All challenges', backToChallenges: 'Back to challenges', progressiveHints: 'Progressive hints', hintsRevealed: (visible, total) => `${visible} of ${total} revealed`, revealClue: count => `Reveal hint ${count}`, allHintsRevealed: 'All hints revealed', emptyHint: 'Reveal one clue at a time when you need it.', challengeComplete: 'Challenge complete', notThereYet: 'Not there yet', computedDistribution: 'Computed distribution', hintsUsed: 'Hints used', time: 'Time', xpEarned: 'XP earned', nextChallenge: 'Next challenge', retry: 'Retry', openInCircuitBuilder: 'Open in Circuit Builder', submitCircuit: 'Submit circuit', circuitControls: 'Challenge circuit controls', circuitToAnalyze: 'Circuit to analyze', stateTransformation: 'Quantum state transformation', challengesCompletedAria: level => `${level} challenges completed`, typeShort: { 'build-circuit': 'Build', 'predict-output': 'Predict', 'fix-circuit': 'Repair', 'identify-gate': 'Identify', algorithm: 'Algorithm' },
  },
  simulator: {
    eyebrow: 'Quantum execution', title: 'Quantum Simulator', description: 'Run a circuit, inspect its measurement distribution, and connect the result to the underlying quantum state.', localBackendReady: 'Local backend ready', educationalMock: 'Educational mock', configure: 'Configure', setup: 'Simulation setup', circuit: 'Circuit', circuitSource: 'Circuit source', savedCircuits: 'Saved circuits', exampleCircuits: 'Example circuits', executionSettings: 'Execution settings', shots: 'Shots', repeatedMeasurements: 'Number of repeated measurements.', backend: 'Simulation backend', available: 'Available', comingSoon: 'Coming soon', runSimulation: 'Run Simulation', runningSimulation: 'Running simulation...', editInBuilder: 'Edit in Builder', completed: 'Completed', results: 'Simulation results', localNotice: 'These results were computed locally for learning. They are not Qiskit Aer or quantum hardware results.', execution: 'Execution', executionSummary: 'Execution summary', localCompute: 'Local compute', outcomes: 'Outcomes', gateOperations: 'Gate operations', measurements: 'Measurements', circuitDepth: 'Circuit depth', beforeMeasurement: 'Before measurement', stateVector: 'State vector', distribution: 'Distribution', measurementProbabilities: 'Measurement probabilities', counts: 'Counts', measurementResults: 'Measurement results', outcome: 'Outcome', frequency: 'Frequency', whyThisHappened: 'Why this happened', resultExplanation: 'Result explanation', probabilityNote: "The state vector stores probability amplitudes. Squaring each amplitude's magnitude gives its basis-state probability.", singleQubit: 'Single qubit', blochVector: 'Bloch vector',
  },
  builder: {
    title: 'Circuit Builder', description: 'Build quantum circuits by placing gates on qubit wires.', hint: 'Select a gate from the palette, then click a cell to place it.', gatePalette: 'Gate Palette', singleQubit: 'Single Qubit', parameterized: 'Parameterized', multiQubit: 'Multi-Qubit', measurement: 'Measurement', clickTarget: 'Click target qubit', clickCell: 'Click a cell to place', controlFirst: 'For multi-qubit gates, click the control qubit first, then the target.', target: 'target', properties: 'Properties', selectGate: 'Select a gate to inspect it.', gateProperties: 'Gate properties', moment: 'Moment', controlQubit: 'Control qubit', targetQubit: 'Target qubit', classicalBit: 'Classical bit', angle: 'Angle', degrees: 'degrees', removeGate: 'Remove gate', circuitToolbar: 'Circuit toolbar', circuitName: 'Circuit name', clickToRename: 'Click to rename', removeQubit: 'Remove qubit', addQubit: 'Add qubit', clearGates: 'Clear all gates', examples: 'Examples', starterCircuits: 'Starter circuits', shots: 'Number of shots', running: 'Running…', simulator: 'Simulator', saveCircuit: 'Save circuit', jsonModel: 'Circuit JSON Model', jsonRepresentation: 'Circuit JSON representation', qubits: count => `${count} qubit${count === 1 ? '' : 's'}`, operations: count => `${count} ops`, runningOn: shots => `Running simulation on ${shots} shots…`,
    gates: { H: { label: 'Hadamard', description: 'Creates superposition.' }, X: { label: 'Pauli-X', description: 'Flips the qubit state.' }, Y: { label: 'Pauli-Y', description: 'Combines bit and phase flip.' }, Z: { label: 'Pauli-Z', description: 'Applies a phase flip.' }, S: { label: 'S Gate (Phase)', description: 'Applies a π/2 phase shift.' }, T: { label: 'T Gate (π/8)', description: 'Applies a π/4 phase shift.' }, RX: { label: 'Rotation X', description: 'Rotates the qubit around the X axis.' }, RY: { label: 'Rotation Y', description: 'Rotates the qubit around the Y axis.' }, RZ: { label: 'Rotation Z', description: 'Rotates the qubit around the Z axis.' }, CNOT: { label: 'CNOT', description: 'Flips the target when the control is |1⟩.' }, CZ: { label: 'CZ Gate', description: 'Applies Z to the target when the control is |1⟩.' }, SWAP: { label: 'SWAP', description: 'Swaps the states of two qubits.' }, MEASURE: { label: 'Measure', description: 'Measures the qubit in the computational basis.' } },
    starters: { 'starter-bell-state': 'Bell State', 'starter-superposition': 'Superposition', 'starter-basic-measurement': 'Basic Measurement', 'starter-entanglement': 'Entanglement Example', 'starter-not': 'Quantum NOT', 'starter-ghz': 'GHZ State', 'starter-phase-kickback': 'Phase Kickback' },
  },
}

const MARATHI_STUDENT: StudentTranslations = {
  common: {
    level: 'स्तर', levels: 'स्तर', lesson: 'धडा', lessons: 'धडे', complete: 'पूर्ण', completed: 'पूर्ण झाले', notStarted: 'सुरू केलेले नाही', inProgress: 'प्रगतीपथावर', upcoming: 'लवकरच', previous: 'मागील', next: 'पुढील', min: 'मि.', xp: 'XP', close: 'बंद करा', cancel: 'रद्द करा', reset: 'पुन्हा सेट करा', save: 'जतन करा', clear: 'साफ करा', run: 'चालवा', undo: 'पूर्ववत करा', redo: 'पुन्हा करा', and: 'आणि',
  },
  courses: {
    eyebrow: 'शिकण्याचे मार्ग', title: 'अभ्यासक्रम', description: 'क्यूबिट्सपासून उपयुक्त अल्गोरिदमपर्यंत चार मार्गदर्शित स्तरांमध्ये क्वांटम कम्प्युटिंग शिका.', overall: 'एकूण', continueLearning: 'शिकणे सुरू ठेवा', continue: 'पुढे सुरू ठेवा', levels: 'स्तर', curriculum: 'अभ्यासक्रम आराखडा', courseLevels: 'अभ्यासक्रमाचे स्तर', overallCompletion: 'एकूण पूर्णता', reviewCourse: 'अभ्यासक्रमाचा आढावा घ्या', startCourse: 'अभ्यासक्रम सुरू करा', continueCourse: 'शिकणे सुरू ठेवा', quizSaved: 'तुमचा क्विझ निकाल धड्याच्या प्रगतीसोबत स्थानिक पातळीवर जतन झाला आहे.', quizUnlock: 'धडा पूर्ण करण्यासाठी ज्ञान चाचणीचे उत्तर द्या.', conceptIntroduction: 'संकल्पनेचा परिचय', startWithIdea: 'कल्पनेपासून सुरुवात करा', coreExplanation: 'मूलभूत स्पष्टीकरण', howItWorks: 'हे कसे कार्य करते', interactiveExample: 'परस्परसंवादी उदाहरण', exampleSteps: 'उदाहरणातील पायऱ्या', tryItYourself: 'स्वतः करून पाहा', openIdea: 'ही कल्पना Circuit Builder मध्ये उघडा', openCircuit: 'सर्किट उघडा', knowledgeCheck: 'ज्ञान चाचणी', checkUnderstanding: 'तुमची समज तपासा', chooseAnswer: 'एक उत्तर निवडा', correct: 'बरोबर', notQuite: 'अजून बरोबर नाही', checkAnswer: 'उत्तर तपासा', tryAgain: 'पुन्हा प्रयत्न करा', lessonProgress: (completed, total) => `${total} पैकी ${completed} पूर्ण`, completionLabel: name => `${name} ची प्रगती`,
    content: {
      'course-fundamentals': { title: 'क्वांटम मूलतत्त्वे', description: 'क्यूबिट्स, अॅम्प्लिट्यूड, सुपरपोझिशन आणि मोजमाप यांचे स्पष्ट आकलन तयार करा.' },
      'course-gates': { title: 'क्वांटम गेट्स', description: 'क्वांटम अवस्था बदलणाऱ्या क्रिया समजून घ्या आणि उपयुक्त सर्किट्स तयार करा.' },
      'course-circuits': { title: 'क्वांटम सर्किट्स', description: 'बहु-क्यूबिट सर्किट्स, सहसंबंध आणि एंटॅंगलमेंट वाचा, तयार करा आणि समजून घ्या.' },
      'course-algorithms': { title: 'क्वांटम अल्गोरिदम्स', description: 'Deutsch–Jozsa आणि Grover सारख्या अल्गोरिदम पद्धतींशी क्वांटम मूलभूत संकल्पना जोडा.' },
    },
    lessons: {
      'quantum-fundamentals:introduction-to-quantum-computing': { title: 'क्वांटम कम्प्युटिंगचा परिचय' }, 'quantum-fundamentals:classical-bit-vs-qubit': { title: 'क्लासिकल बिट आणि क्यूबिट' }, 'quantum-fundamentals:qubit-states': { title: 'क्यूबिट अवस्था' }, 'quantum-fundamentals:superposition': { title: 'सुपरपोझिशन' }, 'quantum-fundamentals:quantum-measurement': { title: 'क्वांटम मोजमाप' },
      'quantum-gates:introduction-to-quantum-gates': { title: 'क्वांटम गेट्सचा परिचय' }, 'quantum-gates:pauli-x-gate': { title: 'Pauli-X गेट' }, 'quantum-gates:pauli-y-gate': { title: 'Pauli-Y गेट' }, 'quantum-gates:pauli-z-gate': { title: 'Pauli-Z गेट' }, 'quantum-gates:hadamard-gate': { title: 'Hadamard गेट' }, 'quantum-gates:phase-gates': { title: 'फेज गेट्स' }, 'quantum-gates:rotation-gates': { title: 'रोटेशन गेट्स' },
      'quantum-circuits:quantum-circuit-basics': { title: 'क्वांटम सर्किटची मूलतत्त्वे' }, 'quantum-circuits:multiple-qubits': { title: 'अनेक क्यूबिट्स' }, 'quantum-circuits:cnot-gate': { title: 'CNOT गेट' }, 'quantum-circuits:entanglement': { title: 'एंटॅंगलमेंट' }, 'quantum-circuits:bell-states': { title: 'Bell अवस्था' },
      'quantum-algorithms:deutsch-jozsa-algorithm': { title: 'Deutsch–Jozsa अल्गोरिदम' }, 'quantum-algorithms:grovers-algorithm': { title: "Grover चा अल्गोरिदम" }, 'quantum-algorithms:quantum-fourier-transform': { title: 'क्वांटम Fourier Transform' },
    },
  },
  challenges: {
    eyebrow: 'तुमचा सराव', title: 'क्वांटम आव्हाने', description: 'सर्किट्स तयार करून, दुरुस्त करून आणि त्यांचा तर्क समजून प्रत्येक संकल्पना वापरा.', yourPractice: 'तुमचा सराव', progress: 'आव्हानांची प्रगती', completed: 'पूर्ण झाले', currentLevel: 'सध्याचा स्तर', accuracy: 'अचूकता', bestScore: 'सर्वोत्तम गुण', history: 'इतिहास', recent: 'अलीकडील आव्हाने', retryNeeded: 'पुन्हा प्रयत्न आवश्यक', attempt: 'प्रयत्न', type: { 'build-circuit': 'सर्किट तयार करा', 'predict-output': 'आउटपुटाचा अंदाज लावा', 'fix-circuit': 'सर्किट दुरुस्त करा', 'identify-gate': 'गेट ओळखा', algorithm: 'अल्गोरिदम आव्हान' }, difficulty: { beginner: { title: 'प्रारंभिक', description: 'सिंगल-क्यूबिट गेट्स, सुपरपोझिशन आणि मोजमाप.' }, intermediate: { title: 'मध्यम', description: 'कंट्रोल्ड गेट्स, सहसंबंध आणि Bell अवस्था.' }, advanced: { title: 'प्रगत', description: 'क्वांटम अल्गोरिदमची रचना आणि विश्लेषण.' } }, status: { upcoming: 'लवकरच', completed: 'पूर्ण झाले', inProgress: 'प्रगतीपथावर', notStarted: 'सुरू केलेले नाही' }, challengeCount: count => `${count} आव्हाने`, best: score => `सर्वोत्तम ${score}`,
    content: {
      'build-superposition': { title: 'समान Superposition तयार करा', shortDescription: '|0⟩ मध्ये सुरू केलेल्या क्यूबिटपासून |+⟩ तयार करा.', description: 'अंतिम क्वांटम अवस्था (|0⟩ + |1⟩)/√2 होण्यासाठी वायरवर गेट्स ठेवा. समतुल्य सर्किट्स स्वीकारली जातील.', goal: '|+⟩ तयार करा; |0⟩ आणि |1⟩ दोन्हीची संभाव्यता 50% असावी.' },
      'predict-hadamard-output': { title: 'Hadamard मोजमापाचा अंदाज लावा', shortDescription: 'एका क्यूबिटच्या सर्किटचे आउटपुट वितरण ओळखा.', description: 'क्यूबिट |0⟩ पासून सुरू होतो, दाखवलेल्या सर्किटमधून जातो आणि computational basis मध्ये मोजला जातो.', goal: 'या सर्किटमधून मिळणारे मोजमाप वितरण निवडा.' },
      'identify-x-gate': { title: 'Bit-Flip गेट ओळखा', shortDescription: '|0⟩ ला |1⟩ मध्ये बदलणारी क्रिया शोधा.', description: 'एक क्यूबिट |0⟩ पासून सुरू होतो आणि निश्चितपणे |1⟩ वर संपला पाहिजे. हे रूपांतर करणारे गेट ओळखा.', goal: 'computational basis मूल्य निश्चितपणे उलटवणारे गेट निवडा.' },
      'build-bell-state': { title: 'Bell अवस्था तयार करा', shortDescription: 'दोन क्यूबिट्सना Phi-plus Bell अवस्थेत गुंतवा.', description: '|00⟩ पासून सुरू करून अंतिम अवस्था (|00⟩ + |11⟩)/√2 असलेले समतुल्य सर्किट तयार करा.', goal: 'सहसंबंधित परिणाम तयार करा: 50% |00⟩ आणि 50% |11⟩.' },
      'fix-bell-state': { title: 'Bell सर्किट दुरुस्त करा', shortDescription: 'चुकीच्या दिशेने असलेले controlled गेट दुरुस्त करा.', description: 'या सर्किटमध्ये superposition तयार होते, पण क्यूबिट्स गुंतत नाहीत. controlled क्रिया तपासा आणि सर्किट दुरुस्त करा.', goal: 'Phi-plus Bell अवस्था (|00⟩ + |11⟩)/√2 मिळवा.' },
      'grover-amplitude-amplification': { title: 'Grover Amplitude Amplification', shortDescription: 'Oracle तयार करून निवडलेल्या दोन-क्यूबिट अवस्थेचे amplitude वाढवा.', description: 'Phase oracle, diffusion आणि amplitude amplification यांचा समावेश असलेले प्रगत आव्हान.', goal: 'एक Grover iteration वापरून निवडलेल्या basis अवस्थेचे amplitude वाढवा.', availabilityNote: 'Quantum Algorithms अभ्यासक्रमाच्या स्तरासोबत लवकरच उपलब्ध होईल.' },
    },
    goal: 'उद्दिष्ट', details: 'आव्हानाचा तपशील', upTo: 'कमाल', workspace: 'कार्यस्थळ', chooseExpectedOutput: 'अपेक्षित आउटपुट निवडा', chooseGate: 'गेट निवडा', buildCircuit: 'तुमचे सर्किट तयार करा', repairCircuit: 'सर्किट दुरुस्त करा', selectAnswer: 'एक उत्तर निवडा', submitAnswer: 'उत्तर पाठवा', allChallenges: 'सर्व आव्हाने', backToChallenges: 'आव्हानांकडे परत', progressiveHints: 'क्रमिक सूचना', hintsRevealed: (visible, total) => `${total} पैकी ${visible} सूचना उघड`, revealClue: count => `सूचना ${count} उघडा`, allHintsRevealed: 'सर्व सूचना उघडल्या', emptyHint: 'गरज भासेल तेव्हा एका वेळी एक सूचना उघडा.', challengeComplete: 'आव्हान पूर्ण झाले', notThereYet: 'अजून पूर्ण झालेले नाही', computedDistribution: 'मोजलेले वितरण', hintsUsed: 'वापरलेल्या सूचना', time: 'वेळ', xpEarned: 'मिळवलेले XP', nextChallenge: 'पुढील आव्हान', retry: 'पुन्हा प्रयत्न करा', openInCircuitBuilder: 'Circuit Builder मध्ये उघडा', submitCircuit: 'सर्किट पाठवा', circuitControls: 'आव्हानाची सर्किट नियंत्रणे', circuitToAnalyze: 'विश्लेषणासाठी सर्किट', stateTransformation: 'क्वांटम अवस्था रूपांतर', challengesCompletedAria: level => `${level} आव्हाने पूर्ण झाली`, typeShort: { 'build-circuit': 'तयार करा', 'predict-output': 'अंदाज लावा', 'fix-circuit': 'दुरुस्त करा', 'identify-gate': 'ओळखा', algorithm: 'अल्गोरिदम' },
  },
  simulator: {
    eyebrow: 'क्वांटम अंमलबजावणी', title: 'क्वांटम सिम्युलेटर', description: 'सर्किट चालवा, मोजमाप वितरण तपासा आणि परिणामाचा क्वांटम अवस्थेशी संबंध समजून घ्या.', localBackendReady: 'स्थानिक backend तयार आहे', educationalMock: 'शैक्षणिक नमुना', configure: 'कॉन्फिगर करा', setup: 'सिम्युलेशन सेटअप', circuit: 'सर्किट', circuitSource: 'सर्किटचा स्रोत', savedCircuits: 'जतन केलेली सर्किट्स', exampleCircuits: 'उदाहरण सर्किट्स', executionSettings: 'अंमलबजावणी सेटिंग्ज', shots: 'प्रयोगसंख्या', repeatedMeasurements: 'पुनरावृत्तीच्या मोजमापांची संख्या.', backend: 'सिम्युलेशन backend', available: 'उपलब्ध', comingSoon: 'लवकरच उपलब्ध', runSimulation: 'सिम्युलेशन चालवा', runningSimulation: 'सिम्युलेशन चालू आहे...', editInBuilder: 'Builder मध्ये संपादित करा', completed: 'पूर्ण झाले', results: 'सिम्युलेशनचे परिणाम', localNotice: 'हे परिणाम शिकण्यासाठी स्थानिक पातळीवर मोजले आहेत. हे Qiskit Aer किंवा प्रत्यक्ष quantum hardware चे परिणाम नाहीत.', execution: 'अंमलबजावणी', executionSummary: 'अंमलबजावणीचा सारांश', localCompute: 'स्थानिक गणना', outcomes: 'परिणाम', gateOperations: 'गेट क्रिया', measurements: 'मोजमाप', circuitDepth: 'सर्किटची खोली', beforeMeasurement: 'मोजमापापूर्वी', stateVector: 'अवस्था सदिश', distribution: 'वितरण', measurementProbabilities: 'मोजमापाच्या संभाव्यता', counts: 'संख्या', measurementResults: 'मोजमापाचे परिणाम', outcome: 'परिणाम', frequency: 'वारंवारता', whyThisHappened: 'असे का झाले', resultExplanation: 'परिणामाचे स्पष्टीकरण', probabilityNote: 'अवस्था सदिशात संभाव्यता amplitudes साठवलेले असतात. प्रत्येक amplitude च्या परिमाणाचा वर्ग घेतल्यास basis अवस्थेची संभाव्यता मिळते.', singleQubit: 'सिंगल क्यूबिट', blochVector: 'Bloch सदिश',
  },
  builder: {
    title: 'सर्किट बिल्डर', description: 'क्यूबिटच्या वायर्सवर गेट्स ठेवून क्वांटम सर्किट्स तयार करा.', hint: 'palette मधून गेट निवडा आणि ते ठेवण्यासाठी सेलवर क्लिक करा.', gatePalette: 'गेट palette', singleQubit: 'सिंगल क्यूबिट', parameterized: 'पॅरामीटरयुक्त', multiQubit: 'बहु-क्यूबिट', measurement: 'मोजमाप', clickTarget: 'लक्ष्य क्यूबिटवर क्लिक करा', clickCell: 'गेट ठेवण्यासाठी सेलवर क्लिक करा', controlFirst: 'बहु-क्यूबिट गेटसाठी प्रथम control क्यूबिटवर, नंतर target वर क्लिक करा.', target: 'लक्ष्य', properties: 'गुणधर्म', selectGate: 'माहिती पाहण्यासाठी गेट निवडा.', gateProperties: 'गेटचे गुणधर्म', moment: 'क्षण', controlQubit: 'Control क्यूबिट', targetQubit: 'Target क्यूबिट', classicalBit: 'क्लासिकल बिट', angle: 'कोन', degrees: 'अंश', removeGate: 'गेट काढा', circuitToolbar: 'सर्किट toolbar', circuitName: 'सर्किटचे नाव', clickToRename: 'नाव बदलण्यासाठी क्लिक करा', removeQubit: 'क्यूबिट काढा', addQubit: 'क्यूबिट जोडा', clearGates: 'सर्व गेट्स साफ करा', examples: 'उदाहरणे', starterCircuits: 'सुरुवातीची सर्किट्स', shots: 'प्रयोगसंख्या', running: 'चालू आहे…', simulator: 'सिम्युलेटर', saveCircuit: 'सर्किट जतन करा', jsonModel: 'सर्किट JSON मॉडेल', jsonRepresentation: 'सर्किट JSON रूपरेषा', qubits: count => `${count} क्यूबिट`, operations: count => `${count} क्रिया`, runningOn: shots => `${shots} प्रयोगांवर सिम्युलेशन चालू आहे…`,
    gates: { H: { label: 'Hadamard', description: 'Superposition तयार करते.' }, X: { label: 'Pauli-X', description: 'क्यूबिटची अवस्था उलटवते.' }, Y: { label: 'Pauli-Y', description: 'बिट आणि फेज flip एकत्र करते.' }, Z: { label: 'Pauli-Z', description: 'फेज flip लागू करते.' }, S: { label: 'S Gate (Phase)', description: 'π/2 फेज बदल लागू करते.' }, T: { label: 'T Gate (π/8)', description: 'π/4 फेज बदल लागू करते.' }, RX: { label: 'Rotation X', description: 'क्यूबिटला X अक्षाभोवती फिरवते.' }, RY: { label: 'Rotation Y', description: 'क्यूबिटला Y अक्षाभोवती फिरवते.' }, RZ: { label: 'Rotation Z', description: 'क्यूबिटला Z अक्षाभोवती फिरवते.' }, CNOT: { label: 'CNOT', description: 'Control |1⟩ असताना target उलटवते.' }, CZ: { label: 'CZ Gate', description: 'Control |1⟩ असताना target वर Z लागू करते.' }, SWAP: { label: 'SWAP', description: 'दोन क्यूबिट्सच्या अवस्था अदलाबदल करते.' }, MEASURE: { label: 'मोजा', description: 'Computational basis मध्ये क्यूबिटचे मोजमाप करते.' } },
    starters: { 'starter-bell-state': 'Bell अवस्था', 'starter-superposition': 'Superposition', 'starter-basic-measurement': 'मूलभूत मोजमाप', 'starter-entanglement': 'Entanglement उदाहरण', 'starter-not': 'Quantum NOT', 'starter-ghz': 'GHZ अवस्था', 'starter-phase-kickback': 'Phase Kickback' },
  },
}

const MARATHI_DASHBOARD: DashboardTranslations = {
  welcomeBack: name => `पुन्हा स्वागत आहे, ${name}`,
  leftOff: 'तुम्ही जिथे शिकणे थांबवले होते ते इथे आहे.',
  learningPathComplete: 'शिकण्याचा मार्ग पूर्ण', resuming: 'पुन्हा सुरू', allCourseLevelsCompleted: 'अभ्यासक्रमाचे सर्व स्तर पूर्ण',
  lessonsComplete: (completed, total) => `${total} पैकी ${completed} धडे पूर्ण`, lessonProgress: (current, total) => `धडा ${current} पैकी ${total}`,
  reviewCourses: 'अभ्यासक्रमांचा आढावा घ्या', resume: 'पुन्हा सुरू करा', currentLearningProgress: 'सध्याची शिकण्याची प्रगती', modules: 'मॉड्यूल्स', streak: 'सातत्य', streakDays: days => `${days} दिवस`, circuitsBuilt: 'बांधलेली सर्किट्स', badges: 'बॅजेस', courses: 'अभ्यासक्रम', qubitsToAlgorithms: 'क्यूबिट्सपासून अल्गोरिदमपर्यंत', circuitBuilder: 'सर्किट बिल्डर', dragDropBuild: 'ओढा, सोडा, बांधा', simulator: 'सिम्युलेटर', runAndExplore: 'चालवा आणि शोधा', aiTutor: 'AI शिक्षक', askAnytime: 'कधीही विचारा', challenges: 'आव्हाने', testYourUnderstanding: 'तुमची समज तपासा', recommendedNext: 'पुढील शिफारसी', recentActivity: 'अलीकडील क्रिया', complete: 'पूर्ण', progressDialAriaLabel: completion => `${completion}% पूर्ण`, learningStatistics: 'शिकण्याची आकडेवारी', dashboardActivityAndModules: 'डॅशबोर्ड क्रिया आणि मॉड्यूल्स',
  recommendations: { reviseEntanglement: 'पुनरावलोकन करा: एंटॅंगलमेंट', tryBellState: 'प्रयत्न करा: Bell-State आव्हान', continueDeutschJozsa: 'पुढे सुरू ठेवा: Deutsch-Jozsa अल्गोरिदम' },
  activity: { completedQuantumGates: 'क्वांटम गेट्स पूर्ण केले', builtBellState: 'Bell State सर्किट बांधले', scoredSuperposition: 'Superposition वर 90% गुण', startedQuantumEntanglement: 'क्वांटम एंटॅंगलमेंट सुरू केले', relativeDays: days => `${days} दिवस` },
  content: { lessons: { 'quantum-fundamentals:introduction-to-quantum-computing': 'क्वांटम कम्प्युटिंगचा परिचय' }, challenges: { 'build-superposition': 'समान Superposition तयार करा', 'build-bell-state': 'Bell State तयार करा' } },
}


const HINDI_STUDENT: StudentTranslations = {
  common: {
    level: 'स्तर',
    levels: 'स्तर',
    lesson: 'पाठ',
    lessons: 'पाठ',
    complete: 'पूर्ण',
    completed: 'पूर्ण हुआ',
    notStarted: 'शुरू नहीं हुआ',
    inProgress: 'प्रगति पर',
    upcoming: 'आगामी',
    previous: 'पिछला',
    next: 'अगला',
    min: 'मिनट',
    xp: 'XP',
    close: 'बंद करें',
    cancel: 'रद्द करें',
    reset: 'रीसेट करें',
    save: 'सहेजें',
    clear: 'साफ़ करें',
    run: 'चलाएँ',
    undo: 'पूर्ववत करें',
    redo: 'फिर से करें',
    and: 'और',
  },
  courses: {
    eyebrow: 'सीखने के मार्ग',
    title: 'पाठ्यक्रम',
    description: 'क्यूबिट से व्यावहारिक एल्गोरिदम तक, चार निर्देशित स्तरों में क्वांटम कंप्यूटिंग सीखें।',
    overall: 'कुल',
    continueLearning: 'सीखना जारी रखें',
    continue: 'जारी रखें',
    levels: 'स्तर',
    curriculum: 'पाठ्यचर्या',
    courseLevels: 'पाठ्यक्रम स्तर',
    overallCompletion: 'कुल पूर्णता',
    reviewCourse: 'पाठ्यक्रम की समीक्षा करें',
    startCourse: 'पाठ्यक्रम शुरू करें',
    continueCourse: 'सीखना जारी रखें',
    quizSaved: 'आपका क्विज़ परिणाम पाठ की प्रगति के साथ स्थानीय रूप से सहेजा गया है।',
    quizUnlock: 'पाठ पूर्ण करने के लिए ज्ञान जाँच का उत्तर दें।',
    conceptIntroduction: 'अवधारणा परिचय',
    startWithIdea: 'विचार से शुरू करें',
    coreExplanation: 'मूल व्याख्या',
    howItWorks: 'यह कैसे काम करता है',
    interactiveExample: 'इंटरैक्टिव उदाहरण',
    exampleSteps: 'उदाहरण के चरण',
    tryItYourself: 'स्वयं आज़माएँ',
    openIdea: 'इस विचार को Circuit Builder में खोलें',
    openCircuit: 'सर्किट खोलें',
    knowledgeCheck: 'ज्ञान जाँच',
    checkUnderstanding: 'अपनी समझ की जाँच करें',
    chooseAnswer: 'एक उत्तर चुनें',
    correct: 'सही',
    notQuite: 'पूरी तरह सही नहीं',
    checkAnswer: 'उत्तर जाँचें',
    tryAgain: 'पुनः प्रयास करें',
    lessonProgress: (completed, total) => `${total} में से ${completed} पूर्ण`,
    completionLabel: name => `${name} प्रगति`,
    content: {
      'course-fundamentals': {
        title: 'क्वांटम मूलभूत सिद्धांत',
        description: 'क्यूबिट, एम्प्लिट्यूड, सुपरपोजिशन और मापन की सटीक समझ विकसित करें।',
      },
      'course-gates': {
        title: 'क्वांटम गेट्स',
        description: 'क्वांटम अवस्थाओं को रूपांतरित करने वाले ऑपरेशनों को समझें और उपयोगी सर्किट बनाएँ।',
      },
      'course-circuits': {
        title: 'क्वांटम सर्किट',
        description: 'मल्टी-क्यूबिट सर्किट, सहसंबंध और एंटैंगलमेंट को पढ़ें, डिज़ाइन करें और समझें।',
      },
      'course-algorithms': {
        title: 'क्वांटम एल्गोरिदम',
        description: 'Deutsch–Jozsa और Grover जैसे एल्गोरिदम पैटर्न के साथ क्वांटम प्रिमिटिव्स को जोड़ें।',
      },
    },
    lessons: {
      'quantum-fundamentals:introduction-to-quantum-computing': { title: 'क्वांटम कंप्यूटिंग का परिचय' },
      'quantum-fundamentals:classical-bit-vs-qubit': { title: 'क्लासिकल बिट बनाम क्यूबिट' },
      'quantum-fundamentals:qubit-states': { title: 'क्यूबिट अवस्थाएँ' },
      'quantum-fundamentals:superposition': { title: 'सुपरपोजिशन' },
      'quantum-fundamentals:quantum-measurement': { title: 'क्वांटम मापन' },
      'quantum-gates:introduction-to-quantum-gates': { title: 'क्वांटम गेट्स का परिचय' },
      'quantum-gates:pauli-x-gate': { title: 'Pauli-X गेट' },
      'quantum-gates:pauli-y-gate': { title: 'Pauli-Y गेट' },
      'quantum-gates:pauli-z-gate': { title: 'Pauli-Z गेट' },
      'quantum-gates:hadamard-gate': { title: 'Hadamard गेट' },
      'quantum-gates:phase-gates': { title: 'फेज गेट्स' },
      'quantum-gates:rotation-gates': { title: 'रोटेशन गेट्स' },
      'quantum-circuits:quantum-circuit-basics': { title: 'क्वांटम सर्किट के मूलभूत सिद्धांत' },
      'quantum-circuits:multiple-qubits': { title: 'मल्टीपल क्यूबिट्स' },
      'quantum-circuits:cnot-gate': { title: 'CNOT गेट' },
      'quantum-circuits:entanglement': { title: 'एंटैंगलमेंट' },
      'quantum-circuits:bell-states': { title: 'Bell अवस्थाएँ' },
      'quantum-algorithms:deutsch-jozsa-algorithm': { title: 'Deutsch–Jozsa एल्गोरिदम' },
      'quantum-algorithms:grovers-algorithm': { title: 'Grover एल्गोरिदम' },
      'quantum-algorithms:quantum-fourier-transform': { title: 'क्वांटम फूरियर ट्रांसफॉर्म' },
    },
  },
  challenges: {
    eyebrow: 'आपका अभ्यास',
    title: 'क्वांटम चुनौतियाँ',
    description: 'सर्किट बनाकर, ठीक करके और उनके तर्क को समझकर प्रत्येक अवधारणा को लागू करें।',
    yourPractice: 'आपका अभ्यास',
    progress: 'चुनौती प्रगति',
    completed: 'पूर्ण',
    currentLevel: 'वर्तमान स्तर',
    accuracy: 'सटीकता',
    bestScore: 'सर्वोच्च अंक',
    history: 'इतिहास',
    recent: 'हाल की चुनौतियाँ',
    retryNeeded: 'पुनः प्रयास आवश्यक',
    attempt: 'प्रयास',
    type: {
      'build-circuit': 'सर्किट बनाएँ',
      'predict-output': 'आउटपुट का अनुमान लगाएँ',
      'fix-circuit': 'सर्किट ठीक करें',
      'identify-gate': 'गेट पहचानें',
      algorithm: 'एल्गोरिदम चुनौती',
    },
    difficulty: {
      beginner: { title: 'शुरुआती', description: 'सिंगल-क्यूबिट गेट्स, सुपरपोजिशन और मापन।' },
      intermediate: { title: 'मध्यम', description: 'नियंत्रित गेट्स, सहसंबंध और Bell अवस्थाएँ।' },
      advanced: { title: 'उन्नत', description: 'क्वांटम एल्गोरिदम निर्माण और विश्लेषण।' },
    },
    status: {
      upcoming: 'आगामी',
      completed: 'पूर्ण',
      inProgress: 'प्रगति पर',
      notStarted: 'शुरू नहीं हुआ',
    },
    challengeCount: count => `${count} चुनौतियाँ`,
    best: score => `सर्वोच्च ${score}`,
    content: {
      'build-superposition': {
        title: 'समान सुपरपोजिशन बनाएँ',
        shortDescription: '|0⟩ में इनिशियलाइज़ किए गए क्यूबिट से |+⟩ तैयार करें।',
        description: 'वायर पर गेट्स रखें ताकि अंतिम क्वांटम अवस्था (|0⟩ + |1⟩)/√2 हो। समतुल्य सर्किट स्वीकार किए जाते हैं।',
        goal: '|+⟩ तैयार करें, जिससे |0⟩ और |1⟩ दोनों के लिए 50% संभावना मिले।',
        hints: [
          'Bit flip |0⟩ को |1⟩ में बदलता है, लेकिन यह दो आयाम नहीं बनाता।',
          'ऐसा गेट ढूँढें जिसके विवरण में सुपरपोजिशन का उल्लेख हो।',
          'q0 पर Hadamard गेट लागू करें। सत्यापन के लिए मापन वैकल्पिक है।',
        ],
        explanation: 'Hadamard ऑपरेशन |0⟩ को |+⟩ = (|0⟩ + |1⟩)/√2 में मैप करता है। किसी भी आयाम का वर्ग करने पर 1/2 मापन संभावना मिलती है।',
      },
      'predict-hadamard-output': {
        title: 'Hadamard मापन का अनुमान लगाएँ',
        shortDescription: 'एक-क्यूबिट सर्किट के आउटपुट वितरण का अनुमान लगाएँ।',
        description: 'क्यूबिट |0⟩ से शुरू होता है, दिखाए गए सर्किट से गुजरता है, और कम्प्यूटेशनल बेसिस में मापा जाता है।',
        goal: 'सर्किट द्वारा उत्पन्न मापन वितरण चुनें।',
        options: {
          'always-zero': 'हमेशा |0⟩',
          'always-one': 'हमेशा |1⟩',
          equal: '50% |0⟩ और 50% |1⟩',
          'no-measurement': 'कोई परिणाम नहीं मिलता',
        },
        hints: [
          'मापन से पहले गेट को बाएँ से दाएँ पढ़ें।',
          'Hadamard बेसिस अवस्थाओं को समान-परिमाण सुपरपोजिशन में बदलता है।',
          'दोनों आयामों का परिमाण 1/√2 है, इसलिए दोनों संभावनाएँ 1/2 हैं।',
        ],
        explanation: 'H|0⟩ = (|0⟩ + |1⟩)/√2। इसलिए कई शॉट्स पर मापन समान संभावना के साथ 0 या 1 लौटाता है।',
      },
      'identify-x-gate': {
        title: 'Bit-Flip गेट पहचानें',
        shortDescription: '|0⟩ को |1⟩ में मैप करने वाले ऑपरेशन को खोजें।',
        description: 'एक एकल क्यूबिट |0⟩ से शुरू होता है और निश्चित रूप से |1⟩ पर समाप्त होना चाहिए। इस रूपांतरण को करने वाले गेट की पहचान करें।',
        goal: 'कम्प्यूटेशनल बेसिस मान को निश्चित रूप से पलटने वाला गेट चुनें।',
        options: {
          h: 'Hadamard (H)',
          x: 'Pauli-X (X)',
          z: 'Pauli-Z (Z)',
          s: 'Phase (S)',
        },
        hints: [
          'आवश्यक ऑपरेशन क्लासिकल NOT का क्वांटम एनालॉग है।',
          'केवल-फेज गेट 0 या 1 मापने की संभावना को बदल नहीं सकता।',
          'Pauli-X मैट्रिक्स |0⟩ और |1⟩ आयामों की अदला-बदली करता है।',
        ],
        explanation: 'Pauli-X गेट एक बिट फ्लिप है: X|0⟩ = |1⟩ और X|1⟩ = |0⟩। Hadamard सुपरपोजिशन बनाता है, जबकि Z और S फेज बदलते हैं।',
      },
      'build-bell-state': {
        title: 'Bell अवस्था बनाएँ',
        shortDescription: 'दो क्यूबिट्स को Phi-plus Bell अवस्था में एंटैंगल करें।',
        description: '|00⟩ से शुरू करके कोई भी समतुल्य सर्किट बनाएँ जिसकी अंतिम अवस्था (|00⟩ + |11⟩)/√2 हो।',
        goal: 'सहसंबद्ध परिणाम तैयार करें: 50% |00⟩, 50% |11⟩, सही सापेक्ष फेज के साथ।',
        hints: [
          'पहले क्यूबिट की स्थिति बदलकर शुरुआत करें।',
          'q1 को सहसंबंधित करने से पहले q0 पर सुपरपोजिशन बनाएँ।',
          'q0 पर H लागू करें, फिर q1 को लक्षित करने वाले CNOT के कंट्रोल के रूप में q0 का उपयोग करें।',
        ],
        explanation: 'H (|00⟩ + |10⟩)/√2 बनाता है। CNOT फिर केवल |10⟩ शाखा में q1 को फ्लिप करता है, जिससे (|00⟩ + |11⟩)/√2 उत्पन्न होता है।',
      },
      'fix-bell-state': {
        title: 'Bell सर्किट ठीक करें',
        shortDescription: 'गलत दिशा में इंगित नियंत्रित गेट को सही करें।',
        description: 'यह सर्किट सुपरपोजिशन बनाता है लेकिन अपने क्यूबिट्स को एंटैंगल करने में विफल रहता है। नियंत्रित ऑपरेशन का निरीक्षण करें और सर्किट को ठीक करें।',
        goal: 'Phi-plus Bell अवस्था (|00⟩ + |11⟩)/√2 प्राप्त करें।',
        hints: [
          'Hadamard पहले से ही इच्छित क्यूबिट पर कार्य कर रहा है।',
          'एक नियंत्रित गेट केवल तभी कार्य करता है जब उसका कंट्रोल क्यूबिट |1⟩ हो। किस क्यूबिट पर सुपरपोजिशन है?',
          'वर्तमान CNOT हटाएँ, फिर q0 को कंट्रोल और q1 को टारगेट के रूप में उपयोग करें।',
        ],
        explanation: 'मूल CNOT ने q1 को अपने कंट्रोल के रूप में उपयोग किया, लेकिन q1 |0⟩ ही रहा, इसलिए यह कभी ट्रिगर नहीं हुआ। q0 पर कंट्रोल करने से q0 की शाखा की जानकारी q1 में स्थानांतरित होती है और एंटैंगलमेंट बनता है।',
      },
      'grover-amplitude-amplification': {
        title: 'Grover Amplitude Amplification',
        shortDescription: 'ओरेकल बनाएँ और चिह्नित दो-क्यूबिट अवस्था को एम्प्लीफाई करें।',
        description: 'फेज ओरेकल, डिफ्यूजन और एम्प्लीच्यूड एम्प्लीफिकेशन को कवर करने वाली एक उन्नत निर्माण चुनौती।',
        goal: 'एक Grover इटरेशन का उपयोग करके चिह्नित बेसिस अवस्था को एम्प्लीफाई करें।',
        availabilityNote: 'क्वांटम एल्गोरिदम पाठ्यक्रम स्तर के साथ जल्द उपलब्ध होगा।',
      },
    },
    goal: 'लक्ष्य',
    details: 'चुनौती विवरण',
    upTo: 'अधिकतम',
    workspace: 'कार्यक्षेत्र',
    chooseExpectedOutput: 'अपेक्षित आउटपुट चुनें',
    chooseGate: 'गेट चुनें',
    buildCircuit: 'अपना सर्किट बनाएँ',
    repairCircuit: 'सर्किट ठीक करें',
    selectAnswer: 'एक उत्तर चुनें',
    submitAnswer: 'उत्तर सबमिट करें',
    allChallenges: 'सभी चुनौतियाँ',
    backToChallenges: 'चुनौतियों पर वापस जाएँ',
    progressiveHints: 'प्रगतिशील संकेत',
    hintsRevealed: (visible, total) => `${total} में से ${visible} संकेत दिखाए गए`,
    revealClue: count => `संकेत ${count} देखें`,
    allHintsRevealed: 'सभी संकेत दिखाए गए',
    emptyHint: 'जब आवश्यकता हो, तब एक बार में एक संकेत देखें।',
    challengeComplete: 'चुनौती पूर्ण हुई',
    notThereYet: 'अभी पूरा नहीं हुआ',
    computedDistribution: 'परिकलित वितरण',
    hintsUsed: 'उपयोग किए गए संकेत',
    time: 'समय',
    xpEarned: 'अर्जित XP',
    nextChallenge: 'अगली चुनौती',
    retry: 'पुनः प्रयास करें',
    openInCircuitBuilder: 'Circuit Builder में खोलें',
    submitCircuit: 'सर्किट सबमिट करें',
    circuitControls: 'चुनौती सर्किट नियंत्रण',
    circuitToAnalyze: 'विश्लेषण के लिए सर्किट',
    stateTransformation: 'क्वांटम स्थिति परिवर्तन',
    challengesCompletedAria: level => `${level} चुनौतियाँ पूर्ण हुईं`,
    typeShort: {
      'build-circuit': 'बनाएँ',
      'predict-output': 'अनुमान लगाएँ',
      'fix-circuit': 'ठीक करें',
      'identify-gate': 'पहचानें',
      algorithm: 'एल्गोरिदम',
    },
  },
  simulator: {
    eyebrow: 'क्वांटम निष्पादन',
    title: 'क्वांटम सिम्युलेटर',
    description: 'सर्किट चलाएँ, इसके मापन वितरण का निरीक्षण करें और परिणाम को अंतर्निहित क्वांटम अवस्था से जोड़ें।',
    localBackendReady: 'स्थानीय बैकएंड तैयार है',
    educationalMock: 'शैक्षिक मॉक',
    configure: 'कॉन्फ़िगर करें',
    setup: 'सिमुलेशन सेटअप',
    circuit: 'सर्किट',
    circuitSource: 'सर्किट स्रोत',
    savedCircuits: 'सहेजे गए सर्किट',
    exampleCircuits: 'उदाहरण सर्किट',
    executionSettings: 'निष्पादन सेटिंग्स',
    shots: 'शॉट्स',
    repeatedMeasurements: 'दोहराए गए मापों की संख्या।',
    backend: 'सिमुलेशन बैकएंड',
    available: 'उपलब्ध',
    comingSoon: 'जल्द आ रहा है',
    runSimulation: 'सिमुलेशन चलाएँ',
    runningSimulation: 'सिमुलेशन चल रहा है...',
    editInBuilder: 'Builder में संपादित करें',
    completed: 'पूर्ण',
    results: 'सिमुलेशन परिणाम',
    localNotice: 'ये परिणाम सीखने के लिए स्थानीय रूप से परिकलित किए गए हैं। ये Qiskit Aer या वास्तविक क्वांटम हार्डवेयर के परिणाम नहीं हैं।',
    execution: 'निष्पादन',
    executionSummary: 'निष्पादन सारांश',
    localCompute: 'स्थानीय गणना',
    outcomes: 'परिणाम',
    gateOperations: 'गेट ऑपरेशन्स',
    measurements: 'मापन',
    circuitDepth: 'सर्किट गहराई',
    beforeMeasurement: 'मापन से पहले',
    stateVector: 'स्टेट वेक्टर',
    distribution: 'वितरण',
    measurementProbabilities: 'मापन संभावनाएँ',
    counts: 'गिनती',
    measurementResults: 'मापन परिणाम',
    outcome: 'परिणाम',
    frequency: 'आवृत्ति',
    whyThisHappened: 'ऐसा क्यों हुआ',
    resultExplanation: 'परिणाम की व्याख्या',
    probabilityNote: 'स्टेट वेक्टर संभावना आयामों को संग्रहीत करता है। प्रत्येक आयाम के परिमाण का वर्ग करने पर उसकी बेसिस-अवस्था संभावना मिलती है।',
    singleQubit: 'सिंगल क्यूबिट',
    blochVector: 'ब्लोच वेक्टर',
  },
  builder: {
    title: 'सर्किट बिल्डर',
    description: 'क्यूबिट तारों पर गेट्स रखकर क्वांटम सर्किट बनाएँ।',
    hint: 'पैलेट से एक गेट चुनें, फिर उसे रखने के लिए सेल पर क्लिक करें।',
    gatePalette: 'गेट पैलेट',
    singleQubit: 'सिंगल क्यूबिट',
    parameterized: 'पैरामीटरयुक्त',
    multiQubit: 'मल्टी-क्यूबिट',
    measurement: 'मापन',
    clickTarget: 'टारगेट क्यूबिट पर क्लिक करें',
    clickCell: 'रखने के लिए सेल पर क्लिक करें',
    controlFirst: 'मल्टी-क्यूबिट गेट्स के लिए, पहले कंट्रोल क्यूबिट पर क्लिक करें, फिर टारगेट पर।',
    target: 'टारगेट',
    properties: 'गुणधर्म',
    selectGate: 'निरीक्षण करने के लिए गेट चुनें।',
    gateProperties: 'गेट गुणधर्म',
    moment: 'मोमेंट',
    controlQubit: 'कंट्रोल क्यूबिट',
    targetQubit: 'टारगेट क्यूबिट',
    classicalBit: 'क्लासिकल बिट',
    angle: 'कोण',
    degrees: 'डिग्री',
    removeGate: 'गेट हटाएँ',
    circuitToolbar: 'सर्किट टूलबार',
    circuitName: 'सर्किट नाम',
    clickToRename: 'नाम बदलने के लिए क्लिक करें',
    removeQubit: 'क्यूबिट हटाएँ',
    addQubit: 'क्यूबिट जोड़ें',
    clearGates: 'सभी गेट्स हटाएँ',
    examples: 'उदाहरण',
    starterCircuits: 'शुरुआती सर्किट',
    shots: 'शॉट्स की संख्या',
    running: 'चल रहा है…',
    simulator: 'सिमुलेटर',
    saveCircuit: 'सर्किट सहेजें',
    jsonModel: 'सर्किट JSON मॉडल',
    jsonRepresentation: 'सर्किट JSON निरूपण',
    qubits: count => `${count} क्यूबिट`,
    operations: count => `${count} ऑपरेशन्स`,
    runningOn: shots => `${shots} शॉट्स पर सिमुलेशन चल रहा है…`,
    gates: {
      H: { label: 'Hadamard', description: 'सुपरपोजिशन बनाता है।' },
      X: { label: 'Pauli-X', description: 'क्यूबिट अवस्था को उलटता है।' },
      Y: { label: 'Pauli-Y', description: 'बिट और फेज फ्लिप को जोड़ता है।' },
      Z: { label: 'Pauli-Z', description: 'फेज फ्लिप लागू करता है।' },
      S: { label: 'S Gate (Phase)', description: 'π/2 फेज शिफ्ट लागू करता है।' },
      T: { label: 'T Gate (π/8)', description: 'π/4 फेज शिफ्ट लागू करता है।' },
      RX: { label: 'Rotation X', description: 'क्यूबिट को X अक्ष के चारों ओर घुमाता है।' },
      RY: { label: 'Rotation Y', description: 'क्यूबिट को Y अक्ष के चारों ओर घुमाता है।' },
      RZ: { label: 'Rotation Z', description: 'क्यूबिट को Z अक्ष के चारों ओर घुमाता है।' },
      CNOT: { label: 'CNOT', description: 'कंट्रोल |1⟩ होने पर टारगेट को उलटता है।' },
      CZ: { label: 'CZ Gate', description: 'कंट्रोल |1⟩ होने पर टारगेट पर Z लागू करता है।' },
      SWAP: { label: 'SWAP', description: 'दो क्यूबिट्स की अवस्थाओं की अदला-बदली करता है।' },
      MEASURE: { label: 'Measure', description: 'कम्प्यूटेशनल बेसिस में क्यूबिट को मापता है।' },
    },
    starters: {
      'starter-bell-state': 'Bell अवस्था',
      'starter-superposition': 'सुपरपोजिशन',
      'starter-basic-measurement': 'मूलभूत मापन',
      'starter-entanglement': 'एंटैंगलमेंट उदाहरण',
      'starter-not': 'क्वांटम NOT',
      'starter-ghz': 'GHZ अवस्था',
      'starter-phase-kickback': 'फेज किकबैक',
    },
  },
}

const STUDENT_TRANSLATIONS: Record<string, StudentTranslations> = { EN: ENGLISH_STUDENT, MR: MARATHI_STUDENT, HI: HINDI_STUDENT }


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
    aiTutor: MARATHI_AI_TUTOR,
    dashboard: MARATHI_DASHBOARD,
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

export type ResolvedTranslationSet = TranslationSet & { student: StudentTranslations }

export function getTranslations(code: string): ResolvedTranslationSet {
  const base = TRANSLATIONS[code] ?? ENGLISH
  return {
    ...base,
    student: STUDENT_TRANSLATIONS[code] ?? ENGLISH_STUDENT,
  }
}
