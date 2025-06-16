export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  roomId: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'location';
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface RoomMetadata {
  destination: Location;
  pickupPoint: Location;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  rideType: 'auto' | 'cab' | 'any';
  scheduledTime: Date;
}

export interface Room {
  id: string;
  type: 'private' | 'group';
  name: string;
  participants: User[];
  createdAt: Date;
  updatedAt: Date;
  metadata: RoomMetadata;
} 