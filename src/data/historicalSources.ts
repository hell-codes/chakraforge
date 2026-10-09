/**
 * CHAKRAFORGE Historical Sources & Computational Grounding Data Layer
 * 
 * Primary Reference:
 * The Mahābhārata of Krishna-Dwaipayana Vyasa, translated by Kisari Mohan Ganguli
 * Book 7: Droṇa Parva (Abhimanyu-badha Parva), Sections XXXIII - XLVIII
 * Cross-referenced with the Critical Edition (BORI, Pune).
 * 
 * Status Designations:
 * - 'source-attested': Directly attested in the Sanskrit epic text and reputable translations.
 * - 'computational-model': Mathematical or algorithmic abstraction developed for CHAKRAFORGE.
 * - 'counterfactual': Exploratory scenario testing alternative strategic decisions or information states.
 */

export type HistoricalStatus = 'source-attested' | 'computational-model' | 'counterfactual';

export interface HistoricalEventRecord {
  id: string;
  source: string;
  parva: string;
  episode: string;
  section: string;
  character: string;
  event: string;
  description: string;
  sourceReference: string;
  historicalStatus: HistoricalStatus;
}

export const HISTORICAL_SOURCES: HistoricalEventRecord[] = [
  {
    id: 'hist-01-drona-array',
    source: 'Mahābhārata (KM Ganguli Translation)',
    parva: 'Droṇa Parva',
    episode: 'Abhimanyu-badha Parva',
    section: 'Section XXXIII',
    character: 'Guru Droṇācārya',
    event: 'Deployment of the Circular Array (Chakravyūha)',
    description:
      'Challenged by Duryodhana, Drona resolves to array the Kaurava army into the formidable circular formation (Chakravyūha). The text notes that none among the Pandavas save Krishna, Arjuna, Pradyumna, and Abhimanyu know how to penetrate this array.',
    sourceReference: 'Droṇa Parva, Sec. XXXIII: "Droṇa then arrayed his troops in that circular form which none could break..."',
    historicalStatus: 'source-attested'
  },
  {
    id: 'hist-02-yudhishthira-order',
    source: 'Mahābhārata (KM Ganguli Translation)',
    parva: 'Droṇa Parva',
    episode: 'Abhimanyu-badha Parva',
    section: 'Section XXXIV',
    character: 'King Yudhiṣṭhira',
    event: 'Yudhiṣṭhira Requests Abhimanyu to Breach the Array',
    description:
      'With Arjuna drawn far south by the Samsaptakas, King Yudhishthira observes the impenetrable Kaurava array and charges the 16-year-old Abhimanyu with breaking through the vanguard, assuring him that the veteran Pandava warriors will follow close behind.',
    sourceReference: 'Droṇa Parva, Sec. XXXIV: "Break, O son of Subhadra, this array of Drona! There is none amongst us save thee who can pierce it."',
    historicalStatus: 'source-attested'
  },
  {
    id: 'hist-03-abhimanyu-declaration',
    source: 'Mahābhārata (KM Ganguli Translation)',
    parva: 'Droṇa Parva',
    episode: 'Abhimanyu-badha Parva',
    section: 'Section XXXV',
    character: 'Abhimanyu',
    event: 'Declaration of Asymmetric Information (Entry Known, Exit Unknown)',
    description:
      'Abhimanyu explicitly declares his tactical limitation: his father Arjuna taught him how to pierce and penetrate into the Chakravyūha, but he was never instructed on how to come out if danger overtakes him inside.',
    sourceReference: 'Droṇa Parva, Sec. XXXV: "My father taught me only how to enter this array. But if any danger should overtake me, I know not how to come out of it."',
    historicalStatus: 'source-attested'
  },
  {
    id: 'hist-04-pandava-pledge',
    source: 'Mahābhārata (KM Ganguli Translation)',
    parva: 'Droṇa Parva',
    episode: 'Abhimanyu-badha Parva',
    section: 'Section XXXV',
    character: 'Yudhiṣṭhira & Bhīma',
    event: 'Pledge to Follow and Protect Flanks',
    description:
      'Yudhishthira, Bhima, Satyaki, and Dhrishtadyumna pledge to follow in Abhimanyu\'s wake through the opening he creates, protecting his flanks and rear from being encircled.',
    sourceReference: 'Droṇa Parva, Sec. XXXV: "Break the mouth of this array for us... We will follow close behind thee, protecting thy rear and flanks on every side."',
    historicalStatus: 'source-attested'
  },
  {
    id: 'hist-05-entry-breach',
    source: 'Mahābhārata (KM Ganguli Translation)',
    parva: 'Droṇa Parva',
    episode: 'Abhimanyu-badha Parva',
    section: 'Section XXXVI',
    character: 'Abhimanyu & Sumitra',
    event: 'Vanguard Breach at the Outer Aperture',
    description:
      'Abhimanyu orders his charioteer Sumitra to urge his four brown horses forward. His chariot thunders into the outer perimeter of Drona\'s array, cutting down the Kaurava vanguard and piercing the formation.',
    sourceReference: 'Droṇa Parva, Sec. XXXVI: "Urged by Sumitra, those horses, fleet as the wind, rushed towards Drona\'s division, and Abhimanyu entered the array."',
    historicalStatus: 'source-attested'
  },
  {
    id: 'model-01-concentric-rings',
    source: 'CHAKRAFORGE Computational Specification',
    parva: 'N/A (Simulation Abstraction)',
    episode: 'Formation Geometry Model',
    section: 'Algorithm Spec 1.0',
    character: 'Simulation Engine',
    event: 'Concentric Ring & Dynamic Gate Discretization',
    description:
      'The ancient circular formation is mathematically reconstructed as concentric tactical rings with periodic gate rotation and dynamic aperture states. The text describes a complex circular array but does not provide exact metric dimensions or angular velocities.',
    sourceReference: 'CHAKRAFORGE Model Specification: Mathematical approximation of multi-echelon circular tactical array.',
    historicalStatus: 'computational-model'
  },
  {
    id: 'model-02-pomdp-information',
    source: 'CHAKRAFORGE Computational Specification',
    parva: 'N/A (Multi-Agent Theory)',
    episode: 'Information State Model',
    section: 'Algorithm Spec 2.0',
    character: 'Simulation Engine',
    event: 'Partially Observable Markov Decision Process (POMDP)',
    description:
      'Abhimanyu\'s strategic dilemma is modeled as decision-making under incomplete information. He possesses a forward transition model (inward penetration) but lacks an inverse transition model (exit navigation), constrained by a finite sensor horizon.',
    sourceReference: 'CHAKRAFORGE Model Specification: Multi-Agent POMDP with bounded horizon and asymmetric knowledge vectors.',
    historicalStatus: 'computational-model'
  },
  {
    id: 'hist-06-jayadratha-blockade',
    source: 'Mahābhārata (KM Ganguli Translation)',
    parva: 'Droṇa Parva',
    episode: 'Abhimanyu-badha Parva',
    section: 'Section XLII - XLIII',
    character: 'King Jayadratha',
    event: 'Jayadratha Invokes Shiva\'s Boon to Block Support',
    description:
      'King Jayadratha of Sindhu, armed with a boon granted by Lord Shiva to hold back all Pandavas except Arjuna for one single day, stations his chariot at the outer breach and single-handedly halts Yudhishthira, Bhima, Satyaki, and Dhrishtadyumna.',
    sourceReference: 'Droṇa Parva, Sec. XLII: "Jayadratha, relying on the boon of the Three-eyed deity, checked all the Pandava warriors striving to enter through the opening made by Abhimanyu."',
    historicalStatus: 'source-attested'
  },
  {
    id: 'model-03-comm-severance',
    source: 'CHAKRAFORGE Computational Specification',
    parva: 'N/A (Network Theory)',
    episode: 'Communication Network Model',
    section: 'Algorithm Spec 3.0',
    character: 'Simulation Engine',
    event: 'Dynamic Ad-Hoc Network Topology & Packet Drop',
    description:
      'The isolation of Abhimanyu is represented computationally as network partition. When Jayadratha seals the entrance, the communication graph disconnects, reducing delivery probability to 0% and severing Pandava multi-agent coordination.',
    sourceReference: 'CHAKRAFORGE Model Specification: Ad-hoc broadcast network with distance-decay and topological gate blocking.',
    historicalStatus: 'computational-model'
  },
  {
    id: 'hist-07-isolation-and-final-stand',
    source: 'Mahābhārata (KM Ganguli Translation)',
    parva: 'Droṇa Parva',
    episode: 'Abhimanyu-badha Parva',
    section: 'Section XLVII - XLVIII',
    character: 'Abhimanyu & Six Maharathis',
    event: 'Isolation, Unethical Surrounding, and Heroic Fall',
    description:
      'Isolated deep within the Kaurava formation, Abhimanyu battles six veteran Maharathas (Drona, Karna, Kripa, Ashwatthama, Brihadbala, and Duhshasana). Karna cuts his bow from behind; his horses and charioteer are killed; he fights with a chariot wheel until struck down by Duhshasana\'s son.',
    sourceReference: 'Droṇa Parva, Sec. XLVIII: "Surrounded by six car-warriors... having his bow severed by Karna from behind... he fought heroically with a chariot wheel."',
    historicalStatus: 'source-attested'
  },
  {
    id: 'counter-01-flank-exit',
    source: 'CHAKRAFORGE Counterfactual Study',
    parva: 'N/A (What-If Exploration)',
    episode: 'Alternative Strategic Analysis',
    section: 'Experiment Suite C',
    character: 'Abhimanyu (Counterfactual)',
    event: 'Counterfactual Flank Gate Egress with Exit Knowledge',
    description:
      'Computational simulation of an alternative scenario: Abhimanyu is equipped with 100% exit knowledge or maintains an active communication link with Pandava reconnaissance, navigating through an alternate flank gate to achieve successful egress.',
    sourceReference: 'CHAKRAFORGE Counterfactual Experiment: Evaluates path efficiency and survivability under asymmetric information removal.',
    historicalStatus: 'counterfactual'
  }
];
