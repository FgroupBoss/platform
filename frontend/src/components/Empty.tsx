import { cn } from '@/lib/utils';

interface EmptyProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function Empty({ title = '暂无内容', description, className }: EmptyProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <p className="text-slate-400 font-medium">{title}</p>
      {description && <p className="text-sm text-slate-600 mt-2">{description}</p>}
    </div>
  );
}
