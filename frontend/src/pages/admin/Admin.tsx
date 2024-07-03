import React, { useState, useEffect } from 'react';
import { AdminTog, AdminToggle } from '../../service/http/Admin'; // Adjust the import path as necessary
import { FetchChatStatus } from '../../service/http/Admin'; // Ensure this is correctly imported

function Admin() {
  const [chatEnabled, setChatEnabled] = useState(true);

  useEffect(() => {
    const initializeChatStatus = async () => {
      const isEnabled = await FetchChatStatus();
      setChatEnabled(isEnabled);
    };

    initializeChatStatus();
  }, []);

  // Define handleToggle here
  const handleToggle = async (action: 'enable' | 'disable') => {
    const adminAction: AdminToggle = {
      action: action,
    };
    const result = await AdminTog(adminAction);
    if (result) {
      setChatEnabled(action === 'enable'); // Update local state based on the action
      console.log(`${action} Chat Success:`, result);
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <button onClick={() => handleToggle('disable')} disabled={!chatEnabled}>
        Disable Chat
      </button>
      <button onClick={() => handleToggle('enable')} disabled={chatEnabled}>
        Enable Chat
      </button>
    </div>
  );
}

export default Admin;
