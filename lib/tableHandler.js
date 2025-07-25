const User = require("./user");

function getOneRow(todo) {
    let _id = todo._id;
    return `
        <tr class = "${todo.done?'done':'not_done'}" data-idx="${_id}" ondblclick="Popup.update(this)">
            <td class="check"><input type="checkbox" name="chbox" id = "todo${_id}"/></td>
            <td class="todo_name"><label for="todo${_id}">${todo.todo_name}</label></td>
            <td class="detail">${todo.detail}</td>
            <td class="memo">${todo.memo}</td>
        </tr>
        `;
}

module.exports = function(user, date) {
    this.user = user;
    this.date = date;

    this.todo_date = null;
    this.todos = [];

    this.getTodos = async function() {
        if (!this.todo_date || this.date.toDateString() !== this.todo_date.toDateString()) {
            this.todos = await this.user.todo.findForDate(this.date);
            this.todo_date = this.date;
            
        }

        return this.todos;
    };

    this.changeDate = function (target_date) {
        if (target_date.toDateString() !== this.date.toDateString()) {
            this.date = target_date;
        }
    };

    this.getRows = function () {
        tableRows = ``;

        this.todos.forEach((todo) => {
            tableRows += getOneRow(todo);
        });

        return tableRows;
    };

}