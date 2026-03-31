/*
 ############################################################################
 # FiledataField	: TmCalendarDetail.tsx
 # Description		: 근태관리
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.09.16
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';
import TmCalendarPopup from '@/components/tm/calendar/TmCalendarPopup';

//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { v4 as uuidv4 } from 'uuid';
// Utils

// API Call Function
import { apiSaveMasterList } from '@/api/tm/apiTmCalendar';

//types
import { GridBtnPropsType } from '@/types/common';
//store
import CustomModal from '@/components/common/custom/CustomModal';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';

const TmCalendarDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const { t } = useTranslation();
	const gridId = uuidv4() + '_gridWrap';

	const refModal = useRef(null);
	const refTmCalendarModal = useRef(null);

	//공통 코드 호출
	const getTmcaclItmeCommonCodeList = () => {
		return getCommonCodeList('YN');
	};
	//물류센터 공통코드 호출
	const getCustomCommonCodeList = (rowIndex: any, columnIndex: any, value: any) => {
		return '[' + getCommonCodebyCd('WMS_MNG_DC', value)?.comCd + ']' + getCommonCodebyCd('WMS_MNG_DC', value)?.cdNm;
	};

	const gridCol = [
		{
			dataField: 'dcCode',
			headerText: '센터코드',
			width: 110,
			dataType: 'code',
			editable: false,
			styleFunction: dayGbColorFunc,
			labelFunction: getCustomCommonCodeList,
		},

		{
			dataField: 'yy',
			headerText: '연도',
			width: 90,
			dataType: 'code',
			editable: false,
			styleFunction: dayGbColorFunc,
		},
		{ dataField: 'mm', headerText: '월', width: 70, dataType: 'code', editable: false, styleFunction: dayGbColorFunc },
		{ dataField: 'dd', headerText: '일', width: 70, dataType: 'code', editable: false, styleFunction: dayGbColorFunc },
		{
			dataField: 'dayGb',
			headerText: '일구분',
			width: 110,
			dataType: 'code',
			editable: false,
			styleFunction: dayGbColorFunc,
		},
		{
			dataField: 'restYn',
			headerText: '휴일유무',
			width: 100,

			editable: true,
			styleFunction: dayGbColorFunc,
			renderer: {
				type: 'DropDownListRenderer',
				list: getTmcaclItmeCommonCodeList(),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
				listAlign: 'RiTmCalendar',
			},
		},
		{
			dataField: 'workYn',
			headerText: '근무여부',
			width: 100,
			dataType: 'code',
			editable: true,
			styleFunction: dayGbColorFunc,
			renderer: {
				type: 'DropDownListRenderer',
				list: getTmcaclItmeCommonCodeList(),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
		},
		{
			dataField: 'restDesc',
			headerText: '휴일설명',
			width: 220,
			dataType: 'text',
			align: 'left',
			editable: true,
			styleFunction: dayGbColorFunc,
		},
		{
			dataField: 'addWhoName',
			headerText: '등록자',
			width: 120,
			dataType: 'manager',
			managerDataField: 'addWho',
			styleFunction: dayGbColorFunc,
			editable: false,
		},
		{
			dataField: 'addDate',
			headerText: '최초등록시간',
			width: 160,
			dataType: 'code',
			align: 'center',
			editable: false,
			styleFunction: dayGbColorFunc,
		},
		{
			dataField: 'editWhoName',
			headerText: '수정자',
			width: 120,

			dataType: 'manager',
			managerDataField: 'editWho',
			editable: false,
			styleFunction: dayGbColorFunc,
		},
		{
			dataField: 'editDate',
			headerText: '최종변경시간',
			width: 160,
			dataType: 'code',
			styleFunction: dayGbColorFunc,
			editable: false,
		},
	];

	const gridProps = {
		editable: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		showRowCheckColumn: true,

		// isLegacyRemove: true,
	};
	const footerLayout = [{}];

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	// 함수 정의
	/**
	 *
	 * @param rowIndex
	 * @param columnIndex
	 * @param value
	 * @param headerText
	 * @param item
	 * @param dataField
	 */
	function dayGbColorFunc(
		rowIndex: number,
		columnIndex: number,
		value: any,
		headerText: string,
		item: any,
		dataField: string,
	) {
		const day = (item?.dayGb ?? '').toString();
		const restYn = (item?.restYn ?? '').toString();
		// 휴일 우선 빨강 처리 원하면 아래 주석 해제
		// if ((item?.restYn ?? '') === 'Y') return { color: '#d32f2f', fontWeight: 'bold' };

		if (day === '일요일') return { color: 'red' }; // 빨강
		if (day === '토요일') return { color: 'blue' }; // 파랑
		if (restYn === 'Y') return { color: 'red' };
		else return { color: '' };
	}
	/**
	 * 저장로직
	 * @returns
	 */
	const saveMaster = () => {
		const codeDtl = ref.gridRef.current.getChangedData({ validationYn: false });
		const allRows = ref.gridRef.current.getGridData();

		if (!codeDtl || codeDtl.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'), () => {
				return;
			});
		} else if (codeDtl.length > 0 && !ref.gridRef.current.validateRequiredGridData()) {
			return;
		} else {
			// 같은 행 판별용 UID 생성기 (우선순위: _$uid > uid > PK > 합성키)

			ref.gridRef.current.showConfirmSave(() => {
				const saveList = {
					saveList: codeDtl,
				};
				apiSaveMasterList(saveList)
					.then(res => {
						if (res.statusCode === 0) {
							ref.gridRef.current.clearGridData();
							props.fnCallBack(); // 저장 성공 후에만 호출
							showAlert('저장', '저장되었습니다.');
						} else {
							return false;
						}
					})
					.catch(e => {
						return false;
					});
			});
		}
	};
	/**달력생성 로직
	 * @returns
	 */
	const createCalendar = useCallback(async () => {
		// 입력 값 검증
		const isValid = await validateForm(props.form);
		if (!isValid) {
			return;
		}

		// 달력생성 팝업을 실행한다.
		refTmCalendarModal.current.handlerOpen();
	}, [props.form, refTmCalendarModal]);

	// 달력 생성 팝업 저장 콜백
	const callBackCreateCalendarModal = () => {
		props.callBackFn?.(true);
		closeCreateCalendarModal();
	};

	/**
	 * 달력생성 팝업 닫기
	 */
	const closeCreateCalendarModal = () => {
		refTmCalendarModal.current.handlerClose();
	};
	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveMaster,
			},
			{
				btnType: 'btn1',
				btnLabel: '달력생성',
				callBackFn: createCalendar,
			},
		],
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			// gridRefCur?.setGridData(props.data);
			const newData = (Array.isArray(props.data) ? props.data : [props.data]).map(item => ({
				...item,
				customRowCheckYn: 'N',
			}));
			// gridRefCur?.setGridData(props.data);
			gridRefCur?.setGridData(newData);
			gridRefCur?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle="휴일내역" totalCnt={props.totalCnt} gridBtn={gridBtn} />
				<AUIGrid
					ref={ref.gridRef}
					name={gridId}
					columnLayout={gridCol}
					gridProps={gridProps}
					footerLayout={footerLayout}
				/>
			</AGrid>

			<CmSearchWrapper ref={refModal} />
			{/* 달력생성 팝업 영역 정의 */}
			<CustomModal ref={refTmCalendarModal} width="300px">
				<TmCalendarPopup callBack={callBackCreateCalendarModal} close={closeCreateCalendarModal}></TmCalendarPopup>
			</CustomModal>
		</>
	);
});
export default TmCalendarDetail;
