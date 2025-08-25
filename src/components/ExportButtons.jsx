import { Button } from "./ui/button"

export default function ExportButtons() {

  return (
    <div className="flex gap-2">
      <Button>Export selected</Button>
      <Button>Export All</Button>
    </div>
  )
}