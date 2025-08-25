import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css';
import UploadScreen from './components/UploadScreen';
import ContactsPage from "./components/ContactsPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <UploadScreen />
  },
  {
    path: "/contacts",
    element: <ContactsPage />
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
