
// import React from 'react';
import {Spin} from 'antd';

const LoadingPage = () => {

    return (
        <Spin spinning={true} style={{height: '100%', width: '100%'}}>
            <div style={{height: '100%', width: '100%', minHeight: 500}} />
        </Spin>
    );
};

export default LoadingPage;
