import { ClassLevel, SubjectName } from './types';

export interface ChapterDetails {
  id: string;
  title: string;
  difficultyStars: number; // 1 to 5
  readTimeMins: number;
  shortNotes: string[];
  formulas: string[];
  keyConcepts: { title: string; description: string }[];
  diagrams: { title: string; description: string; imageUrl?: string }[];
  learningObjectives: string[];
  nodes3D: string[]; // These nodes will load into the 3D view
  quiz: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  }[];
}

const SPECIFIC_CHAPTERS: Record<string, ChapterDetails> = {
  // Class 10 -> Chemistry -> Chapter 1: Chemical Reactions and Equations
  'c10_chem_1': {
    id: 'c10_chem_1',
    title: 'Chemical Reactions and Equations',
    difficultyStars: 4,
    readTimeMins: 10,
    shortNotes: [
      'A chemical reaction involves breaking old chemical bonds and forming new ones to produce entirely new substances.',
      'Reactants are the starting materials written on the left-side of an equation. Products are the resulting substances on the right-side.',
      'Observations that confirm a chemical reaction: change in state, change in color, evolution of a gas, change in temperature, or formation of a precipitate.',
      'Law of Conservation of Mass: Mass can neither be created nor destroyed in a chemical reaction. Hence, total atoms on both sides must be equal.',
      'Exothermic reactions release heat (e.g., respiration, burning of natural gas). Endothermic reactions absorb heat (e.g., photosynthesis, decomposition of water).'
    ],
    formulas: [
      'Law of Conservation of Mass: Total Mass of Reactants = Total Mass of Products',
      'Exothermic Combination: CaO (s) + H2O (l) → Ca(OH)2 (aq) + Heat (Quicklime to Slaked Lime)',
      'Photolytic Decomposition: 2AgCl (s) --[Sunlight]--> 2Ag (s) + Cl2 (g) (Used in black & white photography)',
      'Iron nail in CuSO4 solution: Fe (s) + CuSO4 (aq, blue) → FeSO4 (aq, green) + Cu (s) (Displacement)',
      'Double Displacement: Na2SO4 (aq) + BaCl2 (aq) → BaSO4 (s, white ppt)↓ + 2NaCl (aq)',
      'Respiration Reaction: C6H12O6 (aq) + 6O2 (g) → 6CO2 (g) + 6H2O (l) + Energy'
    ],
    keyConcepts: [
      { title: 'Reaction Fundamentals', description: 'Understanding how atoms rearrange. Chemical change involves transformation with new physical and chemical properties.' },
      { title: 'Reaction Types', description: 'Classification based on how chemical elements behave: Combination, Decomposition, Displacement, Double Displacement, and Redox.' },
      { title: 'Combination Reaction', description: 'Two or more elements or compounds combine to form a single compound. For example, burning of magnesium ribbon in air: 2Mg + O2 → 2MgO.' },
      { title: 'Decomposition Reaction', description: 'A single compound breaks down into two or more simpler substances. Requires external energy. Can be Thermal (using heat), Electrolytic (using electricity), or Photolytic (using sunlight).' },
      { title: 'Displacement Reaction', description: 'A highly reactive metal displaces a less reactive metal from its aqueous salt solution. E.g., Zinc displaces copper: Zn + CuSO4 → ZnSO4 + Cu.' },
      { title: 'Double Displacement', description: 'An exchange of ions between reactants takes place, often resulting in the formation of an insoluble precipitate. BaCl2 + Na2SO4 → BaSO4↓ + 2NaCl.' },
      { title: 'Redox Reactions', description: 'Simultaneous Oxidation (gain of oxygen or loss of hydrogen) and Reduction (loss of oxygen or gain of hydrogen) in a reaction.' }
    ],
    diagrams: [
      { title: 'Electrolysis of Water Setup', description: 'A plastic mug fitted with carbon electrodes, filled with water and a few drops of dilute sulphuric acid, connected to a 6V battery. Double volume of hydrogen gas accumulates at the cathode compared to oxygen at the anode.' },
      { title: 'Thermal Decomposition of Lead Nitrate', description: 'Heating lead nitrate powder in a dry boiling tube over a burner. Emits brown, suffocating nitrogen dioxide (NO2) fumes, leaving a yellow lead oxide residue.' },
      { title: 'Displacement of Copper from CuSO4', description: 'An iron nail suspended in blue copper sulphate solution. After 20 minutes, the solution fades to light green due to FeSO4 formation, and the nail is coated with red-brown copper.' }
    ],
    learningObjectives: [
      'Understand and define a chemical reaction with daily life examples.',
      'Balance skeletal equations using the hit-and-trial method systematically.',
      'Differentiate between exothermic, endothermic, combination, and decomposition processes.',
      'Demonstrate displacement and double displacement using precipitate formation.',
      'Explain oxidation, reduction, and their real-world impact such as Corrosion and Rancidity.'
    ],
    nodes3D: ['Chemical Reaction', 'Reaction Types', 'Combination Reaction', 'Decomposition Reaction', 'Displacement Reaction', 'Double Displacement', 'Redox Process'],
    quiz: [
      {
        question: "Which of the following is a physical change rather than a chemical change?",
        options: ["Burning of Liquefied Petroleum Gas (LPG)", "Rusting of an iron gate", "Boiling of water to give steam", "Digestion of food in our stomach"],
        answerIndex: 2,
        explanation: "Boiling of water to steam is a physical change because water molecules retain their chemical formula (H2O), and the process is easily reversible. Others form new chemical substances."
      },
      {
        question: "When quicklime (CaO) reacts vigorously with water, what is the nature of the reaction?",
        options: ["Endothermic & Displacement", "Exothermic & Combination", "Endothermic & Decomposition", "Exothermic & Double Displacement"],
        answerIndex: 1,
        explanation: "Quicklime (CaO) reacts with water to form Slaked Lime (Ca(OH)2) in a highly Exothermic Combination reaction that releases a large amount of heat energy."
      },
      {
        question: "What are the brown fumes observed when lead nitrate is heated in a boiling tube?",
        options: ["Lead oxide fumes", "Nitrogen dioxide (NO2) gas", "Oxygen gas", "Nitric acid vapor"],
        answerIndex: 1,
        explanation: "Thermal decomposition of lead nitrate yields lead oxide (yellow residue), oxygen gas, and nitrogen dioxide (NO2) gas, which appears as toxic brown fumes."
      },
      {
        question: "Fe(s) + CuSO4(aq) → FeSO4(aq) + Cu(s) is an example of which type of reaction?",
        options: ["Combination reaction", "Decomposition reaction", "Displacement reaction", "Double displacement reaction"],
        answerIndex: 2,
        explanation: "Iron is more reactive than copper in the reactivity series. It displaces copper from its copper sulphate salt solution, changing the color from blue to green."
      },
      {
        question: "What is the chemical formula of rust?",
        options: ["Fe2O3", "Fe3O4", "Fe2O3 · xH2O", "Fe(OH)3"],
        answerIndex: 2,
        explanation: "Rust is hydrated ferric oxide, with the chemical formula Fe2O3 · xH2O, formed when iron reacts with oxygen and water vapor in the atmosphere."
      },
      {
        question: "Which gas is used to prevent the oxidation of chips and fatty foods in packets?",
        options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
        answerIndex: 2,
        explanation: "Nitrogen is an inert gas that flushes oxygen out of packaging, stopping the oxidative rancidity of fats and oils to keep food fresh."
      },
      {
        question: "In the reaction CuO + H2 → Cu + H2O, which substance is oxidized?",
        options: ["CuO", "H2", "Cu", "H2O"],
        answerIndex: 1,
        explanation: "Hydrogen gas (H2) gains oxygen to become water (H2O). Therefore, H2 is oxidized, while copper oxide (CuO) loses oxygen and is reduced to Cu."
      },
      {
        question: "What happens when dilute hydrochloric acid is added to iron filings?",
        options: ["Hydrogen gas and iron chloride are produced", "Chlorine gas and iron hydroxide are produced", "No reaction takes place", "Iron salt and water are produced"],
        answerIndex: 0,
        explanation: "Iron reacts with dilute HCl to produce Iron (II) chloride (FeCl2) and release hydrogen gas: Fe + 2HCl → FeCl2 + H2↑."
      },
      {
        question: "In the double displacement reaction of BaCl2 + Na2SO4, what is the color of the precipitate formed?",
        options: ["Yellow", "Red", "Blue", "White"],
        answerIndex: 3,
        explanation: "The reaction produces white insoluble barium sulphate (BaSO4) precipitate along with sodium chloride in solution."
      },
      {
        question: "What type of reaction is the decomposition of silver chloride by sunlight?",
        options: ["Thermal decomposition", "Photolytic decomposition", "Electrolytic decomposition", "Displacement reaction"],
        answerIndex: 1,
        explanation: "Decomposition driven by light energy is called photolysis or photolytic decomposition. 2AgCl + Sunlight → 2Ag + Cl2."
      }
    ]
  },

  // Class 10 -> Chemistry -> Chapter 2: Acids, Bases and Salts
  'c10_chem_2': {
    id: 'c10_chem_2',
    title: 'Acids, Bases and Salts',
    difficultyStars: 4,
    readTimeMins: 12,
    shortNotes: [
      'Acids are sour in taste, turn blue litmus red, and release hydrogen ions H+ (or hydronium H3O+) in aqueous solutions.',
      'Bases are bitter in taste, soapy to touch, turn red litmus blue, and release hydroxide ions OH- in water.',
      'pH scale measures hydrogen ion concentration, ranging from 0 (highly acidic) to 14 (highly alkaline), with 7 being neutral.',
      'Neutralization: Acid + Base → Salt + Water + Heat. (E.g., HCl + NaOH → NaCl + H2O).',
      'Important daily salts: Sodium hydroxide (Caustic soda), Bleaching powder, Baking soda, Washing soda, and Plaster of Paris (POP).'
    ],
    formulas: [
      'Neutralization: HX (Acid) + MOH (Base) → MX (Salt) + H2O (Water)',
      'pH formula: pH = -log[H+]',
      'Bleaching Powder formation: Ca(OH)2 + Cl2 → CaOCl2 + H2O',
      'Baking Soda: NaCl + H2O + CO2 + NH3 → NH4Cl + NaHCO3',
      'Washing Soda: Na2CO3 + 10H2O → Na2CO3 · 10H2O',
      'Plaster of Paris (POP): CaSO4 · 1/2 H2O (Gypsum is CaSO4 · 2H2O)'
    ],
    keyConcepts: [
      { title: 'Indicators', description: 'Substances like litmus, phenolphthalein, methyl orange, and olfactory indicators (onion, vanilla) that detect the presence of acid or base via color/odor changes.' },
      { title: 'pH Scale', description: 'Sorenson scale measuring H+ strength. Human blood pH is ~7.4. Acid rain is <5.6. Tooth decay starts at pH <5.5.' },
      { title: 'Chlor-Alkali Process', description: 'Electrolysis of brine (aq. NaCl) producing Chlorine gas (at anode), Hydrogen gas (at cathode), and Sodium Hydroxide (NaOH) near cathode.' },
      { title: 'Water of Crystallization', description: 'Fixed number of water molecules chemically combined in each formula unit of a salt (e.g., CuSO4 · 5H2O is blue; heating removes water and turns it white).' }
    ],
    diagrams: [
      { title: 'Acid Solution Conducts Electricity', description: 'An experimental beaker with a cork containing iron nails, connected to a 6V battery and bulb. Dilute HCl solution conducts electricity because of mobile H+ ions, glowing the bulb. Glucose and alcohol do not conduct.' },
      { title: 'Preparation of SO2 or HCl Gas', description: 'Reacting common salt with conc. H2SO4 in a test tube. Testing dry HCl gas with dry/wet blue litmus paper shows that acidic properties manifest only in the presence of water.' }
    ],
    learningObjectives: [
      'Define acids, bases, and salts using Arrhenius definitions.',
      'Verify reaction profiles of acids with metals, metal carbonates, and hydrogen carbonates.',
      'Determine pH values of various everyday substances and explain the importance of pH in digestion and soil.',
      'Recall chemical names, formulas, and uses of key commercial salts (Bleaching powder, POP, etc.).'
    ],
    nodes3D: ['Acid Ions H+', 'Base Ions OH-', 'pH Indicators', 'Neutralization', 'Chlor-Alkali Cell', 'Salt Crystals'],
    quiz: [
      {
        question: "What is the pH of a neutral solution at 25°C?",
        options: ["0", "7", "14", "5"],
        answerIndex: 1,
        explanation: "A neutral solution has an equal concentration of H+ and OH- ions, resulting in a pH of exactly 7."
      },
      {
        question: "Which acid is present in tomato?",
        options: ["Methanoic acid", "Citric acid", "Oxalic acid", "Tartaric acid"],
        answerIndex: 2,
        explanation: "Tomatoes contain oxalic acid, whereas methanoic acid is in ant stings, citric acid in citrus fruits, and tartaric acid in tamarind."
      },
      {
        question: "What happens when metal carbonates react with acids?",
        options: ["Only Salt is formed", "Salt, Water and Carbon Dioxide are formed", "Salt and Hydrogen gas are formed", "Only Carbon dioxide is released"],
        answerIndex: 1,
        explanation: "Metal carbonates or hydrogen carbonates react with acids to yield a salt, water, and liberate carbon dioxide gas (which turns lime water milky)."
      },
      {
        question: "Which of the following is used for softening hard water?",
        options: ["Baking Soda", "Washing Soda", "Bleaching Powder", "Plaster of Paris"],
        answerIndex: 1,
        explanation: "Washing soda (Sodium carbonate decahydrate, Na2CO3 · 10H2O) is highly utilized in removing permanent hardness of water."
      },
      {
        question: "Plaster of Paris hardens on mixing with water due to the formation of:",
        options: ["Calcium sulphate hemihydrate", "Gypsum", "Calcium carbonate", "Lime"],
        answerIndex: 1,
        explanation: "Plaster of Paris (CaSO4 · 0.5H2O) reacts with water to form a hard, solid mass of Gypsum (CaSO4 · 2H2O)."
      },
      {
        question: "What turns phenolphthalein indicator pink?",
        options: ["Acidic solution", "Basic solution", "Neutral solution", "Salt solution"],
        answerIndex: 1,
        explanation: "Phenolphthalein remains colorless in acidic or neutral solutions, but turns a vivid dark pink in alkaline (basic) solutions."
      },
      {
        question: "An aqueous solution turns red litmus blue. Its pH is likely to be:",
        options: ["1", "4", "5", "10"],
        answerIndex: 3,
        explanation: "Litmus turning red-to-blue indicates a basic solution. Basic solutions have pH values greater than 7, so 10 is the only plausible answer."
      },
      {
        question: "What gas is liberated at the anode during the electrolysis of brine?",
        options: ["Hydrogen", "Chlorine", "Oxygen", "Nitrogen"],
        answerIndex: 1,
        explanation: "In the Chlor-Alkali process, chlorine gas is evolved at the positive anode, hydrogen gas at the negative cathode, and sodium hydroxide is formed near the cathode."
      },
      {
        question: "Sodium hydrogen carbonate is the chemical name of:",
        options: ["Baking Soda", "Washing Soda", "Bleaching Powder", "Baking Powder"],
        answerIndex: 0,
        explanation: "NaHCO3 is Sodium Hydrogen Carbonate, popularly known as baking soda."
      },
      {
        question: "Which salt has blue crystals containing 5 water molecules of crystallization?",
        options: ["Ferrous sulphate", "Copper sulphate", "Sodium carbonate", "Calcium sulphate"],
        answerIndex: 1,
        explanation: "Copper sulphate crystals (CuSO4 · 5H2O) are blue. Heating them vaporizes the water, rendering the crystal white (anhydrous)."
      }
    ]
  },

  // Class 10 -> Biology -> Chapter 1: Life Processes
  'c10_bio_1': {
    id: 'c10_bio_1',
    title: 'Life Processes',
    difficultyStars: 5,
    readTimeMins: 15,
    shortNotes: [
      'Life processes are basic vital maintenance functions performed by living organisms to sustain life (Nutrition, Respiration, Transportation, and Excretion).',
      'Nutrition: Autotrophic organisms synthesize food via Photosynthesis. Heterotrophs ingest readymade organic compounds (holozoic, saprophytic, or parasitic).',
      'Respiration: Breaking down glucose to release energy. Aerobic (with oxygen, occurs in mitochondria, yields 36-38 ATP) and Anaerobic (without oxygen, occurs in cytoplasm, yields 2 ATP).',
      'Transportation: Human double-circulation system uses the Heart (4 chambers) to pump blood through arteries and veins. Plants use Xylem (water/minerals) and Phloem (food/translocation).',
      'Excretion: Removal of metabolic nitrogenous wastes. Nephrons are the functional filtration units of the human Kidney.'
    ],
    formulas: [
      'Photosynthesis: 6CO2 + 6H2O + Light → C6H12O6 + 6O2',
      'Aerobic glucose breakdown: Glucose (C6) → Pyruvate (C3) → 6CO2 + 6H2O + 38 ATP',
      'Anaerobic in Yeast: Glucose → Pyruvate → Ethanol + CO2 + 2 ATP',
      'Anaerobic in Muscle: Glucose → Pyruvate → Lactic Acid + 2 ATP (causes cramps)'
    ],
    keyConcepts: [
      { title: 'Stomatal Mechanism', description: 'Tiny pores on leaves bounded by Guard Cells. Osmotic water intake causes guard cells to swell and open the pore; water loss causes flaccidity and closure.' },
      { title: 'Human Digestive System', description: 'Salivary amylase in mouth, Pepsin/HCl in stomach, Bile from liver (emulsifies fats), and pancreatic enzymes (Trypsin, Lipase) in the small intestine, where absorption occurs via Villi.' },
      { title: 'Double Circulation', description: 'Blood travels through the heart twice in one complete cycle: Pulmonary circulation (to lungs) and Systemic circulation (to body). Prevents mixing of oxygenated and deoxygenated blood.' },
      { title: 'Nephron Structure', description: 'Glomerulus filters blood at high pressure. Bowman\'s Capsule collects filtrate. Tubule selectively reabsorbs water, glucose, and amino acids, excreting urine.' }
    ],
    diagrams: [
      { title: 'Structure of the Human Heart', description: '4-chambered pump: Left atrium and left ventricle handle oxygenated blood; Right atrium and right ventricle handle deoxygenated blood. Septum separates oxygen-rich and oxygen-poor sections.' },
      { title: 'Structure of a Nephron', description: 'Bowman\'s capsule wrapping a knot of capillaries (Glomerulus), leading into a convoluted tubule and a loop of Henle, joining a collecting duct.' },
      { title: 'Open & Closed Stomata', description: 'Kidney-shaped guard cells containing chloroplasts. Turgidity triggers stomatal pore opening for gas exchange.' }
    ],
    learningObjectives: [
      'Understand the four essential life maintenance processes.',
      'Explain chemical pathways of light and dark reactions in photosynthesis.',
      'Contrast aerobic, anaerobic, and muscle-fatigue respiration mechanisms.',
      'Trace blood flow through the cardiac chambers, valves, and pulmonary loop.',
      'Outline glomerular filtration, tubular reabsorption, and urine excretion.'
    ],
    nodes3D: ['Human Heart', 'Nephron Filtration', 'Stomatal Guard Cells', 'Alveolar Gas Exchange', 'Photosynthesis Organelle', 'Villi Absorption'],
    quiz: [
      {
        question: "Which of the following is the correct site of photosynthesis in plant cells?",
        options: ["Mitochondria", "Cytoplasm", "Chloroplast", "Golgi apparatus"],
        answerIndex: 2,
        explanation: "Chloroplasts contain chlorophyll pigment which captures solar energy to perform photosynthesis."
      },
      {
        question: "In which part of the human alimentary canal is food completely digested?",
        options: ["Stomach", "Mouth", "Large Intestine", "Small Intestine"],
        answerIndex: 3,
        explanation: "Small intestine receives pancreatic juice and bile, completing carbohydrates, proteins, and fats digestion."
      },
      {
        question: "What product is formed when glucose is broken down anaerobically in our muscle cells during strenuous exercise?",
        options: ["Ethanol and CO2", "Lactic acid and energy", "Carbon dioxide and water", "Pyruvate only"],
        answerIndex: 1,
        explanation: "Inadequate oxygen during exercise causes glucose to break down into lactic acid, resulting in muscle fatigue and painful cramps."
      },
      {
        question: "Which chamber of the human heart has the thickest muscular walls?",
        options: ["Right Atrium", "Left Atrium", "Right Ventricle", "Left Ventricle"],
        answerIndex: 3,
        explanation: "The left ventricle must pump oxygenated blood to the entire human body at high pressure, requiring robust muscular walls."
      },
      {
        question: "What is the primary function of xylem in plants?",
        options: ["Transport of food", "Transport of amino acids", "Transport of water and minerals", "Transport of oxygen"],
        answerIndex: 2,
        explanation: "Xylem tissue conducts water and dissolved mineral ions upward from roots. Phloem tissue translocates manufactured food."
      },
      {
        question: "What is the functional unit of excretion in human kidneys?",
        options: ["Neuron", "Nephron", "Alveolus", "Ureter"],
        answerIndex: 1,
        explanation: "Nephrons filter blood, selectively reabsorbing nutrients and draining urea as urine. Neurons are cells of the nervous system."
      },
      {
        question: "What prevents the backflow of blood inside the heart during contraction?",
        options: ["Valves in heart", "Thick muscular walls of ventricles", "Septum", "Capillaries"],
        answerIndex: 0,
        explanation: "Valves (tricuspid, bicuspid, and semi-lunar) close tightly to ensure blood flows only in one direction."
      },
      {
        question: "Where does the aerobic breakdown of pyruvate take place in a cell?",
        options: ["Cytoplasm", "Chloroplast", "Nucleus", "Mitochondria"],
        answerIndex: 3,
        explanation: "While glycolysis occurs in cytoplasm, the complete oxygen-driven Krebs cycle and ATP generation occur inside Mitochondria."
      },
      {
        question: "The process of translocation of food in plants occurs in which form?",
        options: ["Glucose", "Sucrose", "Starch", "Protein"],
        answerIndex: 1,
        explanation: "Soluble carbohydrates are translocated in phloem primarily as Sucrose, which is actively loaded using ATP energy."
      },
      {
        question: "Which enzyme is secreted in saliva that digests starch?",
        options: ["Pepsin", "Trypsin", "Salivary amylase", "Lipase"],
        answerIndex: 2,
        explanation: "Salivary amylase (pityalin) digests complex starches into simpler sugars like maltose in the mouth."
      }
    ]
  }
};

// Generates dynamic but educational NCERT data for other chapters to ensure no blank pages!
export function getChapterDetails(chapterId: string, chapterTitle: string, subject: SubjectName): ChapterDetails {
  if (SPECIFIC_CHAPTERS[chapterId]) {
    return SPECIFIC_CHAPTERS[chapterId];
  }

  // Fallback generator
  const isMath = subject === 'Mathematics';
  const notes = [
    `This chapter covers essential concepts of **${chapterTitle}**, which is a core part of the CBSE CBSE Class NCERT curriculum.`,
    `A solid understanding of these principles is key for scoring well in exams and building foundation skills.`,
    `Interactive 3D model study helps in concrete visual understanding, especially for spatial arrangements and physical variables.`,
    `Ensure you make concise formulas or conceptual maps to capture main equations and structures.`,
    `Regular practice of NCERT in-text exercises and past year board exam questions is highly recommended.`
  ];

  const formulas = isMath ? [
    `General relation: f(x) or Equation of system`,
    `Identity / Theorem corresponding to ${chapterTitle}`,
    `Standard derivative or integral boundaries`,
    `Simplification ratio: Left-hand side = Right-hand side`
  ] : [
    `Rate of process or value calculation constant`,
    `Constituent relation: Input energy vs system efficiency`,
    `Chemical equation or physical conservation rule of ${chapterTitle}`,
    `Standard physical units and scaling variables`
  ];

  const keyConcepts = [
    { title: 'Core Foundations', description: `Fundamental variables, definitions, and core historical discoveries of ${chapterTitle}.` },
    { title: 'CBSE Syllabus Scope', description: `Key classifications, properties, and core theories approved by the CBSE board.` },
    { title: 'Practical Application', description: `How these chemical, physical, or mathematical models translate into technology and daily life.` }
  ];

  const diagrams = [
    { title: `${chapterTitle} Analytical Setup`, description: `Conceptual schematic illustrating the core relationships, vectors, or microscopic structures of ${chapterTitle}.` },
    { title: 'Process Flowchart', description: `Step-by-step schematic showing state transitions or logical calculation sequence.` }
  ];

  const learningObjectives = [
    `Explain the fundamental definitions and variables in ${chapterTitle}.`,
    `Derive or balance core mathematical formulas or chemical equations.`,
    `Understand real-world implications of these theoretical systems.`,
    `Solve sample assessment challenges with absolute accuracy.`
  ];

  // Derive nice 3D concepts
  const words = chapterTitle.split(' ');
  const coreNoun = words[0] || 'Concept';
  const nodes3D = [coreNoun, 'Structure', 'Types/Classes', 'Force/Interaction', 'System Balance', 'CBSE Application'];

  const quiz = [
    {
      question: `Which of the following is central to the study of ${chapterTitle}?`,
      options: [`Understanding core definitions of ${coreNoun}`, "Relying on arbitrary formulas without proof", "Skipping NCERT textbook diagrams", "Avoiding practice questions"],
      answerIndex: 0,
      explanation: `Mastering the core definitions and structures of ${coreNoun} is the primary step in scoring well in this CBSE chapter.`
    },
    {
      question: `How does studying 3D models improve your understanding of ${chapterTitle}?`,
      options: ["It has no practical use", "It provides spatial understanding and strengthens long-term memory", "It replaces the textbook completely", "It is only for entertainment"],
      answerIndex: 1,
      explanation: "3D visual models allow you to rotate, zoom, and inspect structural layers, which triggers spatial-cognitive retention."
    },
    {
      question: "Which learning approach is most recommended for CBSE board exams?",
      options: ["Rote memorization on the last day", "Consistent revision of NCERT concepts and practicing mock quizzes", "Avoiding practice exercises", "Studying from random untrusted sources"],
      answerIndex: 1,
      explanation: "Active recall through self-quizzing and spaced revision of NCERT curriculum is scientifically proven to yield top exam scores."
    },
    {
      question: `What is a common real-world application of ${chapterTitle}?`,
      options: ["Industrial chemical processes and modern engineering", "It is purely theoretical with no applications", "Only for historical context", "It cannot be applied anywhere"],
      answerIndex: 0,
      explanation: "Syllabus topics are selected due to their high relevance in modern technological, medical, and engineering industries."
    },
    {
      question: "What role does the Law of Conservation play in scientific systems?",
      options: ["It can be violated under high pressure", "It maintains that mass/energy/charge remains constant in closed processes", "It was proven false by modern research", "It only applies to mathematics"],
      answerIndex: 1,
      explanation: "Conservation laws represent universal physical rules indicating that characteristics are conserved during operations."
    }
  ];

  return {
    id: chapterId,
    title: chapterTitle,
    difficultyStars: Math.floor(Math.random() * 3) + 3, // 3, 4, or 5
    readTimeMins: Math.floor(Math.random() * 8) + 8, // 8 to 15 mins
    shortNotes: notes,
    formulas,
    keyConcepts,
    diagrams,
    learningObjectives,
    nodes3D,
    quiz
  };
}
