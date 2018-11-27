import React from 'react';
import Labels from '../labels/labels';

const MessageList = ({ messages }) => {

    return messages.map((message, idx) => {
        let read = message.read ? "read" : "unread"
        let selected = message.selected ? "selected" : "unselected"
        let labels = [...message.labels]
        return (
            <div className={`row message ${read} ${selected}`} key={idx}>
                <div className="col-xs-1">
                    <div className="row">
                        <div className="col-xs-2">
                            <input type="checkbox" checked={message.selected} />
                        </div>
                        <div className="col-xs-2">
                            <i className="star fa fa-star-o"></i>
                        </div>
                    </div>
                </div>
                <div className="col-xs-11">
                    <div>
                        <Labels labels={labels} className="label label-warning" />
                        {message.subject}
                    </div>
                </div>
            </div>
        )
    })
}

export default MessageList