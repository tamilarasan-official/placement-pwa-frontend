import { IconType } from 'react-icons';

interface Props {
  label: string;
  value: number | string;
  icon: IconType;
  color: 'blue' | 'indigo' | 'purple' | 'green' | 'yellow' | 'red';
}

const colorStyles = {
  blue:   { bg: 'from-blue-50 to-white',   iconBg: 'bg-blue-100',   iconText: 'text-blue-600' },
  indigo: { bg: 'from-indigo-50 to-white',  iconBg: 'bg-indigo-100', iconText: 'text-indigo-600' },
  purple: { bg: 'from-purple-50 to-white',  iconBg: 'bg-purple-100', iconText: 'text-purple-600' },
  green:  { bg: 'from-green-50 to-white',   iconBg: 'bg-green-100',  iconText: 'text-green-600' },
  yellow: { bg: 'from-yellow-50 to-white',  iconBg: 'bg-yellow-100', iconText: 'text-yellow-600' },
  red:    { bg: 'from-red-50 to-white',     iconBg: 'bg-red-100',    iconText: 'text-red-600' },
};

export default function StatCard({ label, value, icon: Icon, color }: Props) {
  const s = colorStyles[color];
  return (
    <div className={`bg-gradient-to-br ${s.bg} rounded-xl border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}>
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${s.iconBg}`}>
          <Icon className={`h-5 w-5 ${s.iconText}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 font-medium">{label}</p>
        </div>
      </div>
    </div>
  );
}
