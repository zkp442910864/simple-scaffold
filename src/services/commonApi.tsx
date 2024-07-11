
/** 获取菜单数据 */
export const getMenuDataApi = () => {
    return fetch('/api-text/getMenuData');
};

/** 获取用户数据 */
export const getUserDataApi = () => {
    return fetch('/api-text/getUserData');
};

/** 获取字典数据 */
export const getDictionariesApi = () => {
    return fetch('/api-text/getDictionaries');
};
