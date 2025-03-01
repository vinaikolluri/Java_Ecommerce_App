// import React from 'react';
// import { createChatBotMessage } from 'react-chatbot-kit';

// const config = {
//   botName: "FeedbackBot",
//   initialMessages: [
//     createChatBotMessage("Please enter your name:")
//   ],
//   state: {
//     currentFeedbackStage: 'name',
//   },
//   customComponents: {},
//   customStyles: {
//     botMessageBox: {
//       backgroundColor: "#373a47",
//     },
//     chatButton: {
//       backgroundColor: "#5ccc7a",
//     },
//   },
// };

// export default config;

import React from 'react';
import { createChatBotMessage } from 'react-chatbot-kit';

const config = {
  botName: "FeedbackBot",
  initialMessages: [
    createChatBotMessage("Hii, Please Enter Your Name")
  ],
  state: {
    currentFeedbackStage: 'name',
    chatDisabled: false,  // Add this to the initial state
  },
  customComponents: {},
  customStyles: {
    botMessageBox: {
      backgroundColor: "#373a47",
    },
    chatButton: {
      backgroundColor: "#5ccc7a",
    },
  },
};

export default config;