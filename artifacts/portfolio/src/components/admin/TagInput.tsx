import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TagInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function TagInput({ label, values, onChange, placeholder }: TagInputProps) {
  function addTag(value: string) {
    const trimmed = value.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((v) => (
          <span key={v} className="inline-flex items-center gap-1 px-2 py-1 text-xs font-mono rounded-md bg-primary/10 text-primary border border-primary/20">
            {v}
            <button type="button" onClick={() => onChange(values.filter((x) => x !== v))}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder ?? "Add item and press Enter"}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag((e.target as HTMLInputElement).value);
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
            addTag(input.value);
            input.value = "";
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
