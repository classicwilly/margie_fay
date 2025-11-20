import React, { useState, useMemo } from 'react';
import SopCard from './SopCard';
import { SOP_DATA } from '../constants';
import { Sop, ViewType, SopSubCategory } from '../types';
import { useAppState } from '@contexts/AppStateContext';
import Button from './Button';
import { NEURO_SOP_TEMPLATES } from '../src/sops/neuro/neuro_sop_templates';
import { generateId } from '@utils/generateId';
import { exportSops } from '../src/utils/importExport';

const SopVault: React.FC = () => {
  const { appState, dispatch } = useAppState();
  const { modifiedSops, userSops } = appState;
  const [searchTerm, setSearchTerm] = useState('');
  
  const allSops = useMemo(() => 
    SOP_DATA.map(sop => modifiedSops[sop.id] || sop).concat(userSops),
    [modifiedSops, userSops]
  );
  
  const filteredSops = useMemo(() => {
    if (!searchTerm.trim()) {
      return allSops;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return allSops.filter(sop => 
      sop.title.toLowerCase().includes(lowercasedFilter) ||
      sop.description.toLowerCase().includes(lowercasedFilter)
    );
  }, [allSops, searchTerm]);

  const handleSetView = (view: ViewType) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };
  
  const renderProtocolSection = (title: string, description: string, sopsForSection: Sop[]) => {
    if (sopsForSection.length === 0) return null;
    return (
      <div className="mb-12">
        <h3 className="text-3xl font-bold text-accent-green mb-4 text-center sm:text-left border-b-2 border-gray-700 pb-2">
          {title}
        </h3>
        <p className="text-lg text-text-light text-opacity-80 max-w-3xl mx-auto sm:mx-0 mb-6 leading-relaxed">
          {description}
        </p>
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {sopsForSection.map((sop, idx) => (
            <SopCard key={`${sop.id}-${idx}`} sop={sop} />
          ))}
        </div>
      </div>
    );
  };

  const renderProtocolList = () => {
    const sections: { subCategory?: SopSubCategory, title: string, description: string, isUser?: boolean }[] = [
      { subCategory: 'foundational', title: 'Foundational Protocols', description: 'Core, repeatable systems for managing daily operations and maintaining stability.' },
      { subCategory: 'mode', title: 'Mode-Specific Protocols', description: 'SOPs for Solo Execution and Family Structure modes.' },
      { subCategory: 'maintenance', title: 'Life Maintenance Protocols', description: 'Systems for essential survival tasks like cleaning and hygiene.' },
      { subCategory: 'hardware', title: 'Hardware & Setup Protocols', description: 'Configuration guides for physical and digital tools.' },
      { subCategory: 'ipi', title: 'Immediate Problem Instructions (IPIs)', description: 'Emergency protocols for acute situations. Execute immediately when trigger conditions are met.' },
      { subCategory: 'kids', title: 'Kids\' Protocols', description: 'Checklists and guides for Willow and Sebastian.' },
      { subCategory: 'meta', title: 'Meta Protocols', description: 'High-level standards and guides for the OS itself.' },
      { isUser: true, title: 'User-Defined Protocols', description: 'Custom protocols you have created. These are saved in your browser.' },
    ];

    if (searchTerm.trim()) {
      return (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {filteredSops.map((sop, idx) => (
            <SopCard key={`${sop.id}-${idx}`} sop={sop} />
          ))}
        </div>
      );
    }

    return (
      <section>
        {sections.map(({ subCategory, title, description, isUser }) => {
           let sopsForSection;
           if (isUser) {
             sopsForSection = filteredSops.filter(s => s.category.includes('USER'));
           } else {
             sopsForSection = filteredSops.filter(s => s.subCategory === subCategory && !s.category.includes('USER'));
           }
          return renderProtocolSection(title, description, sopsForSection);
        })}
      </section>
    );
  };

  return (
    <div>
      <section className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="text-center sm:text-left">
            <h2 data-testid="sop-vault-title" className="text-4xl font-extrabold text-accent-teal">
              Flight Protocol Vault: All Protocols
            </h2>
             <p className="text-lg text-text-light text-opacity-90 max-w-3xl leading-relaxed mt-2">
              The central library for every protocol in the Wonky Sprout OS. Find the system you need to execute.
            </p>
          </div>
          <Button
            onClick={() => handleSetView('create-sop')}
            className="flex items-center flex-shrink-0"
            variant="primary"
            aria-label="Create a new protocol"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Protocol
          </Button>
        </div>
        <div className="relative mb-8">
            <input 
                type="text"
                placeholder="Search Flight Protocols by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="sop-vault-search"
                className="w-full p-4 bg-gray-800 border-2 border-gray-700 rounded-md text-text-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue"
            />
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => {
                // Import neuro SOPs into userSops
                NEURO_SOP_TEMPLATES.forEach((t) => {
                  // Use the app's generateId helper to create a robust unique id
                  const uniqueId = generateId();
                  dispatch({ type: 'ADD_SOP', payload: { ...t, id: uniqueId } });
                });
              }}
              className="flex items-center flex-shrink-0 ml-3"
              variant="secondary"
              aria-label="Import neuro templates"
              data-testid="import-neuro-templates"
            >
              Import Neuro Templates
            </Button>
            <Button
              onClick={() => {
                const exported = exportSops(userSops);
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(exported);
                  alert('SOP JSON copied to clipboard.');
                } else {
                  const blob = new Blob([exported], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'wonky_sop_export.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }
              }}
              className="flex items-center flex-shrink-0"
              variant="outline"
              aria-label="Export My SOPs"
            >
              Export My SOPs
            </Button>
        </div>
      </section>
      {renderProtocolList()}
    </div>
  );
};

export default SopVault;
