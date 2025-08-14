import { create } from "zustand";
import * as XLSX from "xlsx";

export const useContactsStore = create((set) => ({
  rawFiles: [],
  contacts: [],
  setContacts: (contacts) => set({ contacts }),
  
  addRawFiles: (files) => {
    const filesArray = Array.from(files);
    set((state) => ({ rawFiles: [...state.rawFiles, ...filesArray] }));

    filesArray.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const ab = e.target.result;
        let parsedContacts = [];

        // Check if the file extension is supported 
        const isCSV = file.name.endsWith(".csv") || file.type === "text/csv";
        const isExcel =
          file.name.endsWith(".xlsx") ||
          file.name.endsWith(".xls") ||
          file.type.includes("excel");

        if (isCSV || isExcel) {
          const workbook = XLSX.read(ab, { type: "array" });
          workbook.SheetNames.forEach((sheetName) => {
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            parsedContacts = [...parsedContacts, ...sheetData.map(contact => ({ ...contact, sourceFile: file.name }))];
          });

          set((state) => ({ contacts: [...state.contacts, ...parsedContacts] }));
        } else {
          console.warn("Unsupported file type:", file.name);
        }
      };

      // Always use ArrayBuffer for modern approach
      reader.readAsArrayBuffer(file);
    });
  },
}));
