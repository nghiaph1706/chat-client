import { formatRelative } from 'date-fns'

export default function Message({ message, own }) {
    return (
        <div className={own ? "outgoing_msg" : "incoming_msg"}>
            <div className={own ? "sent_msg" : "received_msg"}>
                <p>{message.text}</p>
                <span class="time_date">{formatRelative(new Date(message.createAt), new Date())}</span> </div>
        </div>
    )
}
