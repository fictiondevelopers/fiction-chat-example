import { FictionChat } from 'fiction-chat-server';

const fictionChatConfig = {
    dbUrl: process.env.DATABASE_URL,
    websocketPort: parseInt(process.env.WEBSOCKET_PORT || '8080'),
    userTableConfig: {
        tableName: 'User',
        idColumn: 'id',
        fullNameColumn: 'name',
        profilePictureColumn: 'avatar'
    },
    jwtSecret: process.env.JWT_SECRET,
    jwtUserIdColumn: 'id'
};


const fictionChat = new FictionChat(fictionChatConfig);
// Wait for initialization before accepting requests
await new Promise((resolve, reject) => {
    const checkInit = () => {
        if (fictionChat.initialized) {
            resolve();
        } else {
            setTimeout(checkInit, 100);
        }
    };
    checkInit();
});
export default async function handler(req, res) {

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    const queryparammethod = req.query.method;
    let newReq = {
        ...req,
        url: `/${queryparammethod}`,
        method: queryparammethod,
        headers: req.headers
    }
    if (!fictionChat.initialized) {
        return res.status(400).json({ error: 'FictionChat is not initialized' });
    }
    return fictionChat.handleRequest(newReq, res);
}
