/** 初始化数据的函数 */
import react from 'react';


/** 处理菜单 */
export const handlerMenuData = async (data: TObj[]) => {
    const allIcon = await import('@ant-design/icons');
    const defaultIcon = allIcon.SmileOutlined;
    const allAddressMap: TObj = {};
    const validAddressMap: TObj = {};

    const each = (data: TObj[], level = 0) => {

        data.forEach((item) => {
            const iconData = allIcon[item.icon as keyof typeof allIcon] as typeof defaultIcon | undefined;

            // 匹配icon
            if (level === 0) {
                item.icon = react.createElement(iconData || defaultIcon);
            } else {
                item.icon = react.createElement(iconData || '');
            }

            // 循环映射
            if (item?.children?.length) {
                each(item.children, level + 1);
            } else {
                validAddressMap[item.path] = item;
                validAddressMap[item.path.toLocaleLowerCase()] = item;
            }

            allAddressMap[item.path] = item;
            allAddressMap[item.path.toLocaleLowerCase()] = item;
        });
    };

    each(data);

    return {
        menuData: data,
        validMenuDataMap: validAddressMap,
        allMenuDataMap: allAddressMap,
    };

};

/**
 * 处理字典数据
 * @param data 数据源
 * @param typeKey 字典类型
 * @param dataKey 字典值
 */
export const handlerDictionaries = (data: TObj[], fieldData: IFieldData = {}) => {
    const {typeKey, dataKey, valueKey} = Object.assign({
        typeKey: 'Type',
        dataKey: 'Selects',
        valueKey: 'value',
    }, fieldData);

    /** 字典键值对数据 */
    const mapData: Record<string, TObj[]> = data.reduce((map, item) => {
        const type = item[typeKey];
        const enumData = item[dataKey];

        map[type] = enumData;
        return map;
    }, {} as TObj);

    /** 处理数值字符串 */
    const handlerNumberStr = (val: string | number) => {
        if (isNaN(+val)) return val;

        return +val;
    };

    /** 值 转 数字 */
    const toNumFn = (arr: TObj[]) => {
        const newArr = JSON.parse(JSON.stringify(arr)) as TObj[];
        newArr.forEach(item => {
            item[valueKey] = handlerNumberStr(item[valueKey]);
        });
        return newArr;
    };

    /** 获取字典数据 */
    const getDictionData = (key: string, {assignValues, toNum, findValue}: IGetDictionDataAssist = {}) => {
        let dictionData = mapData[key];

        if (!dictionData) {
            console.log(`${key}: 字典表缺少该字段`, mapData);
            return [];
        }

        if (dictionData.length <= 0) {
            console.log(`${key}: 字典表值为空数组`, mapData);
            return [];
        }

        // 返回指定数据
        if (Array.isArray(assignValues) && assignValues.length) {
            const newAssignValues = assignValues.map(ii => handlerNumberStr(ii));
            dictionData = dictionData.filter(ii => newAssignValues.includes(handlerNumberStr(ii[valueKey])));
        }

        // 查找指定值
        if (findValue) {
            dictionData = dictionData.filter(ii => handlerNumberStr(ii[valueKey]) === handlerNumberStr(findValue));
        }

        // 转数值
        if (toNum) {
            dictionData = toNumFn(dictionData);
        }

        return dictionData;
    };

    return {
        mapData,
        getDictionData,
    };
};

interface IGetDictionDataAssist {
    /**
     * @description 指定值返回
     * @description 空数组返回全部
     */
    assignValues?: Array<string | number>;
    /**
     * @description 进行转数值处理
     */
    toNum?: boolean;
    /**
     * @description 查找指定值
     * @description 返回的是个数组，取第一项
     */
    findValue?: string | number;
}

interface IFieldData {
    /**
     * @description 数据的类型
     * @default Type
     */
    typeKey?: string;
    /**
     * @description 数据类型的值
     * @default Selects
     */
    dataKey?: string;
    /**
     * @description 值里面的value
     * @default value
     */
    valueKey?: string;
}
