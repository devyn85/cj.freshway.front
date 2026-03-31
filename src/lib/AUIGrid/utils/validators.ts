import dayjs from 'dayjs';

export interface DateValidatorOptions {
  isToDate?: boolean;
  isFromDateToday?: boolean;
  minOffsetDays?: number;
  maxOffsetDays?: number;
  customMinDate?: string | dayjs.Dayjs;
  customMaxDate?: string | dayjs.Dayjs;
  messages?: {
    invalidFormat?: string;
    beforeMinDate?: string;
    afterMaxDate?: string;
    toDateBeforeFromDate?: string;
  };
}

export interface ValidatorResult {
  validate: boolean;
  message: string;
}

const DEFAULT_END_DATE = '29991231';

/**
 * 그리드 날짜 유효성 검사 함수 팩토리
 */
export const createDateValidator = (options: DateValidatorOptions = {}) => {
  const {
    isToDate = false,
    isFromDateToday = false,
    minOffsetDays,
    maxOffsetDays,
    customMinDate,
    customMaxDate,
    messages = {}
  } = options;
  
  const defaultMessages = {
    invalidFormat: '올바른 날짜 형식이 아닙니다.',
    beforeMinDate: isFromDateToday 
      ? '적용시작일자는 오늘 이후 일자를 선택 할 수 있습니다.'
      : '적용시작일자는 오늘 이후 일자를 선택 할 수 있습니다.',
    afterMaxDate: '종료일을 넘어서 설정할 수 없습니다.',
    toDateBeforeFromDate: '종료일은 시작일 이후여야 합니다.',
    ...messages
  };

  return function validator(oldValue: any, newValue: any, item: any): ValidatorResult {
    // 1. 날짜 형식 유효성 검사
    const dateStr = String(newValue || '').split('-').join('');
    if (!dayjs(dateStr, 'YYYYMMDD', true).isValid()) {
      return { validate: false, message: defaultMessages.invalidFormat };
    }

    const inputDate = dayjs(newValue);
    
    // 2. 최소 날짜 계산
    let minDate: dayjs.Dayjs;
    if (customMinDate) {
      minDate = dayjs.isDayjs(customMinDate) ? customMinDate : dayjs(customMinDate);
    } else {
      const offsetDays = minOffsetDays ?? (isFromDateToday ? -1 : isToDate ? 1 : -1);
      minDate = dayjs().add(offsetDays, 'day');
    }

    // 3. 최대 날짜 계산
    let maxDate: dayjs.Dayjs;
    if (customMaxDate) {
      maxDate = dayjs.isDayjs(customMaxDate) ? customMaxDate : dayjs(customMaxDate);
    } else {
      const offsetDays = maxOffsetDays ?? 0;
      maxDate = offsetDays > 0 
        ? dayjs().add(offsetDays, 'day')
        : dayjs(DEFAULT_END_DATE, 'YYYYMMDD');
    }

    // 4. 최소 날짜 체크
    if (inputDate.isBefore(minDate)) {
      return { validate: false, message: defaultMessages.beforeMinDate };
    }

    // 5. 최대 날짜 체크
    if (inputDate.isAfter(maxDate)) {
      return { validate: false, message: defaultMessages.afterMaxDate };
    }

    // 6. toDate의 경우 fromDate보다 이후여야 함
    if (isToDate && item?.fromDate) {
      const fromDate = dayjs(item.fromDate, 'YYYYMMDD');
      if (fromDate.isValid() && inputDate.isBefore(fromDate)) {
        return { validate: false, message: defaultMessages.toDateBeforeFromDate };
      }
    }

    return { validate: true, message: '' };
  };
};

/**
 * 필수값 유효성 검사 함수
 */
export const validateRequiredFields = (
  data: any[],
  fieldConfig: Record<string, string>
): string[] => {
  const errors: string[] = [];

  data.forEach((item, index) => {
    Object.entries(fieldConfig).forEach(([fieldName, displayName]) => {
      const fieldValue = item[fieldName];

      if (
        fieldValue === null ||
        fieldValue === undefined ||
        fieldValue === '' ||
        (typeof fieldValue === 'string' && fieldValue.trim() === '')
      ) {
        if (!errors.some(error => error.includes(displayName))) {
          errors.push(`${displayName}을(를) 입력해주세요.`);
        }
      }
    });
  });

  return errors;
};

/**
 * 중복 검사 함수
 */
export const validateDuplicateFields = (
  data: any[],
  fieldName: string,
  displayName: string,
  nameField?: string
): string[] => {
  const errors: string[] = [];
  const fieldMap = new Map<string, number[]>();

  data.forEach((item, index) => {
    const fieldValue = item[fieldName];
    if (fieldValue && String(fieldValue).trim() !== '') {
      const value = String(fieldValue).trim();
      if (!fieldMap.has(value)) {
        fieldMap.set(value, []);
      }
      fieldMap.get(value)!.push(index + 1);
    }
  });

  fieldMap.forEach((rowNumbers, value) => {
    if (rowNumbers.length > 1) {
      const firstItem = data.find(item => item[fieldName] === value);
      const displayValue = nameField ? (firstItem?.[nameField] || value) : value;
      errors.push(`중복된 ${displayName}: ${displayValue}`);
    }
  });

  return errors;
};

/**
 * 시간대 겹침 검사 함수
 */
export const validateTimeOverlap = (
  data: any[],
  options: {
    fromDateField?: string;
    toDateField?: string;
    fromTimeField?: string;
    toTimeField?: string;
    nameField?: string;
    codeField?: string;
    excludeDeleted?: boolean;
    deleteField?: string;
  } = {}
): string[] => {
  const {
    fromDateField = 'fromDate',
    toDateField = 'toDate',
    fromTimeField = 'fromHour',
    toTimeField = 'toHour',
    nameField = 'name',
    codeField = 'code',
    excludeDeleted = true,
    deleteField = 'delYn'
  } = options;

  const errors: string[] = [];
  
  // 삭제된 데이터 제외
  const aliveData = excludeDeleted 
    ? data.filter(item => item[deleteField] !== 'Y')
    : data;

  const toMin = (timeStr: string): number | null => {
    if (!timeStr) return null;
    const [h, m] = String(timeStr).split(':');
    const hours = parseInt(h, 10);
    const minutes = parseInt(m, 10);
    return isNaN(hours) || isNaN(minutes) ? null : hours * 60 + minutes;
  };

  const isDateOverlap = (aFromDate: string, aToDate: string, bFromDate: string, bToDate: string): boolean => {
    const aStart = dayjs(aFromDate, 'YYYYMMDD', true);
    const aEnd = dayjs(aToDate, 'YYYYMMDD', true);
    const bStart = dayjs(bFromDate, 'YYYYMMDD', true);
    const bEnd = dayjs(bToDate, 'YYYYMMDD', true);
    
    if (!aStart.isValid() || !aEnd.isValid() || !bStart.isValid() || !bEnd.isValid()) {
      return false;
    }
    
    return !aEnd.isBefore(bStart) && !bEnd.isBefore(aStart);
  };

  for (let i = 0; i < aliveData.length; i++) {
    for (let j = i + 1; j < aliveData.length; j++) {
      const itemA = aliveData[i];
      const itemB = aliveData[j];

      // 날짜 범위가 겹치는지 확인
      if (!isDateOverlap(
        itemA[fromDateField],
        itemA[toDateField],
        itemB[fromDateField],
        itemB[toDateField]
      )) {
        continue;
      }

      // 시간대가 있는 경우 시간 겹침 체크
      if (fromTimeField && toTimeField) {
        const aStartMin = toMin(itemA[fromTimeField]);
        const aEndMin = toMin(itemA[toTimeField]);
        const bStartMin = toMin(itemB[fromTimeField]);
        const bEndMin = toMin(itemB[toTimeField]);

        if ([aStartMin, aEndMin, bStartMin, bEndMin].some(v => v === null)) {
          continue;
        }

        // 시간 겹침 체크
        const isTimeOverlap = !(aEndMin! <= bStartMin! || bEndMin! <= aStartMin!);
        if (isTimeOverlap) {
          const nameA = itemA[nameField] || itemA[codeField] || `항목${i + 1}`;
          const nameB = itemB[nameField] || itemB[codeField] || `항목${j + 1}`;
          
          errors.push(
            `${nameA} 와 ${nameB} 의 시간대가 겹칩니다. (${itemA[fromTimeField]}~${itemA[toTimeField]} / ${itemB[fromTimeField]}~${itemB[toTimeField]})`
          );
        }
      } else {
        // 시간 필드가 없는 경우 날짜만 겹치면 오류
        const nameA = itemA[nameField] || itemA[codeField] || `항목${i + 1}`;
        const nameB = itemB[nameField] || itemB[codeField] || `항목${j + 1}`;
        
        errors.push(`${nameA} 와 ${nameB} 의 적용일자가 중복됩니다.`);
      }
    }
  }

  return errors;
};

/**
 * 글자수 제한 validation 처리 함수
 */
export const createMaxLengthValidator = (maxLength: number) => {
  return function validator(oldValue: any, newValue: any, item: any): ValidatorResult {
    const text = newValue == null ? '' : String(newValue);
    if (text.length > maxLength) {
      const msg = `최대 ${maxLength}자까지 입력할 수 있습니다.`;
      return { validate: false, message: msg }; 
    }
    return { validate: true, message: '' };
  };
};