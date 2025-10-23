"use client"

import * as React from "react"
import { CalendarIcon, Check, X } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { format, startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { es, enUS } from "date-fns/locale"
import { type DayButton, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

export type DateRangePreset = {
  label: string
  getValue: () => DateRange
}

interface DateRangePickerProps {
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
  className?: string
  locale?: "en" | "es"
  todayColor?: string
  rangeColor?: string
  rangeMiddleColor?: string
  normalDayColor?: string
  presets?: DateRangePreset[]
  showPresets?: boolean
  acceptText?: string
  cancelText?: string
}

function CustomDayButton({
  className,
  day,
  modifiers,
  todayColor = "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
  rangeColor = "bg-blue-500 text-white",
  rangeMiddleColor = "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100",
  normalDayColor = "text-foreground",
  ...props
}: React.ComponentProps<typeof DayButton> & {
  todayColor?: string
  rangeColor?: string
  rangeMiddleColor?: string
  normalDayColor?: string
}) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  const isInRange = modifiers.range_start || modifiers.range_end || modifiers.range_middle
  const isTodayOnly = modifiers.today && !isInRange

  let dayColorClasses = normalDayColor
  let roundingClasses = ""

  if (modifiers.range_start && modifiers.range_end) {
    dayColorClasses = rangeColor
    roundingClasses = "rounded-full"
  } else if (modifiers.range_start) {
    dayColorClasses = rangeColor
    roundingClasses = "rounded-l-full rounded-r-none"
  } else if (modifiers.range_end) {
    dayColorClasses = rangeColor
    roundingClasses = "rounded-r-full rounded-l-none"
  } else if (modifiers.range_middle) {
    dayColorClasses = rangeMiddleColor
    roundingClasses = "rounded-none"
  } else if (isTodayOnly) {
    dayColorClasses = todayColor
  }

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-today-only={isTodayOnly}
      className={cn(
        // Base styles
        "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal",
        "[&>span]:text-xs [&>span]:opacity-70",
        dayColorClasses,
        roundingClasses,
        isTodayOnly && "font-semibold",
        // Hover states
        "hover:bg-blue-50 hover:text-blue-900 dark:hover:bg-blue-950 dark:hover:text-blue-100",
        (modifiers.range_start || modifiers.range_end) && "hover:bg-blue-600",
        // Focus states
        "group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50",
        "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px]",
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  )
}

export function DateRangePicker({
  date,
  onDateChange,
  className,
  locale = "es",
  todayColor = "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100",
  rangeColor = "bg-blue-500 text-white",
  rangeMiddleColor = "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100",
  normalDayColor = "text-foreground",
  presets,
  showPresets = true,
  acceptText,
  cancelText,
}: DateRangePickerProps) {
  const [tempDate, setTempDate] = React.useState<DateRange | undefined>(date)
  const [open, setOpen] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  const dateLocale = locale === "es" ? es : enUS

  const defaultPresets: DateRangePreset[] = React.useMemo(() => {
    const today = startOfDay(new Date())
    const yesterday = subDays(today, 1)

    return [
      {
        label: locale === "es" ? "Hoy" : "Today",
        getValue: () => ({ from: today, to: endOfDay(today) }),
      },
      {
        label: locale === "es" ? "Ayer" : "Yesterday",
        getValue: () => ({ from: yesterday, to: endOfDay(yesterday) }),
      },
      {
        label: locale === "es" ? "Últimos 7 días" : "Last 7 days",
        getValue: () => ({ from: subDays(today, 6), to: endOfDay(today) }),
      },
      {
        label: locale === "es" ? "Últimos 30 días" : "Last 30 days",
        getValue: () => ({ from: subDays(today, 29), to: endOfDay(today) }),
      },
      {
        label: locale === "es" ? "Mes actual" : "Current month",
        getValue: () => ({ from: startOfMonth(today), to: endOfDay(today) }),
      },
      {
        label: locale === "es" ? "Mes anterior" : "Previous month",
        getValue: () => {
          const lastMonth = subMonths(today, 1)
          return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) }
        },
      },
    ]
  }, [locale])

  const activePresets = presets || defaultPresets

  // Get button text with fallback to localized defaults
  const getAcceptText = () => acceptText || (locale === "es" ? "Aceptar" : "Accept")
  const getCancelText = () => cancelText || (locale === "es" ? "Cancelar" : "Cancel")

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  React.useEffect(() => {
    if (open) {
      setTempDate(date)
    }
  }, [open, date])

  const handleAccept = () => {
    onDateChange?.(tempDate)
    setOpen(false)
  }

  const handleCancel = () => {
    setTempDate(date)
    setOpen(false)
  }

  const handleDateSelect = (newDate: DateRange | undefined) => {
    setTempDate(newDate)
  }

  const handlePresetClick = (preset: DateRangePreset) => {
    const newRange = preset.getValue()
    setTempDate(newRange)
  }

  const CustomDayButtonWithColors = React.useCallback(
    (props: React.ComponentProps<typeof DayButton>) => (
      <CustomDayButton
        {...props}
        todayColor={todayColor}
        rangeColor={rangeColor}
        rangeMiddleColor={rangeMiddleColor}
        normalDayColor={normalDayColor}
      />
    ),
    [todayColor, rangeColor, rangeMiddleColor, normalDayColor],
  )

  return (
    <div className={cn("grid gap-2", className)}>
      <Button
        id="date"
        variant="outline"
        className={cn("h-8 justify-start text-left text-xs font-normal", !date && "text-muted-foreground")}
        onClick={() => setOpen(true)}
      >
        <CalendarIcon className="mr-1.5 size-3.5" />
        {date?.from ? (
          date.to ? (
            <>
              {format(date.from, "dd MMM", { locale: dateLocale })} -{" "}
              {format(date.to, "dd MMM yyyy", { locale: dateLocale })}
            </>
          ) : (
            format(date.from, "dd MMM yyyy", { locale: dateLocale })
          )
        ) : (
          <span>{locale === "es" ? "Seleccionar fechas" : "Select dates"}</span>
        )}
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200"
            onClick={handleCancel}
          />

          <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="overflow-hidden rounded-xl border bg-popover shadow-2xl max-w-[calc(100vw-1rem)] md:max-w-[calc(100vw-2rem)]">
              <div className={cn("flex", isMobile ? "flex-col" : "flex-row gap-0")}>
                {showPresets && activePresets.length > 0 && (
                  <div
                    className={cn("border-border bg-muted/30 p-2 md:p-2.5 lg:p-3", isMobile ? "border-b" : "border-r")}
                  >
                    <div
                      className={cn(
                        "flex gap-2",
                        isMobile ? "flex-row flex-wrap" : "flex-col min-w-[120px] md:min-w-[130px] lg:min-w-[140px]",
                      )}
                    >
                      {activePresets.map((preset, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "justify-start text-xs h-7 font-normal hover:bg-accent",
                            isMobile && "flex-1 min-w-[calc(50%-0.25rem)]",
                          )}
                          onClick={() => handlePresetClick(preset)}
                        >
                          {preset.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className={cn(isMobile ? "w-full max-w-[calc(100vw-2rem)]" : "w-auto")}>
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={tempDate?.from}
                    selected={tempDate}
                    onSelect={handleDateSelect}
                    numberOfMonths={isMobile ? 1 : 2}
                    locale={dateLocale}
                    components={{
                      DayButton: CustomDayButtonWithColors,
                    }}
                    classNames={{
                      months: cn(
                        "flex gap-1 md:gap-1.5 lg:gap-2 p-2 md:p-2.5 lg:p-4",
                        isMobile ? "flex-col" : "flex-col sm:flex-row",
                      ),
                      month: "space-y-3",
                      caption: "flex justify-center pt-1 relative items-center",
                      caption_label: "text-xs font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button: cn("h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity"),
                      table: "w-full border-collapse space-y-1",
                      weekdays: "flex",
                      weekday: "text-muted-foreground rounded-md w-7 font-normal text-[0.7rem]",
                      week: "flex w-full mt-1",
                      day: "text-center text-xs p-0 relative",
                      outside: "text-muted-foreground opacity-50",
                      disabled: "text-muted-foreground opacity-50",
                      hidden: "invisible",
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-1.5 md:gap-2 border-t bg-muted/30 p-2 md:p-2.5 lg:p-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-8 bg-transparent gap-1.5"
                  onClick={handleCancel}
                >
                  <X className="size-3.5" />
                  {getCancelText()}
                </Button>
                <Button
                  size="sm"
                  className="flex-1 text-xs h-8 gap-1.5 bg-blue-500 hover:bg-blue-600"
                  onClick={handleAccept}
                >
                  <Check className="size-3.5" />
                  {getAcceptText()}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
