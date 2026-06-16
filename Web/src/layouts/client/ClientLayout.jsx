import { useRef } from "react";
import { Outlet } from "react-router-dom";
import ClientHeader from "../../components/client/Header";
import ClientFooter from "../../components/client/Footer";
import { Toaster } from 'react-hot-toast';
import { Helmet } from "react-helmet";
import { marked } from "marked";

import "../../store/client/css/style.css";

export default function ClientLayout() {
    const messagesRef = useRef(null);
    const messageInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const chatWindowRef = useRef(null);
    const expandBtnRef = useRef(null);
    const micBtnRef = useRef(null);
    const token = crypto.randomUUID();
    let isActive = false;

    const toggleChat = () => {
        const chatWindow = chatWindowRef.current;
        if (!chatWindow) return;

        if (chatWindow.classList.contains('show')) {
            chatWindow.classList.remove('show');
            setTimeout(() => { chatWindow.style.display = 'none'; }, 300);
        } else {
            chatWindow.style.display = 'flex';
            setTimeout(() => { chatWindow.classList.add('show'); }, 10);
        }
    };

    const toggleExpand = () => {
        const chatWindow = chatWindowRef.current;
        const expandBtn = expandBtnRef.current;
        if (!chatWindow || !expandBtn) return;

        chatWindow.classList.toggle('fullscreen');

        if (chatWindow.classList.contains('fullscreen')) {
            expandBtn.classList.remove('bi-arrows-angle-expand');
            expandBtn.classList.add('bi-arrows-angle-contract');
        } else {
            expandBtn.classList.remove('bi-arrows-angle-contract');
            expandBtn.classList.add('bi-arrows-angle-expand');
        }
    };

    const addUserMessage = (content) => {
        const messages = messagesRef.current;
        if (!messages) return;

        const outerDiv = document.createElement("div");
        outerDiv.className = "d-flex flex-column align-items-end mb-2";

        const innerDiv = document.createElement("div");
        innerDiv.className = "msg-bubble msg-user shadow-sm";
        innerDiv.textContent = content;

        outerDiv.appendChild(innerDiv);
        messages.appendChild(outerDiv);
        messages.scrollTop = messages.scrollHeight;
    };

    const addBotMessage = (content) => {
        const messages = messagesRef.current;
        if (!messages) return;

        const outerDiv = document.createElement("div");
        outerDiv.className = "d-flex align-items-end mb-2";

        const avatar = document.createElement("img");
        avatar.src = "https://cdn.bookingcare.vn/fo/w128/2024/03/27/151956-chatboticon.png";
        avatar.alt = "Bot";
        avatar.className = "bot-avatar border bg-white p-1";

        const columnDiv = document.createElement("div");
        columnDiv.className = "d-flex flex-column";

        const msgDiv = document.createElement("div");
        msgDiv.className = "msg-bubble msg-bot shadow-sm";

        if (!content) {
            msgDiv.innerHTML = `<div class="spinner-grow spinner-grow-sm ms-1" role="status"><span class="sr-only">Loading...</span></div>`;
        } else {
            msgDiv.textContent = content;
        }

        columnDiv.appendChild(msgDiv);
        outerDiv.appendChild(avatar);
        outerDiv.appendChild(columnDiv);
        messages.appendChild(outerDiv);
        messages.scrollTop = messages.scrollHeight;
        return msgDiv;
    };

    const sendMessage = async () => {
        const messageInput = messageInputRef.current;
        const messages = messagesRef.current;
        const imageInput = imageInputRef.current;
        if (!messageInput || !messages || !imageInput) return;

        const userMessage = messageInput.value;
        const imageFile = imageInput.files[0];

        if (!userMessage && !imageFile) return;

        addUserMessage(userMessage);
        messageInput.value = '';
        const botMessage = addBotMessage(null);

        const formData = new FormData();
        formData.append("question", userMessage);
        formData.append("token", token);
        if (imageFile) formData.append("image", imageFile);

        try {
            const response = await fetch('http://127.0.0.1:3500/api/ai', {
                method: 'POST',
                body: formData
            });

            if (!response.body) throw new Error("Không có stream dữ liệu!");

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let result = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                result += chunk;
                botMessage.innerHTML = marked.parse(result + '<span class="typing" id="typing"></span>');
                const isScrolledToBottom = messages.scrollHeight - messages.clientHeight >= messages.scrollTop + 50;
                if (isScrolledToBottom) messages.scrollTop = messages.scrollHeight;
            }
        } catch (error) {
            console.error(error);
            botMessage.innerHTML = "Lỗi khi gọi API!";
        }
        imageInput.value = '';
    };

    return (
        <>
            <Helmet>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/notyf/notyf.min.css" />
                <script src="https://cdn.jsdelivr.net/npm/notyf/notyf.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                    integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                    crossorigin="anonymous"></script>
            </Helmet>

            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <ClientHeader />
            <div className="container-md overflow-hidden">
                <Outlet />
            </div>
            <div className="position-fixed bottom-0 end-0 me-2 mb-2 pe-2 pb-2" style={{ zIndex: 100 }}>
                <div className="p-0 btn d-flex flex-column justify-content-center" onClick={toggleChat}>
                    <img className="img-fluid" width="65px"
                        src="https://cdn.bookingcare.vn/fo/w128/2024/03/27/151956-chatboticon.png" alt="bubble-chat" />
                    <span className="text-warning fs-6 fw-bold">Trợ lý AI</span>
                </div>

                <div ref={chatWindowRef} id="chat-window" className="card chat-window m-0">
                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3">
                        <span className="fw-bold fs-5">Trợ lý AI</span>
                        <div className="window-controls">
                            <i ref={expandBtnRef} className="bi bi-arrows-angle-expand me-3 cursor-pointer fs-5" role="button" onClick={toggleExpand}></i>
                            <i className="bi bi-dash-lg cursor-pointer fs-5" role="button" onClick={toggleChat}></i>
                        </div>
                    </div>
                    <div ref={messagesRef} className="card-body chat-body d-flex flex-column gap-3" id="chatContainer"></div>
                    <div className="card-footer bg-white p-3 border-top-0">
                        <div className="input-group">
                            <input ref={messageInputRef} type="text" className="form-control bg-light border-0 rounded-pill px-3" placeholder="Enter your message" onKeyDown={e => { if (e.key === 'Enter') sendMessage() }} />
                            <div className="d-flex align-items-center ps-2 gap-2">
                                <input ref={imageInputRef} type="file" className="d-none" />
                                <button className="btn btn-link text-secondary p-0 text-decoration-none" onClick={sendMessage}><i className="bi bi-send fs-4"></i></button>
                            </div>
                        </div>
                        <div className="text-center mt-2">
                            <small className="text-muted fw-bold" style={{ fontSize: "0.7rem", opacity: 0.5 }}>POWERED BY FPT.AI</small>
                        </div>
                    </div>
                </div>
            </div>

            <ClientFooter />
        </>
    );
}
