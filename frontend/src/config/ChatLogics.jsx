export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name; //As it is not a group chat therefore users array will only have 2 users
};

export const getFullSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0]; //As it is not a group chat therefore users array will only have 2 users
};

export const isSameSender = (messages, m, i, userId) => {
  //m is the current message, i is the index of the current message
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

//To add photo on the last message of a sender
export const isLastMessage = (messages, i, userId) => {
  return (
    i == messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId && //user is the current logged in user
    messages[messages.length - 1].sender._id
  );
};

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
  return i > 0 && messages[i - 1].sender._id === m.sender._id; //sender id of the previous message is same as the current message's sender id
};
