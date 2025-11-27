"use client";

import React from "react";
import Image from "next/image";
import { ExternalLink, Users, Bed, Wifi, Car, Coffee, Star } from "lucide-react";
import { palette } from "@/lib/palette";
import { useTranslation } from "@/utils/useTranslation";

interface AccommodationRoom {
  id: number;
  name: string;
  guests: number;
  description: string;
  amenities: string[];
  image: string;
  extraFees?: boolean;
}

const Accommodations: React.FC = () => {
  const { t } = useTranslation();
  const accommodationRooms: AccommodationRoom[] = t("room") as unknown as AccommodationRoom[];

  const [availabilityMap, setAvailabilityMap] = React.useState<Record<number, number>>({});
  const [roomPrice, setRoomPrice] = React.useState<Record<number, number>>({});

  React.useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/rooms`);
        const data = await res.json();

        if (data.success) {
          const mapAvailable: Record<number, number> = {};
          const mapPrice: Record<number, number> = {};
          data.data.forEach((room: { id: number; available: number }) => {
            mapAvailable[room.id] = room.available;
          });
          data.data.forEach((room: { id: number; price: number }) => {
            mapPrice[room.id] = room.price;
          });
          setAvailabilityMap(mapAvailable);
          setRoomPrice(mapPrice);
        }
      } catch (err) {
        console.error("Error fetching room availability:", err);
      }
    };

    fetchAvailability();
  }, []);

  const handleVisitWebsite = () => {
    window.open("https://grandresortandresidencesbz.com/", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full py-8 px-4" style={{ backgroundColor: palette.background }}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" 
               style={{ backgroundColor: palette.hobbyBg }}>
            <Bed size={32} style={{ color: palette.primary }} />
          </div>
          <h2 className="text-4xl font-bold mb-4" style={{ color: palette.text }}>
            {t('conferenceAccommodations')}
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-6" style={{ color: palette.textSecondary }}>
            {t('roomChoice')}
          </p>

          {/* Venue Info */}
          <div className="inline-flex items-center justify-center p-6 rounded-2xl mb-8"
               style={{ backgroundColor: palette.lightOrange, border: `2px solid ${palette.cardBorder}` }}>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <h3 className="text-2xl font-bold" style={{ color: palette.text }}>
                  Grand Resort & Residences Belize
                </h3>
              </div>
              <div className="flex items-center justify-center space-x-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={palette.primary} style={{ color: palette.primary }} />
                ))}
              </div>
              <button
                onClick={handleVisitWebsite}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
                  color: palette.white
                }}
              >
                <span>{t('resortWebsite')}</span>
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-6">
          {accommodationRooms.map((room) => {
            const available = availabilityMap[room.id] ?? null;
            const price = roomPrice[room.id] ?? null;

            return (
              <div
                key={room.id}
                className={`relative rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 group ${
                  room.extraFees ? "ring-2 ring-offset-4" : ""
                }`}
                style={{
                  backgroundColor: palette.cardBg,
                  boxShadow: room.extraFees
                    ? `0 25px 50px -12px rgba(60, 196, 255, 0.25)`
                    : palette.cardShadow,
                  transform: room.extraFees ? "translateY(-8px)" : "translateY(0)",
                  opacity: available === 0 ? 0.6 : 1,
                }}
              >
                {/* Availability Badges */}
                {available == 0 && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="px-3 py-1 rounded-full text-sm font-bold shadow-md bg-red-600 text-white">
                      {t("soldOut")}
                    </div>
                  </div>
                )}
                {available != null && available > 0 && available < 5 && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="px-3 py-1 rounded-full text-sm font-semibold shadow-md bg-yellow-500 text-white">
                      {available} {t("left")}
                    </div>
                  </div>
                )}

                {/* Image */}
                <div className="relative h-64 overflow-hidden" style={{ backgroundColor: palette.hobbyBg }}>
                  {room.image ? (
                    <Image src={`/${room.image}`} alt="Room" fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Bed size={48} style={{ color: palette.primary }} className="mx-auto mb-2" />
                      <p className="text-sm font-medium" style={{ color: palette.hobbyText }}>
                        Room Photo Coming Soon
                      </p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold" style={{ color: palette.text }}>
                      {room.name}
                    </h3>
                    <div className="flex items-center space-x-1 px-3 py-1 rounded-full" style={{ backgroundColor: palette.hobbyBg }}>
                      <Users size={14} style={{ color: palette.primary }} />
                      <span className="text-sm font-semibold" style={{ color: palette.hobbyText }}>
                        {room.guests} {t("guests")}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm mb-6" style={{ color: palette.textSecondary }}>
                    {room.description}
                  </p>

                  {/* Amenities + Price */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold" style={{ color: palette.text }}>
                        {t("roomAmenities")}
                      </h4>

                      {price && (
                        <div className="flex flex-col items-end">
                          <span className="text-4xl font-bold" style={{ color: palette.primary }}>
                            ${price.toLocaleString()} USD
                          </span>
                          <span className="text-xl" style={{ color: palette.primary }}>
                            {t("perPerson")}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {room.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.primary }} />
                          <span className="text-sm" style={{ color: palette.text }}>
                            {amenity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hover Glow */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Resort Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[{ icon: Wifi, label: t("wifi") }, { icon: Car, label: t("parking") }, { icon: Coffee, label: t("restaurant") }, { icon: Users, label: t("facilities") }].map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-2xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: palette.hobbyBg }}>
              <feature.icon size={32} style={{ color: palette.primary }} className="mx-auto mb-3" />
              <p className="font-semibold" style={{ color: palette.hobbyText }}>
                {feature.label}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center p-6 rounded-2xl" style={{ backgroundColor: palette.lightOrange }}>
          <p className="text-sm font-medium mb-2" style={{ color: palette.hobbyText }}>
            {t('roomExtras')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Accommodations;
