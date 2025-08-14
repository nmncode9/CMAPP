

export default function UploadButton() {

  return (
    <form onSubmit={(e) => e.preventDefault()} className="text-center max-w-[1100px] mx-auto">
      <input
        id="fileInput"
        type="file"
        multiple
        // onChange={handleFileUpload}
        className="hidden"
      />
      <label htmlFor="fileInput" className="cursor-pointer mb-5 sm:mb-8 inline-flex items-center mx-auto justify-center gap-2 px-8 py-2 sm:px-16 sm:py-4 bg-primary text-white font-[700] rounded-md text-xl sm:text-2xl hover:bg-secondary transition">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>
        Upload List
      </label>
    </form>
  )
}