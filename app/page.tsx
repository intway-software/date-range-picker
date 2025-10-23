"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { DateRangePicker, type DateRangePreset } from "@/components/date-range-picker"
import { startOfDay, endOfDay, subDays, startOfMonth } from "date-fns"

export default function Home() {
  const [date, setDate] = useState<DateRange | undefined>()
  const [locale, setLocale] = useState<"en" | "es">("es")

  const customPresets: DateRangePreset[] = [
    {
      label: locale === "es" ? "Hoy" : "Today",
      getValue: () => {
        const today = startOfDay(new Date())
        return { from: today, to: endOfDay(today) }
      },
    },
    {
      label: locale === "es" ? "Últimos 7 días" : "Last 7 days",
      getValue: () => {
        const today = startOfDay(new Date())
        return { from: subDays(today, 6), to: endOfDay(today) }
      },
    },
    {
      label: locale === "es" ? "Mes actual" : "Current month",
      getValue: () => {
        const today = startOfDay(new Date())
        return { from: startOfMonth(today), to: endOfDay(today) }
      },
    },
  ]

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Date Range Picker</h1>
          <p className="text-sm text-muted-foreground">Selecciona un rango de fechas compacto y responsive</p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setLocale("es")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                locale === "es" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              Español
            </button>
            <button
              onClick={() => setLocale("en")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                locale === "en" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              English
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Con presets por defecto</label>
            <DateRangePicker
              date={date}
              onDateChange={setDate}
              locale={locale}
              todayColor="bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100"
              rangeColor="bg-blue-500 text-white"
              rangeMiddleColor="bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
              normalDayColor="text-foreground"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Con presets personalizados</label>
            <DateRangePicker
              date={date}
              onDateChange={setDate}
              locale={locale}
              presets={customPresets}
              todayColor="bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100"
              rangeColor="bg-purple-500 text-white"
              rangeMiddleColor="bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100"
              normalDayColor="text-foreground"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sin presets</label>
            <DateRangePicker
              date={date}
              onDateChange={setDate}
              locale={locale}
              showPresets={false}
              todayColor="bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100"
              rangeColor="bg-orange-500 text-white"
              rangeMiddleColor="bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-100"
              normalDayColor="text-foreground"
            />
          </div>

          {date?.from && (
            <div className="rounded-lg border bg-card p-4">
              <p className="text-xs text-muted-foreground">Fecha seleccionada:</p>
              <p className="mt-1 text-sm font-medium">
                {date.from.toLocaleDateString(locale === "es" ? "es-ES" : "en-US")}
                {date.to && ` - ${date.to.toLocaleDateString(locale === "es" ? "es-ES" : "en-US")}`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
