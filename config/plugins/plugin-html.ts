import {IApi} from 'umi';

export default (api: IApi) => {


    // 修改 html favicon
    api.modifyHTMLFavicon(() => {
        return Promise.resolve(['./favicon.png']);
    });

};
