/*
 ############################################################################
 # FiledataField	: StDisuseRequestCenterDetail2.tsx
 # Description		: 재고 > 재고현황 > 재고폐기요청/처리(2/5)
 # Author			: Canal Frame
 # Since			: 25.08.04
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib

import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';
import CmCostCenterSearch from '@/components/cm/popup/CmCostCenterSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import { InputNumber, SelectBox } from '@/components/common/custom/form';
import Button from '@/components/common/custom/form/Button';
import DatePicker from '@/components/common/custom/form/Datepicker';
import ExcelFileInput from '@/components/common/ExcelFileInput';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { Form } from 'antd';
import dayjs from 'dayjs';
// Utils
// Constants
import { bindGridEvents, reasoncode1List, reasoncode1List2, reasonmsg2List } from './StDisuseRequestCenter';
// Redux
// API Call Function
import { apiPostSaveMasterList } from '@/api/st/apiStConvertCG';
import { apiPostConfirmMasterList, apiSaveCJSTO, apiSaveMasterList } from '@/api/st/apiStDisuseRequestCenter';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';

const StDisuseRequestCenterDetail2 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form, activeKeyMaster, setTotalCnt3, setGridData3, search, formRef, refs3 } = props; // Antd Form
	const [detailTotalCnt, setDetailTotalCnt] = useState(0);

	// 공통코드 조회
	const disuseCostCodes = getCommonCodeList('DISUSE_COST', '', ''); // 폐기비용 코드 목록
	const costperkg = disuseCostCodes.find(item => item.comCd === '10')?.data1 || '0'; // comCd가 '10'인 항목의 data1 조회, 없으면 기본값 '0'

	const [popupType, setPopupType] = useState('');

	// Declare react Ref(2/4)
	ref.gridRef = useRef();
	const excelInputRef = useRef(null); // 업로드 파일 Ref
	const refModalPop = useRef(null); // 그리드 팝업용 ref

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 편집 가능한 상태인지 확인하는 함수
	 * @param {any} item - 그리드 행 아이템
	 * @returns {boolean} - 편집 가능 여부
	 */
	const isDisabled = (item: any): boolean => {
		// 값이 없으면 ''가 아니고 null임
		//alert(commUtil.nvl(item.status, ''));
		if (commUtil.nvl(item?.status, '00') == '00' || item?.status == '0') {
			// 00:등록 상태일 때만 편집 가능
			return false;
		}
		return true;
	};

	/**
	 * 저장
	 */
	const saveMasterList = async () => {
		const gridRef = ref.gridRef.current;
		const checkedRows = gridRef.getCheckedRowItems();

		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// 변경사항 확인 (체크된 행이 있으면 변경사항이 있다고 간주)
		const isChanged = gridRef.getChangedData({ validationYn: false });
		const gridData = gridRef.getGridData();
		const hasModifiedRows = gridData.some((row: any) => row.rowStatus === 'U' || row.rowStatus === 'I');

		if ((!isChanged || isChanged.length < 1) && !hasModifiedRows) {
			showAlert(null, t('msg.noChange')); // 변경사항이 없습니다.
			return;
		}

		// 입력 값 검증 - 그리드

		// validation
		if (checkedRows.length > 0 && !gridRef.validateRequiredGridData()) {
			return;
		}

		// 조정수량 양수 체크
		for (let i = 0; i < checkedRows.length; i++) {
			const row = checkedRows[i].item;
			const rowIndex = checkedRows[i].rowIndex;
			const adjustqty = Number(row.adjustqty) || 0;

			if (adjustqty <= 0) {
				showAlert(null, `${rowIndex + 1}번째 행의 ` + t('msg.MSG_COM_VAL_217', [t('lbl.ADJUSTQTY')])); // 양수로 입력하세요.[{{0}}]
				gridRef.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField('adjustqty'));
				return;
			}
		}

		for (let i = 0; i < checkedRows.length; i++) {
			const row = checkedRows[i].item; // row items
			const rowIndex = checkedRows[i].rowIndex; // 원래 Row번호

			const loc = (row.toLoc || '').toUpperCase();
			const qty = Number(row.toOrderqty) || 0;
			const posbqty = Number(row.posbqty) || 0;

			// 로케이션 대문자 처리
			row.toLoc = loc;

			if (posbqty < qty) {
				showAlert(null, `${rowIndex + 1}번째 행의 이동수량이 이동가능 수량을 초과합니다.`);
				ref.gridRef.current.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField('toOrderqty'));
				return;
			}

			//
		}

		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			saveMasterListImp('1', checkedRows);
		});
	};

	/**
	 * 저장 구현
	 * @param flag
	 * @param checkedRows
	 */
	const saveMasterListImp = (flag: any, checkedRows: any[]) => {
		const params = {
			avc_COMMAND: 'SAVE_DISUSE_REQUEST',
			requestMm: form.getFieldValue('requestMm').format('YYYYMM') ?? '', // 요청월
			disuseDiv: form.getFieldValue('disuseDiv') ?? '', // 폐기구분
			saveList: checkedRows.map((item: any) => ({
				...item.item,
				rowStatus: 'U', // 저장 시 변경됨 상태로 전송
			})),
		};

		return apiSaveMasterList(params).then(res => {
			if (res.statusCode > -1) {
				if (flag == '1') {
					// flag 1: 저장 후 확정
					showAlert(null, t('msg.save1')); // 저장되었습니다
					props.search();
				}
				return res; // 성공한 결과 반환
			}
			throw new Error('Save failed'); // 실패 시 에러 발생
		});
	};

	/**
	 * 확정
	 */
	const saveConfirmList = async () => {
		const gridRef = ref.gridRef.current;
		const checkedRows = gridRef.getCheckedRowItems();

		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// 변경사항 확인 (체크된 행이 있으면 변경사항이 있다고 간주) - 확정은 체크안함
		// const isChanged = gridRef.getChangedData({ validationYn: false });
		// const gridData = gridRef.getGridData();
		// const hasModifiedRows = gridData.some((row: any) => row.rowStatus === 'U' || row.rowStatus === 'I');

		// if ((!isChanged || isChanged.length < 1) && !hasModifiedRows) {
		// 	showAlert(null, t('msg.noChange')); // 변경사항이 없습니다.
		// 	return;
		// }

		// 입력 값 검증 - 그리드

		// validation
		if (checkedRows.length > 0 && !gridRef.validateRequiredGridData()) {
			return;
		}
		// 1. 유효성 검사: 모든 행이 확정 가능한지 확인합니다.
		// checkedRows 배열의 첫 번째 요소를 기준으로 나머지 모든 요소가 동일한 속성 값을 갖는지 검사
		const { disuseMethodCd } = checkedRows[0];
		const isConfirmable = checkedRows.every((row: any) => row.disuseMethodCd === disuseMethodCd);
		if (!isConfirmable) {
			showAlert(null, '같은 처리방안으로 조회해야 합니다.');
			return;
		}

		// 조정수량 양수 체크
		for (let i = 0; i < checkedRows.length; i++) {
			const row = checkedRows[i].item;
			const rowIndex = checkedRows[i].rowIndex;
			const adjustqty = Number(row.adjustqty) || 0;

			if (adjustqty <= 0) {
				showAlert(null, `${rowIndex + 1}번째 행의 ` + t('msg.MSG_COM_VAL_217', [t('lbl.ADJUSTQTY')])); // 양수로 입력하세요.[{{0}}]
				gridRef.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField('adjustqty'));
				return;
			}
		}

		for (let i = 0; i < checkedRows.length; i++) {
			const row = checkedRows[i].item; // row items
			const rowIndex = checkedRows[i].rowIndex; // 원래 Row번호

			const loc = (row.toLoc || '').toUpperCase();
			const qty = Number(row.toOrderqty) || 0;
			const posbqty = Number(row.posbqty) || 0;

			// 로케이션 대문자 처리
			row.toLoc = loc;

			if (posbqty < qty) {
				showAlert(null, `${rowIndex + 1}번째 행의 이동수량이 이동가능 수량을 초과합니다.`);
				ref.gridRef.current.setSelectionByIndex(rowIndex, gridRef.getColumnIndexByDataField('toOrderqty'));
				return;
			}

			//
		}

		// 확정하시겠습니까?
		showConfirm(null, t('msg.MSG_COM_CFM_022'), () => {
			// 저장먼저 하고 확정처리
			saveMasterListImp('2', checkedRows)
				.then(() => {
					const { disuseMethodCd } = checkedRows[0].item;
					if (disuseMethodCd === '40') {
						// 협력사반품, 이월
						showAlert(null, t('msg.save1')); // 저장되었습니다
						props.search();
						return;
					} else if (disuseMethodCd === '10') {
						// 폐기
						// 저장 성공 후 확정 처리
						const params = {
							avc_COMMAND: 'APPROVALREQ_DU', // 처리구분(재고폐기요청:APPROVALREQ_DU)
							docdt: formRef.getFieldValue('apprreqdt').format('YYYYMMDD'), // 배치 파라미터 추가
							ifSendType: 'WMSAJ',
							workprocesscode: 'WMSAJ',
							omsFlag: 'Y',
							stocktranstype: formRef.getFieldValue('movementtype') ?? '', // 이동유형
							requestMm: form.getFieldValue('requestMm').format('YYYYMM') ?? '', // 요청월
							callFrom: '1', // 호출구분(1:재고폐기요청)
							saveList: checkedRows.map((item: any) => ({
								...item.item,
								rowStatus: 'U', // 저장 시 변경됨 상태로 전송
							})),
						};

						apiPostConfirmMasterList(params).then(res => {
							if (res.statusCode > -1) {
								//showAlert(null, t('msg.save1')); // 저장되었습니다

								/*START.요청처리결과 */
								if (props.activeKeyMaster) {
									props.setActiveKeyMaster('3'); // 3번째 탭으로 이동 -> tab을 활성화해야 지 컴퍼넌트가 렌더링 됨
								}

								const gridRef3 = props.refs3.gridRef.current;
								gridRef3?.clearGridData(); // 처리결과 그리드

								if (!res.data.resultList || res.data.resultList.length <= 0) {
									showAlert(null, t('msg.MSG_COM_ERR_007')); // 데이터가 없습니다.
								} else {
									props.setGridData3(res.data.resultList);
									props.setTotalCnt3(res.data.resultList.length);

									if (res.data.resultList.length > 0) {
										const colSizeList = gridRef3.getFitColumnSizeList(true);
										gridRef3.setColumnSizeList(colSizeList);
									}

									// 처리 결과 집계
									let nSucc = 0;
									let nFail = 0;

									for (let i = 0; i < res.data.resultList.length; i++) {
										if (res.data.resultList[i].processflag === 'Y') {
											nSucc++;
										} else {
											nFail++;
										}
									}
									// 처리 결과 메시지 표시
									showAlert(null, `성공 : ${nSucc}건 실패 : ${nFail}건 처리되었습니다. 결과탭으로 이동합니다.`);
								}

								if (props.activeKeyMaster) {
									props.setActiveKeyMaster('3'); // 3번째 탭으로 이동
								}
								/*END.요청처리결과 */
							}
						});
					} else if (disuseMethodCd === '20') {
						// 협력사반품중 타센터재고인경우(타센터 아닌경우 스킵)
						const targetList: any[] = [];
						for (const row of checkedRows) {
							if (!commUtil.isEmpty(row.item.stoDccode)) {
								targetList.push({
									fromStorerkey: row.item.storerkey,
									fromDccode: row.item.dccode,
									fromOrganize: row.item.organize,
									fromArea: '1000',
									fromSku: row.item.sku,
									fromUom: row.item.uom,
									fromStockgrade: row.item.stockgrade,
									fromStockid: row.item.stockid ?? null,
									fromLoc: row.item.loc,
									fromLot: row.item.lot,
									toOrderqty: row.item.adjustqty,
									toDccode: row.item.stoDccode,
									toStorerkey: row.item.storerkey,
									// toOrganize: row.organize ?? v.todcname,
									toOrganize: row.item.stoDccode,
									toArea: '1000',
									toSku: row.item.sku,
									toUom: row.item.uom,
									toStockgrade: row.item.stockgrade,
									toStockid: row.item.stockid ?? null,
									toLoc: row.item.loc,
									toLot: row.item.lot,
								});
							}
						}

						const body = {
							avc_COMMAND: 'CONFIRM',
							stotype: 'RSTO',
							deliverydate: dayjs().format('YYYYMMDD'),
							saveSTOList: targetList,
						};

						return apiSaveCJSTO(body).then(res => {
							if (res.statusCode > -1) {
								showAlert(null, t('msg.save1')); // 저장되었습니다
								props.search();
								return res; // 성공한 결과 반환
							}
							throw new Error('Save failed'); // 실패 시 에러 발생
						});
					} else if (disuseMethodCd === '30') {
						// 재사용/삭제
						const targetList: any[] = [];
						for (const row of checkedRows) {
							targetList.push({
								organize: row.item.organize,
								area: '1000',
								fromloc: row.item.loc,
								sku: row.item.sku,
								uom: row.item.uom,
								fromlot: row.item.lot,
								fromstockid: row.item.stockid ?? null,
								fromstockgrade: row.item.stockgrade,
								fromstocktype: row.item.stocktype,
								tranqty: row.item.adjustqty,
								lottable01: row.item.lottable01,
								tostockgrade: 'STD', //가용(공통코드:STOCKGRADE)
								reasoncode: '1000',
								reasonmsg: '1000',
							});
						}
						const params = {
							avc_COMMAND: 'CONFIRM',
							saveList: targetList, // 선택된 행의 데이터
						};

						apiPostSaveMasterList(params).then(() => {
							showAlert(null, t('msg.save1')); // 저장되었습니다
							props.search();
						});
					} else if (disuseMethodCd === '50') {
						// 제당반품(STO)

						// 소비기한 종료 여부 우선 체크
						const hasExpiredItem = checkedRows.some((row: any) => row.item.usebydatefreert == 0);
						if (hasExpiredItem) {
							showAlert(null, '소비기한이 종료되어 처리할 수 없습니다.');
							return;
						}

						const targetList: any[] = [];
						for (const row of checkedRows) {
							targetList.push({
								fromStorerkey: row.item.storerkey,
								fromDccode: row.item.dccode,
								fromOrganize: row.item.organize,
								fromArea: '1000',
								fromSku: row.item.sku,
								fromUom: row.item.uom,
								fromStockgrade: row.item.stockgrade,
								fromStockid: row.item.stockid ?? null,
								fromLoc: row.item.loc,
								fromLot: row.item.lot,
								toOrderqty: row.item.adjustqty,
								toDccode: '1000-1050',
								toStorerkey: row.item.storerkey,
								// toOrganize: row.organize ?? v.todcname,
								toOrganize: '1000-1050',
								toArea: '1000',
								toSku: row.item.sku,
								toUom: row.item.uom,
								toStockgrade: row.item.stockgrade,
								toStockid: row.item.stockid ?? null,
								toLoc: row.item.loc,
								toLot: row.item.lot,
							});
						}

						const body = {
							avc_COMMAND: 'CONFIRM',
							stotype: 'RSTO',
							deliverydate: dayjs().format('YYYYMMDD'),
							saveSTOList: targetList,
						};

						return apiSaveCJSTO(body).then(res => {
							if (res.statusCode > -1) {
								showAlert(null, t('msg.save1')); // 저장되었습니다
								props.search();
								return res; // 성공한 결과 반환
							}
							throw new Error('Save failed'); // 실패 시 에러 발생
						});
					}
				})
				.catch(error => {
					// 저장 실패 시 처리

					showAlert(null, '저장에 실패했습니다.');
				});
		});
	};

	/**
	 * 엑셀 업로드
	 */
	const excelUpload = () => {
		excelInputRef.current?.click();
	};

	/**
	 * 드롭다운 코드 변환 함수
	 * @param {string} value - 변환할 값
	 * @param {string} codeList - 코드 리스트명
	 * @returns {string} 변환된 코드
	 */
	const convertDropdownValue = (value: string, codeList: string): string => {
		if (!value) return '';

		const codes = getCommonCodeList(codeList);
		const found = codes.find(item => item.cdNm === value || item.cdNm === value);
		return found ? found.comCd : '';
	};

	/**
	 * =====================================================================
	 * 엑셀 파일 업로드 및 그리드 데이터 생성 함수
	 * - 엑셀 데이터를 그리드 형식으로 변환하여 로딩
	 * - 드롭다운 값들은 한글명에서 코드값으로 자동 변환
	 * - 업로드된 데이터는 자동으로 체크박스 선택 및 수정 상태로 설정
	 * @param {any} data - ExcelFileInput에서 파싱된 엑셀 데이터 배열
	 * =====================================================================
	 */
	const onDataExcel = (data: any) => {
		const gridRef = ref.gridRef.current;

		// 기존 그리드 데이터 초기화 및 체크박스 인덱스 배열 준비
		gridRef.clearGridData();
		const checkedIndexes: number[] = [];

		// 엑셀 데이터 존재 여부 확인
		if (data === undefined || data.length < 1) {
			showAlert(null, '업로드 파일에 입력 정보가 없습니다.');
			return;
		}

		// 그리드 컬럼 메타데이터 추출 - 엑셀 컬럼과 그리드 컬럼 매핑용
		const dataFieldsWithMeta = gridRef
			.getColumnInfoList()
			.map((col: any, index: number) => ({
				index,
				dataField: col.dataField,
				visible: col.visible !== false, // 숨김 컬럼 여부 확인
			}))
			.filter((col: { dataField: any }) => !!col.dataField); // dataField가 있는 컬럼만 필터링

		// 엑셀 원본 데이터를 그리드 데이터 형식으로 변환
		const excelGridData = data.map((excelRow: any, rowIndex: number) => {
			const newRow: any = {};
			let excelIndex = 0; // excelRow[0] 은 순번이라서 제외

			// 엑셀 데이터와 그리드 컬럼 매칭
			dataFieldsWithMeta.forEach(({ dataField, visible }: { dataField: string; visible: boolean }) => {
				if (dataField === 'adjustqty') {
					// 조정수량 처리
					const qtyValue = Number(excelRow[excelIndex]) || 0;

					newRow[dataField] = excelRow[excelIndex];
				} else if (dataField === 'disusetype') {
					newRow[dataField] = convertDropdownValue(excelRow[excelIndex], 'DISUSETYPE'); // 명으로 코드를 가져와서 세팅 -> 폐기유형
				} else if (dataField === 'reasoncode') {
					newRow[dataField] = convertDropdownValue(excelRow[excelIndex], 'REASONCODE_DISUSE'); // 명으로 코드를 가져와서 세팅 -> 사유코드
				} else if (dataField === 'reasoncode1') {
					newRow[dataField] = reasoncode1List.find(item => item.cdNm === excelRow[excelIndex])?.comCd || ''; // 명으로 코드를 가져와서 세팅 -> 사유코드
				} else if (dataField === 'toRespPartyCd') {
					newRow[dataField] = convertDropdownValue(excelRow[excelIndex], 'OTHER01_DMD'); // 명으로 코드를 가져와서 세팅 -> 귀책(최종)
				} else if (dataField === 'logiRespDistbCd') {
					const logiRespDistbCd = convertDropdownValue(excelRow[excelIndex], 'CENTER_RESP'); // 명으로 코드를 가져와서 세팅 -> 물류귀책배부
					newRow[dataField] = logiRespDistbCd;

					// 물류귀책배부 설정 시 코드명의 왼쪽 1자리가 'Y'이면 귀책을 물류(12)로 자동 설정
					if (logiRespDistbCd) {
						const centerRespCodes = getCommonCodeList('CENTER_RESP');
						const selectedCode = centerRespCodes.find(code => code.comCd === logiRespDistbCd);
						const codeName = selectedCode ? selectedCode.cdNm : '';

						if (codeName.charAt(0) === 'Y') {
							newRow['toRespPartyCd'] = '12'; // 물류 코드값 자동 설정
						}
					}
				} else if (dataField === 'reasonmsg2') {
					newRow[dataField] = reasonmsg2List.find(item => item.cdNm === excelRow[excelIndex])?.comCd || ''; // 명으로 코드를 가져와서 세팅 -> 변경사유(세부)
				} else if (dataField === 'disuseMethodCd') {
					newRow[dataField] = convertDropdownValue(excelRow[excelIndex], 'DISUSE_METHOD_CD'); // 명으로 코드를 가져와서 세팅 -> 처리방안
				} else {
					newRow[dataField] = excelRow[excelIndex];
				}

				excelIndex++;
			});

			// 체크 조건: 필수값이 있거나 데이터가 있으면 체크
			const requiredFields = ['dccode', 'loc', 'sku'];
			const hasRequiredData = requiredFields.some(field => newRow[field] && newRow[field] !== '');
			const hasAnyData = Object.values(newRow).some(value => value !== null && value !== undefined && value !== '');

			// 필수값이 있거나, 데이터가 null이더라도 체크 (length가 1이어도)
			if (hasRequiredData || hasAnyData || checkedIndexes.length < 1) {
				checkedIndexes.push(rowIndex);
			} else {
				newRow.errorYn = 'Y';
			}

			// 강제로 수정된 상태로 설정
			newRow.rowStatus = 'U'; // U = Updated (수정됨)

			return newRow;
		});

		// 그리드 데이터 설정 (변경사항 추적을 위해 각 행을 개별적으로 처리)
		gridRef.clearGridData();
		gridRef.setGridData(excelGridData);
		setDetailTotalCnt(excelGridData.length);

		// 엑셀 업로드 후 모든 행을 변경된 상태로 마킹
		setTimeout(() => {
			const allData = gridRef.getGridData();
			const markedData = allData.map((row: any) => ({
				...row,
				requestMm: form.getFieldValue('requestMm').format('YYYYMM') ?? '', // 요청월
				crudFlag: 'U',
				rowStatus: 'U', // 수정됨 상태로 강제 설정
			}));
			gridRef.updateRowsById(markedData, true); // isMarkEdited: true로 변경 상태 추적
		}, 100);

		// 체크박스 설정 및 이벤트 바인딩 (데이터 로드 후 처리)
		setTimeout(() => {
			try {
				// 전체 선택으로 처리 (데이터가 업로드되면 모든 행 체크)
				if (typeof gridRef.setAllCheckedRows === 'function') {
					gridRef.setAllCheckedRows(true);
				} else if (typeof gridRef.selectAll === 'function') {
					gridRef.selectAll();
				}

				// 그리드 이벤트 바인딩 적용
				bindGridEvents(ref, t, costperkg);
			} catch (error) {}
		}, 200);
	};

	/**
	 * 팝업조회
	 * @param selectedRow
	 * @returns {void}
	 */
	const confirmPopup = (selectedRow: any) => {
		const gridRef = ref.gridRef.current;

		setTimeout(() => {
			if (popupType === 'costCenter') {
				gridRef.setCellValue(gridRef.getSelectedIndex()[0], 'toRespDeptCd', selectedRow[0].code);
				gridRef.setCellValue(gridRef.getSelectedIndex()[0], 'toRespDeptNm', selectedRow[0].name);
			}
			refModalPop.current.handlerClose();
		}, 0);
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		refModalPop.current.handlerClose();
	};

	/**
	 * =====================================================================
	 * 선택적용 버튼 클릭 이벤트 처리 함수
	 * - 폼의 입력값들을 체크된 그리드 행들에 일괄 적용
	 * - 조정수량, 폐기유형, 발생사유, 귀책, 귀속부서, 거래처 등 적용
	 * =====================================================================
	 */
	const handleSelectApply = () => {
		const gridRef = ref.gridRef.current;
		const checkedItems = gridRef?.getCheckedRowItems();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// 필수값 체크
		// const taskdt = formRef?.getFieldValue('taskdt')?.format('YYYYMMDD') ?? ''; // 조정일자
		// const reasoncode = formRef.getFieldValue('reasoncode') ?? ''; // 발생사유
		// const processmain = formRef.getFieldValue('processmain') ?? ''; // 물류귀책배부

		// if (taskdt.trim().length < 1) {
		// 	showAlert('', t('msg.selectPlease1', [t('lbl.TASKDT_AJ')])); // {조정일자}을/를 선택해주세요
		// 	const input = document.querySelector('input[name="taskdt"]') as HTMLInputElement;
		// 	input?.focus();
		// 	return;
		// }

		// 성능 개선: cell단위 변경 대신 전체 데이터를 한번에 변경(1/2)

		const allData = gridRef.getGridData();
		// setGridData() 호출 시 체크가 해제되므로, 이전에 체크된 행들의 ID를 저장해 둡니다.
		const rowIdField = gridRef.getProp('rowIdField') || '_$uid';

		const checkedRowIds = checkedItems.map((item: any) => item.item[rowIdField]);

		const checkedRowIndexes = new Set(checkedItems.map((item: any) => item.rowIndex));

		// 폼 필드 값들 가져오기 (JavaScript 로직 적용)
		const adjustqty = formRef.getFieldValue('adjustqty') ?? ''; // 처리수량
		const disusetype = formRef.getFieldValue('disusetype') ?? ''; // 폐기유형
		const reasoncode = formRef.getFieldValue('reasoncode') ?? ''; // 발생사유
		const reasoncode1 = formRef.getFieldValue('reasoncode1') ?? ''; // 발생사유

		// 조정수량 양수 검증 (폼에서 입력된 값이 있을 경우)
		if (adjustqty && Number(adjustqty) <= 0) {
			showAlert(null, t('msg.MSG_COM_VAL_217', [t('lbl.ADJUSTQTY')]));
			return;
		}

		const costcd = formRef.getFieldValue('costcd') ?? ''; // 귀속부서코드
		const costcdname = formRef.getFieldValue('costcdname') ?? ''; // 귀속부서명

		const chgCustkey = formRef.getFieldValue('chgCustkey') ?? ''; // 거래처코드
		const chgCustname = formRef.getFieldValue('chgCustname') ?? ''; // 거래처명

		const toRespPartyCd = formRef.getFieldValue('other01') ?? ''; // 귀책
		const logiRespDistbCd = formRef.getFieldValue('other05') ?? ''; // 물류귀책배부
		const disuseMethodCd = formRef.getFieldValue('disuseMethodCd') ?? ''; // 처리방안

		const newData = allData.map((row: any, index: number) => {
			if (checkedRowIndexes.has(index)) {
				//alert('체크된 행 처리 중: ' + index);
				const updatedRow: any = {};

				// JavaScript 조건부 로직 적용 - 값이 있을 때만 설정
				if (adjustqty) updatedRow.adjustqty = adjustqty;
				if (disusetype) updatedRow.disusetype = disusetype;
				if (reasoncode) updatedRow.reasoncode = reasoncode;
				if (reasoncode1) updatedRow.reasoncode1 = reasoncode1;

				if (toRespPartyCd) updatedRow.toRespPartyCd = toRespPartyCd;
				if (logiRespDistbCd) updatedRow.logiRespDistbCd = logiRespDistbCd;
				if (disuseMethodCd) updatedRow.disuseMethodCd = disuseMethodCd;

				if (costcd) updatedRow.toRespDeptCd = costcd;
				if (costcdname) updatedRow.toRespDeptNm = costcdname;

				if (chgCustkey) updatedRow.chgCustkey = chgCustkey;
				if (chgCustname) updatedRow.chgCustname = chgCustname;

				return { ...row, ...updatedRow, rowStatus: 'I' };
			} else {
				return row;
			}
		});

		// setGridData 대신 updateRowsById 사용햐여 변경된 행만 업데이트
		if (newData.length > 0) {
			gridRef.updateRowsById(newData, true); // isMarkEdited: true
		}
		// 이전에 체크된 행들을 다시 체크합니다.
		gridRef.setCheckedRowsByIds(checkedRowIds);

		// 		...item,
		// 		// JavaScript 조건부 로직 적용 - 값이 있을 때만 설정
		// 		...(adjustqty && { adjustqty }),
		// 		...(disusetype && { disusetype }),
		// 		...(reasoncode && { reasoncode }),
		// 		...(toRespPartyCd && { toRespPartyCd }),
		// 		...(logiRespDistbCd && { logiRespDistbCd }),
		// 		...(costcd && { toRespDeptCd: costcd }),
		// 		...(costcdname && { toRespDeptNm: costcdname }),
		// 		...(chgCustkey && { chgCustkey }),
		// 		...(chgCustname && { chgCustname }),
		// 		rowStatus: 'I',
		// 	})),
		// );
	};
	// =====================================================================
	// 그리드 설정 및 컬럼 정의
	// =====================================================================

	/**
	 * AUIGrid 컬럼 레이아웃 정의
	 * - 재고 폐기 요청/처리를 위한 필수 컬럼들 구성
	 * - 편집 가능 컬럼: 조정수량, 폐기유형, 발생사유(대분류), 귀책(최종) 등
	 * - 자동 계산 컬럼: 총중량, 폐기비용
	 * - 드롭다운 컬럼: 각종 코드성 필드들
	 */
	const gridCol = [
		{ dataField: 'serialkey', headerText: t('lbl.SERIALKEY'), width: 80, dataType: 'name', editable: false }, // 일련번호
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), width: 80, dataType: 'code', editable: false }, // 물류센터
		{ dataField: 'organize', headerText: t('lbl.ORGANIZE'), width: 80, dataType: 'code', editable: false }, // 창고
		{
			headerText: t('lbl.STOCKTYPE'), // 재고유형
			children: [
				{
					dataField: 'stocktype',
					headerText: t('lbl.CODE'), // 코드
					width: 80,
					dataType: 'code',
					editable: false,
					disableMoving: true,
				}, // 재고유형코드
				{
					dataField: 'stocktypenm',
					headerText: t('lbl.NAME'), // 명칭
					width: 80,
					dataType: 'name',
					editable: false,
					disableMoving: true,
				}, // 재고유형명
			],
		},
		{
			headerText: t('lbl.STOCKGRADE'), // 재고등급
			children: [
				{
					dataField: 'stockgrade',
					headerText: t('lbl.CODE'), // 코드
					width: 80,
					dataType: 'code',
					editable: false,
					disableMoving: true,
				}, // 재고등급코드
				{
					dataField: 'stockgradename',
					headerText: t('lbl.NAME'), // 명칭
					width: 80,
					dataType: 'name',
					editable: false,
					disableMoving: true,
				}, // 재고등급명
			],
		},
		{ dataField: 'zone', headerText: t('lbl.ZONE'), width: 80, dataType: 'code', editable: false }, // 존
		{ dataField: 'loc', headerText: t('lbl.LOC_ST'), width: 80, dataType: 'code', editable: false }, // 로케이션
		{
			headerText: t('lbl.SKUINFO'), // 상품정보
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'), // 상품코드
					width: 80,
					editable: false,
					filter: { showIcon: true },
					dataType: 'code',
					disableMoving: true,
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.gridRef.current.openPopup(e.item, 'sku');
						},
					},
				},
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'), // 상품명
					width: 120,
					editable: false,
					dataType: 'name',
					filter: { showIcon: true },
					disableMoving: true,
				},
			],
		},
		{ dataField: 'seq', headerText: t('lbl.SEQ'), width: 80, dataType: 'code', editable: false }, // SEQ
		{
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'), // 저장유형
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const codeMap = getCommonCodeList('STORAGETYPE_ZONE', '', '');
				const found = codeMap.find(item => item.comCd === value);
				return found ? found.cdNm : value;
			},
		},
		{ dataField: 'uom', headerText: t('lbl.UOM_ST'), width: 80, dataType: 'code', editable: false }, // 단위
		{
			dataField: 'avgweight',
			headerText: t('lbl.AVGWEIGHT') + '(A)', //평균중량
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.##',
		},
		{ dataField: 'qty', headerText: t('lbl.QTY_ST'), width: 80, dataType: 'numeric', editable: false }, // 수량
		{ dataField: 'openqty', headerText: t('lbl.OPENQTY_ST'), width: 80, dataType: 'numeric', editable: false }, // 가용수량
		{
			dataField: 'qtyallocated',
			headerText: t('lbl.QTYALLOCATED_ST'),
			width: 80,
			dataType: 'numeric',
			editable: false,
		}, // 할당수량
		{ dataField: 'qtypicked', headerText: t('lbl.QTYPICKED_ST'), width: 80, dataType: 'numeric', editable: false }, // 피킹수량
		{
			dataField: 'adjustqty',
			headerText: t('lbl.ADJUSTQTY') + '(B)', // 조정수량
			width: 80,
			dataType: 'numeric',
			editable: true,
			required: true,
			editRenderer: {
				type: 'InputEditRenderer',
				showEditorBtnOver: false,
				onlyNumeric: true,
				allowPoint: true,
				allowNegative: true,
				textAlign: 'right',
				maxlength: 10,
				autoThousandSeparator: true,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},

		{
			dataField: 'grossweight',
			headerText: t('lbl.WEIGHT_TOT') + '<BR>C=(A*B)', // 총중량 (tranqty*avgweight)
			width: 80,
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0.##',
		},
		{
			dataField: 'purchaseprice',
			headerText: t('lbl.UNITPRICE') + '(D)', // 단가
			editable: false,
			dataType: 'numeric',
			formatString: '#,##0',
		},
		{
			dataField: 'disuseprice',
			headerText: t('lbl.DISUSEPRICE') + '(B*D)', // 폐기금액
			width: 80,
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0',
		},

		{
			dataField: 'disusecost',
			headerText: t('lbl.DISUSECOST2') + '<BR>(C*420)', // 폐기비용
			editable: false,
			dataType: 'numeric',
			formatString: '#,##0',
		},
		{
			dataField: 'reference15',
			headerText: t('lbl.CHAINONLY'), // 체인전용
			// editRenderer: {
			// 	type: 'DropDownListRenderer',
			// 	list: getCommonCodeList('YN2'),
			// 	keyField: 'cdNm',
			// 	valueField: 'comCd',
			// },
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('YN2', value)?.cdNm;
			},
		},
		{
			dataField: 'cheiljedang_sku',
			headerText: t('lbl.CHEILJEDANG_RETURN'), // 제당반품
			// editRenderer: {
			// 	type: 'DropDownListRenderer',
			// 	list: getCommonCodeList('YN2'),
			// 	keyField: 'cdNm',
			// 	valueField: 'comCd',
			// 	editable: false,
			// },
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('YN2', value)?.cdNm;
			},
		}, // 제당반품

		{
			dataField: 'disusetype',
			headerText: t('lbl.DISUSETYPE'), // 폐기유형
			width: 150,
			dataType: 'code',
			editable: true,

			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('DISUSETYPE', ''),
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return isDisabled(item);
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},

		{
			dataField: 'reasoncode',
			headerText: '발생사유', // 발생사유
			width: 200,
			dataType: 'name',
			editable: true,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('REASONCODE_AJ'),
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return isDisabled(item);
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},

		{
			dataField: 'reasoncode1',
			headerText: '발생사유(대분류)', // 발생사유(대분류)
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				list: reasoncode1List,
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return isDisabled(item);
				},
			},
			editable: true,
			required: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},

		{
			dataField: 'logiRespDistbCd',
			headerText: t('lbl.OTHER05_DMD_AJ'), // 물류귀책배부
			dataType: 'string',
			editable: true,
			required: true,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('CENTER_RESP'),
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return isDisabled(item);
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'disuseMethodCd',
			headerText: t('lbl.ACTION_PLAN'), // 처리방안
			width: 200,
			dataType: 'name',
			editable: true,
			required: true,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('DISUSE_METHOD_CD'),
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return isDisabled(item);
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			headerText: t('귀책정보'), // 귀책정보
			children: [
				{
					dataField: 'respPartyCd',
					headerText: t('원귀책'), // 원귀책
					width: 200,
					dataType: 'name',
					required: true,
					editable: false,
					commRenderer: {
						type: 'dropDown',
						list: getCommonCodeList('OTHER01_DMD'),
						disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
							return true; // 항상 편집 불가능;
						},
					},
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						ref.gridRef.current.removeEditClass(columnIndex);
					},
				},
				{
					dataField: 'toRespPartyCd',
					headerText: t('lbl.REASONCODE2'), // 귀책
					width: 200,
					dataType: 'name',
					required: true,
					editable: true,
					commRenderer: {
						type: 'dropDown',
						list: getCommonCodeList('OTHER01_DMD'),
						disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
							return isDisabled(item);
						},
					},
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (isDisabled(item)) {
							// 편집 가능 class 삭제
							ref.gridRef.current.removeEditClass(columnIndex);
						} else {
							// 편집 가능 class 추가
							return 'isEdit';
						}
					},
				},
				{
					dataField: 'changedYn',
					headerText: '변경구분', // 변경구분
					dataType: 'code',
					editable: false,
				},
			],
		},

		{
			headerText: t('lbl.COSTCENTER'), //귀속부서
			children: [
				{
					dataField: 'respDeptNm',
					headerText: t('원귀속부서'), // 귀속부서
					width: 156,
					editable: false,
					dataType: 'name',
					align: 'left',
					autosizing: 'keep',
					disableMoving: true,
				},
				{
					dataField: 'toRespDeptCd',
					headerText: t('lbl.COSTCENTER'), // 귀속부서
					dataType: 'code',
					editable: true,
					required: true,
					disableMoving: true,
					commRenderer: {
						type: 'search',
						popupType: 'costCenter',
						searchDropdownProps: {
							dataFieldMap: {
								toRespDeptCd: 'code',
								toRespDeptNm: 'name',
							},
							callbackBeforeUpdateRow: (e: any) => {
								const selectedIndex = ref.gridRef?.current?.getSelectedIndex();
							},
						},
						onClick: function (e: any) {
							const rowIndex = e.rowIndex;
							// 편집 불가능한 상태에서는 팝업을 띄우지 않음
							if (isDisabled(e.item)) {
								return;
							}
							refModalPop.current.open({
								gridRef: ref.gridRef,
								rowIndex,
								dataFieldMap: {
									toRespDeptCd: 'code',
									toRespDeptNm: 'name',
								},
								popupType: 'costCenter',
							});
						},
					},
					//
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (isDisabled(item)) {
							// 편집 가능 class 삭제
							ref.gridRef.current.removeEditClass(columnIndex);
						} else {
							// 편집 가능 class 추가
							return 'isEdit';
						}
					},
				},
				{
					dataField: 'toRespDeptNm',
					headerText: t('lbl.COSTCENTERNAME'), //귀속부서명
					dataType: 'string',
					editable: false,
					disableMoving: true,
				},
			],
		},

		{
			headerText: '고객(COST)', //t('lbl.CUST'), //거래처
			children: [
				{
					dataField: 'custname',
					headerText: t('원고객(COST)'), // 원고객(COST)
					width: 156,
					editable: false,
					dataType: 'name',
					align: 'left',
					autosizing: 'keep',
					disableMoving: true,
				},
				{
					dataField: 'chgCustkey',
					headerText: '고객(COST)코드', //t('lbl.CUST_CODE'), //거래처
					dataType: 'code',
					editable: true,
					required: true,
					disableMoving: true,
					commRenderer: {
						type: 'search',
						popupType: 'cust',
						searchDropdownProps: {
							dataFieldMap: {
								chgCustkey: 'code',
								chgCustname: 'name',
							},
							callbackBeforeUpdateRow: (e: any) => {
								const selectedIndex = ref.gridRef?.current?.getSelectedIndex();
							},
						},
						onClick: function (e: any) {
							const rowIndex = e.rowIndex;
							// 편집 불가능한 상태에서는 팝업을 띄우지 않음
							if (isDisabled(e.item)) {
								return;
							}
							refModalPop.current.open({
								gridRef: ref.gridRef,
								rowIndex,
								dataFieldMap: {
									chgCustkey: 'code',
									chgCustname: 'name',
								},
								popupType: 'cust',
							});
						},
					},
					//
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (isDisabled(item)) {
							// 편집 가능 class 삭제
							ref.gridRef.current.removeEditClass(columnIndex);
						} else {
							// 편집 가능 class 추가
							return 'isEdit';
						}
					},
				},
				{
					dataField: 'chgCustname',
					headerText: '고객(COST)명', //t('lbl.CUST_NAME'), //거래처명
					dataType: 'string',
					editable: false,
					disableMoving: true,
				},
			],
		},
		{
			headerText: t('lbl.CUSTINFO_PARTNER'), //협력사정보
			children: [
				{
					dataField: 'fromCustkey',
					headerText: t('lbl.VENDOR'), //협력사코드
					dataType: 'code',
					editable: false,
					disableMoving: true,
				},
				{
					dataField: 'fromCustname',
					headerText: t('lbl.VENDORNAME'), //협력사명
					editable: false,
					disableMoving: true,
				},
			],
		},
		// {
		// 	dataField: 'reasonmsg1',
		// 	headerText: '변경사유', // 변경사유
		// 	dataType: 'string',
		// 	editable: true,
		// },
		// {
		// 	dataField: 'reasonmsg2',
		// 	headerText: '변경사유(세부)', // 변경사유-세부사유
		// 	dataType: 'code',
		// 	editable: true,
		// 	required: true,
		// 	renderer: {
		// 		type: 'DropDownListRenderer',
		// 		list: reasonmsg2List,
		// 		keyField: 'comCd',
		// 		valueField: 'cdNm',
		// 	},
		// },
		{
			dataField: 'rmk',
			headerText: t('lbl.REMARK'), // 비고
			dataType: 'name',
			width: 300,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'stockRealYn',
			headerText: t('lbl.PACKINGMETHOD'), // 실물여부
			dataType: 'code',
			editable: true,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('YN2'),
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					return isDisabled(item);
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (isDisabled(item)) {
					// 편집 가능 class 삭제
					ref.gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'returnno',
			headerText: '반품번호', // 반품번호
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'returncarno',
			headerText: t('lbl.RETURNCARNO'), // 반품차량번호
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'stockid',
			headerText: t('lbl.STOCKID') /*개체식별/소비이력*/,
			dataType: 'sting',
			editable: false,
			width: 200,
		},
		{
			dataField: 'LOT',
			headerText: t('lbl.LOT') /*LOT*/,
			dataType: 'string',
			editable: false,
			width: 200,
		},
		{
			dataField: 'neardurationyn',
			headerText: t('lbl.NEARDURATIONYN'), // 유통기한임박여부
			width: 80,
			editable: false,
			dataType: 'code',
			align: 'center',
		},
		//
		// START.제조일자/소비일자/유효기간/소비기한잔여(%)
		{
			headerText: t('lbl.MANUFACTUREDT'),
			dataField: 'manufacturedt',
			dataType: 'code',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		}, // 제조일자
		{
			headerText: t('lbl.EXPIREDT'),
			dataField: 'expiredt',
			dataType: 'code',
			editable: false,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		}, // 소비일자
		{
			headerText: t('lbl.DURATION_TERM'),
			dataField: 'durationTerm',
			dataType: 'code',
			editable: false,
			formatString: 'yyyy-mm-dd',
			width: 150,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		}, // 유효기간-소비기간(잔여/전체)
		{
			headerText: t('lbl.USEBYDATE_FREE_RT'),
			dataField: 'usebydatefreert',
			dataType: 'numeric',
			editable: false,
			filter: { showIcon: true },
			formatString: '#,##0',
		}, // 소비기한잔여(%)
		// END.제조일자/소비일자/유효기간/소비기한잔여(%)
		//
		{
			headerText: t('lbl.SERIALNO_SKU'),
			/*이력번호*/ dataField: 'serialno',
			dataType: 'string',
			editable: false,
			width: 200,
		},
		{
			headerText: t('lbl.BARCODE'),
			/*바코드*/ dataField: 'barcode',
			dataType: 'string',
			editable: false,
			width: 200,
		},
		{
			dataField: 'statusnm',
			headerText: '상태', // 상태
			dataType: 'string',
			editable: false,
		},

		/*START.hidden 컬럼*/
		{ dataField: 'status', editable: false, visible: false }, // 상태
		{ dataField: 'lottable01', editable: false, visible: false }, // 소비기한/제조일자
		{ dataField: 'stoDccode', editable: false, visible: false }, // 협력사반품에서 타센터코드
		/*END.hidden 컬럼*/

		//
		//
		//
		//
	];

	// 그리드 Props
	const gridProps = {
		editable: true,
		showStateColumn: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		independentAllCheckBox: false,
		fillColumnSizeMode: false,
		showFooter: true,
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (isDisabled(item)) {
				return 'aui-grid-row-disabled'; // 행 전체 비활성화 스타일
			}
			return '';
		},
		rowCheckDisabledFunction: (rowIndex: number, isChecked: boolean, item: any) => {
			return !isDisabled(item); // status > '00'이면 체크박스 비활성화
		},
	};
	// FooterLayout Props
	const footerLayout = [
		{
			labelText: t('lbl.TOTAL'), // 합계
			positionField: gridCol[0].dataField, // 첫 번째 dataField 사용
		},
		{ dataField: 'qty', positionField: 'qty', operation: 'SUM', formatString: '#,##0' },
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 엑셀업로드
				callBackFn: excelUpload,
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList,
			},
			{
				btnType: 'btn2', // 확정
				callBackFn: saveConfirmList,
				tooltip: '같은 처리방안일때 활성화됩니다',
				disabledFn: (item: any) => {
					// 같은 처리방안이 아니면 확정버튼 비활성화
					const gridData = ref.gridRef.current.getGridData();
					if (gridData.length === 0) return true;
					const disuseMethodCd = gridData[0]?.disuseMethodCd;
					const isConfirmable = gridData.every((row: any) => row.disuseMethodCd === disuseMethodCd);
					return !isConfirmable;
				},
			},
			// {
			// 	btnType: 'excelUpload', // 엑셀업로드 - 사용자버튼용
			// },
		],
	};

	/**
	 * =====================================================================
	 *  03. React Hook 이벤트 처리
	 * =====================================================================
	 */

	/**
	 * 부모 컴포넌트에서 전달받은 데이터 변경 감지 및 그리드 업데이트
	 * - props.data가 변경될 때마다 그리드에 새로운 데이터 설정
	 * - 고유 ID 부여 및 컬럼 크기 자동 조정
	 */
	useEffect(() => {
		const gridRef = ref.gridRef.current;
		if (gridRef) {
			// 성능 개선: cell단위 변경 대신 전체 데이터를 한번에 변경(2/2)
			const newRows = props.data.map((row: any, idx: any) => ({
				...row,
				uid: `ua-${idx + 1}`,
				disuseprice: row.adjustqty * Number(row.purchaseprice),
			}));

			gridRef?.setGridData(newRows);
			gridRef?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				const colSizeList = gridRef.getFitColumnSizeList(true);
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	/**
	 * 폼 초기값 설정
	 * - 결재요청일자: 현재 날짜로 설정
	 * - 이동유형: 973(폐기)로 고정
	 * - 기타 선택 필드들: 빈 값으로 초기화
	 */
	useEffect(() => {
		if (formRef) {
			formRef.setFieldValue('apprreqdt', dayjs()); // 결재요청일자를 당일로 설정
			formRef.setFieldValue('movementtype', '973'); // 폐기로 고정
			formRef.setFieldValue('disusetype', ''); // 선택으로 초기화
			formRef.setFieldValue('reasoncode', ''); // 선택으로 초기화
			formRef.setFieldValue('other01', ''); // 선택으로 초기화
			formRef.setFieldValue('other05', ''); // 선택으로 초기화
		}
	}, [formRef]);

	/**
	 * 컴포넌트 마운트 시 그리드 이벤트 초기화
	 * - 셀 편집 완료 이벤트 바인딩
	 */
	useEffect(() => {
		// 그리드 이벤트 바인딩
		// bindGridEvents();
		bindGridEvents(ref, t, costperkg);
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				{/* 폐기목록 */}
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt}>
					<Button size={'small'} style={{ marginRight: 0 }} onClick={() => handleSelectApply()}>
						{t('lbl.APPLY_SELECT')} {/* 선택적용 */}
					</Button>
				</GridTopBtn>

				<UiDetailViewArea>
					<Form form={formRef}>
						<UiDetailViewGroup>
							<li>
								<DatePicker
									span={24}
									name="apprreqdt"
									label={t('lbl.APPROVALREQDT')} // 결재요청일자
									required
									rules={[{ required: true, validateTrigger: 'none' }]}
									defaultValue={dayjs()}
								/>
							</li>
							<li>
								<InputNumber
									name="adjustqty"
									label={t('lbl.CONFIRMQTY_AJ')} // 조정수량
									placeholder={''}
									min={0}
								/>
							</li>
							<li>
								<SelectBox
									name="disusetype"
									span={24}
									options={getCommonCodeList('DISUSETYPE', t('lbl.SELECT'), '')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									label={t('lbl.DISUSETYPE')} // 폐기유형
									defaultValue=""
								/>
							</li>
							<li>
								<SelectBox
									name="reasoncode"
									span={24}
									options={getCommonCodeList('REASONCODE_DISUSE', t('lbl.SELECT'), '')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									placeholder={t('lbl.SELECT')}
									label={t('lbl.INQUIRYREASONCODE')} // 발생사유
									defaultValue=""
								/>
							</li>
							<li>
								<SelectBox
									name="reasoncode1"
									span={24}
									options={reasoncode1List2}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									placeholder={t('lbl.SELECT')}
									label={'발생사유(대분류)'} // 발생사유(대분류)
									defaultValue=""
								/>
							</li>
							<li>
								<SelectBox
									label={t('lbl.OTHER05_DMD_AJ')} //물류귀책배부
									name="other05"
									placeholder={t('lbl.SELECT')}
									options={getCommonCodeList('CENTER_RESP', t('lbl.SELECT'), '')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									defaultValue=""
								/>
							</li>
							<li>
								<SelectBox
									name="disuseMethodCd"
									span={24}
									options={getCommonCodeList('DISUSE_METHOD_CD', t('lbl.SELECT'), '')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									placeholder={t('lbl.SELECT')}
									label={t('lbl.ACTION_PLAN')} // 처리방안
									defaultValue=""
								/>
							</li>
							<li>
								<SelectBox
									name="other01"
									span={24}
									options={getCommonCodeList('OTHER01_DMD', t('lbl.SELECT'), '')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									placeholder={t('lbl.SELECT')}
									label={t('lbl.REASONCODE2')} // 귀책
									defaultValue=""
								/>
							</li>
							<li>
								{/*귀속부서코드/명*/}
								<CmCostCenterSearch
									form={formRef}
									selectionMode="singleRow"
									name="costcdname"
									code="costcd"
									returnValueFormat="name"
								/>
							</li>
							<li>
								{/*거래처코드/명*/}
								<CmCustSearch
									form={formRef}
									selectionMode="singleRow"
									name="chgCustname"
									code="chgCustkey"
									returnValueFormat="name"
								/>
							</li>

							<li style={{ display: 'none' }}>
								<SelectBox
									name="movementtype"
									span={24}
									options={getCommonCodeList('MOVEMENTTYPE_DISUSE', t('lbl.SELECT'), '')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									label={t('lbl.MOVEMENTTYPE')} // 이동유형
									disabled={true}
									defaultValue={'973'}
								/>
							</li>
						</UiDetailViewGroup>
					</Form>
				</UiDetailViewArea>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
			{/* 엑셀 업로드 영역 정의 */}
			<ExcelFileInput ref={excelInputRef} onData={onDataExcel} startRow={3 - 1} /> {/* 헤더 2줄 제외 */}
			{/* 그리드 컬럼 팝업 영역 정의 */}
			<CmSearchWrapper ref={refModalPop} />
		</>
	);
});
export default StDisuseRequestCenterDetail2;
