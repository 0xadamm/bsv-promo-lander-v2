interface TagBadgeProps {
  name: string;
  color: string;
  size?: "sm" | "md" | "lg";
}

export default function TagBadge({ name, color, size = "md" }: TagBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      style={{ backgroundColor: color }}
      className={`inline-block rounded-full text-white font-medium ${sizeClasses[size]}`}
    >
      {name}
    </span>
  );
}
