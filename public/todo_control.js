let Popup = {
    isOpen: false,
    rowIdx: null, 
    open: function(todo="", detail="", memo="", idx = null) {
        document.querySelector("#popup_div").style.display = 'block';
        let button = document.add_row_popup.submit_button;
        this.rowIdx = idx;
        if (idx) {
            button.value = "수정";
        }
        else {
            button.value = "추가";
        }
        this.isOpen = true;
    
        document.add_row_popup.new_todo.value = todo;
        document.add_row_popup.new_detail.value = detail;
        document.add_row_popup.new_memo.value = memo;
    },

    close: function() {
        document.querySelector("#popup_div").style.display = "none";
        this.isOpen = false;
    },

    add: async function() {
        let {new_todo, new_detail, new_memo} = document.add_row_popup;
        new_todo = new_todo.value;
        new_detail = new_detail.value;
        new_memo = new_memo.value;

        if (!this.rowIdx) {            
            let new_idx = await HandleStorage.addData(new_todo, new_detail, new_memo);
            TodoList.add(new_todo, new_detail, new_memo, new_idx);
        }
        else {
            TodoList.update(this.rowIdx, new_todo, new_detail, new_memo);
        }
        
        this.close();
    },

    update: function(row) {
        let old_todo = row.querySelector(".todo_name").innerText;
        let old_detail = row.querySelector(".detail").innerText;
        let old_memo = row.querySelector(".memo").innerText;
        
        Popup.open(old_todo, old_detail, old_memo, row.dataset.idx);
    }
};

let TodoList = {
    table: null,

    reset_table: function() {
        this.table.innerHTML = "";
    },

    add: function(todo_name, detail, memo, idx, done=false) {
        let new_row = document.createElement("tr");
        new_row.className = done? "done":"not_done";
        new_row.dataset.idx = idx;
        new_row.innerHTML = `
            <td class="check"><input type="checkbox" name="chbox" id="todo${idx}" /></td>
            <td class="todo_name"><label for="todo${idx}">${todo_name}</label></td>
            <td class="detail">${detail}</td>
            <td class="memo">${memo}</td>
        `
        
        new_row.addEventListener("dblclick", (e) => Popup.update(new_row));
        this.table.appendChild(new_row);
    },

    remove: async function() {
        let chboxes = document.todo_list.chbox;
        if (!chboxes.length) {
            chboxes = [chboxes];
        }

        for (let i = chboxes.length-1; i >= 0; i--) {;
            if (chboxes[i].checked) {
                const row = chboxes[i].closest("tr");
                let removed = await HandleStorage.removeData(row.dataset.idx);
                if (removed) {
                    this.table.deleteRow(row.sectionRowIndex);
                } else {
                    alert(`${row.todo_name}을 찾지 못했습니다.`);
                }
            }
        }
    },

    done: async function() {
        for (let row of this.table.children) {
            let chbox = row.querySelector("input[name=chbox]");
            if (chbox && chbox.checked) {
                
                let done_handled = await HandleStorage.setDone(row.dataset.idx, true);
                if (done_handled) {
                    row.className = 'done';
                    chbox.checked = false;
                } else {
                    alert(`${row.todo_name}을 찾지 못했습니다.`);
                }
            }
        }
    },

    undone: async function() {
        for (let row of this.table.children) {
            let chbox = row.querySelector("input[name=chbox]");
            if (chbox && chbox.checked) {
                let done_handled = await HandleStorage.setDone(row.dataset.idx, false);
                if (done_handled) {
                    row.className = 'not_done';
                    chbox.checked = false;
                } else {
                    alert(`${row.todo_name}을 찾지 못했습니다.`);
                }
            }
        }
    },

    update: async function(idx, todo_name, detail, memo) {
        let target_row = this.table.querySelector(`tr[data-idx="${idx}"]`);
        let updated = await HandleStorage.updateData(target_row.dataset.idx, todo_name, detail, memo);
            if (updated) {
                target_row.querySelector(".todo_name").innerText = todo_name;
                target_row.querySelector(".detail").innerText = detail;
                target_row.querySelector(".memo").innerText = memo;

            } else {
                alert(`${target_row.todo_name}을 찾지 못했습니다.`);
            }
    },
};

let DateSelector = {
    selected_date: new Date(),
    day_names: ["일", "월", "화", "수", "목", "금", "토"],

    date2addr: function(target_date=this.selected_date) {
        let year = `${target_date.getFullYear()}`;
        let month = `${target_date.getMonth()+1}`.padStart(2, '0');
        let date = `${target_date.getDate()}`.padStart(2, '0');

        return `/todo/${year}-${month}-${date}`;
    },
    
    getDateText: function() {
        return `${this.selected_date.getFullYear()}년 ${this.selected_date.getMonth()+1}월 ${this.selected_date.getDate()}일 (${this.day_names[this.selected_date.getDay()]}요일)`;
    },

    setDate: function(date = this.selected_date) {
        this.selected_date = date;
        fetch(this.date2addr(), {
            headers: {
                "Content-type": "application/json",
            },
        })
        .then(response => response.json())
        .then(res_json => {
            let todos = res_json;

            document.querySelector("#current_date").textContent = this.getDateText();
            TodoList.reset_table();

            todos.forEach(todo => {
                TodoList.add(todo.todo_name, todo.detail, todo.memo, todo._id, todo.done);
            })
        });

    },

    toYesterday: function() {
        this.selected_date.setDate(this.selected_date.getDate()-1);
        this.setDate()
    },

    toTomorrow: function() {
        this.selected_date.setDate(this.selected_date.getDate()+1);
        this.setDate();
    },

    toToday: function() {
        this.selected_date = new Date();
        this.setDate();
    },
};


let HandleStorage = {
    addData: async function(todo_name="", detail="", memo="", done=false) {
        let res = await fetch("/todo/add", {
            method: "POST",
            headers: {
                "Content-type" : "application/json",
            },
            body: JSON.stringify({
                date: DateSelector.selected_date,
                todo_name: todo_name,
                detail: detail,
                memo: memo,
                done: done,
            }),
        });

        let idx = await res.text();
        return idx;

    },

    removeData: async function(_id) {
        let res = await fetch("/todo/delete", {
            method: "POST",
            headers: {
                "Content-type" : "application/json",
            },
            body: JSON.stringify({
                _id: _id,
            }),
        });

        if (res.ok) {
            return true;
        } else {
            return false;
        }
    },

    updateData: async function(_id, todo_name="", detail="", memo="") {
        let res = await fetch("/todo/update", {
            method: "POST",
            headers: {
                "Content-type" : "application/json",
            },
            body: JSON.stringify({
                _id: _id,
                todo_data: {
                    todo_name: todo_name,
                    detail: detail,
                    memo: memo,
                },
            }),
        });

        if (res.ok) {
            return true;
        } else {
            return false;
        }
    },
    
    setDone: async function(_id, done=false) {
        let res = await fetch("/todo/update", {
            method: "POST",
            headers: {
                "Content-type" : "application/json",
            },
            body: JSON.stringify({
                _id: _id,
                todo_data: {
                    done: done
                },
            }),
        });
        
        if (res.ok) {
            return true;
        } else {
            return false;
        }
    },

}



document.addEventListener('DOMContentLoaded', () => {
    TodoList.table = document.querySelector("tbody");
});

document.addEventListener('keydown', (e) => {
    if (e.key != "Enter") return;
    if (Popup.isOpen) Popup.add();
    else Popup.open();
});