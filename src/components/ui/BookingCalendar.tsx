// src/components/ui/BookingCalendar.tsx

"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, startOfToday, addMonths, subMonths } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingCalendarProps {
  bookedDates: Date[];
  onDateSelect: (date: Date) => void;
  selectedDate?: Date | null;
  startDate?: Date | null;
  endDate?: Date | null;
}

export default function BookingCalendar({
  bookedDates,
  onDateSelect,
  selectedDate,
  startDate,
  endDate,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const isDateBooked = (date: Date) => {
    return bookedDates.some((booked) => isSameDay(booked, date));
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfToday();
    return isBefore(date, today) || isDateBooked(date);
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;
    onDateSelect(date);
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return isSameDay(date, selectedDate);
  };

  const isInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    const dateTime = date.getTime();
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    return dateTime > startTime && dateTime < endTime;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      {/* Заголовок с навигацией */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {format(currentMonth, "LLLL yyyy", { locale: ru })}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
            type="button"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
            type="button"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Дни недели */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Дни месяца */}
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((date) => {
          const booked = isDateBooked(date);
          const disabled = isDateDisabled(date);
          const selected = isSelected(date);
          const inRange = isInRange(date);
          const today = isToday(date);
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;

          return (
            <button
              key={date.toString()}
              onClick={() => handleDateClick(date)}
              disabled={disabled}
              type="button"
              className={cn(
                "relative p-2 text-sm rounded-lg transition-all duration-200",
                "hover:bg-accent/10",
                // ЗАНЯТЫЕ ДАТЫ - КРАСНОЕ ОКОШКО
                booked && "bg-red-500/20 text-red-500 font-medium",
                disabled && !booked && "opacity-40 cursor-not-allowed",
                selected && "bg-accent text-accent-foreground hover:bg-accent",
                inRange && !selected && "bg-accent/20",
                today && !selected && !booked && "border-2 border-accent",
                isWeekend && !disabled && !booked && "text-muted-foreground"
              )}
            >
              {format(date, "d")}
              {/* Красная точка для занятых дат */}
              {booked && (
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Легенда */}
      <div className="mt-4 flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/30" />
          <span className="text-muted-foreground">Занято</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-accent/20 border border-accent/30" />
          <span className="text-muted-foreground">Выбрано</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border-2 border-accent" />
          <span className="text-muted-foreground">Сегодня</span>
        </div>
      </div>
    </div>
  );
}