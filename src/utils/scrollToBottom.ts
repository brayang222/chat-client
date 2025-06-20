export const scrollToBottom = (messagesEndRef: any) => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};
