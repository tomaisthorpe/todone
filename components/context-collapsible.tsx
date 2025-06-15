"use client";

import { useState, createContext, useContext } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleContextType {
  isCollapsed: boolean;
  toggle: () => void;
}

const CollapsibleContext = createContext<CollapsibleContextType | null>(null);

function useCollapsible() {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error("useCollapsible must be used within ContextCollapsible");
  }
  return context;
}

interface ContextCollapsibleProps {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

export function ContextCollapsible({ 
  children, 
  defaultCollapsed = false 
}: ContextCollapsibleProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggle = () => setIsCollapsed(!isCollapsed);

  return (
    <CollapsibleContext.Provider value={{ isCollapsed, toggle }}>
      {children}
    </CollapsibleContext.Provider>
  );
}

interface ContentProps {
  children: React.ReactNode;
}

function Content({ children }: ContentProps) {
  const { isCollapsed } = useCollapsible();
  
  if (isCollapsed) return null;
  
  return <>{children}</>;
}

interface TriggerProps {
  children?: React.ReactNode;
}

function Trigger({ children }: TriggerProps) {
  const { isCollapsed, toggle } = useCollapsible();
  
  return (
    <button
      onClick={toggle}
      className="flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100 transition-colors"
    >
      {children || (
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isCollapsed ? '-rotate-90' : 'rotate-0'
          }`} 
        />
      )}
    </button>
  );
}

ContextCollapsible.Content = Content;
ContextCollapsible.Trigger = Trigger;