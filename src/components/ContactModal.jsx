import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContactsStore } from "@/stores/contactsStore";
import { useState, useEffect } from "react";

const EMAIL_TYPES = ["Home", "Work", "Other"];
const PHONE_TYPES = ["Mobile", "Home", "Work", "Main", "Work Fax", "Home Fax", "Pager", "Other"];

export default function ContactModal() {
  const { modal, closeModal, setModalMode, updateContact, deleteContact,contacts } = useContactsStore();
  const { isOpen, mode, contactId } = modal;

  const contact = contacts.find((c) => c.id === contactId);
  const [formData, setFormData] = useState(contact || {});

  useEffect(() => {
    if (contact) setFormData(contact);
  }, [contactId, contacts]);

  if (!contact || !formData) return null;
  const isView = mode === "view";

  function handleChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value || "" }));
  }

  // Rename key if type changes
  function handleTypeChange(group, oldType, newType) {
    if (!newType || oldType === newType) return;
    setFormData(prev => {
      const updatedGroup = { ...prev[group] };
      updatedGroup[newType] = updatedGroup[oldType];
      delete updatedGroup[oldType];
      return { ...prev, [group]: updatedGroup };
    });
  }

  function handleNestedChange(group, type, value) {
    setFormData(prev => ({
      ...prev,
      [group]: { ...prev[group], [type]: value || "" },
    }));
  }

  function addField(group, type = "New") {
    setFormData(prev => ({
      ...prev,
      [group]: { ...prev[group], [type]: "" },
    }));
  }

  function deleteField(group, type) {
    setFormData(prev => {
      const updatedGroup = { ...prev[group] };
      delete updatedGroup[type];
      return { ...prev, [group]: updatedGroup };
    });
  }

  function handleSave() {
    updateContact(formData.id, formData);
    closeModal();
  }

  const topLevelFields = Object.entries(formData).filter(
    ([key, value]) => typeof value === "string" && key !== "id" && key !== "sourceFile"
  );

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isView ? "View Contact" : "Edit Contact"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Top-level string fields */}
          {topLevelFields.map(([field, value]) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
              <Input
                value={value || ""}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={isView}
              />
            </div>
          ))}

          {/* Emails */}
          <div>
            <label className="block text-sm font-medium mb-1">Emails</label>
            {(formData.email ? Object.entries(formData.email) : []).map(([type, value]) => (
              <div key={type} className="flex items-center gap-2 mb-2">
                <Select
                  value={type}
                  disabled={isView}
                  onValueChange={(newType) => handleTypeChange("email", type, newType)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {EMAIL_TYPES.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Input
                  value={value || ""}
                  onChange={(e) => handleNestedChange("email", type, e.target.value)}
                  disabled={isView}
                />
                {!isView && value && (
                  <button
                    type="button"
                    onClick={() => deleteField("email", type)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            {!isView && <Button size="sm" onClick={() => addField("email")}>+ Add Email</Button>}
          </div>

          {/* Phones */}
          <div>
            <label className="block text-sm font-medium mb-1">Phones</label>
            {(formData.phone ? Object.entries(formData.phone) : []).map(([type, value]) => (
              <div key={type} className="flex items-center gap-2 mb-2">
                <Select
                  value={type}
                  disabled={isView}
                  onValueChange={(newType) => handleTypeChange("phone", type, newType)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {PHONE_TYPES.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Input
                  value={value || ""}
                  onChange={(e) => handleNestedChange("phone", type, e.target.value)}
                  disabled={isView}
                />
                {!isView && value && (
                  <button
                    type="button"
                    onClick={() => deleteField("phone", type)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            {!isView && <Button size="sm" onClick={() => addField("phone")}>+ Add Phone</Button>}
          </div>
        </div>

        {/* Source file */}
        <div className="mt-4 text-sm text-muted-foreground">
          Source: {formData.sourceFile || "N/A"}
        </div>

        <DialogFooter className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => setModalMode(isView ? "edit" : "view")}>
            {isView ? "Switch to Edit" : "Switch to View"}
          </Button>
          {!isView && <Button onClick={handleSave}>Save</Button>}
          {!isView && <Button variant="destructive" onClick={() => deleteContact(modal.contactId)}>Delete</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
