interface Props {
  text?: string;
}

export default function LoadingSpinner({ text }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-blue-200"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-600 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-indigo-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
      </div>
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
}
