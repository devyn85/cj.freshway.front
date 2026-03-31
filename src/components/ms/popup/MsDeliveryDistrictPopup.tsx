// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

// store

// components
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { Datepicker, InputText, SearchForm } from '@/components/common/custom/form';

// css
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import TotalCount from '@/assets/styled/Container/TotalCount';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// api
import { apiPostGetMasterList } from '@/api/ms/apiMsDeliveryDistrict';

// types
import { IBindGridEvent } from '@/lib/AUIGrid/types';

interface Props {
  form?: any;  // 상위 컴포넌트 의 조건을 가져오기 위한 폼 (dccode, effectiveDate, searchDistrict)       
  handleSetSelectedRows?: (rows: any[]) => void;   // 1개 행 or 체크된 다중 행 선택 시 호출
  handleClose?: () => void;  // 해당 팝업 닫기 함수                
  searchName?: string;  // 권역명 검색어
  selectionMode?: string; // 'singleRow' | 'multipleRows'
  customDccode?: string;  // 커스텀 물류센터 코드
}

const MsDeliveryDistrictPopup = ({
  form,
  handleSetSelectedRows,
  handleClose,
  searchName,
  selectionMode = 'multipleRows',
  customDccode,
}: Props) => {
  const { t } = useTranslation();
  const gridRef = useRef<any>();
  const gridId = uuidv4() + '_districtGrid';

  const [popupForm] = Form.useForm(); // 팝업 내부 폼

  const [gridData, setGridData] = useState<any[]>([]); // 그리드 데이터
  const [multiSelectCount, setMultiSelectCount] = useState(0); // 다중 선택 갯수

  // 검색 초기값: 상위 form 의 dccode/effectiveDate 사용
  const [searchBox] = useState({
    dccode: form?.getFieldValue('dccode') || customDccode || '',
    effectiveDate: form?.getFieldValue('effectiveDate') ?? dayjs(),
    searchDistrict: '', // 권역명 검색어
    searchKeyword: '',
    searchDistrictGroup: '',
    multiSelect: '',
  });

  const fetchGridData = async () => {
    const dccode = popupForm.getFieldValue('dccode') || customDccode;
    const eff = popupForm.getFieldValue('effectiveDate') || dayjs();
    const searchDistrict = popupForm.getFieldValue('searchDistrict').trim() || '';
    const multiSelect = popupForm.getFieldValue('multiSelect');

    const params = {
      dccode,
      effectiveDate: eff.format('YYYYMMDD'),
      searchDistrict, // 권역명 검색어
      searchKeyword: '',
      searchDistrictGroup: '', // 필요 시 폼에서 추가
      multiSelect: multiSelect,
    };  

    const res = await apiPostGetMasterList(params);
    if (res?.statusCode === 0) {
      setGridData(res.data || []);
    } else {
      setGridData([]);
    }
  };

  const onClickSearchButton = () => fetchGridData();
  const onClickRefreshButton = () => {
    gridRef.current?.clearGridData()
    // 조회 조건 초기화
    popupForm.setFieldsValue({
      searchDistrict: '',
      multiSelect: '',
    });
  };

  const onChangeMultiSelect = (e: any) => {
		let value = e.target.value;
		if (value === '') {
			setMultiSelectCount(0);
			return;
		}

		//value 제일 끝 문자가 ','로 끝나면 제거하고 카운트
		if (value.endsWith(',')) {
			value = value.slice(0, -1);
		}

		const multiCnt = value.split(',').length;

		// 다중선택 개수 증가 예정
		if (multiCnt > 5000) {
			showAlert(null, t('msg.MSG_COM_ERR_056'));
			return;
		}

		setMultiSelectCount(multiCnt);
	};

    /**
  * 다중선택 붙여넣기
  * @param  {any} event 이벤트
  */
	const handlePaste = (event: any) => {
		event.preventDefault(); // 기본 붙여넣기 동작 방지

		const pastedText = event.clipboardData.getData('text/plain');
		let transformedText = pastedText.replace(/(?:\r\n|\r|\n)/g, ',');

		//transformedText 제일 끝 문자가 ','로 끝나면 제거
		if (transformedText.endsWith(',')) {
			transformedText = transformedText.slice(0, -1);
		}

		// 중복 문자열 제거
		transformedText = [...new Set(transformedText.split(','))].join(',');

		const multiCnt = transformedText.split(',').length;

		if (multiCnt > 5000) {
			showAlert(null, t('msg.MSG_COM_ERR_056'));
			return;
		}

		setMultiSelectCount(multiCnt);
		popupForm.setFieldsValue({ multiSelect: transformedText });
	};

  const titleFunc = {
    searchYn: onClickSearchButton,
    refresh: onClickRefreshButton,
  };

  const handleConfirm = () => {
    let checkedRow = gridRef.current.getCheckedRowItemsAll?.() ?? [];
    
		if (selectionMode === 'singleRow') {
			checkedRow = gridRef.current.getSelectedRows();
		}
		if (checkedRow.length === 0) {
			handleClose?.();
			return;
		}
		handleSetSelectedRows?.(checkedRow);
  };

  const handleDoubleClick = useCallback((event: IBindGridEvent) => {
    const rows = gridRef.current?.getSelectedRows?.() ?? [];
    handleSetSelectedRows?.(rows);
  }, []);

  // masterListGrid 와 유사한 컬럼 구성 (필요한 것만 발췌)
  const gridCol = [
    {
      dataField: 'dlvgroupId',
      headerText: '권역그룹',
      editable: false,
      dataType: 'code',
      minWidth: 120,
    },
    {
      dataField: 'popList',
      headerText: '대표POP',
      editable: false,
      minWidth: 80,
    },
    {
      dataField: 'dlvdistrictId',
      headerText: '권역ID',
      required: true,
      editable: true,
      minWidth: 80,
    },
    {
      dataField: 'dlvdistrictNm',
      headerText: '권역명',
      required: true,
      editable: true,
      minWidth: 80,
    },
    {
      dataField: 'hjdongCount',
      headerText: '행정동 (개)',
      required: false,
      editable: false,
      dataType: 'numeric',
      minWidth: 80,
    },
    {
      dataField: 'fromDate',
      headerText: '적용시작일자',
      dataType: 'date',
      editable: true,
      required: true,
      formatString: 'yyyy-mm-dd',
      dateInputFormat: 'yyyymmdd',
      minWidth: 120,
    },
    {
      dataField: 'toDate',
      headerText: '적용종료일자',
      dataType: 'date',
      editable: true,
      required: true,
      formatString: 'yyyy-mm-dd',
      dateInputFormat: 'yyyymmdd',
      minWidth: 120,
    },
    {
      dataField: 'reflectSchedule',
      headerText: '반영 예정',
      required: false,
      editable: false,
      minWidth: 80,
    },
  ];

  const gridProps = {
    editable: false,
    selectionMode: 'multipleCells',
    showRowCheckColumn: true,
    enableRowCheck: true,
  };

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    grid.bind('cellDoubleClick', handleDoubleClick);
    return () => grid?.unbind && grid.unbind('cellDoubleClick');
  }, []);

  // 상위 searchName 을 초기값으로 입력
  // 상위 form 값 하위 폼에 초기 적용
  useEffect(() => {
    if (searchName) {
      if (selectionMode === 'multipleRows' && searchName.split(',').length > 1) {
        popupForm.setFieldValue('multiSelect', searchName);
        setMultiSelectCount(searchName.split(',').length);
      } else {
        popupForm.setFieldValue('searchDistrict', searchName);
      }
      popupForm.setFieldValue('effectiveDate', form?.getFieldValue('effectiveDate') ?? dayjs());
      // fetchGridData();
    }
  }, [searchName]);

  useEffect(() => {
    if (!gridRef.current) return;
    gridRef.current.setGridData(gridData);
    const colSizeList = gridRef.current.getFitColumnSizeList(true);
    gridRef.current.setColumnSizeList(colSizeList);
  }, [gridData]);

  return (
    <>
      <PopupMenuTitle name="권역 조회" func={titleFunc} />

      <SearchForm form={popupForm} initialValues={searchBox}>
        <UiFilterArea>
          <UiFilterGroup className="grid-column-3">
            {/* 물류센터 */}
            <li>
              <CmGMultiDccodeSelectBox mode={'single'} name={'dccode'} disabled={true} />
            </li>
            {/* 적용일자 */}
            <li>
              <Datepicker label={'적용일자'} name="effectiveDate" />
            </li>
            {/* 권역 */}
            <li>
              <InputText
                width={80}
                name="searchDistrict"
                label="권역"
                placeholder={t('msg.placeholder2', ['권역 ID 또는 명'])}
                onPressEnter={onClickSearchButton}
              />
            </li>
            {/* 다중선택 */}
            <li style={{ gridColumn: 'span 2' }}>
							<InputText
								name="multiSelect"
								onPaste={handlePaste}
								disabled={selectionMode === 'singleRow'}
								label={'다중선택'}
								onChange={onChangeMultiSelect}
								onPressEnter={onClickSearchButton}
								count={{
									show: true,
									max: 5000,
									strategy: () => multiSelectCount,
								}}
							/>
						</li>
          </UiFilterGroup>
        </UiFilterArea>
      </SearchForm>

      <TotalCount>
        <span>총 {commUtil.changeNumberFormatter(gridData?.length ?? 0)}건</span>
      </TotalCount>

      <AGrid>
        <AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} name={gridId} />
      </AGrid>

      <ButtonWrap data-props="single">
        <Button onClick={handleClose}>{t('lbl.BTN_CANCEL')}</Button>
        <Button type="primary" onClick={handleConfirm}>{t('lbl.BTN_CONFIRM')}</Button>
      </ButtonWrap>
    </>
  );
};

export default MsDeliveryDistrictPopup;