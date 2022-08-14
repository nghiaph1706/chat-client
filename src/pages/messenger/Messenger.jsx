import { useEffect, useRef } from 'react'
import { useState } from 'react'
import { io } from 'socket.io-client'
import Conversation from '../../components/Converstion'
import Message from '../../components/Message'
import './messenger.css'

export default function Messenger() {
    const [conversations, setConversations] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [message, setMessage] = useState([])
    const [newMessage, setNewMessage] = useState([])
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([]);
    const scrollRef = useRef()
    const socket = useRef()
    const userId = sessionStorage.getItem('userId')

    useEffect(() => {
        socket.current = io("http://localhost:8900")
        socket.current.on("getMessage", data => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createAt: data.createAt
            })
        })
    }, [])

    useEffect(() => {
        arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.sender) &&
            setMessage((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage, currentChat])

    useEffect(() => {
        socket.current.emit("addUserOnline", userId)
        socket.current.on("getUsersOnline", users => {
            setOnlineUsers(
                users.filter(user => user.userId !== userId)
            )
        })
        console.log(onlineUsers);
    }, [userId, onlineUsers])

    useEffect(() => {
        const getConversations = async () => {
            const res = await fetch(`http://localhost:8080/api/v1/room/userId/${userId}`, { method: "GET" })
            if (res.status === 404)
                return alert('code: ' + res.status + '\nerr: ' + res.statusText)
            const rs = await res.json()
            setConversations(rs)
        }
        getConversations()
    }, [userId])

    useEffect(() => {
        const getMessage = async () => {
            const res = await fetch(`http://localhost:8080/api/v1/message/${currentChat._id}`, { method: "GET" })
            if (res.status === 404)
                return alert('code: ' + res.status + '\nerr: ' + res.statusText)
            const rs = await res.json()
            setMessage(rs)
        }
        getMessage()
    }, [currentChat])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const receiverId = currentChat.members.find(member => member !== userId)
        
        socket.current.emit("sendMessage", {
            senderId: userId,
            receiverId,
            text: newMessage,
            createAt: Date.now()
        })

        const message = {
            sender: userId,
            text: newMessage,
            roomId: currentChat._id,
            createAt: Date.now()
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
        };
        const res = await fetch('http://localhost:8080/api/v1/message/', requestOptions)
        if (res.status === 400)
            return alert('code: ' + res.status + '\nerr: ' + res.statusText)
        const rs = await res.json()
        setMessage(rs)
        setNewMessage('')
    }

    useEffect(() => {
         scrollRef.current?.scrollIntoView({behavior: "smooth"})
    })

    return (
        <div class="container">
            <div class="messaging">
                <div class="inbox_msg">
                    <div class="inbox_people">
                        <div class="headind_srch">
                            <div class="recent_heading">
                                <h4>Friends</h4>
                            </div>
                        </div>
                        <div class="inbox_chat">
                            {
                                conversations.map((c) => (
                                    <div className={currentChat !== null && c._id === currentChat._id ? "chat_list active_chat" : "chat_list"} onClick={() => setCurrentChat(c)}>
                                        <Conversation conversation={c} currentUserId={userId}/>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    {
                        currentChat ?

                            <div class="mesgs">
                                <div class="msg_history">
                                    {
                                        message.map((m) => (
                                            <div ref={scrollRef}>
                                                <Message message={m} own={m.sender === userId} />
                                            </div>
                                        ))
                                    }
                                </div>
                                <div class="type_msg">
                                    <div class="input_msg_write">
                                        <input type="text" class="write_msg" placeholder="Type a message" onChange={(e) => setNewMessage(e.target.value)} value={newMessage} />
                                        <button class="msg_send_btn" type="button" onClick={handleSubmit}><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>
                                    </div>
                                </div>
                            </div>
                            :
                            <div>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}