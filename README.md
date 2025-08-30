# Contacts Manager App

A modern React-based application for importing, managing, editing, and exporting contact lists.  
This project leverages a combination of state management, spreadsheet handling, and robust UI primitives to deliver a performant and user-friendly workflow for contact lifecycle management.

---

## Features

### Upload & Normalization
- Import CSV/XLSX files via **UploadButton**.
- Files are parsed with **SheetJS (xlsx)** into structured `contactObj` arrays.
- A custom sanitization layer prevents Excel formula injection.
- Normalization step ensures consistency:
  - Generates unique IDs with **uuid**.
  - Consolidates names, emails, phone numbers, addresses, and companies into predictable fields.
  - Captures file provenance (`sourceFile`).

### Contact Management
- Contacts are stored centrally in a **Zustand store**.
- Displayed in an interactive **TanStack Table**:
  - Sorting, filtering, and pagination for large datasets.
  - Action column for view, edit, and delete.
- Edit flow handled by **ContactModal**, with state updates flowing through Zustand.
- Contacts update in real time across components thanks to React’s reactivity.

### Export
- ExportButtons provide one-click download of:
  - Selected contacts.
  - Entire dataset.
- Conversion back to CSV/XLSX via **SheetJS**.
- Files generated with correct headers and preserved data integrity.

### UI & UX
- Built on **shadcn/ui** and **Radix primitives**.
- TailwindCSS provides responsive design and utility-based styling.
- Modals, selects, and dropdowns styled consistently with accessible defaults.
- Hover-based interactions (e.g., action column icons) improve clarity without clutter.

---

## Technical Breakdown

### React
- Core UI library.
- Functional components with hooks (`useState`, `useEffect`, `useNavigate`).
- Component hierarchy defines the main screens:
  - **UploadScreen**: Ingests raw contacts.
  - **ContactsPage**: Displays, filters, and manages contacts.
  - **ContactModal**: Edits individual contacts.

### Zustand
- Lightweight state management.
- Central store maintains:
  - Contacts array.
  - Raw uploaded files.
  - Modal state.
  - Undo/redo stacks.
- No normalization in the database sense; instead, it holds pre-normalized `contactObj` arrays.

### SheetJS (xlsx)
- File ingestion and export.
- `sheet_to_json` → parse spreadsheets into JSON.
- `json_to_sheet` → convert contacts back into sheets.
- `writeFile` → trigger browser downloads.

### TanStack Table
- High-performance rendering of contact lists.
- Provides sorting, filtering, and pagination.
- Efficient with large data sets.

### shadcn/ui + Radix
- Accessible UI primitives for dropdowns, modals, and form controls.
- Integrated styling with Tailwind utilities.

### TailwindCSS
- Utility-first CSS framework.
- Provides layout, spacing, and responsive styles.
- Paired with custom CSS variables for theme overrides.

### uuid
- Generates unique identifiers (`uuidv4`) for each `contactObj`.

---

## Contact Lifecycle (Step by Step)

### Upload
1. User selects a file with **UploadButton**.
2. File is read as `ArrayBuffer` and passed to **SheetJS**.
3. Rows are normalized into `contactObj[]`.
4. Contacts pushed into the **Zustand store**.

### View / Manage
- **ContactsPage** renders the table from the store.
- **TanStack Table** powers sorting, filtering, and pagination.
- Hover actions (view/edit/delete) rendered inline.

### Edit
- **ContactModal** opens with data from the store.
- Edits applied with `updateContact` in the Zustand store.
- React re-renders propagate updated values.

### Export
- **ExportButtons** gather either:
  - Selected contacts.
  - All contacts.
- Converted to sheet via **SheetJS**.
- Triggered download in CSV/XLSX format.

---

## Breakdown of the Zustand Store

1. **File Ingestion & Storage**
   - `rawFiles`: stores uploaded file references.
   - `addRawFiles`: accepts files, initiates parsing.

2. **File Parsing**
   - Uses FileReader to read `ArrayBuffer`.
   - Passed into **SheetJS** to extract rows.
   - Iterates sheets and builds objects.

3. **Contact Object Construction**
   ```js
   {
     id: uuidv4(),
     name: "Full Name",
     email: { Work: "example@work.com" },
     phone: { Mobile: "+123456789" },
     address: "123 Main St, Springfield",
     company: "Example Inc.",
     sourceFile: "contacts.xlsx"
   }
