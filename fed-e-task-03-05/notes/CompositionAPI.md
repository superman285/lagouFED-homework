## 几个常用API

#### `createApp`

参数 接收一个选项对象

创建vue对象，比vue2中的vue实例对象少了部分成员，成员没有$开头

成员有component、config、mixin、use、mount、unmount、directive、provide、version等

例如返回app ，然后 app.mount(‘#app’)



#### `setup`

composition API的入口

第一个参数为 props (!不能被解构) - 响应式对象不能被解构

第二个参数为 context (对象成员 attrs | emit | slots)

返回值(返回一个对象) 

返回需要在模板使用的内容(可以上方定义好直接写在返回值中或者直接在返回值中定义)

```js
setup() {
    xxxxx
    cosnt count = ref(18)
    
    return {
        count,
        increase: ()=>{
            count++
        }
    }
}
```





setup函数内没有this，因为组件实例未创建完，无法访问到data|computed|methods



#### `reactive`

接收对象或数组作为参数，返回proxy，(接收对象或数组才能转成响应式)

将一个对象转换为响应式对象，包括对象内的嵌套对象，可以套娃



#### `ref`

将普通数据(可以是对象，也可以是基本类型数据)转换为响应式数据

接收一个参数，返回一个带有value属性的对象

通过xx.value来访问和改变这个响应式变量，在模板template中使用时可以把value省略，但在js中value不可以省略

```js

<div>{{counter}}</div>

import { ref } from 'vue'

const counter = ref(0)

console.log(counter) // { value: 0 }
console.log(counter.value) // 0

counter.value++
console.log(counter.value) // 1
```



#### `toRefs`

传入一个proxy对象(一般是响应式数据)作为参数

***将一个响应式对象的所有属性 都转换为响应式的(变成了对象)*** 

转换后的响应式对象的属性成了一个类似`{value: 'xx'}`的对象 同 `ref(var)`后的效果



> <font color=#F12F28 style="font-weight:600">如果对当前的响应式对象进行解构，会导致响应式对象变为普通的变量，失去响应性，所以不应当直接对响应式对象进行解构操作</font>
>
> 这时候 **toRefs** 就很有用了  将返回的响应式对象用 toRefs包裹起来 然后就可以正常解构后使用了

```js
改造前
//模板
<div>
  x: {{position.x}}
  y: {{position.y}}
</div>


// js代码
const useMouse = ()=>{
    xxxxx...
    position.x = xxx.x
    position.y = xxx.y
    return position //position为响应式对象
}

setup() {
    const position = useMouse()
    return {
        position
    }
}

改造后
//模板
<div>
  x: {{x}}
  y: {{y}}
</div>


// js代码
const useMouse = ()=>{
    xxxxx...
    position.x = xxx.x
    position.y = xxx.y
    return toRefs(position) //position为响应式对象
}

setup() {
    const {x,y} = useMouse()
    return {
        x,
        y
    }
}
```



## computed

#### 第一种用法 传入带有返回值的函数

函数返回值含有响应式数据，当函数依赖的响应式数据发生变化时 重新执行函数

```js
setup(){
    const age = ref(18)
    const agePlusOne = computed(()=> age.value + 1)
    return {
        age,
        agePlusOne
    }
}
# 修改age，agePlusOne自动+1
```

#### 第二种用法 传入对象

```js
const count = ref(0)
const pluseOne = computed({
    get: ()=> count.value + 1,
    set: val => {
        // 修改的值 - 1
        count.value = val - 1
    }
})
```

**v2旧版本写法**

```js
data(){
    return {
        age: 18
    }
},
computed: {
    agePlusOne() {
        return this.age + 1
    }
}
```



## effect 

effect在初始化时会执行一次参数函数

但effect 是内部函数 无法直接通过 import {effect} from ‘vue’ 方式引入 需通过引入reactivity模块引入

```js
setup() {
	const age = ref(18)
    let agePlus = 0
    effect(()=>{ agePlus = age.value + 1})
    return {
        age,
        agePlusOne
    }
}
```



## watch

#### watch的三个参数

- 第一个参数: 要监听的数据
- 第二个参数: 监听到数据变化后执行的函数，该函数参数为数据的新值和旧值
- 第三个参数: 选项对象，deep | immediate | lazy 等



#### watch的返回值

- 取消监听的函数



```js
# v2老版
data: ()=>({
    pickerVisible: false,
    pickerChange: true
})
watch: {
    ['pickerVisible'](newVal, oldVal){
        
    },
    pickerChange(newVal, oldVal) {
            
    }   
}

# vue3新版

setup() {
    const question = ref('')
    const answer = ref('')
    
    const stop = watch(question, async (newVal, oldVal) => {
        const resp = await fetch('https://www.yesno.wtf/api')
        const data = await resp.json()
        answer.value = data.answer
    })
    
    // stop() # 停止监听
    
    return {
        question,
        answer
    }
}

# tips 高端操作 监听多个响应式数据的写法
// 将多个响应式数据用数组包起来 或者 写多个watch？尝试下
watch([question,answer],([quesNew, answNew],[oldQues,oldAnsw]) => {
	console.log('------------')
},{lazy: true});
```



## watchEffect

- 相当于简化版的watch，也用于监听数据
- 接收一个函数作为参数(函数参数空)，但没有第二个回调函数的参数
- 监听参数函数使用的响应式数据的变化，数据变化会再运行一遍该函数
- 返回取消监听的函数
- `watch`的第一个参数是响应式数据变量，`watchEffect`的第一个参数是含有响应式数据的函数
- ⚠️ watchEffect在初始时会执行一遍 (初始化未发生改变时也会执行其中的参数函数)



```js
setup() {
    const count = ref(0)
    const stop = watchEffect(()=>{
        console.log('count发生了改变',count.value)
        // 初始化未修改count时也会执行一遍
    })
    
    return {
        count,
        stop,
        increase: ()=>{
            count.value ++
        }
    }
}
```





## 生命周期钩子函数



> ##### <font color="#42b983">**Tips**</font>
>
> setup是在组件初始化之前执行的，即生命周期`beforeCreate`和`created`之间。
>
> 因为 `setup` 是围绕 `beforeCreate` 和 `created` 生命周期钩子运行的，所以不需要显式地定义它们。换句话说，在这些钩子中编写的任何代码直接在 `setup` 函数中编写即可。

```js
export default {
  setup() {
    console.log('这儿代表的其实就是beforeCreate和created生命周期钩子了!!!')  
    // mounted
    onMounted(() => {
      console.log('Component is mounted!')
    })
  }
}
```



***而setup函数中的生命周期钩子前需要加上'on'，on后首字母大写***

若在setup函数外使用，相当于选项式API，则不需要加上on开头

**选项 API 生命周期选项和组合式 API 之间的映射如下表**

| 选项式 API         | Hook inside `setup` |
| ------------------ | ------------------- |
| `beforeCreate`     | Not needed*无需定义 |
| `created`          | Not needed*无需定义 |
| `beforeMount`      | `onBeforeMount`     |
| `mounted`          | `onMounted`         |
| `beforeUpdate`     | `onBeforeUpdate`    |
| `updated`          | `onUpdated`         |
| `beforeUnmount`    | `onBeforeUnmount`   |
| `unmounted`        | `onUnmounted`       |
| 上方为最常用的钩子 |                     |
| `errorCaptured`    | `onErrorCaptured`   |
| `renderTracked`    | `onRenderTracked`   |
| `renderTriggered`  | `onRenderTriggered` |



```js
onMounted(()=>{
    window.addEventListener('mousemove',update)
})

onUnmounted(()=>{
    window.addEventListener('mousemove',update)
})
```







**`注：`**

v2中的beforeDestroy对应v3中的beforeUnmount

v2中的unmounted对应v3中的unmounted

`renderTracked` | `renderTriggered` 在render函数调用时触发

`renderTracked`首次调用render时也触发

`renderTriggered`首次调用render时不触发

