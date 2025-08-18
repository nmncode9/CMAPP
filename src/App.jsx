import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css';
import UploadScreen from './components/UploadScreen';
import DataTable from "./components/DataTable.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <UploadScreen />
  },
  {
    path: "/contacts",
    element: <DataTable />
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
