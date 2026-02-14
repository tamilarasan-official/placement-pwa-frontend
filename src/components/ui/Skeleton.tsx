interface Props {
  className?: string;
}

export default function Skeleton({ className = 'h-64' }: Props) {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-xl ${className}`} />
  );
}
