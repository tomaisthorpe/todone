"use client";

import { useState, createContext, useContext } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <Button
        variant="ghost"
        onClick={toggle}
        className="w-full flex items-center justify-between hover:bg-white hover:bg-opacity-10 rounded-lg p-2 transition-colors text-white"
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            {children}
          </div>
        </div>
      </Button>
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

ContextCollapsible.Content = Content;