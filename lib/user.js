//const UserDB = require("./db/user");
const TodoDB = require("./db/todo");

module.exports = function(user_db_id) {
    this._id = user_db_id;
    this.todo = new TodoDB(user_db_id);


    this.log_out = function() {
        this._id = null;
        this.todo = null;
    };

    // async function unregister() {
    //     await this.todo.todoModel.collection.drop();
    //     await this.todo.orderModel.collection.drop();
    //     await UserDB.unregister(this._id);
    // }
}