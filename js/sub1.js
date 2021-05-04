class App {
    constructor() {
        this.data();
        this.img = [];
        console.log("asdf");
    }

    init(list) {
        setTimeout(document.querySelector("#album").click(),1);
        list.forEach((li) => {
            $.ajax({
                url: "/xml/detail/"+li.ccbaKdcd+"_"+li.ccbaCtcd+"_"+li.ccbaAsno+".xml",
                dataType: "xml",
                success: (data) => {
                    let imageUrl = "";
                    $(data).find("item").each(function() {
                        imageUrl = $(this).find("imageUrl").text();
                        li.imageUrl = imageUrl;
                    });
                }
            });
            this.listPage = new Pagination(this, ".angud_content", 8);
            this.img.push(li);
        });
        this.addEvent();
    }

    addEvent() {
        document.querySelector("#album").addEventListener("click", this.showList.bind(this));
    }

    showList() {
        this.listPage.viewList(this.img, this.angud_template);
    }

    angud_template(x) {
        let div = document.createElement("div");
        div.classList.add("content_item");
        if(x.imageUrl !== "") {
            div.innerHTML = `
                <div class="content_img">
                    <img src="/xml/nihcImage/${x.imageUrl}" alt="alt" title="${x.imageUrl}">
                </div>
                <div class="content_title">${x.ccbaMnm1}</div>
            `;
        } else {
            div.innerHTML = `
                <div class="content_img">
                    <div>no image</div>
                </div>
                <div class="content_title">${x.ccbaMnm1}</div>
            `;
        }
        return div;
    }

    data() {
        $.ajax({
            url: "/xml/nihList.xml",
            dataType: "xml",
            success: (data) => {
                let list = [];
                $(data).find("item").each(function() {
                    let datas = {
                        sn:$(this).find("sn").text(),
                        ccbaMnm1:$(this).find("ccbaMnm1").text(),
                        ccbaKdcd:$(this).find("ccbaKdcd").text(),
                        ccbaCtcd:$(this).find("ccbaCtcd").text(),
                        ccbaAsno:$(this).find("ccbaAsno").text(),
                        imageUrl:""
                    };
                    list.push(datas);
                });
                this.init(list);
            }
        });
    }
}

window.addEventListener("load", () => {
    let app = new App();
    setTimeout(function() {
        document.getElementById('album').click();
    }, 100);
    setTimeout(function() {
        document.getElementById('album').click();
    }, 150);
    setTimeout(function() {
        document.getElementById('album').click();
    }, 200);
});