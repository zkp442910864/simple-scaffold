import {useAccess, useModel} from 'umi';
import {Button} from 'antd';

import yayJpg from '@/assets/yay.jpg';

export default function Home () {
    // console.log(useOutletContext());
    const [data] = useModel('common');
    const {initialState} = useModel('@@initialState');
    const {operaCodeCheck} = useAccess();

    return (
        <div>
            <h2 className="hidden">Yay! Welcome to umi!</h2>
            <p className="m-100 p-14">
                <img src={yayJpg} width="388" />
            </p>
            <p className="!p-x-10 font-28 color-red">
                To get started, edit <code>pages/index.tsx</code> and save to reload.
            </p>
            <p className="disabled-select text-center color-main pointer width-50">{JSON.stringify(data)}</p>
            <pre>
                字典数据:
                <br />
                方式1:
                initialState!.getDictionData(&apos;CustomType1&apos;);
                <br />
                {JSON.stringify(initialState!.getDictionData('CustomType1'), null, 4)}

                <br />
                方式2:
                initialState!.getDictionData(&apos;CustomType1&apos;, &#123;toNum: true&#125;);
                <br />
                {JSON.stringify(initialState!.getDictionData('CustomType1', {toNum: true}), null, 4)}

                <br />
                方式3:
                initialState!.getDictionData(&apos;CustomType2&apos;, &#123;assignValues: [0, 1, 2]&#125;);
                <br />
                {JSON.stringify(initialState!.getDictionData('CustomType2', {assignValues: [0, 1, 2]}), null, 4)}

                <br />
                方式4:
                initialState!.getDictionData(&apos;CustomType2&apos;, &#123;findValue: 4&#125;);
                <br />
                {JSON.stringify(initialState!.getDictionData('CustomType2', {findValue: 4}), null, 4)}
            </pre>

            <pre>
                按钮权限:
                <br />
                operaCodeCheck(&apos;O2&apos;)
                <br />
                <Button disabled={!operaCodeCheck('O2')}>123</Button>
                {operaCodeCheck('O2') + ''}
                <br />
                operaCodeCheck(&apos;A3&apos;)
                <br />
                <Button disabled={!operaCodeCheck('A3')}>123</Button>
                {operaCodeCheck('A3') + ''}
            </pre>
        </div>
    );
}
