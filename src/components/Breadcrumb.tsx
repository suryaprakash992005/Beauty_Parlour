import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Accessible breadcrumb nav with JSON-LD structured data attributes.
 * Renders a home link + supplied items, last item is current page (no link).
 */
export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`breadcrumb ${className}`}
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      <ol className="breadcrumb__list">
        {/* Home */}
        <li
          className="breadcrumb__item"
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
        >
          <Link
            to="/"
            className="breadcrumb__link"
            aria-label="Home"
            itemProp="item"
          >
            <Home size={12} aria-hidden="true" />
            <span itemProp="name" className="breadcrumb__home-label">Home</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>

        {items.map((item, index) => (
          <li
            key={item.label}
            className="breadcrumb__item"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <ChevronRight size={12} className="breadcrumb__sep" aria-hidden="true" />
            {item.to ? (
              <Link to={item.to} className="breadcrumb__link" itemProp="item">
                <span itemProp="name">{item.label}</span>
              </Link>
            ) : (
              <span
                className="breadcrumb__current"
                aria-current="page"
                itemProp="name"
              >
                {item.label}
              </span>
            )}
            <meta itemProp="position" content={String(index + 2)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}
