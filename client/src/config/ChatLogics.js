export const getSender = (loggedUser, users) => {
    try {
        return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
    } catch (error) {
        
    }
    
}

export const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
}

export const isSameSender = (messages, currMsg, idxOfCurrMsg, userId) => {
    return (
        idxOfCurrMsg < messages.length - 1 &&
        (messages[idxOfCurrMsg + 1].sender._id !== currMsg.sender._id ||
            messages[idxOfCurrMsg + 1].sender._id === undefined) &&
        messages[idxOfCurrMsg].sender._id !== userId
    );
}

export const isLastMessage = (messages, idxOfCurrMsg, userId) => {
    return (
        idxOfCurrMsg === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    );
}

export const isSameSenderMargin = (messages, m, i, userId) => {
    if (
        i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id &&
        messages[i].sender._id !== userId
    )
        return 33;
    else if (
        (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
        (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
        return 0;
    else return "auto";
};

export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
};