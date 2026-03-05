export function TopBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center px-4">
        <span className="text-lg font-semibold tracking-tight">RouteMaker</span>
      </div>
    </header>
  )
}
