import { difficultyStyle, statusStyle } from "./adminTheme";

/**
 * Reusable badge for difficulty / status labels in admin tables.
 */
export function AdminBadge({
  label,
  style,
}: {
  label: string;
  style: { color: string; background: string; borderColor: string };
}) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border"
      style={style}
    >
      {label}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty?: string }) {
  return <AdminBadge label={difficulty ?? "—"} style={difficultyStyle(difficulty)} />;
}

export function StatusBadge({ status }: { status?: string }) {
  return <AdminBadge label={status ?? "—"} style={statusStyle(status)} />;
}
