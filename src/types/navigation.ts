export interface NavItem {
  title: string;
  path: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

export interface NavSection {
  title?: string;
  items: NavItem[];
} 