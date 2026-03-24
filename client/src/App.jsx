import { useState } from 'react'
import ChatBox from './components/ChatBox.jsx'
import './index.css'

function App() {
  return (
    <div className="App">
      <h1>LLM Council</h1>
      <p>Ask a question, get responses from 3 AI agents, then their debated final answer.</p>
      <ChatBox />
    </div>
  )
}

export default App
