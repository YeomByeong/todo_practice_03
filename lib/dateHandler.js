const tableHandler = require("./tableHandler");

const day_names = ["일", "월", "화", "수", "목", "금", "토"];

module.exports = function(user) {
    this.selected_date = removeTime(new Date()),
    this.table = new tableHandler(user, this.selected_date);

    function removeTime (date) {
        date.setHours(0, 0, 0, 0);
        return date;
    };

    this.getDateText = function() {
        return `${this.selected_date.getFullYear()}년 ${this.selected_date.getMonth()+1}월 ${this.selected_date.getDate()}일 (${day_names[this.selected_date.getDay()]}요일)`;
    };

    this.setDate = async function(target_date=null, as_string = false) {
        if (target_date && (target_date.toDateString() !== this.selected_date.toDateString())) {
            this.selected_date = removeTime(target_date);
            this.table.changeDate(target_date);
        }
        await this.table.getTodos();

        if (as_string) {
            return {date: this.getDateText(), todos: this.table.getRows()};
        }

        return {date: this.selected_date, todos: this.table.todos};
    };
};