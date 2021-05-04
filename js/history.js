class dusgur 
{   
    constructor() {
        this.year = "";
        this.data = [];
        this.init();
    }
    init() {
        this.getJSON();
        this.event();
    }

    draw() {
        let list = this.data.reduce((obj,x)=> {
            let y = new Date(x.date).getFullYear();
            if(obj[y] == undefined) {
                obj[y] = [];
            }
            obj[y].push(x);
            return obj;
        },{});
        let a = 0;
        Object.keys(list).forEach(el => {
            if(this.year == el) {
                a++;
            }
        });
        if(a == 0) {
            Object.keys(list).forEach(el => {
                this.year = el;
            });
        }
        let nav = document.querySelector(".dusgur nav");
        nav.innerHTML = "";
        Object.keys(list).map(f=> {
            let li = document.createElement("li");
            li.innerHTML = f;
            li.dataset.idx = f;
            if(this.year == f) {
                li.classList.add("check");
                $(".all_year > h1").text(f+"년");
                localStorage.setItem("year",this.year);
            }
            nav.prepend(li);
        });
        let dom =  document.querySelector(".list");
        dom.innerHTML = "";
        Object.values(list).map(f=> {
            let y = new Date(f[0].date).getFullYear();
            if(this.year == y) {
                f.forEach(el => {
                    let li = document.createElement("li");
                    let m = new Date(el.date).getMonth()+1;
                    let d = new Date(el.date).getDate();
                    if(m < 10) {
                        m = "0"+m;
                    }
                    if(d < 10) {
                        d = "0"+d;
                    }
                    li.innerHTML = `&#183; ${m}. ${d} ${el.text} <div class="list_btnbox"><button class="btn btn-primary">수정</button><button class="btn btn-danger">삭제</button></div>`;
                    li.querySelector(".btn-primary").addEventListener("click",()=> {
                        this.mod(el);     
                    });
                    li.querySelector(".btn-danger").addEventListener("click",()=> {
                        this.del(el);     
                    });
                    dom.prepend(li);
                });
            }
        });


    }   

    event() {
        document.querySelector(".dusgur nav").addEventListener("click" , e=> {
            let idx = e.target.dataset.idx;
            if(idx !=undefined) {
                this.year = idx;
                this.sendJSON();
            }
        });
        document.querySelector(".add").addEventListener("click",e=> {
            this.make();
        });
    }

    make() {
        let dom = document.createElement("div");
        dom.innerHTML = `
        <div class="insert_popup">
            <div class="popup_title">
                <p>연혁관리</p>
            </div>
            <div class="popup_close">&times;</div>
            <div class="insert_popup_content">
                <p> (*)연혁내용 : <input type="text" class="texta"></p>
                <p> (*)연혁일자 : <input type="date" class="date"></p>
            </div>
            <div class="btnbox">
                <button class="btn btn-danger btn-close">닫기</button>
                <button class="btn btn-primary">저장</button>
            </div>
        </div>`;
        dom.classList.add("insert_popup_container");
        document.querySelector("body").appendChild(dom);
        dom.querySelector("div>.popup_close").addEventListener("click",()=> { dom.remove()});
        dom.querySelector(".btnbox > .btn-close").addEventListener("click",()=> { dom.remove()});
        dom.querySelector(".btn-primary").addEventListener("click",()=> {
            let text  = dom.querySelector(".texta").value;
            let date  = dom.querySelector(".date").value;
            if(text.trim() == "") {
                alert("연혁내용이 비어있습니다.");
                return;
            }
            if(date.trim() == "") {
                alert("연혁일자가 비어있습니다.");
                return;
            }
            if(text.trim() != "" && date.trim() != "" ) {
                let a = new Object();
                a.text = text;
                a.date = date;
                a.del = 0;
                this.data.push(a);
                this.sendJSON();
                dom.remove();
            }
            alert("등록되었습니다.")
        });
    }

    del(el) {
        let dom = document.createElement("div");
        dom.innerHTML = `
        <div class="del_p">
            <div class="delete_popup_title">
                <p>연혁관리</p>
            </div>
            <div class="del_text">
                <i class="fas fa-exclamation-triangle"></i> 
                <p>연혁을 삭제하시겠습니까?</p>
            </div>
            <div class="delete_btnbox">
                <button class="btn btn-danger as">확인</button>
                <button class="btn btn-primary closed">취소</button>
            </div>
        </div>`;
        dom.classList.add("insert_popup_container","al");
        document.querySelector("body").appendChild(dom);
        dom.querySelector(".closed").addEventListener("click",()=> { dom.remove()});
        dom.querySelector(".as").addEventListener("click",()=> {
                el.del = 1;
                this.sendJSON();
                dom.remove();
                alert("삭제되었습니다.");
        });
    }

    mod(el) {
        let dom = document.createElement("div");
        dom.innerHTML = `
        <div class="insert_popup">
            <div class="popup_title">
                <p>연혁수정</p>
            </div>
            <div class="popup_close">&times;</div>
            <div class="insert_popup_content">
                <p> (*)연혁내용 : <input type="text" class="texta" value="${el.text}"></p>
                <p> (*)연혁일자 : <input type="date" class="date" value="${el.date}"></p>
            </div>
            <div class="btnbox">
            <button class="btn btn-danger btn-close">닫기</button>
            <button class="btn btn-primary">저장</button>
            </div>
        </div>`;
        dom.classList.add("insert_popup_container");
        document.querySelector("body").appendChild(dom);
        dom.querySelector("div>.popup_close").addEventListener("click",()=> { dom.remove()});
        dom.querySelector(".btnbox > .btn-close").addEventListener("click",()=> { dom.remove()});
        dom.querySelector(".btn-primary").addEventListener("click",()=> {
            let text  = dom.querySelector(".texta").value;
            let date  = dom.querySelector(".date").value;
            if(text.trim() == "") {
                alert("연혁내용이 비어있습니다.");
                return;
            }
            if(date.trim() == "") {
                alert("연혁일자가 비어있습니다.");
                return;
            }
            if(text.trim() != "" && date.trim() != "" ) {
                el.text = text;
                el.date = date;
                this.sendJSON();
                dom.remove();
            }
            alert("수정되었습니다.");
        });
    }


    getJSON() {
        let data = JSON.parse(localStorage.getItem("data"));
        if(data == null) {
            this.data = [];
        }else {
            this.data = [];
            data.sort((a,b)=> {
                let aD = new Date(a.date);
                let bD = new Date(b.date);
                return aD-bD;
            });
            data.map(f=>{
                if(f.del != 1) {
                    this.data.push(f);
                }
            })
        }
        let year = localStorage.getItem("year");
        if(year == null) {
            year = "";
        }
        this.year = year;
        this.draw();
    }

    sendJSON() {
        localStorage.setItem("data",JSON.stringify(this.data));
        localStorage.setItem("year",this.year);
        this.getJSON();
    }

}

window.onload = function() {
    let a = new dusgur();
}