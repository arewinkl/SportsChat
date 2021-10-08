const users = [];

//Join the user to the chat
function userJoin(id, username, room) {
    const user = {id, username, room};

    users.push(user);

    return user;

};

//Get the current user with this function
function getCurrentUser(id) {
    return users.find(user => user.id == id);
}

module.exports = {
    userJoin,
    getCurrentUser
}