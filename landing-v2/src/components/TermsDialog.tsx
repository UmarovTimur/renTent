"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * Footer link that opens the site's terms of use in a Base UI dialog, styled
 * as a cream card over a blurred charcoal backdrop.
 */
export function TermsDialog() {
  const t = useI18n().t.terms;
  return (
    <Dialog.Root>
      <Dialog.Trigger className="cursor-pointer transition-opacity hover:opacity-60">
        {t.trigger}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[100] bg-charcoal/60 backdrop-blur-sm transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-[101] flex max-h-[min(85vh,52rem)] w-[calc(100vw-2rem)] max-w-[44rem] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-cream text-charcoal shadow-2xl transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] data-[ending-style]:translate-y-[calc(-50%+1.5rem)] data-[ending-style]:opacity-0 data-[starting-style]:translate-y-[calc(-50%+1.5rem)] data-[starting-style]:opacity-0">
          <div className="flex items-start justify-between gap-6 border-b border-charcoal/10 p-6 md:px-10 md:pt-9">
            <div>
              <Dialog.Title className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-medium leading-[1.05] tracking-[-0.02em]">
                {t.trigger}
              </Dialog.Title>
              <Dialog.Description className="mt-2 font-text text-sm text-charcoal/60">
                {t.updated}
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label={t.close}
              className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-charcoal/20 font-text text-xl transition-colors hover:bg-charcoal hover:text-cream"
            >
              ×
            </Dialog.Close>
          </div>

          {/* data-lenis-prevent: let the wheel scroll this box instead of the page */}
          <div data-lenis-prevent className="overflow-y-auto overscroll-contain p-6 md:px-10 md:pb-10">
            <div className="flex flex-col gap-7">
              {t.sections.map((section, i) => (
                <section key={section.title}>
                  <h3 className="font-display text-lg font-medium">
                    <span className="mr-2 text-charcoal/40">{String(i + 1).padStart(2, "0")}</span>
                    {section.title}
                  </h3>
                  {section.body.map((p) => (
                    <p key={p} className="mt-2 font-text text-[0.95rem] leading-relaxed text-charcoal/75">
                      {p}
                    </p>
                  ))}
                </section>
              ))}
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
