import {useAccess} from 'umi';
import {Dropdown, Menu, MenuProps, Button} from 'antd';
import {ItemType} from 'antd/lib/menu/hooks/useItems';
import {DropdownProps} from 'antd/lib/dropdown';
import {FC, ReactNode} from 'react';
import {BarsOutlined, DownOutlined} from '@ant-design/icons';

const AccessDropdown: FC<IAccessDropdownProps> = (props) => {
    const {
        accessType = 'disabled',
        config = [],
        menuProps,
        dropdownProps,
        onSelect,
        children,
    } = props;

    const {operaCodeCheck} = useAccess();

    const getItems = (data: TAccessDropdownConfig[]) => {
        const newArr: TAccessDropdownConfig[] = [];

        data.forEach((item) => {
            const newData = {...item};

            // 隐藏-过滤
            if (newData.hide) return;

            // 权限判断， hide 过滤， disabled 禁用
            if (typeof newData.code === 'string') {
                const noAccess = !operaCodeCheck(newData.code);
                if (accessType === 'hide' && noAccess) return;
                newData.disabled = noAccess;
            }

            // 处理子级
            if (Array.isArray(item.children)) {
                newData.children = getItems(item.children);
            }

            newArr.push(newData);
        });

        return newArr;
    };


    const menuHeaderDropdown = (<Menu {...menuProps} items={getItems(config)} onClick={onSelect} />);

    return (
        <Dropdown {...dropdownProps} overlay={menuHeaderDropdown}>
            {
                typeof children !== 'undefined'
                    ? children
                    : (
                        <Button size="small">
                            <BarsOutlined className="font-14" />
                        </Button>
                    )
            }
        </Dropdown>
    );
};

export {AccessDropdown};

interface IConfigExtends {
    /** 权限码 */
    code?: string;
    /** 隐藏该选项 */
    hide?: boolean;
    /** 禁用 */
    disabled?: boolean;
    children?: TAccessDropdownConfig[];
}

export interface IAccessDropdownProps {
    /** Menu 的参数 */
    menuProps?: Omit<MenuProps, 'items' | 'onClick'>;
    /** Dropdown 的参数 */
    dropdownProps?: Omit<DropdownProps, 'overlay'>,
    /** 配置列表 扩展了 code hide 属性 */
    config?: TAccessDropdownConfig[];
    /** 下拉选项点击回调 */
    onSelect?: MenuProps['onClick'];
    /**
     * @description 权限不足展示类型
     * @default disabled
     */
    accessType?: 'hide' | 'disabled';
    children?: ReactNode;
}

type TAccessDropdownConfig = IConfigExtends & ItemType;
