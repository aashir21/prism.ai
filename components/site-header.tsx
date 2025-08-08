import { IconHexagonalPyramid } from "@tabler/icons-react"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) p-2 lg:p-0 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 p-2 lg:gap-2 lg:px-6">
        <h1 className="text-base font-medium">Prism AI</h1>
        <IconHexagonalPyramid color="#a3e635" />
      </div>
    </header>
  )
}
