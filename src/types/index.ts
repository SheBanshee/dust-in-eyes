export interface CarImage {
  id: number;
  carId: number;
  url: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  seats: number;
  fuelType: string;
  horsepower: number;
  drivetrain: string;
  engineVolume: number;
  pricePerDay: number;
  description: string;
  available: boolean;
  images: CarImage[];
  videoUrl?: string | null;
}

export interface Booking {
  id: number;
  userId: string;
  carId: number;
  startDate: string;
  endDate: string;
  phone: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
  car?: Car;
}

export interface Consultation {
  id: number;
  name: string;
  phone: string;
  createdAt: string;
}
