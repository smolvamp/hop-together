import { Room, User } from './index';

export type RootStackParamList = {
  Home: undefined;
  TagRide: undefined;
  Chat: {
    roomId: string;
    participants: User[];
  };
  Matching: undefined;
}; 