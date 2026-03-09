import { Tooltip } from "@heroui/react";

export const RequiredStar = ({ rules }: { rules: string[] }) => {
  const isSingle = rules.length === 1;

  return (
    <Tooltip
      color="danger"
      content={
        <div className="text-xs max-w-[200px] space-y-1">
          {isSingle ? (
            <div>{rules[0]}</div>
          ) : (
            <ul className="list-disc pl-3 space-y-1">
              {rules.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          )}
        </div>
      }
    >
      <span className="text-red-500 cursor-help text-xs">*</span>
    </Tooltip>
  );
};