# Chatify
A real-time WebSocket-based chat application with a frosted glass UI.
Chatify is a real-time chat application built with HTML, JavaScript, and WebSockets. It features instant messaging, dynamic chat boards, a randomized username system, and a sleek frosted-glass UI design. The app runs entirely in the browser, connecting to a simple WebSocket server for backend communication.

🌐 Features
✅ Real-time Chat — Send and receive messages instantly.

🧊 Frosted UI Theme — Clean, modern glassmorphism-inspired interface.

🧠 Random Username Generator — Fun identity system using random animals/fruits.

🔁 Board Switching — Create and switch between different conversation boards.

⬆️⬇️ Scroll Controls — Easy navigation with arrow icons.

⚡ Lightweight & Fast — Minimal, responsive client-side code.

🛠️ Technologies Used
Frontend: HTML5, CSS3, JavaScript (Vanilla)

Backend: Node.js with WebSocket (ws)

Dev Tools: VS Code, Live Server, Node.js

📁 Folder Structure
bash
Copy
Edit
chatify/
├── GUI.html             # Main chat UI
├── chat-client.js       # Frontend JS logic
├── server.js            # Node.js WebSocket server
├── style.css            # Frosted UI styling
├── README.md            # Project documentation
└── .gitignore           # Node_modules and logs ignored
🚀 Getting Started
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/yourusername/chatify.git
cd chatify
2. Install Dependencies
bash
Copy
Edit
npm install ws
3. Run WebSocket Server
bash
Copy
Edit
node server.js
4. Open the Client
Launch GUI.html in a browser (use Live Server or open directly).

🔐 .gitignore
gitignore
Copy
Edit
node_modules/
*.log
.env
📸 Screenshots
(Add screenshots here if available, showing the frosted theme and chat in action)

📌 To-Do / Improvements
User authentication system

Message history persistence (e.g., via database)

Better username system (e.g., allow custom names)

Mobile responsiveness

📜 License
This project is licensed under the MIT License.

🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.
