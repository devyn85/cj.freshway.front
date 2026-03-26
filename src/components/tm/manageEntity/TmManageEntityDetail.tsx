/*
 ############################################################################
 # FiledataField	: TmManageEntityDetail.tsx
 # Description		: ​​정산항목관리
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.08.04
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { v4 as uuidv4 } from 'uuid';
// Utils

// API Call Function
import { apiGetMasterList, apiSaveMasterList } from '@/api/tm/apiTmManageEntity';
import AGridWrap from '@/assets/styled/AGridWrap/AGridWrap';
import CmSearchCarrierWrapper from '@/components/cm/popup/CmSearchCarrierWrapper';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';
import { isEmpty } from 'lodash';
//store
const TmManageEntityDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const { t } = useTranslation();
	const gridId = uuidv4() + '_gridWrap';
	const dcCode = Form.useWatch('dcCode', props.form);
	const courier = Form.useWatch('courier', props.form);
	const courierNm = Form.useWatch('courierName', props.form);
	const refModal1 = useRef(null);
	const refModal = useRef(null);
	const getTmcaclItmeCommonCodeList = () => {
		// 원본 리스트 가져오기
		const list = getCommonCodeList('TM_CALC_ITEM', '');
		// data1이 'M'이 아닌 것만 반환
		// return list.filter(item => item.data1 === 'P' || item.data1 === 'D');
		return list.filter(item => item.data4 === 'Y');
	};
	const getTmcaclTypeCommonCodeList = () => {
		return getCommonCodeList('TM_CALC_TYPE', '');
	};
	const getTmcaclTypeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('TM_CALC_ITEM', value)?.cdNm;

		// return list;
	};
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
			headerText: '물류센터',
			editable: false,
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			visible: true,
			dataType: 'code',
			labelFunction: getCustomCommonCodeList,
		},
		{
			dataField: 'courier',
			headerText: '운송사',
			editable: true,
			visible: true,
			cellMerge: true, // 구분1 칼럼 셀 세로 병합 실행
			required: true,
			dataType: 'text',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return ref.gridRef.current.getCellValue(rowIndex, 'courierName') || '';
			},
			commRenderer: {
				type: 'search',
				popupType: 'carrierDrop',
				searchDropdownProps: {
					dataFieldMap: {
						courier: 'code',
						courierName: 'name',
					},
				},
				params: {
					carrierType: 'LOCAL',
				},
				onClick: function (e: any) {
					const rowIndex = e.rowIndex;
					if (e.item.rowStatus !== 'I') return; // 신규행이 아닐 경우 팝업 열지 않음

					// 예: custcd 컬럼에서 팝업 열기
					refModal1.current.open({
						gridRef: ref.gridRef,
						rowIndex,
						dataFieldMap: {
							courier: 'code',
							courierName: 'name',
						},
						carrierType: 'LOCAL',
						popupType: 'carrier',
					});
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item?.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		// { dataField: 'courierName', headerText: '운송사명', editable: true, visible: true },
		{
			dataField: 'sttlItemCd',
			headerText: '항목',
			dataType: 'code',
			// renderer: {
			// 	// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
			// 	type: 'DropDownListRenderer',
			// 	list: getTmcaclItmeCommonCodeList(),
			// 	keyField: 'comCd', // key 에 해당되는 필드명
			// 	valueField: 'cdNm',
			// },
			editable: true,
			required: true,
			labelFunction: getTmcaclTypeCommonCode,
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: function (rowIndex, columnIndex, value, item) {
					if (item?.rowStatus === 'I') {
						return {
							type: 'DropDownListRenderer',
							list: getTmcaclItmeCommonCodeList(),
							keyField: 'comCd', // key 에 해당되는 필드명
							valueField: 'cdNm',
						};
					}
					return { type: 'InputEditRenderer' };
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item?.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		// {
		// 	dataField: 'caclType',
		// 	headerText: '항목',
		// 	dataType: 'code',
		// 	labelFunction: (
		// 		rowIndex: number,
		// 		colIndex: number,
		// 		value: any,
		// 		headerText: string,
		// 		item: { sttlItemCd?: string },
		// 	) => {
		// 		const sttlItemCd = item?.sttlItemCd;
		// 		if (!sttlItemCd) return '';
		// 		const codeList: any[] = getTmcaclTypeCommonCodeList();
		// 		const type = codeList.find(t => String(t.comCd).trim() === String(sttlItemCd).charAt(0).trim());
		// 		return type ? type.cdNm : '';
		// 	},
		// 	editable: false,
		// },

		{
			dataField: 'entrustedCarYn',
			headerText: '지입',
			// align: 'center',
			dataType: 'code',
			renderer: {
				type: 'CheckBoxEditRenderer',
				showLabel: false, // 참, 거짓 텍스트 출력여부( 기본값 false )
				editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
				checkValue: 'Y', // true, false 인 경우가 기본
				unCheckValue: 'N',
				// 체크박스 disabled 함수
			},
		},
		{
			dataField: 'mmContractYn',
			headerText: '월대',

			dataType: 'code',
			renderer: {
				type: 'CheckBoxEditRenderer',
				showLabel: false, // 참, 거짓 텍스트 출력여부( 기본값 false )
				editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
				checkValue: 'Y', // true, false 인 경우가 기본
				unCheckValue: 'N',
				// 체크박스 disabled 함수
			},
		},
		{
			dataField: 'fixCarYn',
			headerText: '고정',

			dataType: 'code',
			renderer: {
				type: 'CheckBoxEditRenderer',
				showLabel: false, // 참, 거짓 텍스트 출력여부( 기본값 false )
				editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
				checkValue: 'Y', // true, false 인 경우가 기본
				unCheckValue: 'N',
				// 체크박스 disabled 함수
			},
		},

		{
			dataField: 'tmpCarYn',
			headerText: '임시',
			dataType: 'code',

			renderer: {
				type: 'CheckBoxEditRenderer',
				showLabel: false, // 참, 거짓 텍스트 출력여부( 기본값 false )
				editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
				checkValue: 'Y', // true, false 인 경우가 기본
				unCheckValue: 'N',
				// 체크박스 disabled 함수
			},
		},

		{
			dataField: 'actualCostCarYn',
			headerText: '실비',
			dataType: 'code',
			renderer: {
				type: 'CheckBoxEditRenderer',
				// showLabel: false, // 참, 거짓 텍스트 출력여부( 기본값 false )
				editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
				checkValue: 'Y', // true, false 인 경우가 기본
				unCheckValue: 'N',
				// 체크박스 disabled 함수
			},
		},
		{
			dataField: 'caclTypeData',
			headerText: '적용주기',
			dataType: 'code',
			labelFunction: (
				rowIndex: number,
				colIndex: number,
				value: any,
				headerText: string,
				item: { sttlItemCd?: string },
			) => {
				const sttlItemCd = item?.sttlItemCd;
				//console.log(();
				return getCommonCodebyCd('TM_CALC_ITEM', sttlItemCd)?.data2;
			},
			editable: false,
		},
		{
			dataField: 'sttlItemDescr',
			headerText: '비고',
			align: 'center', // 추가

			editable: true,
		},
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

	const gridProps = {
		editable: true,
		enableCellMerge: true,
		cellMergeRowSpan: false,
		// showStateColumn: true,
		// editable: true,
		//editBeginMode: 'doubleClick',
		// fillColumnSizeMode: false,
		// enableColumnResize: true,
		// showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		// enableFilter: true,
		// isLegacyRemove: true,
	};
	const footerLayout = [
		{
			dataField: 'slipDt',
			positionField: 'slipDt',
			operation: 'COUNT',
			postfix: ' rows',
		},
	];

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
		const validChk = ref.gridRef.current.getGridData();

		if (!codeDtl || codeDtl.length < 1) {
			ref.gridRef.current.showConfirmSave(() => {
				return;
			});
		} else if (codeDtl.length > 0 && !ref.gridRef.current.validateRequiredGridData()) {
			return;
		} else {
			showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
				const saveList = {
					saveList: codeDtl,
				};

				//console.log((saveList);
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

	/**
	 * 불러오기
	 *
	 */
	const importCourier = () => {
		const gridRef = ref.gridRef.current;
		const selectRow = gridRef.getSelectedIndex()[0];

		const gridDataWithState = gridRef.getGridData();
		const rowData = gridDataWithState[selectRow];
		const fromCourier = rowData.courier;
		if (isEmpty(fromCourier)) {
			showAlert('', '선택된 운송사가 없습니다.');
			return;
		}
		refModal1.current.open({
			gridRef: ref.gridRef,
			selectRow,
			dataFieldMap: {
				carno: 'code',
				carname: 'name',
			},
			carrierType: 'LOCAL',
			popupType: 'carrier',
			onConfirm: (selectedRows: any[]) => {
				if (!selectedRows) return;
				refModal1.current.handlerClose();
				const selectedData = selectedRows[0];
				////console.log((selectedData);
				if (selectedData.code === fromCourier) {
					showAlert('', '동일한 운송사를 선택하였습니다');
					return;
				}
				apiGetMasterList({
					importCarrier: selectedData.code,
					importCarrierNm: selectedData.name,
					dcCode: dcCode,
					courier: fromCourier,
				}).then(res => {
					////console.log((res.data);
					res.data.forEach(row => {
						gridRef.addRow(row);
					});
				});
			},
		});
	};

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 행삭제
				callBackFn: importCourier,
			},
			{
				btnType: 'plus', // 행추가
				initValues: {
					entrustedCarYn: 'N',
					fixCarYn: 'N',
					tmpCarYn: 'N',
					actualCostCarYn: 'N',
					dcCode: dcCode,
					rowStatus: 'I',
					courier: courier,
					courierName: courierNm?.replace(/\[\d+\]/g, ''),
				},
				// callBackFn: () => {
				// 	if (isEmpty(courier)) {
				// 		const rowindex = ref.gridRef.current.getSelectedIndex()[0];
				// 		ref.gridRef.current.removeRow(rowindex);
				// 		showAlert('', '검색 조건의 운송사 코드/명을 입력해주세요');
				// 	}
				// },
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
	 * 중복체크 로직
	 * @param
	 * @param r
	 * @returns
	 */
	// ===== 내부 유틸 =====
	const pkOf = (r: any) => `${r.sttlItemCd}||${r.dcCode}||${r.courier}`;
	let DUP_MODE = 'ALERT_ONCE';
	// 중복 큐(배치 입력 시 여러 번 들어오는 중복을 한 번에 처리)
	let dupQueue: Array<{ rowIndex: number; dataField: string; oldValue: any; pk: string }> = [];
	let dupTimer: any = null;

	/**
	 * 중복 체크로직 큐에 담고, 마이크로태스크로 한 번에 처리(복붙땜에 큐 사용)
	 * @param {any} info
	 * @param {any} info.rowIndex
	 * @param {any} info.dataField
	 * @param {any} info.oldValue
	 * @param {any} info.pk
	 * @returns
	 */
	// GPT는 신이야!! ㅁ
	const enqueueDup = (info: { rowIndex: number; dataField: string; oldValue: any; pk: string }) => {
		dupQueue.push(info);
		if (dupTimer) return;

		const gridRefCur = ref.gridRef.current;
		dupTimer = setTimeout(async () => {
			// 같은 PK로 다수 들어올 수 있으니 rowIndex 기준/PK 기준으로 정리
			const uniqueByRow = new Map<number, (typeof dupQueue)[number]>();
			for (const it of dupQueue) uniqueByRow.set(it.rowIndex, it);
			const uniq = Array.from(uniqueByRow.values());
			DUP_MODE = 'ALERT_ONCE';
			if (uniq.length === 0) {
				return;
			} else if (uniq.length === 1) {
				DUP_MODE = 'AUTO_REVERT';
			} else {
				DUP_MODE = 'AUTO_DELETE';
			}
			//console.log(('중복 처리 모드:', DUP_MODE);
			//console.log((uniq);
			if (DUP_MODE === 'AUTO_DELETE') {
				// 첫 등장(rowIndex가 작은 것)을 남기고 이후 중복을 삭제
				const gridData = gridRefCur.getGridData();
				const firstSeen = new Map<string, number>(); // pk -> first rowIndex
				gridData.forEach((r: any, idx: number) => {
					const k = pkOf(r);
					if (!firstSeen.has(k)) firstSeen.set(k, idx);
				});

				// gridRefCur.beginUpdate();
				// 큰 rowIndex부터 지워야 인덱스 밀림이 없음
				const toDelete = uniq
					.filter(it => firstSeen.get(it.pk) !== undefined && firstSeen.get(it.pk)! !== it.rowIndex)
					.map(it => it.rowIndex)
					.sort((a, b) => b - a);
				toDelete.forEach(idx => gridRefCur.removeRow(idx));
				// gridRefCur.endUpdate();

				if (toDelete.length > 0) {
					await showAlert('중복 정리', `${toDelete.length}건의 중복 행을 자동 삭제했습니다.`);
				}
			} else if (DUP_MODE === 'AUTO_REVERT') {
				// 편집된 값 되돌리기
				uniq.forEach(it => gridRefCur.setCellValue(it.rowIndex, it.dataField, it.oldValue));
				if (uniq.length > 0) {
					await showAlert('중복 경고', `${uniq.length}건이 중복되어 입력을 되돌렸습니다.`);
				}
			} else {
				// ALERT_ONCE: 알림만 한 번
				if (uniq.length > 0) {
					await showAlert('중복 경고', `동일한 항목코드/물류센터/운송사 조합이 ${uniq.length}건 중복됩니다.`);
				}
			}

			dupQueue = [];
			dupTimer = null;
		}, 0);
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		ref.gridRef.current.bind('cellEditBegin', (e: any) => {
			if ((e.dataField === 'courier' || e.dataField === 'sttlItemCd') && e.item.rowStatus !== 'I') {
				return false;
			}
		});
		gridRefCur.bind('cellEditEnd', async (event: any) => {
			// const row = event.item;
			// const e = event.dataField;
			// const sttlItemCd = event.dataField === 'sttlItemCd' ? event.value : row.sttlItemCd;
			// const dcCode = event.dataField === 'dcCode' ? event.value : row.dcCode;
			// const courier = event.dataField === 'courier' ? event.value : row.courier;
			// if (e === 'sttlItemCd' || e === 'dcCode' || e === courier) {
			// 	// return false;

			// 	// //console.log((row);
			// 	// 현재 편집된 셀(행)을 제외하고 PK 중복 있는지 체크
			// 	const allRows = gridRefCur.getGridData();
			// 	//console.log((allRows);
			// 	const isDuplicate = allRows.some(
			// 		(r, idx) =>
			// 			idx !== event.rowIndex && r.sttlItemCd === sttlItemCd && r.dcCode === dcCode && r.courier === courier,
			// 	);

			// 	if (isDuplicate) {
			// 		await showAlert('중복 경고', '동일한 항목코드와 물류센터 조합이 이미 존재합니다.');
			// 		// 원복 처리
			// 		if (typeof event.revert === 'function') {
			// 			// event.revert(); // v3 이상에서 지원
			// 			return;
			// 		} else {
			// 			gridRefCur.setCellValue(event.rowIndex, event.dataField, event.oldValue);
			// 			return;
			// 		}
			// 	}
			// }
			const row = event.item;
			const e = event.dataField;

			// 🔧 버그 수정: 문자열 'courier'와 비교해야 함
			if (e === 'sttlItemCd' || e === 'dcCode' || e === 'courier') {
				const sttlItemCd = e === 'sttlItemCd' ? event.value : row.sttlItemCd;
				const dcCode = e === 'dcCode' ? event.value : row.dcCode;
				const courier = e === 'courier' ? event.value : row.courier;

				// 현재 행 기준 PK
				const currentPk = `${sttlItemCd}||${dcCode}||${courier}`;

				// 전체 데이터에서 동일 PK가 현재 행 외에 존재하는지 검사
				const allRows = gridRefCur.getGridData();
				let duplicateFound = false;
				for (let idx = 0; idx < allRows.length; idx++) {
					if (idx === event.rowIndex) continue;
					if (pkOf(allRows[idx]) === currentPk) {
						duplicateFound = true;
						break;
					}
				}

				if (duplicateFound) {
					// 여기서 바로 alert/삭제/되돌리기를 하지 말고, 큐에 쌓았다가 한 번에 처리
					enqueueDup({
						rowIndex: event.rowIndex,
						dataField: event.dataField,
						oldValue: event.oldValue,
						pk: currentPk,
					});
					// 개별 이벤트에서는 더 이상의 처리(추가 alert 등) 금지
					return;
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
			// gridRefCur?.setGridData(props.data);

			gridRefCur?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);

				gridRefCur.setColumnSizeList(colSizeList);
				//console.log((props.data);
			}
		}
	}, [props.data]);

	return (
		<>
			<AGridWrap className="contain-wrap">
				<AGrid>
					<GridTopBtn gridTitle="목록" totalCnt={props.totalCnt} gridBtn={gridBtn} />
					<AUIGrid
						ref={ref.gridRef}
						name={gridId}
						columnLayout={gridCol}
						gridProps={gridProps}
						footerLayout={footerLayout}
					/>
				</AGrid>
			</AGridWrap>
			<CmSearchCarrierWrapper ref={refModal1} />
			<CmSearchWrapper ref={refModal} />
		</>
	);
});
export default TmManageEntityDetail;
