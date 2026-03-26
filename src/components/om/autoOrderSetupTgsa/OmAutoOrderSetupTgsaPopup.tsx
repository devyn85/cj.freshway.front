/*
 ############################################################################
 # FiledataField	: OmAutoOrderSetupTgsaPopup.tsx
 # Description		:  당일광역보충발주관리 팝업
 # Author			: LeeJeongCheol
 # Since			: 26.03.06
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';

// component
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// utils

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';

//store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Type
import { GridBtnPropsType, GridBtnType } from '@/types/common';

// API
import {
	apiGetDetailListCheck,
	apiGetEditHistoryList,
	apiGetMasterInfoSetupList,
	apiSaveDetailList,
	apiSaveMasterInfoSetupList,
} from '@/api/om/apiOmAutoOrderSetupTgsa';
import { SelectBox } from '@/components/common/custom/form';
import fileUtil from '@/util/fileUtils';

interface PropsType {
	form?: any;
	close?: any;
	popupType?: string;
	gridData?: any;
	search?: any;
	searchType?: any;
	setSearchType?: any;
}

const OmAutoOrderSetupTgsaPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { form, close, popupType, gridData, search, searchType, setSearchType } = props;

	// 다국어
	const { t } = useTranslation();

	const [searchTypeNo, setSearchTypeNo] = useState(0);
	const [initLoad, setInitLoad] = useState(true);
	const [totalCount, setTotalCount] = useState(0);
	const gridRefs = [useRef(null), useRef(null), useRef(null)];
	const gridExcelRef = useRef(null);
	const purchaseConfCd = Form.useWatch('purchaseConfCd', form);
	const modalRef = useRef(null);

	// 엑셀 업로드
	const excelUploadFileRef = useRef(null);

	// excelCol
	// 동적생성시 체크박스 이슈
	const gridExcelCol = [
		{
			headerText: t('lbl.SKU'), // 상품코드
			dataField: 'sku',
			required: true,
			editable: false,
		},
		{
			headerText: '발주단위구분',
			dataField: 'uomDivCd',
			required: true,
			editable: false,
		},
		{
			headerText: '목표재고',
			dataField: 'qty',
			editable: false,
		},
	];

	// popupType별 column
	const gridCol = () => {
		switch (popupType) {
			case 'check': //예정량확인
				return [
					{
						headerText: t('lbl.WD_CENTER'), // 출고센터
						dataField: 'fromOrganize',
					},
					{
						headerText: t('lbl.DP_CENTER'), // 입고센터
						dataField: 'toOrganize',
					},
					{
						headerText: t('lbl.DOCDT_DP'), // 입고일자
						dataField: 'receivedt',
					},
					{
						headerText: t('lbl.SKU'), // 상품코드
						dataField: 'toSku',
					},
					{
						headerText: t('lbl.SKUNM'), // 상품명
						dataField: 'skuname',
					},
					{
						headerText: t('lbl.QTY'), // 수량
						dataField: 'toOrderqty',
					},
					{
						headerText: t('lbl.UOM'), // 단위
						dataField: 'toUom',
					},
				];
			case 'detail': // 상세설정
				return [
					{
						headerText: t('lbl.CUST_CODE'), // 고객코드
						dataField: 'confCd',
						required: true,
						commRenderer: {
							type: 'search',
							popupType: 'cust',
							searchDropdownProps: {
								dataFieldMap: {
									confCd: 'code',
									confNm: 'name',
								},
							},
							onClick: (e: any) => {
								if (e.item.rowStatus !== 'I') {
									gridRefs[0].current.openPopup(
										{
											custkey: e.item.confCd,
										},
										'cust',
									);
								} else {
									modalRef.current.handlerOpen();
								}
							},
							disabledFunction: (rowIndex: number, columnIndex: number, value: any, item: any, dataField: string) => {
								if (item.rowStatus !== 'I') {
									return true;
								}
								return false;
							},
							openDirectly: true,
						},
						styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
							if (item.rowStatus !== 'I') {
								gridRefs[0].current.removeEditClass(columnIndex);
							} else {
								// 편집 가능 class 추가
								return 'isEdit';
							}
						},
					},
					{
						headerText: t('lbl.CUST_NAME'), // 고객명
						dataField: 'confNm',
						editable: false,
					},
					{
						headerText: t('lbl.ADDWHO'), // 등록자
						dataField: 'addwho',
						visible: false,
					},
					{
						dataField: 'regNm',
						headerText: t('lbl.ADDWHO'),
						dataType: 'manager', // dataType을 'manager'로 설정
						managerDataField: 'addwho', // 노출시킨 사용자명에 해당하는 사용자ID dataField 설정
						editable: false,
					},

					{
						headerText: t('lbl.ADDDATE'), // 등록일시
						dataField: 'adddate',
						editable: false,
					},
					{
						headerText: t('lbl.EDITWHO'), // 수정자
						dataField: 'editwho',
						visible: false,
					},
					{
						dataField: 'updNm',
						headerText: t('lbl.EDITWHO'),
						dataType: 'manager', // dataType을 'manager'로 설정
						managerDataField: 'editwho', // 노출시킨 사용자명에 해당하는 사용자ID dataField 설정
						editable: false,
					},
					{
						headerText: t('lbl.EDITDATE'), // 수정일시
						dataField: 'editdate',
						editable: false,
					},
				];
			case 'history': // 변경이력
				return [
					{
						headerText: t('lbl.EDITDATE'), // 수정일시
						dataField: 'logdate',
					},
					{
						headerText: t('lbl.EDITWHO'), // 수정자
						dataField: 'logwho',
						visible: false,
					},
					{
						dataField: 'updNm',
						headerText: t('lbl.EDITWHO'),
						dataType: 'manager', // dataType을 'manager'로 설정
						managerDataField: 'logwho', // 노출시킨 사용자명에 해당하는 사용자ID dataField 설정
						editable: false,
					},
					{
						headerText: '변경사항1',
						dataField: 'logdata1',
					},
					{
						headerText: '변경사항2',
						dataField: 'logdata2',
					},
					{
						headerText: '변경사항3',
						dataField: 'logdata3',
					},
				];
		}
	};
	// 상세설정 grid2
	const gridCol2 = [
		{
			headerText: t('lbl.CLOSETYPE'), // 마감유형
			dataField: 'confCd',
			required: true,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('DAILY_DEADLINE_STO'),
				disabledFunction: (rowIndex: number, columnIndex: number, value: any, item: any, dataField: string) => {
					if (item.rowStatus !== 'I') {
						return true;
					}
					return false;
				},
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRefs[1].current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},

		{
			headerText: t('lbl.ADDWHO'), // 등록자
			dataField: 'addwho',
			visible: false,
		},
		{
			dataField: 'regNm',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager', // dataType을 'manager'로 설정
			managerDataField: 'addwho', // 노출시킨 사용자명에 해당하는 사용자ID dataField 설정
			editable: false,
		},

		{
			headerText: t('lbl.ADDDATE'), // 등록일시
			dataField: 'adddate',
			editable: false,
		},
		{
			headerText: t('lbl.EDITWHO'), // 수정자
			dataField: 'editwho',
			visible: false,
		},
		{
			dataField: 'updNm',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager', // dataType을 'manager'로 설정
			managerDataField: 'editwho', // 노출시킨 사용자명에 해당하는 사용자ID dataField 설정
			editable: false,
		},
		{
			headerText: t('lbl.EDITDATE'), // 수정일시
			dataField: 'editdate',
			editable: false,
		},
	];
	// 상세설정 grid3
	const gridCol3 = [
		{
			headerText: '원거리',
			dataField: 'confCd',
			required: true,
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (item.rowStatus !== 'I') {
					// 편집 가능 class 삭제
					gridRefs[2].current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			headerText: t('lbl.ADDWHO'), // 등록자
			dataField: 'addwho',
			visible: false,
		},
		{
			dataField: 'regNm',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager', // dataType을 'manager'로 설정
			managerDataField: 'addwho', // 노출시킨 사용자명에 해당하는 사용자ID dataField 설정
			editable: false,
		},

		{
			headerText: t('lbl.ADDDATE'), // 등록일시
			dataField: 'adddate',
			editable: false,
		},
		{
			headerText: t('lbl.EDITWHO'), // 수정자
			dataField: 'editwho',
			visible: false,
		},
		{
			dataField: 'updNm',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager', // dataType을 'manager'로 설정
			managerDataField: 'editwho', // 노출시킨 사용자명에 해당하는 사용자ID dataField 설정
			editable: false,
		},
		{
			headerText: t('lbl.EDITDATE'), // 수정일시
			dataField: 'editdate',
			editable: false,
		},
	];

	// excel props
	const gridExcelProps = { editable: false, showRowCheckColumn: true, showCustomRowCheckColumn: true };

	// popupType별 props
	const gridProps = () => {
		switch (popupType) {
			case 'check':
				return { editable: false, showRowCheckColumn: false };
			case 'detail':
				return { editable: true, showRowCheckColumn: true, showCustomRowCheckColumn: true };
			case 'history':
				return { editable: false, showRowCheckColumn: false };
		}
	};
	// popupType별 title
	const popupTitleSet = () => {
		switch (popupType) {
			case 'excel':
				return '대상상품 일괄업로드';
			case 'check':
				return '발주 예정량 확인';
			case 'detail':
				return '저장품자동발주관리 상세설정';
			case 'history':
				return '저장품자동발주관리 변경이력';
		}
	};

	/**
	 * =====================================================================
	 *	상세내역 excelupload 함수
	 * =====================================================================
	 */

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		gridExcelRef.current.changeColumnLayout(gridExcelCol);
		fileUtil.excelImport(e, 0, gridExcelBtn.tGridRef, 1, validateExcelList);
	};

	const validateExcelList = async () => {
		// 변경 데이터 확인
		const params = gridExcelRef.current.getGridData().map((item: any) => {
			// const code = getCommonCodeList('AUTO_ORD_UOM_DIV').find((el: any) => el.cdNm === item.uomDivCd);
			return {
				...item,
				// uomDivCd: code.comCd,
				purchaseCd: gridData?.purchaseCd,
				storerkey: gridData?.storerkey,
				processtype: 'excel',
			};
		});

		if (params.length === 0) {
			showMessage({
				content: t('msg.MSG_COM_ERR_008'),
				modalType: 'info',
			});
			return;
		}

		apiGetDetailListCheck(params).then(res => {
			const checkColumn = [
				{
					dataField: 'processYn',
					headerText: '체크결과',
				},
				{
					dataField: 'processMsg',
					headerText: '체크메시지',
				},
			];
			gridExcelRef.current.addColumn(checkColumn, 1);
			const rowsToUpdate = res.data.data.validExcelList;

			const updateData: any[] = [];
			const updateIndex: any[] = [];
			rowsToUpdate.forEach((row: any, index: any) => {
				const rowKeys = Object.keys(row);
				const checkKeys = ['sku', 'uomDivCd', 'qty'];
				// 3. GridData를 순회하며 일치하는 레코드를 찾습니다.
				const foundIndex = params.findIndex((gridRow: any) => {
					// 모든 키에 대해 비교를 수행합니다.
					return rowKeys.every(key => {
						// 제외 키 목록에 포함되어 있으면 비교하지 않습니다.
						if (!checkKeys.includes(key)) {
							return true; // 제외할 필드는 항상 true로 간주하여 비교를 통과시킵니다.
						}

						// --- 값 정규화(Normalize) 로직 추가 ---
						// null, undefined를 ''(빈 문자열)로 통일 처리
						const normalize = (value: any) => {
							return value === null || value === undefined ? '' : value;
						};

						const normalizedRowValue = normalize(row[key]);
						const normalizedGridValue = normalize(gridRow[key]);

						// 현재 row의 값과 gridRow의 값이 동일한지 비교합니다.
						// (두 값이 모두 null이거나 undefined인 경우도 true로 처리)
						return normalizedRowValue == normalizedGridValue;
					});
				});

				const rowIndex = gridExcelRef.current.getRowIndexesByValue('_$uid', [params[foundIndex]._$uid]);
				if (rowIndex !== undefined) {
					let processMsg;
					let processYn;
					if (row.skuChk == 'N') {
						processMsg = '존재하지 않는 상품코드여서 제외되었습니다.';
						processYn = 'N';
					} else if (row.skuDupChk == 'Y') {
						processMsg = '이미등록되어있는 상품코드여서 제외되었습니다.';
						processYn = 'N';
					} else if (row.codeChk == 'N') {
						processMsg = '존재하지 않는 발주단위구분코드여서 제외되었습니다.';
						processYn = 'N';
					} else if (row.duplicateChk == 'N') {
						processMsg = '중복된 상품코드여서 제외되었습니다.';
						processYn = 'N';
					} else {
						processMsg = '정상';
						processYn = 'Y';
					}
					updateData.push({
						processYn: processYn,
						processMsg: processMsg,
						rowStatus: 'I',
					});
					updateIndex.push(rowIndex);
				}
			});
			gridExcelRef.current.updateRows(updateData, updateIndex);
			// 오류케이스 체크 해제
			const uncheckedItems = gridExcelRef.current.getGridData().filter((item: any) => {
				return item.processYn === 'N';
			});
			const uncheckedIds = uncheckedItems.map((item: any) => item._$uid);

			gridExcelRef.current.addUncheckedRowsByIdsBefore(uncheckedIds);
		});
	};

	/**
	 * excelupload 저장
	 * @returns {void}
	 */
	const saveDetailList = async () => {
		// 변경 데이터 확인
		const params = gridExcelRef.current.getCustomCheckedRowItems().map((item: any) => {
			return {
				...item,
				purchaseCd: gridData?.purchaseCd,
				storerkey: gridData?.storerkey,
			};
		});
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.noSelect'),
				modalType: 'info',
			});
			return;
		}

		// 유효성 검사 통과 못한 데이터 확인
		const isProcessYN = params.some((item: any) => item.processYn !== 'Y');

		// 'N'인 항목이 있다면 메시지를 띄우고 함수를 종료
		if (isProcessYN) {
			showMessage({
				content: '유효성 검증이 완료되지 않은 데이터가 포함되어 있습니다.\n확인 후 다시 시도해주세요.',
				modalType: 'info',
			});
			return;
		}

		const messageWithRowStatusCount = `${t('msg.confirmSave')}
				신규 : ${params.length}건
				수정 : 0건
				삭제 : 0건`;

		// 저장하시겠습니까?
		showConfirm(null, messageWithRowStatusCount, () => {
			apiSaveDetailList(params).then((res: any) => {
				if (res.data.statusCode > -1) {
					showMessage({
						content:
							res.data.data.resultMessage === 'MSG_COM_SUC_003'
								? t('msg.' + res.data.data.resultMessage)
								: res.data.data.resultMessage,
						modalType: 'info',
						onOk: async () => {
							await search(gridData);
							close();
						},
					});
				}
			});
		});
	};

	/**
	 * =====================================================================
	 *	상세설정 함수(주문량산정상세)
	 * =====================================================================
	 */

	/**
	 * 저장품자동발주관리 상세설정 조회
	 * @returns {void}
	 */
	const searchMasterInfoSetupList = () => {
		if (!gridData[0]?.purchaseCd) {
			showMessage({
				content: '대상 자동발주 코드가 누락되어 강제종료합니다. 팝업을 재호출하셔서 시도해주세요.',
				modalType: 'info',
			});
			return;
		}

		const purchaseConfCd = form.getFieldValue('purchaseConfCd');

		if (!purchaseConfCd || purchaseConfCd === '') {
			showMessage({
				content: '상세설정은 필수 조건입니다. 선택 후 재조회 해주세요.',
				modalType: 'info',
			});
			return;
		}

		const params = {
			purchaseCd: gridData[0]?.purchaseCd,
			purchaseConfCd: purchaseConfCd,
		};

		let typeNo = 0;
		if (purchaseConfCd === 'INC_CUSTKEY') {
			typeNo = 0;
		} else if (purchaseConfCd === 'INC_CLOSETYPE') {
			typeNo = 1;
		} else if (purchaseConfCd === 'INC_DISTANCETYPE') {
			typeNo = 2;
		}

		apiGetMasterInfoSetupList(params).then((res: any) => {
			gridRefs[typeNo].current.clearGridData();
			gridRefs[typeNo].current.setGridData(res.data.data);
		});
	};

	/**
	 * 저장품자동발주관리 상세설정 저장
	 * @returns {void}
	 */
	const saveMasterInfoSetupList = () => {
		if (!purchaseConfCd) {
			showMessage({
				content: '상세설정은 필수 조건입니다. 선택 후 재시도 해주세요.',
				modalType: 'info',
			});
			return;
		}
		const params = gridRefs[searchTypeNo].current.getChangedData({ validationYn: false }).map((item: any) => ({
			...item,
			purchaseConfCd: purchaseConfCd,
			purchaseCd: gridData[0]?.purchaseCd,
			storerkey: gridData[0]?.storerkey,
		}));

		if (params.length === 0) {
			showMessage({
				content: t('msg.MSG_COM_ERR_008'),
				modalType: 'info',
			});
			return;
		}
		if (!gridRefs[searchTypeNo].current.validateRequiredGridData()) {
			return;
		}
		gridRefs[searchTypeNo].current.showConfirmSave(() => {
			apiSaveMasterInfoSetupList(params).then((res: any) => {
				const resultMessage = res.data.data.resultMessage;
				showMessage({
					content: resultMessage === 'MSG_COM_SUC_003' ? t('msg.' + resultMessage) : resultMessage,
					modalType: 'info',
					onOk: searchMasterInfoSetupList,
				});
			});
		});
	};

	/**
	 * =====================================================================
	 *	03. grid button set
	 * =====================================================================
	 */

	// popupType별 버튼 set
	const btnArr = (): GridBtnType[] => {
		switch (popupType) {
			case 'excel':
				return [
					// {
					// 	btnType: 'excelForm',
					// },
					{
						btnType: 'excelSelect',
						isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
						callBackFn: () => {
							excelUploadFileRef.current.click();
						},
					},
					{
						btnType: 'save',
						callBackFn: saveDetailList,
					},
				];
			case 'check':
				return [];
			case 'detail':
				return [
					{
						btnType: 'plus', // 행추가
						initValues: {
							rowStatus: 'I',
						},
					},
					{
						btnType: 'delete', // 행삭제
					},
					{
						btnType: 'save',
						callBackFn: saveMasterInfoSetupList,
					},
				];
			case 'history':
				return [];
		}
	};

	/**
	 * 엑셀 양식 다운로드
	 * 로케이션 일괄업로드만 공통 기능을 사용하지 않고 버튼으로 추가(별도양식)
	 */
	const onExcelDownload = () => {
		const params = {
			dirType: 'excel',
			attchFileNm: '저장품_자동발주_관리_상세내역.xlsx',
		};

		fileUtil.downloadFile(params);
	};

	const gridExcelBtn: GridBtnPropsType = {
		tGridRef: gridExcelRef, // 타겟 그리드 Ref
		btnArr: btnArr(),
	};

	// 그리드 버튼 설정
	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRefs[0], // 타겟 그리드 Ref
		btnArr: btnArr(),
	};
	// 그리드 버튼 설정
	const gridBtn2: GridBtnPropsType = {
		tGridRef: gridRefs[1], // 타겟 그리드 Ref
		btnArr: btnArr(),
	};
	// 그리드 버튼 설정
	const gridBtn3: GridBtnPropsType = {
		tGridRef: gridRefs[2], // 타겟 그리드 Ref
		btnArr: btnArr(),
	};

	// 그리드 title 설정
	const gridTitle = () => {
		if (popupType === 'excel') {
			return '일괄업로드 목록';
		} else if (popupType === 'detail') {
			return '상세설정 목록';
		}
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		// 저장품자동발주관리 상세설정(주문량산정상세)
		if (popupType === 'detail') {
			// 에디팅 시작 이벤트 바인딩
			for (let i = 0; i < 3; i++) {
				gridRefs[i].current.bind('cellEditBegin', function (event: any) {
					const rowIdField = gridRefs[i].current.getProp('rowIdField');
					// 신규행만 수정 가능
					if (event.dataField == 'confCd') {
						return gridRefs[i].current.isAddedById(event.item[rowIdField]);
					} else {
						return true; // 다른 필드들은 편집 허용
					}
				});
			}
			form.setFieldValue('purchaseConfCd', searchType);
		}
		// 수정이력
		if (popupType === 'history') {
			const params = gridData[0];
			apiGetEditHistoryList(params).then((res: any) => {
				gridRefs[0].current.clearGridData();
				gridRefs[0].current.appendData(res.data.data);
				setTotalCount(res.data.data.length);
				const colSizeList = gridRefs[0].current.getFitColumnSizeList(true);
				gridRefs[0].current.setColumnSizeList(colSizeList);
			});
		}
	};

	// 페이지 버튼 함수 바인딩
	const titleFunc = {
		searchYn: searchMasterInfoSetupList, // 조회
	};

	const confirmPopupCust = (selectedRow: any) => {
		gridRefs[0].current.setCellValue(gridRefs[0].current.getSelectedIndex()[0], 'confCd', selectedRow[0].code);
		gridRefs[0].current.setCellValue(gridRefs[0].current.getSelectedIndex()[0], 'confNm', selectedRow[0].name);
		modalRef.current.handlerClose();
	};

	const closeEventCust = () => {
		modalRef.current.handlerClose();
	};

	/**
	 * =====================================================================
	 *	04. react hook event
	 * =====================================================================
	 */

	// 그리드 init
	useEffect(() => {
		initEvent();
	}, []);

	// 그리드 Data 조회되면 그리드에 추가
	useEffect(() => {
		if (gridData.length > 0 && popupType === 'check') {
			setTotalCount(gridData.length);
			gridRefs[0].current.clearGridData();
			gridRefs[0].current.appendData(gridData);
			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			const colSizeList = gridRefs[0].current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRefs[0].current.setColumnSizeList(colSizeList);
		}
	}, [gridData, popupType]);

	// 상세설정 setting
	useEffect(() => {
		if (popupType === 'detail') {
			if (purchaseConfCd) {
				setSearchType(purchaseConfCd);
				if (purchaseConfCd === 'INC_CUSTKEY') {
					setSearchTypeNo(0);
				} else if (purchaseConfCd === 'INC_CLOSETYPE') {
					setSearchTypeNo(1);
				} else if (purchaseConfCd === 'INC_DISTANCETYPE') {
					setSearchTypeNo(2);
				}
			} else {
				gridRefs.forEach(grid => {
					grid?.current?.resize();
					grid?.current?.clearGridData();
				});
			}
		}
	}, [purchaseConfCd]);

	// 상세설정 setting
	useEffect(() => {
		if (popupType === 'detail') {
			gridRefs.forEach((grid, i) => {
				if (grid) {
					if (i === searchTypeNo) {
						grid.current.resize();
					} else {
						grid.current.clearGridData();
					}
				}
			});
			if (initLoad && purchaseConfCd) {
				searchMasterInfoSetupList();
				setInitLoad(false);
			}
		}
	}, [searchTypeNo, purchaseConfCd]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={popupTitleSet()} showButtons={popupType === 'detail'} func={titleFunc} />
			{popupType === 'detail' && (
				<li>
					<SelectBox //속성
						name="purchaseConfCd"
						label={'상세 설정 명칭'}
						span={24}
						options={getCommonCodeList('AUTO_ORD_DETAIL_SET', t('lbl.ALL'), null)}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
						// onChange={(type: string) => onChange(type)}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>
			)}
			<li
				style={{
					display:
						(popupType === 'detail' && searchType === 'INC_CUSTKEY') || popupType !== 'detail' ? 'block' : 'none',
				}}
			>
				<AGrid>
					{popupType === 'detail' && <GridTopBtn gridBtn={gridBtn1} gridTitle={gridTitle()} />}
					{popupType === 'excel' && (
						<GridTopBtn gridBtn={gridExcelBtn} gridTitle={gridTitle()}>
							{/* "양식 다운로드"를 gridBtn으로 넘기지 않고 버튼으로 추가 */}
							<Button onClick={onExcelDownload}>양식다운로드</Button>
						</GridTopBtn>
					)}
					{(popupType === 'history' || popupType === 'check') && (
						<em>총 {commUtil.changeNumberFormatter(totalCount)}건</em>
					)}
					{popupType === 'excel' && (
						<AUIGrid ref={gridExcelRef} columnLayout={gridExcelCol} gridProps={gridExcelProps} />
					)}
					{popupType !== 'excel' && <AUIGrid ref={gridRefs[0]} columnLayout={gridCol()} gridProps={gridProps()} />}
				</AGrid>
			</li>
			{popupType === 'detail' && (
				<li style={{ display: searchType === 'INC_CLOSETYPE' ? 'block' : 'none' }}>
					<AGrid>
						<GridTopBtn gridBtn={gridBtn2} gridTitle={gridTitle()} />
						<AUIGrid ref={gridRefs[1]} columnLayout={gridCol2} gridProps={gridProps()} />
					</AGrid>
				</li>
			)}
			{popupType === 'detail' && (
				<li style={{ display: searchType === 'INC_DISTANCETYPE' ? 'block' : 'none' }}>
					<AGrid>
						<GridTopBtn gridBtn={gridBtn3} gridTitle={gridTitle()} />
						<AUIGrid ref={gridRefs[2]} columnLayout={gridCol3} gridProps={gridProps()} />
					</AGrid>
				</li>
			)}
			<ButtonWrap data-props="single">
				<Button onClick={close}>{t('lbl.BTN_CANCEL')}</Button>
			</ButtonWrap>
			{/* 엑셀 파일 업로드 INPUT 영역 */}
			<input
				ref={excelUploadFileRef}
				id="excelUploadInput"
				type="file"
				onChange={onFileChange}
				onClick={(e: any) => {
					e.target.value = null;
				}}
				style={{ display: 'none' }}
			/>
			<CustomModal ref={modalRef} width="1000px">
				<CmSearchPopup type={'cust'} callBack={confirmPopupCust} close={closeEventCust}></CmSearchPopup>
			</CustomModal>
		</>
	);
};

export default OmAutoOrderSetupTgsaPopup;
