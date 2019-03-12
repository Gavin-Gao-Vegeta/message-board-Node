class Message {
  constructor() {
    this.action = 'add';

    this.addBtn = document.querySelector('.add-btn-con button');
    this.cancelSubmitBtn = document.querySelector('.cancel-submit-btn');
    this.submitBtn = document.querySelector('.submit-btn');
    this.cancelBtn = document.querySelector('.cancel-btn');
    this.confirmBtn = document.querySelector('.confirm-btn');
    this.form = document.querySelector('.add-form');
    this.confirmWin = document.querySelector('.delete-confirm');
    this.editfrimWin = document.querySelector('.main-edit');
    this.usernameEle = document.querySelector('[name=username]');
    this.contentEle = document.querySelector('.add-form textarea');
    this.edit = document.querySelector('.edit-btn');
    this.editCancle = document.querySelector('#edit-cancle');
    // console.log(this.usernameEle);
    this.addEvent();
    this.getMessageList();
    // this.onEdit(19);
  }
  addEvent() {
    this.editCancle.addEventListener('click', () => {
      this.editfrimWin.style.display = 'none';
    })
    this.addBtn.addEventListener('click', () => {
      this.usernameEle.value = '';
      this.contentEle.value = '';
      this.action = 'add';
      this.form.style.display = 'block';
    });
    this.cancelSubmitBtn.addEventListener('click', () => {
      this.form.style.display = 'none';
    });
    this.submitBtn.addEventListener('click', () => {
      // submit
      this.submit();
    });
    this.cancelBtn.addEventListener('click', () => {
      this.confirmWin.style.display = 'none';
    });
    this.confirmBtn.addEventListener('click', () => {
      // delete
      this.deleteMsg();
    });
  }
  addMsgItemEvent() {
    document.querySelector('.delete-btn').addEventListener('click', (e) => {
      this.confirmWin.style.display = 'block';
      this.deleteId = e.target.getAttribute('data-id');
      console.log(this.deleteId);
    });
    document.querySelector('.edit-btn').addEventListener('click', (e) => {
      this.editId = e.target.getAttribute('data-id');
      console.log(this.editId);
      this.onEdit(this.editId);
    });
  }
  getMessageList() {
    fetch('/msg')
      .then(response => response.json())
      .then((list) => {
        this.list = list;
        var html = '';
        list.forEach((item) => {
          html += `<div class="msg" id="msg-${item.id}">
        <p><label>${item.username}</label>发表于${item.created_at}
          <span>
            <a href="#" data-id="${item.id}" class="delete-btn btn btn-default">删除</a>
            <a href="#" data-id="${item.id}" data-username="${item.username}" class="btn btn-default edit-btn">编辑</a>
          </span>
        </p>
        <p>${item.content}</p>
      </div>`
        });
        document.querySelector('.msg-list').innerHTML = html;
        this.addMsgItemEvent();
      })
  }
  submit() {
    var username = this.usernameEle.value;
    var content = this.contentEle.value;
    var data = {
      username,
      content
    };
    var method = 'POST'
    if (this.action === 'edit') {
      data.id = this.editId;
      method = 'PUT';
    }
    fetch('/msg', {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      },
      method: method
    })
      .then(response => response.json())
      .then((res) => {
        console.log(res);
        if (res.code === 0) {
          this.getMessageList();
          this.form.style.display = 'none';
        } else {
          alert(res.error);
        }
      });
  }
  deleteMsg() {
    var url = '/msg?id=' + this.deleteId;
    fetch(url, {
        method: 'DELETE'
      })
      .then(response => response.json())
      .then((res) => {
        if (res.code === 0) {
          this.getMessageList();
          this.confirmWin.style.display = 'none';
        } else {
          alert(res.error);
        }
      })
    // this.confirmWin.style.display = 'none';
  }
  onEdit(id) {
    id = parseInt(id);
    this.action = 'edit';
    var $ele = document.getElementById('msg-' + id);
    var username = $ele.querySelector('label').innerHTML;
    console.log('username', username);
    var content = $ele.querySelector('p:last-child').innerHTML;
    console.log('content', content);
    var msg = null;
    for (var i = 0; i < this.list.length; i++) {
      if (this.list[i].id === id) {
        msg = this.list[i];
        break;
      }
    }
    this.list.forEach(item => {
      if (item.id === id) {
        msg = item;
      }
    });
    this.usernameEle.value = msg.username;
    this.contentEle.value = msg.content;
    this.form.style.display = 'block';
  }
  editMsg() {
    let url = '/msg?id=' + this.editId;
    fetch(url)
      .then(response => response.json())
      .then((data)=>{
        let mes = JSON.stringify(data);
        let editId  = parseInt(this.editId);
        let arr = data.find((item)=>{
          return item.id === editId
         })
        let html =`
        <div class="edit-confirm">
        <input type="text" value="${arr.username}">
        <input type="text" value="${arr.content}">
        </div>
        `;
        this.editfrimWin.innerHTML = html;
        console.log(arr.content)
        console.log(data)
        console.log(data[0].username)
        // let data = responseText[0].toString();
        // console.log(JSON.stringify(data))
        // console.log(responseText)
        // console.log(responseText[0].toString())
      })
    // .then(response => response.text())
    // .then((responseText)=>{
    //   console.log(responseText)
    // });

  }
}

var message = new Message();

// .then((list)=>{
      //   let html = '';
        
      //   this.$list.forEach((item)=>{
      //     html +=`<div class="edit-confirm"> 
      //       <input type="text" value="${item.username}">
      //       <input type="text" value="${item.content}">
                      
      //     </div>`
      //     this.editfrimWin.innerHTML = html;
          
      //   })
        
      // })