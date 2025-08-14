

export default function UploadScreen() {


  return (
    <main className="pt-16 max-w-[1100px] mx-auto text-neutral-dark text-center">
      <h1 className="text-6xl font-[900] mb-20">Start by uploading one or more contact lists</h1>
      <button className="cursor-pointer mb-8 flex items-center mx-auto justify-center gap-2 px-16 py-4 bg-primary text-white font-[700] rounded-md text-2xl hover:bg-secondary transition">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>Upload List
      </button>
      <button className="underline cursor-pointer mb-14">Use sample data instead</button>
      <p className="max-w-[890px] mx-auto font-[500] text-3xl text-left">CMAPP, short for Contact Manager App, is a lightweight tool to merge, split, convert and batch modify contacts. To get started, import your contacts from your phone or Gmail.  CMAPP supports csv and vCard formats. Your data is processed client-side. This means that your data is processed through the browser and nothing is sent to any remote server.</p>
    </main>
  )

}