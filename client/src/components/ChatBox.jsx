import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const query = input.trim();
    setInput('');
    setLoading(true);
    const userMessage = { type: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await axios.post('/api/chat', { query });
      const agentResponses = res.data.responses.map((resp, i) => ({
        type: `agent${i+1}`,
        content: resp
      }));
      setMessages(prev => [...prev, ...agentResponses, {
        type: 'final',
        content: res.data.final
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { type: 'error', content: error.response?.data?.error || 'Error occurred' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.type}`} ref={i === messages.length - 1 ? messagesEndRef : null}>
            <strong>{msg.type === 'user' ? 'You' : msg.type === 'final' ? 'Final Answer' : `Agent ${msg.type.slice(-1)}`}:</strong>
            <p>{msg.content}</p>
          </div>
        ))}
        {loading && <div className="message loading">Debating...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask your question..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? 'Processing...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default ChatBox;

