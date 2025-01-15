## createCustomStore()

> **createCustomStore**\<`T`\>(`fn`): \[`StoreApi`\<`T`\>, `UseBoundStore`\<`StoreApi`\<`T`\>\>\]

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `object` |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `fn` | (`cache`, ...`arg`) => `T` |

### Returns

\[`StoreApi`\<`T`\>, `UseBoundStore`\<`StoreApi`\<`T`\>\>\]

### Description

- 对 zustand 的封装
- 同时支持 React 组件中使用的 useStore 和外部逻辑中访问的 store，并保持内部操作的对象一致性

***

## TCacheFn()\<T\>

> **TCacheFn**\<`T`\>: (`data`) => `T`

用来存储初始话对象

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `object` |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `data` | `T` |

### Returns

`T`

***

## TOtherData\<T\>

> **TOtherData**\<`T`\>: `Parameters`\<`StateCreator`\<`T`, \[\]\>\>

透传的其他参数

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` | `object` |
