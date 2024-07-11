import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {LoginForm, ProFormText} from "@ant-design/pro-components";
import React from 'react';
import styles from './style.less';
import {history} from "umi";

const Login: React.FC = () => {


    const handleSubmit = async () => {
        try {

        } catch (error) {

        }
    };

    return (
        <div className={styles.container}>
            <div
                style={{
                    flex: '1',
                    padding: '32px 0',
                }}
            >
                <LoginForm
                    contentStyle={{
                        minWidth: 280,
                        maxWidth: '75vw',
                    }}
                    logo={<img alt="logo" src={require('@/assets/yay.jpg')} />}
                    title="Ant Design"
                    subTitle="Ant Design 是西湖区最具影响力的 Web 设计规范"
                    // initialValues={{
                    //     autoLogin: true,
                    // }}
                    onFinish={async () => {
                        history.replace('/');
                    }}
                >
                    <>
                        <ProFormText
                            name="username"
                            fieldProps={{
                                size: 'large',
                                prefix: <UserOutlined />,
                            }}
                            placeholder="用户名: admin or user"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名!',
                                },
                            ]}
                        />
                        <ProFormText.Password
                            name="password"
                            fieldProps={{
                                size: 'large',
                                prefix: <LockOutlined />,
                            }}
                            placeholder="密码: ant.design"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码！',
                                },
                            ]}
                        />
                    </>
                </LoginForm>
            </div>
        </div>
    );
};

export default Login;
