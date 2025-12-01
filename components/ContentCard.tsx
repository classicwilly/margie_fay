import React, { useId } from 'react';

interface ContentCardProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  showHeader?: boolean;
  className?: string;
  titleClassName?: string;
}

const sanitizeId = (s: string) => s.replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').replace(/(^-|-$)/g, '').toLowerCase();

const ContentCard: React.FC<ContentCardProps> = ({ title = '', children, showHeader = true, className = '', titleClassName = '' }) => {
  const reactId = useId();
  const reactIdSafe = reactId.replace(/[^a-z0-9-]/gi, '');
  const hasTitle = !!(title && (typeof title === 'string' ? title.trim().length > 0 : true));
  const titleId = hasTitle && typeof title === 'string' ? `${sanitizeId(title as string)}-${reactIdSafe}` : (hasTitle ? `title-${reactIdSafe}` : undefined);
  
  return (
    <section aria-labelledby={showHeader ? titleId : undefined} className={className}>
      <div className="card-base flex flex-col">
        {showHeader && hasTitle && (
          <h2 id={titleId} className={`text-2xl font-mono font-bold text-accent-teal mb-4 border-b border-surface-700 pb-2 ${titleClassName}`}>
            {title}
          </h2>
        )}
        <div className="flex-grow">{children}</div>
      </div>
    </section>
  );
};

export default ContentCard;
