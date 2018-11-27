import React from 'react';
import Labels from '../labels/labels';

const MessageList = ({ messages, starCallback }) => {

    const starFunction = (ev) => {
        starCallback(ev.target.classList[2])
    }

    return messages.map((message, idx) => {
        let read = message.read ? "read" : "unread"
        let selected = message.selected ? "selected" : "unselected"
        let starred = message.starred ? "fa-star" : "fa-star-o"

        return (
            <div className={`row message ${read} ${selected}`} key={idx}>
                <div className="col-xs-1">
                    <div className="row">
                        <div className="col-xs-2">
                            <input type="checkbox" checked={message.selected} />
                        </div>
                        <div className="col-xs-2">
                            <i onCLick={starFunction} className={`star fa ${starred}`}></i>
                        </div>
                    </div>
                </div>
                <div className="col-xs-11">
                    <div>
                        <Labels labels={message.labels} className="label label-warning" />
                        {message.subject}
                    </div>
                </div>
            </div>
        )
    })
}

export default MessageList