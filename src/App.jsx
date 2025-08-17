import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'
import UploadScreen from './components/UploadScreen'
import ViewContacts from "./components/ViewContacts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UploadScreen />
  },
  {
    path: "/contacts",
    element: <ViewContacts />
  }
]);

export default function App() {
  return <RouterProvider router={router} />
}

