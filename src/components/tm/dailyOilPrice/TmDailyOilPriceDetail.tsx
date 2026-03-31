/*
 ############################################################################
 # FiledataField	: TmDailyOilPriceDetail.tsx
 # Description		: 유가관리
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.09.05
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';

//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
// Utils

// API Call Function
import { apiSaveMasterList } from '@/api/tm/apiTmDailyOilPrice​';
//types
import { GridBtnPropsType } from '@/types/common';
//store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';
import { forwardRef, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const TmDailyOilPriceDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const { t } = useTranslation();
	const gridId = uuidv4() + '_gridWrap';

	const refModal = useRef(null);
	const dcCode = Form.useWatch('dcCode', props.form);
	//공통 코드 호출
	const getFuelTypeCommonCodeList = () => {
		return getCommonCodeList('FUELTYPE');
	};
	//물류센터 공통코드 호출
	const getCustomCommonCodeList = (owIndex: any, columnIndex: any, value: any) => {
		const list = getCommonCodeList('WMS_MNG_DC', '공통', 'STD');
		const convert = list.map(item => ({
			...item,
			display: item.comCd && item.comCd !== 'STD' ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
		}));
		let result = null;
		if (!commUtil.isEmpty(convert)) {
			result = convert.find((el: any) => {
				if (el.comCd === value) {
					return el;
				}
			});
		}
		return result ? result.display : null;
	};
	const gridCol = [
		{
			dataField: 'dcCode',
			headerText: '센터코드',
			dataType: 'code',
			required: true,
			labelFunction: getCustomCommonCodeList,
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
			dataField: 'fromDate',
			headerText: '시작일자',
			required: true,
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			editRenderer: {
				type: 'CalendarRenderer',
				onlyCalendar: false, // true: 텍스트 입력 비활성화, false: 입력 가능
				showExtraDays: false,
				validator: function (oldValue, newValue, item) {
					// 에디팅 유효성 검사
					let isValid = true;
					const cleanValue = String(newValue).replace(/[^0-9]/g, '');
					// 8~10자리만 허용
					if (cleanValue.length < 8 || cleanValue.length > 10) {
						isValid = false;
					} else {
						const m = parseInt(cleanValue.substring(4, 6));
						const d = parseInt(cleanValue.substring(6, 8));
						if (isNaN(m) || isNaN(d) || m > 12 || d > 31) {
							isValid = false;
						} else {
							let dateStr = cleanValue;
							if (cleanValue.length === 8) {
								dateStr =
									cleanValue.substring(0, 4) + '-' + cleanValue.substring(4, 6) + '-' + cleanValue.substring(6, 8);
							}
							if (isNaN(Date.parse(dateStr))) {
								isValid = false;
							}
						}
					}
					return { validate: isValid, message: '유효한 날짜 형식으로 입력해주세요.' };
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item?.dcCode === 'STD') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'toDate',
			headerText: '종료일자',
			required: true,
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			editRenderer: {
				type: 'CalendarRenderer',
				onlyCalendar: false, // true: 텍스트 입력 비활성화, false: 입력 가능
				showExtraDays: false,
				// defaultFormat: 'yyyy-mm-dd', // 달력 선택 시 데이터에 적용되는 날짜 형식
				validator: function (oldValue, newValue, item) {
					// 에디팅 유효성 검사
					let isValid = true;
					const cleanValue = newValue.replace(/[-\/]/g, '');
					if (cleanValue.length < 8 || cleanValue.length > 10) {
						isValid = false;
					} else {
						const m = parseInt(cleanValue.substring(4, 6));
						const d = parseInt(cleanValue.substring(6, 8));
						if (isNaN(m) || isNaN(d) || m > 12 || d > 31) {
							isValid = false;
						} else {
							let dateStr = cleanValue;
							if (cleanValue.length === 8) {
								dateStr =
									cleanValue.substring(0, 4) + '-' + cleanValue.substring(4, 6) + '-' + cleanValue.substring(6, 8);
							}
							if (isNaN(Date.parse(dateStr))) {
								isValid = false;
							}
						}
					}
					return { validate: isValid, message: '유효한 날짜 형식으로 입력해주세요.' };
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item?.dcCode === 'STD') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'gasType',
			headerText: '연료유형',
			dataType: 'code',
			required: true,
			renderer: {
				type: 'DropDownListRenderer',
				list: getFuelTypeCommonCodeList(),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					// 행 아이템의 dcCode 이 STD 라면 드랍다운리스트 비활성화(disabled) 처리
					if (commUtil.isEmpty(item['rowStatus']) || item['rowStatus'] !== 'I') {
						return true;
					}

					if (item.dcCode === 'STD' && (item.rowStatus === 'U' || item.rowStatus === 'D' || item.rowStatus === null)) {
						return true;
					}
					return false;
				},
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
		{
			dataField: 'avgPrice',
			headerText: '평균가격',
			dataType: 'numeric',
			required: true,
			formatString: '#,##0.##', // 표시 포맷
			editable: true, // ← 편집 가능
			editRenderer: {
				type: 'InputEditRenderer',
				// showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
				// onlyNumeric: true, // 0~9만 입력가능
				onlyNumeric: false,
				allowPoint: true, // 소수점( . ) 도 허용할지 여부
				allowNegative: true, // 마이너스 부호(-) 허용 여부
				textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
				maxlength: 10, // 글자수 10으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 10자로 제한)
				autoThousandSeparator: true, // 천단위 구분자 삽입 여부
				// decimalPrecision: 2, // 소숫점 2자리까지 허용
				regExp: /^\d{0,9}(\.\d{0,2})?$/, // 정수부 최대 9자리, 소수부 최대 2자리
			},
			// styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
			// 	if (item.rowStatus !== 'I') {
			// 		// 편집 가능 class 삭제
			// 		ref.gridRef.current.removeEditClass(columnIndex);
			// 	} else {
			// 		// 편집 가능 class 추가
			// 		return 'isEdit';
			// 	}
			// },
		},
		{
			dataField: 'avgPriceTex',
			headerText: '부가세제외',
			dataType: 'numeric',
			// required: true,
			formatString: '#,##0.##', // 표시 포맷
			editable: false, // ← 편집 가능
			editRenderer: {
				type: 'InputEditRenderer',
				// showEditorBtnOver: true, // 마우스 오버 시 에디터버턴 보이기
				// onlyNumeric: true, // 0~9만 입력가능
				onlyNumeric: false,
				allowPoint: true, // 소수점( . ) 도 허용할지 여부
				allowNegative: true, // 마이너스 부호(-) 허용 여부
				textAlign: 'right', // 오른쪽 정렬로 입력되도록 설정
				maxlength: 10, // 글자수 10으로 제한 (천단위 구분자 삽입(autoThousandSeparator=true)로 한 경우 구분자 포함해서 10자로 제한)
				autoThousandSeparator: true, // 천단위 구분자 삽입 여부
				// decimalPrecision: 2, // 소숫점 2자리까지 허용
				regExp: /^\d{0,9}(\.\d{0,2})?$/, // 정수부 최대 9자리, 소수부 최대 2자리
			},
			labelFunction: (
				rowIndex: number,
				colIndex: number,
				value: any,
				headerText: string,
				item: { avgPrice?: string },
			) => {
				return item.avgPrice ? Number((Number(item.avgPrice) * 10) / 11).toFixed(2) : '';
			},
		},
		{
			dataField: 'addWhoNm',
			headerText: '등록자',
			editable: false,
			width: 65,
			dataType: 'manager', // dataType을 'manager'로 설정
			managerDataField: 'addWho', // 노출시킨 사용자명에 해당하는 사용자ID dataField 설정
		},
		{ dataField: 'addDate', headerText: '등록일시', dataType: 'date', editable: false },
		{
			dataField: 'editWhoNm',
			headerText: '수정자',
			editable: false,
			width: 65,
			dataType: 'manager', // dataType을 'manager'로 설정
			managerDataField: 'editWho', // 노출시킨 사용자명에 해당하는 사용자ID dataField 설정
		},

		{ dataField: 'editDate', headerText: '수정일시', dataType: 'date', editable: false },
	];

	const gridProps = {
		editable: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
	};
	const footerLayout = [{}];

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

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
			{
				return;
			}
		} else {
			// 같은 행 판별용 UID 생성기 (우선순위: _$uid > uid > PK > 합성키)
			const hasStd = codeDtl.some(item => item.dcCode === 'STD');
			if (hasStd) {
				showAlert(null, '공통 물류센터는 삭제할 수 없습니다.');
				return;
			}
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

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
				initValues: {
					dcCode: dcCode,
					fromDate: dayjs().format('YYYYMMDD'),
					toDate: '29991231',
					rowStatus: 'I',
				}, // 신규 행 상태로 설정,
				callBackFn: () => {
					if (dcCode === '' || dcCode === 'STD') {
						const rowindex = ref.gridRef.current.getSelectedIndex()[0];
						ref.gridRef.current.removeRow(rowindex);
						showAlert('', '전체 및 공통 센터는 행을 추가 할 수 없습니다.');
					}
				},
			},

			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveMaster,
			},
		],
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 * @param s1
	 * @param e1
	 * @param s2
	 * @param e2
	 */
	const isDisjoint = (s1: string, e1: string, s2: string, e2: string) => {
		const start1 = dayjs(s1),
			end1 = dayjs(e1);
		const start2 = dayjs(s2),
			end2 = dayjs(e2);

		return end1.isBefore(start2) || end2.isBefore(start1);
	};

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;

		gridRefCur.bind('cellEditBegin', (event: any) => {
			const curField = event.dataField;
			const curItems = event.item;

			if (curItems.dcCode === 'STD') {
				return false;
			}
			if (curField === 'dcCode') {
				return false;
			}

			if (curField === '' && (commUtil.isEmpty(curItems['rowStatus']) || curItems['rowStatus'] !== 'I')) {
				return false;
			} else {
				return true;
			}
		});

		gridRefCur.bind('cellEditEnd', (event: any) => {
			// if (event.dataField === 'gasType' || event.dataField === 'priceDt' || event.dataField === 'dcCode') {
			// 	const row = event.item;
			// 	const gasType = event.dataField === 'gasType' ? event.value : row.gasType;
			// 	const priceDt = event.dataField === 'priceDt' ? event.value : row.priceDt;
			// 	const dcCode = event.dataField === 'dcCode' ? event.value : row.dcCode;
			// 	const norm = (v: any) => String(v ?? '').replace(/[^0-9]/g, ''); // YYYYMMDD로 정리
			// 	const fromDate = row.fromDate;
			// 	const toDate = row.toDate;
			// 	//console.log(fromDate);
			// 	const allRows = gridRefCur.getGridData();
			// 	const isOverlap = (aFrom: any, aTo: any, bFrom: any, bTo: any) => aFrom <= bTo && aTo >= bFrom;
			// 	const rFrom = norm(fromDate);
			// 	const rTo = norm(toDate);

			// 	// ✅ 기간 겹침
			// 	// return isOverlap(fromDate, toDate, rFrom, rTo);
			// 	const isDuplicate = allRows.some(
			// 		(r, idx) => idx !== event.rowIndex && r.gasType === gasType && r.dcCode === dcCode && r.priceDt === priceDt,
			// 	);
			// 	const Duplicate = allRows.some(x => isDisjoint(fromDate, toDate, x.fromDate, x.toDate));
			// 	//console.log(isDisjoint(fromDate, toDate, rFrom, rTo));
			// 	if (isDuplicate && Duplicate) {
			// 		showAlert('', '동일한 종류의 유종이 존재 합니다.');
			// 		gridRefCur.setCellValue(event.rowIndex, event.dataField, event.oldValue);
			// 		return;
			// 	}
			// }
			if (
				event.dataField === 'gasType' ||
				event.dataField === 'dcCode' ||
				event.dataField === 'fromDate' ||
				event.dataField === 'toDate'
			) {
				const row = event.item;

				const norm = (v: any) => String(v ?? '').replace(/[^0-9]/g, ''); // YYYYMMDD

				// ✅ 실제 키(스크린샷 기준)
				const gasType = event.dataField === 'gasType' ? event.value : row.gasType;
				const dcCode = event.dataField === 'dcCode' ? event.value : row.dcCode;

				// ✅ 편집중인 셀 값 반영 (중요!!)
				const fromDate = event.dataField === 'fromDate' ? norm(event.value) : norm(row.fromDate);
				const toDate = event.dataField === 'toDate' ? norm(event.value) : norm(row.toDate);

				// 입력 덜 된 상태면 패스
				if (!gasType || !dcCode || !fromDate || !toDate) return;

				// // 기간 역전 체크
				// if (fromDate > toDate) {
				// 	showAlert('', '기간이 올바르지 않습니다. (시작일 > 종료일)');
				// 	gridRefCur.setCellValue(event.rowIndex, event.dataField, event.oldValue);
				// 	return;
				// }

				const isOverlap = (aFrom: string, aTo: string, bFrom: string, bTo: string) => aFrom <= bTo && aTo >= bFrom;

				const allRows = gridRefCur.getGridData();

				// ✅ 같은 키(dcCode+gasType) 끼리만 기간 겹침 검사
				const hasOverlapDuplicate = allRows.some((r, idx) => {
					if (idx === event.rowIndex) return false;

					if (r.dcCode !== dcCode) return false;
					if (r.gasType !== gasType) return false;

					const rFrom = norm(r.fromDate);
					const rTo = norm(r.toDate);
					if (!rFrom || !rTo) return false;

					return isOverlap(fromDate, toDate, rFrom, rTo);
				});

				if (hasOverlapDuplicate) {
					showAlert('', '동일 센터/유종에 기간이 겹치는 데이터가 존재합니다.');
					gridRefCur.setCellValue(event.rowIndex, event.dataField, event.oldValue);
					return;
				}
			}
			if (event.dataField === 'fromDate' || event.dataField === 'toDate') {
				// 해당 행 전체 데이터
				const row = event.item; // 또는 event.row depending on your grid version
				let fromDt = row.fromDate;
				let toDt = row.toDate;

				// 현재 셀 편집 중 변경된 값 반영
				if (event.dataField === 'fromDate') {
					fromDt = event.value; // 새로 입력된 from값
				} else if (event.dataField === 'toDate') {
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
				<GridTopBtn totalCnt={props.totalCnt} gridBtn={gridBtn} />
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
export default TmDailyOilPriceDetail;
