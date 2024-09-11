import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SlideoutPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

const SlideoutPanel: React.FC<SlideoutPanelProps> = ({ isOpen, onOpenChange, title, description, children }) => {
  return (
    <Sheet
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <SheetContent
        side="right"
        className="max-w-[700px] min-w-[60vw] bg-background p-0"
      >
        <ScrollArea className="h-[100vh] p-8">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          <div className="mx-2">
          {children}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default SlideoutPanel;
