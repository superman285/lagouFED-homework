#### 纯函数+柯里化 容易写出洋葱代码

`f(g(h(x)))`

```js
//获取数组最后一个元素再转成大写字母
_.toUpper(_.first(_.reverse(array)));
```

#### 函数组合可以把细粒度函数重新组合 生成一个新函数 可避免洋葱代码



函数组合过程 可不考虑中间结果

fn = compose(f1, f2, f3)

b = fn(a)



> ==**函数组合**== compose

💡定义: 如果一个输入要经过多个函数处理才能得到最终值，可以把中间过程经历的函数合并成一个函数。



- 不同函数就像数据管道，函数组合就是把这些管道连接🔗起来，让数据穿过多个管道形成最终结果
- **`函数组合默认顺序从右到左执行`** 先执行右边参数，再向左执行
- 组合的是一些纯函数



🌰

```js
function compose(f, g) {
    return function(value) {
        return f(g(value))
    }
}

function reverse(arr) {
    return [...arr].reverse()
}
function first(arr) {
    return arr[0]
}

//先reverse 再 first
const lastEle = compose(first,reverse)
console.log(lastEle([1,2,3,4]))


```



#### 手写compose

```js
function compose(...args) {
    // 正式调用函数时的真正参数value
    return function(value) {
        return args.reverse().reduce(function(acc,fn) {
            console.log('value',value)
            return fn(acc)
        },value)
    }
}

const compose = (...args) => value => args.reverse().reduce((acc,fn)=>fn(acc),value);
```





## 结合律 (注意顺序 )

- compose(f,g,h) == compose(compose(f,g),h) == compose(f,compose(g,h))



