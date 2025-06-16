import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Room } from '../types';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { createRoom } from '../utils/mockAPI';

type RootStackParamList = {
  Matching: undefined;
  RoomList: undefined;
};

type TagRideScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Matching'>;

const TagRideScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<TagRideScreenNavigationProp>();
  const [currentLocation, setCurrentLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [mode, setMode] = useState<'auto' | 'cab' | 'any'>('any');
  const [time, setTime] = useState<'now' | '+5' | '+10'>('now');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Create a new room with the ride details
      const newRoom: Partial<Room> = {
        type: 'group',
        name: `Ride to ${destination}`,
        participants: [], // Will be populated when matched
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          destination: {
            latitude: 0, // These would come from a map API
            longitude: 0,
            address: destination,
          },
          pickupPoint: {
            latitude: 0,
            longitude: 0,
            address: currentLocation,
          },
          status: 'pending',
          rideType: mode,
          scheduledTime: time === 'now' ? new Date() : 
            new Date(Date.now() + (time === '+5' ? 5 : 10) * 60 * 1000),
        },
      };

      await createRoom(newRoom);
      navigation.navigate('Matching');
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.formContainer}>
        <Input
          label="Current Location"
          value={currentLocation}
          onChangeText={setCurrentLocation}
          placeholder="Enter your current location"
        />

        <Input
          label="Destination"
          value={destination}
          onChangeText={setDestination}
          placeholder="Enter your destination"
        />

        <View style={styles.pickerContainer}>
          <Input
            label="Mode of Transport"
            value={mode}
            onChangeText={(value) => setMode(value as 'auto' | 'cab' | 'any')}
            placeholder="Select mode"
          />
        </View>

        <View style={styles.pickerContainer}>
          <Input
            label="Time"
            value={time}
            onChangeText={(value) => setTime(value as 'now' | '+5' | '+10')}
            placeholder="Select time"
          />
        </View>

        <Button
          title={loading ? 'Creating Ride...' : 'Create Ride'}
          onPress={handleSubmit}
          variant="primary"
          loading={loading}
          disabled={loading || !currentLocation || !destination}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    padding: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
});

export default TagRideScreen; 