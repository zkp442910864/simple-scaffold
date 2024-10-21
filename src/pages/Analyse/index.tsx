import { useSystemErrorStore } from '@/store';

const Analyse = () => {
    const pageAnalyseData = useSystemErrorStore((state) => state.pageAnalyseData);

    return (
        <>
            <button>点击</button>
            <div className="p-4">设备: {pageAnalyseData.device}</div>
            <div className="p-4">用户代理: {pageAnalyseData.userAgent}</div>
            {
                pageAnalyseData.list?.map((item, index) =>
                    <div className="p-4">
                        <div>
                            {item.name}({item.title}): {item.value === -1 ? '--' : `${item.value}ms`}
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default Analyse;
