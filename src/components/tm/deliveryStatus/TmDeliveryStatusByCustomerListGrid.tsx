/*
 ############################################################################
 # FiledataField	: TmDeliveryStatusByCustomerListGrid.tsx
 # Description		: 모니터링 > 배송 > 배송현황 > 거래처별 탭 그리드
 # Author			: BS.kim
 # Since			: 2025.11.17
 ############################################################################
 */
// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';

// Component
import CmIssuePicturePopup from '@/components/cm/popup/CmIssuePicturePopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import TmPlanCustomerDispatchHistoryPopup from '@/components/tm/popup/TmPlanCustomerDispatchHistoryPopup';

// css
import AGrid from '@/assets/styled/AGrid/AGrid';

// API
import { apiTmDeliveryStatusByCustomerSave } from '@/api/tm/apiTmDeliveryStatus';

// Util
import commUtil from '@/util/commUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';
import { Form } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

// Store
import { getCommonCodebyCd } from '@/store/core/comCodeStore';

// Types
import { GridBtnPropsType } from '@/types/common';

const TmDeliveryStatusByCustomerListGrid = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 변수 정의(1/4)
	const { t } = useTranslation(); // 다국어 처리
	/**
	 * [ props ]
	 * @param {string} gridData - 그리드 데이터
	 * @param {ref} gridRef - 그리드 Ref
	 * @param {Array} hjDongSelect - 행정동
	 * @param {state} setSelectedRowInCenterGrid - 그리드 선택 row state
	 * @param {ref} orderGroupGridRef - 주문 그룹 Ref
	 * @param {Function} searchList - 조회 function
	 * @param {form} form - 조회 조건
	 */
	const { gridData, totalCount, gridRef, searchList, form } = props;
	const historyPopupRef = useRef<any>(null);
	const [historyParams, setHistoryParams] = useState<any>(undefined);
	const issuePicturePopupRef = useRef<any>(null);
	const [issuePictureParams, setIssuePictureParams] = useState<any>(undefined);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	// 그리드 props
	const gridProps: any = {
		editable: true, // 데이터 수정 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		showFooter: true, // 푸터 표시
		enableCellMerge: true, // 셀 병합 실행
		showRowNumColumn: true, // 행번호
		noDataMessage: t('lbl.NO_DATA'), // 조회 결과가 없습니다.
		enableRestore: true, // 셀, 행 수정 후 원본으로 복구 시키는 기능 사용 가능 여부 (기본값:true)
		showRowAllCheckBox: true, // 전체 선택 체크박스 표시
		showRowCheckColumn: true, // 행별 체크박스 컬럼 표시
		copyDisplayValue: true, // 셀에 포맷된 데이터 그대로 복사
	};

	// 그리드 columnLayout
	const footerLayout = [
		{
			dataField: 'truthcustkey',
			positionField: 'truthcustkey',
			operation: 'COUNT',
			expFunction: function (columnValues: any) {
				const uniqueKeys = new Set(columnValues);
				return uniqueKeys.size;
			},
		},
		{ dataField: 'weight', positionField: 'weight', operation: 'SUM', formatString: '#,##0.##' },
		{ dataField: 'cube', positionField: 'cube', operation: 'SUM', formatString: '#,##0.##' },
	];

	const gridCol = [
		{
			dataField: 'dlvgroupNm',
			dataType: 'code',
			headerText: '권역그룹',
			cellMerge: true,
			editable: false,
		},
		{
			dataField: 'dlvdistrictNm',
			dataType: 'code',
			headerText: '권역',
			editable: false,
		},
		{
			dataField: 'popno',
			dataType: 'code',
			headerText: 'POP번호',
			editable: false,
		},
		{
			dataField: 'carno',
			dataType: 'code',
			headerText: '차량번호',
			editable: false,
		},
		{
			dataField: 'contracttype',
			dataType: 'code',
			headerText: '계약유형',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('CONTRACTTYPE', value)?.cdNm;
			},
			editable: false,
		},
		{
			dataField: 'priority',
			dataType: 'code',
			headerText: '회차',
			editable: false,
		},
		{
			dataField: 'deliverypriority',
			dataType: 'code',
			headerText: '배송순서',
			editable: false,
		},
		{
			dataField: 'truthcustkey',
			dataType: 'code',
			headerText: '실착지코드',
			editable: false,
		},
		{
			dataField: 'truthcustname',
			headerText: '실착지명',
			editable: false,
		},
		{
			dataField: 'otdFrom',
			dataType: 'code',
			headerText: 'OTD시작',
			editable: false,
		},
		{
			dataField: 'otdTo',
			dataType: 'code',
			headerText: 'OTD종료',
			editable: false,
		},
		{
			dataField: 'deliverynotiyn',
			headerText: '알림수신',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'regwhoNm',
			dataType: 'code',
			headerText: '출도착 처리',
			editable: false,
		},
		{
			dataField: 'deliveryplandt',
			dataType: 'code',
			headerText: '도착예정시간',
			editable: false,
		},
		{
			dataField: 'custarrivaldt',
			dataType: 'code',
			headerText: '거래처도착',
			editable: true,
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: (rowIndex: number, columnIndex: number, value: any, item: any, dataField: string) => {
					if (item?.deliverystartRegType === 'W' || commUtil.isEmpty(item?.deliverystartRegType)) {
						return {
							type: 'InputEditRenderer',
							showEditorBtnOver: false,
							onlyNumeric: false,
							allowPoint: false,
							allowNegative: false,
							textAlign: 'center',
							maxlength: 5,
							autoThousandSeparator: false,
							validator: (
								oldValue: any,
								newValue: any,
								item: any,
								dataField: string,
								fromClipboard: boolean,
								which: any,
							) => {
								const normalizedValue = String(newValue ?? '').replace(/\D/g, '');
								if (
									commUtil.isEmpty(newValue) === false &&
									dayjs(dayjs().format('YYYYMMDD') + ' ' + normalizedValue, 'YYYYMMDD HHmm', true).isValid() === false
								) {
									return { validate: false, message: '올바른 값을 입력해주세요.' };
								} else {
									return { validate: true };
								}
							},
						};
					}
				},
			},
			labelFunction: (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
				if (!commUtil.isEmpty(value)) {
					if (value.indexOf(':') > -1) {
						return value;
					} else {
						const idx = 2;
						const s1 = value.slice(0, idx);
						const s2 = value.slice(idx);
						const res = `${s1}:${s2}`;
						return res;
					}
				}
				return value;
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				const isStartValid = item?.deliverystartRegType === 'W' || commUtil.isEmpty(item?.deliverystartRegType);
				if (isStartValid) {
					return 'isEdit';
				} else {
					gridRef.current.removeEditClass(columnIndex);
				}
			},
		},
		{
			dataField: 'custdeparturedt',
			dataType: 'code',
			headerText: '거래처출발',
			editable: true,
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: (rowIndex: number, columnIndex: number, value: any, item: any, dataField: string) => {
					if (item?.deliveryendRegType === 'W' || commUtil.isEmpty(item?.deliveryendRegType)) {
						return {
							type: 'InputEditRenderer',
							showEditorBtnOver: false,
							onlyNumeric: false,
							allowPoint: false,
							allowNegative: false,
							textAlign: 'center',
							maxlength: 5,
							autoThousandSeparator: false,
							validator: (
								oldValue: any,
								newValue: any,
								item: any,
								dataField: string,
								fromClipboard: boolean,
								which: any,
							) => {
								const normalizedValue = String(newValue ?? '').replace(/\D/g, '');
								if (
									commUtil.isEmpty(newValue) === false &&
									dayjs(dayjs().format('YYYYMMDD') + ' ' + normalizedValue, 'YYYYMMDD HHmm', true).isValid() === false
								) {
									return { validate: false, message: '올바른 값을 입력해주세요.' };
								} else {
									return { validate: true };
								}
							},
						};
					}
				},
			},
			labelFunction: (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) => {
				if (!commUtil.isEmpty(value)) {
					if (value.indexOf(':') > -1) {
						return value;
					} else {
						const idx = 2;
						const s1 = value.slice(0, idx);
						const s2 = value.slice(idx);
						const res = `${s1}:${s2}`;
						return res;
					}
				}
				return value;
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				const isEndValid = item?.deliveryendRegType === 'W' || commUtil.isEmpty(item?.deliveryendRegType);
				if (isEndValid) {
					return 'isEdit';
				} else {
					gridRef.current.removeEditClass(columnIndex);
				}
			},
		},
		{
			dataField: 'avgArrivaldt',
			dataType: 'code',
			headerText: '평균도착시간',
			editable: false,
		},
		{
			dataField: 'avgWorkTime',
			dataType: 'code',
			headerText: '평균작업시간',
			editable: false,
		},
		{
			dataField: 'weight',
			dataType: 'numeric',
			headerText: '중량(kg)',
			formatString: '#,##0.00',
			editable: false,
		},
		{
			dataField: 'cube',
			dataType: 'numeric',
			headerText: '체적(㎥)',
			formatString: '#,##0.00',
			editable: false,
		},
		{
			dataField: 'truthaddress',
			headerText: '주소',
			editable: false,
		},
		{
			headerText: '배차이력',
			dataField: 'icon',
			editable: false,
			style: 'aui_comm_search--center',
			renderer: {
				type: 'IconRenderer',
				iconPosition: 'right',
				iconTableRef: { default: '/img/icon/icon-pc-search-20-px.svg' },
				iconHeight: 14,
				iconWidth: 14,
			},
		},
		{
			headerText: '사진촬영여부',
			dataField: 'photoYn',
			dataType: 'code',
			editable: false,
			styleFunction: (rowIndex: number, columnIndex: number, value: any) => {
				if (value === 'Y') {
					return 'aui_comm_search--center';
				}
				return '';
			},
		},
	];

	const centerGridBtn = useMemo((): GridBtnPropsType => {
		return {
			tGridRef: gridRef,
			btnArr: [
				{
					btnType: 'save',
					callBackFn: () => {
						const params = gridRef.current.getChangedData();
						if (!gridRef.current.validateRequiredGridData()) {
							return false;
						}

						if (params.length === 0) {
							showAlert(null, t('msg.noModifiedData'));
							return false;
						} else {
							let isSave = false;
							params.map((param: any) => {
								if (commUtil.isEmpty(param.custarrivaldt) || commUtil.isEmpty(param.custdeparturedt)) {
									isSave = true;
								}
							});

							if (isSave) {
								showAlert('', '거래처 도착/출발 시간은 모두 입력해야 합니다.');
							} else {
								showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
									axios
										.all(
											params.map((param: any) => {
												apiTmDeliveryStatusByCustomerSave({
													...param,
													custkey: param.truthcustkey,
													arrivedtime:
														commUtil.isEmpty(param.custarrivaldt) === true
															? param.custarrivaldt
															: param.custarrivaldt.split(':').join(''),
													departuretime:
														commUtil.isEmpty(param.custdeparturedt) === true
															? param.custdeparturedt
															: param.custdeparturedt.split(':').join(''),
												});
											}),
										)
										.then(rtn => {
											searchList();
										});
								});
							}
						}
					},
				},
			],
		};
	}, []);

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	const [pForm] = Form.useForm();
	useEffect(() => {
		gridRef.current.bind('vScrollChange', () => {
			gridRef?.current?.forceEditingComplete?.(null, true);
		});

		try {
			gridRef.current.bind('cellDoubleClick', (event: any) => {
				if (event?.dataField === 'photoYn' && event?.item?.photoYn === 'Y') {
					const row = event.item;
					setIssuePictureParams({
						dccode: row?.dccode,
						deliverydt: row?.deliverydt,
						truthcustkey: row?.truthcustkey,
						carno: row?.carno,
						priority: row?.priority || '1',
					});
					issuePicturePopupRef?.current?.handlerOpen?.();
				}
				if (event?.dataField === 'icon') {
					setHistoryParams({
						custkey: event.item.truthcustkey,
						custname: event.item.truthcustname,
						dccode: event.item.dccode,
						deliverydt: event.item.deliverydt,
					});
					pForm.setFieldValue('deliverydtFrom', dayjs(event.item.deliverydt));
					pForm.setFieldValue('deliverydtTo', dayjs(event.item.deliverydt));
					historyPopupRef?.current?.handlerOpen?.();
				}
			});
		} catch (e) {
			//console.warn('[TmPlanList] grid bind error:', e);
		}
	}, []);

	/**
	 * 거래처도착, 거래처출발 deliverystartRegType, deliverystartRegType "W", empty 일 경우만 수정가능
	 */
	useEffect(() => {
		const gridRefCur = gridRef.current;
		const handleCellEditBegin = (event: any) => {
			const { dataField, rowIndex } = event;
			if (dataField === 'custarrivaldt') {
				const startRegType = gridRefCur.getCellValue(rowIndex, 'deliverystartRegType');
				return startRegType === 'W' || commUtil.isEmpty(startRegType);
			}
			if (dataField === 'custdeparturedt') {
				const endRegType = gridRefCur.getCellValue(rowIndex, 'deliveryendRegType');
				return endRegType === 'W' || commUtil.isEmpty(endRegType);
			}
			return true;
		};
		gridRefCur.bind('cellEditBegin', handleCellEditBegin);
		return () => {
			gridRefCur.unbind('cellEditBegin', handleCellEditBegin);
		};
	}, []);

	/**
	 * =====================================================================
	 *  04. jsx
	 * =====================================================================
	 */
	return (
		<>
			<Form key={1} form={pForm}>
				<Form.Item name="deliverydtFrom" hidden></Form.Item>
				<Form.Item name="deliverydtTo" hidden></Form.Item>
			</Form>
			<AGrid dataProps={''}>
				<GridTopBtn gridTitle={t('목록')} gridBtn={centerGridBtn} totalCnt={totalCount} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
			{/* 배차이력 팝업 */}
			<CustomModal ref={historyPopupRef} width="1280px">
				<TmPlanCustomerDispatchHistoryPopup
					params={historyParams}
					close={() => historyPopupRef?.current?.handlerClose?.()}
					pForm={pForm}
				/>
			</CustomModal>
			{/* 사진촬영 팝업 */}
			<CustomModal ref={issuePicturePopupRef} width="800px">
				<CmIssuePicturePopup
					close={() => issuePicturePopupRef?.current?.handlerClose?.()}
					open={true}
					param={issuePictureParams}
				/>
			</CustomModal>
		</>
	);
});

export default TmDeliveryStatusByCustomerListGrid;
