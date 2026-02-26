import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ExpandableSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  testId?: string;
}

export function ExpandableSection({ 
  title, 
  children, 
  defaultExpanded = false,
  testId 
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border-t border-tiktok-border bg-white" data-testid={testId}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-4 hover-elevate active-elevate-2"
        data-testid={`${testId}-toggle`}
      >
        <h2 className="text-[16px] font-semibold text-tiktok-black">{title}</h2>
        <ChevronDown 
          className={`w-5 h-5 text-tiktok-black transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {isExpanded && (
          <div className="px-4 pb-6 animate-in fade-in duration-300" data-testid={`${testId}-content`}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
