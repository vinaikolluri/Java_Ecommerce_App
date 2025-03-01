
// class ActionProvider {
//   constructor(createChatBotMessage, setStateFunc, state) {
//     this.createChatBotMessage = createChatBotMessage;
//     this.setState = setStateFunc;
//     this.state = {
//       ...state,
//       currentFeedbackStage: null,
//       feedbackData: {
//         name: '',
//         email: '',
//         mobileNo: '',
//         feedback: '',
//       }
//     };

//     this.feedbackStages = {
//       GREETING: 'greeting',
//       NAME: 'name',
//       EMAIL: 'email',
//       MOBILE: 'mobile',
//       ISSUE: 'issue',
//     };
//   }

//   handleInitialGreeting() {
//     const namePrompt = this.createChatBotMessage('Please enter your name:');
  
//     this.setState(prevState => ({
//       ...prevState,
//       messages: [...(prevState.messages || []), namePrompt],
//       currentFeedbackStage: this.feedbackStages.NAME,
//     }));
  
//     console.log('Initiated greeting, set stage to:', this.feedbackStages.NAME);
//   }

//   handleFeedbackInput(input) {
//     this.setState((prevState) => {
//       const currentFeedbackStage = prevState.currentFeedbackStage || this.feedbackStages.NAME;
      
//       console.log('Current state:', prevState);
//       console.log('Handling feedback input, current stage:', currentFeedbackStage);
//       console.log('Current Input:', input);
//       console.log('Current Feedback Data:', prevState.feedbackData);

//       let updatedState = { ...prevState };

//       switch (currentFeedbackStage) {
//         case this.feedbackStages.NAME:
//           updatedState = this.handleNameInput(input, updatedState);
//           break;
//         case this.feedbackStages.EMAIL:
//           updatedState = this.handleEmailInput(input, updatedState);
//           break;
//         case this.feedbackStages.MOBILE:
//           updatedState = this.handleMobileInput(input, updatedState);
//           break;
//         case this.feedbackStages.ISSUE:
//           updatedState = this.handleIssueInput(input, updatedState);
//           break;
//         default:
//           this.handleInitialGreeting();
//       }

//       return updatedState;
//     });
//   }

//   handleNameInput(name, prevState) {
//     if (name.trim().length < 2) {
//       const message = this.createChatBotMessage(
//         'Please enter a valid name (at least 2 characters).',
//       );
//       return {
//         ...prevState,
//         messages: [...prevState.messages, message],
//       };
//     }

//     const message = this.createChatBotMessage(
//       `Thank you, ${name}!
//        Now, please enter your email address.`,
//     );

//     return {
//       ...prevState,
//       messages: [...prevState.messages, message],
//       currentFeedbackStage: this.feedbackStages.EMAIL,
//       feedbackData: {
//         ...prevState.feedbackData,
//         name: name.trim(),
//       },
//     };
//   }

//   handleEmailInput(email, prevState) {
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!emailRegex.test(email)) {
//       const message = this.createChatBotMessage(
//         'Please enter a valid email address.',
//       );
//       return {
//         ...prevState,
//         messages: [...prevState.messages, message],
//       };
//     }

//     const message = this.createChatBotMessage(
//       'Great! Now, please enter your 10-digit mobile number.',
//     );

//     return {
//       ...prevState,
//       messages: [...prevState.messages, message],
//       currentFeedbackStage: this.feedbackStages.MOBILE,
//       feedbackData: {
//         ...prevState.feedbackData,
//         email: email.trim(),
//       },
//     };
//   }

//   handleMobileInput(mobile, prevState) {
//     const mobileRegex = /^\d{10}$/;
//     if (!mobileRegex.test(mobile)) {
//       const message = this.createChatBotMessage(
//         'Please enter a valid 10-digit mobile number.',
//       );
//       return {
//         ...prevState,
//         messages: [...prevState.messages, message],
//       };
//     }

//     const message = this.createChatBotMessage(
//       'Thank you! Please describe the issue or provide your feedback.',
//     );

//     return {
//       ...prevState,
//       messages: [...prevState.messages, message],
//       currentFeedbackStage: this.feedbackStages.ISSUE,
//       feedbackData: {
//         ...prevState.feedbackData,
//         mobileNo: mobile.trim(),
//       },
//     };
//   }

//   handleIssueInput(issue, prevState) {
//     if (issue.trim().length < 5) {
//       const message = this.createChatBotMessage(
//         'Please provide more detailed feedback (at least 5 characters).',
//       );
//       return {
//         ...prevState,
//         messages: [...prevState.messages, message],
//       };
//     }

//     const updatedState = {
//       ...prevState,
//       feedbackData: {
//         ...prevState.feedbackData,
//         feedback: issue.trim(),
//       },
//     };

//     this.submitFeedback(updatedState.feedbackData);
//     return updatedState;
//   }

//   async submitFeedback(feedbackData) {
//     console.log(JSON.stringify(feedbackData)+"checkkkk")
//     try {
//       const response = await fetch(
//         'http://localhost:8788/B2B/feedback/addFeedback',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(feedbackData),
//         },
//       );

//       if (response.ok) {
//         const message = await response.json();
//         const successMessage =
//           message.message ||
//           'Feedback submitted successfully! Our Agent will get in touch with you.';

//         // Display success message
//         this.setState(prev => ({
//           ...prev,
//           messages: [
//             ...prev.messages,
//             this.createChatBotMessage(successMessage),
//           ],
//           currentFeedbackStage: this.feedbackStages.GREETING,
//           feedbackData: { name: '', email: '', mobileNo: '', feedback: '' },
//         }));

//         // Optionally restart the process
//         setTimeout(() => {
//           this.handleInitialGreeting();
//         }, 2000);
//       } else {
//         throw new Error('Feedback submission failed');
//       }
//     } catch (error) {
//       console.error('Feedback Submission Error:', error.message);
//       const errorMessage = this.createChatBotMessage(
//         'There was an error submitting your feedback. Please check your connection and try again.',
//       );
//       this.setState(prev => ({
//         ...prev,
//         messages: [...prev.messages, errorMessage],
//       }));
//     }
//   }
// }

// export default ActionProvider;


class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, state, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.createClientMessage = createClientMessage;
    this.setState = setStateFunc;
    this.state = {
      ...state,
      currentFeedbackStage: null,
      feedbackData: {
        name: '',
        email: '',
        mobileNo: '',
        feedback: '',
      },
      chatDisabled: false,
      isSubmitting: false
    };

    this.feedbackStages = {
      GREETING: 'greeting',
      NAME: 'name',
      EMAIL: 'email',
      MOBILE: 'mobile',
      ISSUE: 'issue',
    };

    // Bind methods to prevent potential context issues
    this.submitFeedback = this.submitFeedback.bind(this);
  }

  handleInitialGreeting() {
    const namePrompt = this.createChatBotMessage('Please enter your name:');
  
    this.setState(prevState => ({
      ...prevState,
      messages: [...(prevState.messages || []), namePrompt],
      currentFeedbackStage: this.feedbackStages.NAME,
      chatDisabled: false,
      isSubmitting: false
    }));
  }


  handleFeedbackInput(input) {
    this.setState((prevState) => {
      const currentFeedbackStage = prevState.currentFeedbackStage || this.feedbackStages.NAME;
      
      console.log('Current state:', prevState);
      console.log('Handling feedback input, current stage:', currentFeedbackStage);
      console.log('Current Input:', input);
      console.log('Current Feedback Data:', prevState.feedbackData);

      let updatedState = { ...prevState };

      switch (currentFeedbackStage) {
        case this.feedbackStages.NAME:
          updatedState = this.handleNameInput(input, updatedState);
          break;
        case this.feedbackStages.EMAIL:
          updatedState = this.handleEmailInput(input, updatedState);
          break;
        case this.feedbackStages.MOBILE:
          updatedState = this.handleMobileInput(input, updatedState);
          break;
        case this.feedbackStages.ISSUE:
          updatedState = this.handleIssueInput(input, updatedState);
          break;
        default:
          this.handleInitialGreeting();
      }

      return updatedState;
    });
  }

  handleNameInput(name, prevState) {
    if (name.trim().length < 2) {
      const message = this.createChatBotMessage(
        'Please enter a valid name (at least 2 characters).',
      );
      return {
        ...prevState,
        messages: [...prevState.messages, message],
      };
    }

    const message = this.createChatBotMessage(
      `Thank you, ${name}!
       Now, please enter your email address.`,
    );

    return {
      ...prevState,
      messages: [...prevState.messages, message],
      currentFeedbackStage: this.feedbackStages.EMAIL,
      feedbackData: {
        ...prevState.feedbackData,
        name: name.trim(),
      },
    };
  }

  handleEmailInput(email, prevState) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      const message = this.createChatBotMessage(
        'Please enter a valid email address.',
      );
      return {
        ...prevState,
        messages: [...prevState.messages, message],
      };
    }

    const message = this.createChatBotMessage(
      'Great! Now, please enter your 10-digit mobile number.',
    );

    return {
      ...prevState,
      messages: [...prevState.messages, message],
      currentFeedbackStage: this.feedbackStages.MOBILE,
      feedbackData: {
        ...prevState.feedbackData,
        email: email.trim(),
      },
    };
  }

  handleMobileInput(mobile, prevState) {
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      const message = this.createChatBotMessage(
        'Please enter a valid 10-digit mobile number.',
      );
      return {
        ...prevState,
        messages: [...prevState.messages, message],
      };
    }

    const message = this.createChatBotMessage(
      'Thank you! Please describe the issue or provide your feedback.',
    );

    return {
      ...prevState,
      messages: [...prevState.messages, message],
      currentFeedbackStage: this.feedbackStages.ISSUE,
      feedbackData: {
        ...prevState.feedbackData,
        mobileNo: mobile.trim(),
      },
    };
  }

  handleIssueInput(issue, prevState) {
    if (issue.trim().length < 5) {
      const message = this.createChatBotMessage(
        'Please provide more detailed feedback (at least 5 characters).',
      );
      return {
        ...prevState,
        messages: [...prevState.messages, message],
      };
    }

    const updatedState = {
      ...prevState,
      feedbackData: {
        ...prevState.feedbackData,
        feedback: issue.trim(),
      },
    };

    this.submitFeedback(updatedState.feedbackData);
    return updatedState;
  } // ... (previous methods remain the same)

  async submitFeedback(feedbackData) {
    console.log('Attempting to submit feedback:', JSON.stringify(feedbackData));

    // Double-check submission state
    if (this.state.isSubmitting) {
      console.warn('Submission already in progress');
      return;
    }
    try {
      const response = await fetch(
        'http://localhost:8788/B2B/feedback/addFeedback',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(feedbackData),
        }
      );

      if (!response.ok) {
        throw new Error('Feedback submission failed');
      }

      const message = await response.json();
      const successMessage = message.message || 
        'Feedback submitted successfully! Our Agent will get in touch with you.';

      // Use a single state update
      this.setState(prev => ({
        ...prev,
        messages: [
          ...prev.messages,
          this.createChatBotMessage(successMessage),
          this.createChatBotMessage('Chat has been closed. Thank you for your feedback.')
        ],
        chatDisabled: false,
        isSubmitting: false
      }));

      // Optional: Close chatbot
      if (window.closeChatbot) {
        window.closeChatbot();
      }

    } catch (error) {
      console.error('Feedback Submission Error:', error.message);
      
      this.setState(prev => ({
        ...prev,
        messages: [
          ...prev.messages,
          this.createChatBotMessage('There was an error submitting your feedback. Please try again.')
        ],
        isSubmitting: false
      }));
    }
  }

  // Additional method to reset submission state if needed

}

export default ActionProvider;