"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import BookingModal from "@/components/booking/BookingModal";

interface Props {
  carId: number;
  carName: string;
}

export default function CarDetailClient({ carId, carName }: Props) {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <>
      <Button size="lg" className="w-full text-base" onClick={() => setBookingOpen(true)}>
        Забронировать автомобиль
      </Button>
      <BookingModal
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        carId={carId}
        carName={carName}
      />
    </>
  );
}
