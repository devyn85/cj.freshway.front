// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Lib
import { InputNumber, InputText, SelectBox } from '@/components/common/custom/form';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form, Input } from 'antd';
import dayjs from 'dayjs';

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';
import TableTopBtn from '@/components/common/TableTopBtn';

import CustomModal from '@/components/common/custom/CustomModal';
import MsCustHistPopup from '@/components/ms/popup/MsCustHistPopup';
import MsSkuUploadExcelPopup from '@/components/ms/sku/MsSkuUploadExcelPopup';

// API Call Function
import { apiGetCbmList, apiGetMaster, apiPostSaveCbm, apiPostSaveMaster, apiPostSaveSkuPlt } from '@/api/ms/apiMsSku';

// Store
import GridAutoHeight from '@/components/common/GridAutoHeight';
import ScrollBox from '@/components/common/ScrollBox';
import Splitter from '@/components/common/Splitter';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import styled from 'styled-components';

const MsSkuDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// 다국어
	const { t } = useTranslation();

	// 컴포넌트 접근을 위한 Ref
	const gridRef1 = useRef(null);
	const modalRef = useRef(null);
	const modalRef2 = useRef(null);
	const detailForm = props.detailForm;

	const [formDisabled, setFormDisabled] = useState(true);
	const [selectedSku, setSelectedSku] = useState('');

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================
	// 저장조건
	const storageTypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('STORAGETYPE', value)?.cdNm;
	};
	// 유통기한관리방법
	const durationTypeLabelFunc = (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
		if ((commUtil.isEmpty(value) || value === 'N') && item.duration === '9999') {
			// 소비기한관리방법 문구 나오는 조건 N 도 추가.
			return '소비기한관리안함';
		} else {
			return getCommonCodebyCd('DURATIONTYPE', value)?.cdNm;
		}
	};
	// 상품유형
	const skuTypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('SKUTYPE', value)?.cdNm;
	};
	// 라벨유형
	const labelTypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('PAPERTYPE_DP', value)?.cdNm;
	};
	// 유통이력신고기관
	const serialTypeLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('PRODUCT-DRTYN', value)?.cdNm;
	};

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'description',
			headerText: t('lbl.DESCRIPTION'),
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'storageType',
			headerText: t('lbl.STORAGETYPE'),
			dataType: 'code',
			labelFunction: storageTypeLabelFunc,
			editable: false,
		},
		{
			dataField: 'durationType',
			headerText: t('lbl.DURATIONTYPE'),
			dataType: 'code',
			labelFunction: durationTypeLabelFunc,
			editable: false,
		},
		{
			dataField: 'duration',
			headerText: t('lbl.DURATION'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'qtyPerBox',
			headerText: t('lbl.QTYPERBOX'),
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'netWeight',
			headerText: t('lbl.NETWEIGHT'), // 실중량
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
		},
		{
			dataField: 'baseUom',
			headerText: t('lbl.BASEUOM'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'purchaseUom',
			headerText: t('lbl.PURCHASEUOM_WD'),
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'returnUom',
			headerText: t('lbl.RETURNUOM'),
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'skuType',
			headerText: t('lbl.SKUTYPE'),
			dataType: 'code',
			labelFunction: skuTypeLabelFunc,
			editable: false,
		},
		{
			dataField: 'skuClass',
			headerText: t('lbl.SKUCLASS'),
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'serialType',
			// headerText: t('lbl.SERIALTYPE_SN'),
			headerText: '유통이력신고기관',
			dataType: 'code',
			labelFunction: serialTypeLabelFunc,
			editable: false,
		},
		// {
		// 	dataField: 'boxPerPlt',
		// 	headerText: t('lbl.BOXPERPLT'),
		// 	dataType: 'numeric',
		// 	editRenderer: {
		// 		type: 'InputEditRenderer',
		// 		onlyNumeric: true,
		// 	},
		// },
		// {
		// 	dataField: 'layerPerPlt',
		// 	headerText: t('lbl.LAYERPERPLT'),
		// 	dataType: 'numeric',
		// 	editRenderer: {
		// 		type: 'InputEditRenderer',
		// 		onlyNumeric: true,
		// 	},
		// },
		// {
		// 	dataField: 'boxPerLayer',
		// 	headerText: t('lbl.BOXPERLAYER'),
		// 	dataType: 'numeric',
		// 	editRenderer: {
		// 		type: 'InputEditRenderer',
		// 		onlyNumeric: true,
		// 	},
		// },
		// {
		// 	dataField: 'putawayType',
		// 	headerText: '전용상품여부',
		// 	dataType: 'string',
		// 	editable: false,
		// },
		{
			dataField: 'putawayType',
			headerText: t('lbl.CHANNEL_DMD'),
			dataType: 'string',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('PUTAWAYTYPE', value)?.cdNm;
			},
		},
		{
			dataField: 'serialYn',
			headerText: t('lbl.SERIALYN'),
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'line01',
			headerText: t('lbl.SKUNOTFIXEDAMOUNTYN'),
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'custKey',
			headerText: t('lbl.VENDOR'),
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'custName',
			headerText: t('lbl.VENDORNAME'),
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'reference01',
			headerText: t('lbl.PLNAME'),
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'somdName',
			headerText: t('lbl.SOMDCODE'),
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'labelType',
			headerText: t('lbl.LABELTYPE'),
			dataType: 'code',
			labelFunction: labelTypeLabelFunc,
			editable: false,
		},
		{
			dataField: 'addWho',
			visible: false,
		},
		{
			dataField: 'addWhoNm',
			headerText: t('lbl.ADDWHO'),
			editable: false,
			dataType: 'manager',
			managerDataField: 'addWho',
		},
		{
			dataField: 'addDate',
			headerText: t('lbl.ADDDATE'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'editWho',
			visible: false,
		},
		{
			dataField: 'editWhoNm',
			headerText: t('lbl.EDITWHO'),
			editable: false,
			dataType: 'manager',
			managerDataField: 'editWho',
		},
		{
			dataField: 'editDate',
			headerText: t('lbl.EDITDATE'),
			dataType: 'date',
			editable: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: false,
		enableFilter: true,
	};

	const cbmGridProps = {
		editable: true,
		showRowCheckColumn: true,
		enableFilter: true,
		fillColumnSizeMode: false,
		autoGridHeight: false,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('cellEditEnd', (event: any) => {
			gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'U');
		});

		gridRef1?.current.bind('cellEditEnd', (event: any) => {
			// if (event.columnIndex === 4) {
			// 	const regExp = /^\d{0,9}(\.\d{0,3})?$/;
			// 	if (event.newValue !== '' && !regExp.test(event.newValue)) {
			// 		showMessage({
			// 			content: t('정수 9자리, 소수점 3자리 이내로 입력하세요.'),
			// 			modalType: 'error',
			// 		});
			// 		return false;
			// 	}
			// }

			if (event.dataField !== 'length' && event.dataField !== 'width' && event.dataField !== 'height') {
				return;
			}

			const gridRefCur = gridRef1.current;
			if (gridRefCur) {
				const rowData = gridRefCur.getItemByRowIndex(event.rowIndex);
				const length = Number(rowData.length ?? 0);
				const width = Number(rowData.width ?? 0);
				const height = Number(rowData.height ?? 0);

				// cubeDescr 셀 입력
				const cubeDescr = length + '-' + width + '-' + height;
				gridRefCur.setCellValue(event.rowIndex, 'cubeDescr', cubeDescr);
				// 체적(CBM) 계산 (mm -> cm 변환 후 곱셈)
				const cube = (length / 10) * (width / 10) * (height / 10);
				gridRefCur.setCellValue(event.rowIndex, 'cube', cube);
				gridRefCur.setCellValue(event.rowIndex, 'rowStatus', 'U');
			}
		});

		/**
		 * 그리드 셀 더블클릭
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('cellDoubleClick', (event: any) => {
			// 선택된 셀(행)의 상세 정보를 조회한다.
			//searchDtl(event.item);
		});

		/**
		 * 그리드 셀 선택전에 실행
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('selectionConstraint', (event: any) => {
			const { toRowIndex } = event;

			if (detailForm.getFieldValue('rowStatus') === 'U') {
				// selectionConstraint에서는 즉시 false를 반환하여 선택을 일단 막음
				// 그 후 별도의 함수에서 confirm을 띄우고 수동으로 선택 처리
				handleBlockedSelection(toRowIndex);
				return false;
			}
		});

		// selectionConstraint에서 호출될 함수
		const handleBlockedSelection = (rowIndex: any) => {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				gridRef?.current.setSelectionByIndex(rowIndex);
			});
		};

		/**
		 * 그리드 셀 선택 변경
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('selectionChange', (event: any) => {
			const selectedRow = gridRef?.current.getSelectedRows();
			const params = selectedRow[0];

			// serialKey 같으면 상세조회 하지 않음
			if (selectedRow[0].serialKey === detailForm.getFieldValue('serialKey')) {
				return false;
			}

			apiGetMaster(params).then(res => {
				detailForm.resetFields();

				const dataFromDB = {
					...res.data,
					addDate: dayjs(res.data.addDate, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss'),
					editDate: dayjs(res.data.editDate, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss'),
				};
				setFormDisabled(false);
				detailForm.setFieldsValue(dataFromDB);
				setSelectedSku(dataFromDB.sku);
			});

			apiGetCbmList(params).then(res => {
				gridRef1.current?.setGridData(res.data);
			});
		});
	};

	/**
	 * 상세저장
	 * @returns {void}
	 */
	const saveMaster = async () => {
		// 입력 값 검증
		const isValid = await validateForm(detailForm);
		if (!isValid) {
			return;
		}

		if (detailForm.getFieldValue('qtyPerBox') === 0) {
			showMessage({
				content: t('박수입수에 0을 입력할 수 없습니다.'),
				modalType: 'info',
			});
			return;
		}

		// 변경 여부 검증
		if (detailForm.getFieldValue('rowStatus') === 'R') {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		const params = detailForm.getFieldsValue(true);

		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			apiPostSaveMaster(params).then(() => {
				detailForm.setFieldValue('rowStatus', 'R');
				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
					onOk: () => {
						apiGetMaster(params).then(res => {
							detailForm.resetFields();
							gridRef1.current?.setGridData([]);

							const dataFromDB = {
								...res.data,
								addDate: dayjs(res.data.addDate, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss'),
								editDate: dayjs(res.data.editDate, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss'),
							};
							setFormDisabled(false);
							detailForm.setFieldsValue(dataFromDB);

							gridRef.current.setSelectedRowValue({ ...dataFromDB });
							// AUIGrid 변경이력 Cache 삭제
							gridRef.current.resetUpdatedItems();

							setSelectedSku(dataFromDB.sku);
						});

						apiGetCbmList(params).then(res => {
							gridRef1.current?.setGridData(res.data);
						});
					},
				});
			});
		});
	};

	/**
	 * 저장
	 * @returns {void}
	 */
	const saveMasterList = () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = gridRef.current.getChangedData({ validationYn: false });

		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		if (!gridRef.current.validateRequiredGridData()) return;

		// 저장 실행
		// showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
		gridRef.current.showConfirmSave(() => {
			apiPostSaveSkuPlt(updatedItems).then(res => {
				// 전체 체크 해제
				gridRef.current.setAllCheckedRows(false);
				// AUIGrid 변경이력 Cache 삭제
				gridRef.current.resetUpdatedItems();
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});
				}
			});
		});
	};

	/**
	 * CBM 저장
	 * @returns {void}
	 */
	const saveCbmList = () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = gridRef1.current.getChangedData();

		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		// 저장 실행
		// showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
		gridRef1.current.showConfirmSave(() => {
			apiPostSaveCbm(updatedItems).then(() => {
				gridRef1.current.setAllCheckedRows(false);
				gridRef1.current.resetUpdatedItems();
				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
				});
			});
		});
	};

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 * @param {any} changedValues 변경된 값
	 * @param {any} allValues 전체 값
	 */
	const onValuesChange = (changedValues: any, allValues: any) => {
		// 팔렛당박스수, 박스입수 값이 변경되면, CUBE_CBM 계산
		// if (Object.keys(changedValues).indexOf('boxPerPlt') > -1 || Object.keys(changedValues).indexOf('qtyPerBox') > -1) {
		// 	const boxPerPlt = allValues.boxPerPlt ?? 0;
		// 	const qtyPerBox = allValues.qtyPerBox ?? 0;

		// 	if (boxPerPlt && qtyPerBox) {
		// 		detailForm.setFieldsValue({
		// 			cubeCbm: (boxPerPlt * qtyPerBox) / 1000000,
		// 		});
		// 	}
		// }
		if (detailForm.getFieldValue('rowStatus') !== 'I') {
			detailForm.setFieldValue('rowStatus', 'U');
		}
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'save', // 저장
			// 	callBackFn: saveMasterList,
			// },
		],
	};

	const gridBtn1: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'plus', // 행추가
			// initValues: {
			// 	menuYn: 0,
			// 	useYn: 0,
			// },
			// },
			// {
			// 	btnType: 'delete', // 행삭제
			// },
			{
				btnType: 'save', // 저장
				callBackFn: saveCbmList,
			},
		],
	};

	// 표 버튼 설정
	const tableBtn: TableBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'pre', // 이전
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					// Form 변경 감지 체크
					if (detailForm.getFieldValue('rowStatus') === 'U') {
						showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
							// 그리드 이전 Row 선택 Function
							gridRef.current.setPrevRowSelected();
						});
					} else {
						gridRef.current.setPrevRowSelected();
					}
				},
			},
			{
				btnType: 'post', // 다음
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					// Form 변경 감지 체크
					if (detailForm.getFieldValue('rowStatus') === 'U') {
						showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
							// 다음 Row 선택 Function
							gridRef.current.setNextRowSelected();
						});
					} else {
						gridRef.current.setNextRowSelected();
					}
				},
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveMaster,
			},
		],
	};

	// 진행상태
	const statusLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('STATUS_UOM', value)?.cdNm;
	};
	// 삭제여부
	const delYnLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('DEL_YN', value)?.cdNm;
	};
	// 그리드 초기화
	const cbmGridCol = [
		{
			dataField: 'uom',
			headerText: '단위',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'bunja',
			headerText: '분자',
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'bunmo',
			headerText: '분모',
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'grossWeight',
			headerText: '총중량',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true, // 0~9 까지만 허용
				allowPoint: true, // onlyNumeric 인 경우 소수점(.) 도 허용
				allowNegative: false, // onlyNumeric 인 경우 음수(-) 도 허용
				// decimalPrecision: 3, // 소수점 3 자리까지만 허용
				// regExp: /^\d{0,9}(\.\d{0,3})?$/, // 정수부 최대 9자리, 소수부 최대 3자리
				validator: function (oldValue: any, newValue: any, item: any) {
					const regExp = /^\d{0,9}(\.\d{0,3})?$/;
					if (newValue === '' || regExp.test(newValue)) {
						return { validate: true };
					}
					return {
						validate: false,
						message: '정수 9자리, 소수점 3자리 이내로 입력하세요.',
					};
				},
			},
		},
		{
			dataField: 'netWeight',
			headerText: '실중량',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true, // 0~9 까지만 허용
				allowPoint: true, // onlyNumeric 인 경우 소수점(.) 도 허용
				allowNegative: false, // onlyNumeric 인 경우 음수(-) 도 허용
				// decimalPrecision: 3, // 소수점 3 자리까지만 허용
				// egExp: /^\d{0,9}(\.\d{0,3})?$/, // 정수부 최대 9자리, 소수부 최대 3자리
				validator: function (oldValue: any, newValue: any, item: any) {
					const regExp = /^\d{0,9}(\.\d{0,3})?$/;
					if (newValue === '' || regExp.test(newValue)) {
						return { validate: true };
					}
					return {
						validate: false,
						message: '정수 9자리, 소수점 3자리 이내로 입력하세요.',
					};
				},
			},
		},
		{
			headerText: 'CBM(mm)',
			children: [
				{
					dataField: 'length',
					headerText: '길이',
					dataType: 'numeric',
					editRenderer: {
						type: 'InputEditRenderer',
						onlyNumeric: true, // 0~9 까지만 허용
						allowPoint: true, // onlyNumeric 인 경우 소수점(.) 도 허용
						allowNegative: false, // onlyNumeric 인 경우 음수(-) 도 허용
					},
				},
				{
					dataField: 'width',
					headerText: '너비',
					dataType: 'numeric',
					editRenderer: {
						type: 'InputEditRenderer',
						onlyNumeric: true, // 0~9 까지만 허용
						allowPoint: true, // onlyNumeric 인 경우 소수점(.) 도 허용
						allowNegative: false, // onlyNumeric 인 경우 음수(-) 도 허용
					},
				},
				{
					dataField: 'height',
					headerText: '높이',
					dataType: 'numeric',
					editRenderer: {
						type: 'InputEditRenderer',
						onlyNumeric: true, // 0~9 까지만 허용
						allowPoint: true, // onlyNumeric 인 경우 소수점(.) 도 허용
						allowNegative: false, // onlyNumeric 인 경우 음수(-) 도 허용
					},
				},
			],
		},
		{
			dataField: 'cube',
			headerText: '체적(cm)',
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true, // 0~9 까지만 허용
				allowPoint: true, // onlyNumeric 인 경우 소수점(.) 도 허용
				allowNegative: false, // onlyNumeric 인 경우 음수(-) 도 허용
			},
		},
		{
			dataField: 'cubeDescr',
			headerText: '체적명',
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'delYn',
			headerText: '삭제여부',
			dataType: 'code',
			labelFunction: delYnLabelFunc,
			editable: false,
		},
		{
			dataField: 'status',
			headerText: '진행상태',
			dataType: 'code',
			labelFunction: statusLabelFunc,
			editable: false,
		},
	];

	/**
	 * 엑셀 업로드 팝업
	 */
	const onExcelUploadPopupClick = () => {
		modalRef.current.handlerOpen();
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		modalRef.current.handlerClose();
	};

	/**
	 * CBM 이력 팝업
	 */
	const onCbmHistPopupClick = () => {
		modalRef2.current.handlerOpen();
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent2 = () => {
		modalRef2.current.handlerClose();
	};

	/**
	 * CBM 이력 팝업 Callbank
	 * @param data
	 */
	const selectCbmHistPopup = (data: any) => {
		const gridData = gridRef1.current?.getGridData();
		const rowIndex = gridData.findIndex((row: any) => row.uom === data.baseUom);
		gridRef1.current.setCellValue(rowIndex, 'length', data.length);
		gridRef1.current.setCellValue(rowIndex, 'width', data.width);
		gridRef1.current.setCellValue(rowIndex, 'height', data.height);
		gridRef1.current.setCellValue(rowIndex, 'cube', data.length * data.width * data.height);
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		gridRef?.current?.resize?.('100%', '100%');
		gridRef1?.current?.resize?.('100%', '100%');
	}, []);

	useEffect(() => {
		resizeAllGrids();
	}, []);

	return (
		<>
			<Splitter
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridTitle="목록" totalCnt={props.totalCnt} gridBtn={gridBtn}>
								{/* <Button onClick={onExcelUploadPopupClick}>{t('lbl.EXCELUPLOAD')}</Button> */}
								{/* <Button onClick={onExcelUploadPopupClick}>{t('lbl.EXCELDOWNLOAD')}</Button> */}
							</GridTopBtn>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
						</GridAutoHeight>
						<CustomModal ref={modalRef} width="1000px">
							<MsSkuUploadExcelPopup close={closeEvent} />
						</CustomModal>
					</>,
					<Splitter
						key="msSku-right-splitter"
						direction="vertical"
						onResizing={resizeAllGrids}
						onResizeEnd={resizeAllGrids}
						items={[
							<>
								<CustomForm
									form={detailForm}
									onValuesChange={onValuesChange}
									initialValues={{ rowStatus: 'R' }}
									disabled={formDisabled}
								>
									<AGrid>
										<TableTopBtn tableTitle={'상세정보'} tableBtn={tableBtn} className="fix-title" />
									</AGrid>
									<ScrollBox>
										<AGrid className="form-inner">
											<UiDetailViewArea>
												<UiDetailViewGroup className="grid-column-2">
													<Form.Item name="rowStatus" hidden>
														<Input />
													</Form.Item>
													<Form.Item name="serialKey" hidden>
														<Input />
													</Form.Item>
													<li>
														<InputText name="sku" label={t('lbl.SKUCD')} disabled={true} /> {/* 상품코드 */}
													</li>
													<li>
														<SelectBox
															name="skuGroup"
															label={t('lbl.SKUGROUP')}
															disabled={true}
															options={getCommonCodeList('SKUGROUP', '--- 선택---')}
															fieldNames={{ label: 'cdNm', value: 'comCd' }}
														/>
														{/* 상품분류 */}
													</li>
													<li>
														<SelectBox
															name="skuType"
															label={t('lbl.SKUTYPE')}
															disabled={true}
															options={getCommonCodeList('SKUTYPE', '--- 선택---')}
															fieldNames={{ label: 'cdNm', value: 'comCd' }}
														/>
														{/* 상품유형-1 */}
													</li>
													<li>
														<SelectBox
															name="skuClass"
															label={t('lbl.SKUCLASS')}
															disabled={true}
															options={getCommonCodeList('SKUCLASS', '--- 선택---')}
															fieldNames={{ label: 'cdNm', value: 'comCd' }}
														/>
														{/* 상품유형-2 */}
													</li>
													<li>
														<InputText name="skuLdesc" label={t('lbl.CLASS_BIG')} disabled={true} /> {/* 대분류 */}
													</li>
													<li>
														<InputText name="skuMdesc" label={t('lbl.CLASS_MIDDLE')} disabled={true} /> {/* 중분류 */}
													</li>
													<li>
														<InputText name="skuSdesc" label={t('lbl.CLASS_SMALL')} disabled={true} /> {/* 소분류 */}
													</li>
													<li>
														<InputText name="skuDdesc" label={t('lbl.CLASS_DETAIL')} disabled={true} /> {/* 세분류 */}
													</li>
													<li style={{ gridColumn: 'span 2' }}>
														<InputText name="description" label={t('lbl.SKUNAME')} disabled={true} /> {/* 상품명칭 */}
													</li>
												</UiDetailViewGroup>
											</UiDetailViewArea>

											<UiDetailViewArea>
												<UiDetailViewGroup className="grid-column-2">
													<li style={{ gridColumn: 'span 2' }}>
														<InputText name="imageUrl1" label={t('lbl.SKUDETAILINFO')} disabled={true} />{' '}
														{/* 상품상세정보 */}
													</li>
													<li style={{ gridColumn: 'span 2' }}>
														<InputText name="invoiceDescr" label={t('lbl.INVOICEDESCR')} disabled={true} />{' '}
														{/* 운송장명칭 */}
													</li>
													<li>
														<SelectBox
															name="putawayType"
															label={t('lbl.PUTAWAYTYPE')}
															disabled={true}
															options={getCommonCodeList('PUTAWAYTYPE', '--- 선택---')}
															fieldNames={{ label: 'cdNm', value: 'comCd' }}
														/>
														{/* 적치유형 */}
													</li>
													<li>
														<InputText name="barcode1" label={t('lbl.BARCODE1')} disabled={true} /> {/* 바코드 */}
													</li>
													<li>
														<InputText name="barcode2" label={t('lbl.BARCODE2')} disabled={true} /> {/* 바코드 */}
													</li>
													<li>
														<InputText name="barcode3" label={t('lbl.BARCODE3')} disabled={true} /> {/* 바코드 */}
													</li>
													<li>
														<SelectBox
															name="riceYn"
															label={t('lbl.RICE_YN')}
															options={getCommonCodeList('YN', '--- 선택---')}
															fieldNames={{ label: 'cdNm', value: 'comCd' }}
														/>
														{/* 미곡여부 */}
													</li>
													{/* <li>
									<InputText name="cubeCbm" label={t('lbl.CUBE_CBM')} disabled={true} />
								</li> */}
													<li>
														<InputText name="" label={t('lbl.CBM_CORRECTION_VALUE')} disabled={true} />{' '}
														{/* @CBM보정값 */}
													</li>
													<li>
														<InputText name="netWeight" label={t('lbl.NETWEIGHT')} disabled={true} /> {/* 실중량 */}
													</li>
													<li>
														<InputNumber
															name="grossWeight"
															label={t('lbl.GROSSWEIGHT')}
															min={0}
															precision={3}
															onBlur={(e: any) => {
																const reg = /^\d{0,9}(\.\d{0,3})?$/;
																if (!e.target.value && !reg.test(e.target.value.toString())) {
																	detailForm.setFieldValue('grossWeight', e.target.value);
																}
															}}
															disabled={true}
														/>
														{/* 총중량 */}
													</li>
													<li>
														<InputText name="cubeDescr1" label={t('lbl.CUBEDESCR_L')} disabled={true} />{' '}
														{/* 체적명칭(길이) */}
													</li>
													<li>
														<InputText name="cubeDescr2" label={t('lbl.CUBEDESCR_W')} disabled={true} />{' '}
														{/* 체적명칭(넓이) */}
													</li>
													<li>
														<InputText name="cubeDescr3" label={t('lbl.CUBEDESCR_H')} disabled={true} />{' '}
														{/* 체적명칭(높이) */}
													</li>
												</UiDetailViewGroup>
											</UiDetailViewArea>

											<UiDetailViewArea>
												<UiDetailViewGroup className="grid-column-2">
													<li>
														<InputNumber name="qtyPerBox" label={t('lbl.QTYPEROUTBOX')} disabled={true} />
														{/* 박스입수 */}
													</li>
													{/* <li>
									<InputNumber name="boxPerPlt" label={t('lbl.BOXPERPLT')} min={1} />
								</li> */}
													<li>
														<InputText name="qtyPerPack" label={t('lbl.QTYPERPACK')} disabled={true} /> {/* 팩당입수 */}
													</li>
													<li>
														<InputText name="baseUom" label={t('lbl.BASEUOM')} disabled={true} /> {/* 기본UOM */}
													</li>
													{/* <li>
									<InputNumber name="layerPerPlt" label={t('lbl.LAYERPERPLT')} min={0} />
								</li>
								<li>
									<InputNumber name="boxPerLayer" label={t('lbl.BOXPERLAYER')} min={0} />
								</li> */}
													<li>
														<InputText name="styleCode" label={t('lbl.STYLECODE')} disabled={true} /> {/* 스타일 */}
													</li>
													<li>
														<InputText name="styleDescr" label={t('lbl.STYLEDESCR')} disabled={true} /> {/* 스타일명 */}
													</li>
													<li>
														<InputText name="purchaseUom" label={t('lbl.PURCHASEUOM')} disabled={true} />{' '}
														{/* 구매단위 */}
													</li>
													<li>
														<InputText name="returnUom" label={t('lbl.RETURNUOM')} disabled={true} />{' '}
														{/* 반품주문단위 */}
													</li>
													<li>
														<InputText name="instrategy" label={t('lbl.INSTRATEGY')} disabled={true} /> {/* 입고전략 */}
													</li>
													<li>
														<SelectBox
															name="handlestrategy"
															label={t('lbl.HANDLESTRATEGY')}
															disabled={true}
															options={getCommonCodeList('HANDLESTRATEGY', '--- 선택---')}
															fieldNames={{ label: 'cdNm', value: 'comCd' }}
														/>
														{/* 취급방법 */}
													</li>
													<li>
														<SelectBox
															name="disusestrategy"
															label={t('lbl.DISUSESTRATEGY')}
															disabled={true}
															options={getCommonCodeList('DISUSESTRATEGY', '--- 선택---')}
															fieldNames={{ label: 'cdNm', value: 'comCd' }}
														/>
														{/* 폐기물분담금대상유 */}
													</li>
													<li>
														<SelectBox
															name="styleCode"
															label={t('lbl.SUBCONTRACTFEEYN')}
															options={getCommonCodeList('YN', '--- 선택---')}
															fieldNames={{ label: 'cdNm', value: 'comCd' }}
														/>
														{/* 도급비정산여부 */}
													</li>
													<li>
														<SelectBox
															name="durationType"
															label={t('lbl.DURATIONTYPE')}
															disabled={true}
															options={getCommonCodeList('DURATIONTYPE', '--- 선택---')}
															fieldNames={{ label: 'cdNm', value: 'comCd' }}
														/>
														{/* 유통기한관리방법 */}
													</li>
													<li>
														<InputText name="duration" label={t('lbl.DURATION')} disabled={true} /> {/* 유통기간 */}
													</li>
													<li>
														<SelectBox
															name="serialYn"
															label={t('lbl.SERIALYN')}
															disabled={true}
															options={getCommonCodeList('YN', '--- 선택---')}
															fieldNames={{ label: 'cdNm', value: 'comCd' }}
														/>
														{/* 식별번호유무 */}
													</li>
													<li>
														<SelectBox
															name="labelType"
															label={t('lbl.LABELTYPE')}
															options={getCommonCodeList('PAPERTYPE_DP', '--- 선택---')}
															fieldNames={{ label: 'cdNm', value: 'comCd' }}
														/>
														{/* LABELTYPE */}
													</li>
													<li>
														<InputText name="placeOfOrigin" label={t('lbl.PLACEOFORIGIN')} disabled={true} />{' '}
														{/* 원산지 */}
													</li>
													<li>
														<InputText name="countryOfOrigin" label={t('lbl.COUNTRYOFORIGIN')} disabled={true} />{' '}
														{/* 원산국 */}
													</li>
													<li>
														<SelectBox
															name="storageType"
															label={t('lbl.STORAGETYPE')}
															disabled={true}
															options={getCommonCodeList('STORAGETYPE', '--- 선택---')}
															fieldNames={{ label: 'cdNm', value: 'comCd' }}
														/>
														{/* 저장조건 */}
													</li>
													<li>
														<InputText name="itemCode" label={t('lbl.ITEMCODE')} disabled={true} /> {/* ITEMCODE */}
													</li>
													<li>
														<SelectBox
															name="line01"
															label={t('lbl.SKUNOTFIXEDAMOUNTYN')}
															disabled={true}
															options={getCommonCodeList('YN', '--- 선택---')}
															fieldNames={{ label: 'cdNm', value: 'comCd' }}
														/>
														{/* 비정량여부 */}
													</li>
													<li>
														<InputText name="other01" label={t('lbl.OTHER01')} disabled={true} /> {/* 기타정보1 */}
													</li>
													<li>
														<InputText name="other02" label={t('lbl.OTHER02')} disabled={true} /> {/* 기타정보2 */}
													</li>
													<li>
														<InputText name="other03" label={t('lbl.OTHER03')} disabled={true} /> {/* 기타정보3 */}
													</li>
													<li style={{ gridColumn: 'span 2' }}>
														<InputText name="reference01" label={t('lbl.PLNAME')} /> {/* 3PL업체 */}
													</li>
													<li>
														<SelectBox
															name="serialType"
															label={t('lbl.SERIALTYPE_SN')}
															disabled={true}
															options={getCommonCodeList('PRODUCT-DRTYN', '--- 선택---')}
															fieldNames={{ label: 'cdNm', value: 'comCd' }}
														/>
														{/* 유통이력신고기관 */}
													</li>
													<li>
														<SelectBox
															name="status"
															label={t('lbl.STATUS')}
															disabled={true}
															options={getCommonCodeList('STATUS_SKU', '--- 선택---')}
															fieldNames={{ label: 'cdNm', value: 'comCd' }}
														/>
														{/* 진행상태 */}
													</li>
													<li>
														<SelectBox
															name="delYn"
															label={t('lbl.DEL_YN')}
															disabled={true}
															options={getCommonCodeList('DEL_YN', '--- 선택---')}
															fieldNames={{ label: 'cdNm', value: 'comCd' }}
														/>
														{/* 삭제여부 */}
													</li>
													<li>
														<InputText name="addDate" label={t('lbl.ADDDATE')} disabled={true} />
														{/* 등록일자 */}
													</li>
													<li>
														<InputText name="addWho" label={t('lbl.ADDWHO')} disabled={true} /> {/* 생성인 */}
													</li>
													<li>
														<InputText name="editDate" label={t('lbl.EDITDATE')} disabled={true} />
														{/* 최종변경시간 */}
													</li>
													<li>
														<InputText name="editWho" label={t('lbl.EDITWHO')} disabled={true} /> {/* 최종변경자 */}
													</li>
												</UiDetailViewGroup>
											</UiDetailViewArea>
										</AGrid>
									</ScrollBox>
								</CustomForm>
							</>,
							<>
								<AGrid>
									<GridTopBtn gridTitle="CBM내역" gridBtn={gridBtn1}>
										<Button onClick={onCbmHistPopupClick}>CBM이력정보</Button>
									</GridTopBtn>
								</AGrid>
								<GridAutoHeight>
									<AUIGrid ref={gridRef1} columnLayout={cbmGridCol} gridProps={cbmGridProps} />
								</GridAutoHeight>
								<CustomModal ref={modalRef2} width="1000px">
									<MsCustHistPopup sku={selectedSku} callBack={selectCbmHistPopup} close={closeEvent2} />
								</CustomModal>
							</>,
						]}
					/>,
				]}
			/>
		</>
	);
});

export default MsSkuDetail;

const CustomForm = styled(Form)`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
`;
