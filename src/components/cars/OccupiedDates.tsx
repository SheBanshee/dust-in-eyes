"use client";

interface OccupiedDatesProps {
  dates: { start: string; end: string }[];
}

export default function OccupiedDates({ dates }: OccupiedDatesProps) {
  if (dates.length === 0) {
    return (
      <div className="bg-green-500/10 text-green-500 px-3 py-2 rounded-md text-sm">
        Автомобиль свободен
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Занят:</p>
      <div className="flex flex-wrap gap-2">
        {dates.map((date, index) => (
          <div
            key={index}
            className="bg-red-500/10 text-red-500 px-3 py-1 rounded-md text-sm border border-red-500/20"
          >
            {date.start} — {date.end}
          </div>
        ))}
      </div>
    </div>
  );
}