import React, { useEffect } from 'react';
import { Widget, addResponseMessage } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';

const Chatbot = () => {
  useEffect(() => {
    // 当组件加载时，你可以显示一条欢迎消息
    addResponseMessage('Welcome to our website!');
  }, []);

  // 处理用户消息
  const handleNewUserMessage = (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
    // 现在这里只是输出到控制台，但你可以集成你自己的聊天机器人后端
    addResponseMessage("Your message is important to us! We'll be with you shortly.");
  };

  return (
    <Widget
      handleNewUserMessage={handleNewUserMessage}
      title="My new awesome title"
      subtitle="And my cool subtitle"
    />
  );
};

export default Chatbot;
