import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Room } from '../types';
import { getRooms } from '../utils/mockAPI';
import Button from '../components/Button';
import RideCard from '../components/RideCard';

type RootStackParamList = {
  TagRide: undefined;
  Chat: { roomId: string; participants: any[] };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TagRide'>;

const HomeScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const fetchedRooms = await getRooms();
      setRooms(fetchedRooms);
    } catch (error) {
      console.error('Error loading rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Room }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Chat', { 
        roomId: item.id,
        participants: item.participants
      })}
    >
      <RideCard
        room={item}
        distance="0.2 km away" // This would come from a location service
      />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: theme.colors.text }]}>Nearby Rides</Text>
        <Button
          title="Create Ride"
          onPress={() => navigation.navigate('TagRide')}
          variant="primary"
        />
      </View>
      <FlatList
        data={rooms}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
});

export default HomeScreen; 