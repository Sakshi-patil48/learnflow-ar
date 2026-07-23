import { ClassLevel, SubjectName } from './types';

export interface NcertChapter {
  id: string;
  number: number;
  title: string;
  topics: string[];
  pdfUrl?: string;
  youtubeVideoUrl?: string;
}

export function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2] && match[2].length === 11) ? match[2] : null;
}

export interface NcertBook {
  title: string;
  publisher: string;
  chapters: NcertChapter[];
}

export const NCERT_BOOKS: Record<ClassLevel, Record<SubjectName, NcertBook>> = {
  '11th': {
    'Biology': {
      title: 'Biology - Class XI',
      publisher: 'NCERT',
      chapters: [
        {
          id: 'c11_bio_1',
          number: 1,
          title: 'The Living World',
          topics: ['What is Living?', 'Diversity in Living World', 'Taxonomic Categories', 'Taxonomical Aids'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-biology-chapter-1',
          youtubeVideoUrl: 'https://www.youtube.com/watch?v=sTZzt4INjTA'
        },
        {
          id: 'c11_bio_2',
          number: 2,
          title: 'Biological Classification',
          topics: ['Kingdom Monera', 'Kingdom Protista', 'Kingdom Fungi', 'Kingdom Plantae', 'Kingdom Animalia', 'Viruses, Viroids and Lichens'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-biology-chapter-2'
        },
        {
          id: 'c11_bio_3',
          number: 3,
          title: 'Plant Kingdom',
          topics: ['Algae Structure', 'Bryophytes', 'Pteridophytes', 'Gymnosperms', 'Angiosperms', 'Plant Life Cycles'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-biology-chapter-3'
        },
        {
          id: 'c11_bio_4',
          number: 4,
          title: 'Animal Kingdom',
          topics: ['Basis of Classification', 'Phylum Porifera to Coelenterata', 'Phylum Platyhelminthes to Annelida', 'Phylum Arthropoda to Mollusca', 'Phylum Chordata & Vertebrata'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-biology-chapter-4'
        },
        {
          id: 'c11_bio_5',
          number: 5,
          title: 'Morphology of Flowering Plants',
          topics: ['The Root Systems', 'The Stem Modifications', 'The Leaf Structure & Venation', 'The Inflorescence Types', 'The Flower Parts & Symmetry', 'The Fruit and Seed Anatomy', 'Semi-Technical Description of Families'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-biology-chapter-5'
        },
        {
          id: 'c11_bio_6',
          number: 6,
          title: 'Anatomy of Flowering Plants',
          topics: ['The Tissues - Meristematic & Permanent', 'The Tissue System (Epidermal, Ground, Vascular)', 'Anatomy of Dicotyledonous and Monocotyledonous Plants', 'Secondary Growth in Stems & Roots'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-biology-chapter-6'
        },
        {
          id: 'c11_bio_7',
          number: 7,
          title: 'Structural Organisation in Animals',
          topics: ['Animal Tissues (Epithelial, Connective, Muscular, Neural)', 'Organ and Organ System Anatomy', 'Morphology and Anatomy of Frog/Cockroach/Earthworm'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-biology-chapter-7'
        },
        {
          id: 'c11_bio_8',
          number: 8,
          title: 'Cell: The Unit of Life',
          topics: ['What is a Cell?', 'Cell Theory and its Formulation', 'An Overview of Cell Structure', 'Prokaryotic Cells & Envelope', 'Eukaryotic Cells and Organelles', 'Endomembrane System, Mitochondria, Plastids'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-biology-chapter-8'
        },
        {
          id: 'c11_bio_9',
          number: 9,
          title: 'Biomolecules',
          topics: ['How to Analyse Chemical Composition?', 'Primary and Secondary Metabolites', 'Biomacromolecules (Proteins, Polysaccharides, Nucleic Acids)', 'Structure of Proteins & Enzymes', 'Factors Affecting Enzyme Activity'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-biology-chapter-9'
        },
        {
          id: 'c11_bio_10',
          number: 10,
          title: 'Cell Cycle and Cell Division',
          topics: ['Cell Cycle phases (Interphase, M Phase)', 'Mitosis - Karyokinesis and Cytokinesis', 'Significance of Mitosis', 'Meiosis - Meiosis I and Meiosis II', 'Significance of Meiosis'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-biology-chapter-10'
        },
        {
          id: 'c11_bio_11',
          number: 11,
          title: 'Photosynthesis in Higher Plants',
          topics: ['What do we Know about Photosynthesis?', 'Early Experiments', 'Where does Photosynthesis take place?', 'How many Pigments are involved?', 'Light Reaction & Electron Transport', 'Splitting of Water & Cyclic/Non-cyclic Photophosphorylation', 'Chemiosmotic Hypothesis', 'Where are ATP and NADPH used? (Calvin Cycle)', 'The C4 Pathway', 'Photorespiration & Factors affecting Photosynthesis'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-biology-chapter-11'
        },
        {
          id: 'c11_bio_12',
          number: 12,
          title: 'Respiration in Plants',
          topics: ['Do Plants Breathe?', 'Glycolysis pathway', 'Fermentation (Anaerobic Respiration)', 'Aerobic Respiration - TCA Cycle', 'Electron Transport System (ETS) & Oxidative Phosphorylation', 'The Respiratory Balance Sheet', 'Amphibolic Pathway', 'Respiratory Quotient (RQ)'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-biology-chapter-12'
        },
        {
          id: 'c11_bio_13',
          number: 13,
          title: 'Plant Growth and Development',
          topics: ['Growth - Characteristics & Phases', 'Growth Rates (Arithmetic & Geometric)', 'Conditions for Growth', 'Differentiation, Dedifferentiation and Redifferentiation', 'Development & Plasticity', 'Plant Growth Regulators (Auxins, Gibberellins, Cytokinins, Ethylene, ABA)', 'Photoperiodism & Vernalisation'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-biology-chapter-13'
        },
        {
          id: 'c11_bio_14',
          number: 14,
          title: 'Breathing and Exchange of Gases',
          topics: ['Respiratory Organs in different animals', 'Human Respiratory System anatomy', 'Mechanism of Breathing', 'Respiratory Volumes and Capacities', 'Exchange of Gases in alveoli/tissues', 'Transport of Gases (Oxygen and Carbon dioxide)', 'Regulation of Respiration', 'Disorders of Respiratory System (Asthma, Emphysema, Occupational)'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-biology-chapter-14'
        },
        {
          id: 'c11_bio_15',
          number: 15,
          title: 'Body Fluids and Circulation',
          topics: ['Blood Composition - Plasma and Formed Elements', 'Blood Groups (ABO and Rh)', 'Coagulation of Blood', 'Lymph (Tissue Fluid) Functions', 'Circulatory Pathways (Open vs Closed)', 'Human Circulatory System (Heart anatomy & cardiac cycle)', 'Electrocardiogram (ECG)', 'Double Circulation', 'Regulation of Cardiac Activity', 'Disorders of Circulatory System'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-biology-chapter-15'
        },
        {
          id: 'c11_bio_16',
          number: 16,
          title: 'Excretory Products and their Elimination',
          topics: ['Modes of Excretion (Ammonotelism, Ureotelism, Uricotelism)', 'Human Excretory System anatomy', 'Urine Formation mechanism (Glomerular filtration, Reabsorption, Secretion)', 'Function of the Tubules (PCT, Henle\'s loop, DCT, Collecting duct)', 'Mechanism of Concentration of the Filtrate (Counter current multiplier)', 'Regulation of Kidney Function (RAS, ADH, ANF)', 'Micturition & Role of other organs in excretion', 'Disorders of excretory system (Uremia, Renal calculi, Glomerulonephritis)'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-biology-chapter-16'
        },
        {
          id: 'c11_bio_17',
          number: 17,
          title: 'Locomotion and Movement',
          topics: ['Types of Movement (Amoeboid, Ciliary, Muscular)', 'Structure of Skeletal Muscle', 'Structure of Contractile Proteins (Actin & Myosin)', 'Mechanism of Muscle Contraction (Sliding Filament Theory)', 'Skeletal System - Axial and Appendicular skeleton', 'Joints (Fibrous, Cartilaginous, Synovial)', 'Disorders of Muscular and Skeletal System'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-biology-chapter-17'
        },
        {
          id: 'c11_bio_18',
          number: 18,
          title: 'Neural Control and Coordination',
          topics: ['Neural System structure', 'Human Neural System (CNS and PNS)', 'Neuron as Structural and Functional Unit', 'Generation and Conduction of Nerve Impulse', 'Transmission of Impulses & Synapses', 'Central Nervous System (Forebrain, Midbrain, Hindbrain)', 'Reflex Action and Reflex Arc', 'Sensory Reception and Processing (Structure of Eye & Ear)'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-biology-chapter-18'
        },
        {
          id: 'c11_bio_19',
          number: 19,
          title: 'Chemical Coordination and Integration',
          topics: ['Endocrine Glands and Hormones', 'Human Endocrine System (Hypothalamus, Pituitary, Pineal, Thyroid, Adrenal)', 'Pancreas, Testis, Ovary hormonal secretions', 'Hormones of Heart, Kidney and Gastrointestinal Tract', 'Mechanism of Hormone Action (Membrane-bound & intracellular receptors)'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-biology-chapter-19'
        }
      ]
    },
    'Physics': {
      title: 'Physics - Class XI',
      publisher: 'NCERT',
      chapters: [
        {
          id: 'c11_phy_1',
          number: 1,
          title: 'Units and Measurements',
          topics: ['The International System of Units', 'Significant Figures', 'Dimensions of Physical Quantities', 'Dimensional Analysis and its Applications', 'Errors in Measurement'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-physics-chapter-1'
        },
        {
          id: 'c11_phy_2',
          number: 2,
          title: 'Motion in a Straight Line',
          topics: ['Position, Path Length and Displacement', 'Average Velocity and Average Speed', 'Instantaneous Velocity and Speed', 'Acceleration', 'Kinematic Equations for Uniformly Accelerated Motion', 'Relative Velocity'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-physics-chapter-2'
        },
        {
          id: 'c11_phy_3',
          number: 3,
          title: 'Motion in a Plane',
          topics: ['Scalars and Vectors', 'Multiplication of Vectors by Real Numbers', 'Resolution of Vectors', 'Vector Addition - Analytical Method', 'Motion in a Plane with Constant Acceleration', 'Relative Velocity in Two Dimensions', 'Projectile Motion', 'Uniform Circular Motion'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-physics-chapter-3'
        },
        {
          id: 'c11_phy_4',
          number: 4,
          title: 'Laws of Motion',
          topics: ['Aristotles Fallacy', 'The Law of Inertia', 'Newtons First Law of Motion', 'Newtons Second Law of Motion', 'Newtons Third Law of Motion', 'Conservation of Momentum', 'Equilibrium of a Particle', 'Common Forces in Mechanics & Friction', 'Circular Motion'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-physics-chapter-4'
        },
        {
          id: 'c11_phy_5',
          number: 5,
          title: 'Work, Energy and Power',
          topics: ['Notions of Work and Kinetic Energy: The Work-Energy Theorem', 'Work Done by a Constant/Variable Force', 'Kinetic Energy & Potential Energy', 'The Concept of Potential Energy', 'The Law of Conservation of Mechanical Energy', 'The Potential Energy of a Spring', 'Power', 'Collisions (Elastic and Inelastic)'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-physics-chapter-5'
        },
        {
          id: 'c11_phy_6',
          number: 6,
          title: 'System of Particles and Rotational Motion',
          topics: ['Centre of Mass & Motion of Centre of Mass', 'Linear Momentum of a System of Particles', 'Vector Product of Two Vectors', 'Angular Velocity and its Relation with Linear Velocity', 'Torque and Angular Momentum', 'Equilibrium of a Rigid Body', 'Moment of Inertia', 'Kinematics & Dynamics of Rotational Motion about a Fixed Axis', 'Angular Momentum in Case of Rotation about a Fixed Axis'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-physics-chapter-6'
        },
        {
          id: 'c11_phy_7',
          number: 7,
          title: 'Gravitation',
          topics: ['Keplers Laws', 'Universal Law of Gravitation', 'The Gravitational Constant', 'Acceleration due to Gravity of the Earth', 'Acceleration due to Gravity Below and Above the Surface of Earth', 'Gravitational Potential Energy', 'Escape Speed', 'Earth Satellites & Energy of an Orbiting Satellite', 'Geostationary and Polar Satellites', 'Weightlessness'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-physics-chapter-7'
        },
        {
          id: 'c11_phy_8',
          number: 8,
          title: 'Mechanical Properties of Solids',
          topics: ['Elastic Behaviour of Solids', 'Stress and Strain', 'Hookes Law', 'Stress-Strain Curve', 'Elastic Moduli (Youngs, Shear, Bulk Modulus)', 'Applications of Elastic Behaviour of Materials'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-physics-chapter-8'
        },
        {
          id: 'c11_phy_9',
          number: 9,
          title: 'Mechanical Properties of Fluids',
          topics: ['Pressure (Pascal\'s Law, Variation of Pressure with Depth)', 'Streamline Flow', 'Bernoullis Principle & Applications', 'Viscosity & Reynolds Number', 'Surface Tension (Surface Energy, Angle of Contact, Drops & Bubbles, Capillarity)'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-physics-chapter-9'
        },
        {
          id: 'c11_phy_10',
          number: 10,
          title: 'Thermal Properties of Matter',
          topics: ['Temperature and Heat', 'Measurement of Temperature', 'Ideal-Gas Equation and Absolute Temperature', 'Thermal Expansion (Linear, Area, Volume Expansion)', 'Specific Heat Capacity & Calorimetry', 'Change of State (Latent Heat)', 'Heat Transfer (Conduction, Convection, Radiation)', 'Newtons Law of Cooling'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-physics-chapter-10'
        },
        {
          id: 'c11_phy_11',
          number: 11,
          title: 'Thermodynamics',
          topics: ['Thermal Equilibrium & Zeroth Law of Thermodynamics', 'Heat, Internal Energy and Work', 'First Law of Thermodynamics', 'Specific Heat Capacity of a Gas', 'Thermodynamic Process (Isothermal, Adiabatic, Isobaric, Isochoric)', 'Second Law of Thermodynamics', 'Reversible and Irreversible Processes', 'Carnot Engine & Efficiency'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-physics-chapter-11'
        },
        {
          id: 'c11_phy_12',
          number: 12,
          title: 'Kinetic Theory',
          topics: ['Molecular Nature of Matter', 'Behaviour of Gases', 'Kinetic Theory of an Ideal Gas', 'Pressure of an Ideal Gas', 'Law of Equipartition of Energy', 'Specific Heat Capacity of Gases and Solids', 'Mean Free Path'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-physics-chapter-12'
        },
        {
          id: 'c11_phy_13',
          number: 13,
          title: 'Oscillations',
          topics: ['Periodic and Oscillatory Motions', 'Simple Harmonic Motion (SHM)', 'SHM and Uniform Circular Motion', 'Velocity and Acceleration in SHM', 'Force Law for Simple Harmonic Motion', 'Energy in SHM (Kinetic and Potential Energy)', 'Some Systems executing SHM (Simple Pendulum)', 'Damped Simple Harmonic Motion', 'Forced Oscillations and Resonance'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-physics-chapter-13'
        },
        {
          id: 'c11_phy_14',
          number: 14,
          title: 'Waves',
          topics: ['Transverse and Longitudinal Waves', 'Displacement Relation in a Progressive Wave', 'The Speed of a Travelling Wave', 'The Principle of Superposition of Waves', 'Reflection of Waves & Standing Waves', 'Beats', 'Doppler Effect'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-physics-chapter-14'
        }
      ]
    },
    'Chemistry': {
      title: 'Chemistry - Class XI',
      publisher: 'NCERT',
      chapters: [
        {
          id: 'c11_chem_1',
          number: 1,
          title: 'Some Basic Concepts of Chemistry',
          topics: ['Importance of Chemistry', 'Nature of Matter', 'Properties of Matter & Measurements', 'Laws of Chemical Combinations', 'Daltons Atomic Theory', 'Atomic and Molecular Masses', 'Stoichiometry & Calculations'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-chemistry-chapter-1'
        },
        {
          id: 'c11_chem_2',
          number: 2,
          title: 'Structure of Atom',
          topics: ['Sub-atomic Particles', 'Atomic Models (Rutherford/Bohr)', 'Dual Nature of Matter', 'Heisenbergs Uncertainty Principle', 'Quantum Mechanical Model of Atom', 'Electronic Configurations'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-chemistry-chapter-2'
        },
        {
          id: 'c11_chem_3',
          number: 3,
          title: 'Classification of Elements and Periodicity in Properties',
          topics: ['Genesis of Periodic Classification', 'Modern Periodic Law and Present Form', 'Electronic Configurations & Types of Elements', 'Periodic Trends in Properties of Elements', 'Ionization Enthalpy & Electronegativity'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-chemistry-chapter-3'
        },
        {
          id: 'c11_chem_4',
          number: 4,
          title: 'Chemical Bonding and Molecular Structure',
          topics: ['Kossel-Lewis Approach to Chemical Bonding', 'Ionic or Electrovalent Bond', 'Bond Parameters', 'VSEPR Theory', 'Valence Bond Theory & Hybridisation', 'Molecular Orbital Theory'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-chemistry-chapter-4'
        },
        {
          id: 'c11_chem_5',
          number: 5,
          title: 'Chemical Thermodynamics',
          topics: ['Thermodynamic Terms', 'Applications of Thermodynamics', 'Measurement of ΔU and ΔH: Calorimetry', 'Enthalpy Change (ΔH) of Reactions', 'Spontaneity & Entropy', 'Gibbs Energy Change and Equilibrium'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-chemistry-chapter-5'
        },
        {
          id: 'c11_chem_6',
          number: 6,
          title: 'Equilibrium',
          topics: ['Equilibrium in Physical Processes', 'Equilibrium in Chemical Processes', 'Law of Chemical Equilibrium and Equilibrium Constant', 'Le Chateliers Principle', 'Ionic Equilibrium in Solution', 'Acids, Bases and Salts & pH Scale'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-chemistry-chapter-6'
        },
        {
          id: 'c11_chem_7',
          number: 7,
          title: 'Redox Reactions',
          topics: ['Classical Idea of Redox Reactions', 'Redox Reactions in terms of Electron Transfer', 'Oxidation Number & Rules for Assignment', 'Balancing of Redox Reactions', 'Redox Reactions and Electrode Processes'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-chemistry-chapter-7'
        },
        {
          id: 'c11_chem_8',
          number: 8,
          title: 'Organic Chemistry – Some Basic Principles and Techniques',
          topics: ['General Introduction to Organic Compounds', 'Tetravalence of Carbon & Hybridisation', 'Structural Representations of Organic Compounds', 'Classification of Organic Compounds', 'Nomenclature of Organic Compounds (IUPAC)', 'Isomerism', 'Fundamental Concepts in Organic Reaction Mechanisms'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-chemistry-chapter-8'
        },
        {
          id: 'c11_chem_9',
          number: 9,
          title: 'Hydrocarbons',
          topics: ['Classification of Hydrocarbons', 'Alkanes - Nomenclature, Preparation & Properties', 'Alkenes - Structure, Isomerism & Preparation', 'Alkynes - Physical and Chemical Properties', 'Aromatic Hydrocarbons - Nomenclature and Stability'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-chemistry-chapter-9'
        }
      ]
    },
    'Mathematics': {
      title: 'Mathematics - Class XI',
      publisher: 'NCERT',
      chapters: [
        {
          id: 'c11_math_1',
          number: 1,
          title: 'Sets',
          topics: ['Sets and their Representations', 'Empty Set & Finite Sets', 'Subsets & Power Sets', 'Venn Diagrams', 'Operations on Sets'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-maths-chapter-1'
        },
        {
          id: 'c11_math_2',
          number: 2,
          title: 'Relations and Functions',
          topics: ['Cartesian Product of Sets', 'Relations definition and domain', 'Functions representation & types', 'Algebra of Real Functions'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-maths-chapter-2'
        },
        {
          id: 'c11_math_3',
          number: 3,
          title: 'Trigonometric Functions',
          topics: ['Angles & Radian Measures', 'Trigonometric Functions definition', 'Trigonometric Functions of Sum/Difference', 'Trigonometric Equations'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-maths-chapter-3'
        },
        {
          id: 'c11_math_4',
          number: 4,
          title: 'Principle of Mathematical Induction',
          topics: ['Motivation and foundation of induction', 'The Principle of Mathematical Induction', 'Proof of algebraic properties using induction'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-maths-chapter-4'
        },
        {
          id: 'c11_math_5',
          number: 5,
          title: 'Complex Numbers and Quadratic Equations',
          topics: ['Complex Numbers introduction', 'Algebra of Complex Numbers', 'Conjugate and Modulus of complex number', 'Argand Plane and Polar Representation', 'Quadratic Equations with complex roots'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-maths-chapter-5'
        },
        {
          id: 'c11_math_6',
          number: 6,
          title: 'Linear Inequalities',
          topics: ['Inequalities in one variable and algebraic solutions', 'Graphical solution of linear inequalities in two variables', 'System of linear inequalities representation'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-maths-chapter-6'
        },
        {
          id: 'c11_math_7',
          number: 7,
          title: 'Permutations and Combinations',
          topics: ['Fundamental Principle of Counting', 'Factorial notation & formulas', 'Permutations derivations & problems', 'Combinations derivation & practical problems'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-maths-chapter-7'
        },
        {
          id: 'c11_math_8',
          number: 8,
          title: 'Binomial Theorem',
          topics: ['Binomial Theorem for Positive Integral Indices', 'General and Middle Terms', 'Special cases & coefficients'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-maths-chapter-8'
        },
        {
          id: 'c11_math_9',
          number: 9,
          title: 'Sequences and Series',
          topics: ['Arithmetic Progression (AP)', 'Geometric Progression (GP)', 'General terms and Sum of n terms of GP', 'Relationship between AM and GM'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-maths-chapter-9'
        },
        {
          id: 'c11_math_10',
          number: 10,
          title: 'Straight Lines',
          topics: ['Slope of a line & angle between lines', 'Various forms of equations of line (Slope-intercept, intercept, normal)', 'Distance of a point from a line'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-maths-chapter-10'
        },
        {
          id: 'c11_math_11',
          number: 11,
          title: 'Conic Sections',
          topics: ['Sections of a Cone', 'Circle equation and parameters', 'Parabola standard equation and focus', 'Ellipse equations & eccentricity', 'Hyperbola standard equation & asymptotes'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-maths-chapter-11'
        },
        {
          id: 'c11_math_12',
          number: 12,
          title: 'Introduction to Three Dimensional Geometry',
          topics: ['Coordinate Axes and Coordinate Planes in 3D', 'Coordinates of a Point in space', 'Distance formula between two points', 'Section Formula derivation'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-maths-chapter-12'
        },
        {
          id: 'c11_math_13',
          number: 13,
          title: 'Limits and Derivatives',
          topics: ['Intuitive idea of Limits', 'Limits of trigonometric/algebraic functions', 'Derivatives as rate of change', 'Algebra of derivatives & standard derivative formulas'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-maths-chapter-13'
        },
        {
          id: 'c11_math_14',
          number: 14,
          title: 'Mathematical Reasoning',
          topics: ['Statements & Logical connectives', 'Implications & contrapositive, converse', 'Validating Statements & direct, indirect proofs'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-11-maths-chapter-14'
        }
      ]
    }
  },
  '12th': {
    'Biology': {
      title: 'Biology - Class XII',
      publisher: 'NCERT',
      chapters: [
        {
          id: 'c12_bio_1',
          number: 1,
          title: 'Sexual Reproduction in Flowering Plants',
          topics: ['Flower Structure', 'Microsporogenesis & Megasporogenesis', 'Pollination Types & Agents', 'Double Fertilization', 'Post-Fertilization Events (Endosperm, Embryo, Seed, Fruit)', 'Apomixis & Polyembryony'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-12-biology-chapter-1'
        },
        {
          id: 'c12_bio_2',
          number: 2,
          title: 'Human Reproduction',
          topics: ['Male & Female Reproductive Systems', 'Gametogenesis (Spermatogenesis & Oogenesis)', 'Menstrual Cycle', 'Fertilization & Implantation', 'Pregnancy & Embryonic Development', 'Parturition & Lactation'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-12-biology-chapter-2'
        },
        {
          id: 'c12_bio_3',
          number: 3,
          title: 'Reproductive Health',
          topics: ['Reproductive Health: Problems & Strategies', 'Population Explosion & Birth Control', 'Medical Termination of Pregnancy (MTP)', 'Sexually Transmitted Diseases (STDs)', 'Infertility & Assisted Reproductive Technologies (IVF, ZIFT, GIFT)'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-12-biology-chapter-3'
        },
        {
          id: 'c12_bio_4',
          number: 4,
          title: 'Principles of Inheritance and Variation',
          topics: ['Mendelian Inheritance', 'Deviations (Incomplete Dominance, Co-dominance, Pleiotropy)', 'Chromosomal Theory of Inheritance', 'Sex Determination (Humans, Birds, Honey Bees)', 'Linkage & Crossing Over', 'Mutation & Pedigree Analysis', 'Genetic Disorders (Mendelian and Chromosomal)'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-12-biology-chapter-4'
        },
        {
          id: 'c12_bio_5',
          number: 5,
          title: 'Molecular Basis of Inheritance',
          topics: ['Structure of DNA & RNA', 'DNA Packaging', 'Search for Genetic Material (Griffith, Hershey-Chase)', 'DNA Replication', 'Transcription Unit & Process', 'Genetic Code & Translation', 'Regulation of Gene Expression (Lac Operon)', 'Human Genome Project (HGP)', 'DNA Fingerprinting'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-12-biology-chapter-5'
        },
        {
          id: 'c12_bio_6',
          number: 6,
          title: 'Evolution',
          topics: ['Origin of Life', 'Evolution of Life Forms (Theory)', 'Evidence for Evolution (Palaeontological, Anatomy, Embryology)', 'Adaptive Radiation', 'Biological Evolution & Mechanisms', 'Hardy-Weinberg Principle', 'Brief Account of Evolution & Evolution of Man'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-12-biology-chapter-6'
        },
        {
          id: 'c12_bio_7',
          number: 7,
          title: 'Human Health and Disease',
          topics: ['Common Human Diseases (Typhoid, Malaria, Amoebiasis, Ascariasis)', 'Immunity (Innate, Acquired, Active, Passive, Vaccines)', 'Allergies & Autoimmunity', 'Immune System in the Body', 'AIDS & Cancer', 'Drugs and Alcohol Abuse'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-12-biology-chapter-7'
        },
        {
          id: 'c12_bio_8',
          number: 8,
          title: 'Microbes in Human Welfare',
          topics: ['Microbes in Household Products', 'Microbes in Industrial Products (Beverages, Antibiotics, Enzymes)', 'Microbes in Sewage Treatment', 'Microbes in Production of Biogas', 'Microbes as Biocontrol Agents & Biofertilisers'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-12-biology-chapter-8'
        },
        {
          id: 'c12_bio_9',
          number: 9,
          title: 'Biotechnology: Principles and Processes',
          topics: ['Principles of Biotechnology (Genetic & Bioprocess Engineering)', 'Tools of Recombinant DNA Technology (Restriction Enzymes, Vectors)', 'Processes of Recombinant DNA Technology (Isolation, PCR, Insertion)', 'Obtaining Foreign Gene Product', 'Downstream Processing'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-12-biology-chapter-9'
        },
        {
          id: 'c12_bio_10',
          number: 10,
          title: 'Biotechnology and its Applications',
          topics: ['Applications in Agriculture (Bt Cotton, Pest Resistant Plants)', 'Applications in Medicine (Insulin, Gene Therapy, Molecular Diagnosis)', 'Transgenic Animals', 'Ethical Issues & Biopiracy'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-12-biology-chapter-10'
        },
        {
          id: 'c12_bio_11',
          number: 11,
          title: 'Organisms and Populations',
          topics: ['Organism and its Environment', 'Responses to Abiotic Factors', 'Adaptations', 'Population Attributes & Growth Models', 'Life History Variation & Population Interactions (Predation, Competition, Mutualism)'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-12-biology-chapter-11'
        },
        {
          id: 'c12_bio_12',
          number: 12,
          title: 'Ecosystem',
          topics: ['Ecosystem Structure & Function', 'Productivity & Decomposition', 'Energy Flow (Food Chains, Food Web, Pyramids)', 'Ecological Succession', 'Nutrient Cycling (Carbon, Phosphorus)', 'Ecosystem Services'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-12-biology-chapter-12'
        },
        {
          id: 'c12_bio_13',
          number: 13,
          title: 'Biodiversity and Conservation',
          topics: ['Concept & Patterns of Biodiversity', 'Importance of Biodiversity', 'Loss of Biodiversity', 'Biodiversity Conservation (In-situ & Ex-situ Conservation)'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-12-biology-chapter-13'
        }
      ]
    },
    'Physics': {
      title: 'Physics - Class XII',
      publisher: 'NCERT',
      chapters: [
        {
          id: 'c12_phy_1',
          number: 1,
          title: 'Electric Charges and Fields',
          topics: ['Electric Charge & conductors', 'Coulomb\'s Law', 'Electric Field & Field Lines', 'Electric Flux & Dipole', 'Gauss\'s Law and its Applications'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-physics-part-1-chapter-1'
        },
        {
          id: 'c12_phy_2',
          number: 2,
          title: 'Electrostatic Potential and Capacitance',
          topics: ['Electrostatic Potential & Potential Difference', 'Potential due to a Point Charge / Dipole', 'Equipotential Surfaces & Potential Energy', 'Conductors & Polarisation of Dielectrics', 'Capacitors, Capacitance & Combinations', 'Energy Stored in a Capacitor'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-physics-part-1-chapter-2'
        },
        {
          id: 'c12_phy_3',
          number: 3,
          title: 'Current Electricity',
          topics: ['Electric Current & Drift Velocity', 'Ohm\'s Law & Electrical Resistivity', 'Resistivity temperature dependence', 'Cells, Emf & Internal Resistance', 'Kirchhoff\'s Rules & Wheatstone Bridge'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-physics-part-1-chapter-3'
        },
        {
          id: 'c12_phy_4',
          number: 4,
          title: 'Moving Charges and Magnetism',
          topics: ['Magnetic Force & Motion in Magnetic Field', 'Biot-Savart Law & Applications', 'Ampere\'s Circuital Law & Solenoid', 'Force between Parallel Currents & Torque on Current Loop', 'Moving Coil Galvanometer'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-physics-part-1-chapter-4'
        },
        {
          id: 'c12_phy_5',
          number: 5,
          title: 'Magnetism and Matter',
          topics: ['The Bar Magnet & Solenoid analogue', 'Magnetism and Gauss\'s Law', 'Earth\'s Magnetic Field & Elements', 'Magnetic Properties of Materials (Dia, Para, Ferro)'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-physics-part-1-chapter-5'
        },
        {
          id: 'c12_phy_6',
          number: 6,
          title: 'Electromagnetic Induction',
          topics: ['Faraday\'s & Henry\'s Experiments', 'Magnetic Flux & Faraday\'s Law of Induction', 'Lenz\'s Law & Conservation of Energy', 'Motional Electromotive Force & Eddy Currents', 'Self and Mutual Inductance', 'AC Generator'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-physics-part-1-chapter-6'
        },
        {
          id: 'c12_phy_7',
          number: 7,
          title: 'Alternating Current',
          topics: ['Representation of AC (Phasors)', 'AC Voltage Applied to L, C, R elements', 'Series LCR Circuit & Resonance', 'Power in AC Circuits & Power Factor', 'LC Oscillations & Transformers'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-physics-part-1-chapter-7'
        },
        {
          id: 'c12_phy_8',
          number: 8,
          title: 'Electromagnetic Waves',
          topics: ['Displacement Current', 'Sources & Nature of Electromagnetic Waves', 'Electromagnetic Spectrum (Radio to Gamma)'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-physics-part-1-chapter-8'
        },
        {
          id: 'c12_phy_9',
          number: 9,
          title: 'Ray Optics and Optical Instruments',
          topics: ['Reflection by Spherical Mirrors', 'Refraction & Total Internal Reflection (TIR)', 'Refraction at Spherical Surfaces and by Lenses', 'Refraction & Dispersion through a Prism', 'Optical Instruments (Microscopes, Telescopes)'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-physics-part-2-chapter-1'
        },
        {
          id: 'c12_phy_10',
          number: 10,
          title: 'Wave Optics',
          topics: ['Huygens Principle of Wavelets', 'Refraction & Reflection of plane waves', 'Coherent & Incoherent Addition of Waves', 'Interference of Light Waves & Young\'s Double Slit', 'Diffraction & Polarisation'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-physics-part-2-chapter-2'
        },
        {
          id: 'c12_phy_11',
          number: 11,
          title: 'Dual Nature of Radiation and Matter',
          topics: ['Electron Emission & Photoelectric Effect', 'Experimental Study of Photoelectric Effect', 'Einstein\'s Photoelectric Equation & Photon Nature', 'Wave Nature of Matter & de Broglie relation'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-physics-part-2-chapter-3'
        },
        {
          id: 'c12_phy_12',
          number: 12,
          title: 'Atoms',
          topics: ['Alpha-particle Scattering & Rutherford\'s Model', 'Atomic Spectra & Bohr Model of Hydrogen', 'Line Spectra of Hydrogen Atom', 'de Broglie\'s Explanation of Bohr Postulate'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-physics-part-2-chapter-4'
        },
        {
          id: 'c12_phy_13',
          number: 13,
          title: 'Nuclei',
          topics: ['Atomic Masses & Composition of Nucleus', 'Size & Density of Nucleus', 'Mass-Energy Equivalence & Binding Energy', 'Nuclear Forces', 'Radioactivity & Nuclear Energy (Fission/Fusion)'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-physics-part-2-chapter-5'
        },
        {
          id: 'c12_phy_14',
          number: 14,
          title: 'Semiconductor Electronics: Materials, Devices and Simple Circuits',
          topics: ['Classification of Metals, Conductors & Semiconductors', 'Intrinsic & Extrinsic Semiconductors', 'p-n Junction formation & Diode characteristics', 'Junction Diode as a Rectifier', 'Special Purpose p-n Junction Diodes & Logic Gates'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-physics-part-2-chapter-6'
        }
      ]
    },
    'Chemistry': {
      title: 'Chemistry - Class XII',
      publisher: 'NCERT',
      chapters: [
        {
          id: 'c12_chem_1',
          number: 1,
          title: 'Solutions',
          topics: ['Types of Solutions', 'Expressing Concentration of Solutions', 'Solubility & Henry\'s Law', 'Vapour Pressure of Liquid Solutions', 'Colligative Properties & Molar Mass Determination', 'Abnormal Molar Masses'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-12-chemistry-chapter-1'
        },
        {
          id: 'c12_chem_2',
          number: 2,
          title: 'Electrochemistry',
          topics: ['Galvanic Cells & Electrode Potential', 'Nernst Equation', 'Conductance of Electrolytic Solutions', 'Electrolytic Cells & Electrolysis', 'Batteries, Fuel Cells & Corrosion'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-12-chemistry-chapter-2'
        },
        {
          id: 'c12_chem_3',
          number: 3,
          title: 'Chemical Kinetics',
          topics: ['Rate of a Chemical Reaction', 'Factors Influencing Rate of Reaction', 'Integrated Rate Equations', 'Pseudo First Order Reaction', 'Temperature Dependence & Collision Theory'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-12-chemistry-chapter-3'
        },
        {
          id: 'c12_chem_4',
          number: 4,
          title: 'The d-and f-Block Elements',
          topics: ['Position and Electronic Configuration of d-Block', 'General Properties of Transition Elements', 'Important Compounds (KMnO4, K2Cr2O7)', 'The Lanthanoids & Actinoids', 'Applications of d and f-Block Elements'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-12-chemistry-chapter-4'
        },
        {
          id: 'c12_chem_5',
          number: 5,
          title: 'Coordination Compounds',
          topics: ['Werner\'s Theory & Nomenclature', 'Isomerism in Coordination Compounds', 'Valence Bond Theory & Crystal Field Theory', 'Metal Carbonyls & Importance of Coordination Compounds'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-12-chemistry-chapter-5'
        },
        {
          id: 'c12_chem_6',
          number: 6,
          title: 'Haloalkanes and Haloarenes',
          topics: ['Classification & Nomenclature', 'Nature of C-X Bond & Preparation Methods', 'Physical Properties', 'Chemical Reactions & SN1/SN2 Mechanisms', 'Polyhalogen Compounds'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-12-chemistry-chapter-6'
        },
        {
          id: 'c12_chem_7',
          number: 7,
          title: 'Alcohols, Phenols and Ethers',
          topics: ['Classification, Nomenclature & Structures', 'Alcohols & Phenols (Preparation, Physical & Chemical Properties)', 'Commercially Important Alcohols', 'Ethers (Preparation, Physical & Chemical Properties)'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-12-chemistry-chapter-7'
        },
        {
          id: 'c12_chem_8',
          number: 8,
          title: 'Aldehydes, Ketones and Carboxylic Acids',
          topics: ['Nomenclature & Carbonyl Group Structure', 'Preparation & Physical Properties of Aldehydes/Ketones', 'Chemical Reactions & Nucleophilic Addition', 'Carboxylic Acids (Nomenclature, Preparation, Properties & Uses)'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-12-chemistry-chapter-8'
        },
        {
          id: 'c12_chem_9',
          number: 9,
          title: 'Amines',
          topics: ['Structure, Classification & Nomenclature', 'Preparation & Physical Properties of Amines', 'Chemical Reactions of Amines', 'Diazonium Salts (Preparation, Properties & Importance)'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-12-chemistry-chapter-9'
        },
        {
          id: 'c12_chem_10',
          number: 10,
          title: 'Biomolecules',
          topics: ['Carbohydrates (Classification & Structures)', 'Proteins (Amino Acids, Peptide Bond, Structures & Denaturation)', 'Enzymes & Vitamins', 'Nucleic Acids (DNA & RNA structure, Functions)'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-books-class-12-chemistry-chapter-10'
        }
      ]
    },
    'Mathematics': {
      title: 'Mathematics - Class XII',
      publisher: 'NCERT',
      chapters: [
        {
          id: 'c12_math_1',
          number: 1,
          title: 'Relations and Functions',
          topics: ['Types of Relations (Reflexive, Symmetric, Transitive, Equivalence)', 'Types of Functions (One-one, Onto, Bijective)', 'Composition of Functions and Invertible Functions', 'Binary Operations'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-maths-part-1-chapter-1'
        },
        {
          id: 'c12_math_2',
          number: 2,
          title: 'Inverse Trigonometric Functions',
          topics: ['Introduction and Basic Concepts', 'Properties of Inverse Trigonometric Functions', 'Principal Value Branches', 'Graphs of Inverse Trigonometric Functions'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-maths-part-1-chapter-2'
        },
        {
          id: 'c12_math_3',
          number: 3,
          title: 'Matrices',
          topics: ['Concept of Matrix & Order', 'Types of Matrices', 'Operations on Matrices (Addition/Multiplication)', 'Transpose of a Matrix', 'Symmetric and Skew Symmetric Matrices', 'Invertible Matrices'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-maths-part-1-chapter-3'
        },
        {
          id: 'c12_math_4',
          number: 4,
          title: 'Determinants',
          topics: ['Determinant of a Matrix', 'Properties of Determinants', 'Area of a Triangle using Determinants', 'Minors and Cofactors', 'Adjoint and Inverse of a Matrix', 'Applications of Determinants and Matrices'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-maths-part-1-chapter-4'
        },
        {
          id: 'c12_math_5',
          number: 5,
          title: 'Continuity and Differentiability',
          topics: ['Continuity of a Function', 'Differentiability & Chain Rule', 'Implicit & Inverse Trigonometric Functions Derivatives', 'Exponential and Logarithmic Functions', 'Logarithmic & Parametric Differentiation', 'Second Order Derivatives', 'Mean Value Theorems'],
          pdfUrl: 'https://ncert24.com/ncert-book-class-12-maths-part-1-chapter-5'
        },
        {
          id: 'c12_math_6',
          number: 6,
          title: 'Application of Derivatives',
          topics: ['Rate of Change of Quantities', 'Increasing and Decreasing Functions', 'Tangents and Normals', 'Approximations', 'Maxima and Minima (First & Second Derivative Tests)'],
          pdfUrl: 'https://ncert24.com/ncert-book-class-12-maths-part-1-chapter-6'
        },
        {
          id: 'c12_math_7',
          number: 7,
          title: 'Integrals',
          topics: ['Integration as Inverse Process of Differentiation', 'Methods of Integration (Substitution, Parts, Partial Fractions)', 'Definite Integrals and Fundamental Theorem', 'Evaluation of Definite Integrals by Substitution', 'Properties of Definite Integrals'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-maths-part-2-chapter-1'
        },
        {
          id: 'c12_math_8',
          number: 8,
          title: 'Application of Integrals',
          topics: ['Area under Simple Curves', 'Area of Region Bounded by a Curve and a Line', 'Area between Two Curves'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-maths-part-2-chapter-2'
        },
        {
          id: 'c12_math_9',
          number: 9,
          title: 'Differential Equations',
          topics: ['Basic Concepts (Order and Degree)', 'General and Particular Solutions', 'Formation of a Differential Equation', 'Methods of Solving First Order, First Degree Differential Equations'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-maths-part-2-chapter-3'
        },
        {
          id: 'c12_math_10',
          number: 10,
          title: 'Vector Algebra',
          topics: ['Types of Vectors & Direction Cosines', 'Addition of Vectors & Scalar Multiplication', 'Product of Two Vectors (Scalar/Dot)', 'Vector or Cross Product of Two Vectors'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-maths-part-2-chapter-4'
        },
        {
          id: 'c12_math_11',
          number: 11,
          title: 'Three Dimensional Geometry',
          topics: ['Direction Cosines and Direction Ratios', 'Equation of a Line in Space', 'Angle between Two Lines & Shortest Distance', 'Equation of a Plane', 'Angle between Two Planes / Line and Plane'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-maths-part-2-chapter-5'
        },
        {
          id: 'c12_math_12',
          number: 12,
          title: 'Linear Programming',
          topics: ['Linear Programming Problem and Formulation', 'Graphical Method of Solving LPP', 'Different Types of Linear Programming Problems'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-maths-part-2-chapter-6'
        },
        {
          id: 'c12_math_13',
          number: 13,
          title: 'Probability',
          topics: ['Conditional Probability & Multiplication Theorem', 'Independent Events', 'Bayes\' Theorem', 'Random Variables and its Probability Distributions', 'Bernoulli Trials and Binomial Distribution'],
          pdfUrl: 'https://ncert24.com/ncert-books/ncert-book-class-12-maths-part-2-chapter-7'
        }
      ]
    }
  }
};
