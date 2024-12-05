import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useKwiklyChat } from './KwiklyChatProvider';
import widgetIcon from '../assets/widget-icon.png';

const KwiklyWidgetButton = ({ triggerElement }) => {
  const { unreadMessages, toggleChat } = useKwiklyChat();

  return (
    <TouchableOpacity onPress={toggleChat}>
      {triggerElement || (
        <View style={[styles.button, { backgroundColor: '#40A758' }]}>
          {unreadMessages > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadMessages}</Text>
            </View>
          )}
          <View style={styles.iconContainer}>
            <Image source={widgetIcon} style={{ width: 30, height: 30 }} />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    zIndex: 8,
    elevation: 8,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF0000',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  iconContainer: {
    zIndex: 1,
    elevation: 1,
  },
});

export default KwiklyWidgetButton;
