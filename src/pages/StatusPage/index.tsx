
import {history} from 'umi';
import {FC} from 'react';
import {Result, Button} from 'antd';

const StatusPage: FC<IProps> = (props) => {
    const {
        code,
    } = props;

    const statusMap = {
        404: {
            code: '404',
            text: '抱歉，您访问的页面不存在。',
        },
        403: {
            code: '403',
            text: '抱歉，您没有权限访问页面。',
        },
    };

    const data = statusMap[`${code || 404}`];

    return (
        <Result
            extra={
                <Button type="primary" onClick={() => history.push('/')}>
                    返回首页
                </Button>
            }
            status={data.code as unknown as 404}
            subTitle={data.text}
            title={data.code}
        />
    );
};

interface IProps {
    code?: 404 | 403;
}

export default StatusPage;
