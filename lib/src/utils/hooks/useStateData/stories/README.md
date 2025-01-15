## useStateData()

> **useStateData**\<`T`\>(`stateFn`): `object`

对 useState 的扩展,实现操作对象,绕过闭包的问题

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* `object` | `object` |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `stateFn` | () => `T` |  |

### Returns

`object`

| Name | Type | Default value |
| ------ | ------ | ------ |
| `state` | `T` | - |
| `update` | () => `Promise`\<`void`\> | data.newUpdateFn |
