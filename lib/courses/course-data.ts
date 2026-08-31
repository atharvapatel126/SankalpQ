import type {
  Course,
  Lesson,
  QuizQuestion,
  QuizQuestionType,
} from './types'

type LessonDraft = Omit<Lesson, 'id' | 'order'>

interface CourseDraft {
  id: string
  slug: string
  level: number
  title: string
  description: string
  outcome: string
  lessons: LessonDraft[]
}

function quiz(
  id: string,
  type: QuizQuestionType,
  prompt: string,
  options: [string, string, ...string[]],
  correctIndex: number,
  explanation: string
): QuizQuestion {
  return {
    id,
    type,
    prompt,
    options: options.map((label, index) => ({
      id: 'option-' + index,
      label,
    })),
    correctOptionId: 'option-' + correctIndex,
    explanation,
  }
}

function makeCourse(draft: CourseDraft): Course {
  return {
    ...draft,
    lessons: draft.lessons.map((item, index) => ({
      ...item,
      id: draft.slug + ':' + item.slug,
      order: index + 1,
    })),
  }
}

const QUANTUM_FUNDAMENTALS = makeCourse({
  id: 'course-fundamentals',
  slug: 'quantum-fundamentals',
  level: 1,
  title: 'Quantum Fundamentals',
  description:
    'Build a precise mental model of qubits, amplitudes, superposition, and measurement.',
  outcome:
    'Read a single-qubit state and connect its amplitudes to measurement probabilities.',
  lessons: [
    {
      slug: 'introduction-to-quantum-computing',
      title: 'Introduction to Quantum Computing',
      summary: 'Understand what makes a quantum computation different.',
      introduction:
        'Quantum computers process information by controlling physical systems that obey quantum mechanics. Their advantage comes from shaping probability amplitudes so useful answers reinforce one another.',
      coreExplanation: [
        'A quantum program prepares qubits, applies a sequence of gates, and finally measures them to obtain classical bits. The gates change complex amplitudes, including their relative phases.',
        'Quantum computers are not faster for every problem. They are promising for particular tasks such as simulating quantum systems, factoring large integers, and searching some structured spaces.',
      ],
      keyPoints: [
        'A quantum circuit is a controlled sequence of state transformations.',
        'Interference, not mere randomness, is the resource algorithms organize.',
        'Every run ends with classical measurement outcomes.',
      ],
      formula: {
        expression: '|ψ⟩ = α|0⟩ + β|1⟩',
        explanation:
          'A qubit is described by two complex probability amplitudes, α and β.',
      },
      visual: {
        title: 'The quantum computation loop',
        description:
          'Useful quantum programs move through four distinct stages.',
        stages: [
          { label: 'Prepare', state: '|0…0⟩', explanation: 'Initialize a known reference state.' },
          { label: 'Transform', state: 'U|ψ⟩', explanation: 'Apply gates that change amplitudes and phases.' },
          { label: 'Interfere', state: 'amplify / cancel', explanation: 'Arrange paths so some answers become more likely.' },
          { label: 'Measure', state: 'an n-bit string', explanation: 'Sample a classical result from the final probabilities.' },
        ],
      },
      interactive: {
        title: 'Follow one qubit through a circuit',
        description:
          'A Hadamard gate gives the simplest complete example of prepare, transform, and measure.',
        steps: [
          { label: 'Initialize', state: '|0⟩', explanation: 'The qubit begins in the computational basis state zero.' },
          { label: 'Apply H', state: '(|0⟩ + |1⟩)/√2', explanation: 'The gate creates two equal positive amplitudes.' },
          { label: 'Measure', state: '0: 50% · 1: 50%', explanation: 'Each run returns one bit; many runs reveal the distribution.' },
        ],
      },
      builderExercise: {
        starterCircuitId: 'starter-superposition',
        task: 'Run the prepared Hadamard circuit at several shot counts and compare how the histogram settles near 50–50.',
      },
      quiz: quiz(
        'intro-purpose',
        'multiple-choice',
        'What does a quantum circuit manipulate before measurement?',
        ['Classical clock speed', 'Probability amplitudes and phases', 'Only random bits', 'Database rows'],
        1,
        'Quantum gates transform complex amplitudes and their relative phases. Measurement converts the resulting distribution into classical outcomes.'
      ),
    },
    {
      slug: 'classical-bit-vs-qubit',
      title: 'Classical Bit vs Qubit',
      summary: 'Compare definite classical values with quantum states.',
      introduction:
        'A classical bit stores one definite value, 0 or 1. A qubit can occupy any normalized combination of the basis states |0⟩ and |1⟩ before it is measured.',
      coreExplanation: [
        'The amplitudes α and β are not probabilities themselves. Their squared magnitudes give probabilities, while their phases determine how quantum paths later interfere.',
        'Measurement does not reveal a hidden pair of amplitudes. It produces one classical outcome and changes the state, so estimating an unknown state requires many identically prepared qubits.',
      ],
      keyPoints: [
        'A bit has one definite binary value at a time.',
        'A qubit state includes magnitudes and relative phase.',
        'One measurement yields one classical bit, not the full state description.',
      ],
      formula: {
        expression: '|α|² + |β|² = 1',
        explanation:
          'Normalization ensures that the probabilities of measuring 0 or 1 add to 100%.',
      },
      visual: {
        title: 'Two ways to represent information',
        description:
          'The same labels 0 and 1 play different roles in classical and quantum systems.',
        stages: [
          { label: 'Classical', state: '0 or 1', explanation: 'The stored value is definite and can be read without probabilistic sampling.' },
          { label: 'Quantum', state: 'α|0⟩ + β|1⟩', explanation: 'Amplitudes describe a state that can show interference.' },
          { label: 'Readout', state: '0 or 1', explanation: 'Measurement returns a classical value according to |α|² and |β|².' },
        ],
      },
      interactive: {
        title: 'Flip a definite state',
        description:
          'The Pauli-X gate behaves like a NOT gate on computational basis states.',
        steps: [
          { label: 'Input', state: '|0⟩', explanation: 'The probability of measuring 0 is initially 100%.' },
          { label: 'Apply X', state: '|1⟩', explanation: 'X swaps the amplitudes of |0⟩ and |1⟩.' },
          { label: 'Measure', state: '1: 100%', explanation: 'This basis-state experiment has a deterministic result.' },
        ],
      },
      builderExercise: {
        starterCircuitId: 'starter-not',
        task: 'Run the Quantum NOT starter, then remove X and observe how the output changes from certain 1 back to certain 0.',
      },
      quiz: quiz(
        'bit-qubit-readout',
        'true-false',
        'A single measurement reveals both amplitudes α and β of an unknown qubit.',
        ['True', 'False'],
        1,
        'A single measurement returns only 0 or 1. State estimation needs many copies prepared in the same state and measurements in multiple bases.'
      ),
    },
    {
      slug: 'qubit-states',
      title: 'Qubit States',
      summary: 'Read basis states and the geometry of a pure qubit.',
      introduction:
        'The basis states |0⟩ and |1⟩ are the reference directions for a qubit. Pure states between them can be visualized as points on the Bloch sphere.',
      coreExplanation: [
        'The polar angle θ controls the balance between |0⟩ and |1⟩. The azimuthal angle φ records their relative phase, which becomes observable when later gates make amplitudes interfere.',
        'Multiplying the entire state by one complex phase does not change any physical prediction. Relative phase between components does matter.',
      ],
      keyPoints: [
        '|0⟩ and |1⟩ are orthogonal computational basis states.',
        'The Bloch sphere represents pure single-qubit states.',
        'Global phase is unobservable, while relative phase affects interference.',
      ],
      formula: {
        expression: '|ψ⟩ = cos(θ/2)|0⟩ + eⁱᵠ sin(θ/2)|1⟩',
        explanation:
          'The angles θ and φ locate a normalized pure qubit on the Bloch sphere.',
      },
      visual: {
        title: 'Landmarks on the Bloch sphere',
        description:
          'Several important states occupy simple geometric positions.',
        stages: [
          { label: 'North pole', state: '|0⟩', explanation: 'A computational-basis state with z = +1.' },
          { label: 'Equator', state: '|+⟩', explanation: 'An equal, in-phase superposition with x = +1.' },
          { label: 'South pole', state: '|1⟩', explanation: 'The other computational-basis state with z = −1.' },
        ],
      },
      interactive: {
        title: 'Travel from north to south',
        description:
          'A Pauli-X gate rotates the Bloch vector by π around the x-axis.',
        steps: [
          { label: 'Start', state: '|0⟩ · z = +1', explanation: 'The state begins at the north pole.' },
          { label: 'Rotate', state: 'X|0⟩', explanation: 'X performs a half-turn around the x-axis.' },
          { label: 'Finish', state: '|1⟩ · z = −1', explanation: 'The state reaches the south pole.' },
        ],
      },
      builderExercise: {
        starterCircuitId: 'starter-not',
        task: 'Apply X twice before measurement. The two half-turns should return the qubit to |0⟩.',
      },
      quiz: quiz(
        'qubit-state-x',
        'output-prediction',
        'What state results when X is applied to |0⟩?',
        ['|0⟩', '|1⟩', '|+⟩', 'A random state'],
        1,
        'Pauli-X swaps the computational basis states, so X|0⟩ = |1⟩.'
      ),
    },
    {
      slug: 'superposition',
      title: 'Superposition',
      summary: 'Connect amplitudes, phase, and probabilistic outcomes.',
      introduction:
        'Superposition means that a quantum state has nonzero amplitudes for more than one basis state. It is not a classical object secretly holding both definite answers.',
      coreExplanation: [
        'Applying H to |0⟩ creates |+⟩, whose two basis amplitudes have equal magnitude and equal phase. Direct measurement therefore gives 0 and 1 with equal probability.',
        'The sign between amplitudes matters. The state |−⟩ has the same direct measurement probabilities as |+⟩, but a later Hadamard sends |+⟩ to |0⟩ and |−⟩ to |1⟩.',
      ],
      keyPoints: [
        'Superposition is a coherent combination of basis amplitudes.',
        'Equal magnitudes create equal measurement probabilities.',
        'Relative signs and phases control later interference.',
      ],
      formula: {
        expression: 'H|0⟩ = |+⟩ = (|0⟩ + |1⟩)/√2',
        explanation:
          'Both amplitudes are 1/√2, so each squared magnitude is 1/2.',
      },
      visual: {
        title: 'From certainty to equal probabilities',
        description:
          'The Hadamard changes the state before any measurement occurs.',
        stages: [
          { label: 'Input', state: '|0⟩', explanation: 'Only the |0⟩ amplitude is nonzero.' },
          { label: 'Hadamard', state: '(|0⟩ + |1⟩)/√2', explanation: 'The amplitude is shared coherently across both basis states.' },
          { label: 'Probabilities', state: 'P(0)=½ · P(1)=½', explanation: 'Squaring the amplitudes gives an even distribution.' },
        ],
      },
      interactive: {
        title: 'Build and sample |+⟩',
        description:
          'Step through the state change, then compare it with repeated circuit runs.',
        steps: [
          { label: 'Prepare', state: '|0⟩', explanation: 'A new qubit begins with a definite zero outcome.' },
          { label: 'Apply H', state: '|+⟩', explanation: 'The state now carries two equal positive amplitudes.' },
          { label: 'Sample', state: '0 ≈ 50% · 1 ≈ 50%', explanation: 'Finite shot counts fluctuate around the ideal probabilities.' },
        ],
      },
      builderExercise: {
        starterCircuitId: 'starter-superposition',
        task: 'Compare 128 shots with 4096 shots. The larger sample should usually sit closer to the ideal 50–50 distribution.',
      },
      quiz: quiz(
        'superposition-gate',
        'multiple-choice',
        'Which gate creates equal probabilities for |0⟩ and |1⟩ when applied to |0⟩?',
        ['X', 'H', 'Z', 'CNOT'],
        1,
        'H maps |0⟩ to (|0⟩ + |1⟩)/√2, giving both outcomes probability 1/2.'
      ),
    },
    {
      slug: 'quantum-measurement',
      title: 'Quantum Measurement',
      summary: 'Use the Born rule to predict observed outcomes.',
      introduction:
        'Measurement connects a quantum state to classical information. In the computational basis it returns 0 or 1 and generally changes the state.',
      coreExplanation: [
        'The Born rule says that each outcome probability is the squared magnitude of its amplitude. Complex phase does not affect this direct probability, though it can affect probabilities after more gates.',
        'After a projective measurement, repeating the same measurement immediately gives the same result. To estimate the original distribution, the preparation and measurement experiment must be repeated over many shots.',
      ],
      keyPoints: [
        'Measurement probabilities come from squared amplitude magnitudes.',
        'A projective measurement updates the state to the observed basis state.',
        'Shot counts approximate ideal probabilities through repeated preparation.',
      ],
      formula: {
        expression: 'P(0)=|α|²,  P(1)=|β|²',
        explanation:
          'For |ψ⟩ = α|0⟩ + β|1⟩, these are the computational-basis outcome probabilities.',
      },
      visual: {
        title: 'How a histogram is produced',
        description:
          'A shot is one complete prepare–transform–measure experiment.',
        stages: [
          { label: 'Prepare', state: '|ψ⟩', explanation: 'Create the same state for every shot.' },
          { label: 'Measure', state: '0 or 1', explanation: 'Sample one outcome using the Born probabilities.' },
          { label: 'Repeat', state: 'N shots', explanation: 'Run the preparation again rather than remeasuring the collapsed qubit.' },
          { label: 'Estimate', state: 'counts / N', explanation: 'Relative frequencies approach the ideal distribution.' },
        ],
      },
      interactive: {
        title: 'Predict a biased measurement',
        description:
          'Consider a normalized state whose amplitudes do not have equal magnitude.',
        steps: [
          { label: 'State', state: '√3/2|0⟩ + 1/2|1⟩', explanation: 'The amplitudes have magnitudes about 0.866 and 0.5.' },
          { label: 'Square', state: '3/4 and 1/4', explanation: 'Square each magnitude rather than the amplitude itself.' },
          { label: 'Sample', state: '0: 75% · 1: 25%', explanation: 'Over many shots, zero should appear roughly three times as often.' },
        ],
      },
      builderExercise: {
        starterCircuitId: 'starter-superposition',
        task: 'Run the same prepared state more than once and notice that individual counts vary even though the underlying ideal probabilities do not.',
      },
      quiz: quiz(
        'measurement-born-rule',
        'output-prediction',
        'For |ψ⟩ = √3/2|0⟩ + 1/2|1⟩, what is P(1)?',
        ['1/2', '1/4', '√3/2', '3/4'],
        1,
        'The probability is the squared magnitude of the |1⟩ amplitude: |1/2|² = 1/4.'
      ),
    },
  ],
})

const QUANTUM_GATES = makeCourse({
  id: 'course-gates',
  slug: 'quantum-gates',
  level: 2,
  title: 'Quantum Gates',
  description:
    'Learn how common single-qubit gates control bit values, phase, and rotations.',
  outcome:
    'Predict the action of Pauli, Hadamard, phase, and rotation gates on simple states.',
  lessons: [
    {
      slug: 'introduction-to-quantum-gates',
      title: 'Introduction to Quantum Gates',
      summary: 'Treat gates as reversible transformations of quantum states.',
      introduction:
        'Quantum gates are controlled physical operations represented by unitary matrices. A circuit composes these operations from left to right.',
      coreExplanation: [
        'Unitary transformations preserve the total probability and are reversible: applying U† undoes U. This differs from ordinary measurement, which is not a reversible unitary gate.',
        'A gate can change basis-state populations, relative phase, or both. Its effect must be considered on the entire input state, not only on the labels printed inside a circuit box.',
      ],
      keyPoints: [
        'Unitary gates preserve normalization.',
        'Circuit order matters because matrix multiplication generally does not commute.',
        'Measurement is an operation, but not a reversible quantum gate.',
      ],
      formula: {
        expression: 'U†U = I',
        explanation:
          'A matrix is unitary when its conjugate transpose is also its inverse.',
      },
      visual: {
        title: 'Composing gate operations',
        description:
          'Each gate receives the state produced by the gate before it.',
        stages: [
          { label: 'Input', state: '|ψ₀⟩', explanation: 'Begin with a normalized state.' },
          { label: 'First gate', state: '|ψ₁⟩ = U₁|ψ₀⟩', explanation: 'Apply the rightmost matrix to the input vector.' },
          { label: 'Second gate', state: '|ψ₂⟩ = U₂U₁|ψ₀⟩', explanation: 'The second gate acts on the already transformed state.' },
        ],
      },
      interactive: {
        title: 'A gate and its inverse',
        description:
          'Pauli-X is self-inverse, so applying it twice restores every input state.',
        steps: [
          { label: 'Start', state: '|0⟩', explanation: 'Use a basis state so the changes are easy to see.' },
          { label: 'First X', state: '|1⟩', explanation: 'The first gate swaps the basis amplitudes.' },
          { label: 'Second X', state: '|0⟩', explanation: 'The second identical gate reverses the first.' },
        ],
      },
      builderExercise: {
        starterCircuitId: 'starter-not',
        task: 'Add a second X gate before measurement and verify that the two-gate sequence returns the output to 0.',
      },
      quiz: quiz(
        'gate-unitary',
        'true-false',
        'Every valid unitary quantum gate has an inverse.',
        ['True', 'False'],
        0,
        'A unitary matrix U satisfies U†U = I, so U† is its inverse.'
      ),
    },
    {
      slug: 'pauli-x-gate',
      title: 'Pauli X Gate',
      summary: 'Use the quantum bit-flip operation.',
      introduction:
        'Pauli-X swaps |0⟩ and |1⟩. On computational basis states it behaves like a classical NOT gate, while on general superpositions it swaps both amplitudes.',
      coreExplanation: [
        'For α|0⟩ + β|1⟩, applying X gives β|0⟩ + α|1⟩. The transformation is a π rotation around the Bloch sphere’s x-axis.',
        'X is self-inverse and Hermitian. Applying it twice is the identity, and measuring X|0⟩ in the computational basis always returns 1.',
      ],
      keyPoints: [
        'X swaps the |0⟩ and |1⟩ amplitudes.',
        'It is both reversible and self-inverse.',
        'Geometrically, X is a half-turn around the x-axis.',
      ],
      formula: {
        expression: 'X = [[0, 1], [1, 0]]',
        explanation:
          'Multiplying this matrix by [1,0]ᵀ produces [0,1]ᵀ, the vector for |1⟩.',
      },
      visual: {
        title: 'The X truth table',
        description:
          'Basis-state behavior is deterministic in both directions.',
        stages: [
          { label: 'Input 0', state: 'X|0⟩ = |1⟩', explanation: 'Zero flips to one.' },
          { label: 'Input 1', state: 'X|1⟩ = |0⟩', explanation: 'One flips to zero.' },
          { label: 'Apply twice', state: 'X² = I', explanation: 'Two flips cancel.' },
        ],
      },
      interactive: {
        title: 'Track the amplitude swap',
        description:
          'Follow X acting on a state whose probabilities are not equal.',
        steps: [
          { label: 'Before', state: '√3/2|0⟩ + 1/2|1⟩', explanation: 'The initial probabilities are 75% for 0 and 25% for 1.' },
          { label: 'Apply X', state: '1/2|0⟩ + √3/2|1⟩', explanation: 'The two coefficients exchange positions.' },
          { label: 'After', state: '0: 25% · 1: 75%', explanation: 'The measurement probabilities swap too.' },
        ],
      },
      builderExercise: {
        starterCircuitId: 'starter-not',
        task: 'Run the starter, then place a second X immediately before measurement to test X² = I.',
      },
      quiz: quiz(
        'pauli-x-output',
        'output-prediction',
        'What is the result of applying X to |1⟩?',
        ['|0⟩', '|1⟩', '|+⟩', 'An equal mixture'],
        0,
        'Pauli-X swaps the basis states, so X|1⟩ = |0⟩.'
      ),
    },
    {
      slug: 'pauli-y-gate',
      title: 'Pauli Y Gate',
      summary: 'Combine a bit flip with a phase change.',
      introduction:
        'Pauli-Y flips the computational basis value and also introduces a phase. That phase is invisible to immediate computational-basis measurement but matters in later interference.',
      coreExplanation: [
        'Y maps |0⟩ to i|1⟩ and |1⟩ to −i|0⟩. The factors ±i are global phases for those individual basis-state outputs, so X and Y have the same direct basis measurement results.',
        'On a superposition, the phase is relative between components and can change the outcome of later gates. Geometrically, Y is a π rotation around the y-axis.',
      ],
      keyPoints: [
        'Y changes both basis value and phase.',
        'Immediate basis measurements cannot distinguish X|0⟩ from Y|0⟩.',
        'Later interference can reveal the phase difference.',
      ],
      formula: {
        expression: 'Y = [[0, −i], [i, 0]]',
        explanation:
          'The imaginary entries distinguish Y from the real-valued X gate.',
      },
      visual: {
        title: 'Bit flip plus phase',
        description:
          'Separate the two ideas to understand the combined transformation.',
        stages: [
          { label: 'Input', state: '|0⟩', explanation: 'Start at the north pole of the Bloch sphere.' },
          { label: 'Y rotation', state: 'i|1⟩', explanation: 'The basis value flips and the amplitude gains phase i.' },
          { label: 'Measure Z', state: '1: 100%', explanation: 'Global phase does not change this measurement probability.' },
        ],
      },
      interactive: {
        title: 'Compare X and Y on |0⟩',
        description:
          'The state vectors differ even when the immediate histogram does not.',
        steps: [
          { label: 'X path', state: 'X|0⟩ = |1⟩', explanation: 'The output amplitude is real and positive.' },
          { label: 'Y path', state: 'Y|0⟩ = i|1⟩', explanation: 'The output has a global phase of i.' },
          { label: 'Readout', state: 'both → 1', explanation: 'Both paths give a certain 1 in the computational basis.' },
        ],
      },
      builderExercise: {
        starterCircuitId: 'starter-not',
        task: 'Replace X with Y and compare the measurement histogram. Then add gates that convert phase into a population difference.',
      },
      quiz: quiz(
        'pauli-y-phase',
        'multiple-choice',
        'Which statement best describes Y|0⟩?',
        ['It equals |0⟩', 'It equals i|1⟩', 'It creates an equal superposition', 'It performs measurement'],
        1,
        'Pauli-Y flips |0⟩ to |1⟩ and contributes the phase factor i.'
      ),
    },
    {
      slug: 'pauli-z-gate',
      title: 'Pauli Z Gate',
      summary: 'Change relative phase without flipping basis values.',
      introduction:
        'Pauli-Z leaves |0⟩ unchanged and multiplies |1⟩ by −1. It is called a phase-flip gate because it changes relative phase rather than computational basis populations.',
      coreExplanation: [
        'Applying Z to |+⟩ produces |−⟩. Those states both measure 0 and 1 equally in the computational basis, but a following Hadamard maps them to different deterministic outcomes.',
        'Z is a π rotation around the Bloch sphere’s z-axis. Like X and Y, it is self-inverse.',
      ],
      keyPoints: [
        'Z|0⟩ = |0⟩ and Z|1⟩ = −|1⟩.',
        'Z can change interference without immediately changing basis probabilities.',
        'The sequence HZH has the same action as X.',
      ],
      formula: {
        expression: 'Z = [[1, 0], [0, −1]]',
        explanation:
          'The diagonal entries preserve basis labels while reversing the sign of the |1⟩ amplitude.',
      },
      visual: {
        title: 'Making phase observable',
        description:
          'A second Hadamard converts a relative sign into a definite bit value.',
        stages: [
          { label: 'Prepare', state: 'H|0⟩ = |+⟩', explanation: 'Create equal positive amplitudes.' },
          { label: 'Phase flip', state: 'Z|+⟩ = |−⟩', explanation: 'Only the |1⟩ amplitude changes sign.' },
          { label: 'Interfere', state: 'H|−⟩ = |1⟩', explanation: 'Hadamard turns the phase difference into a population difference.' },
        ],
      },
      interactive: {
        title: 'Compare direct and indirect readout',
        description:
          'The same phase-flipped state looks different depending on the measurement basis.',
        steps: [
          { label: 'Direct Z readout', state: '|−⟩ → 0 or 1 equally', explanation: 'Computational-basis probabilities ignore the sign.' },
          { label: 'Change basis', state: 'H|−⟩ = |1⟩', explanation: 'H converts the X-basis state into a Z-basis state.' },
          { label: 'Measure', state: '1: 100%', explanation: 'The relative phase is now visible as a definite outcome.' },
        ],
      },
      builderExercise: {
        starterCircuitId: 'starter-superposition',
        task: 'Insert Z after the starter’s H, then add another H before measurement. The final result should be |1⟩.',
      },
      quiz: quiz(
        'pauli-z-basis',
        'true-false',
        'Applying Z to |0⟩ changes it into |1⟩.',
        ['True', 'False'],
        1,
        'Z leaves |0⟩ unchanged. It changes the sign of the |1⟩ amplitude.'
      ),
    },
    {
      slug: 'hadamard-gate',
      title: 'Hadamard Gate',
      summary: 'Move between computational and diagonal bases.',
      introduction:
        'The Hadamard gate is the standard tool for creating and recombining equal superpositions. Its second use is just as important as its first: H can make phase differences interfere.',
      coreExplanation: [
        'H maps |0⟩ to |+⟩ and |1⟩ to |−⟩. Because H is self-inverse, it also maps |+⟩ back to |0⟩ and |−⟩ back to |1⟩.',
        'Applying H independently to n zero-state qubits creates an equal superposition over all 2ⁿ computational basis strings.',
      ],
      keyPoints: [
        'H changes between the Z basis and X basis.',
        'H² = I, so two consecutive Hadamards cancel.',
        'Hadamard layers often prepare and later recombine algorithmic paths.',
      ],
      formula: {
        expression: 'H = (1/√2)[[1, 1], [1, −1]]',
        explanation:
          'The negative entry gives H the ability to turn relative phase into constructive or destructive interference.',
      },
      visual: {
        title: 'Hadamard in both directions',
        description:
          'The same gate creates a superposition and then recombines it.',
        stages: [
          { label: 'Basis state', state: '|0⟩', explanation: 'Begin with a definite computational value.' },
          { label: 'First H', state: '|+⟩', explanation: 'Create equal in-phase amplitudes.' },
          { label: 'Second H', state: '|0⟩', explanation: 'Constructive interference restores zero while the one path cancels.' },
        ],
      },
      interactive: {
        title: 'Interference with a sign',
        description:
          'Contrast what a final Hadamard does to |+⟩ and |−⟩.',
        steps: [
          { label: 'Positive phase', state: 'H|+⟩ = |0⟩', explanation: 'The amplitudes add in the zero output and cancel in one.' },
          { label: 'Negative phase', state: 'H|−⟩ = |1⟩', explanation: 'The sign reverses which output receives constructive interference.' },
          { label: 'Readout', state: 'phase → bit', explanation: 'Changing basis makes the relative phase measurable.' },
        ],
      },
      builderExercise: {
        starterCircuitId: 'starter-superposition',
        task: 'Add a second H before measurement and verify that the formerly random-looking output becomes deterministically 0.',
      },
      quiz: quiz(
        'hadamard-twice',
        'output-prediction',
        'Starting from |0⟩, what is the result after applying H twice?',
        ['|0⟩', '|1⟩', '|+⟩', '50% |0⟩ and 50% |1⟩'],
        0,
        'Hadamard is self-inverse, so H²|0⟩ = |0⟩.'
      ),
    },
    {
      slug: 'phase-gates',
      title: 'Phase Gates',
      summary: 'Apply controlled quarter- and eighth-turn phase shifts.',
      introduction:
        'The S and T gates rotate a qubit around the Bloch sphere’s z-axis without changing computational basis probabilities immediately.',
      coreExplanation: [
        'S applies phase i to |1⟩ and is equivalent to a π/2 z-axis phase rotation up to global phase. Applying S twice gives Z.',
        'T applies phase eⁱπ⁄⁴ to |1⟩. It is a smaller π/4 phase step, and T² = S. The T gate is especially important in fault-tolerant universal gate sets.',
      ],
      keyPoints: [
        'S|1⟩ = i|1⟩ and T|1⟩ = eⁱπ⁄⁴|1⟩.',
        'S² = Z and T² = S.',
        'Phase becomes visible after interference or in controlled operations.',
      ],
      formula: {
        expression: 'S = diag(1, i),  T = diag(1, eⁱπ⁄⁴)',
        explanation:
          'Both diagonal matrices preserve basis populations and change only the |1⟩ phase.',
      },
      visual: {
        title: 'Quarter turns around z',
        description:
          'Track the equatorial state |+⟩ as phase accumulates.',
        stages: [
          { label: 'Start', state: '|+⟩', explanation: 'The Bloch vector points along +x.' },
          { label: 'Apply S', state: '(|0⟩ + i|1⟩)/√2', explanation: 'A π/2 relative phase moves the vector toward +y.' },
          { label: 'Apply S again', state: '|−⟩', explanation: 'The accumulated π phase is equivalent to Z on |+⟩.' },
        ],
      },
      interactive: {
        title: 'Accumulate T-gate phase',
        description:
          'Four T gates produce the same relative phase as Z.',
        steps: [
          { label: 'One T', state: 'phase = π/4', explanation: 'The |1⟩ component advances by 45 degrees.' },
          { label: 'Two T', state: 'phase = π/2 = S', explanation: 'Two eighth turns equal one quarter turn.' },
          { label: 'Four T', state: 'phase = π = Z', explanation: 'Four T gates reproduce a phase flip.' },
        ],
      },
      builderExercise: {
        starterCircuitId: 'starter-phase-kickback',
        task: 'Inspect how H gates surround a controlled operation. Replace or add S and T gates to see how phase affects later interference.',
      },
      quiz: quiz(
        'phase-s-basis',
        'output-prediction',
        'If S is applied to |1⟩ and the qubit is measured immediately in the computational basis, what is observed?',
        ['0 with certainty', '1 with certainty', '0 and 1 equally', 'No valid outcome'],
        1,
        'S changes |1⟩ to i|1⟩. The phase does not change its computational-basis probability, so the result is still certainly 1.'
      ),
    },
    {
      slug: 'rotation-gates',
      title: 'Rotation Gates',
      summary: 'Control qubits with continuous angles.',
      introduction:
        'Rotation gates Rx(θ), Ry(θ), and Rz(θ) turn the Bloch vector by a chosen angle around one coordinate axis.',
      coreExplanation: [
        'Parameterized rotations let variational algorithms tune circuit behavior continuously. The half-angle in their formulas appears because a qubit state returns to the same physical direction after a 2π rotation, while its state vector gains a global sign.',
        'Ry is especially easy to interpret from |0⟩ because it creates real amplitudes: Ry(θ)|0⟩ = cos(θ/2)|0⟩ + sin(θ/2)|1⟩.',
      ],
      keyPoints: [
        'The axis chooses the kind of Bloch-sphere rotation.',
        'The angle continuously controls output amplitudes and phase.',
        'Common Pauli gates are π rotations up to global phase.',
      ],
      formula: {
        expression: 'Ry(θ)|0⟩ = cos(θ/2)|0⟩ + sin(θ/2)|1⟩',
        explanation:
          'The resulting measurement probabilities are cos²(θ/2) and sin²(θ/2).',
      },
      visual: {
        title: 'Tune probability with Ry',
        description:
          'Changing θ moves the state from north to south along one great circle.',
        stages: [
          { label: 'θ = 0', state: '|0⟩', explanation: 'No rotation leaves zero certain.' },
          { label: 'θ = π/2', state: '(|0⟩ + |1⟩)/√2', explanation: 'A quarter turn creates equal probabilities.' },
          { label: 'θ = π', state: '|1⟩', explanation: 'A half turn makes one certain.' },
        ],
      },
      interactive: {
        title: 'Predict the Ry histogram',
        description:
          'Use the half-angle rule at three useful settings.',
        steps: [
          { label: 'Small angle', state: 'θ = π/3', explanation: 'P(1) = sin²(π/6) = 25%.' },
          { label: 'Middle angle', state: 'θ = π/2', explanation: 'P(1) = sin²(π/4) = 50%.' },
          { label: 'Large angle', state: 'θ = 2π/3', explanation: 'P(1) = sin²(π/3) = 75%.' },
        ],
      },
      builderExercise: {
        starterCircuitId: 'starter-superposition',
        task: 'Replace H with Ry and test angles π/3, π/2, and 2π/3. Compare the observed frequencies with 25%, 50%, and 75% for outcome 1.',
      },
      quiz: quiz(
        'rotation-ry-pi',
        'output-prediction',
        'Ignoring global phase, what does Ry(π) do to |0⟩?',
        ['Leaves it at |0⟩', 'Maps it to |1⟩', 'Creates |+⟩', 'Measures it'],
        1,
        'cos(π/2)=0 and sin(π/2)=1, so Ry(π)|0⟩ = |1⟩.'
      ),
    },
  ],
})

const QUANTUM_CIRCUITS = makeCourse({
  id: 'course-circuits',
  slug: 'quantum-circuits',
  level: 3,
  title: 'Quantum Circuits',
  description:
    'Combine gates across multiple qubits to create correlation and entanglement.',
  outcome:
    'Read multi-qubit circuit diagrams and explain how CNOT creates Bell and GHZ states.',
  lessons: [
    {
      slug: 'quantum-circuit-basics',
      title: 'Quantum Circuit Basics',
      summary: 'Read wires, gates, time order, and measurements.',
      introduction:
        'A quantum circuit diagram is a timeline. Each horizontal wire represents one qubit, and operations are applied from left to right.',
      coreExplanation: [
        'Gates in the same column can act in parallel when they touch different qubits. Gates sharing a qubit must be ordered because one receives the state produced by the other.',
        'Measurement symbols write classical results. A circuit diagram describes repeated preparation and execution, so shot counts come from running the whole diagram many times.',
      ],
      keyPoints: [
        'Wires carry qubit state through time; they are not physical paths.',
        'Columns express operation order and possible parallelism.',
        'Measurements turn quantum information into classical bits.',
      ],
      formula: {
        expression: '|ψfinal⟩ = Uk … U₂U₁|ψinitial⟩',
        explanation:
          'Although diagrams read left to right, the first gate is the rightmost matrix acting on the initial vector.',
      },
      visual: {
        title: 'Read a circuit from left to right',
        description: 'Each stage has a distinct role in the experiment.',
        stages: [
          { label: 'Wires', state: 'q0, q1, …', explanation: 'Identify the qubits and their initial states.' },
          { label: 'Gate columns', state: 'U₁ → U₂', explanation: 'Track each operation in time order.' },
          { label: 'Measurements', state: 'q → c', explanation: 'Note which classical bit receives each result.' },
        ],
      },
      interactive: {
        title: 'Trace a one-wire circuit',
        description: 'Follow a gate sequence without skipping the intermediate state.',
        steps: [
          { label: 'Initialize', state: '|0⟩', explanation: 'The qubit starts in the default basis state.' },
          { label: 'Apply X', state: '|1⟩', explanation: 'X flips the computational value.' },
          { label: 'Measure', state: 'c0 = 1', explanation: 'The final basis state is copied into a classical result.' },
        ],
      },
      builderExercise: {
        starterCircuitId: 'starter-not',
        task: 'Move or add gates in different moments and read the circuit strictly from left to right before running it.',
      },
      quiz: quiz(
        'circuit-reading-order',
        'multiple-choice',
        'In a standard quantum circuit diagram, in which direction does time progress?',
        ['Right to left', 'Top to bottom', 'Left to right', 'It has no order'],
        2,
        'Circuit diagrams conventionally place earlier operations on the left and later operations on the right.'
      ),
    },
    {
      slug: 'multiple-qubits',
      title: 'Multiple Qubits',
      summary: 'Represent joint states with tensor products.',
      introduction:
        'Two qubits have four computational basis states: |00⟩, |01⟩, |10⟩, and |11⟩. In general, n qubits require 2ⁿ complex amplitudes.',
      coreExplanation: [
        'Independent states combine with the tensor product. For example, |+⟩⊗|0⟩ = (|00⟩+|10⟩)/√2 using the convention that q0 is the left bit.',
        'Not every multi-qubit state factors into separate qubit states. Non-factorable states are entangled and must be described as one joint system.',
      ],
      keyPoints: [
        'The joint state space doubles with every added qubit.',
        'Tensor products combine independent qubit states.',
        'A joint state can contain correlations that no product state can express.',
      ],
      formula: {
        expression: 'dim(H₂⊗n) = 2ⁿ',
        explanation:
          'An n-qubit pure state has one amplitude for every n-bit basis string.',
      },
      visual: {
        title: 'Growing the basis',
        description: 'Each added qubit doubles the number of basis strings.',
        stages: [
          { label: '1 qubit', state: '|0⟩, |1⟩', explanation: 'Two basis states require two amplitudes.' },
          { label: '2 qubits', state: '|00⟩ … |11⟩', explanation: 'Four basis states require four amplitudes.' },
          { label: '3 qubits', state: '|000⟩ … |111⟩', explanation: 'Eight basis states require eight amplitudes.' },
        ],
      },
      interactive: {
        title: 'Expand a product state',
        description: 'Distribute tensor products just like algebraic products.',
        steps: [
          { label: 'Inputs', state: '|+⟩ ⊗ |1⟩', explanation: 'The first qubit is equal superposition; the second is one.' },
          { label: 'Expand', state: '(|0⟩+|1⟩)⊗|1⟩ / √2', explanation: 'Apply the tensor product to each term.' },
          { label: 'Joint state', state: '(|01⟩+|11⟩)/√2', explanation: 'Only strings ending in one have nonzero amplitude.' },
        ],
      },
      builderExercise: {
        starterCircuitId: 'starter-ghz',
        task: 'Inspect the three wires and list all eight possible basis strings before running the GHZ circuit.',
      },
      quiz: quiz(
        'multiple-qubit-dimension',
        'output-prediction',
        'How many computational basis states does a three-qubit system have?',
        ['3', '6', '8', '16'],
        2,
        'Each qubit doubles the state-space dimension, so three qubits have 2³ = 8 basis states.'
      ),
    },
    {
      slug: 'cnot-gate',
      title: 'CNOT Gate',
      summary: 'Control a target flip with another qubit.',
      introduction:
        'CNOT has a control qubit and a target qubit. It flips the target exactly when the control is |1⟩.',
      coreExplanation: [
        'On basis states, CNOT maps |00⟩→|00⟩, |01⟩→|01⟩, |10⟩→|11⟩, and |11⟩→|10⟩.',
        'When the control is in superposition, CNOT acts linearly on every branch. This can create entanglement; it does not clone an arbitrary unknown qubit.',
      ],
      keyPoints: [
        'The control is unchanged while the target may flip.',
        'CNOT is reversible and is its own inverse.',
        'H followed by CNOT is the standard Bell-state preparation.',
      ],
      formula: {
        expression: 'CNOT|c,t⟩ = |c, t ⊕ c⟩',
        explanation:
          'The target becomes the XOR of its old value and the control value.',
      },
      visual: {
        title: 'CNOT basis-state behavior',
        description: 'Split the truth table by the value of the control.',
        stages: [
          { label: 'Control 0', state: '|00⟩→|00⟩ · |01⟩→|01⟩', explanation: 'A zero control leaves the target alone.' },
          { label: 'Control 1', state: '|10⟩→|11⟩ · |11⟩→|10⟩', explanation: 'A one control flips the target.' },
          { label: 'Apply twice', state: 'CNOT² = I', explanation: 'Two conditional flips cancel.' },
        ],
      },
      interactive: {
        title: 'Act on a superposed control',
        description: 'Linearity applies CNOT to both basis components.',
        steps: [
          { label: 'Input', state: '(|00⟩+|10⟩)/√2', explanation: 'The control is superposed while the target is zero.' },
          { label: 'Branch action', state: '|00⟩→|00⟩ · |10⟩→|11⟩', explanation: 'Only the branch with control one flips.' },
          { label: 'Output', state: '(|00⟩+|11⟩)/√2', explanation: 'The resulting state has perfectly correlated qubits.' },
        ],
      },
      builderExercise: {
        starterCircuitId: 'starter-bell-state',
        task: 'Remove H and run CNOT alone, then restore H. Compare classical conditional behavior with entanglement creation.',
      },
      quiz: quiz(
        'cnot-output',
        'output-prediction',
        'What is CNOT|10⟩ when the first qubit is the control?',
        ['|00⟩', '|01⟩', '|10⟩', '|11⟩'],
        3,
        'The control is 1, so CNOT flips the target from 0 to 1 while leaving the control unchanged.'
      ),
    },
    {
      slug: 'entanglement',
      title: 'Entanglement',
      summary: 'Recognize correlations that cannot be separated.',
      introduction:
        'Entangled qubits share a joint state that cannot be written as a product of individual qubit states. Their measurement statistics contain correlations stronger than any product state can provide.',
      coreExplanation: [
        'In the Bell state (|00⟩+|11⟩)/√2, each qubit alone looks perfectly random, yet measuring both in the same computational basis always gives matching values.',
        'Entanglement does not permit faster-than-light communication. A local result is random, and the correlation becomes evident only when classical records are compared.',
      ],
      keyPoints: [
        'Entanglement is a property of the joint state, not a hidden signal.',
        'Local outcomes can be random while joint outcomes are strongly correlated.',
        'Bell states are the simplest maximally entangled two-qubit states.',
      ],
      formula: {
        expression: '|Φ⁺⟩ = (|00⟩ + |11⟩)/√2 ≠ |a⟩⊗|b⟩',
        explanation:
          'No pair of single-qubit pure states multiplies to exactly this two-term correlated state.',
      },
      visual: {
        title: 'Random alone, correlated together',
        description: 'Compare marginal and joint measurement information.',
        stages: [
          { label: 'Qubit 0 alone', state: '0: 50% · 1: 50%', explanation: 'The first local result is unpredictable.' },
          { label: 'Qubit 1 alone', state: '0: 50% · 1: 50%', explanation: 'The second local result is also unpredictable.' },
          { label: 'Together', state: '00: 50% · 11: 50%', explanation: 'The results always agree when measured in this basis.' },
        ],
      },
      interactive: {
        title: 'Create correlation step by step',
        description: 'Separate superposition from the controlled correlation.',
        steps: [
          { label: 'Initial', state: '|00⟩', explanation: 'Both qubits begin with definite zero.' },
          { label: 'After H₀', state: '(|00⟩+|10⟩)/√2', explanation: 'Only the first qubit is in superposition; the state still factors.' },
          { label: 'After CNOT', state: '(|00⟩+|11⟩)/√2', explanation: 'The target is now correlated with both control branches.' },
        ],
      },
      builderExercise: {
        starterCircuitId: 'starter-bell-state',
        task: 'Run the Bell circuit and confirm that 01 and 10 are absent even though each individual qubit is evenly distributed.',
      },
      quiz: quiz(
        'entanglement-product',
        'true-false',
        'Every two-qubit pure state can be written as a product of two single-qubit states.',
        ['True', 'False'],
        1,
        'Entangled states, including Bell states, cannot be factored into independent single-qubit states.'
      ),
    },
    {
      slug: 'bell-states',
      title: 'Bell States',
      summary: 'Prepare and distinguish maximally entangled pairs.',
      introduction:
        'The four Bell states form an orthonormal basis for two qubits. Each contains equal-amplitude correlations or anticorrelations with a particular relative sign.',
      coreExplanation: [
        'Starting from |00⟩, H on q0 followed by CNOT(q0→q1) prepares |Φ⁺⟩. Local X and Z operations transform it into the other three Bell states.',
        'Bell states support teleportation, superdense coding, and tests of nonclassical correlations. Direct computational-basis measurement reveals correlation but not the ± relative phase.',
      ],
      keyPoints: [
        'There are four orthogonal Bell states.',
        'H plus CNOT prepares |Φ⁺⟩ from |00⟩.',
        'A Bell-basis decoding circuit uses CNOT then H before measurement.',
      ],
      formula: {
        expression: '|Φ±⟩=(|00⟩±|11⟩)/√2,  |Ψ±⟩=(|01⟩±|10⟩)/√2',
        explanation:
          'Correlation pattern and relative sign distinguish the four states.',
      },
      visual: {
        title: 'Prepare |Φ⁺⟩',
        description: 'Two gates turn a product state into an entangled pair.',
        stages: [
          { label: 'Initialize', state: '|00⟩', explanation: 'Start with both qubits in zero.' },
          { label: 'Superpose control', state: '(|00⟩+|10⟩)/√2', explanation: 'H creates two control branches.' },
          { label: 'Correlate target', state: '(|00⟩+|11⟩)/√2', explanation: 'CNOT links the target value to the control.' },
        ],
      },
      interactive: {
        title: 'Move around the Bell basis',
        description: 'Local Paulis change correlation or relative sign.',
        steps: [
          { label: 'Start', state: '|Φ⁺⟩', explanation: 'Outcomes 00 and 11 have positive relative sign.' },
          { label: 'Apply Z₀', state: '|Φ⁻⟩', explanation: 'Z changes the relative sign without changing direct Z-basis counts.' },
          { label: 'Apply X₁', state: '|Ψ⁻⟩', explanation: 'X switches from correlated to anticorrelated basis strings.' },
        ],
      },
      builderExercise: {
        starterCircuitId: 'starter-bell-state',
        task: 'Add X to one qubit after entanglement and verify that the populated outcomes change from 00/11 to 01/10.',
      },
      quiz: quiz(
        'bell-state-outcomes',
        'multiple-choice',
        'Which outcomes appear when |Φ⁺⟩ is measured in the computational basis?',
        ['Only 00 and 11', 'Only 01 and 10', 'All four equally', 'Only 00'],
        0,
        '|Φ⁺⟩ has nonzero amplitudes only for |00⟩ and |11⟩, each with probability 1/2.'
      ),
    },
  ],
})

const QUANTUM_ALGORITHMS = makeCourse({
  id: 'course-algorithms',
  slug: 'quantum-algorithms',
  level: 4,
  title: 'Quantum Algorithms',
  description:
    'See how superposition, phase, and interference combine into useful procedures.',
  outcome:
    'Explain the central mechanism and limits of Deutsch–Jozsa, Grover search, and the QFT.',
  lessons: [
    {
      slug: 'deutsch-jozsa-algorithm',
      title: 'Deutsch-Jozsa Algorithm',
      summary: 'Distinguish promised constant and balanced functions.',
      introduction:
        'Deutsch–Jozsa solves a promise problem: a Boolean function is guaranteed to be constant or balanced, and the task is to decide which.',
      coreExplanation: [
        'Hadamards query the oracle on a superposition of every input. Phase kickback records f(x) as a sign, and a final Hadamard layer makes those signs interfere.',
        'If the function is constant, measuring the input register gives all zeros with certainty. Any nonzero result proves it is balanced. The quantum algorithm uses one oracle query.',
      ],
      keyPoints: [
        'The speedup depends on the constant-or-balanced promise.',
        'The oracle writes function information into relative phase.',
        'Final interference converts a global pattern into a measurable result.',
      ],
      formula: {
        expression: 'amplitude(0ⁿ) = (1/2ⁿ) Σx (−1)ᶠ⁽ˣ⁾',
        explanation:
          'The sum has magnitude one for a constant function and cancels to zero for a balanced function.',
      },
      visual: {
        title: 'The Deutsch–Jozsa pipeline',
        description: 'Each layer has a specific information-processing role.',
        stages: [
          { label: 'Superpose', state: 'H⊗n|0ⁿ⟩', explanation: 'Create equal amplitude for every input x.' },
          { label: 'Oracle', state: '(−1)ᶠ⁽ˣ⁾', explanation: 'Encode each function value as phase.' },
          { label: 'Interfere', state: 'H⊗n', explanation: 'Combine the signed paths.' },
          { label: 'Decide', state: '0ⁿ or nonzero', explanation: 'All zeros means constant; otherwise balanced.' },
        ],
      },
      interactive: {
        title: 'Watch signed paths add or cancel',
        description: 'Compare the phase patterns for the two promised cases.',
        steps: [
          { label: 'Constant', state: '+ + + +', explanation: 'All paths have the same sign and reinforce at 0ⁿ.' },
          { label: 'Balanced', state: '+ + − −', explanation: 'Equal positive and negative contributions cancel at 0ⁿ.' },
          { label: 'Measurement', state: '0ⁿ ↔ constant', explanation: 'The final basis result distinguishes the cases exactly.' },
        ],
      },
      builderExercise: {
        starterCircuitId: 'starter-phase-kickback',
        task: 'Trace how the prepared |−⟩ target turns a controlled bit flip into phase on the control register.',
      },
      quiz: quiz(
        'deutsch-jozsa-result',
        'output-prediction',
        'What does measuring 0ⁿ in Deutsch–Jozsa indicate under the promise?',
        ['The function is balanced', 'The function is constant', 'The oracle failed', 'The answer is random'],
        1,
        'For a constant function, all signed contributions reinforce at 0ⁿ; for a balanced function they cancel there.'
      ),
    },
    {
      slug: 'grovers-algorithm',
      title: "Grover's Algorithm",
      summary: 'Amplify a marked item in an unstructured search.',
      introduction:
        'Grover search finds a marked item among N unstructured possibilities using on the order of √N oracle calls.',
      coreExplanation: [
        'An oracle flips the phase of marked basis states. The diffusion operator reflects amplitudes about their average, turning the marked state’s negative phase into larger magnitude.',
        'Repeating too many iterations rotates past the target and lowers success probability. For one marked item, about π√N/4 iterations is near optimal, followed by measurement.',
      ],
      keyPoints: [
        'Grover provides a quadratic, not exponential, query speedup.',
        'The oracle marks solutions with phase rather than measuring them.',
        'Amplitude amplification must stop near its optimal iteration count.',
      ],
      formula: {
        expression: 'iterations ≈ ⌊π√N / 4⌋',
        explanation:
          'This estimate applies to one marked item in a search space of size N.',
      },
      visual: {
        title: 'One amplitude-amplification round',
        description: 'Phase marking and reflection work together.',
        stages: [
          { label: 'Uniform state', state: 'all amplitudes equal', explanation: 'Hadamards spread amplitude across N candidates.' },
          { label: 'Oracle', state: 'marked amplitude changes sign', explanation: 'The solution is tagged coherently, not observed.' },
          { label: 'Diffusion', state: 'reflect about average', explanation: 'The marked magnitude grows while others shrink.' },
          { label: 'Repeat', state: 'solution becomes likely', explanation: 'A small number of rounds concentrates probability.' },
        ],
      },
      interactive: {
        title: 'Search four candidates',
        description: 'For N = 4 with one marked item, one Grover round is enough ideally.',
        steps: [
          { label: 'Prepare', state: '¼ probability each', explanation: 'Two Hadamards create equal amplitudes for 00, 01, 10, and 11.' },
          { label: 'Mark 10', state: 'phase(10) → negative', explanation: 'The oracle changes no immediate measurement probability.' },
          { label: 'Diffuse', state: 'P(10) → 100%', explanation: 'Reflection redirects amplitude toward the marked state.' },
        ],
      },
      builderExercise: {
        starterCircuitId: 'starter-superposition',
        task: 'Use the Hadamard starter as the preparation layer and identify what an oracle and diffusion layer would need to add.',
      },
      quiz: quiz(
        'grover-speedup',
        'true-false',
        'Grover search reduces an unstructured search from O(N) oracle calls to O(log N).',
        ['True', 'False'],
        1,
        'Grover uses O(√N) oracle calls. That is a quadratic improvement, not a logarithmic or exponential one.'
      ),
    },
    {
      slug: 'quantum-fourier-transform',
      title: 'Quantum Fourier Transform',
      summary: 'Convert computational patterns into quantum phase patterns.',
      introduction:
        'The Quantum Fourier Transform, or QFT, is the discrete Fourier transform applied to a quantum state’s amplitudes.',
      coreExplanation: [
        'The QFT maps basis information into carefully structured relative phases using Hadamard and controlled-rotation gates. Its inverse converts those phases back into readable computational patterns.',
        'QFT is efficient as a circuit, using O(n²) standard gates for n qubits in its usual exact form. It is a core subroutine in phase estimation and Shor’s factoring algorithm.',
      ],
      keyPoints: [
        'QFT transforms amplitudes; it does not directly print a classical Fourier spectrum.',
        'Controlled phase rotations encode progressively finer binary fractions.',
        'Inverse QFT makes phase information measurable.',
      ],
      formula: {
        expression: 'QFT|x⟩ = (1/√N) Σₖ e²πⁱˣᵏ⁄ᴺ |k⟩',
        explanation:
          'For N = 2ⁿ, every output basis state has equal magnitude and an x-dependent phase.',
      },
      visual: {
        title: 'Inside an n-qubit QFT',
        description: 'The circuit builds a hierarchy of phase precision.',
        stages: [
          { label: 'Hadamard', state: 'coarse phase split', explanation: 'Create two phase-sensitive paths for one qubit.' },
          { label: 'Controlled rotations', state: 'R₂, R₃, …', explanation: 'Add smaller phase corrections from other bits.' },
          { label: 'Repeat', state: 'next qubit', explanation: 'Build phase-encoded outputs across the register.' },
          { label: 'Swap order', state: 'bit reversal', explanation: 'Reverse wire order to match the conventional Fourier index.' },
        ],
      },
      interactive: {
        title: 'QFT of the zero basis state',
        description: 'This special input makes the magnitude pattern easy to see.',
        steps: [
          { label: 'Input', state: '|0…0⟩', explanation: 'The integer x is zero, so every exponential phase is one.' },
          { label: 'Transform', state: '(1/√N)Σₖ|k⟩', explanation: 'All N output amplitudes are equal and in phase.' },
          { label: 'Measure', state: 'each k with probability 1/N', explanation: 'Direct measurement sees a uniform distribution; the phase structure matters for other inputs.' },
        ],
      },
      builderExercise: {
        starterCircuitId: 'starter-phase-kickback',
        task: 'Use the phase-kickback circuit to review how controlled operations encode phase before an inverse transform makes it observable.',
      },
      quiz: quiz(
        'qft-zero',
        'output-prediction',
        'What measurement distribution follows QFT|0…0⟩ in the computational basis?',
        ['Only 0…0', 'Uniform over all basis states', 'Only 1…1', 'No measurable state'],
        1,
        'When x = 0, every Fourier phase factor equals one, so all N basis states have equal amplitude 1/√N and probability 1/N.'
      ),
    },
  ],
})

export const COURSES: Course[] = [
  QUANTUM_FUNDAMENTALS,
  QUANTUM_GATES,
  QUANTUM_CIRCUITS,
  QUANTUM_ALGORITHMS,
]

export const ALL_LESSONS: Lesson[] = COURSES.flatMap(course => course.lessons)

export const ALL_LESSON_IDS = new Set(ALL_LESSONS.map(lesson => lesson.id))

export function getCourseBySlug(courseSlug: string): Course | undefined {
  return COURSES.find(course => course.slug === courseSlug)
}

export function getLessonBySlug(
  courseSlug: string,
  lessonSlug: string
): { course: Course; lesson: Lesson } | undefined {
  const course = getCourseBySlug(courseSlug)
  const lesson = course?.lessons.find(item => item.slug === lessonSlug)
  return course && lesson ? { course, lesson } : undefined
}

export function getLessonById(
  lessonId: string | null
): { course: Course; lesson: Lesson } | undefined {
  if (!lessonId) return undefined

  for (const course of COURSES) {
    const lesson = course.lessons.find(item => item.id === lessonId)
    if (lesson) return { course, lesson }
  }

  return undefined
}

export function getAdjacentLessons(
  lessonId: string
): { previous: { course: Course; lesson: Lesson } | null; next: { course: Course; lesson: Lesson } | null } {
  const index = ALL_LESSONS.findIndex(lesson => lesson.id === lessonId)
  const previousLesson = index > 0 ? ALL_LESSONS[index - 1] : undefined
  const nextLesson =
    index >= 0 && index < ALL_LESSONS.length - 1
      ? ALL_LESSONS[index + 1]
      : undefined

  return {
    previous: previousLesson ? getLessonById(previousLesson.id) ?? null : null,
    next: nextLesson ? getLessonById(nextLesson.id) ?? null : null,
  }
}
