import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

export function ControlledField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="font-mono text-xs uppercase">{label}</Label>
      <Input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function Field(props: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return <ControlledField {...props} />;
}

export function ResourceHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-mono font-bold text-lg">{title}</h2>
      <Button onClick={onAdd} size="sm" className="font-mono"><Plus className="w-4 h-4 mr-1" /> Add</Button>
    </div>
  );
}

export function AdminSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="py-10 text-center text-muted-foreground font-mono text-sm">{message}</CardContent>
    </Card>
  );
}

export function PanelCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-mono font-bold text-xl">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {children}
    </div>
  );
}
