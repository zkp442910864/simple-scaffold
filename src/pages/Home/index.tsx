
import { useBaseData } from '@/store';
import { getDevice } from '@/utils';
import HomeTest1 from '../HomeTest1';
import { useMemo } from 'react';

const Home = () => {

    const testVal = useBaseData((state) => state.test);

    return (
        <div>
            Home 页面
            <div style={{ }}>测试</div>
            <div style={{ display: 'flex', }}>
                <div style={{ background: '#000', flexBasis: '3rem', }}>1</div>
                <div style={{ background: 'gray', flex: 'auto', width: 0, }}>1</div>
            </div>

            <div style={{ border: '0.5px solid #000', marginTop: 60, }}></div>

            <div>testVal: {testVal}</div>
            <div>innerWidth: {window.innerWidth}</div>
            <div>devicePixelRatio: {window.devicePixelRatio}</div>
            <div>getDevice: {getDevice().join()}</div>
            {useMemo(() => <HomeTest1 />, [])}
        </div>
    );
};

export default Home;