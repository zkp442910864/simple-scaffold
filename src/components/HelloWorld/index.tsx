import type { FunctionalComponent } from 'vue'
import { defineComponent, ref, useAttrs } from 'vue'
import styles from './style.module.css'

const HelloWorld: FunctionalComponent<IProps> = () => {
    const count = ref(0)
    const props = useAttrs() as unknown as IProps

    const click = () => {
        count.value++
        props.onClick()
    }

    return () => (
        <>
            <h1 class={styles.abc}>{ props.msg }</h1>

            <div class="card">
                <button type="button" onClick={click}>
                    count is
                    {' '}
                    { count.value }
                </button>
                <p>
                    Edit
                    <code>components/HelloWorld.vue</code>
                    {' '}
                    to test HMR
                </p>
            </div>

            <p>
                Check out
                <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>
                , the official Vue + Vite starter
            </p>
            <p>
                Learn more about IDE Support for Vue in the
                <a
                    href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
                    target="_blank"
                >
                    Vue Docs Scaling up Guide
                </a>
                .
            </p>
            <p class="read-the-docs">
                Click on the Vite and Vue logos to learn more
            </p>
        </>
    )
}

export default defineComponent(HelloWorld)

interface IProps {
    msg: string
    onClick: () => void
}
