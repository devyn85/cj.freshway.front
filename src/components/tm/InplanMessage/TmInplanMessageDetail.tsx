/*
 ############################################################################
 # FiledataField	: TmInplanMessageDetail.tsx
 # Description		: 배송전달사항
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.05
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';
//types
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
// Utils

// API Call Function
import { apisaveMasterList } from '@/api/tm/apiTmInplanMessage';
//store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import { Form } from 'antd';

const TmInplanMessageDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const { t } = useTranslation();
	const gridId = uuidv4() + '_gridWrap';
	const refModal = useRef(null);
	// 글로벌 변수에서 현재 설정된 물류센터 코드를 가져옵니다.
	const globalVariable = useAppSelector(state => state.global.globalVariable);
	const getByteLength = (str: string) => new TextEncoder().encode(str ?? '').length;
	const dcCode = Form.useWatch('dcCode', props.form);
	/**
	 * //물류센터 공통코드 호출
	 * 공통함수 호출 ([comCd]cdNm형으로 변형)
	 * @returns
	 */
	const getCustomCommonCodeList = () => {
		const list = getCommonCodeList('WMS_MNG_DC', '');

		return list.map(item => ({
			...item,
			display: `[${item.comCd}] ${item.cdNm}`, // 새로운 display 필드 추가
		}));
	};

	const gridCol = [
		{
			dataField: 'fromInfoDt',
			required: true,
			headerText: '적용시작일',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			// width: 200,
			editRenderer: {
				type: 'CalendarRenderer',
				onlyCalendar: true, // true: 텍스트 입력 비활성화, false: 입력 가능
				showExtraDays: false,
			},
			// labelFnction: (rowIndex: any, columnIndex: any, value: any) => {
			// 	return value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
			// },
		},
		{
			dataField: 'toInfoDt',
			required: true,
			headerText: '적용종료일',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			// width: 200,
			editRenderer: {
				type: 'CalendarRenderer',
				onlyCalendar: true, // true: 텍스트 입력 비활성화, false: 입력 가능
				showExtraDays: false,
			},
			// labelFnction: (rowIndex: any, columnIndex: any, value: any) => {
			// 	return value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
			// },
		},

		{
			dataField: 'custkey',
			headerText: '관리처코드',
			editable: false,
			dataType: 'code',
			required: true,
			width: 100,
			commRenderer: {
				type: 'search',
				onClick: function (e: any) {
					// if (e.item.rowStatus !== 'I') {
					// 	return false;
					// }
					if (e.item.rowStatus !== 'I') {
						ref.gridRef.current.openPopup(e.item, 'cust');
						return;
					}
					const rowIndex = e.rowIndex;
					refModal.current.open({
						gridRef: ref.gridRef,
						rowIndex,
						dataFieldMap: {
							custkey: 'code',
							custName: 'name',
						},
						popupType: 'cust',
					});
				},
			},
		},
		{ dataField: 'custName', headerText: '관리처명', editable: false, dataType: 'text' },

		{
			dataField: 'dcCode',
			headerText: '물류센터',
			required: true,
			editable: true,
			dataType: 'code',
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: function (rowIndex: any, columnIndex: any, value: any, item: any) {
					if (item.rowStatus === 'I') {
						return {
							type: 'DropDownListRenderer',
							list: getCustomCommonCodeList(),
							keyField: 'comCd', // key 에 해당되는 필드명
							valueField: 'display',
						};
					}
					return { type: 'InputEditRenderer' };
				},
			},
			labelFunction: (rowIndex: any, field: any, value: any, item: any) => {
				// value는 저장된 값(comCd)
				const codeList = getCommonCodeList('SUPPLY_DC', '');
				const match = codeList.find(i => i.comCd == value);
				if (match) {
					return `[${match.comCd}] ${match.cdNm}`;
				}
				return value ?? '';
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		// {
		// 	dataField: 'carno',
		// 	headerText: '차량번호',
		// 	commRenderer: {
		// 		type: 'search',
		// 		onClick: function (e: any) {
		// 			const rowIndex = e.rowIndex;

		// 			// 예: custcd 컬럼에서 팝업 열기
		// 			refModal.current.open({
		// 				gridRef: ref.gridRef,
		// 				rowIndex,
		// 				dataFieldMap: {
		// 					carno: 'code',
		// 					carnoName: 'name',
		// 				},
		// 				popupType: 'car',
		// 			});
		// 		},
		// 	},
		// 	editable: true,
		// },
		{
			dataField: 'deliveryMemo',
			headerText: '메모',
			dataType: 'text',
			editable: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'whence',
			headerText: '출처',
			dataType: 'code',
			editable: false,
		},
		// {
		// 	dataField: 'sapaddwho',
		// 	headerText: 'SAP등록자',
		// 	dataType: 'code',
		// 	editable: false,
		// },
		// {
		// 	dataField: 'sapAddDate',
		// 	headerText: 'SAP등록시간',
		// 	dataType: 'code',
		// 	editable: false,
		// },
		{
			dataField: 'addWho',
			headerText: '등록자',
			width: 90,
			dataType: 'manager',
			managerDataField: 'addWhoId',
			editable: false,
		},
		{ dataField: 'addDate', headerText: '등록일시', dataType: 'code', editable: false },
		{
			dataField: 'editWho',
			headerText: '수정자',
			width: 90,
			dataType: 'manager',
			managerDataField: 'editWhoId',
			editable: false,
		},
		{ dataField: 'editDate', headerText: '수정일시', dataType: 'code', editable: false },
	];
	// 마스터 그리드 버튼 설정

	const gridProps = {
		editable: true,
		// showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
	};
	const footerLayout = [{}];
	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * 저장
	 * @returns
	 */
	const saveMaster = async () => {
		// 변경 데이터 확인
		const menus = ref.gridRef.current.getChangedData({ validationYn: false });
		// const menus = ref.gridRef.current.getChangedData();
		if (!menus || menus.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		// validation
		if (menus.length > 0 && !ref.gridRef.current.validateRequiredGridData()) {
			return;
		}
		//DB 바이트 체크(varchar2(1000))
		let valChk = true;
		const arr = [];

		menus.forEach((row, i) => {
			const bytes = getByteLength(row.deliveryMemo || '');

			if (bytes > 1000) {
				arr.push(i + 1);
				valChk = false;
			}
		});
		if (!valChk) {
			showAlert('', `${arr}열 메모의 문자 길이가 너무 깁니다.`);
			return;
		}

		ref.gridRef.current.showConfirmSave(() => {
			const saveList = {
				saveList: menus,
			};

			apisaveMasterList(saveList)
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
		const param = {
			saveList: menus,
		};
		// apisaveMasterList(param)
		// 	.then(res => {
		// 		if (res.statusCode === 0) {
		// 			ref.gridRef.current.clearGridData();
		// 			props.fnCallBack(); // 저장 성공 후에만 호출
		// 			showAlert('저장', '저장되었습니다.');
		// 		} else {
		// 			showAlert('저장 결과', '저장에 실패하였습니다. 다시 시도해주세요.');
		// 		}
		// 	})
		// 	.catch(e => {
		// 		showAlert('저장 결과', '저장 중 오류가 발생했습니다.');
		// 	});
	};

	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
				initValues: {
					fromInfoDt: dayjs().add(1, 'day').format('YYYYMMDD'), // 내일,
					toInfoDt: dayjs().add(3, 'day').format('YYYYMMDD'),
					rowStatus: 'I',
					dcCode: dcCode ?? '',
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
			{ btnType: 'save', callBackFn: saveMaster },
		],
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		gridRefCur.bind('cellEditBegin', (event: any) => {
			if (event.item.rowStatus == 'I') {
				// 신규 행일 경우 그리드의 editable의 true일때만 수정 가능
				return true;
			} else {
				if (event.dataField == 'fromInfoDt' || event.dataField == 'toInfoDt') {
					//기존 데이터는 시작일 종료일만 수정가능
					return true;
				} else {
					return false;
				}
			}
		});
		gridRefCur.bind('cellEditEnd', (event: any) => {
			// 해당 행 전체 데이터
			const row = event.item; // 또는 event.row depending on your grid version
			let fromDt = row.fromInfoDt;
			let toDt = row.toInfoDt;

			// 현재 셀 편집 중 변경된 값 반영
			if (event.dataField === 'fromInfoDt') {
				fromDt = event.value; // 새로 입력된 from값
			} else if (event.dataField === 'toInfoDt') {
				toDt = event.value; // 새로 입력된 to값
			}

			// dayjs 등 날짜 객체로 변환하여 비교
			if (fromDt && toDt) {
				const fromDay = dayjs(fromDt);
				const toDay = dayjs(toDt);

				if (fromDay.isAfter(toDay)) {
					showAlert('날짜 오류', '시작일(from)이 종료일(to)보다 늦을 수 없습니다.');
					const dataField = event.dataField;
					gridRefCur.setCellValue(event.rowIndex, dataField, event.oldValue);
					return false;
				}
			}
		});
	}, []);

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			const newData = (Array.isArray(props.data) ? props.data : [props.data]).map(item => ({
				...item,
				customRowCheckYn: 'N',
			}));

			gridRefCur?.setGridData(newData);
			// gridRefCur?.setGridData(props.data);

			gridRefCur?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
				gridRefCur.setColumnPropByDataField('custkey', { width: 100 });
			}
		}
	}, [props.data]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle="목록" totalCnt={props.totalCnt} gridBtn={gridBtn} />
				<AUIGrid
					ref={ref.gridRef}
					name={gridId}
					columnLayout={gridCol}
					gridProps={gridProps}
					footerLayout={footerLayout}
				/>
			</AGrid>
			<CmSearchWrapper ref={refModal} />
		</>
	);
});
export default TmInplanMessageDetail;
