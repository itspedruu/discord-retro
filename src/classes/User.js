const {Users} = require('../../utils/database.js');

module.exports = class User {
    static async setupPhone(id, phoneNumber) {
        let user = await User.getByID(id);
        
        user.phone = phoneNumber;
        await user.save();
    }
    
    static async isInCall(id) {
        let user = await User.getByID(id);
        return user.inCall;
    }

    static getByID(id) {
        return new Promise((resolve, reject) => {
            Users.findById(id, async (err, doc) => {
                if (err) reject(err);
                
                if (!doc) {
                    // Creates a new document with the respective user id if it doesn't exist in the database
                    doc = new Users({_id: id});
                    // Saves the document
                    await doc.save();
                }

                // Resolves the document
                resolve(doc);
            });
        });
    }
}