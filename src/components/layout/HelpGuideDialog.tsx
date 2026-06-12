import { HelpCircle, X } from "lucide-react"
import { useEffect, useId, useRef } from "react"

import { Button } from "@/components/ui/button"
import { helpGuides } from "@/lib/helpGuideContent"
import type { Language } from "@/lib/i18n"

type Props = {
  language: Language
  onOpenChange: (open: boolean) => void
  open: boolean
}

export const HelpGuideDialog = ({ language, onOpenChange, open }: Props) => {
  const guide = helpGuides[language]
  const titleId = useId()
  const descriptionId = useId()
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus())
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false)
    }

    document.addEventListener("keydown", onKeyDown)

    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [onOpenChange, open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[3200] flex items-center justify-center bg-slate-950/55 p-2 sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onOpenChange(false)
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="flex max-h-[calc(100dvh-1rem)] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white text-slate-950 shadow-2xl sm:max-h-[calc(100dvh-2rem)]"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <HelpCircle className="size-5 shrink-0 text-blue-700" />
              <h2 id={titleId} className="truncate text-lg font-semibold">
                {guide.title}
              </h2>
            </div>
            <p id={descriptionId} className="mt-1 text-sm leading-6 text-slate-600">
              {guide.subtitle}
            </p>
          </div>
          <Button
            ref={closeButtonRef}
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onOpenChange(false)}
            aria-label={guide.close}
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {guide.sections.map((section) => (
              <section
                key={section.title}
                className="rounded-md border border-slate-200 bg-slate-50 p-4"
              >
                <h3 className="text-sm font-semibold text-slate-900">{section.title}</h3>
                <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>

          <section className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-4">
            <h3 className="text-sm font-semibold text-blue-950">{guide.tipsTitle}</h3>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-blue-950/85">
              {guide.tips.map((tip) => (
                <li key={tip} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-700" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
