const fs = require('fs').promises;

const getDeltaToken = (filePath) => {
    const token = fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) throw err;
        let jsonData = JSON.parse(data);
        return jsonData
    })
    return token
}


const postDeltaToken = (filePath, newValue) => {
    const newToken = {
        "token": newValue
    }        
    fs.writeFile(filePath, JSON.stringify(newToken), (err) => {
        if (err) {
            return err;
        } else {
            return newToken
        }
    });
    return newToken
}

exports.getDeltaToken = getDeltaToken;
exports.postDeltaToken = postDeltaToken;