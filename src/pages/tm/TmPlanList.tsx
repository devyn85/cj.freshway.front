/*
############################################################################
# Screen: TmPlanList (배차계획목록)
# 목적: 저장된 배차 계획 목록 조회 및 관리, 배차조정/확정 기능 제공
# 
# [주요 기능]
# - 배차 계획 목록 조회 (getDispatchList API)
# - 검색 조건 설정 (배송일자, 권역, 배송유형, 배차상태, 차량번호)
# - 권역 자동완성 기능 (더미 데이터 기반)
# - 배차조정 실행 (TmPlan으로 이동)
# - 배차확정 처리 (updateDispatchConfirmed API)
# - 차량번호 변경 (CmCarSearch, CmCarPopPopup 연동)
# - 귀책차량 설정 (CmCarSearch 연동)
# 
# [검색 조건]
# - DC코드: MsCenterDistrictSearchMultiSelectBox를 통한 단일 선택
# - 배송일자: Datepicker 컴포넌트, 기본값=시스템일자+1일
# - 권역: InputText + 자동완성 기능
# - 배송유형: SelectBox (WD=배송)
# - 배차상태: SelectBox (전체/가배차완료/배차확정)
# - 차량번호: CmCarSearch를 통한 다중 선택
# 
# [그리드 기능]
# - AUIGrid 기반 배차 목록 표시
# - 차량번호 더블클릭 시 차량 변경 팝업
# - 귀책차량 클릭 시 차량 검색 팝업
# - 체크박스 선택을 통한 다중 확정 처리
# - 그룹 헤더를 통한 컬럼 구조화
# 
# [API 연동]
# - getDispatchList: 배차 목록 조회
# - updateDispatchConfirmed: 배차 확정 처리
# - apiGetCmCarList: 차량 목록 조회 (CmCarSearch용)
# 
# [상태 관리]
# - Redux: setPendingAdjustParams (배차조정 조건 전달)
# - Local: 그리드 데이터, 검색 조건, 모달 상태 등
############################################################################
*/

// api
import {
	apiTmCancelDispatch,
	getDispatchList,
	saveDispatchList,
	updateDispatchConfirmed,
} from '@/api/tm/apiTmDispatch';
import { getLoadStatusSetting } from '@/api/wd/apiWdLoadPop';

// assets
import AGrid from '@/assets/styled/AGrid/AGrid';
import AGridWrap from '@/assets/styled/AGridWrap/AGridWrap';

// component
import CmCarPopSearch from '@/components/cm/popup/CmCarPopSearch';
import CmSearchCarrierWrapper from '@/components/cm/popup/CmSearchCarrierWrapper';
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import CustomModal from '@/components/common/custom/CustomModal';
import { Datepicker, InputText, SearchFormResponsive, SelectBox } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';
import TmPlanStatusLoadPopup from '@/components/tm/popup/TmPlanStatusLoadPopup';
import {
	CARNO_RESTORE_FIELDS,
	applyCarnoSelectionWithChecks as applyCarnoSelectionWithChecksUtil,
	applyPopAndCarnoSelection,
} from '@/components/tm/tmPlanList/grid';

// hooks
import { useCloseTab } from '@/hooks/useCloseTab';
import { useMoveMenu } from '@/hooks/useMoveMenu';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// store
import { getCommonCodeList, getCommonCodebyCd } from '@/store/core/comCodeStore';
import { useAppDispatch } from '@/store/core/coreHook';
import { getFindTab } from '@/store/core/tabStore';
import {
	clearPendingDispatchCriteria,
	clearTmDispatchResult,
	setPendingAdjustParams,
} from '@/store/tm/tmDispatchStore';

// util
import { showAlert, showConfirmAsync } from '@/util/MessageUtil';
import { Button, Form } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const TmPlanList = () => {
	const { t } = useTranslation();
	const { moveMenu } = useMoveMenu();
	const location = useLocation();

	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// Form / 전역 훅
	const [form] = Form.useForm();
	const dispatch = useAppDispatch();
	const { closeTab } = useCloseTab();

	// Grid 상태 / 참조
	const gridRef: any = useRef(null);
	const [gridData, setGridData] = useState<any[]>([]);
	const [totalCnt, setTotalCnt] = useState<number>(0);
	const clipboardPasteInProgressRef = useRef(false);
	const multiCarnoPasteBlockedRef = useRef(false);
	const carnoRestoreFields = CARNO_RESTORE_FIELDS;

	// 차량 관련 팝업
	const refModalPop = useRef(null); // 차량번호 팝업
	const refReasonModalPop = useRef(null); // 귀책차량 팝업
	const [popupType, setPopupType] = useState(''); // 팝업 타입

	// 운송사 관련 팝업
	const refCourierModalPop = useRef(null); // 운송사 팝업
	const refCaragentkeyModalPop = useRef(null); // 2차운송사 팝업
	const refModal1 = useRef(null);

	// 상차지시 팝업
	const statusLoadPopupModal: any = useRef(null);
	const statusLoadPopupRef: any = useRef(null);

	// AUIGrid 속성 설정
	const gridProps: any = {
		editable: true, // 편집 불가
		fillColumnSizeMode: false, // 컬럼 크기 자동 조정 비활성화
		showFooter: true, // 푸터 표시
		height: 620, // 그리드 높이
		showRowAllCheckBox: true, // 전체 선택 체크박스 표시
		showRowCheckColumn: true, // 행별 체크박스 컬럼 표시
		showRowNumColumn: true, // 행 번호 컬럼 표시
		rowNumHeaderText: 'No.', // 행 번호 헤더 텍스트
		enableFilter: true, // 필터 기능 활성화
		copyDisplayValue: true, // 셀에 포맷된 데이터 그대로 복사
		rowCheckDisabledFunction: function (_rowIndex: number, _isChecked: boolean, item: any) {
			return item?.tmDeliveryType !== '6'; // 자차[6]-TODO 임시로 배차로 테스트
		},
	};

	// 차량번호 중복검증
	const applyCarnoSelectionWithChecks = ({
		selected,
		rowIndex,
		updateObj,
		pastedOriCarno,
	}: {
		selected: any;
		rowIndex: number;
		updateObj?: any;
		pastedOriCarno?: any;
	}) => {
		return applyCarnoSelectionWithChecksUtil({
			grid: gridRef.current,
			selected,
			rowIndex,
			updateObj,
			pastedOriCarno,
			carnoRestoreFields,
			onDuplicate: () => {
				if (clipboardPasteInProgressRef.current) {
					setTimeout(() => {
						if (!multiCarnoPasteBlockedRef.current) {
							showAlert('', '중복된 차량번호가 존재합니다.');
						}
					}, 0);
					return;
				}
				showAlert('', '중복된 차량번호가 존재합니다.');
			},
		});
	};

	//푸터 설정
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'deliverydt',
		},
		{
			dataField: 'pop',
			positionField: 'pop',
			operation: 'COUNT',
			expFunction: function (columnValues: any) {
				const uniqueKeys = new Set(columnValues);
				return uniqueKeys.size;
			},
		},
		{
			dataField: 'carno',
			positionField: 'carno',
			operation: 'COUNT',
			expFunction: function (columnValues: any) {
				const uniqueKeys = new Set(columnValues);
				return uniqueKeys.size;
			},
		},
		{
			dataField: 'destinationCount',
			positionField: 'destinationCount',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'totalWeightKg',
			positionField: 'totalWeightKg',
			operation: 'SUM',
			formatString: '#,##0.00',
		},
		{
			dataField: 'totalCbm',
			positionField: 'totalCbm',
			operation: 'SUM',
			formatString: '#,##0.00',
		},
	];

	// 그룹 헤더를 포함한 컬럼 구성 (Swagger 응답 키 그대로 사용)
	const gridCol: any[] = [
		{
			headerText: t('lbl.DELIVERYDATE') || '배송일자',
			dataField: 'deliverydt',
			dataType: 'date',
			editable: false,
		},
		{
			headerText: t('lbl.DISPATCH_INFO') || '배차정보', // 배차정보 그룹 헤더
			children: [
				{
					headerText: t('lbl.DISTRICTGROUP_NM') || '권역그룹명',
					dataField: 'districtgroupNm',
					dataType: 'text',
					editable: false,
				},
				{ headerText: t('lbl.DISTRICTNAME') || '권역명', dataField: 'districtcodeNm', editable: false, minWidth: 120 },
				{
					dataField: 'pop',
					headerText: t('lbl.LBL_DELIVERYGROUP') || 'POP',
					minWidth: 100,
					commRenderer: {
						type: 'search',
						iconPosition: 'right',
						popupType: 'carPOP',
						searchDropdownProps: {
							dataFieldMap: {
								popno: 'name',
								carno: 'code',
							},
							callbackBeforeUpdateRow: async (e: any) => {
								const selectRow = [e];
								if (e.which === 'clipboard') {
									const checkedRowItems = gridRef.current.getCheckedRowItems();
									const updateObj = e.updateObj;
									const updateIndexs = checkedRowItems.map((item: any) => item.rowIndex);
									applyPopAndCarnoSelection({ target: updateObj, selected: selectRow[0] });
									gridRef.current.restoreEditedCells(updateIndexs); // 이전값으로 복구 ( 편집 셀 닫기 )
									gridRef.current.updateRow(updateObj, e.rowIndex); // 드롭다운에서 선택한 값으로 행 업데이트
								} else {
									setPopupType('carPOP3');
									confirmPopup(selectRow);
								}
							},
						},
						onClick: (e: any) => {
							setPopupType('carPOP3');
							refModalPop.current.handlerOpen();
						},
					},
					dataType: 'code',
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'carno',
					headerText: t('lbl.CARNO') || '차량번호',
					minWidth: 160,
					commRenderer: {
						type: 'search',
						iconPosition: 'right',
						popupType: 'carPOP',
						searchDropdownProps: {
							dataFieldMap: {
								popno: 'name',
								carno: 'code',
							},
							callbackBeforeUpdateRow: async (e: any) => {
								const selected = e;
								if (e.which !== 'clipboard') {
									setPopupType('carPOP3');
									confirmPopup([selected]);
									return;
								}

								const raw = String(e.value ?? '');
								const lines = raw.split(/\r?\n/).filter(line => line !== '');
								const uniqueLines = Array.from(new Set(lines));
								if (uniqueLines.length > 1) {
									clipboardPasteInProgressRef.current = true;
									multiCarnoPasteBlockedRef.current = true;
									showAlert('', '다건의 차량번호는 복사 할 수 없습니다.');
									gridRef.current?.setCellValue(e.rowIndex, 'carno', e.oldValue ?? '');
									setTimeout(() => {
										clipboardPasteInProgressRef.current = false;
										multiCarnoPasteBlockedRef.current = false;
									}, 0);
									return true;
								}

								clipboardPasteInProgressRef.current = true;
								multiCarnoPasteBlockedRef.current = false;

								const pastedOriCarno =
									e.item?.oriCarno ?? e.updateObj?.oriCarno ?? gridRef.current?.getCellValue(e.rowIndex, 'oriCarno');
								applyCarnoSelectionWithChecks({
									selected,
									rowIndex: e.rowIndex,
									updateObj: e.updateObj,
									pastedOriCarno,
								});
								return true;
							},
						},
						onClick: (e: any) => {
							setPopupType('carPOP3');
							refModalPop.current.handlerOpen();
						},
					},
					dataType: 'code',
					filter: {
						showIcon: true,
					},
					required: true,
				},
				{
					dataField: 'courier',
					headerText: '운송사',
					editable: true,
					minWidth: 120,
					cellMerge: false,
					commRenderer: {
						type: 'search',
						popupType: 'carrierDrop',
						searchDropdownProps: {
							dataFieldMap: {
								courier: 'code',
								couriername: 'name',
							},
						},
						params: {
							carrierType: 'LOCAL',
						},
						onClick: function (e: any) {
							const rowIndex = e.rowIndex;
							if (gridRef.current.getCellValue(e.rowIndex, 'contractType') != 'TEMPORARY') return;
							refModal1.current.open({
								gridRef: gridRef,
								rowIndex,
								dataFieldMap: {
									courier: 'code',
									couriername: 'name',
								},
								carrierType: 'LOCAL',
								popupType: 'carrier',
							});
						},
					},
					labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
						return gridRef.current.getCellValue(rowIndex, 'courier')
							? gridRef.current.getCellValue(rowIndex, 'couriername')
							: '';
					},
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (item?.contractType === 'TEMPORARY') {
							return 'isEdit';
						} else {
							gridRef.current.removeEditClass(columnIndex);
						}
					},
				},
				{
					dataField: 'caragentkey',
					headerText: '2차운송사',
					dataType: 'text',
					editable: false,
					minWidth: 100,
					visible: false,
				},
				{
					dataField: 'caragentname',
					headerText: '2차운송사',
					dataType: 'text',
					editable: true,
					minWidth: 120,
					commRenderer: {
						type: 'search',
						popupType: 'carrierDrop',
						searchDropdownProps: {
							dataFieldMap: {
								caragentkey: 'code',
								caragentname: 'name',
							},
						},
						params: {
							carrierType: 'SUBC',
						},
						onClick: function (e: any) {
							const rowIndex = e.rowIndex;
							if (gridRef.current.getCellValue(e.rowIndex, 'contractType') != 'TEMPORARY') return;
							refModal1.current.open({
								gridRef: gridRef,
								rowIndex,
								dataFieldMap: {
									caragentkey: 'code',
									caragentname: 'name',
								},
								carrierType: 'SUBC',
								popupType: 'carrier',
							});
						},
					},
					labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
						return gridRef.current.getCellValue(rowIndex, 'caragentkey')
							? gridRef.current.getCellValue(rowIndex, 'caragentname')
							: '';
					},
					styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
						if (item?.contractType === 'TEMPORARY') {
							return 'isEdit';
						} else {
							gridRef.current.removeEditClass(columnIndex);
						}
					},
				},
				{
					headerText: t('lbl.DISPATCH_STATUS') || '배차상태',
					dataField: 'dispatchStatus',
					editable: false,
					dataType: 'code',
				},
				{
					headerText: t('lbl.CONTRACTTYPE') || '계약유형',
					dataField: 'contractType',
					editable: false,
					dataType: 'code',
					labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
						return getCommonCodebyCd('CONTRACTTYPE', value)?.cdNm;
					},
				},
				{
					headerText: t('lbl.PRIORITY') || '회차',
					dataField: 'priority',
					editable: false,
					dataType: 'code',
				},
				{
					headerText: t('lbl.REAL_DESTINATION_COUNT') || '실착지 수',
					dataField: 'destinationCount',
					editable: false,
					dataType: 'numeric',
				},
			],
		},
		{
			headerText: t('lbl.QUANTITY2') || '물량', // 물량 정보 그룹 헤더
			children: [
				{
					headerText: t('lbl.WEIGHT_KG_UOM'),
					dataField: 'totalWeightKg',
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.00',
				},
				{
					headerText: t('lbl.CUBE_UOM'),
					dataField: 'totalCbm',
					editable: false,
					dataType: 'numeric',
					formatString: '#,##0.00',
				},
			],
		},
		{
			dataField: 'reasonCarNo',
			headerText: t('lbl.BLAME_CAR') || '귀책차량', // 귀책차량 컬럼 (검색 아이콘 포함)
			minWidth: 120,
			commRenderer: {
				type: 'search',
				iconPosition: 'right',
				popupType: 'carPOP',
				searchDropdownProps: {
					dataFieldMap: {
						reasonCarNo: 'code',
					},
					callbackBeforeUpdateRow: async (e: any) => {
						const selectRow = [e];
						if (e.which === 'clipboard') {
							const checkedRowItems = gridRef.current.getCheckedRowItems();
							const updateObj = { reasonCarNo: '' };
							const updateIndexs = checkedRowItems.map((item: any) => item.rowIndex);
							updateObj.reasonCarNo = selectRow[0].code;
							gridRef.current.restoreEditedCells(updateIndexs); // 이전값으로 복구 ( 편집 셀 닫기 )
							gridRef.current.updateRow(updateObj, e.rowIndex); // 드롭다운에서 선택한 값으로 행 업데이트
						} else {
							setPopupType('carPOP');
							confirmReasonPopup(selectRow);
						}
					},
				},
				onClick: (e: any) => {
					setPopupType('carPOP');
					refReasonModalPop.current.handlerOpen();
				},
			},
			dataType: 'code',
			filter: {
				showIcon: true,
			},
		},
		{
			headerText: t('lbl.REASONCODE2') + t('lbl.REASON') || '귀책사유',
			dataField: 'reasonMsg',
			minWidth: 300,
			editable: true,
			required: false,
			editRenderer: {
				type: 'InputEditRenderer',
				showEditorBtnOver: false,
				maxlength: 100,
			},
		},
		{
			dataField: 'oriPop',
			headerText: '변경전POP',
			dataType: 'text',
			editable: false,
			visible: false,
		},
		{
			dataField: 'oriCarno',
			headerText: '변경전차량번호',
			dataType: 'text',
			editable: false,
			visible: false,
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수 선언부
	 * =====================================================================
	 */

	// 배차 목록 검색 함수
	const onSearch = async () => {
		const isValid = await form
			.validateFields()
			.then(() => true)
			.catch(() => false);
		if (!isValid) return showAlert('', '필수 조회조건을 입력해주세요.');

		gridRef.current.clearGridData();
		const values = form.getFieldsValue();

		// 검색 조건 파라미터 구성
		const deliveryDate = dayjs(values?.shipDt || dayjs().add(1, 'day')).format('YYYYMMDD'); // 배송일자
		const deliveryType = values?.shipType || 'WD'; // 배송유형
		const regionCode = Array.isArray(values?.area) ? values.area.join(',') : values?.area; // 권역코드
		const carnoSearch = values?.carNo || undefined; // 차량번호 검색
		const dispatchStatus = values?.dispatchStatus; // 배차상태

		try {
			// 배차 목록 조회 API 호출
			const res: any = await getDispatchList({
				deliveryDate,
				dccode: values?.gDccode,
				deliveryType,
				regionCode,
				carnoSearch,
				dispatchStatus,
			});

			gridRef.current.setFooter(footerLayout);
			const list: any[] = Array.isArray(res?.data?.dispatchList) ? res.data.dispatchList : [];
			setGridData(list);
			setTotalCnt(list.length);
			return;
		} catch (error) {
			//console.warn('[TmPlanList] getDispatchList error:', error);
		}

		// API 실패 또는 데이터 없음: 빈 배열로 초기화
		const fallback = [] as any[];
		setGridData(fallback);
		setTotalCnt(fallback.length);
	};

	// MenuTitle 컴포넌트에 전달할 함수 객체
	const titleFunc = useMemo(
		() => ({
			searchYn: onSearch,
			setting: () => {
				handleOpenStatusLoadPopup();
			},
		}),
		[],
	);

	// 저장
	const saveGridData = () => {
		if (gridRef.current.getCheckedRowItems()?.length > 0) {
			if (!gridRef.current.validateRequiredGridData()) {
				return false;
			} else if (
				gridRef.current.getCheckedRowItems().findIndex((row: any) => {
					return row.item.status === '00';
				}) > -1
			) {
				showAlert('', '배차 예정인 차량이 있습니다.');
				return false;
			} else {
				const saveData = gridRef.current.getChangedData().filter((row: any) => {
					return gridRef.current.getCheckedRowItems().find((checkrow: any) => {
						return checkrow.item._$uid === row._$uid;
					});
				});

				const saveDataOri = saveData.map((row: any) => {
					return {
						...row,
						deliveryDate: row.deliverydt,
						oldCarno: gridRef.current.getInitCellValue(row._$uid, 'carno'),
						oldPop: gridRef.current.getInitCellValue(row._$uid, 'pop'),
						tmDeliveryType: row.tmDeliveryType,
						contractType: row.contractType,
						processType: 'MODIFYALLOCCARALL', // SP TYPE
					};
				});

				const validateData = saveDataOri.filter(
					(row: any) => commUtil.isEmpty(row.carno) && commUtil.isEmpty(row.reasonCarNo),
				);

				const validateSameData = saveDataOri.filter((row: any) => row.carno === row.reasonCarNo);

				if (validateData.length !== 0) {
					showAlert('', '차량번호 또는 귀책차량을 입력해주세요.');
					return false;
				} else if (validateSameData.length !== 0) {
					showAlert('', '차량번호 또는 귀책차량이 동일한 차량입니다.');
					return false;
				} else {
					saveDispatchList(saveDataOri)
						.then(rtn => {
							setTimeout(() => {
								if (rtn.statusCode != -1) {
									showMessage({
										content: t('msg.MSG_COM_SUC_003'), // 저장되었습니다.
										modalType: 'info',
									});
									onSearch();
								}
							}, 2000);
						})
						.catch(error => {
							onSearch();
						});
				}
			}
		} else {
			return showAlert('', t('msg.selectCheckBox')); // 체크박스 선택 후 클릭해주세요.
		}
	};

	// 배차 취소
	const cancellationDispatch = () => {
		showConfirm('', '전체 배차계획 목록이 취소됩니다.\n취소하시겠습니까?', () => {
			const values = form.getFieldsValue();
			const deliveryDate = dayjs(values?.shipDt || dayjs().add(1, 'day')).format('YYYYMMDD');
			values.deliveryDate = deliveryDate;
			values.dccode = values.gDccode;
			values.tmDeliveryType = values.shipType;
			apiTmCancelDispatch(values).then(res => {
				setTimeout(() => {
					onSearch();
				}, 2000);
			});
		});
	};

	// 배차조정 화면으로 이동하는 함수 - TmPlan 화면으로 이동
	const handleAdjustNavigate = () => {
		const existingTab = getFindTab('/tm/TmPlan');
		if (existingTab?.menuUUID) {
			closeTab(existingTab.menuUUID);
		}

		// tab이 닫힌 후 데이터 저장
		const values = form.getFieldsValue();
		const deliveryDate = dayjs(values?.shipDt || dayjs().add(1, 'day')).format('YYYYMMDD');

		dispatch(clearPendingDispatchCriteria());
		dispatch(clearTmDispatchResult());
		// 배차조정 조건을 Redux에 저장
		dispatch(
			setPendingAdjustParams({
				deliveryDate, // 배송일자
				dccode: values?.gDccode, // 물류센터코드
				deliveryType: values?.shipType || 'WD', // 배송유형
				regionCode: Array.isArray(values?.area) ? values.area.join(',') : values?.area, // 권역코드
				carnoSearch: values?.carNo || undefined, // 차량번호 검색
			}),
		);

		moveMenu('/tm/TmPlan', {
			state: { key: Date.now() },
		});
	};

	// 전달받은 params 폼에 적용 및 자동 조회 - TmOrderList 등에서 moveMenu로 전달한 dccode, deliveryDate 등을 적용
	useEffect(() => {
		const state = location.state as { dccode?: string; deliveryDate?: string } | null;
		if (state) {
			const { dccode, deliveryDate } = state;
			if (dccode) {
				form.setFieldValue('gDccode', dccode);
			}
			if (deliveryDate) {
				const parsedDate = dayjs(deliveryDate, 'YYYYMMDD');
				if (parsedDate.isValid()) {
					form.setFieldValue('shipDt', parsedDate);
				}
			}

			if (dccode || deliveryDate) {
				setTimeout(() => {
					onSearch();
				}, 100);
			}
		}
	}, [location.state]);

	// 그리드 데이터 변경 시 그리드에 데이터 바인딩
	useEffect(() => {
		if (gridRef.current && Array.isArray(gridData)) {
			gridRef.current.setGridData(gridData);

			if (gridData.length > 0) {
				gridRef.current.setColumnSizeList(gridRef.current.getFitColumnSizeList(true));
			}
		}
	}, [gridData]);

	// 배차 확정 처리 함수
	const handleConfirmDispatch = async () => {
		const grid = gridRef.current;
		if (!grid) return;

		const checkedItems = grid.getCheckedRowItemsAll?.() || grid.getCheckedRowItems?.()?.map((r: any) => r.item) || [];
		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, '확정할 행을 선택하세요.');
			return;
		}

		const isAllTempDispatch = checkedItems.every((item: any) => item.dispatchStatus === '가배차완료');
		if (!isAllTempDispatch) {
			showAlert(
				null,
				"배차확정은 '가배차완료' 상태에서만 진행 가능합니다. 현재 선택된 상태(전체/확정)에서는 확정할 수 없습니다.",
			);
			return;
		}

		const isOk = await showConfirmAsync(null, `${checkedItems.length}건을 배차확정 하시겠습니까?`);
		if (!isOk) return;

		const values = form.getFieldsValue();

		try {
			// 확정 처리할 항목들 구성
			const confirmedItems = checkedItems.map((item: any) => ({
				dccode: values?.gDccode || item?.gDccode || item?.dccode, // 물류센터코드
				slipDt: item?.deliverydt?.replaceAll('-', ''), // 전표일자
				carno: String(item?.carno || ''), // 전표번호
				priority: item?.priority,
				pop: item?.pop,
				status: item?.status,
				tmDeliveryType: item?.tmDeliveryType || '', // 문서유형
				deliveryno: item?.deliveryno,
				docno: item?.deliveryno,
				deliverygroup: item?.deliverygroup,
				truthcustkey: '',
				processType: 'CONFIRM',
			}));

			// 배차 확정 API 호출
			await updateDispatchConfirmed(confirmedItems);

			showAlert(null, '배차 확정이 완료되었습니다.');
			await onSearch(); // 목록 새로고침
		} catch (error) {
			//console.warn('[TmPlanList] updateDispatchConfirmed error:', error);
			showAlert(null, '배차 확정 처리 중 오류가 발생했습니다.');
		}
	};

	const isAdjustDisabled = useMemo(() => {
		if (gridData.length === 0) return true;
		return gridData.every(item => !String(item?.carno || '').trim());
	}, [gridData]);

	// 상차지시 팝업 열기
	const handleOpenStatusLoadPopup = () => {
		const dccode = form.getFieldValue('gDccode');
		const shipDt = form.getFieldValue('shipDt');
		// 상차지시 조회 처리 후 팝업 창 열고 해당 결과값 넣기
		getLoadStatusSetting({
			dccode: dccode,
			shipDt: dayjs(shipDt).format('YYYYMMDD'),
		}).then((res: any) => {
			if (res.statusCode === 0) {
				const statusLoadCodeList = getCommonCodeList('STATUS_LOAD', '선택', '') ?? [];
				const findedStatusLoadCode = statusLoadCodeList.find((item: any) => item.comCd === res.data.loadStatus);
				// 날짜, 상차지시코드 변환 후 넘겨주기
				openLoadStatusPopup(dccode, shipDt, findedStatusLoadCode?.comCd || '');
			} else {
				openLoadStatusPopup(dccode, shipDt);
			}
		});

		/**
		 *
		 * @param dccode
		 * @param shipDt
		 * @param statusLoadCode
		 */
		function openLoadStatusPopup(dccode: string, shipDt: any, statusLoadCode = '') {
			statusLoadPopupModal.current?.handlerOpen();
			setTimeout(() => {
				if (dccode && statusLoadPopupRef.current) {
					statusLoadPopupRef.current.setMultiDcCode(dccode);
				}
				if (shipDt && statusLoadPopupRef.current) {
					statusLoadPopupRef.current.setShipDt(shipDt);
				}
				if (statusLoadPopupRef.current) {
					statusLoadPopupRef.current.setStatusLoadCode(statusLoadCode);
				}
			}, 300);
		}
	};
	/**
	 * 상차지시 팝업 닫기
	 */
	const handleCloseStatusLoadPopup = () => {
		statusLoadPopupModal.current?.handlerClose();
	};
	/**
	 * confirmPopup, confirmReasonPopup 공통
	 * 정확한 index 반환
	 */
	const withSelectedRowIndex = (fn: (rowIndex: number) => void) => {
		if (!gridRef.current) return;
		setTimeout(() => {
			const index = gridRef.current.getSelectedIndex()[0];
			fn(index);
		}, 0);
	};
	/**
	 * confirmPopup, confirmReasonPopup 공통
	 * withSelectedRowIndex, 선택로직, 팝업닫기 공통화
	 */
	const withSelectedRowAndClose = ({
		selectedRow,
		closeRef,
		onSelect,
	}: {
		selectedRow: any;
		closeRef: any;
		onSelect: (rowIndex: number, selected: any) => void;
	}) => {
		if (!selectedRow || !gridRef.current) return;
		withSelectedRowIndex(index => {
			onSelect(index, selectedRow[0]);
			closeRef.current?.handlerClose();
		});
	};
	/**
	 * 차량번호 팝업조회
	 * @param selectedRow
	 * @returns {void}
	 */
	const confirmPopup = (selectedRow: any) => {
		withSelectedRowAndClose({
			selectedRow,
			closeRef: refModalPop,
			onSelect: (index, selected) => {
				applyCarnoSelectionWithChecks({
					selected,
					rowIndex: index,
					pastedOriCarno: gridRef.current?.getCellValue(index, 'oriCarno'),
				});
			},
		});
	};
	/**
	 * 귀책차량 팝업조회
	 * @param selectedRow
	 * @returns {void}
	 */
	const confirmReasonPopup = (selectedRow: any) => {
		withSelectedRowAndClose({
			selectedRow,
			closeRef: refReasonModalPop,
			onSelect: (index, selected) => {
				gridRef.current?.setCellValue(index, 'reasonCarNo', selected.code);
			},
		});
	};
	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		[refModalPop, refReasonModalPop, refCourierModalPop, refCaragentkeyModalPop].forEach(ref =>
			ref.current?.handlerClose(),
		);
	};
	/**
	 * 그리드 bind 이벤트
	 * cellEditBegin - 운송사, 2차운송사 실비용차(TEMPORARY)만 수정가능
	 * cellEditEnd - 붙여넣기(Ctrl + V) 셀에 적용 직후 이벤트
	 * copyBegin - 복사(Ctrl + C) 시작 시 이벤트
	 */
	useEffect(() => {
		const gridRefCur = gridRef.current;

		gridRefCur.bind('pasteBegin', (event: any) => {
			const selectedIndex = gridRefCur.getSelectedIndex?.() || [];
			const selectedColIndex = selectedIndex[1];
			const selectedCol = Number.isFinite(selectedColIndex)
				? gridRefCur.getColumnItemByIndex?.(selectedColIndex)
				: null;
			const targetField = event?.dataField ?? selectedCol?.dataField;
			if (targetField !== 'carno') return true;

			clipboardPasteInProgressRef.current = true;
			multiCarnoPasteBlockedRef.current = false;

			const clipboardRaw = event?.clipboardData ?? event?.data ?? '';
			const raw =
				typeof clipboardRaw === 'string'
					? clipboardRaw
					: String(clipboardRaw?.getData?.('text') ?? clipboardRaw?.getData?.('text/plain') ?? '');
			const lines = raw.split(/\r?\n/).filter(line => line !== '');
			const uniqueLines = Array.from(new Set(lines));
			if (uniqueLines.length > 1) {
				multiCarnoPasteBlockedRef.current = true;
				showAlert('', '다건의 차량번호는 복사 할 수 없습니다.');
				setTimeout(() => {
					clipboardPasteInProgressRef.current = false;
					multiCarnoPasteBlockedRef.current = false;
				}, 0);
				return false;
			}
			return true;
		});

		gridRefCur.bind('cellEditBegin', (event: any) => {
			if (event.dataField == 'courier' || event.dataField == 'caragentname') {
				if (gridRef.current.getCellValue(event.rowIndex, 'contractType') == 'TEMPORARY') {
					return true;
				}
				return false;
			} else {
				return true;
			}
		});

		gridRefCur.bind('cellEditEnd', (event: any) => {
			if (event?.dataField !== 'carno') return;
			if (event.which !== 'clipboard' && !event.isClipboard) return;

			const raw = String(event.value ?? '');
			const lines = raw.split(/\r?\n/).filter(line => line !== '');
			const uniqueLines = Array.from(new Set(lines));
			if (raw !== (uniqueLines[0] ?? raw)) {
				gridRefCur.setCellValue(event.rowIndex, 'carno', uniqueLines[0] ?? raw);
			}
			setTimeout(() => {
				clipboardPasteInProgressRef.current = false;
				multiCarnoPasteBlockedRef.current = false;
			}, 0);
		});

		gridRefCur.bind('copyBegin', (event: any) => {
			if (event?.dataField && event.dataField !== 'carno') {
				return event?.data;
			}
			if (!event?.dataField) {
				const sel = gridRefCur.getSelectedIndex?.() || [];
				const colIndex = sel[1];
				const colItem = Number.isFinite(colIndex) ? gridRefCur.getColumnItemByIndex?.(colIndex) : null;
				if (colItem?.dataField && colItem.dataField !== 'carno') {
					return event?.data;
				}
			}
			return event?.data;
		});
	}, []);

	/**
	 * =====================================================================
	 *  03. React Hook Event 및 렌더링
	 * =====================================================================
	 */
	return (
		<>
			{/* 상단 타이틀 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 */}
			<SearchFormResponsive
				form={form}
				initialValues={{ shipDt: dayjs().add(1, 'day'), shipType: '1', dispatchStatus: '' }}
				groupClass={'grid-column-4'}
			>
				{/* 배송일자 선택 */}
				<li>
					<Datepicker
						label={t('lbl.DELIVERYDATE_WD')}
						name={'shipDt'}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>
				{/* 물류센터 */}
				<li>
					<CmGMultiDccodeSelectBox mode={'single'} name={'gDccode'} rules={[{ required: true }]} />
				</li>
				{/* 배송유형 선택 */}
				<li>
					<SelectBox
						label={t('lbl.DELIVERYTYPE_WD') || '배송유형'}
						name={'shipType'}
						allowClear
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						options={getCommonCodeList('TM_DELIVERYTYPE', '배송', '1')
							.filter(item => !['2', '5', '7', '8', '9'].includes(item.comCd))
							.sort((a, b) => a.comCd - b.comCd)}
						rules={[{ required: true }]}
					/>
				</li>
				{/* 권역 입력 */}
				<li>
					<InputText label={t('lbl.BASE_DISTRICT') || '권역'} name={'area'} placeholder="권역명을 입력하세요" />
				</li>
				{/* 배차상태 선택 */}
				<li>
					<SelectBox
						label={t('lbl.DISPATCH_STATUS') || '배차상태'}
						name={'dispatchStatus'}
						allowClear
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						options={getCommonCodeList('STATUS_TM', '전체', '').filter(
							item => !['00', '45', '85'].includes(item.comCd),
						)}
					/>
				</li>
				{/* 차량번호 검색 */}
				<li>
					<CmCarPopSearch
						form={form}
						name={'carNoText'}
						code={'carNo'}
						label={t('lbl.CARNO') || '차량번호'}
						selectionMode={'multipleRows'}
						returnValueFormat={'code'}
					/>
				</li>
			</SearchFormResponsive>

			{/* 그리드 영역 */}
			<AGridWrap className="contain-wrap">
				<AGrid>
					{/* 그리드 상단 버튼 영역 */}
					<GridTopBtn gridTitle={'목록'} totalCnt={totalCnt} gridBtn={{ tGridRef: gridRef }} position="postfix">
						{/* 저장 버튼 */}
						<Button onClick={saveGridData} disabled={gridData.length === 0}>
							{t('lbl.SAVE') || '저장'}
						</Button>
						{/* 배차취소 버튼 */}
						<Button onClick={cancellationDispatch} disabled={gridData.length === 0}>
							{t('lbl.DISPATCH_CANCEL') || '배차취소'}
						</Button>

						{/* 배차조정 버튼 - TmPlan 화면으로 이동 */}
						<Button onClick={handleAdjustNavigate} disabled={isAdjustDisabled}>
							{t('lbl.DISPATCH_ADJUST') || '배차조정'}
						</Button>

						{/* 배차확정 버튼 - 선택된 배차를 확정 상태로 변경 */}
						<Button type="primary" onClick={handleConfirmDispatch}>
							{t('lbl.DISPATCH_CONFIRM') || '배차확정'}
						</Button>
					</GridTopBtn>

					{/* 배차 목록 그리드 */}
					<AUIGrid
						ref={gridRef}
						columnLayout={gridCol}
						gridProps={gridProps}
						footerLayout={[
							{ labelText: '', positionField: '#base' },
							{ dataField: 'realCarCnt', positionField: 'realCarCnt', operation: 'SUM', formatString: '#,##0' },
							{ labelText: '', positionField: '#base' },
							{ dataField: 'cbm', positionField: 'cbm', operation: 'SUM', formatString: '#,##0.##' },
							{ dataField: 'qty', positionField: 'qty', operation: 'SUM', formatString: '#,##0' },
						]}
					/>
				</AGrid>
			</AGridWrap>

			{/* 차량번호 아이콘 클릭 팝업 */}
			<CustomModal ref={refModalPop} width="1280px">
				<CmSearchPopup type={popupType} callBack={confirmPopup} close={closeEvent} />
			</CustomModal>

			{/* 귀책차량 아이콘 클릭 팝업 */}
			<CustomModal ref={refReasonModalPop} width="1280px">
				<CmSearchPopup type={popupType} callBack={confirmReasonPopup} close={closeEvent} />
			</CustomModal>

			{/* 운송사 아이콘 클릭 팝업 */}
			<CmSearchCarrierWrapper ref={refModal1} />

			{/* 상하지시 팝업 버튼 */}
			<CustomModal ref={statusLoadPopupModal} width="1280px">
				<TmPlanStatusLoadPopup
					ref={statusLoadPopupRef}
					close={handleCloseStatusLoadPopup}
					parentFormValues={form.getFieldsValue()}
				/>
			</CustomModal>
		</>
	);
};

export default TmPlanList;
