// service/http/Chat.ts
const serverAddress = 'http://127.0.0.1:5000';

export interface ChatFormData {
  user_input: string;
  conversation_history: string;
}

export const CreateChat = async (formData: ChatFormData) => {
  try {
    const response = await fetch(`${serverAddress}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to create chat:', error);
    return null;
  }
};
