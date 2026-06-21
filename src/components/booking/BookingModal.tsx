"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z
  .object({
    fullName: z.string().min(2, "Введите ваше ФИО"),
    phone: z.string()
      .min(11, "Номер телефона должен содержать 11 цифр")
      .regex(/^\d+$/, "Номер должен содержать только цифры")
      .regex(/^[0-9]{11}$/, "Введите 11 цифр (без пробелов и знаков)"),
    
    // Паспортные данные
    passportSeries: z
      .string()
      .optional()
      .refine((val) => !val || /^[\d\s]*$/.test(val), {
        message: "Серия паспорта должна содержать только цифры",
      })
      .refine((val) => !val || val.replace(/\s/g, "").length === 4, {
        message: "Серия паспорта должна содержать 4 цифры",
      }),
    passportNumber: z
      .string()
      .optional()
      .refine((val) => !val || /^[\d\s]*$/.test(val), {
        message: "Номер паспорта должен содержать только цифры",
      })
      .refine((val) => !val || val.replace(/\s/g, "").length === 6, {
        message: "Номер паспорта должна содержать 6 цифр",
      }),
    passportIssuedBy: z
      .string()
      .optional()
      .refine((val) => !val || /^[а-яА-ЯёЁ\s\-.,]*$/.test(val), {
        message: "Кем выдан — только русские буквы",
      }),

    // Водительские права
    licenseSeries: z
      .string()
      .optional()
      .refine((val) => !val || /^[\d\s]*$/.test(val), {
        message: "Серия прав должна содержать только цифры",
      })
      .refine((val) => !val || val.replace(/\s/g, "").length === 4, {
        message: "Серия прав должна содержать 4 цифры",
      }),
    licenseNumber: z
      .string()
      .optional()
      .refine((val) => !val || /^[\d\s]*$/.test(val), {
        message: "Номер прав должен содержать только цифры",
      })
      .refine((val) => !val || val.replace(/\s/g, "").length === 6, {
        message: "Номер прав должна содержать 6 цифр",
      }),
    licenseCategory: z
      .string()
      .optional()
      .refine((val) => !val || /^[A-Za-zА-Яа-я]*$/.test(val), {
        message: "Категория — только буквы (A, B, C, D, E)",
      }),

    startDate: z.string().min(1, "Выберите дату начала"),
    endDate: z.string().min(1, "Выберите дату окончания"),
    withDriver: z.boolean().optional().default(false),
    pickupAddress: z.string().min(1, "Выберите способ получения автомобиля"),
    driverGender: z.string().optional(),
    driverAge: z.string().optional(),
    driverHours: z.string().optional(),
    childSeat: z.string().optional(),
    petTransport: z.string().optional(),
    driverComment: z.string().optional(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "Дата окончания должна быть позже даты начала",
    path: ["endDate"],
  });

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carId: number;
  carName: string;
  carSeats: number;
  carDoors: number;
  carBodyType: string;
  deposit?: number;
}

const calculateDriverPrice = (driverHours: string): number => {
  switch (driverHours) {
    case "full": return 7000;
    case "extended": return 10000;
    default: return 5000;
  }
};

export default function BookingModal({ 
  open, 
  onOpenChange, 
  carId, 
  carName, 
  carSeats, 
  carDoors, 
  carBodyType,
  deposit = 10000 
}: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      withDriver: false,
      fullName: "",
      phone: "",
      startDate: "",
      endDate: "",
      passportSeries: "",
      passportNumber: "",
      passportIssuedBy: "",
      licenseSeries: "",
      licenseNumber: "",
      licenseCategory: "",
      pickupAddress: "",
      driverGender: "any",
      driverAge: "middle",
      driverHours: "standard",
      childSeat: "none",
      petTransport: "none",
      driverComment: "",
    },
  });

  const withDriver = watch("withDriver");
  const pickupAddress = watch("pickupAddress");
  const driverHours = watch("driverHours");
  const childSeat = watch("childSeat");
  const petTransport = watch("petTransport");

  const driverBasePrice = withDriver ? calculateDriverPrice(driverHours || "standard") : 0;

  const getPetPrice = (pet: string): number => {
    switch (pet) {
      case "small": return 1500;
      case "medium": return 2000;
      case "large": return 3000;
      default: return 0;
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setServerError(null);
    try {
      // Собираем паспортные данные в одну строку для API
      const passportData = `${data.passportSeries || ""} ${data.passportNumber || ""} ${data.passportIssuedBy || ""}`.trim();
      const licenseData = `${data.licenseSeries || ""} ${data.licenseNumber || ""} ${data.licenseCategory || ""}`.trim();
      
      const payload = {
        ...data,
        passportNumber: passportData,
        driverLicense: licenseData,
      };
      
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, carId }),
      });

      if (!res.ok) {
        const err = await res.json();
        setServerError(err.error || "Ошибка при бронировании");
        return;
      }
      setSubmitted(true);
      reset();
    } catch {
      setServerError("Произошла ошибка. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (v: boolean) => {
    if (!v) {
      setSubmitted(false);
      setServerError(null);
      reset();
    }
    onOpenChange(v);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const maxChildSeats = carSeats <= 2 ? 0 : carSeats <= 4 ? 1 : 2;
  const isTwoDoorCoupe = carDoors === 2 && (carBodyType === "coupe" || carBodyType === "sports");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Забронируйте автомобиль {carName}</DialogTitle>
          <DialogDescription>
            Выберите период бронирования, укажите ваши данные и дополнительные услуги.
            Наш менеджер свяжется с вами в течение 30 минут.
            {isTwoDoorCoupe && (
              <span className="block text-yellow-500 mt-1">Внимание: 2-дверный автомобиль, доступ на задние сиденья ограничен</span>
            )}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="text-center py-6">
            <p className="text-accent font-semibold text-lg mb-2">Заявка отправлена</p>
            <p className="text-muted-foreground text-sm">
              Наш менеджер свяжется с вами в ближайшее время для подтверждения бронирования.
            </p>
            <p className="text-muted-foreground text-xs mt-4">
              Сумма залога: {deposit.toLocaleString()} руб (возвращается после осмотра авто)
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="border-b border-border pb-3">
              <h3 className="font-semibold mb-3">Личные данные</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">ФИО *</label>
                  <Input placeholder="Иванов Иван Иванович" {...register("fullName")} />
                  {errors.fullName && <p className="text-destructive text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Телефон *</label>
                  <Input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    {...register("phone")}
                  />
                  {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              {/* Паспортные данные - 3 отдельных поля */}
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2 text-accent">Паспортные данные</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Серия</label>
                    <Input placeholder="12 34" {...register("passportSeries")} />
                    {errors.passportSeries && (
                      <p className="text-destructive text-xs mt-1">{errors.passportSeries.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Номер</label>
                    <Input placeholder="567890" {...register("passportNumber")} />
                    {errors.passportNumber && (
                      <p className="text-destructive text-xs mt-1">{errors.passportNumber.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Кем выдан</label>
                    <Input placeholder="ОВД г. Москвы" {...register("passportIssuedBy")} />
                    {errors.passportIssuedBy && (
                      <p className="text-destructive text-xs mt-1">{errors.passportIssuedBy.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Водительские права - 3 отдельных поля */}
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2 text-accent">Водительские права</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Серия</label>
                    <Input placeholder="12 34" {...register("licenseSeries")} />
                    {errors.licenseSeries && (
                      <p className="text-destructive text-xs mt-1">{errors.licenseSeries.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Номер</label>
                    <Input placeholder="567890" {...register("licenseNumber")} />
                    {errors.licenseNumber && (
                      <p className="text-destructive text-xs mt-1">{errors.licenseNumber.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Категория</label>
                    <Input placeholder="B" {...register("licenseCategory")} />
                    {errors.licenseCategory && (
                      <p className="text-destructive text-xs mt-1">{errors.licenseCategory.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-border pb-3">
              <h3 className="font-semibold mb-3">Период аренды</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Дата начала *</label>
                  <Input type="date" min={minDate} {...register("startDate")} />
                  {errors.startDate && <p className="text-destructive text-xs mt-1">{errors.startDate.message}</p>}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Дата окончания *</label>
                  <Input type="date" min={minDate} {...register("endDate")} />
                  {errors.endDate && <p className="text-destructive text-xs mt-1">{errors.endDate.message}</p>}
                </div>
              </div>
            </div>

            <div className="border-b border-border pb-3">
              <h3 className="font-semibold mb-3">Дополнительные услуги</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Детское кресло (+1 000 руб)</label>
                  {maxChildSeats === 0 ? (
                    <p className="text-red-500 text-xs">В данный автомобиль невозможно установить детское кресло (2-местный спорткар)</p>
                  ) : (
                    <>
                      <select
                        className="w-full text-sm rounded-md border border-border bg-background p-2"
                        {...register("childSeat")}
                      >
                        <option value="none">Нет</option>
                        <option value="infant">До 1 года (люлька) — +1 000 руб</option>
                        <option value="toddler">1-3 года — +1 000 руб</option>
                        <option value="child">4-7 лет — +1 000 руб</option>
                        <option value="booster">7-12 лет (бустер) — +1 000 руб</option>
                      </select>
                      {isTwoDoorCoupe && (
                        <p className="text-yellow-500 text-xs mt-1">Для установки детского кресла потребуется откинуть переднее сиденье</p>
                      )}
                    </>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Перевозка животных</label>
                  <select
                    className="w-full text-sm rounded-md border border-border bg-background p-2"
                    {...register("petTransport")}
                  >
                    <option value="none">Нет</option>
                    <option value="small">Мелкая порода (до 5 кг) — +1 500 руб</option>
                    <option value="medium">Средняя порода (5-15 кг) — +2 000 руб</option>
                    <option value="large">Крупная порода (15-30 кг) — +3 000 руб</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={withDriver} {...register("withDriver")} className="w-4 h-4" />
                    <span className="text-sm font-medium">Аренда с водителем</span>
                  </label>
                </div>

                {withDriver && (
                  <div className="pl-6 space-y-3 border-l-2 border-accent/30">
                    <div>
                      <label className="text-sm font-medium block mb-2">Режим работы водителя</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" value="standard" {...register("driverHours")} defaultChecked />
                          <span className="text-sm">Стандартный (8 часов) — 5 000 руб</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" value="full" {...register("driverHours")} />
                          <span className="text-sm">Полный день (12 часов) — 7 000 руб</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" value="extended" {...register("driverHours")} />
                          <span className="text-sm">Расширенный (без лимита) — 10 000 руб</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium block mb-2">Пол водителя</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" value="male" {...register("driverGender")} />
                          <span className="text-sm">Мужской</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" value="female" {...register("driverGender")} />
                          <span className="text-sm">Женский</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" value="any" {...register("driverGender")} defaultChecked />
                          <span className="text-sm">Без разницы</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium block mb-2">Возраст водителя</label>
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" value="young" {...register("driverAge")} />
                          <span className="text-sm">25-35 лет</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" value="middle" {...register("driverAge")} defaultChecked />
                          <span className="text-sm">35-50 лет</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" value="senior" {...register("driverAge")} />
                          <span className="text-sm">50+ лет</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium block mb-2">Особые пожелания к водителю</label>
                      <Input 
                        placeholder="Дополнительные требования к водителю"
                        {...register("driverComment")}
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-border/50">
                  <label className="text-sm text-muted-foreground mb-1 block">Способ получения автомобиля *</label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="salon"
                        checked={pickupAddress === "Салон: Москва, Большая Андроновская ул., 23"}
                        onChange={() => setValue("pickupAddress", "Салон: Москва, Большая Андроновская ул., 23")}
                      />
                      <span className="text-sm">Заберу из салона (бесплатно)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="delivery"
                        checked={pickupAddress?.startsWith("Доставка")}
                        onChange={() => setValue("pickupAddress", "Доставка")}
                      />
                      <span className="text-sm">Доставка (3 000 руб)</span>
                    </label>
                  </div>
                  {errors.pickupAddress && <p className="text-destructive text-xs mt-1">{errors.pickupAddress.message}</p>}
                  
                  {pickupAddress?.startsWith("Доставка") && (
                    <div className="mt-2">
                      <label className="text-sm text-muted-foreground mb-1 block">Укажите адрес доставки</label>
                      <Input 
                        placeholder="Улица, дом, подъезд" 
                        onChange={(e) => setValue("pickupAddress", `Доставка (3 000 руб): ${e.target.value}`)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {(childSeat !== "none" || petTransport !== "none" || withDriver) && (
              <div className="bg-accent/10 rounded-lg p-3">
                <p className="text-sm font-medium">Стоимость дополнительных услуг:</p>
                {childSeat !== "none" && (
                  <p className="text-xs text-muted-foreground">Детское кресло: +1 000 руб</p>
                )}
                {petTransport !== "none" && (
                  <p className="text-xs text-muted-foreground">
                    Перевозка животного: +{getPetPrice(petTransport)} руб
                  </p>
                )}
                {withDriver && (
                  <p className="text-xs text-muted-foreground">
                    Услуги водителя: +{driverBasePrice.toLocaleString()} руб
                  </p>
                )}
                <p className="text-sm font-medium mt-1">
                  Итого дополнительно: +{(childSeat !== "none" ? 1000 : 0) + 
                    getPetPrice(petTransport) + 
                    driverBasePrice} руб / сутки
                </p>
              </div>
            )}

            <div className="bg-accent/5 rounded-lg p-3 text-sm">
              <p className="font-medium">Залог: {deposit.toLocaleString()} руб</p>
              <p className="text-xs text-muted-foreground mt-1">
                Возвращается после осмотра автомобиля при его возврате.
              </p>
            </div>

            {serverError && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
                {serverError}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Отправка..." : "Забронировать"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}