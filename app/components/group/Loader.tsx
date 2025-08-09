import React from 'react';
import styled from 'styled-components';

const Loader = ({ scale = 1 }) => {
  return (
    <StyledWrapper scale={scale}>
      <div className="loader" />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  ${({ scale }) => `
    .loader {
      width: ${120 * scale}px;
      height: ${150 * scale}px;
      background-color: #fff;
      background-repeat: no-repeat;
      background-image: 
        linear-gradient(#ddd 50%, #bbb 51%),
        linear-gradient(#ddd, #ddd), 
        linear-gradient(#ddd, #ddd),
        radial-gradient(ellipse at center, #aaa 25%, #eee 26%, #eee 50%, #0000 55%),
        radial-gradient(ellipse at center, #aaa 25%, #eee 26%, #eee 50%, #0000 55%),
        radial-gradient(ellipse at center, #aaa 25%, #eee 26%, #eee 50%, #0000 55%);
      background-position: 
        0 ${20 * scale}px, 
        ${45 * scale}px 0, 
        ${8 * scale}px ${6 * scale}px, 
        ${55 * scale}px ${3 * scale}px, 
        ${75 * scale}px ${3 * scale}px, 
        ${95 * scale}px ${3 * scale}px;
      background-size: 
        100% ${4 * scale}px, 
        ${1 * scale}px ${23 * scale}px, 
        ${30 * scale}px ${8 * scale}px, 
        ${15 * scale}px ${15 * scale}px, 
        ${15 * scale}px ${15 * scale}px, 
        ${15 * scale}px ${15 * scale}px;
      position: relative;
      border-radius: 6%;
      animation: shake 3s ease-in-out infinite;
      transform-origin: ${60 * scale}px ${180 * scale}px;
    }

    .loader:before {
      content: "";
      position: absolute;
      left: ${5 * scale}px;
      top: 100%;
      width: ${7 * scale}px;
      height: ${5 * scale}px;
      background: #aaa;
      border-radius: 0 0 ${4 * scale}px ${4 * scale}px;
      box-shadow: ${102 * scale}px 0 #aaa;
    }

    .loader:after {
      content: "";
      position: absolute;
      width: ${95 * scale}px;
      height: ${95 * scale}px;
      left: 0;
      right: 0;
      margin: auto;
      bottom: ${20 * scale}px;
      background-color: #bbdefb;
      background-image: 
        linear-gradient(to right, #0004 0%, #0004 49%, #0000 50%, #0000 100%),
        linear-gradient(135deg, #64b5f6 50%, #607d8b 51%);
      background-size: ${30 * scale}px 100%, ${90 * scale}px ${80 * scale}px;
      border-radius: 50%;
      background-repeat: repeat, no-repeat;
      background-position: 0 0;
      box-sizing: border-box;
      border: ${10 * scale}px solid #DDD;
      box-shadow: 0 0 0 ${4 * scale}px #999 inset, 0 0 ${6 * scale}px ${6 * scale}px #0004 inset;
      animation: spin 3s ease-in-out infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg) }
      50% { transform: rotate(360deg) }
      75% { transform: rotate(750deg) }
      100% { transform: rotate(1800deg) }
    }

    @keyframes shake {
      65%, 80%, 88%, 96% { transform: rotate(0.5deg) }
      50%, 75%, 84%, 92% { transform: rotate(-0.5deg) }
      0%, 50%, 100% { transform: rotate(0) }
    }
  `}
`;

export default Loader;
