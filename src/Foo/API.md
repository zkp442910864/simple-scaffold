## Interfaces

### IBar\<T\>

#### Type Parameters

| Type Parameter |
| -------------- |
| `T`            |

#### Properties

| Property                                                       | Type                                  | Description                                           |
| -------------------------------------------------------------- | ------------------------------------- | ----------------------------------------------------- |
| <a id="abc"></a> `abc`                                         | `object`                              | -                                                     |
| `abc.aaa?`                                                     | `object`                              | -                                                     |
| `abc.aaa.aaa`                                                  | [`IBar`](README.md#ibart)\<`number`\> | -                                                     |
| <a id="b322"></a> `b322`                                       | `string`                              | -                                                     |
| <a id="c333"></a> `c333`                                       | `T`                                   | -                                                     |
| <a id="s333"></a> `s333`                                       | `string`                              | -                                                     |
| <a id="title"></a> `title?`                                    | `string` \| `number`                  | 说明 - 1234123 **Default** `title` **Version** 0.0.01 |
| <a id="title22323222sd2ssds232"></a> `title22323222sd2ssds232` | `string`                              | -                                                     |

---

### TFoo

#### Properties

| Property                                                         | Type                                                                  | Description                                           |
| ---------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------- |
| <a id="b322-1"></a> `b322`                                       | `Omit`\<[`IBar`](README.md#ibart)\<`number`\>, `"b322"` \| `"c333"`\> | -                                                     |
| <a id="c333-1"></a> `c333`                                       | `object`                                                              | -                                                     |
| `c333.aaa`                                                       | [`IBar`](README.md#ibart)\<`number`\>                                 | -                                                     |
| <a id="s333-1"></a> `s333?`                                      | [`IBar`](README.md#ibart)\<`string`\>                                 | -                                                     |
| <a id="title-1"></a> `title?`                                    | `string` \| `number`                                                  | 说明 - 1234123 **Default** `title` **Version** 0.0.01 |
| <a id="title22323222sd2ssds232-1"></a> `title22323222sd2ssds232` | `string`                                                              | -                                                     |

## Functions

### Foo()

> **Foo**(`props`, `deprecatedLegacyContext`?): `ReactNode`

#### Parameters

| Parameter                  | Type                     | Description                                                                                                                       |
| -------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `props`                    | [`TFoo`](README.md#tfoo) | -                                                                                                                                 |
| `deprecatedLegacyContext`? | `any`                    | **Deprecated** **See** [React Docs](https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-lifecycle-methods) |

#### Returns

`ReactNode`
