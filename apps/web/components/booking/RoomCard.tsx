import { Room } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Wifi, Tv, Wind, Star, Users, ShoppingBag } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  onBook: (room: Room) => void;
  nights?: number;
}

const amenityIcons: Record<string, React.ElementType> = {
  'Wi-Fi': Wifi,
  'TV': Tv,
  'Điều hòa': Wind,
};

export function RoomCard({ room, onBook, nights = 1 }: RoomCardProps) {
  const totalPrice = room.pricePerNight * nights;

  return (
    <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
      !room.available ? 'opacity-60' : 'border-gray-100'
    }`}>
      {/* Image placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: `url(https://picsum.photos/400/200?random=${room.id})` }}
        />
        <div className="absolute top-3 left-3">
          <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
            {room.type}
          </span>
        </div>
        {!room.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-sm">
              Đã Đặt
            </span>
          </div>
        )}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-bold text-gray-800">4.8</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{room.name}</h3>
        {room.description && (
          <p className="text-gray-500 text-sm mb-3 line-clamp-2">{room.description}</p>
        )}

        {/* Capacity */}
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <Users className="w-4 h-4" />
          <span>Tối đa {room.capacity} khách</span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {room.amenities.slice(0, 4).map((amenity) => {
            const Icon = amenityIcons[amenity];
            return (
              <span
                key={amenity}
                className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md"
              >
                {Icon && <Icon className="w-3 h-3" />}
                {amenity}
              </span>
            );
          })}
          {room.amenities.length > 4 && (
            <span className="text-xs text-gray-400 py-1">+{room.amenities.length - 4} khác</span>
          )}
        </div>

        {/* Price & Book */}
        <div className="flex items-end justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-2xl font-extrabold text-primary">
              {formatCurrency(room.pricePerNight)}
            </p>
            <p className="text-xs text-gray-400">/đêm{nights > 1 ? ` • ${nights} đêm = ${formatCurrency(totalPrice)}` : ''}</p>
          </div>
          <Button
            onClick={() => onBook(room)}
            disabled={!room.available}
            size="sm"
            rightIcon={<ShoppingBag className="w-4 h-4" />}
          >
            {room.available ? 'Đặt Ngay' : 'Hết Phòng'}
          </Button>
        </div>
      </div>
    </div>
  );
}
