let a;
function func(fn) {
    let b = 1;
    fn(b)
}

func((c)=>{
    a = c
})