"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import BookingModal from "@/components/booking/BookingModal";

interface Props {
  carId: number;
  carName: string;
  carSeats: number;
  carDoors: number;
  carBodyType: string;
}

export default function CarDetailClient({ 
  carId, 
  carName, 
  carSeats, 
  carDoors, 
  carBodyType 
}: Props) {
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
        carSeats={carSeats}
        carDoors={carDoors}
        carBodyType={carBodyType}
        deposit={10000}
      />
    </>
  );
}