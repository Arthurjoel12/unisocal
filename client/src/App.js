import Auth from './pages/Auth';
import Home from './pages/Home';
import Chat from './pages/Chat';
import "./App.css"
import { Routes, Route } from 'react-router-dom';
import PostDetail from './pages/PostDetail';

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Auth />} exact />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chats" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
