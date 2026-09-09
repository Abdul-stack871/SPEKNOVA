import React from 'react';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = ''
}) => {
  return (
    <div className={`flex border-b border-border-dark/50 gap-2 overflow-x-auto scrollbar-none ${className}`}>
      {tabs.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-3 border-b-2 font-display text-sm font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap
              ${active 
                ? 'border-primary text-primary bg-primary/5' 
                : 'border-transparent text-text-dark-muted hover:text-text-dark hover:border-border-dark'}
            `}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
