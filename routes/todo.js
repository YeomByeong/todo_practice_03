let express = require('express');
let router = express.Router();

let template = require("../lib/template");
let dateHandler = require("../lib/dateHandler");

let User = require("../lib/user");

let user = null;
let dhandler = null;

router.use(async (req, res, next) => {
    if (!req.session.is_logined) {
        user = null;
        dhandler = null;
        res.redirect("/account/login");
    }
    else if (!user || user.user_db_id !== req.session.user) {
        user = new User(req.session.user);
        dhandler = new dateHandler(user);
    }
    next();
})

router.get("/", async (req, res) => {
    //console.log(req);
    let {date, todos} = await dhandler.setDate(new Date(), true);
    res.send(template.todo_html(date, todos, req.session.nickname));
           
});

router.get("/:date", async (req, res) => {
    let date = new Date(req.params.date);
    if (date.valueOf()) {
        let date_and_todos = await dhandler.setDate(new Date(req.params.date));
        res.json(date_and_todos.todos);
    }
});

router.post("/add", async (req, res) => {
    let ret_id = await user.todo.addNew(req.body);
    res.send(ret_id);
});

router.post("/update", async (req, res) => {
    let {_id, todo_data} = req.body;
    let updated = await user.todo.update(_id, todo_data);
    
    if (updated) {
        res.status(200).send();
    } else {
        res.status(404).send();
    }
});

router.post("/delete", async (req, res) => {
    let {_id} = req.body;
    let removed = await user.todo.delete(_id);
    if (removed) {
        res.status(200).send();
    } else {
        res.status(404).send();
    }

});

module.exports = router;
