import React, { useState, useMemo, useEffect, useRef } from 'react';
import { TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone';
import { Dimensions } from 'react-native';
import { useKwiklyChat } from './KwiklyChatProvider';
import { Platform } from 'react-native';
import KwiklyChatSkeleton from './KwiklyChatSkeleton';
import closeIcon from '../assets/close-icon.png';

const { width, height } = Dimensions.get('window');

const KwiklyLiveChatWidget = () => {
  const webref = useRef(null);
  const {
    isChatOpen,
    currentPage,
    user,
    widgetId,
    toggleChat,
    setUnreadMessages,
  } = useKwiklyChat();

  const api = 'https://staging-api.kweekatel.com/api/v1/a/widgets/';
  const platform = 'mobile-web';
  const os = Platform.OS;

  const [clientDomain, setClientDomain] = useState(null);
  const [uid, setUid] = useState(null);
  const [url, setUrl] = useState(null);
  const [color, setColor] = useState('#40A758');
  const [isLoading, setIsLoading] = useState(true);
  const [webViewLoaded, setWebViewLoaded] = useState(false);
  const [count, setCount] = useState(0);
  const [webKey, setWebKey] = useState(0);
  const [ready, setReady] = useState(false);

  const sendMessageToWebview = (type, content) => {
    if (webref.current) {
      const message = { type, content };
      webref.current.postMessage(JSON.stringify(message));
    }
  };

  const webviewUrl = useMemo(() => {
    if (!url || !uid || !clientDomain) return null;
    const uri = `${url}?widget=${widgetId}&uid=${uid}&client=${clientDomain}&platform=${platform}`;
    return uri;
  }, [url, widgetId, uid, clientDomain, platform]);

  useEffect(() => {
    sendMessageToWebview('KWIKLY_CLIENT_UPDATE_USER', user);
  }, [user]);

  useEffect(() => {
    sendMessageToWebview('KWIKLY_CLIENT_SET_PAGE', currentPage);
  }, [currentPage]);

  useEffect(() => {
    const initializeWidget = async () => {
      const storedUid = await AsyncStorage.getItem('kwikly-widget-uid');
      setUid(storedUid || null);

      const timezone = moment.tz.guess();
      const endpoint = `${api}${widgetId}`;

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-TIMEZONE': timezone,
          },
          body: JSON.stringify({
            uid: storedUid || null,
            name: user?.name,
            email: user?.email,
            phone: user?.phone,
            os: os,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const d = data.data;

        if (!storedUid) {
          await AsyncStorage.setItem('kwikly-widget-uid', d.uid);
          setUid(d.uid);
        }

        setUrl(d.url);
        setUnreadMessages(d.unread_messages);
        setColor(d.color);
        setClientDomain(d.product);
      } catch (error) {
        console.error('Error fetching widget data:', error.message);
        throw error;
      }
    };

    initializeWidget();
  }, [setUnreadMessages, widgetId, os, user?.email, user?.name, user?.phone]);

  useEffect(() => {
    if (!isChatOpen) {
      setIsLoading(true);
      if (os === 'android') {
        setWebViewLoaded(false);
      }
    } else if (isChatOpen && webViewLoaded) {
      setIsLoading(false);
    }
  }, [isChatOpen, webViewLoaded, os]);

  const handleWebViewMessage = (event) => {
    setCount(count + 1);
    let data;
    try {
      data = JSON.parse(event.nativeEvent.data);
    } catch (error) {
      console.error('Error parsing message from WebView:', error);
      return;
    }

    if (data?.type === 'WIDGET_LOADED' && data?.content === 'LOADED') {
      const timeout = 400;
      if (os === 'android') {
        setTimeout(() => setWebViewLoaded(true), timeout);
      } else {
        setWebViewLoaded(true);
      }
      setTimeout(() => setIsLoading(false), timeout);
    }

    if (data?.type === 'WIDGET_UPDATE') {
      if (!isChatOpen) {
        setUnreadMessages(data?.content);
      } else {
        setUnreadMessages((prevUnreadMessages) => prevUnreadMessages + 1);
      }
    }

    if (data?.type === 'WIDGET_PAGE') {
      AsyncStorage.setItem('kwikly-widget-view', data?.content);
    }
  };

  const widgetStyle = useMemo(() => {
    return {
      position: 'absolute',
      flex: 1,
      bottom: 0,
      right: 0,
    };
  });

  return (
    <View
      style={[
        widgetStyle,
        isChatOpen ? styles.visible : '',
        os === 'ios' ? { top: 40, bottom: 10 } : '',
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          toggleChat();
          setIsLoading(true);
        }}
        style={[
          isChatOpen || (isChatOpen && isLoading)
            ? styles.visible
            : styles.hidden,
          styles.closeButton,
        ]}
      >
        <Image source={closeIcon} style={{ width: 25, height: 25 }} />
      </TouchableOpacity>
      <View style={styles.modalContainer}>
        {webviewUrl ? (
          <WebView
            ref={webref}
            source={{
              uri: webviewUrl,
              headers: { Referer: webviewUrl },
            }}
            style={[
              styles.webview,
              isChatOpen ? styles.visible : styles.hidden,
            ]}
            onMessage={handleWebViewMessage}
            key={webKey}
            javaScriptEnabled={true}
            onLoadEnd={() => {
              if (!ready) {
                setWebKey(Date.now());
                setReady(true);
              }
            }}
          />
        ) : (
          <KwiklyChatSkeleton />
        )}
      </View>
      <View
        style={[
          { position: 'absolute' },
          isLoading && isChatOpen ? styles.visible : styles.hidden,
        ]}
      >
        <KwiklyChatSkeleton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#40A758',
    padding: 5,
    borderRadius: 50,
    zIndex: 2000,
    elevation: 2000,
  },
  webview: {
    width: width,
    height: height,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  absoluteCentered: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 10,
  },
  hidden: {
    opacity: 0,
    zIndex: -1,
    elevation: -1,
  },
  visible: {
    opacity: 1,
    zIndex: 1000,
    elevation: 1000,
  },
});

export default KwiklyLiveChatWidget;
