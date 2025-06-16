import { Room, Message, User } from '../types';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
];

const mockRooms: Room[] = [
  {
    id: '1',
    type: 'group',
    name: "Let's go to the mall",
    participants: [mockUsers[0], mockUsers[1]],
    createdAt: new Date('2024-01-20T10:00:00'),
    updatedAt: new Date('2024-01-20T10:00:00'),
    metadata: {
      destination: {
        latitude: 37.7749,
        longitude: -122.4194,
        address: 'Downtown San Francisco',
      },
      pickupPoint: {
        latitude: 37.7833,
        longitude: -122.4167,
        address: 'Financial District',
      },
      status: 'active',
      rideType: 'auto',
      scheduledTime: new Date('2024-01-20T11:00:00'),
    },
  },
  {
    id: '2',
    type: 'group',
    name: 'Airport Shuttle',
    participants: [mockUsers[0], mockUsers[2]],
    createdAt: new Date('2024-01-20T09:00:00'),
    updatedAt: new Date('2024-01-20T09:00:00'),
    metadata: {
      destination: {
        latitude: 37.6213,
        longitude: -122.3790,
        address: 'San Francisco International Airport',
      },
      pickupPoint: {
        latitude: 37.7833,
        longitude: -122.4167,
        address: 'Financial District',
      },
      status: 'active',
      rideType: 'cab',
      scheduledTime: new Date('2024-01-20T14:00:00'),
    },
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    text: "Hey, I'm on my way!",
    senderId: '2',
    roomId: '1',
    timestamp: new Date('2024-01-20T10:30:00'),
    status: 'read',
    type: 'text',
  },
  {
    id: '2',
    text: "Great, I'll be there in 5 minutes",
    senderId: '1',
    roomId: '1',
    timestamp: new Date('2024-01-20T10:31:00'),
    status: 'sent',
    type: 'text',
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const getRooms = async (): Promise<Room[]> => {
  await delay(1000); // Simulate 1 second network delay
  return [...mockRooms];
};

export const createRoom = async (room: Partial<Room>): Promise<Room> => {
  await delay(1500); // Simulate 1.5 second network delay
  
  const newRoom: Room = {
    id: Date.now().toString(),
    type: room.type || 'group',
    name: room.name || 'New Room',
    participants: room.participants || [],
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: room.metadata || {
      destination: {
        latitude: 0,
        longitude: 0,
        address: '',
      },
      pickupPoint: {
        latitude: 0,
        longitude: 0,
        address: '',
      },
      status: 'pending',
      rideType: 'auto',
      scheduledTime: new Date(),
    },
  };

  mockRooms.push(newRoom);
  return newRoom;
};

export const sendMessage = async (message: Omit<Message, 'id' | 'timestamp' | 'status'>): Promise<Message> => {
  await delay(800); // Simulate 800ms network delay

  const newMessage: Message = {
    ...message,
    id: Date.now().toString(),
    timestamp: new Date(),
    status: 'sent',
  };

  mockMessages.push(newMessage);
  return newMessage;
};

// Helper function to get messages for a room
export const getRoomMessages = async (roomId: string): Promise<Message[]> => {
  await delay(1000);
  return mockMessages.filter(msg => msg.roomId === roomId);
};

// Helper function to get a user by ID
export const getUser = async (userId: string): Promise<User | undefined> => {
  await delay(500);
  return mockUsers.find(user => user.id === userId);
}; 