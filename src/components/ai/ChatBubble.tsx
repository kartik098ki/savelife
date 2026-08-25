import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Bot, User } from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { AiChatMessage } from '../../services/nvidiaAiService';
import { HospitalChatCard } from './HospitalChatCard';
import { Hospital } from '../../services/mockDataService';

interface ChatBubbleProps {
  message: AiChatMessage;
  onBookHospital?: (hospital: Hospital) => void;
  onSelectHospital?: (hospital: Hospital) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  onBookHospital,
  onSelectHospital,
}) => {
  const isUser = message.sender === 'user';
  const handleBook = onBookHospital || onSelectHospital || (() => {});

  // Basic markdown bold formatter
  const renderFormattedText = (rawText: string) => {
    const parts = rawText.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <Text key={index} style={styles.boldText}>
            {part.slice(2, -2)}
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
      ]}
    >
      {!isUser && (
        <View style={styles.avatarBot}>
          <Bot size={16} color="#FFFFFF" />
        </View>
      )}

      <View style={{ flex: 1, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
        <View
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.assistantBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userText : styles.assistantText,
            ]}
          >
            {renderFormattedText(message.text)}
          </Text>

          <Text
            style={[
              styles.timestamp,
              isUser ? styles.userTimestamp : styles.assistantTimestamp,
            ]}
          >
            {message.timestamp}
          </Text>
        </View>

        {/* Optional horizontal hospital card list */}
        {!isUser && message.recommendedHospitals && message.recommendedHospitals.length > 0 && (
          <HospitalChatCard
            hospitals={message.recommendedHospitals}
            onBookAmbulance={handleBook}
          />
        )}
      </View>

      {isUser && (
        <View style={styles.avatarUser}>
          <User size={16} color="#FFFFFF" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 6,
    gap: 8,
    paddingHorizontal: 12,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  assistantContainer: {
    justifyContent: 'flex-start',
  },
  avatarBot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  avatarUser: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.secondaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  bubble: {
    maxWidth: '88%',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: COLORS.secondaryBlue,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: COLORS.primaryLight,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#D8EFE5',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  assistantText: {
    color: '#1A3326',
    fontWeight: '500',
  },
  boldText: {
    fontWeight: '800',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
  },
  assistantTimestamp: {
    color: COLORS.textMuted,
  },
});
