import {forwardRef, ComponentType, FC} from 'react';
import {useAccess} from 'umi';

/**
 * 权限高阶组件，扩展组件 code 属性
 * @param Com 组件
 * @param type 隐藏类型
 * @returns 组件
 */
function accessPackage <T extends object>(Com: ComponentType<T & IProps>, type: 'hide' | 'disabled' = 'disabled') {

    const NewCom = forwardRef((props: T & IProps, ref) => {
        const {
            code,
            ...otherProps
        } = props || {};

        const {operaCodeCheck} = useAccess();
        const noAccess = !operaCodeCheck(code || '');

        if (type === 'hide' && noAccess) {
            return <></>;
        }

        return <Com {...otherProps as T} disabled={noAccess} ref={ref} />;
    });

    return NewCom;
}

interface IProps {
    /** 权限码 */
    code?: string;
}

// const NewB = accessPackage(Button);
// const Aa = () => {

//     return (
//         <>
//             <NewB
//                 code="O1"
//                 loading={true}
//                 type="primary"
//                 onClick={() => {}}
//             />
//             <Button type="primary" />
//         </>
//     );
// };

export {
    accessPackage,
};
