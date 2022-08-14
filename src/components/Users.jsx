import { useEffect } from "react";
import { useState } from "react"

export default function Users({ conversation, currentUserId, users }) {
    const [user, setUser] = useState({});

    useEffect(() => {
        const friendId = conversation.members.find(m => m !== currentUserId)

        const getUser = async () => {
            const res = await fetch(`https://chatv1-api.herokuapp.com/api/v1/account/${friendId}`, { method: "GET" })
            if (res.status === 404)
                return alert('code: ' + res.status + '\nerror: ' + res.statusText)
            const rs = await res.json()
            setUser(rs)
        };
        getUser()
    }, [conversation, currentUserId])

    return (
        <div class="chat_people">
            <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt='' /> </div>
            <div class="chat_ib">
                <h5>{user.username} </h5>
                <span class="chat_date">Online</span>
            </div>
        </div>
    )
}