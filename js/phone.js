class App {
    constructor(){
        this.data;
        this.phone_menu = $(".phone_menu");
        this.phone_item = $(".phone_item_container");
        this.init();
    }

    async init(){
        this.data = JSON.parse(await this.loadAPI());
        this.render();
    }

    render(){
        const { statusCd , statusMsg, items } = this.data;
        if(statusCd != 200){
            alert(statusMsg);
            location.href = "/";
        }

        const data = items.reduce( (current , x) => {
            if(!current[x.deptNm]) current[x.deptNm] = [];
            current[x.deptNm].push(x);
            current['전체'].push(x);
            return current;
        } , { "전체" : []});
        this.phone_menu.empty();
        Object.keys( data ).forEach( key => {
            let div = document.createElement("div"); 
            div.innerHTML = key;
            this.phone_menu.append(div);
            this.phone_item.empty();
            $(div).on("click" , e => {
                this.phone_item.empty();
                $(".on").removeClass("on");
                $(div).addClass("on");
                if(key == "전체"){
                    const keys = Object.keys(data);
                    const len  = Array.from(keys).length;
                    for( let i = 0; i < len; i++ ){
                        if(keys[i] == "전체") continue;
                        let html = data[keys[i]].map( x =>{
                            return `
                                    <div class="label_item">
                                        <div class="name">${ x.name }</div>
                                        <div class="num">${ x.telNo }</div>
                                    </div>
                                    `;
                        }).join('');
                        this.phone_item[0].innerHTML += (`
                        <div class="phone_item">
                            <div class="phone_title">
                                <h3>${keys[i]}</h3>
                                <hr>
                            </div>
                            <div class="label_list">
                                ${html}
                            </div>
                        </div>
                        `);
                    }


                } else {
                    let html = data[key].map( x =>{
                        return `
                            <div class="label_item">
                                <div class="name">${ x.name }</div>
                                <div class="num">${ x.telNo }</div>
                            </div>`;
                    }).join('');
                    this.phone_item.html(`
                    <div class="phone_item">
                            <div class="phone_title">
                                <h3>${key}</h3>
                                <hr>
                            </div>
                            <div class="label_list">
                                ${html}
                            </div>
                        </div>
                    `);
                }
            });
        });
    }

    loadAPI(){
        return $.ajax("/restAPI/phone.php");
    }
}

window.addEventListener("load", () => {
    let app = new App();
    setTimeout(function() {
        $(".phone_menu > div:first-child").click();
    }, 100);
});