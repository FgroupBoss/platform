import { ArrowUpDown, Search } from 'lucide-react';

interface FilterBarProps {
  filters: { label: string; options: string[]; value: string; onChange: (v: string) => void }[];
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
}

export default function FilterBar({ filters, searchPlaceholder, searchValue, onSearchChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 mb-4 flex-wrap">
      {filters.map((f) => (
        <select
          key={f.label}
          value={f.value}
          onChange={(e) => f.onChange(e.target.value)}
          className="h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
        >
          <option value="">{f.label}</option>
          {f.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ))}
      <div className="flex-1" />
      {onSearchChange && (
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder={searchPlaceholder || '搜索...'}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64 h-9 pl-9 pr-3 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      )}
      <button className="h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-400 hover:text-slate-200 hover:border-white/20 transition-all flex items-center gap-1.5">
        <ArrowUpDown size={14} />
        排序
      </button>
    </div>
  );
}