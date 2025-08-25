import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
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
        const workbook = XLSX.read(ab, { type: "array" });
        let parsedContacts = [];

        workbook.SheetNames.forEach((sheetName) => {
          const sheetData = XLSX.utils.sheet_to_json(
            workbook.Sheets[sheetName]
          );

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

            // --- Build name (concatenate all possible name fields) ---
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

            // --- Emails (normalize labels, keep fallback) ---
            for (const key of Object.keys(row)) {
              const lower = key.toLowerCase();
              if (lower.includes("e-mail") || lower.includes("email")) {
                if (lower.includes("label")) {
                  const base = key.replace(/label/i, "value");
                  if (row[base]) {
                    const label = (row[key] || "other").toString().toLowerCase().trim();
                    contactObj.email[label] = row[base];
                  }
                } else if (lower.includes("value") && !Object.keys(contactObj.email).length) {
                  contactObj.email.other = row[key];
                }
              }
            }

            // --- Phones (normalize labels, keep fallback) ---
            for (let i = 1; i <= 5; i++) {
              const labelKey = `Phone ${i} - Label`;
              const valueKey = `Phone ${i} - Value`;

              if (row[valueKey]) {
                const label = (row[labelKey] || "other").toString().toLowerCase().trim();
                contactObj.phone[label] = row[valueKey];
              }
            }


            // --- Address (flatten all parts into one string) ---
            const addressParts = [];
            for (const key of Object.keys(row)) {
              if (key.toLowerCase().includes("address")) {
                if (row[key]) addressParts.push(row[key]);
              }
            }
            contactObj.address = addressParts.join(", ");

            // --- Company (flatten org info into one string) ---
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

        set((state) => ({ contacts: [...state.contacts, ...parsedContacts] }));
      };

      reader.readAsArrayBuffer(file);
    });
  },
}));
