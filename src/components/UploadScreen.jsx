import UploadButton from "./UploadButton";
import { useContactsStore } from "@/stores/contactsStore";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";


export default function UploadScreen() {

  const setContacts = useContactsStore((s) => s.setContacts);
  const navigate = useNavigate();

  async function loadSample() {
    const res = await fetch("/sample.json");
    const data = await res.json();
    setContacts(data);
    navigate("/contacts")
  }

  return (
    <div className="min-h-screen w-full bg-white relative">
      {/* Purple Gradient Grid Left Background, courtesy of patterncraft.fun */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #f0f0f0 1px, transparent 1px),
            linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
            radial-gradient(circle 800px at 0% 200px, #d5c5ff, transparent)
          `,
          backgroundSize: "96px 64px, 96px 64px, 100% 100%",
        }}
      />

      {/* Main Content */}
      <main className="relative z-10 flex flex-col justify-center min-h-screen max-w-[1100px] mx-8 lg:mx-auto text-neutral-dark pt-16">
        <h1 className="text-4xl sm:text-5xl font-[900] mb-9">
          A free and open source contact manager app
        </h1>
        <p className="max-w-[890px] font-[500] text-xl text-left mb-16">
          CMAPP, short for Contact Manager App, is a lightweight tool to merge, split, convert and batch modify contacts. To get started, import your contacts from your phone or Gmail. CMAPP supports csv and vCard formats. Your data is processed client-side. This means that your data is processed through the browser and nothing is sent to any remote server.
        </p>

        <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0 items-center">
          <UploadButton className="w-64 h-15" />
          <Button
            variant="ghost"
            className="underline text-muted-foreground w-64 h-15 cursor-pointer text-lg hover:bg-secondary transition"
            onClick={loadSample}
          >
            Use sample data instead
          </Button>
        </div>
      </main>
    </div>
  )


}