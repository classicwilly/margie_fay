import React from 'react';

interface ContentCardProps {
  title: string;
  children: React.ReactNode;
  showHeader?: boolean;
  className?: string;
  titleClassName?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({ title, children, showHeader = true, className = '', titleClassName = '' }) => {
  const titleId = title.replace(/\s+/g, '-').toLowerCase();
  
  return (
    <section aria-labelledby={showHeader ? titleId : undefined} className={className}>
      <div className="bg-card-dark rounded-lg shadow-md p-4 md:p-6 border border-gray-700 flex flex-col">
        {showHeader && (
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
