import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Message, User } from '../types';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import { getRoomMessages, sendMessage, getUser } from '../utils/mockAPI';
import { Ionicons } from '@expo/vector-icons';

interface ChatScreenProps {
  route: {
    params: {
      roomId: string;
      participants: User[];
      destination: string;
      departureTime: Date;
    };
  };
  navigation: any;
}

// Sample data for demonstration
const currentUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://i.pravatar.cc/150?img=1',
};

const ChatScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');
  const scrollViewRef = React.useRef<ScrollView>(null);

  useEffect(() => {
    loadMessages();
    const timer = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [route.params.roomId]);

  const updateTimeLeft = () => {
    if (!route.params?.departureTime) {
      setTimeLeft('No departure time set');
      return;
    }

    const now = new Date();
    const departureTime = new Date(route.params.departureTime);
    const diff = departureTime.getTime() - now.getTime();
    
    if (diff <= 0) {
      setTimeLeft('Departure time reached');
      return;
    }
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      const roomMessages = await getRoomMessages(route.params.roomId);
      setMessages(roomMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const message = await sendMessage({
          text: newMessage,
          senderId: currentUser.id,
          roomId: route.params.roomId,
          type: 'text',
        });
        setMessages(prev => [...prev, message]);
        setNewMessage('');
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const sendQuickAction = async (action: string) => {
    try {
      const message = await sendMessage({
        text: action,
        senderId: currentUser.id,
        roomId: route.params.roomId,
        type: 'text',
      });
      setMessages(prev => [...prev, message]);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (error) {
      console.error('Error sending quick action:', error);
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.destination, { color: theme.colors.text }]}>
            {route.params?.destination || 'No destination set'}
          </Text>
          <Text style={[styles.timer, { color: theme.colors.primary }]}>
            {timeLeft}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((message) => {
            const isOwnMessage = message.senderId === currentUser.id;
            const sender = isOwnMessage ? currentUser : route.params.participants.find(p => p.id === message.senderId);

            return (
              <View
                key={message.id}
                style={[
                  styles.messageWrapper,
                  isOwnMessage ? styles.myMessageWrapper : styles.otherMessageWrapper,
                ]}
              >
                {!isOwnMessage && (
                  <Avatar
                    source={sender?.avatar}
                    initials={sender?.name.split(' ').map(n => n[0]).join('')}
                    size="sm"
                    style={styles.avatar}
                  />
                )}
                <View
                  style={[
                    styles.messageBubble,
                    isOwnMessage ? styles.myMessage : styles.otherMessage,
                    {
                      backgroundColor: isOwnMessage ? theme.colors.primary : theme.colors.card,
                    },
                  ]}
                >
                  {!isOwnMessage && (
                    <Text style={[styles.senderName, { color: theme.colors.text }]}>
                      {sender?.name}
                    </Text>
                  )}
                  <Text style={[styles.messageText, { color: isOwnMessage ? theme.colors.card : theme.colors.text }]}>
                    {message.text}
                  </Text>
                  <Text style={[styles.timestamp, { color: isOwnMessage ? theme.colors.card : theme.colors.text }]}>
                    {formatTime(message.timestamp)}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={[styles.quickActions, { backgroundColor: theme.colors.card }]}>
          <Button
            title="I'm here"
            onPress={() => sendQuickAction("I'm here")}
            variant="outline"
            size="sm"
          />
          <Button
            title="Running late"
            onPress={() => sendQuickAction('Running late')}
            variant="outline"
            size="sm"
          />
          <Button
            title="Ready to go"
            onPress={() => sendQuickAction('Ready to go')}
            variant="outline"
            size="sm"
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
              },
            ]}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.placeholder}
            multiline
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}
          >
            <Ionicons name="send" size={20} color={theme.colors.card} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerContent: {
    flex: 1,
  },
  destination: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  timer: {
    fontSize: 14,
    fontWeight: '500',
  },
  keyboardView: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  myMessageWrapper: {
    alignSelf: 'flex-end',
  },
  otherMessageWrapper: {
    alignSelf: 'flex-start',
  },
  avatar: {
    marginRight: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '100%',
  },
  myMessage: {
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '600',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.7,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  input: {
    flex: 1,
    marginRight: 12,
    padding: 12,
    borderRadius: 20,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen; 