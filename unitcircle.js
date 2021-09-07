window.addEventListener("load",function(e){
    const info = document.querySelector("#info");
    const svg_circle = document.querySelector("#svg_ang");
    const svg_canvas = document.querySelector("#circle");

    const trig_funcs = {
        "sin":Math.sin,
        "cos":Math.cos,
        "tan":Math.tan,
        "csc": x => 1/Math.sin(x),
        "sec": x => 1/Math.cos(x),
        "cot": x => 1/Math.tan(x),
    };

    const ang_convs_to_rad = {
        "rad":x => x,
        "deg":x => x/180*Math.PI,
        "grad":x => x / 200 * Math.PI
    };

    const rad_to_ang_convs = {
        "rad": x => x,
        "deg": x => x*180/Math.PI,
        "grad": x => x*200/Math.PI
    };

    const max_for_ang = {
        "rad":2*Math.PI,
        "deg":360,
        "grad":400
    };

    const deg_input = document.querySelector("input[name='ang']");
    deg_input.value = "18";

    const CHOICE = new_struct(["text","string"],["value","string"]);
    const mult_choice_el = document.querySelector("#ang_type");

    const is_zero_or_inf = (x)=>{
        if(Math.abs(x) < 0.001) return 0;
        if(Math.abs(x) > 1165619676597684) return NaN;
        return x.toFixed(3);
    };

    const update_info = (val=undefined,cos_mult=1,sin_mult=-1)=>{
        let ang_type = mult_choice_el.value;
        let ang_func = get_math_func(deg_input.value);
        let ang_value = 0;

        try {
            ang_value = ang_func();
        }catch(e){
            console.log(e);
            console.log("invalid angle");
            return;
        }

        const rad_equiv = ang_convs_to_rad[ang_type || "deg"](ang_value);

        info.innerHTML = "";
        for(let trig_func in trig_funcs){
            let info_p = document.createElement("li");
            info_p.innerText = `${trig_func}: ${is_zero_or_inf(trig_funcs[trig_func](rad_equiv))}`;
            info.appendChild(info_p);
        }

        svg_circle.style.display = "inline";
        svg_circle.setAttribute("cx",(250 + cos_mult*Math.cos(rad_equiv)*185).toString());
        svg_circle.setAttribute("cy",(250 + sin_mult*Math.sin(rad_equiv)*185).toString());

    };

    mult_choice_el.add_choices([
        CHOICE("degree","deg"),
        CHOICE("radian","rad"),
        CHOICE("gradian","grad")
    ]);
    mult_choice_el.set_change_event(update_info);
    mult_choice_el.select_choice("deg");

    deg_input.addEventListener("input",update_info);

    let canvas_clicking = false;
    svg_canvas.addEventListener("mousedown",()=>{
        canvas_clicking = true;
    });
    svg_canvas.addEventListener("mouseup",()=>{
        canvas_clicking = false;
    });
    svg_canvas.addEventListener("mousemove",(e)=>{
        let boundingRect = svg_canvas.getBoundingClientRect();
        if(canvas_clicking){
            const ydif = -(boundingRect.top + boundingRect.height/2) + e.clientY;
            const xdif = -(boundingRect.left + boundingRect.width/2) + e.clientX;
            const new_ang = Math.atan2(-ydif,xdif);
            const max = max_for_ang[mult_choice_el.value];
            deg_input.value = (rad_to_ang_convs[mult_choice_el.value](new_ang) %  max).toFixed(3).toString();
            update_info(undefined,1,-1);
        }
    });

});