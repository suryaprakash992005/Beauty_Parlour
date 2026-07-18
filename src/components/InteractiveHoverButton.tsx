import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './InteractiveHoverButton.css';

interface InteractiveHoverButtonProps {
  children: React.ReactNode;
  to?: string;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function InteractiveHoverButton({
  children,
  to,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  ...props
}: InteractiveHoverButtonProps) {
  const content = (
    <>
      <div className="interactive-hover-btn__visible">
        <div className="interactive-hover-btn__dot"></div>
        <span className="interactive-hover-btn__text">{children}</span>
      </div>
      <div className="interactive-hover-btn__hidden">
        <span>{children}</span>
        <ArrowRight size={16} />
      </div>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={`interactive-hover-btn ${className}`}
        {...(props as any)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={`interactive-hover-btn ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {content}
    </button>
  );
}
