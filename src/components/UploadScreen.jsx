import UploadButton from "./UploadButton";


export default function UploadScreen() {


  return (
    <main className="pt-16 pb-8 max-w-[1100px] mx-auto text-neutral-dark text-center">
      <h1 className="text-3xl sm:text-6xl font-[900] mb-9 sm:mb-20">Start by uploading one or more contact lists</h1>
      <UploadButton />
      <button className="underline cursor-pointer mb-14 text-lg sm:text-[22px]">Use sample data instead</button>
      <p className="max-w-[890px] mx-auto font-[500] text-xl sm:text-3xl text-left p-4 sm:p-0">CMAPP, short for Contact Manager App, is a lightweight tool to merge, split, convert and batch modify contacts. To get started, import your contacts from your phone or Gmail.  CMAPP supports csv and vCard formats. Your data is processed client-side. This means that your data is processed through the browser and nothing is sent to any remote server.</p>
    </main>
  )

}