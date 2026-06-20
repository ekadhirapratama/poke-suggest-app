import { TYPES, TYPE_ICON, TYPE_COLOR, type PokeType } from "@/lib/pokemon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  value: PokeType | "";
  onChange: (v: PokeType | "") => void;
  placeholder?: string;
  allowEmpty?: boolean;
  exclude?: (PokeType | "")[];
}

export function TypeIcon({ type, size = 28 }: { type: PokeType; size?: number }) {
  return (
    <img
      src={TYPE_ICON[type]}
      alt={type}
      width={size}
      height={size}
      className="rounded-full shrink-0 border border-black/40"
      style={{ width: size, height: size }}
    />
  );
}

export function TypeBadge({ type }: { type: PokeType }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-none pl-1.5 pr-3 py-1 text-[9px] font-black uppercase tracking-widest text-white border border-white/10"
      style={{ backgroundColor: TYPE_COLOR[type] }}
    >
      <TypeIcon type={type} size={14} />
      {type}
    </div>
  );
}

export function TypeSelect({
  value,
  onChange,
  placeholder = "Type",
  allowEmpty,
  exclude = [],
}: Props) {
  return (
    <Select
      value={value || "__none"}
      onValueChange={(v) => onChange(v === "__none" ? "" : (v as PokeType))}
    >
      <SelectTrigger className="h-10 px-3 bg-black border border-charcoal text-white hover:border-white/40 focus:ring-1 focus:ring-primary rounded-none uppercase tracking-wider text-[10px] font-bold transition-colors">
        <SelectValue placeholder={placeholder}>
          {value ? (
            <span className="flex items-center gap-2">
              <TypeIcon type={value} size={18} />
              <span className="text-[10px] tracking-widest font-black uppercase text-white">
                {value}
              </span>
            </span>
          ) : (
            <span className="text-white/40 text-[10px] tracking-wider font-bold uppercase">
              {placeholder}
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-black border border-charcoal rounded-none text-white">
        {allowEmpty && (
          <SelectItem
            value="__none"
            className="uppercase tracking-widest text-[10px] text-white/50 focus:bg-charcoal focus:text-white rounded-none cursor-pointer"
          >
            — None —
          </SelectItem>
        )}
        {TYPES.filter((t) => !exclude.includes(t)).map((t) => (
          <SelectItem
            key={t}
            value={t}
            className="uppercase tracking-widest text-[10px] focus:bg-charcoal focus:text-white rounded-none cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <TypeIcon type={t} size={18} />
              {t}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
