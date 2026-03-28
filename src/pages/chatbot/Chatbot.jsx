import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Grid,
  Chip,
  IconButton
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { chatbotFAQs } from '../../services/mockData';
import { getGeminiResponse } from '../../services/gemini';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am CapAssistant. I can help you with Cutoffs, College predictions, and Document requirements. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = { sender: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const botResponse = await getGeminiResponse(messages, text);
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I am facing network issues." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestedQuestions = [
    "What is the CS cutoff for COEP?",
    "Which documents are required for OBC?",
    "When does CAP Round 1 start?",
    "How to freeze my seat?"
  ];

  return (
    <Box sx={{ minHeight: '85vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Container maxWidth="md" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', py: 4 }}>

        {/* Header */}
        <Box textAlign="center" mb={4}>
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 60,
                height: 60,
                mx: 'auto',
                mb: 2,
                boxShadow: '0 4px 20px rgba(37,99,235,0.3)'
              }}
            >
              <SmartToyIcon fontSize="large" />
            </Avatar>
            <Typography variant="h4" fontWeight="800" gutterBottom>
              AI Admission Assistant
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Your 24/7 Guide for Engineering Admissions
            </Typography>
          </motion.div>
        </Box>

        {/* Chat Area */}
        <Paper
          elevation={3}
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 4,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            maxHeight: '60vh'
          }}
        >
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, bgcolor: '#f8fafc' }}>
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: 'flex',
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: 20
                  }}
                >
                  <Box display="flex" flexDirection={msg.sender === 'user' ? 'row-reverse' : 'row'} alignItems="flex-end" gap={1.5} maxWidth="80%">
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: msg.sender === 'user' ? 'secondary.main' : 'primary.main'
                      }}
                    >
                      {msg.sender === 'user' ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
                    </Avatar>

                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        borderBottomRightRadius: msg.sender === 'user' ? 4 : 24,
                        borderBottomLeftRadius: msg.sender === 'bot' ? 4 : 24,
                        bgcolor: msg.sender === 'user' ? 'primary.main' : 'white',
                        color: msg.sender === 'user' ? 'white' : 'text.primary'
                      }}
                    >
                      <Box sx={{
                        '& p': { m: 0, mb: 1, lineHeight: 1.6 },
                        '& p:last-child': { mb: 0 },
                        '& ul, & ol': { m: 0, pl: 2, mb: 1 },
                        '& li': { mb: 0.5 },
                        '& strong': { fontWeight: 600 }
                      }}>
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </Box>
                    </Paper>
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <Box display="flex" alignItems="center" gap={1} ml={6} mb={2}>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  style={{ width: 8, height: 8, background: '#aaa', borderRadius: '50%' }}
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.1 }}
                  style={{ width: 8, height: 8, background: '#aaa', borderRadius: '50%' }}
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                  style={{ width: 8, height: 8, background: '#aaa', borderRadius: '50%' }}
                />
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Suggestions */}
          {messages.length < 3 && (
            <Box p={2} bgcolor="white" borderTop="1px solid" borderColor="divider">
              <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ mb: 1, display: 'block' }}>
                SUGGESTED QUESTIONS
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {suggestedQuestions.map((q, i) => (
                  <Chip
                    key={i}
                    icon={<AutoAwesomeIcon fontSize="small" />}
                    label={q}
                    onClick={() => handleSend(q)}
                    clickable
                    variant="outlined"
                    color="primary"
                    sx={{ borderRadius: 2 }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Input */}
          <Box p={2} bgcolor="white" borderTop="1px solid" borderColor="divider">
            <Grid container spacing={1}>
              <Grid item xs={10}>
                <TextField
                  fullWidth
                  placeholder="Type your question..."
                  variant="outlined"
                  size="medium"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ height: '100%', borderRadius: 3 }}
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                >
                  <SendIcon />
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

      </Container>
    </Box>
  );
};

export default Chatbot;
