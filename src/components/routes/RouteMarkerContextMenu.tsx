type Props = {
  left: number
  onRemove: () => void
  top: number
}

export const RouteMarkerContextMenu = ({ left, onRemove, top }: Props) => {
  return (
    <div
      className="absolute z-[1200] min-w-40 overflow-hidden rounded-md border border-slate-200 bg-white py-1 text-sm text-slate-900 shadow-lg"
      style={{ left, top }}
      onClick={(event) => event.stopPropagation()}
      onContextMenu={(event) => event.preventDefault()}
    >
      <button
        type="button"
        className="block w-full px-4 py-2 text-left hover:bg-slate-100 focus:bg-slate-100 focus:outline-none"
        onClick={onRemove}
      >
        Vymazat bod
      </button>
    </div>
  )
}
