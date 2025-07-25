module.exports = function (todo_name="", detail="", memo="", done=false, date=new Date(), user="") {
    date.setHours(0,0,0,0);
    this.user = user;
    this.date = date;
    this.todo_name = todo_name;
    this.detail = detail;
    this.memo = memo;
    this.done = done;
};
