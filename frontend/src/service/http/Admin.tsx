const serverAddress = 'http://127.0.0.1:5000';

export interface AdminToggle {
    action: string;
  }


export const AdminTog = async (action: AdminToggle) => {
  try {
    const response = await fetch(`${serverAddress}/chat_toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action)
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

export const FetchChatStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${serverAddress}/status`, {
      method: 'GET'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch chat status');
    }
    const data = await response.json();
    return data.chat_enabled;  // Assuming the server returns an object with { chat_enabled: boolean }
  } catch (error) {
    console.error('Error fetching chat status:', error);
    return false;  // Return a default value in case of failure
  }
};