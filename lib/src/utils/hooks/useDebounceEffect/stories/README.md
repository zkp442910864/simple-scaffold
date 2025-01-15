## useDebounceEffect()

> **useDebounceEffect**(`effect`, `deps`?, `options`?): `void`

基于 useEffect 封装,实现防抖效果

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `effect` | `EffectCallback` | 回调函数 |
| `deps`? | `DependencyList` | 触发依赖 |
| `options`? | \{ `immediate`: `boolean`; `interval`: `number`; \} | 配置参数 |
| `options.immediate`? | `boolean` | - |
| `options.interval`? | `number` | - |

### Returns

`void`
