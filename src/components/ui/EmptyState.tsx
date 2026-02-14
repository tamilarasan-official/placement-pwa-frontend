import { type ReactNode } from 'react';
import { IconType } from 'react-icons';

interface Props {
  icon: IconType;
  title: string;
  description?: string;
  action?: ReactNode;
  color?: 'gray' | 'blue' | 'yellow' | 'green' | 'red';
}

const colorMap = {
  gray: 'bg-gray-100 text-gray-400',
  blue: 'bg-blue-100 text-blue-400',
  yellow: 'bg-yellow-100 text-yellow-400',
  green: 'bg-green-100 text-green-400',
  red: 'bg-red-100 text-red-400',
};

export default function EmptyState({ icon: Icon, title, description, action, color = 'gray' }: Props) {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center py-16 px-4">
      <div className={`p-4 rounded-full ${colorMap[color]} mb-4`}>
        <Icon className="h-10 w-10" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mt-1 text-center max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
