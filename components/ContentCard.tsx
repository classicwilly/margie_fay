import React, { useId } from 'react';

interface ContentCardProps {
  title?: string;
  children: React.ReactNode;
  showHeader?: boolean;
  className?: string;
  titleClassName?: string;
}

const sanitizeId = (s: string) => s.replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').replace(/(^-|-$)/g, '').toLowerCase();

const ContentCard: React.FC<ContentCardProps> = ({ title = '', children, showHeader = true, className = '', titleClassName = '' }) => {
  const reactId = useId();
  const reactIdSafe = reactId.replace(/[^a-z0-9-]/gi, '');
  const hasTitle = !!(title && title.trim().length > 0);
  const titleId = hasTitle ? `${sanitizeId(title)}-${reactIdSafe}` : undefined;
  
  return (
    <section aria-labelledby={showHeader ? titleId : undefined} className={className}>
      <div className="bg-card-dark rounded-lg shadow-md p-4 md:p-6 border border-gray-700 flex flex-col">
        {showHeader && hasTitle && (
          <h2 id={titleId} className={`text-2xl font-bold text-accent-green mb-4 border-b-2 border-gray-700 pb-2 ${titleClassName}`}>
            {title}
          </h2>
        )}
        <div className="flex-grow">{children}</div>
      </div>
    </section>
  );
};

export default ContentCard;
