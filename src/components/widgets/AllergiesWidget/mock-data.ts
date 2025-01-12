export interface Allergy {
  id: string;
  allergen: string;
  type: 'medication' | 'food' | 'environmental';
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string[];
  status: 'active' | 'inactive';
  onsetDate: string;
  lastUpdated: string;
  updatedBy: string;
  notes?: string;
}

export const mockAllergies: Allergy[] = [
  {
    id: '1',
    allergen: 'Penicillin',
    type: 'medication',
    severity: 'severe',
    reaction: ['Anaphylaxis', 'Hives'],
    status: 'active',
    onsetDate: '2015-03-15',
    lastUpdated: '2024-01-10T09:30:00Z',
    updatedBy: 'Dr. Sarah Chen',
    notes: 'Avoid all penicillin-based antibiotics'
  },
  {
    id: '2',
    allergen: 'Peanuts',
    type: 'food',
    severity: 'moderate',
    reaction: ['Swelling', 'Difficulty breathing'],
    status: 'active',
    onsetDate: '2010-06-20',
    lastUpdated: '2024-01-09T14:20:00Z',
    updatedBy: 'Dr. James Wilson'
  },
  {
    id: '3',
    allergen: 'Pollen',
    type: 'environmental',
    severity: 'mild',
    reaction: ['Sneezing', 'Runny nose', 'Itchy eyes'],
    status: 'active',
    onsetDate: '2018-08-10',
    lastUpdated: '2023-12-15T11:45:00Z',
    updatedBy: 'Dr. Michael Lee',
    notes: 'Seasonal - worse in spring'
  }
]; 