/**
 * CHAKRAFORGE Formation Configuration: Single Source of Truth
 * 
 * Formalizes the mathematical geometry, echelon hierarchy, troop density distributions,
 * and tactical commanders of the computational Chakravyūha model.
 */

export type CohortMilitaryType = 'SWORDSMAN' | 'ARCHER' | 'ELEPHANT' | 'CHARIOT' | 'CAVALRY' | 'COMMAND';

export interface LayerConfig {
  tierIndex: number;
  name: string;
  devanagari: string;
  role: string;
  unitType: CohortMilitaryType;
  radiusMultiplier: number; // radius = baseRadius + tierIndex * ringSpacing
  baseWarriorCount: number;
  primaryColor: string;
  bannerColor: string;
  cohortSpacing: number;
  commanders: string[];
  historicalDescription: string;
}

export interface FormationMasterConfig {
  baseRadius: number;
  ringSpacing: number;
  ringThickness: number;
  outerApproachDistance: number;
  layers: Record<number, LayerConfig>;
  cardinalApertures: {
    northBreachAngle: number;
    southFlankAngle: number;
    eastFlankAngle: number;
    westFlankAngle: number;
  };
}

export const FORMATION_CONFIG: FormationMasterConfig = {
  baseRadius: 3.5,
  ringSpacing: 3.2,
  ringThickness: 0.6,
  outerApproachDistance: 6.0,
  cardinalApertures: {
    northBreachAngle: Math.PI / 2,   // 90 deg (North entrance)
    southFlankAngle: -Math.PI / 2,  // 270 deg (South flank exit)
    eastFlankAngle: 0,              // 0 deg (East flank exit)
    westFlankAngle: Math.PI         // 180 deg (West flank exit)
  },
  layers: {
    1: {
      tierIndex: 1,
      name: 'Central Command Position',
      devanagari: '१. केन्द्र-व्यूह',
      role: 'Kaurava War Council & Supreme Command Pavilion',
      unitType: 'COMMAND',
      radiusMultiplier: 1.0,
      baseWarriorCount: 500,
      primaryColor: '#d4af37',
      bannerColor: '#b85d19',
      cohortSpacing: 3.0,
      commanders: ['Guru Droṇācārya', 'King Duryodhana'],
      historicalDescription: 'The innermost core of the Padma/Chakra array where Drona and Duryodhana coordinate overall army maneuvers.'
    },
    2: {
      tierIndex: 2,
      name: 'Maharathi Guard Echelon',
      devanagari: '२. महारथ-वलय',
      role: 'Elite Chariot Knights & Veteran Champions',
      unitType: 'CHARIOT',
      radiusMultiplier: 2.0,
      baseWarriorCount: 650,
      primaryColor: '#8a5d3b',
      bannerColor: '#8b261d',
      cohortSpacing: 2.8,
      commanders: ['Karṇa', 'Aśvatthāman', 'Duḥśāsana'],
      historicalDescription: 'High-tier car-warriors stationed to defend the supreme commander and intercept deep breaches.'
    },
    3: {
      tierIndex: 3,
      name: 'Bowmen Division (Drona Phalanx)',
      devanagari: '३. कार्मुक-व्यूह',
      role: 'Concentrated Missile Volley & Area Denial',
      unitType: 'ARCHER',
      radiusMultiplier: 3.0,
      baseWarriorCount: 800,
      primaryColor: '#6e4726',
      bannerColor: '#a67c4e',
      cohortSpacing: 1.4,
      commanders: ['Kṛpācārya'],
      historicalDescription: 'Deep archery formations laying down sustained arrow barrages across the inner corridors.'
    },
    4: {
      tierIndex: 4,
      name: 'Elephant Corps (Gajasena)',
      devanagari: '४. गज-सेना',
      role: 'Heavy Shock Defense & Gate Guard Impasse',
      unitType: 'ELEPHANT',
      radiusMultiplier: 4.0,
      baseWarriorCount: 950,
      primaryColor: '#3d3733',
      bannerColor: '#7a2838',
      cohortSpacing: 3.6,
      commanders: ['King of Trigarta'],
      historicalDescription: 'Armored war elephants with howdahs and lance-bearers forming mobile bulwarks along the mid-rings.'
    },
    5: {
      tierIndex: 5,
      name: 'Chariot Division (Rathasena)',
      devanagari: '५. रथ-व्यूह',
      role: 'Rapid Flank Interception & Corridor Patrols',
      unitType: 'CHARIOT',
      radiusMultiplier: 5.0,
      baseWarriorCount: 1100,
      primaryColor: '#52341e',
      bannerColor: '#965228',
      cohortSpacing: 2.8,
      commanders: ['Śalya'],
      historicalDescription: 'Squadrons of two-wheeled war chariots patrolling intermediate annular corridors.'
    },
    6: {
      tierIndex: 6,
      name: 'Cavalry Division (Ashvasena)',
      devanagari: '६. अश्व-सेना',
      role: 'Fast Mounted Harassment & Envelope Maneuver',
      unitType: 'CAVALRY',
      radiusMultiplier: 6.0,
      baseWarriorCount: 1250,
      primaryColor: '#452a17',
      bannerColor: '#803820',
      cohortSpacing: 2.0,
      commanders: ['Śakuni'],
      historicalDescription: 'Mounted horsemen with lances screening the outer defensive sectors.'
    },
    7: {
      tierIndex: 7,
      name: 'Sword & Shield Infantry (Padati Vanguard)',
      devanagari: '७. बहिर्-वलय',
      role: 'Perimeter Defense & Aperture Chokepoint',
      unitType: 'SWORDSMAN',
      radiusMultiplier: 7.0,
      baseWarriorCount: 1400,
      primaryColor: '#3d2514',
      bannerColor: '#6e2b1b',
      cohortSpacing: 1.25,
      commanders: ['King Jayadratha'],
      historicalDescription: 'Dense phalanxes of foot soldiers with buckler shields holding the outer perimeter and the North breach gate.'
    }
  }
};
