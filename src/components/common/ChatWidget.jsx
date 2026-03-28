import { useState, useRef, useEffect } from 'react';
import {
    Box,
    Fab,
    Paper,
    Typography,
    IconButton,
    TextField,
    Button,
    Avatar,
    Fade
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { motion, AnimatePresence } from 'framer-motion';
import { chatbotFAQs } from '../../services/mockData';
import { getGeminiResponse } from '../../services/gemini';
import ReactMarkdown from 'react-markdown';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hi! Need help finding a college?' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        try {
            // Pass only recent history to keep widget lightweight
            const botResponse = await getGeminiResponse(messages.slice(-5), input);
            setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', text: "Network error. Try again." }]);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        sx={{
                            position: 'fixed',
                            bottom: 100,
                            right: 30,
                            zIndex: 9999,
                            width: 350,
                            maxWidth: '90vw'
                        }}
                    >
                        <Paper
                            elevation={10}
                            sx={{
                                borderRadius: 4,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                height: 450
                            }}
                        >
                            {/* Header */}
                            <Box
                                p={2}
                                bgcolor="primary.main"
                                color="white"
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Avatar sx={{ bgcolor: 'white', color: 'primary.main' }}>
                                        <SmartToyIcon />
                                    </Avatar>
                                    <Typography variant="subtitle1" fontWeight="bold">CapAssistant</Typography>
                                </Box>
                                <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            {/* Messages Area */}
                            <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#f8fafc' }}>
                                {messages.map((msg, i) => (
                                    <Box
                                        key={i}
                                        display="flex"
                                        justifyContent={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
                                        mb={1.5}
                                    >
                                        <Box
                                            sx={{
                                                bgcolor: msg.sender === 'user' ? 'primary.main' : 'white',
                                                color: msg.sender === 'user' ? 'white' : 'text.primary',
                                                p: 1.5,
                                                borderRadius: 2,
                                                borderBottomRightRadius: msg.sender === 'user' ? 0 : 2,
                                                borderBottomLeftRadius: msg.sender === 'bot' ? 0 : 2,
                                                boxShadow: 1,
                                                maxWidth: '80%'
                                            }}
                                        >
                                            <Box sx={{
                                                '& p': { m: 0, mb: 0.5, lineHeight: 1.5, fontSize: '0.875rem' },
                                                '& p:last-child': { mb: 0 },
                                                '& ul, & ol': { m: 0, pl: 2, mb: 0.5 },
                                                '& li': { mb: 0.25 },
                                                '& strong': { fontWeight: 600 }
                                            }}>
                                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                                <div ref={messagesEndRef} />
                            </Box>

                            {/* Input Area */}
                            <Box p={2} borderTop="1px solid" borderColor="divider" bgcolor="white">
                                <Box display="flex" gap={1}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Type a message..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    />
                                    <IconButton color="primary" onClick={handleSend} disabled={!input.trim()}>
                                        <SendIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                )}
            </AnimatePresence>

            <Fab
                color="primary"
                aria-label="chat"
                onClick={() => setIsOpen(!isOpen)}
                sx={{
                    position: 'fixed',
                    bottom: 30,
                    right: 30,
                    zIndex: 9999,
                    boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)'
                }}
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </Fab>
        </>
    );
};

export default ChatWidget;
