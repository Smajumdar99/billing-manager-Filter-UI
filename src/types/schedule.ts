export interface ColorScheme {
  icon?: any; // Icon component from heroicons
  label?: string;
  colors?: string[];
  iconColor?: string;
  eventColors: {
    individual: { bg: string; border: string; text: string };
    group: { bg: string; border: string; text: string };
    crisis: { bg: string; border: string; text: string };
  };
} 