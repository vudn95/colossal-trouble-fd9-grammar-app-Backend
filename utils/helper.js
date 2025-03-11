const isAdmin = (email, password) => {
    if (email === process.env.ADMIN_USER_NAME && password === process.env.ADMIN_PASSWORD) {
        return true;
    }
    return false;
}

module.exports = { isAdmin };