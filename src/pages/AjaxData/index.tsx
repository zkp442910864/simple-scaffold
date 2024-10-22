import { useSystemErrorStore } from '@/store';
import { Link } from 'react-router-dom';

const AjaxData = () => {
    const ajaxData = useSystemErrorStore((state) => state.ajaxData);

    // console.log(ajaxData);

    return (
        <>
            <Link to="/HomeTest1">制造错误数据</Link>
            {
                ajaxData.map((item, index) =>
                    <div className="un-border un-border-black un-border-solid m-b-20 p-4">
                        <div>请求路径: {item.method}-{item.url}</div>
                        <div>状态码: {item.status}</div>
                        <div>是否成功: {item.eventType}-{item.message}</div>
                        <div>设备状态: {item.onLine + ''}</div>
                        <div>发起时间: {new Date(item.time).toLocaleString()}</div>
                        <div>设备: {item.device}</div>
                        <div>userAgent: {item.userAgent}</div>
                        <div>耗时: {item.duration}ms</div>
                        {/* <div>资源: {item.source}</div>
                        <pre className="un-whitespace-pre-wrap">
                            {item.stack}
                        </pre> */}
                    </div>
                )
            }
        </>
    );
};

export default AjaxData;
