import { useState, useMemo, type FC, type ReactNode } from "react";

interface LibraryViewProps {
  title?: string;
  subtitle?: string;
  items: any[];
  renderItem: (item: any) => ReactNode;
  searchKeys: string[];
  headerActions?: ReactNode;
}

const LibraryView: FC<LibraryViewProps> = ({
  title,
  subtitle,
  items,
  renderItem,
  searchKeys,
  headerActions,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return items;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return items.filter((item) =>
      searchKeys.some(
        (key) =>
          item[key] &&
          item[key].toString().toLowerCase().includes(lowercasedFilter),
      ),
    );
  }, [items, searchTerm, searchKeys]);

  return (
    <div>
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-extrabold text-accent-teal">
              {title}
            </h1>
            <p className="text-lg text-text-light text-opacity-90 max-w-3xl leading-relaxed mt-2">
              {subtitle}
            </p>
          </div>
          {headerActions && (
            <div className="flex-shrink-0">{headerActions}</div>
          )}
        </div>
        <div className="relative mt-6">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 bg-gray-800 border-2 border-gray-700 rounded-md text-text-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue"
          />
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </header>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => (
          <div key={item.id}>{renderItem(item)}</div>
        ))}
      </div>
      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">No items match your search.</p>
        </div>
      )}
    </div>
  );
};

export default LibraryView;
