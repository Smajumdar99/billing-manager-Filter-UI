import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link
        to="/"
        className="overflow-hidden text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1"
      >
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link
              to={item.href}
              className="overflow-hidden text-sm font-medium text-muted-foreground hover:text-foreground ml-1"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-sm font-medium ml-1">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}; 