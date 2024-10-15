
import { getDevice } from '@/utils';

const Home = () => {

    return (
        <div>
            Home 页面
            <div style={{ }}>测试</div>
            <div style={{ display: 'flex', }}>
                <div style={{ background: '#000', flexBasis: '3rem', }}>1</div>
                <div style={{ background: 'gray', flex: 'auto', width: 0, }}>1</div>
            </div>

            <div style={{ border: '0.5px solid #000', marginTop: 60, }}></div>

            <div>innerWidth: {window.innerWidth}</div>
            <div>devicePixelRatio: {window.devicePixelRatio}</div>
            <div>getDevice: {getDevice().join()}</div>
        </div>
    );
};

export default Home;