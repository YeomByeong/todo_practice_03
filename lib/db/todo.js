const mongoose = require("mongoose");
const {Schema} = mongoose;


require("dotenv").config();
const TodoData = require("../todoData");

const todoSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    todo_name: String,
    detail: String,
    memo: String,
    done: {
        type: Boolean,
        default: false,
    },
});

const orderSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    order: [{
        type: mongoose.Types.ObjectId,
        ref: 'Todo'}],
});

module.exports = function(user_id) {
    this.dbUrl = process.env.DB_URL;
    // todoModel: mongoose.model("Todo", todoSchema),
    // orderModel: mongoose.model("Order", orderSchema),
    this.todoModel = mongoose.model(`Todo-${user_id}`, todoSchema);
    this.orderModel = mongoose.model(`Order-${user_id}`, orderSchema);
    
    // this.connect = async function(url=this.dbUrl) {
    //     try {
    //         await mongoose.connect(url);
    //         console.log("Connected to MongoDB!");
    //     } catch(err) {
    //         console.log(err);
    //     }
    // };

    this.addNew = async function(new_todo=new TodoData()) {
        new_todo.date = new Date(new_todo.date);
        new_todo.date.setHours(0, 0, 0, 0);

        let new_db_data = this.todoModel(new_todo);
        await new_db_data.save();

        let order_list = await this.orderModel.findOne({date: new_db_data.date});

        if (!order_list) {
            await this.setOrder( new_db_data.date, [new_db_data._id]);
        } else {
            order_list.order.push(new_db_data._id);
            await order_list.save();
        }

        return new_db_data._id;
    };

    this.findForDate = async function(query_date) {
        query_date.setHours(0, 0, 0, 0);
        let order_list = await this.orderModel.findOne({date: query_date}, {_id:0, order: 1});
        if (!order_list) {
            return [];
        }

        let todo_list = await this.todoModel.find({date: query_date});
        let ordered_list = order_list.order.map(id => todo_list.find(todo => todo._id.toString() === id.toString()));
        
        //console.log(ordered_list);

        return ordered_list;
    };

    this.update = async function(_id, updated_todo) {
        if ("date" in updated_todo) {
            updated_todo.date = new Date(updated_todo.date);
            updated_todo.date.setHours(0, 0, 0, 0);
        }
        let ret = await this.todoModel.findByIdAndUpdate(_id, updated_todo);
        return (ret !== null);
    };

    this.delete = async function(_id) {
        //let ret = await this.todoModel.deleteOne({_id:_id});
        let ret = await this.todoModel.findByIdAndDelete(_id);
        
        if (ret === null) {
            return false;
        }

        let order_list = await this.orderModel.findOne({order: _id});
        // order_list.order.remove(_id);
        order_list.order = order_list.order.filter(id => id.toString() !== _id.toString());
        if (order_list.order.length == 0) {
            await this.orderModel.deleteOne({_id: order_list._id});
        }
        else {
            await order_list.save();
        }
        return true;
    };

    this.setOrder = async function(date, order_list) {
        date.setHours(0, 0, 0, 0);
        await this.orderModel.updateOne({date: date}, {order: order_list}, {upsert: true});
    };
}
