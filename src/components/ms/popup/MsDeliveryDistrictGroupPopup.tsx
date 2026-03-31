// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import TotalCount from '@/assets/styled/Container/TotalCount';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

// components
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SearchForm } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// api calls
import { apiPostGetDistrictGroupList } from '@/api/ms/apiMsDeliveryDistrict';

// utils

// store

// hooks

// types
import { IBindGridEvent } from '@/lib/AUIGrid/types';


interface Props {
  form?: any; // 상위 컴포넌트 의 조건을 가져오기 위한 폼 (dccode, effectiveDate, searchKeyword)
  handleSetSelectedRows?: (rows: any[]) => void; // 1개 행 or 체크된 다중 행 선택 시 호출
  handleClose?: () => void; // 해당 팝업 닫기 함수
  searchName?: string; // 상위 컴포넌트(코드상 위 위) 검색 문자 "," 로 다중 단일 구분
  selectionMode?: string; // 선택 모드 "single" or "multiple"
  customDccode?: string; // 커스텀 물류센터 코드
}

const MsDeliveryDistrictGroupPopup = ({
  form,
  handleSetSelectedRows,
  handleClose,
  searchName,
  selectionMode,
  customDccode,
}: Props) => {
  const { t } = useTranslation();
  const gridRef = useRef<any>(); // 그리드 Ref
  const gridId = uuidv4() + '_popGrid';

  const [popupForm] = Form.useForm(); // 팝업 내부 폼

  const [gridData, setGridData] = useState<any[]>([]); // 그리드 데이터
  const [multiSelectCount, setMultiSelectCount] = useState(0); // 다중 선택 갯수

  const [searchBox, setSearchBox] = useState({ // 검색 초기 조건
    dccode: form?.getFieldValue('dccode') || customDccode || '',
    effectiveDate: form?.getFieldValue('effectiveDate') ?? dayjs(),
		searchKeyword: '',
		multiSelect: '',
	});

  const fetchGridData = async () => {

    apiPostGetDistrictGroupList({
      dccode: popupForm.getFieldValue('dccode') || customDccode, // tabSearchConditions['districtGroup']?.dccode,
      effectiveDate: popupForm.getFieldValue('effectiveDate').format('YYYYMMDD'), // dayjs(tabSearchConditions['districtGroup']?.effectiveDate).format('YYYYMMDD'),
      searchKeyword: popupForm.getFieldValue('searchKeyword'),
      multiSelect: popupForm.getFieldValue('multiSelect'),
    }).then(res => {
      if (res?.statusCode === 0) {
        setGridData(res.data || []);
      }
    });
  };

  // 팝업 내 검색 버튼
  const onClickSearchButton = () => {
    fetchGridData();
  };

  // 팝업 내 새로고침 버튼
  const onClickRefreshButton = () => {
    gridRef.current?.clearGridData();
    // 조회 조건 초기화
    popupForm.setFieldsValue({
      searchKeyword: '',
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

  const handleDubleClickEvent = useCallback((event: IBindGridEvent) => {
    const selectedRow = gridRef.current?.getSelectedRows?.() ?? [];
		handleSetSelectedRows?.(selectedRow);
  }, []);

  const gridCol = [
    { headerText: '권역그룹ID', dataField: 'dlvgroupId', minWidth: 100 },
    { headerText: '권역그룹명', dataType: 'string', dataField: 'dlvgroupNm', minWidth: 100 },
    { headerText: '적용시작일자', dataType: 'string', dataField: 'fromDate', minWidth: 100 },
    { headerText: '적용종료일자', dataType: 'string', dataField: 'toDate', minWidth: 100 },
  ];

  const gridProps = {
    editable: false,
    selectionMode: 'multipleCells',
    showRowCheckColumn: true,
    enableRowCheck: true,
  };


  // 그리드 이벤트 설정
	useEffect(() => {
		const grid = gridRef.current;
		if (!grid) return;

		grid.bind('cellDoubleClick', handleDubleClickEvent); // 더블클릭 이벤트 처리

		return () => {
			if (grid?.unbind) {
				grid.unbind('cellDoubleClick');
			}
		};
	}, []);

  // 상위 form 값 하위 폼에 초기 적용
  useEffect(() => {
    if (searchName) {
      if (selectionMode === 'multipleRows' && searchName.split(',').length > 1) {
				popupForm.setFieldValue('multiSelect', searchName);
				setMultiSelectCount(searchName.split(',').length);
			} else {
				popupForm.setFieldValue('searchKeyword', searchName);
			}
      popupForm.setFieldValue('effectiveDate', form?.getFieldValue('effectiveDate') ?? dayjs());
      // fetchGridData();
    }
  }, [searchName]);

  // gridData 변경 시 그리드 반영
  useEffect(() => {
    if (!gridRef.current) return;
    gridRef.current.setGridData(gridData);
    const colSizeList = gridRef.current.getFitColumnSizeList(true);
    gridRef.current.setColumnSizeList(colSizeList);
  }, [gridData]);


  return (
    <>
      <PopupMenuTitle name="권역그룹 조회" func={titleFunc} />

      <SearchForm form={popupForm} initialValues={searchBox}>
        <UiFilterArea>
          <UiFilterGroup className="grid-column-2">
            {/* dccode / effectiveDate / searchKeyword 는 MsDeliveryDistrictPopSearch 와 동일하게 */}
            {/* 물류센터 */}
            <li>
              <CmGMultiDccodeSelectBox mode={'single'} name={'dccode'} disabled={true} />
						</li>
            {/* 권역그룹 */}
            <li>
							<InputText
								width={80}
								name={'searchKeyword'} // searchKeyword 는 popNo, popName  둘다 검색이 됨
								placeholder={t('msg.placeholder2', ['권역그룹 ID 또는 명'])}
								onPressEnter={onClickSearchButton}
								label={'권역그룹'}
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
            {/* 필요시 그대로 복붙 */}
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
        <Button type="primary" onClick={handleConfirm}>
          {t('lbl.BTN_CONFIRM')}
        </Button>
      </ButtonWrap>
    </>
  );
};

export default MsDeliveryDistrictGroupPopup;