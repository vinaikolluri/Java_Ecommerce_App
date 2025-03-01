class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    console.log("User Input:", message);

    if (message.trim()) {
      this.actionProvider.handleFeedbackInput(message.trim());
    } else {
      const warningMessage = this.actionProvider.createChatBotMessage("Please provide a valid input.");
      this.actionProvider.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, warningMessage],
      }));
    }
  }
}

export default MessageParser;
