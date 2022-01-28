// 实现你认为不错的js继承方式
function Parent(name) {
    this.name = name;
    this.say = () => {
        console.log(111);
    };
}

Parent.prototype.play = () => { // 父级原型上的方法
    console.log(222);
};

function Children(name) {
    Parent.call(this)
    this.name = name
}

Children.prototype = Object.create(Parent.prototype)
Children.prototype.constructor = Children
Children.prototype.hi = () => {  console.log('hi'); }

const par = new Parent('张三')
const chil = new Children('李四')
chil.hi()
chil.play()
console.log(par);
console.log(chil);
