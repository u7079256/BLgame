// WelcomeScreen.js
import React, { useState } from 'react';
import './WelcomeScreen.css'; // 引入样式

const WelcomeScreen = ({ onFadeOut }) => {
  const [fadeOut, setFadeOut] = useState(false); // 控制淡出效果

  const handleClick = () => {
    setFadeOut(true); // 在点击或滑动时触发淡出效果
    setTimeout(onFadeOut, 1000); // 在动画结束后调用onFadeOut回调
  };

  return (
    <div className={`welcome-screen ${fadeOut ? 'fade-out' : ''}`} onClick={handleClick}>
        <div style={{marginBottom:'40%', textAlign:'center'}}>
            <h1 style={{color: 'white', userSelect: 'none', pointerEvents: 'none'}}>Welcome to AutoJob</h1>
            <p style={{color: 'white', userSelect: 'none', pointerEvents: 'none'}}>~Click or Drag~</p>
        </div>
    </div>
  );
};

export default WelcomeScreen;
