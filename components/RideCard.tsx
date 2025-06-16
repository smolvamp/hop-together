import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Card from './Card';
import Badge from './Badge';
import Avatar from './Avatar';
import { Room } from '../types';

interface RideCardProps {
  room: Room;
  distance?: string;
  style?: ViewStyle;
}

const RideCard: React.FC<RideCardProps> = ({ room, distance, style }) => {
  const { theme } = useTheme();

  const getRideTypeIcon = (type: string): string => {
    switch (type) {
      case 'auto':
        return '🛺';
      case 'cab':
        return '🚕';
      default:
        return '🚗';
    }
  };

  const getTimeLeft = (scheduledTime: Date): string => {
    const now = new Date();
    const diff = scheduledTime.getTime() - now.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 0) return 'Expired';
    if (minutes < 60) return `${minutes}m left`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m left`;
  };

  return (
    <Card style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {room.metadata.destination.address}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.secondary }]}>
            From: {room.metadata.pickupPoint.address}
          </Text>
        </View>
        <Badge
          label={getTimeLeft(room.metadata.scheduledTime)}
          variant={room.metadata.status === 'active' ? 'success' : 'warning'}
          size="sm"
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.participantsContainer}>
          <View style={styles.avatarRow}>
            {room.participants.slice(0, 3).map((participant, index) => (
              <Avatar
                key={participant.id}
                source={participant.avatar}
                initials={participant.name.split(' ').map(n => n[0]).join('')}
                size="sm"
                style={[
                  styles.avatar,
                  { marginLeft: index > 0 ? -theme.spacing.xs : 0 }
                ]}
              />
            ))}
          </View>
          <Text style={[styles.participantCount, { color: theme.colors.secondary }]}>
            {room.participants.length} {room.participants.length === 1 ? 'person' : 'people'}
          </Text>
        </View>

        <View style={styles.metadataContainer}>
          <Text style={[styles.rideType, { color: theme.colors.secondary }]}>
            {getRideTypeIcon(room.metadata.rideType)} {room.metadata.rideType}
          </Text>
          {distance && (
            <Text style={[styles.distance, { color: theme.colors.secondary }]}>
              {distance}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarRow: {
    flexDirection: 'row',
    marginRight: 8,
  },
  avatar: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  participantCount: {
    fontSize: 12,
  },
  metadataContainer: {
    alignItems: 'flex-end',
  },
  rideType: {
    fontSize: 12,
    marginBottom: 2,
  },
  distance: {
    fontSize: 12,
  },
});

export default RideCard; 