```js
function checkAge (age) {
    const min = 18		//硬编码 如何处理?
    return age >= min
}
```

👇

```js
//纯函数
function checkAge (min,age) {
    return age >= min;
}
//最上面函数类似
console.log(checkAge(18,20));
```

==改造==

```js
function checkAge(min) {
    return function(age) {
        return age >= min;
    }
}

//常用基准值18
const checkAgeAdult = checkAge(18)

//不需要再重复输入基准值18
console.log(checkAgeAdult(20));
console.log(checkAgeAdult(16));
```

==小改造2==

```js
const checkAge = min => (age => age >= min);

//常用基准值18
const checkAgeAdult = checkAge(18)

//不需要再重复输入基准值18
console.log(checkAgeAdult(20));
console.log(checkAgeAdult(16));
```





> ## 柯里化

- 当一个函数有多个参数时限传递部分参数调用它(这部分参数将来永远不变)
- 返回一个新函数用来接收***`剩余参数`***
- 将多元函数转化成一元函数(也可接收多个参数)

- **`本质`**: 当实参填满形参表的时候，执行结算返回结果，否则(未填满形参表时)返回一个临时函数，继续接受实参。

```js
//lodash示例
const _ = require('loadash');

function getSum(a,b,c) {
    return a + b + c;
}

const curriedGetSum = _.curry(getSum);

console.log(curriedGetSum(1,2,3))
console.log(curriedGetSum(1,2)(3))
console.log(curriedGetSum(1)(2,3))
console.log(curriedGetSum(1)(2)(3))
```



手写柯里化

```js
function curry(func) {
    
    return function(...args) {
        
        
        
    }
    
}
```



<details>
    <summary>柯里化实现</summary>
    <pre>//闭包
function curry(func) {
    	return function curriedFn(...args) {
        //实参个数小于形参
            if(args.length < func.length) {
           		//返回一个可再次接收剩余参数的函数
                return function(...argsSecTime) {
                    return curriedFn(...args,...argsSecTime)
                }
            } else {
                return func(...args)
            }
    	}
}
    </pre>
</details>





==关键点==

- 递归

- 形参数等于实参数时 调用原方法; 不等时 返回一个新的函数 能和 外层函数拼接参数





# 总结

### 柯里化可以让我们给一个函数传递较少的参数得到一个已经记住了某些固定参数的新函数(偏函数)

### 对函数参数进行`缓存`

### 让函数粒度更小，更灵活

### 将多元函数转换成一元函数，可以组合出功能强大的函数



