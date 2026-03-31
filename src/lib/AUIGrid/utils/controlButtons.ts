import dayjs from 'dayjs';

const DEFAULT_END_DATE = '29991231';

/**
 * 공통 초기값 생성 함수
 */
export const createInitialValues = (options: {
  baseValues?: Record<string, any>;
  fromDateOffset?: number;
  toDate?: string;
}) => {
  const { baseValues = {}, fromDateOffset = 3, toDate = DEFAULT_END_DATE } = options;
  
  return {
    rowStatus: 'I',
    serialkey: '',
    fromDate: dayjs().add(fromDateOffset, 'day').format('YYYYMMDD'),
    toDate,
    delYn: 'N',
    ...baseValues,
  };
};

/**
 * 저장 처리 공통 함수
 */
export const processSaveData = (
  checkedItems: any[],
  options: {
    getInsertItems?: (items: any[]) => any[];
    getUpdateItems?: (items: any[]) => any[];
    getDeleteItems?: (items: any[]) => any[];
  } = {}
) => {
  const {
    getInsertItems = (items) => items.filter(item => item.rowStatus === 'I'),
    getUpdateItems = (items) => {
      const today = dayjs();
      return items.filter(item => 
        item.rowStatus === 'U' && dayjs(item.fromDate).isSameOrBefore(today)
      );
    },
    getDeleteItems = (items) => {
      const today = dayjs();
      return items.filter(item => 
        item.rowStatus === 'U' && dayjs(item.fromDate).isAfter(today)
      );
    }
  } = options;

  const insertItemList = getInsertItems(checkedItems);
  const updateItemList = getUpdateItems(checkedItems);
  const deleteItemList = getDeleteItems(checkedItems);

  return {
    insertItemList,
    updateItemList,
    deleteItemList,
    mergedList: [
      ...insertItemList,
      ...updateItemList.map(item => ({ ...item, rowStatus: 'U' })),
      ...deleteItemList.map(item => ({
        ...item,
        rowStatus: 'D',
        toDate: dayjs().add(2, 'days').format('YYYYMMDD'),
      })),
    ],
  };
};