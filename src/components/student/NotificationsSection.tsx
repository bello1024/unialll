import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, MessageCircle, Clock, Pin } from 'lucide-react';
import { fetchChatMessages, sendChatMessage } from '../../services/supabaseApi';
import type { ChatMessage } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';


const NotificationsSection: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Charger les messages au montage
  useEffect(() => {
    const loadMessages = async () => {
      if (user && user.promotion) {
        try {
          const data = await fetchChatMessages(user.promotion);
          setMessages(data);
        } catch (error) {
          console.error('Error loading messages:', error);
        }
      }
    };
    loadMessages();
  }, [user]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const message = await sendChatMessage(user!.id, user!.promotion!, newMessage);
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const pinnedMessages = messages.filter(msg => msg.is_pinned);
  const regularMessages = messages.filter(msg => !msg.is_pinned);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat de Classe</h1>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>Promotion {user?.promotion} • 24 étudiants en ligne</span>
          </div>
        </div>
      </div>

      {/* Messages épinglés */}
      {pinnedMessages.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-2">
            <Pin className="h-4 w-4 text-yellow-600 mr-2" />
            <span className="text-sm font-medium text-yellow-800">Messages épinglés</span>
          </div>
          {pinnedMessages.map((message) => (
            <div key={message.id} className="text-sm text-yellow-700">
              <strong>{message.user?.full_name}:</strong> {message.content}
            </div>
          ))}
        </div>
      )}

      {/* Zone de messages */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {regularMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-xs lg:max-w-md ${message.user_id === user?.id ? 'flex-row-reverse' : 'flex-row'}`}>
                <img
                  src={message.user?.avatar_url || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'}
                  alt={message.user?.full_name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className={`mx-2 ${message.user_id === user?.id ? 'text-right' : 'text-left'}`}>
                  <div className="text-xs text-gray-500 mb-1">
                    {message.user?.full_name} • {formatTime(message.created_at)}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.user_id === user?.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tapez votre message..."
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NotificationsSection;