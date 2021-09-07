function ap_styles_to_el(el,styles){
    Object.assign(el.style,styles);
}

customElements.define("choice-btns", class ChoiceBtns extends HTMLElement {
    constructor(){
        super();
        this.init();
        this.value = null;
        this.selected = null;
        this.choices = [];
        this.change_event = null;
    }

    init(){
        this.shadow = this.attachShadow({mode:"open"});
        this.btn_holder = document.createElement("div");
        this.btn_holder.innerHTML = `
            <style>
            .choice-selected {
                background-color: var(--text);
                color:var(--sec-back);
            }
            .choice-btn {
                padding: 5px;
                border:1px solid black;
                border-radius: 0px;
                display: block;
            }
            .choice-btn:hover {
                cursor:pointer;
            }
            </style>
        `;
        ap_styles_to_el(this.btn_holder, {
            display:"flex",
            flexWrap:"no-wrap",
            justifyContent:"center"
        });
        this.shadow.appendChild(this.btn_holder);
    }

    add_choice(choice){
        const ch_btn = document.createElement("button");
        ch_btn.innerHTML = choice.text;
        ch_btn.value = choice.value ?? choice.text;
        ch_btn.classList.add("choice-btn");
        ch_btn.addEventListener("click",(e)=>{
            // if(this.selected != null && ch_btn == this.selected.element){
            //     this.deselect_choice(ch_btn);
            //     return;
            // }
            this.select_choice(ch_btn);
        });
        let btn_info = {...choice,element:ch_btn};
        this.choices.push(btn_info);
        this.btn_holder.appendChild(ch_btn);
    }

    add_choices(choice_list){
        for(let i = 0; i < choice_list.length; i++){
            this.add_choice(choice_list[i]);
        }
    }

    find_choice(find_value){
        let find_key = "value";
        if(find_value instanceof HTMLElement){
            find_key = "element";
        }
        for(let i = 0; i < this.choices.length; i++){
            if(this.choices[i][find_key] == find_value) return this.choices[i];
        }
        return null;
    }

    select_choice(find_value){
        const choice = this.find_choice(find_value);
        if(choice == null) return;
        for(let i = 0; i < this.choices.length; i++){
            this.choices[i].element.classList.remove("choice-selected");
        }
        choice.element.classList.add("choice-selected");
        this.value = choice.value ?? choice.text;
        this.selected = choice;
        if(this.change_event != null){
            this.change_event(choice.value);
        }
    }

    deselect_choice(btn){
        btn.classList.remove("choice-selected");
        this.selected = null;
        this.value = "";
    }

    set_change_event(func){
        this.change_event = func;
    }

});