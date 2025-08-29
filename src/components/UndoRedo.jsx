import { useContactsStore } from "@/stores/contactsStore";
import { Undo, Redo } from "lucide-react";

export default function UndoRedo() {
  
  const undoStack = useContactsStore((s) => s.undoStack);
  const redoStack = useContactsStore((s) => s.redoStack);
  const undo = useContactsStore((s) => s.undo);
  const redo = useContactsStore((s) => s.redo);

  const undoDisabled = undoStack.length === 0;
  const redoDisabled = redoStack.length === 0;

  return (
    <div className="flex space-x-2 pt-2">
      <Undo
        onClick={undo}
        className={`cursor-pointer ${undoDisabled ? "text-muted-foreground cursor-not-allowed" : "text-foreground"}`}
      />
      <Redo
        onClick={redo}
        className={`cursor-pointer ${redoDisabled ? "text-muted-foreground cursor-not-allowed" : "text-foreground"}`}
      />
    </div>
  );
}
