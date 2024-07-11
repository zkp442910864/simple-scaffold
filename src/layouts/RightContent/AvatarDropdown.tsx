import {useModel, useAppData} from 'umi';
import {LogoutOutlined} from '@ant-design/icons';
import {Avatar, MenuProps} from 'antd';

import {AccessDropdown, IAccessDropdownProps} from '@/components/AccessModules';

import styles from './index.less';

const AvatarDropdown = () => {
    const {initialState} = useModel('@@initialState');
    const layoutConfig = useAppData().pluginManager.applyPlugins({
        key: 'layout',
        type: 'modify',
    });

    const userData = initialState?.userData || {} as TObj;

    const menuItems: IAccessDropdownProps['config'] = [
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: '退出登录',
        },
    ];

    const onMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key === 'logout') {
            layoutConfig?.logout();
        }
    };

    return (
        <AccessDropdown
            config={menuItems}
            onSelect={onMenuClick}
        >
            <div className={styles['dropdown-item']}>
                <Avatar alt="avatar" size="small" src={userData.avatar || './favicon.png'} />
                <div className={styles['dropdown-item-name']}>{userData.UserName}</div>
            </div>
        </AccessDropdown>
    );
};

export default AvatarDropdown;
