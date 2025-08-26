import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContactsStore } from "@/stores/contactsStore";
import { useState, useEffect } from "react";

const EMAIL_TYPES = ["Home", "Work", "Other"];
const PHONE_TYPES = ["Mobile", "Home", "Work", "Main", "Work Fax", "Home Fax", "Pager", "Other"];

export default function ContactModal() {
  const { modal, closeModal, setModalMode, updateContact, contacts } = useContactsStore();
  const { isOpen, mode, contactId } = modal;

  const contact = contacts.find((c) => c.id === contactId);

  const [formData, setFormData] = useState(contact || {});

  useEffect(() => {
    if (contact) setFormData(contact);
  }, [contactId, contacts]);

  if (!contact || !formData) return null;

  const isView = mode === "view";

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value || "" }));
  }

  function handleNestedChange(group, type, value) {
    setFormData((prev) => ({
      ...prev,
      [group]: { ...prev[group], [type]: value || "" },
    }));
  }

  function addField(group, type = "New") {
    setFormData((prev) => ({
      ...prev,
      [group]: { ...prev[group], [type]: "" },
    }));
  }

  function handleSave() {
    updateContact(formData.id, formData);
    closeModal();
  }

  // Dynamically get top-level string fields, exclude objects and id
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
            {formData.email && Object.entries(formData.email).map(([type, value]) => (
              <div key={type} className="flex items-center gap-2 mb-2">
                <select
                  value={type}
                  disabled={isView}
                  onChange={(e) => handleNestedChange("email", e.target.value, formData.email[type] || "")}
                >
                  {EMAIL_TYPES.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <Input
                  value={value || ""}
                  onChange={(e) => handleNestedChange("email", type, e.target.value)}
                  disabled={isView}
                />
              </div>
            ))}
            {!isView && <Button size="sm" onClick={() => addField("email")}>+ Add Email</Button>}
          </div>

          {/* Phones */}
          <div>
            <label className="block text-sm font-medium mb-1">Phones</label>
            {formData.phone && Object.entries(formData.phone).map(([type, value]) => (
              <div key={type} className="flex items-center gap-2 mb-2">
                <select
                  value={type}
                  disabled={isView}
                  onChange={(e) => handleNestedChange("phone", e.target.value, formData.phone[type] || "")}
                >
                  {PHONE_TYPES.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <Input
                  value={value || ""}
                  onChange={(e) => handleNestedChange("phone", type, e.target.value)}
                  disabled={isView}
                />
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
