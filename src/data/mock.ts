export const PORTS = [
  { id: 'P1', name: 'Paradip Port',  code: 'PDX', state: 'Odisha' },
  { id: 'P2', name: 'Vizag Port',    code: 'VIZ', state: 'Andhra Pradesh' },
  { id: 'P3', name: 'Haldia Port',   code: 'HLD', state: 'West Bengal' },
  { id: 'P4', name: 'Ennore Port',   code: 'ENR', state: 'Tamil Nadu' },
];

export const PLANTS = [
  { id: 'S1', name: 'Jamshedpur', code: 'JSR', state: 'Jharkhand' },
  { id: 'S2', name: 'Rourkela',   code: 'RKL', state: 'Odisha' },
  { id: 'S3', name: 'Bhilai',     code: 'BHL', state: 'Chhattisgarh' },
  { id: 'S4', name: 'Durgapur',   code: 'DGP', state: 'West Bengal' },
  { id: 'S5', name: 'Bokaro',     code: 'BKR', state: 'Jharkhand' },
];

export const GRADES = [
  { id: 'G1', name: 'Premium HCC', ash_pct: 9.5,  vm_pct: 21, gcv: 7200 },
  { id: 'G2', name: 'Std HCC',     ash_pct: 12.0, vm_pct: 24, gcv: 6800 },
  { id: 'G3', name: 'SSCC',        ash_pct: 17.0, vm_pct: 28, gcv: 6200 },
  { id: 'G4', name: 'PCI Coal',    ash_pct: 10.5, vm_pct: 20, gcv: 7000 },
];

export type VesselStatus = 'En Route' | 'At Berth' | 'Discharging' | 'Departed';
export type DemurrageRisk = 'Low' | 'Med' | 'High';

export interface Vessel {
  id: string; name: string; flag: string; portId: string;
  status: VesselStatus; eta: string; berthedAt?: string;
  grade: string; gradeId: string; tonnage_mt: number; discharged_mt: number;
  demurrage: DemurrageRisk; bol_mt: number; draft_survey_mt: number;
  batchId: string;
  waypoints: { time: string; loc: string; lat: number; lon: number }[];
}

export const VESSELS: Vessel[] = [
  {
    id: 'V001', name: 'MV Coral Star', flag: 'Panama', portId: 'P1',
    status: 'Discharging', eta: '2024-01-15', berthedAt: '2024-01-14 08:30',
    grade: 'Premium HCC', gradeId: 'G1', tonnage_mt: 68000, discharged_mt: 41200,
    demurrage: 'Low', bol_mt: 68000, draft_survey_mt: 67850,
    batchId: 'CLI-2024-P1-V001',
    waypoints: [
      { time: '2024-01-08 06:00', loc: 'Queensland, Australia', lat: -21.1, lon: 149.2 },
      { time: '2024-01-11 14:00', loc: 'Strait of Malacca',     lat: 3.5,   lon: 101.3 },
      { time: '2024-01-14 08:30', loc: 'Paradip Port',          lat: 20.27, lon: 86.70 },
    ],
  },
  {
    id: 'V002', name: 'MV Iron Pegasus', flag: 'Marshall Is.', portId: 'P2',
    status: 'At Berth', eta: '2024-01-15', berthedAt: '2024-01-15 02:15',
    grade: 'Std HCC', gradeId: 'G2', tonnage_mt: 55000, discharged_mt: 0,
    demurrage: 'Med', bol_mt: 55000, draft_survey_mt: 54780,
    batchId: 'CLI-2024-P2-V002',
    waypoints: [
      { time: '2024-01-07 00:00', loc: 'Mozambique Port',  lat: -25.0, lon: 33.1 },
      { time: '2024-01-12 12:00', loc: 'Sri Lanka Waters', lat: 7.8,   lon: 81.5 },
      { time: '2024-01-15 02:15', loc: 'Vizag Port',       lat: 17.69, lon: 83.28 },
    ],
  },
  {
    id: 'V003', name: 'MV Black Diamond', flag: 'Liberia', portId: 'P3',
    status: 'En Route', eta: '2024-01-18',
    grade: 'SSCC', gradeId: 'G3', tonnage_mt: 72000, discharged_mt: 0,
    demurrage: 'High', bol_mt: 72000, draft_survey_mt: 0,
    batchId: 'CLI-2024-P3-V003',
    waypoints: [
      { time: '2024-01-05 09:00', loc: 'South Africa',           lat: -33.9, lon: 18.4 },
      { time: '2024-01-13 20:00', loc: 'Gulf of Aden',           lat: 12.5,  lon: 50.0 },
      { time: '2024-01-18 10:00', loc: 'Haldia Port (ETA)',      lat: 22.03, lon: 88.07 },
    ],
  },
  {
    id: 'V004', name: 'MV Atlas Pioneer', flag: 'Greece', portId: 'P4',
    status: 'Discharging', eta: '2024-01-14', berthedAt: '2024-01-13 20:00',
    grade: 'PCI Coal', gradeId: 'G4', tonnage_mt: 60000, discharged_mt: 52000,
    demurrage: 'Low', bol_mt: 60000, draft_survey_mt: 59900,
    batchId: 'CLI-2024-P4-V004',
    waypoints: [
      { time: '2024-01-04 08:00', loc: 'Newcastle, Australia', lat: -32.9, lon: 151.7 },
      { time: '2024-01-10 16:00', loc: 'Bay of Bengal',        lat: 10.0,  lon: 85.0 },
      { time: '2024-01-13 20:00', loc: 'Ennore Port',          lat: 13.10, lon: 80.30 },
    ],
  },
  {
    id: 'V005', name: 'MV Pacific Crest', flag: 'Singapore', portId: 'P1',
    status: 'En Route', eta: '2024-01-20',
    grade: 'Std HCC', gradeId: 'G2', tonnage_mt: 65000, discharged_mt: 0,
    demurrage: 'Med', bol_mt: 65000, draft_survey_mt: 0,
    batchId: 'CLI-2024-P1-V005',
    waypoints: [
      { time: '2024-01-09 12:00', loc: 'Bowen, Australia',      lat: -20.0, lon: 148.2 },
      { time: '2024-01-15 06:00', loc: 'Arabian Sea',           lat: 8.0,   lon: 76.0 },
      { time: '2024-01-20 14:00', loc: 'Paradip Port (ETA)',    lat: 20.27, lon: 86.70 },
    ],
  },
  {
    id: 'V006', name: 'MV Siri Phoenix', flag: 'Norway', portId: 'P2',
    status: 'Departed', eta: '2024-01-10', berthedAt: '2024-01-09 07:00',
    grade: 'Premium HCC', gradeId: 'G1', tonnage_mt: 58000, discharged_mt: 58000,
    demurrage: 'Low', bol_mt: 58000, draft_survey_mt: 57920,
    batchId: 'CLI-2024-P2-V006',
    waypoints: [
      { time: '2024-01-03 00:00', loc: 'Hay Point, Australia', lat: -21.3, lon: 149.3 },
      { time: '2024-01-09 07:00', loc: 'Vizag Port',           lat: 17.69, lon: 83.28 },
      { time: '2024-01-11 06:00', loc: 'Departed',             lat: 15.0,  lon: 80.0 },
    ],
  },
  {
    id: 'V007', name: 'MV Orient Majesty', flag: 'Cyprus', portId: 'P3',
    status: 'At Berth', eta: '2024-01-16', berthedAt: '2024-01-16 01:00',
    grade: 'SSCC', gradeId: 'G3', tonnage_mt: 70000, discharged_mt: 18000,
    demurrage: 'Med', bol_mt: 70000, draft_survey_mt: 69840,
    batchId: 'CLI-2024-P3-V007',
    waypoints: [
      { time: '2024-01-07 06:00', loc: 'Richards Bay, SA', lat: -28.8, lon: 32.0 },
      { time: '2024-01-14 18:00', loc: 'Bay of Bengal',    lat: 14.0,  lon: 83.0 },
      { time: '2024-01-16 01:00', loc: 'Haldia Port',      lat: 22.03, lon: 88.07 },
    ],
  },
  {
    id: 'V008', name: 'MV Cape Arrow', flag: 'Bahamas', portId: 'P4',
    status: 'En Route', eta: '2024-01-22',
    grade: 'PCI Coal', gradeId: 'G4', tonnage_mt: 63000, discharged_mt: 0,
    demurrage: 'Low', bol_mt: 63000, draft_survey_mt: 0,
    batchId: 'CLI-2024-P4-V008',
    waypoints: [
      { time: '2024-01-10 00:00', loc: 'Gladstone, Australia', lat: -23.8, lon: 151.2 },
      { time: '2024-01-17 12:00', loc: 'Indian Ocean',         lat: 6.0,   lon: 72.0 },
      { time: '2024-01-22 08:00', loc: 'Ennore Port (ETA)',    lat: 13.10, lon: 80.30 },
    ],
  },
];

export type RakeStatus = 'Loading' | 'In Transit' | 'Delayed' | 'Received';

export interface Rake {
  id: string; rakeNo: string; originPortId: string; destPlantId: string;
  status: RakeStatus; scheduledEta: string; predictedEta: string;
  batchId: string; grade: string; wagons: number; load_mt: number;
  departedAt?: string; receivedAt?: string; currentLocation: string; progress: number;
}

export const RAKES: Rake[] = [
  { id: 'R01', rakeNo: 'BOXN-24-4521', originPortId: 'P1', destPlantId: 'S1', status: 'In Transit',  scheduledEta: '2024-01-16 18:00', predictedEta: '2024-01-16 18:00', batchId: 'CLI-2024-P1-V001', grade: 'Premium HCC', wagons: 58, load_mt: 3480, departedAt: '2024-01-15 10:00', currentLocation: 'Rourkela Junction', progress: 62 },
  { id: 'R02', rakeNo: 'BOXN-24-3812', originPortId: 'P1', destPlantId: 'S5', status: 'In Transit',  scheduledEta: '2024-01-17 06:00', predictedEta: '2024-01-17 06:00', batchId: 'CLI-2024-P1-V001', grade: 'Premium HCC', wagons: 58, load_mt: 3480, departedAt: '2024-01-15 14:00', currentLocation: 'Tatanagar Yard', progress: 48 },
  { id: 'R03', rakeNo: 'BOXN-24-5107', originPortId: 'P2', destPlantId: 'S3', status: 'Delayed',     scheduledEta: '2024-01-16 12:00', predictedEta: '2024-01-16 18:00', batchId: 'CLI-2024-P2-V006', grade: 'Premium HCC', wagons: 58, load_mt: 3480, departedAt: '2024-01-14 20:00', currentLocation: 'Nagpur Loco Change', progress: 55 },
  { id: 'R04', rakeNo: 'BOXN-24-2298', originPortId: 'P4', destPlantId: 'S1', status: 'In Transit',  scheduledEta: '2024-01-17 14:00', predictedEta: '2024-01-17 20:00', batchId: 'CLI-2024-P4-V004', grade: 'PCI Coal',    wagons: 60, load_mt: 3600, departedAt: '2024-01-15 08:00', currentLocation: 'Vijayawada Junction', progress: 38 },
  { id: 'R05', rakeNo: 'BOXN-24-6614', originPortId: 'P4', destPlantId: 'S2', status: 'Received',    scheduledEta: '2024-01-14 10:00', predictedEta: '2024-01-14 10:00', batchId: 'CLI-2024-P4-V004', grade: 'PCI Coal',    wagons: 60, load_mt: 3600, departedAt: '2024-01-12 06:00', receivedAt: '2024-01-14 09:45', currentLocation: 'Rourkela Steel Plant', progress: 100 },
  { id: 'R06', rakeNo: 'BOXN-24-1187', originPortId: 'P3', destPlantId: 'S4', status: 'Loading',     scheduledEta: '2024-01-19 08:00', predictedEta: '2024-01-19 08:00', batchId: 'CLI-2024-P3-V007', grade: 'SSCC',        wagons: 58, load_mt: 3480, currentLocation: 'Haldia Marshalling Yard', progress: 5 },
  { id: 'R07', rakeNo: 'BOXN-24-3345', originPortId: 'P3', destPlantId: 'S5', status: 'Loading',     scheduledEta: '2024-01-20 10:00', predictedEta: '2024-01-20 10:00', batchId: 'CLI-2024-P3-V007', grade: 'SSCC',        wagons: 58, load_mt: 3480, currentLocation: 'Haldia Marshalling Yard', progress: 0 },
  { id: 'R08', rakeNo: 'BOXN-24-7789', originPortId: 'P2', destPlantId: 'S1', status: 'Delayed',     scheduledEta: '2024-01-15 22:00', predictedEta: '2024-01-16 06:00', batchId: 'CLI-2024-P2-V006', grade: 'Premium HCC', wagons: 58, load_mt: 3480, departedAt: '2024-01-13 18:00', currentLocation: 'Sambalpur (Signal Failure)', progress: 80 },
  { id: 'R09', rakeNo: 'BOXN-24-4490', originPortId: 'P1', destPlantId: 'S2', status: 'In Transit',  scheduledEta: '2024-01-16 22:00', predictedEta: '2024-01-16 22:00', batchId: 'CLI-2024-P1-V001', grade: 'Premium HCC', wagons: 58, load_mt: 3480, departedAt: '2024-01-15 16:00', currentLocation: 'Khurda Road', progress: 30 },
  { id: 'R10', rakeNo: 'BOXN-24-9012', originPortId: 'P4', destPlantId: 'S3', status: 'In Transit',  scheduledEta: '2024-01-18 16:00', predictedEta: '2024-01-18 16:00', batchId: 'CLI-2024-P4-V004', grade: 'PCI Coal',    wagons: 60, load_mt: 3600, departedAt: '2024-01-15 22:00', currentLocation: 'Waltair Division', progress: 22 },
];

export interface StockyardGrade {
  gradeId: string; grade: string; manual_mt: number; lidar_mt: number; target_mt: number; lastScan: string;
}
export interface StockyardZone {
  id: string; plantId: string; plant: string; totalArea_sqm: number; utilization_pct: number;
  grades: StockyardGrade[];
  scanHistory: { time: string; method: string; total_mt: number; variance_pct: number }[];
}

export const STOCKYARDS: StockyardZone[] = [
  { id: 'SY-S1', plantId: 'S1', plant: 'Jamshedpur', totalArea_sqm: 85000, utilization_pct: 71,
    grades: [
      { gradeId: 'G1', grade: 'Premium HCC', manual_mt: 48200, lidar_mt: 47800, target_mt: 50000, lastScan: '2024-01-15 06:00' },
      { gradeId: 'G2', grade: 'Std HCC',     manual_mt: 31500, lidar_mt: 31200, target_mt: 35000, lastScan: '2024-01-15 06:00' },
      { gradeId: 'G4', grade: 'PCI Coal',    manual_mt: 18800, lidar_mt: 18650, target_mt: 20000, lastScan: '2024-01-15 06:00' },
    ],
    scanHistory: [
      { time: '2024-01-15 06:00', method: 'LiDAR Drone', total_mt: 97650, variance_pct: 0.8 },
      { time: '2024-01-14 06:00', method: 'LiDAR Drone', total_mt: 99200, variance_pct: 1.1 },
      { time: '2024-01-13 06:00', method: 'Manual Tape', total_mt: 101000, variance_pct: 8.2 },
      { time: '2024-01-12 06:00', method: 'LiDAR Drone', total_mt: 98400, variance_pct: 1.4 },
    ],
  },
  { id: 'SY-S2', plantId: 'S2', plant: 'Rourkela', totalArea_sqm: 68000, utilization_pct: 64,
    grades: [
      { gradeId: 'G3', grade: 'SSCC',     manual_mt: 28900, lidar_mt: 28600, target_mt: 30000, lastScan: '2024-01-15 07:00' },
      { gradeId: 'G4', grade: 'PCI Coal', manual_mt: 14600, lidar_mt: 14750, target_mt: 18000, lastScan: '2024-01-15 07:00' },
    ],
    scanHistory: [
      { time: '2024-01-15 07:00', method: 'LiDAR Drone', total_mt: 43350, variance_pct: 0.7 },
      { time: '2024-01-14 07:00', method: 'LiDAR Drone', total_mt: 44100, variance_pct: 0.9 },
      { time: '2024-01-13 07:00', method: 'Manual Tape', total_mt: 45800, variance_pct: 11.4 },
    ],
  },
  { id: 'SY-S3', plantId: 'S3', plant: 'Bhilai', totalArea_sqm: 72000, utilization_pct: 58,
    grades: [
      { gradeId: 'G1', grade: 'Premium HCC', manual_mt: 22100, lidar_mt: 21900, target_mt: 25000, lastScan: '2024-01-15 05:30' },
      { gradeId: 'G3', grade: 'SSCC',        manual_mt: 19500, lidar_mt: 19200, target_mt: 22000, lastScan: '2024-01-15 05:30' },
    ],
    scanHistory: [
      { time: '2024-01-15 05:30', method: 'LiDAR Drone', total_mt: 41100, variance_pct: 1.2 },
      { time: '2024-01-14 05:30', method: 'LiDAR Drone', total_mt: 40800, variance_pct: 1.0 },
      { time: '2024-01-13 05:30', method: 'Manual Tape', total_mt: 43500, variance_pct: 9.8 },
    ],
  },
  { id: 'SY-S4', plantId: 'S4', plant: 'Durgapur', totalArea_sqm: 45000, utilization_pct: 49,
    grades: [
      { gradeId: 'G2', grade: 'Std HCC', manual_mt: 12400, lidar_mt: 12200, target_mt: 15000, lastScan: '2024-01-15 06:30' },
      { gradeId: 'G3', grade: 'SSCC',    manual_mt: 9800,  lidar_mt: 9650,  target_mt: 12000, lastScan: '2024-01-15 06:30' },
    ],
    scanHistory: [
      { time: '2024-01-15 06:30', method: 'LiDAR Drone', total_mt: 21850, variance_pct: 1.3 },
      { time: '2024-01-14 06:30', method: 'LiDAR Drone', total_mt: 22400, variance_pct: 0.8 },
      { time: '2024-01-13 06:30', method: 'Manual Tape', total_mt: 23600, variance_pct: 12.1 },
    ],
  },
  { id: 'SY-S5', plantId: 'S5', plant: 'Bokaro', totalArea_sqm: 58000, utilization_pct: 66,
    grades: [
      { gradeId: 'G1', grade: 'Premium HCC', manual_mt: 24800, lidar_mt: 24600, target_mt: 28000, lastScan: '2024-01-15 07:30' },
      { gradeId: 'G4', grade: 'PCI Coal',    manual_mt: 13700, lidar_mt: 13500, target_mt: 14000, lastScan: '2024-01-15 07:30' },
    ],
    scanHistory: [
      { time: '2024-01-15 07:30', method: 'LiDAR Drone', total_mt: 38100, variance_pct: 0.9 },
      { time: '2024-01-14 07:30', method: 'LiDAR Drone', total_mt: 39200, variance_pct: 1.1 },
      { time: '2024-01-13 07:30', method: 'Manual Tape', total_mt: 41000, variance_pct: 10.3 },
    ],
  },
];

export type SprinklerStatus = 'Idle' | 'Active' | 'Manual Override';

export interface DustZone {
  id: string; plantId: string; plant: string; zone: string;
  pm25: number; pm10: number; windSpeed: number; windDir: string;
  sprinkler: SprinklerStatus; pm25Threshold: number;
  lastActivated?: string; lastActivationReason?: string; manualOverride: boolean;
}

export const DUST_ZONES: DustZone[] = [
  { id: 'DZ-S1-A', plantId: 'S1', plant: 'Jamshedpur', zone: 'Zone A – Unloading Bay',      pm25: 148, pm10: 310, windSpeed: 4.2, windDir: 'NE', sprinkler: 'Active',          pm25Threshold: 120, lastActivated: '14:22', lastActivationReason: 'PM2.5 threshold breach', manualOverride: false },
  { id: 'DZ-S1-B', plantId: 'S1', plant: 'Jamshedpur', zone: 'Zone B – Storage Pile 1',     pm25: 88,  pm10: 180, windSpeed: 3.1, windDir: 'N',  sprinkler: 'Idle',            pm25Threshold: 120, manualOverride: false },
  { id: 'DZ-S1-C', plantId: 'S1', plant: 'Jamshedpur', zone: 'Zone C – Transfer Conveyor',  pm25: 132, pm10: 265, windSpeed: 5.8, windDir: 'NW', sprinkler: 'Active',          pm25Threshold: 120, lastActivated: '13:47', lastActivationReason: 'PM2.5 threshold breach', manualOverride: false },
  { id: 'DZ-S2-A', plantId: 'S2', plant: 'Rourkela',   zone: 'Zone A – Coal Handling',      pm25: 95,  pm10: 195, windSpeed: 2.9, windDir: 'SW', sprinkler: 'Idle',            pm25Threshold: 120, manualOverride: false },
  { id: 'DZ-S2-B', plantId: 'S2', plant: 'Rourkela',   zone: 'Zone B – Stockpile South',    pm25: 72,  pm10: 148, windSpeed: 1.8, windDir: 'S',  sprinkler: 'Idle',            pm25Threshold: 120, manualOverride: false },
  { id: 'DZ-S3-A', plantId: 'S3', plant: 'Bhilai',     zone: 'Zone A – Main Yard',          pm25: 162, pm10: 340, windSpeed: 6.2, windDir: 'W',  sprinkler: 'Active',          pm25Threshold: 120, lastActivated: '12:15', lastActivationReason: 'PM2.5 threshold breach', manualOverride: false },
  { id: 'DZ-S3-B', plantId: 'S3', plant: 'Bhilai',     zone: 'Zone B – Conveyor Road',      pm25: 104, pm10: 215, windSpeed: 4.5, windDir: 'NW', sprinkler: 'Manual Override', pm25Threshold: 120, lastActivated: '11:00', lastActivationReason: 'Manual override – maintenance', manualOverride: true },
  { id: 'DZ-S4-A', plantId: 'S4', plant: 'Durgapur',   zone: 'Zone A – Storage',            pm25: 68,  pm10: 140, windSpeed: 2.2, windDir: 'E',  sprinkler: 'Idle',            pm25Threshold: 120, manualOverride: false },
  { id: 'DZ-S5-A', plantId: 'S5', plant: 'Bokaro',     zone: 'Zone A – Unloading',          pm25: 115, pm10: 235, windSpeed: 3.8, windDir: 'NE', sprinkler: 'Idle',            pm25Threshold: 120, manualOverride: false },
  { id: 'DZ-S5-B', plantId: 'S5', plant: 'Bokaro',     zone: 'Zone B – Blending Bay',       pm25: 88,  pm10: 178, windSpeed: 2.5, windDir: 'N',  sprinkler: 'Idle',            pm25Threshold: 120, manualOverride: false },
];

export interface BatchNode {
  stage: string; id: string; description: string; timestamp: string;
  status: 'complete' | 'active' | 'pending'; moduleLink: string; linkedId: string;
  quantity_mt?: number; location?: string;
}
export interface Batch {
  id: string; vesselId: string; rakeId?: string; grade: string; gradeId: string;
  origin_port: string; dest_plant?: string; total_mt: number;
  status: 'Active' | 'In Transit' | 'Received' | 'Charged'; createdAt: string;
  nodes: BatchNode[];
}

export const BATCHES: Batch[] = [
  { id: 'CLI-2024-P1-V001', vesselId: 'V001', rakeId: 'R01', grade: 'Premium HCC', gradeId: 'G1', origin_port: 'Paradip', dest_plant: 'Jamshedpur', total_mt: 68000, status: 'In Transit', createdAt: '2024-01-14 08:30',
    nodes: [
      { stage: 'Vessel',         id: 'V001', description: 'MV Coral Star – 68,000 MT loaded',          timestamp: '2024-01-08 06:00', status: 'complete', moduleLink: '/vessels/V001', linkedId: 'V001', quantity_mt: 68000, location: 'Queensland, AU' },
      { stage: 'Port Receipt',   id: 'P1',   description: 'Paradip – 41,200 MT discharged',            timestamp: '2024-01-14 08:30', status: 'active',   moduleLink: '/vessels/V001', linkedId: 'V001', quantity_mt: 41200, location: 'Paradip Port' },
      { stage: 'Rail Movement',  id: 'R01',  description: 'BOXN-24-4521 – In transit, 3,480 MT',       timestamp: '2024-01-15 10:00', status: 'active',   moduleLink: '/rail/R01',     linkedId: 'R01',  quantity_mt: 3480,  location: 'Rourkela Junction' },
      { stage: 'Stockyard',      id: 'SY-S1',description: 'Jamshedpur – Pending intake',               timestamp: '',                status: 'pending',  moduleLink: '/stockyard',    linkedId: 'SY-S1' },
      { stage: 'Furnace Charge', id: '',     description: 'Blast Furnace #2 – Pending',                timestamp: '',                status: 'pending',  moduleLink: '/batch',        linkedId: '' },
    ],
  },
  { id: 'CLI-2024-P2-V006', vesselId: 'V006', rakeId: 'R03', grade: 'Premium HCC', gradeId: 'G1', origin_port: 'Vizag', dest_plant: 'Bhilai', total_mt: 58000, status: 'In Transit', createdAt: '2024-01-09 07:00',
    nodes: [
      { stage: 'Vessel',         id: 'V006', description: 'MV Siri Phoenix – 58,000 MT',              timestamp: '2024-01-03 00:00', status: 'complete', moduleLink: '/vessels/V006', linkedId: 'V006', quantity_mt: 58000, location: 'Hay Point, AU' },
      { stage: 'Port Receipt',   id: 'P2',   description: 'Vizag – Full discharge complete',          timestamp: '2024-01-09 07:00', status: 'complete', moduleLink: '/vessels/V006', linkedId: 'V006', quantity_mt: 58000, location: 'Vizag Port' },
      { stage: 'Rail Movement',  id: 'R03',  description: 'BOXN-24-5107 – Delayed at Nagpur',         timestamp: '2024-01-14 20:00', status: 'active',   moduleLink: '/rail/R03',     linkedId: 'R03',  quantity_mt: 3480,  location: 'Nagpur' },
      { stage: 'Stockyard',      id: 'SY-S3',description: 'Bhilai – Pending intake',                  timestamp: '',                status: 'pending',  moduleLink: '/stockyard',    linkedId: 'SY-S3' },
      { stage: 'Furnace Charge', id: '',     description: 'Blast Furnace #1 – Pending',               timestamp: '',                status: 'pending',  moduleLink: '/batch',        linkedId: '' },
    ],
  },
  { id: 'CLI-2024-P4-V004', vesselId: 'V004', rakeId: 'R05', grade: 'PCI Coal', gradeId: 'G4', origin_port: 'Ennore', dest_plant: 'Rourkela', total_mt: 60000, status: 'Received', createdAt: '2024-01-13 20:00',
    nodes: [
      { stage: 'Vessel',         id: 'V004', description: 'MV Atlas Pioneer – 60,000 MT',             timestamp: '2024-01-04 08:00', status: 'complete', moduleLink: '/vessels/V004', linkedId: 'V004', quantity_mt: 60000, location: 'Newcastle, AU' },
      { stage: 'Port Receipt',   id: 'P4',   description: 'Ennore – 52,000 MT discharged',            timestamp: '2024-01-13 20:00', status: 'active',   moduleLink: '/vessels/V004', linkedId: 'V004', quantity_mt: 52000, location: 'Ennore Port' },
      { stage: 'Rail Movement',  id: 'R05',  description: 'BOXN-24-6614 – Received at Rourkela',      timestamp: '2024-01-14 09:45', status: 'complete', moduleLink: '/rail/R05',     linkedId: 'R05',  quantity_mt: 3600,  location: 'Rourkela' },
      { stage: 'Stockyard',      id: 'SY-S2',description: 'Rourkela – 3,600 MT inducted',             timestamp: '2024-01-14 12:00', status: 'complete', moduleLink: '/stockyard',    linkedId: 'SY-S2', quantity_mt: 3600 },
      { stage: 'Furnace Charge', id: '',     description: 'BF #3 – Scheduled 2024-01-18',             timestamp: '2024-01-18 06:00', status: 'pending',  moduleLink: '/batch',        linkedId: '' },
    ],
  },
  { id: 'CLI-2024-P3-V007', vesselId: 'V007', rakeId: 'R06', grade: 'SSCC', gradeId: 'G3', origin_port: 'Haldia', dest_plant: 'Durgapur', total_mt: 70000, status: 'Active', createdAt: '2024-01-16 01:00',
    nodes: [
      { stage: 'Vessel',         id: 'V007', description: 'MV Orient Majesty – discharging',          timestamp: '2024-01-07 06:00', status: 'complete', moduleLink: '/vessels/V007', linkedId: 'V007', quantity_mt: 70000, location: 'Richards Bay, SA' },
      { stage: 'Port Receipt',   id: 'P3',   description: 'Haldia – 18,000 MT so far',                timestamp: '2024-01-16 01:00', status: 'active',   moduleLink: '/vessels/V007', linkedId: 'V007', quantity_mt: 18000, location: 'Haldia Port' },
      { stage: 'Rail Movement',  id: 'R06',  description: 'BOXN-24-1187 – Loading at Haldia',         timestamp: '2024-01-16 08:00', status: 'active',   moduleLink: '/rail/R06',     linkedId: 'R06',  quantity_mt: 3480,  location: 'Haldia Yard' },
      { stage: 'Stockyard',      id: 'SY-S4',description: 'Durgapur – Pending',                       timestamp: '',                status: 'pending',  moduleLink: '/stockyard',    linkedId: 'SY-S4' },
      { stage: 'Furnace Charge', id: '',     description: 'Pending',                                  timestamp: '',                status: 'pending',  moduleLink: '/batch',        linkedId: '' },
    ],
  },
  { id: 'CLI-2024-P2-V002', vesselId: 'V002', grade: 'Std HCC', gradeId: 'G2', origin_port: 'Vizag', total_mt: 55000, status: 'Active', createdAt: '2024-01-15 02:15',
    nodes: [
      { stage: 'Vessel',         id: 'V002', description: 'MV Iron Pegasus – at berth',               timestamp: '2024-01-07 00:00', status: 'complete', moduleLink: '/vessels/V002', linkedId: 'V002', quantity_mt: 55000, location: 'Mozambique' },
      { stage: 'Port Receipt',   id: 'P2',   description: 'Vizag – Awaiting discharge start',         timestamp: '2024-01-15 02:15', status: 'active',   moduleLink: '/vessels/V002', linkedId: 'V002', location: 'Vizag Port' },
      { stage: 'Rail Movement',  id: '',     description: 'Rake not yet allocated',                   timestamp: '',                status: 'pending',  moduleLink: '/rail',         linkedId: '' },
      { stage: 'Stockyard',      id: '',     description: 'Pending',                                  timestamp: '',                status: 'pending',  moduleLink: '/stockyard',    linkedId: '' },
      { stage: 'Furnace Charge', id: '',     description: 'Pending',                                  timestamp: '',                status: 'pending',  moduleLink: '/batch',        linkedId: '' },
    ],
  },
];

export const ALERTS = [
  { id: 'A001', severity: 'warning'  as const, message: 'Rake BOXN-24-5107 delay: Port 2 → Plant 3, ETA +6h',               time: '14:22', module: 'rail' },
  { id: 'A002', severity: 'critical' as const, message: 'PM2.5 breach — Bhilai Zone A: 162 µg/m³ (limit 120)',              time: '14:18', module: 'dust' },
  { id: 'A003', severity: 'warning'  as const, message: 'MV Black Diamond: draft survey pending, berth in 3 days',           time: '13:55', module: 'vessels' },
  { id: 'A004', severity: 'info'     as const, message: 'Optimizer last run: 13:00 — plan valid for 12h',                    time: '13:00', module: 'optimizer' },
  { id: 'A005', severity: 'warning'  as const, message: 'Rourkela PCI Coal at 82% of target — replenishment due',            time: '12:40', module: 'stockyard' },
  { id: 'A006', severity: 'info'     as const, message: 'Rake BOXN-24-6614 dispatch–receipt auto-matched: Ennore → Rourkela',time: '12:15', module: 'rail' },
  { id: 'A007', severity: 'warning'  as const, message: 'MV Iron Pegasus at berth — discharge not started, demurrage rising', time: '11:45', module: 'vessels' },
];

export const WEEKLY_COST_DATA = [
  { week: 'W1', manual: 4850, ai: 4210, savings: 640 },
  { week: 'W2', manual: 5020, ai: 4280, savings: 740 },
  { week: 'W3', manual: 4780, ai: 4150, savings: 630 },
  { week: 'W4', manual: 5200, ai: 4380, savings: 820 },
  { week: 'W5', manual: 4920, ai: 4180, savings: 740 },
  { week: 'W6', manual: 5100, ai: 4250, savings: 850 },
  { week: 'W7', manual: 4880, ai: 4120, savings: 760 },
  { week: 'W8', manual: 5050, ai: 4190, savings: 860 },
];

export const VARIANCE_TREND = [
  { week: 'W1', manual: 9.8,  lidar: 1.4 },
  { week: 'W2', manual: 10.2, lidar: 1.2 },
  { week: 'W3', manual: 11.4, lidar: 1.5 },
  { week: 'W4', manual: 9.6,  lidar: 0.9 },
  { week: 'W5', manual: 10.8, lidar: 1.1 },
  { week: 'W6', manual: 10.1, lidar: 1.3 },
  { week: 'W7', manual: 9.4,  lidar: 1.0 },
  { week: 'W8', manual: 10.5, lidar: 1.2 },
];

export const WATER_USAGE = [
  { week: 'W1', fixed: 8400, smart: 5100 },
  { week: 'W2', fixed: 8400, smart: 4800 },
  { week: 'W3', fixed: 8400, smart: 5400 },
  { week: 'W4', fixed: 8400, smart: 4600 },
  { week: 'W5', fixed: 8400, smart: 5200 },
  { week: 'W6', fixed: 8400, smart: 4900 },
  { week: 'W7', fixed: 8400, smart: 4700 },
  { week: 'W8', fixed: 8400, smart: 5000 },
];
