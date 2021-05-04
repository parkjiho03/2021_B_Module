// 페이지네이션 클래스
class Pagination {
    constructor(app, listEl, rows) {
        this.app = app;
        this.el = document.querySelector('.paginations');
        this.listEl = document.querySelector(listEl);
        this.img = [];
        this.data = [];                                             // 총 데이터 수
        this.page = 1;                                              // 현재 페이지
        this.rows = rows;                                           // 한 페이지에 나타낼 데이터 수
    }

    createLI(value) {
        let btn = document.createElement('div');
        btn.classList.add("page_item");
        btn.innerHTML = `<a href="#">${value}</a>`;
        return btn;
    }

    btnAddEvent(btn, fn) {
        btn.addEventListener('click', fn);
    }

    // 버튼 생성 및 제어 함수
    createButton(i) {
        let btn = this.createLI(i);

        if (this.page == i) btn.classList.add("active");

        this.btnAddEvent(btn, (e) => {
            this.page = i;
            this.viewList();
        });

        return btn;
    }

    // 리스트 보여주는 함수
    viewList(img = this.img, template = this.template) {
        this.img = img;
        this.template = template;
        this.el.innerHTML = "";
        this.listEl.innerHTML = "";
        let totalPage = Math.ceil(this.img.length / this.rows);
        const cnt = 10;
        let total = Math.ceil(this.page / cnt);
        let total_page = Math.ceil(this.img.length / 8);
        let start_cnt = total * cnt - cnt + 1;
        start_cnt = start_cnt < 1 ? 1 : start_cnt;
        let end_cnt = start_cnt + cnt - 1;
        end_cnt = end_cnt > total_page ? total_page : end_cnt;
        $(".content_info > p").html(`총 ${this.img.length}건 ${this.page}p / ${totalPage}p`);

        let f_list_left_btn = this.createLI('<<');
        let t_list_left_btn = this.createLI('<');
        if (this.page > 1) {
            this.btnAddEvent(f_list_left_btn, (e) => {
                this.page = 1;
                if(this.page <= 0) {
                    this.page = 1;
                }
                this.viewList();
            });
            this.btnAddEvent(t_list_left_btn, (e) => {
                this.page--;
                this.viewList();
            });
        } else if(this.page <= 1) {
            f_list_left_btn.classList.add("disabled");
            t_list_left_btn.classList.add("disabled");
        }
        this.el.appendChild(f_list_left_btn);
        this.el.appendChild(t_list_left_btn);

        for (let i = start_cnt; i <= end_cnt; i++) {
            this.el.appendChild(this.createButton(i));
        }

        let t_list_right_btn = this.createLI('>>');
        let f_list_right_btn = this.createLI('>');
        if (this.page < totalPage) {
            this.btnAddEvent(t_list_right_btn, (e) => {
                this.page = totalPage;
                if(this.page < totalPage) {
                    this.page = totalPage;
                }
                this.viewList();
            });
            this.btnAddEvent(f_list_right_btn, (e) => {
                this.page++;
                this.viewList();
            });
        } else if(this.page >= totalPage) {
            t_list_right_btn.classList.add("disabled");
            f_list_right_btn.classList.add("disabled");
        }
        this.el.appendChild(f_list_right_btn);
        this.el.appendChild(t_list_right_btn);
        let start = this.rows * (this.page - 1);
        this.img.slice(start, start + this.rows).forEach(x => {
            this.listEl.appendChild(this.template(x));
        });
    }
}