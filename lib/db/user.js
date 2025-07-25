const mongoose = require("mongoose");
const {Schema} = mongoose;

const TodoDB = require("./todo");

require("dotenv").config();

const userSchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    }
});


module.exports = {
    userModel: mongoose.model("User", userSchema),

    findUser: async function(user_id) {
        let user = await this.userModel.findOne({user_id: user_id});
        return user;
    },

    sign_up: async function(user_info) {
        let new_user = this.userModel(user_info);
        await new_user.save();

        return new_user._id;
    },


    unregister: async function(user_db_id) {
        this.userModel.findByIdAndDelete(user_db_id);
    }
}
