// copied code lol
function get_math_func(string){

    this.is_alpha = (str) => {
        if(str.length == 0) return false;
        let alpha = "abcdefghijklmnopqrstuvwxyz";
        alpha = alpha+alpha.toUpperCase();
        for(let c of str){
            if(alpha.indexOf(c) == -1){
                return false;
            }   
        }
        return true;
    }

    this.get_math_func_name = (sub)=>{
        let alts = {
            "ln":"Math.log",
            "log":`Math.log10`,
            "arcsin":`Math.asin`,
            "arccos":`Math.acos`,
            "arctan":`Math.atan`,
            "arctan2":`Math.atan2`,
            "arcsinh":`Math.asinh`,
            "arccosh":`Math.acosh`,
            "arctanh":`Math.atanh`,
            "e":`Math.E`,
            "pi":`Math.PI`
        };
        if(sub in alts){
            return alts[sub];
        }
        if(sub in Math){
            return "Math."+sub;
        }
        return false;
    }

    this.to_eq_string = (str)=>{
        str = str.replaceAll("^","**");
        let unknown = false;
        let un_begin = -1;
        let un_end = -1;
        let depth = 0;
        let op_chars = ".+*-/(){}";
        let digits = "1234567890";
        let return_str = "return ";
        for(let i = 0; i < str.length; i++){
            let c = str[i];
            if(!unknown){
                if(op_chars.indexOf(c) > -1 || digits.indexOf(c) > -1){
                    return_str+=c;
                }else{
                    unknown = true;
                    un_begin = i;
                    un_end = i+1;
                }
            }else{
                if(op_chars.indexOf(c) > -1){
                    let func = this.get_math_func_name(str.slice(un_begin, un_end));
                    if (func === false) return false;
                    return_str += func;
                    return_str+=c;
                    unknown = false;
                }else{
                    un_end += 1;
                }
            }
        }
        if(unknown){
            let func = this.get_math_func_name(str.slice(un_begin, un_end));
            if(func === false) return false;
            return_str += func;
        }
        return return_str;
    }

    return new Function(this.to_eq_string(string));

}