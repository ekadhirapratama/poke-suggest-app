import { TYPES, TYPE_ICON, TYPE_COLOR, type PokeType } from "@/lib/pokemon";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
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
      className="rounded-full shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

export function TypeBadge({ type }: { type: PokeType }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full pl-1 pr-3 py-1 text-xs font-semibold text-white"
      style={{ backgroundColor: TYPE_COLOR[type] }}
    >
      <TypeIcon type={type} size={20} />
      {type}
    </div>
  );
}

export function TypeSelect({ value, onChange, placeholder = "Type", allowEmpty, exclude = [] }: Props) {
  return (
    <Select
      value={value || "__none"}
      onValueChange={(v) => onChange(v === "__none" ? "" : (v as PokeType))}
    >
      <SelectTrigger className="h-11 px-2">
        <SelectValue placeholder={placeholder}>
          {value ? (
            <span className="flex items-center gap-2">
              <TypeIcon type={value} size={22} />
              <span className="text-sm">{value}</span>
            </span>
          ) : (
            <span className="text-muted-foreground text-sm">{placeholder}</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {allowEmpty && <SelectItem value="__none">— None —</SelectItem>}
        {TYPES.filter((t) => !exclude.includes(t)).map((t) => (
          <SelectItem key={t} value={t}>
            <span className="flex items-center gap-2">
              <TypeIcon type={t} size={22} />
              {t}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
