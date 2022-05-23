const getCookie = async (req, res, next) => {
    if (req.headers['Token']) {
        console.log("Yes")
        const Cookie = req.Headers.GetValues("Token");
        return Cookie;
    } else {
        console.log('No');
        return false
    }
}

module.exports = { getCookie }
