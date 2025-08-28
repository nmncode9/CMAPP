import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";

const UNDO_LIMIT = 50;

export const useContactsStore = create((set, get) => ({
  rawFiles: [],
  contacts: [],
  setContacts: (contacts) => set({ contacts }),

  undoStack: [],
  redoStack: [],

  // ---------------- File import ----------------
  addRawFiles: (files) => {
    const filesArray = Array.from(files);
    set((state) => ({ rawFiles: [...state.rawFiles, ...filesArray] }));

    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const ab = e.target.result;
        const workbook = XLSX.read(ab, { type: "array" });
        let parsedContacts = [];

        workbook.SheetNames.forEach((sheetName) => {
          const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

          sheetData.forEach((row) => {
            const contactObj = {
              id: uuidv4(),
              name: "",
              email: {},
              phone: {},
              address: "",
              company: "",
              sourceFile: file.name,
            };

            // --- Name ---
            const nameParts = [];
            for (const key of Object.keys(row)) {
              const lower = key.toLowerCase();
              if (
                lower.includes("first name") ||
                lower.includes("last name") ||
                lower.includes("middle name") ||
                lower.includes("name prefix") ||
                lower.includes("name suffix")
              ) {
                if (row[key]) nameParts.push(row[key]);
              }
            }
            contactObj.name = nameParts.join(" ").trim();

            // --- Emails ---
            for (const key of Object.keys(row)) {
              const lower = key.toLowerCase();
              if (lower.includes("e-mail") || lower.includes("email")) {
                if (lower.includes("label")) {
                  const base = key.replace(/label/i, "value");
                  if (row[base]) {
                    let label = (row[key] || "Other").toString().replace(/^[\*\s]+/, "").trim();
                    if (!label) label = "Other";
                    label = label.charAt(0).toUpperCase() + label.slice(1);
                    contactObj.email[label] = row[base];
                  }
                } else if (lower.includes("value") && !Object.keys(contactObj.email).length) {
                  contactObj.email["Other"] = row[key];
                }
              }
            }

            // --- Phones ---
            for (let i = 1; i <= 5; i++) {
              const labelKey = `Phone ${i} - Label`;
              const valueKey = `Phone ${i} - Value`;

              if (row[valueKey]) {
                let label = (row[labelKey] || "Mobile").toString().replace(/^[\*\s]+/, "").trim();
                if (!label) label = "Mobile";
                label = label.charAt(0).toUpperCase() + label.slice(1);
                contactObj.phone[label] = row[valueKey];
              }
            }

            // --- Address ---
            const addressParts = [];
            for (const key of Object.keys(row)) {
              if (key.toLowerCase().includes("address")) {
                if (row[key]) addressParts.push(row[key]);
              }
            }
            contactObj.address = addressParts.join(", ");

            // --- Company ---
            const companyParts = [];
            for (const key of Object.keys(row)) {
              const lower = key.toLowerCase();
              if (
                lower.includes("organization") ||
                lower.includes("company") ||
                lower.includes("employer")
              ) {
                if (row[key]) companyParts.push(row[key]);
              }
            }
            contactObj.company = companyParts.join(", ");

            parsedContacts.push(contactObj);
          });
        });

        set((state) => ({
          contacts: [...state.contacts, ...parsedContacts],
          undoStack: [
            ...state.undoStack,
            ...parsedContacts.map((c) => ({ type: "add", contact: c })),
          ].slice(-UNDO_LIMIT),
          redoStack: [],
        }));
      };

      reader.readAsArrayBuffer(file);
    });
  },

  modal: { isOpen: false, mode: "view", contactId: null },
  openModal: (contactId, mode = "view") =>
    set({ modal: { ...get().modal, isOpen: true, mode, contactId } }),
  closeModal: () =>
    set({ modal: { isOpen: false, mode: "view", contactId: null } }),
  setModalMode: (mode) => set((state) => ({ modal: { ...state.modal, mode } })),

  // ---------------- Contact actions ----------------
  addNewContact: () => {
    const newContact = {
      id: uuidv4(),
      name: "",
      email: {},
      phone: {},
      address: "",
      company: "",
      sourceFile: "Created via app",
    };

    set((state) => ({
      contacts: [...state.contacts, newContact],
      modal: { isOpen: true, mode: "edit", contactId: newContact.id },
      undoStack: [...state.undoStack, { type: "add", contact: newContact }].slice(-UNDO_LIMIT),
      redoStack: [],
    }));
  },

  updateContact: (id, updates) =>
    set((state) => {
      const idx = state.contacts.findIndex((c) => c.id === id);
      if (idx === -1) return {};

      const oldContact = state.contacts[idx];
      const newContacts = [...state.contacts];
      newContacts[idx] = updates;

      return {
        contacts: newContacts,
        modal: { ...state.modal, contact: updates },
        undoStack: [...state.undoStack, { type: "edit", contactId: id, prev: oldContact, next: updates }].slice(-UNDO_LIMIT),
        redoStack: [],
      };
    }),

  deleteContact: (id) =>
    set((state) => {
      const idx = state.contacts.findIndex((c) => c.id === id);
      if (idx === -1) return {};

      const removed = state.contacts[idx];
      const newContacts = [...state.contacts];
      newContacts.splice(idx, 1);

      return {
        contacts: newContacts,
        undoStack: [...state.undoStack, { type: "delete", contact: removed, index: idx }].slice(-UNDO_LIMIT),
        redoStack: [],
      };
    }),

  // ---------------- Undo/Redo ----------------
  undo: () => {
    set((state) => {
      if (!state.undoStack.length) return {};

      const action = state.undoStack[state.undoStack.length - 1];
      let newContacts = [...state.contacts];
      let redoStack = [...state.redoStack, action].slice(-UNDO_LIMIT);

      switch (action.type) {
        case "add":
          newContacts = newContacts.filter((c) => c.id !== action.contact.id);
          break;
        case "edit":
          newContacts = newContacts.map((c) =>
            c.id === action.contactId ? action.prev : c
          );
          break;
        case "delete":
          newContacts.splice(action.index, 0, action.contact);
          break;
      }

      return {
        contacts: newContacts,
        undoStack: state.undoStack.slice(0, -1),
        redoStack,
      };
    });
  },

  redo: () => {
    set((state) => {
      if (!state.redoStack.length) return {};

      const action = state.redoStack[state.redoStack.length - 1];
      let newContacts = [...state.contacts];
      let undoStack = [...state.undoStack, action].slice(-UNDO_LIMIT);

      switch (action.type) {
        case "add":
          newContacts.push(action.contact);
          break;
        case "edit":
          newContacts = newContacts.map((c) =>
            c.id === action.contactId ? action.next : c
          );
          break;
        case "delete":
          newContacts = newContacts.filter((c) => c.id !== action.contact.id);
          break;
      }

      return {
        contacts: newContacts,
        undoStack,
        redoStack: state.redoStack.slice(0, -1),
      };
    });
  },
}));
