import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  borderColor?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', borderColor, hover = false }: Props) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 ${
        borderColor ? `border-l-4 ${borderColor}` : ''
      } ${hover ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
