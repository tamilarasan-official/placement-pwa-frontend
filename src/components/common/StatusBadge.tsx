import { PlacementStatus } from '../../types';

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  NOT_APPLIED: { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' },
  APPLIED: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  SHORTLISTED: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  INTERVIEWED: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  SELECTED: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  REJECTED: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

export default function StatusBadge({ status }: { status: PlacementStatus | string }) {
  const config = statusConfig[status] || statusConfig.NOT_APPLIED;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {status.replace('_', ' ')}
    </span>
  );
}
