import React, { useState, useEffect } from 'react';
import { AdminTog, AdminToggle } from '../../service/http/Admin'; // Adjust the import path as necessary
import { FetchChatStatus } from '../../service/http/Admin'; // Ensure this is correctly imported

function Admin() {
  const [chatEnabled, setChatEnabled] = useState(true);
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeChatStatus = async () => {
      const isEnabled = await FetchChatStatus();
      setChatEnabled(isEnabled);
    };

    initializeChatStatus();
  }, []);

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

  const handlePinSubmit = () => {
    if (pin === '30130') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect PIN. Please try again.');
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      {!isAuthenticated ? (
        <div>
          <p>Please enter the PIN to access the admin panel:</p>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
          />
          <button onClick={handlePinSubmit}>Submit</button>
        </div>
      ) : (
        <div>
          <p>Chat is currently {chatEnabled ? 'enabled' : 'disabled'}</p>
          <button onClick={() => handleToggle('disable')} disabled={!chatEnabled}>
            Disable Chat
          </button>
          <button onClick={() => handleToggle('enable')} disabled={chatEnabled}>
            Enable Chat
          </button>
        </div>
      )}
    </div>
  );
}

export default Admin;
