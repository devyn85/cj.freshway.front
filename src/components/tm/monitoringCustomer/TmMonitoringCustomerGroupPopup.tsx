/*
 ############################################################################
 # FiledataField	: TmMonitoringCustomerGroupPopup.tsx
 # Description		: 배송 > 배차현황 > 배송고객모니터링 (모니터링 그룹관리 팝업)
 # Author					: JiHoPark
 # Since					: 2025.11.25.
 ############################################################################
*/

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText, SearchForm, SelectBox } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';
import { Button, Form } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Util

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// API
import {
	apiSaveMonitoringCustomerGroupDetailList,
	apiSaveMonitoringCustomerGroupList,
} from '@/api/tm/apiTmMonitoringCustomer';

// Hooks

// lib

// type
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import { GridBtnPropsType } from '@/types/common';

// asset

interface TmMonitoringCustomerGroupPopupProps {
	form?: any;
	searchName?: string;
	selectionMode?: string;
	onCallbackHandler?: any;
	onCloseHandler?: any;
	onSearchMasterHandler: any;
	onSearchDetailHandler: any;
	gridRef1: any;
	data1: any;
	totalCnt1: any;
	gridRef2: any;
	data2: any;
	totalCnt2: any;
	dccode: string;
}

const TmMonitoringCustomerGroupPopup = (props: TmMonitoringCustomerGroupPopupProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const [searchForm] = Form.useForm();

	// modal Ref
	const refModal = useRef(null);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		dccode: '', // 센터코드
		groupCdName: '', // 그룹코드/명
		useYn: '', // 사용여부
	});

	const { form, selectionMode, searchName, onCallbackHandler, onCloseHandler, gridRef1, gridRef2, dccode } = props;

	//그리드 컬럼
	const gridCol = [
		{
			headerText: t('lbl.GROUPCD'),
			/*그룹코드*/ dataField: 'groupCd',
			dataType: 'code',
			editable: false,
		},
		{ headerText: t('lbl.GROUPNAME'), /*그룹명*/ required: true, dataField: 'groupName', dataType: 'string' },
		{ headerText: t('lbl.REMARK'), /*비고*/ dataField: 'rmk', dataType: 'string' },
		{
			headerText: t('lbl.USE_YN'),
			/*사용여부*/ dataField: 'useYn',
			dataType: 'code',
			required: true,
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('YN'),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		},
		{ headerText: t('lbl.DCCODE'), /*물류센터*/ dataField: 'dccode', dataType: 'code', visible: false },
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: true,
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		customRowCheckColumnDataField: 'chk', // 커스텀 엑스트라 체크박스 DataField
		customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
	};

	//그리드 컬럼
	const gridDetailCol = [
		{
			headerText: t('lbl.TO_CUSTKEY_WD'),
			/*관리처코드*/ dataField: 'mngplcId',
			dataType: 'code',
			required: true,
			commRenderer: {
				type: 'search',
				onClick: function (e: any) {
					if (e.item['rowStatus'] === 'I' || e.item['modifyFlag'] !== 'N') {
						refModal.current.open({
							gridRef: gridRef2,
							rowIndex: e.rowIndex,
							dataFieldMap: { mngplcId: 'code', mngplcname: 'name' },
							popupType: 'cust',
						});
					}
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRef2.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{ headerText: t('lbl.TO_CUSTNAME_WD'), /*관리처명*/ dataField: 'mngplcname', dataType: 'string', editable: false },
		{
			headerText: t('lbl.USE_YN'),
			/*사용여부*/ dataField: 'useYn',
			dataType: 'code',
			required: true,
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('YN'),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		},
	];

	// 그리드 속성을 설정
	const gridDetailProps = {
		editable: true,
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 모니터링 그룹 조회
	 */
	const searchMonitoringCustomerGroupList = async () => {
		if (
			gridRef1.current.getChangedData({ validationYn: false })?.length > 0 ||
			gridRef2.current.getChangedData({ validationYn: false })?.length > 0
		) {
			// 그리드 수정여부 체크
			const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009')); // 변경사항이 있습니다. 계속 진행하시겠습니까?
			if (!isConfirm) {
				return;
			}
		}

		const searchParam = searchForm.getFieldsValue();
		props.onSearchMasterHandler(searchParam);
	};

	/**
	 * 모니터링 그룹 저장 callback
	 * @returns {void}
	 */
	const saveCallback = () => {
		const chkDataList = gridRef1.current.getChangedData();

		if (chkDataList.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'), // 변경사항이 없습니다.
				modalType: 'info',
			});
			return;
		}

		gridRef1.current.showConfirmSave(() => {
			const insertList: any[] = [];
			const updateList: any[] = [];

			chkDataList.forEach((item: any) => {
				if (item.rowStatus === 'I') {
					insertList.push(item);
				} else {
					updateList.push(item);
				}
			});

			gridRef1.current.clearGridData();
			gridRef1.current.clearGridData();

			const params = {
				insertCustomerGroupMasterList: insertList,
				updateCustomerGroupMasterList: updateList,
			};

			apiSaveMonitoringCustomerGroupList(params).then(res => {
				if (res.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'), // 저장되었습니다.
						modalType: 'info',
					});

					// 재조회
					searchMonitoringCustomerGroupList();
				}
			});
		});
	};

	/**
	 * 모니터링 그룹관리 관처리 저장 callback
	 * @returns {void}
	 */
	const saveDetailCallback = () => {
		const chkDataList = gridRef2.current.getChangedData();

		if (chkDataList.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'), // 변경사항이 없습니다.
				modalType: 'info',
			});
			return;
		}

		gridRef2.current.showConfirmSave(() => {
			const insertList: any[] = [];
			const updateList: any[] = [];

			chkDataList.forEach((item: any) => {
				if (item.rowStatus === 'I' || item['modifyFlag'] !== 'N') {
					insertList.push(item);
				} else {
					updateList.push(item);
				}
			});

			const params = {
				insertCustomerGroupDetailList: insertList,
				updateCustomerGroupDetailList: updateList,
			};

			apiSaveMonitoringCustomerGroupDetailList(params).then(res => {
				if (res.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'), // 저장되었습니다.
						modalType: 'info',
					});

					const rowIdx = gridRef1.current.getSelectedIndex()[0];
					if (rowIdx > -1) {
						// 재조회
						props.onSearchDetailHandler(gridRef1.current.getItemByRowIndex(rowIdx), true);
					}
				}
			});
		});
	};

	/**
	 * 선택 데이터 callback event
	 * @param flag
	 */
	const onSelectedCallback = (flag: string) => {
		if (flag === '1') {
			// 더블클릭
			const param = gridRef1.current.getSelectedRows();
			if (param['rowStatus'] === 'I') {
				showMessage({
					content: t('msg.MSG_COM_ERR_058'), // 신규행이 포함됐습니다. 저장 후 진행하십시요.
					modalType: 'info',
				});
				return;
			}

			onCallbackHandler(param);
		} else if (flag === '2') {
			// 확인버튼
			const param = gridRef1.current.getCheckedRowItemsAll();
			const result = param.find(({ rowStatus }: { rowStatus: string }) => rowStatus === 'I');
			if (result) {
				showMessage({
					content: t('msg.MSG_COM_ERR_058'), // 신규행이 포함됐습니다. 저장 후 진행하십시요.
					modalType: 'info',
				});
				return;
			}

			onCallbackHandler(param);
		}
	};

	/**
	 * 확인버튼 click validate event
	 * @param flag
	 */
	const onConfirmHandler = (flag: string) => {
		if (
			gridRef1.current.getChangedData({ validationYn: false })?.length > 0 ||
			gridRef2.current.getChangedData({ validationYn: false })?.length > 0
		) {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				onSelectedCallback(flag);
			});
		} else {
			onSelectedCallback(flag);
		}
	};

	/**
	 * 이동 여부 확인
	 * @param item
	 */
	const onMoveRowHandler = async (item: any) => {
		if (gridRef2.current.getChangedData({ validationYn: false })?.length > 0) {
			// 그리드 수정여부 체크
			const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009')); // 변경사항이 있습니다. 계속 진행하시겠습니까?
			if (isConfirm) {
				gridRef1?.current.setSelectionByIndex(item.toRowIndex, item.toColumnIndex);
			}
		} else {
			gridRef1?.current.setSelectionByIndex(item.toRowIndex, item.toColumnIndex);
		}
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		gridRef1?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef1?.current.setSelectionByIndex(0);
		});

		gridRef2?.current.bind('cellEditBegin', function (event: any) {
			if (event.dataField === 'mngplcId' && event.item.modifyFlag === 'N') {
				return false;
			}
		});

		/**
		 * 그리드 더블클릭
		 * @param {any} event 이벤트
		 */
		gridRef1?.current.bind('cellDoubleClick', (event: any) => {
			if (event.dataField === 'groupCd' && event.item.rowStatus !== 'I') {
				onConfirmHandler('1');
			}
		});

		/**
		 * 그리드 row변경 전
		 * @param {any} event 이벤트
		 */
		gridRef1?.current.bind('selectionConstraint', (event: any) => {
			onMoveRowHandler(event);
			return false;
		});

		/**
		 * 그리드 row변경 후
		 * @param {any} event 이벤트
		 */
		gridRef1?.current.bind('selectionChange', (event: any) => {
			const primeCell = event.primeCell;
			// 선택된 행의 상세 정보를 조회한다.
			props.onSearchDetailHandler(primeCell.item, false);
		});

		/**
		 * 그리드 row add event
		 * @param {any} event 이벤트
		 */
		gridRef2?.current.bind('addRow', (event: any) => {
			const rowIdx = gridRef1.current.getSelectedIndex()[0];
			if (gridRef1.current.getItemByRowIndex(rowIdx)['rowStatus'] === 'I') {
				gridRef2.current.clearGridData();
			} else {
				const curGroupCd = gridRef1.current.getItemByRowIndex(rowIdx)['groupCd'];
				const newItems = event.items;
				newItems.forEach((item: any) => {
					const uid = item._$uid;
					const curIdx = gridRef2?.current.getRowIndexesByValue('_$uid', [uid]);
					const param = {
						...item,
						groupCd: curGroupCd,
						useYn: 'Y',
					};

					gridRef2?.current.updateRow(param, curIdx[0]);
				});
			}
		});
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					if (gridRef2.current.getChangedData({ validationYn: false })?.length > 0) {
						showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
							// 변경사항이 있습니다. 계속 진행하시겠습니까?
							gridRef1.current?.addRow({
								dccode: dccode,
								rowStatus: 'I', // 신규 행 상태로 설정
								useYn: 'Y',
							});
						});
					} else {
						gridRef1.current?.addRow({
							dccode: dccode,
							rowStatus: 'I', // 신규 행 상태로 설정
							useYn: 'Y',
						});
					}
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveCallback,
			},
		],
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const gridDetailBtn: GridBtnPropsType = {
		tGridRef: gridRef2, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					const rowIdx = gridRef1.current.getSelectedIndex()[0];
					if (rowIdx > -1) {
						const curGroupCd = gridRef1.current.getItemByRowIndex(rowIdx)['groupCd'];
						if (commUtil.isNotEmpty(curGroupCd)) {
							gridRef2.current?.addRow({
								groupCd: curGroupCd,
								rowStatus: 'I', // 신규 행 상태로 설정
								useYn: 'Y',
							});
						} else if (gridRef1.current.getItemByRowIndex(rowIdx)['rowStatus'] === 'I') {
							showMessage({
								content: t('msg.MSG_COM_ERR_059'), // 선택된 모니터링그룹이 신규인 경우, 관리처 목록을 추가할 수 없습니다.
								modalType: 'info',
							});
							return;
						}
					}
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveDetailCallback,
			},
		],
	};

	/**
	 * 페이지 버튼 함수 바인딩
	 */
	const titleFunc = {
		searchYn: searchMonitoringCustomerGroupList, // 조회
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		if (commUtil.isEmpty(dccode)) {
			showMessage({
				content: t('msg.MSG_COM_VAL_007', ['센터코드']), // 이메일 전송 대상 을(를) 선택해 주십시오.
				modalType: 'info',
			});
			onCloseHandler();
			return;
		}
		searchForm.setFieldValue('dccode', dccode);
		initEvent();
	}, []);

	/**
	 * Grid data 변경
	 */
	useEffect(() => {
		const gridRef = gridRef1.current;
		if (gridRef) {
			gridRef?.setGridData(props.data1);
			gridRef?.setSelectionByIndex(0, 0);

			if (props.data1.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data1]);

	/**
	 * Grid data 변경
	 */
	useEffect(() => {
		const gridRef = gridRef2.current;
		if (gridRef) {
			gridRef?.setGridData(props.data2);
			gridRef?.setSelectionByIndex(0, 0);

			if (props.data2.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data2]);

	/**
	 * 부모페이지의 검색어를 가져온다.
	 */
	useEffect(() => {
		if (!searchName) {
			searchForm.setFieldValue('groupCdName', '');
			return;
		} else if (searchName.split(',').length > 1) {
			searchForm.setFieldValue('groupCdName', searchName);
		} else {
			searchForm.setFieldValue('groupCdName', searchName.match(/^\[([^\]]+)\]/)?.[1] || searchName);
		}

		searchMonitoringCustomerGroupList();
	}, [searchName]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef1?.current?.resize?.('100%', '100%');
		gridRef2?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={t('lbl.MONITOR_GROUP_MNG')} func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={searchForm} initialValues={searchBox}>
				{/*2행*/}
				<UiFilterArea>
					<UiFilterGroup className="grid-column-2">
						<li>
							<CmGMultiDccodeSelectBox disabled={true} name={'dccode'} />
						</li>
						<li>
							<InputText
								label={t('lbl.GROUPCDNAME')} // 그룹코드/명
								name="groupCdName"
							/>
						</li>
						<li>
							<SelectBox
								label={t('lbl.USE_YN')} // 사용여부
								name="useYn"
								options={getCommonCodeList('YN', t('lbl.ALL'), '')}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
							/>
						</li>
					</UiFilterGroup>
				</UiFilterArea>
			</SearchForm>

			{/* 그리드 영역 */}
			<Splitter
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.MONITOR_GROUP')} totalCnt={props.totalCnt1} />
						</AGrid>
						<GridAutoHeight height={400}>
							<AUIGrid columnLayout={gridCol} gridProps={gridProps} ref={gridRef1} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridDetailBtn} gridTitle={t('lbl.CUSTKEYLIST')} totalCnt={props.totalCnt2} />
						</AGrid>
						<GridAutoHeight height={400}>
							<AUIGrid columnLayout={gridDetailCol} gridProps={gridDetailProps} ref={gridRef2} />
						</GridAutoHeight>
					</>,
				]}
			/>

			<ButtonWrap data-props="single">
				<Button onClick={onCloseHandler}>{t('lbl.BTN_CANCEL')}</Button>
				<Button type="primary" onClick={() => onConfirmHandler('2')}>
					{t('lbl.BTN_CONFIRM')}
				</Button>
			</ButtonWrap>
			<CmSearchWrapper ref={refModal} />
		</>
	);
};

export default TmMonitoringCustomerGroupPopup;
