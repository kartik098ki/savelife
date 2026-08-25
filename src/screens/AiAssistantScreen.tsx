import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {
  ArrowLeft,
  Send,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  HeartPulse,
  StopCircle,
  RefreshCw,
  Zap,
} from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { useChatStore } from '../store/useChatStore';
import { useBookingStore } from '../store/useBookingStore';
import { ChatBubble } from '../components/ai/ChatBubble';
import { Hospital } from '../services/mockDataService';
import { soundService } from '../services/soundService';

export const AiAssistantScreen: React.FC = () => {
  const { messages, isLoading, quickPrompts, sendMessage, resetChat } = useChatStore();
  const { pickupLocation, setSelectedHospital, confirmBookingAndSearch, setCurrentScreen } = useBookingStore();

  const [inputVal, setInputVal] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [metronomeCount, setMetronomeCount] = useState(0);
  const [metronomeVisualPulse, setMetronomeVisualPulse] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 150);

    // Speak last assistant message
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.sender === 'assistant' && lastMsg.text) {
      soundService.speakText(lastMsg.text);
    }
  }, [messages, isLoading]);

  // Clean up CPR metronome on unmount
  useEffect(() => {
    return () => {
      soundService.stopCprMetronome();
    };
  }, []);

  const toggleMetronome = () => {
    if (isMetronomeActive) {
      soundService.stopCprMetronome();
      setIsMetronomeActive(false);
      setMetronomeCount(0);
    } else {
      setIsMetronomeActive(true);
      setMetronomeCount(1);
      soundService.startCprMetronome(() => {
        setMetronomeCount((prev) => prev + 1);
        setMetronomeVisualPulse(true);
        setTimeout(() => setMetronomeVisualPulse(false), 120);
      });
    }
  };

  const handleVoiceInput = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice STT is not supported on this browser. Please type your message.');
      return;
    }

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputVal(transcript);
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const text = inputVal;
    setInputVal('');
    sendMessage(text, pickupLocation.latitude, pickupLocation.longitude);
  };

  const handleQuickPrompt = (promptText: string) => {
    sendMessage(promptText, pickupLocation.latitude, pickupLocation.longitude);
  };

  const handleDirectBookFromAi = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    confirmBookingAndSearch();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.8}
            onPress={() => setCurrentScreen('home')}
          >
            <ArrowLeft size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerTitleCol}>
            <View style={styles.titleBadgeRow}>
              <Text style={styles.headerTitle}>SaveLife Medical AI</Text>
              <View style={styles.liveAiBadge}>
                <Sparkles size={10} color="#FFFFFF" />
                <Text style={styles.liveAiBadgeText}>NVIDIA NIM</Text>
              </View>
            </View>
            <Text style={styles.headerSubtitle}>24/7 Emergency Triage & Voice Guidance</Text>
          </View>

          <TouchableOpacity
            style={styles.resetBtn}
            activeOpacity={0.8}
            onPress={resetChat}
          >
            <RefreshCw size={16} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* CPR Metronome Live Emergency Tool */}
        <View
          style={[
            styles.metronomeBanner,
            isMetronomeActive && styles.metronomeBannerActive,
            metronomeVisualPulse && styles.metronomeFlash,
          ]}
        >
          <View style={styles.metronomeLeft}>
            <HeartPulse
              size={22}
              color={isMetronomeActive ? '#FFFFFF' : COLORS.alertRed}
            />
            <View>
              <Text
                style={[
                  styles.metronomeTitle,
                  isMetronomeActive && { color: '#FFFFFF' },
                ]}
              >
                {isMetronomeActive ? `CPR Metronome: ${metronomeCount} Compressions (110 BPM)` : 'Emergency CPR Metronome'}
              </Text>
              <Text
                style={[
                  styles.metronomeSub,
                  isMetronomeActive && { color: 'rgba(255,255,255,0.9)' },
                ]}
              >
                Push hard & fast 5cm deep in chest center
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.metronomeBtn,
              isMetronomeActive && styles.metronomeBtnActive,
            ]}
            onPress={toggleMetronome}
          >
            {isMetronomeActive ? (
              <StopCircle size={16} color={COLORS.alertRed} />
            ) : (
              <Zap size={16} color="#FFFFFF" />
            )}
            <Text
              style={[
                styles.metronomeBtnText,
                isMetronomeActive && { color: COLORS.alertRed },
              ]}
            >
              {isMetronomeActive ? 'Stop' : 'Start CPR'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Triage Prompt Chips */}
        <View style={styles.quickPromptsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickPromptsScroll}
          >
            {quickPrompts.map((prompt, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.promptChip}
                activeOpacity={0.8}
                onPress={() => handleQuickPrompt(prompt)}
              >
                <Text style={styles.promptChipText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Chat Message List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatBubble
              message={item}
              onBookHospital={handleDirectBookFromAi}
            />
          )}
          contentContainerStyle={styles.chatListContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isLoading ? (
              <View style={styles.typingIndicatorBox}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.typingText}>SaveLife AI is analyzing emergency symptoms...</Text>
              </View>
            ) : null
          }
        />

        {/* Voice & Text Input Bar */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={[styles.micBtn, isRecording && styles.micBtnRecording]}
            activeOpacity={0.8}
            onPress={handleVoiceInput}
          >
            {isRecording ? (
              <MicOff size={18} color="#FFFFFF" />
            ) : (
              <Mic size={18} color={COLORS.secondaryBlue} />
            )}
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder={isRecording ? 'Listening to voice...' : 'Describe emergency or ask for ICU...'}
            placeholderTextColor={COLORS.textPlaceholder}
            value={inputVal}
            onChangeText={setInputVal}
            onSubmitEditing={handleSend}
          />

          <TouchableOpacity
            style={[styles.sendBtn, !inputVal.trim() && styles.sendBtnDisabled]}
            activeOpacity={0.8}
            onPress={handleSend}
            disabled={!inputVal.trim()}
          >
            <Send size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCol: {
    flex: 1,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  liveAiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  liveAiBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  resetBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metronomeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF1F2',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE4E6',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  metronomeBannerActive: {
    backgroundColor: COLORS.alertRed,
    borderBottomColor: COLORS.alertRedHover,
  },
  metronomeFlash: {
    backgroundColor: '#FF5252',
  },
  metronomeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  metronomeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  metronomeSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  metronomeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.alertRed,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  metronomeBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  metronomeBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  quickPromptsWrapper: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    backgroundColor: COLORS.surfaceLight,
  },
  quickPromptsScroll: {
    paddingHorizontal: 12,
    gap: 6,
  },
  promptChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  promptChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  chatListContent: {
    paddingVertical: 10,
    paddingBottom: 16,
  },
  typingIndicatorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  typingText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D0E1FD',
  },
  micBtnRecording: {
    backgroundColor: COLORS.alertRed,
    borderColor: COLORS.alertRed,
  },
  input: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 14,
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '500',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.secondaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.secondaryBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  sendBtnDisabled: {
    backgroundColor: COLORS.cardBorder,
  },
});
