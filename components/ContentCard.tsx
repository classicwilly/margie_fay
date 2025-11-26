import { useId, type FC, type ReactNode } from "react";

interface ContentCardProps {
  title?: string;
  children: ReactNode;
  showHeader?: boolean;
  className?: string;
  titleClassName?: string;
}

const sanitizeId = (s: string) =>
  s
    .replace(/[^a-z0-9]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "")
    .toLowerCase();

const ContentCard: FC<ContentCardProps> = ({
  title = "",
  children,
  showHeader = true,
  className = "",
  titleClassName = "",
}) => {
  const reactId = useId();
  const reactIdSafe = reactId.replace(/[^a-z0-9-]/gi, "");
  const hasTitle = !!(title && title.trim().length > 0);
  const titleId = hasTitle ? `${sanitizeId(title)}-${reactIdSafe}` : undefined;

  return (
    <section
      aria-labelledby={showHeader ? titleId : undefined}
      className={className}
    >
      <div className="card-base flex flex-col">
        {showHeader && hasTitle && (
          <h2
            id={titleId}
            className={`text-2xl font-mono font-bold text-accent-teal mb-4 border-b border-surface-700 pb-2 ${titleClassName}`}
          >
            {title}
          </h2>
        )}
        <div className="grow">{children}</div>
      </div>
    </section>
  );
};

export default ContentCard;
