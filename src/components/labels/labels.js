import React from 'react'

const Labels = ({ labels }) => {
    return labels.map(label => <span className="label label-warning" >{label}</span>)
}

export default Labels