import React from "react";
import { SearchX, RefreshCcw } from "lucide-react";
import { Button } from "@components/ui";

export function SearchEmptyState({ 
  title = "No matches found", 
  message = "Try adjusting your search or filters to find what you're looking for.", 
  onReset 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in duration-300">
      <div className="w-24 h-24 rounded-full bg-subtle flex items-center justify-center text-dimmed mb-6 border-4 border-surface shadow-sm">
        <SearchX size={48} strokeWidth={1.5} />
      </div>
      
      <h3 className="text-xl font-black text-primary mb-2 tracking-tight">
        {title}
      </h3>
      
      <p className="text-secondary font-bold text-sm max-w-sm mb-8 leading-relaxed">
        {message}
      </p>

      {onReset && (
        <Button 
          variant="soft" 
          onClick={onReset}
          icon={RefreshCcw}
          className="font-black px-8"
        >
          Reset Filters
        </Button>
      )}
    </div>
  );
}
