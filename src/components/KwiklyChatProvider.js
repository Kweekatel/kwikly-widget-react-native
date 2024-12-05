import React, { createContext, useContext, useState } from 'react';

const KwiklyChatContext = createContext();

export const useKwiklyChat = () => useContext(KwiklyChatContext);

export const KwiklyChatProvider = ({ children, widgetId }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [currentPage, setCurrentPage] = useState('');
  const [user, setUser] = useState({});

  const toggleChat = () => {
    if (isChatOpen) {
      setUnreadMessages(0);
    }
    setIsChatOpen((prev) => !prev);
  };

  const logout = () => {
    setIsChatOpen(false);
    setUnreadMessages(0);
    setUser({});
  };

  return (
    <KwiklyChatContext.Provider
      value={{
        isChatOpen,
        currentPage,
        setCurrentPage,
        unreadMessages,
        setUnreadMessages,
        user,
        setUser,
        toggleChat,
        widgetId,
        logout,
      }}
    >
      {children}
    </KwiklyChatContext.Provider>
  );
};
