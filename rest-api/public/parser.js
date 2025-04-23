document.addEventListener('DOMContentLoaded', () => {
    const categorySelector = document.getElementById('category-selector');
    const productContainer = document.getElementById('product-container');

    function filterProductsByCategory() {
        const selectedCategory = categorySelector.value;
        const allCategories = document.querySelectorAll('.category-container');
        allCategories.forEach(container => {
            if (selectedCategory === 'all' || container.id === selectedCategory) {
                container.style.display = 'block';
            } else {
                container.style.display = 'none';
            }
        });
    }

    categorySelector.addEventListener('change', filterProductsByCategory);

    filterProductsByCategory();

    const socket = new WebSocket('ws://localhost:5001'); 

    // Элементы чата
    const sendButton = document.getElementById('send-btn');
    const messageInput = document.getElementById('message-input');
    const chatMessages = document.getElementById('chat-messages');

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message && socket.readyState === WebSocket.OPEN) {
            socket.send(message);
            messageInput.value = '';
        }
    }

    sendButton.addEventListener('click', (event) => {
        event.preventDefault();
        sendMessage();
    });

    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });

    socket.addEventListener('message', (event) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat__message');
        messageDiv.textContent = event.data;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    socket.addEventListener('close', () => {
        console.log('Disconnected from WebSocket server');
    });

    socket.addEventListener('error', (error) => {
        console.error('WebSocket Error:', error);
    });
});
