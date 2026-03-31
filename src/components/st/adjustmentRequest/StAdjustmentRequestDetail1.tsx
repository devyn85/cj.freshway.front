/*
 ############################################################################
 # FiledataField	: StAdjustmentRequestDetail1.tsx
 # Description		: 재고 > 재고조정 > 재고조정처리 (재고조정 요청)
 # Author					: JiHoPark
 # Since					: 2025.10.10.
 ############################################################################
*/

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Component
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import StAdjustmentPopUp01 from '@/components/st/adjustment/StAdjustmentPopUp01';
import StAdjustmentRequestDetail1UploadExcelPopup from '@/components/st/adjustmentRequest/StAdjustmentRequestDetail1UploadExcelPopup';
import { showConfirm, showMessage } from '@/util/MessageUtil';
// Util
import commUtil from '@/util/commUtil';

// Store
import { fetchMsOrganize } from '@/store/biz/msOrganize';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// API
import { apiSaveMasterList1 } from '@/api/st/apiStAdjustmentRequest';

// Hooks

// lib
import dayjs from 'dayjs';
// type
import { GridBtnPropsType } from '@/types/common';
// asset
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

interface StAdjustmentRequestDetail1Props {
	data: any;
	totalCnt: any;
	form: any;
	initialValues: any;
	dccode: string;
	searchHandler: any;
	handleGridData2: any;
}

const StAdjustmentRequestDetail1 = forwardRef((props: StAdjustmentRequestDetail1Props, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const refModal = useRef(null);
	const refModal2 = useRef(null);
	const refModal3 = useRef(null);
	const excelRef = useRef(null);

	const { handleGridData2, initialValues, dccode, form } = props;

	// 글로벌 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);
	// 사용자 정보
	const user = useAppSelector(state => state.user.userInfo);

	// WMS자체감모 처리권한자(AJDC)
	const ajdcProcUserCmCd = getCommonCodeList('AJDC_PROC_USER');
	const bAjdcUser = ajdcProcUserCmCd.find(val => val.comCd.toUpperCase() === globalVariable.gUserId.toUpperCase());

	// 센터별 기준코스트센터 및 대표고객
	const commWmsMngDc = getCommonCodeList('WMS_MNG_DC');

	// 발생사유
	const comReasonCode = getCommonCodeList('REASONCODE_AJAJ', t('lbl.SELECT'), '').filter(item => {
		//if (globalVariable.gAuthority !== '00' && globalVariable.gAuthority !== '05' && !bAjdcUser) {
		if (!user.roles?.includes('000') && !user.roles?.includes('010') && !bAjdcUser) {
			return item.comCd !== 'AJDC' && (commUtil.isEmpty(item.data1) || item.data1 === 'STD');
		} else {
			return commUtil.isEmpty(item.data1) || item.data1 === 'STD';
		}
	});

	// 제로재고 팝업 파라미터
	const [zeroStockParam, setZeroStockParam] = useState({});

	//그리드 컬럼
	const gridCol = [
		{
			headerText: t('lbl.DCCODE'),
			/*물류센터*/ dataField: 'dccode',
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			headerText: t('lbl.STORE'),
			/*창고*/ dataField: 'organize',
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			headerText: t('lbl.STOCKTYPE') /*재고위치*/,
			children: [
				{ headerText: t('lbl.CODE'), /*코드*/ dataField: 'stocktype', dataType: 'code', editable: false, width: 80 },
				{
					headerText: t('lbl.DESCR'),
					/*명칭*/ dataField: 'stocktypenm',
					dataType: 'string',
					editable: false,
					width: 100,
				},
			],
		},
		{
			headerText: t('lbl.STOCKGRADE') /*재고속성*/,
			children: [
				{
					headerText: t('lbl.CODE'),
					/*코드*/ dataField: 'stockgrade',
					dataType: 'code',
					editable: false,
					width: 80,
				},
				{
					headerText: t('lbl.DESCR'),
					/*명칭*/ dataField: 'stockgradename',
					dataType: 'string',
					editable: false,
					width: 100,
				},
			],
		},
		{ headerText: t('lbl.ZONE'), /*피킹존*/ dataField: 'zone', dataType: 'code', editable: false, width: 110 },
		{
			headerText: t('lbl.LOC_ST'),
			/*로케이션*/ dataField: 'loc',
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			headerText: t('lbl.SKUINFO') /*상품정보*/,
			children: [
				{
					headerText: t('lbl.SKU'),
					/*상품코드*/ dataField: 'sku',
					dataType: 'code',
					editable: false,
					width: 80,
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.current.openPopup(e.item, 'sku');
						},
					},
				},
				{
					headerText: t('lbl.SKUNM'),
					/*상품명*/ dataField: 'skuname',
					dataType: 'string',
					editable: false,
					width: 350,
				},
			],
		},
		{
			headerText: t('lbl.UOM_RT'),
			/*단위*/ dataField: 'uom',
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			headerText: t('lbl.QTY_ST'),
			/*현재고수량*/ dataField: 'qty',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
			width: 120,
		},
		{
			headerText: t('lbl.OPENQTY_ST'),
			/*가용재고수량*/ dataField: 'openqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
			width: 120,
		},
		{
			headerText: t('lbl.QTYALLOCATED_ST'),
			/*재고할당수량*/ dataField: 'qtyallocated',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
			width: 120,
		},
		{
			headerText: t('lbl.QTYPICKED_ST'),
			/*피킹재고*/ dataField: 'qtypicked',
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: false,
			width: 120,
		},
		{
			headerText: t('lbl.ADJUSTQTY_AJ'),
			/*조정수량*/ dataField: 'tranqty',
			dataType: 'numeric',
			formatString: '#,##0.###',
			required: true,
			width: 120,
			editRenderer: {
				type: 'InputEditRenderer',
				allowPoint: true,
				allowNegative: true,
			},
		},
		{
			headerText: t('lbl.INQUIRYREASONCODE'),
			/*발생사유*/ dataField: 'reasoncode',
			dataType: 'string',
			width: 160,
			editable: true,
			required: true,
			renderer: {
				type: 'DropDownListRenderer',
				list: comReasonCode,
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		},
		{ headerText: t('lbl.REMARK_REASON'), /*비고(사유)*/ dataField: 'other05', dataType: 'code', width: 140 },
		{
			headerText: t('lbl.OTHER05_DMD_AJ'),
			/*물류귀책배부*/ dataField: 'processmain',
			dataType: 'code',
			width: 100,
			required: true,
			renderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('YN', t('lbl.SELECT'), ''),
				keyField: 'comCd',
				valueField: 'cdNm',
			},
		},
		{
			headerText: t('lbl.WONEARDURATIONYN'),
			/*유통기한임박여부*/ dataField: 'neardurationyn',
			dataType: 'code',
			editable: false,
			width: 120,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.EXPIREDT'),
			/*소비일자*/ dataField: 'expiredt',
			dataType: 'code',
			editable: false,
			width: 150,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.MANUFACTUREDT'),
			/*제조일자*/ dataField: 'manufacturedt',
			dataType: 'code',
			editable: false,
			width: 150,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.DURATIONTERM'),
			/*유통기간(잔여/전체)*/ dataField: 'durationTerm',
			dataType: 'string',
			editable: false,
			width: 150,
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.SERIALINFO') /*상품이력정보*/,
			children: [
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
					headerText: t('lbl.BLNO'),
					/*B/L 번호*/ dataField: 'convserialno',
					dataType: 'string',
					editable: false,
					width: 200,
				},
				{
					headerText: t('lbl.CONVERTLOT'),
					/*도축일자*/ dataField: 'butcherydt',
					dataType: 'date',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.FACTORYNAME'),
					/*도축장*/ dataField: 'factoryname',
					dataType: 'string',
					editable: false,
					width: 200,
				},
				{
					headerText: t('lbl.CONTRACTTYPE'),
					/*계약유형*/ dataField: 'contracttype',
					dataType: 'string',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.CONTRACTCOMPANY'),
					/*계약업체*/ dataField: 'contractcompany',
					dataType: 'code',
					editable: false,
					width: 150,
				},
				{
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					/*계약업체명*/ dataField: 'contractcompanyname',
					dataType: 'string',
					editable: false,
					width: 220,
				},
				{
					headerText: t('lbl.FROMVALIDDT'),
					/*유효일자(FROM)*/ dataField: 'fromvaliddt',
					dataType: 'date',
					editable: false,
					width: 120,
				},
				{
					headerText: t('lbl.TOVALIDDT'),
					/*유효일자(TO)*/ dataField: 'tovaliddt',
					dataType: 'date',
					editable: false,
					width: 120,
				},
			],
		},
		{
			headerText: 'LOT',
			/*LOT*/ dataField: 'lot',
			dataType: 'string',
			editable: false,
			width: 200,
		},
		{
			headerText: 'STOCKID',
			/*STOCKID*/ dataField: 'stockid',
			dataType: 'string',
			editable: false,
			width: 250,
		},
		{
			headerText: 'AREA',
			/*AREA*/ dataField: 'area',
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{ headerText: 'OTHER03', /*OTHER03*/ dataField: 'other03', dataType: 'code', editable: false, visible: false },
		{
			headerText: t('lbl.STORERKEY'),
			/*회사*/ dataField: 'storerkey',
			dataType: 'string',
			visible: false,
		},
		{
			headerText: t('lbl.LOTTABLE01_MFG_WO'),
			/*기준일(유통,제조)*/ dataField: 'lottable01',
			dataType: 'string',
			editable: false,
			visible: false,
		},
	];

	// FooterLayout Props
	const footerCol = [
		{
			dataField: 'tranqty',
			positionField: 'tranqty',
			operation: 'SUM',
			formatString: '#,##0.###',
			postfix: '',
			style: 'right',
			rounding: 'round',
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: true,
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
		showFooter: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		/**
		 * 다수의 행을 클립 보드 붙여넣기(Ctrl+V) 할 때 그리드의 마지막 하단 행보다 클립보드 양이 많은 경우, 새 행을 만들고 붙여넣기 할지 여부를 지정합니다.
		 * 기본값은 클립보드의 양이 많은 경우 자동으로 그리드에 새 행을 추가하고 모든 클립보드 데이터를 붙여 넣습니다.
		 * 그러나 isGenNewRowsOnPaste=false 처리 시 그리드 출력 행보다 많은 클립보드 데이터는 무시하게 됩니다. 즉, 새 행을 만들지 않습니다.
		 */
		isGenNewRowsOnPaste: false,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */
	/*
	 * 센터별 코스트센터 및 대표고객코드 취득
	 *   공통코드 WMS_MNG_DC의 DATA2 항목으로 관리 ( 형태 : 코스트센터|대표고객코드 )
	 *   코스트센터와 대표고객코드를 SCM팀으로 귀속되도록 세팅하기 위함
	 *   Parameter : 센터코드
	 *   Return : data2 값
	 *            -1 센터미입력, -2 코스트센터 및대표고객코드 미입력, -3 코스트센터 및 대표고객코드 형태 오류, -4 코스트센터 미입력, -5 대표고객코드미입력
	 */
	const getCostCdAndCustkey = () => {
		const findDccode = commWmsMngDc.find(({ comCd }: { comCd: string }) => comCd === dccode);
		if (!findDccode) {
			return '-1';
		}

		const selectedData2 = findDccode.data2;
		if (commUtil.isEmpty(selectedData2)) {
			return '-2';
		}

		const arrData2 = selectedData2.split('|');
		if (arrData2.length != 2) {
			return '-3';
		} else if (commUtil.isEmpty(arrData2[0])) {
			return '-4';
		} else if (commUtil.isEmpty(arrData2[1])) {
			return '-5';
		}

		return selectedData2;
	};

	/**
	 * 재고조정 저장 callback
	 * @returns {void}
	 */
	const saveCallback = () => {
		let errMsg = ''; // 에러메시지

		// 저장할 데이터 선택여부 확인
		const chkDataList = ref.current.getCheckedRowItemsAll();
		if (chkDataList.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_ERR_008'), // 저장 대상 자료가 존재하지 않습니다.
				modalType: 'info',
			});
			return;
		}

		// 저장 form data 확인
		const saveFormData = form.getFieldsValue();
		const stocktranstype = saveFormData.stocktranstype; // 이동유형
		if (commUtil.isEmpty(stocktranstype)) {
			showMessage({
				content: t('msg.MSG_COM_VAL_213'), // 이동유형을 선택하십시요.
				modalType: 'info',
			});
			return;
		}

		// 입력값 체크
		const findData = chkDataList.find((data: any) => {
			const curTranqty = data.tranqty;
			const curReasoncode = data.reasoncode;
			const curProcessmain = data.processmain;

			if (commUtil.isEmpty(curTranqty) || Number(curTranqty) === 0) {
				errMsg = t('msg.placeholder1', ['조정수량']); // {{0}}을 입력해주세요.
				return true;
			}

			if (commUtil.isEmpty(curReasoncode)) {
				errMsg = t('msg.placeholder1', ['발생사유']); // {{0}}을 입력해주세요.
				return true;
			}

			if (commUtil.isEmpty(curProcessmain)) {
				errMsg = t('msg.placeholder1', ['물류귀책배부']); // {{0}}을 입력해주세요.
				return true;
			}
		});

		if (findData) {
			showMessage({
				content: errMsg,
				modalType: 'info',
			});
			return;
		}

		// 센터별 코스트센터 및 대표고객코드 취득
		const wmsData2 = getCostCdAndCustkey();
		const arrData2 = wmsData2.split('|');
		if (arrData2.length != 2) {
			errMsg = arrData2[0];
		}

		if (errMsg) {
			showMessage({
				content: t('msg.MSG_COM_VAL_205', [errMsg]), // 센터의 코스트센터 및 대표고객 코드 매핑 정보 오류입니다.(ErrCode:{{0}})\n설정 후 재진행 부탁드립니다.
				modalType: 'info',
			});
			return;
		}

		// 귀책, 코스트,대표고객코드 매칭
		const saveList = chkDataList.map((item: any) => {
			return {
				...item,
				costcd: arrData2[0], // 코스트센터
				custkey: arrData2[1], // 대표고객코드
				imputetype: '12', // 귀책
			};
		});

		// 저장하시겠습니까?\n(신규 : {{0}}건, 수정 : {{1}}건, 삭제 : {{2}}건)
		showConfirm(null, t('msg.MSG_COM_VAL_207', [0, saveList.length, 0]), () => {
			const params = {
				procedure: 'SPAJ_REQUEST',
				avc_COMMAND: 'APPROVALREQ_DC',
				processtype: 'AJ_ADJUSTMENTREQ_DC',
				docdt: dayjs(saveFormData.docdt).format('YYYYMMDD'),
				ifSendType: 'WMSAJ',
				workprocesscode: 'WMSAJ',
				omsFlag: 'Y',
				stocktranstype: stocktranstype,
				saveMasterList1: saveList,
			};

			apiSaveMasterList1(params).then(res => {
				if (res.statusCode === 0) {
					handleGridData2(res.data);
				}
			});
		});
	};

	/**
	 * 선택적용 callback
	 * @returns {void}
	 */
	const applySelectedDataCallback = () => {
		// 체크된 행 여부 확인
		const chkDataList = ref.current.getCheckedRowItems();
		if (chkDataList.length < 1) {
			showMessage({
				content: t('msg.noSelect'), // 선택한 행이 없습니다.
				modalType: 'info',
			});
			return;
		}

		const applyFormData = form.getFieldsValue();
		const applyReasoncode = applyFormData.reasoncode; // 발생사유
		const applyProcessmain = applyFormData.processmain; // 물류귀책배부
		const applyOther05 = applyFormData.other05; // 비고(사유)
		const applyStocktranstype = applyFormData.stocktranstype; // 이동유형

		if (
			commUtil.isNotEmpty(applyReasoncode) ||
			commUtil.isNotEmpty(applyProcessmain) ||
			commUtil.isNotEmpty(applyOther05) ||
			commUtil.isNotEmpty(applyStocktranstype)
		) {
			// 변경된 아이템들을 담을 배열
			const updatedItems = chkDataList.map((chkData: { rowIndex: number; item: any }) => {
				const { rowIndex, item } = chkData;

				let newTranqty = item.tranqty;
				if (commUtil.isEmpty(newTranqty) || Number(newTranqty) === 0) {
					newTranqty = 0;
				} else {
					if (applyStocktranstype === '947' && Number(newTranqty) > 0) {
						// 감모
						newTranqty = Number(newTranqty) * -1;
					} else if (applyStocktranstype === '948' && Number(newTranqty) < 0) {
						// 역감모
						newTranqty = Number(newTranqty) * -1;
					}
				}

				return {
					...item,
					tranqty: newTranqty,
					reasoncode: commUtil.isNotEmpty(applyReasoncode) ? applyReasoncode : item.reasoncode,
					processmain: commUtil.isNotEmpty(applyProcessmain) ? applyProcessmain : item.processmain,
					other05: commUtil.isNotEmpty(applyOther05) ? applyOther05 : item.other05,
				};
			});

			// 루프 밖에서 한 번에 그리드 업데이트 반영
			ref.current.updateRowsById(updatedItems);
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
		ref?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref?.current.setSelectionByIndex(0);
		});
		ref?.current.bind('pasteBegin', (event: any) => {
			const gridRefCur = ref.current;
			if (!gridRefCur) return true;

			const selectedIndexes = gridRefCur.getSelectedIndex() || [];
			const selectedRowIndex = selectedIndexes[0];
			const selectedColIndex = selectedIndexes[1];

			const selectedCol = gridRefCur.getColumnItemByIndex(selectedColIndex);
			if (selectedCol?.dataField !== 'tranqty') {
				return true; // 기본 붙여넣기 허용
			}
			const clipboardRaw = event?.clipboardData ?? event?.data ?? '';
			const raw =
				typeof clipboardRaw === 'string'
					? clipboardRaw
					: String(clipboardRaw?.getData?.('text') ?? clipboardRaw?.getData?.('text/plain') ?? '');
			const uniqueLines = raw.split(/\r?\n/).filter((line: string) => line !== '');

			if (uniqueLines.length === 0) {
				return false;
			}

			const allItems = gridRefCur.getGridData();
			const itemsToUpdate = new Map();

			// Stage 1: uncheck all currently checked items
			const currentlyChecked = gridRefCur.getCheckedRowItemsAll() || [];
			currentlyChecked.forEach((item: any) => {
				itemsToUpdate.set(item._$uid, { ...item, chk: '0' });
			});

			// Stage 2: update pasted items and check them
			uniqueLines.forEach((lineValue, index) => {
				const currentRowIndex = selectedRowIndex + index;
				if (currentRowIndex < allItems.length) {
					const item = allItems[currentRowIndex];
					const existingUpdate = itemsToUpdate.get(item._$uid) || item;
					itemsToUpdate.set(item._$uid, {
						...existingUpdate,
						tranqty: lineValue,
						customRowCheckYn: 'Y',
					});
				}
			});

			if (itemsToUpdate.size > 0) {
				gridRefCur.updateRowsById(Array.from(itemsToUpdate.values()));
			}

			return false; // 그리드 기본 붙여넣기 동작 방지
		});
	};

	/**
	 * ZERO 재고생성 팝업
	 */
	const btnCreatZeroStockPopupCallback = async () => {
		// ZERO 재고생성 팝업 파라미터 세팅
		setZeroStockParam({
			dccode: dccode,
		});

		refModal3.current.handlerOpen();
	};

	/**
	 * ZERO 재고생성 팝업 닫기
	 * @param flag
	 */
	const closeCreatZeroStockPopup = (flag: string) => {
		refModal3.current.handlerClose();

		// 재조회
		if (flag === '1') {
			props.searchHandler();
		}
	};

	/**
	 * 엑셀 업로드 팝업
	 */
	const onExcelUploadPopupClick = () => {
		refModal2.current.handlerOpen();
	};

	/**
	 * 엑셀 팝업 닫기
	 */
	const closeExcelPopup = () => {
		const excelChkDataList = excelRef.current.getCheckedRowItemsAll();
		if (excelChkDataList.length > 0) {
			ref.current.clearGridData();

			const excelParams = excelChkDataList.map((item: any) => {
				let rowStatus = '';
				if (commUtil.isNotEmpty(item.tranqty) && Number(item.tranqty) !== 0) {
					rowStatus = 'U';
				}

				// 현재고 수량
				const nQty = commUtil.isEmpty(item.qty) && Number(item.qty) === 0 ? 0 : item.qty;

				// 가용재고수량
				const nOpenqty = commUtil.isEmpty(item.openqty) && Number(item.openqty) === 0 ? 0 : item.openqty;

				// 재고할당수량
				const nQtyallocated =
					commUtil.isEmpty(item.qtyallocated) && Number(item.qtyallocated) === 0 ? 0 : item.qtyallocated;

				// 피킹재고
				const nQtypicked = commUtil.isEmpty(item.qtypicked) && Number(item.qtypicked) === 0 ? 0 : item.qtypicked;

				// 발생사유
				const findReason = comReasonCode.find(val => {
					const curReasoncode = item.reasoncode;

					if (val.comCd === curReasoncode || val.cdNm === curReasoncode) {
						return true;
					}
				});

				// 물류귀책배부
				const findProcessmain = getCommonCodeList('YN', t('lbl.SELECT'), '').find(val => {
					const curProcessmain = item.processmain;

					if (val.comCd === curProcessmain || val.cdNm === curProcessmain) {
						return true;
					}
				});

				const param = {
					...item,
					chk: rowStatus === 'U' ? '1' : '0',
					qty: nQty,
					openqty: nOpenqty,
					qtyallocated: nQtyallocated,
					qtypicked: nQtypicked,
					//lottable01: item.lottable01.replace(/\D/g, ''),
					storerkey: globalVariable.gStorerkey,
					reasoncode: findReason ? findReason.comCd : '',
					processmain: findProcessmain ? findProcessmain.comCd : '',
					rowStatus,
					other03:
						' < SERIALNO > ' +
						item.serialno +
						' < /SERIALNO >  < CONVSERIALNO > ' +
						item.convserialno +
						' < /CONVSERIALNO >  < POLINE >  < /POLINE >  < CUTKEY > ' +
						item.contractcompany +
						' < /CUTKEY > ',
				};

				return param;
			});

			ref.current.setGridData(excelParams);
			refModal2.current.handlerClose();
		}
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 선택적용
				callBackFn: applySelectedDataCallback,
			},
			{
				btnType: 'btn2', // 엑셀업로드
				callBackFn: onExcelUploadPopupClick,
			},
			{
				btnType: 'btn3', // ZERO 재고생성
				callBackFn: btnCreatZeroStockPopupCallback,
			},
			// {
			// 	btnType: 'btn4', // ZERO 재고 삭제
			// 	callBackFn: onExcelUploadPopupClick,
			// },
			{
				btnType: 'save', // 저장
				callBackFn: saveCallback,
			},
		],
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

		// zerocode 팝업 창고 설정
		const fetchInitStore = async () => {
			await fetchMsOrganize();
		};
		// init store
		fetchInitStore();
	}, []);

	/**
	 * Grid data 변경
	 */
	useEffect(() => {
		const gridRef = ref.current;
		if (gridRef) {
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);

			// if (props.data.length > 0) {
			// 	// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
			// 	// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
			// 	const colSizeList = gridRef.getFitColumnSizeList(true);

			// 	// 구해진 칼럼 사이즈를 적용 시킴.
			// 	gridRef.setColumnSizeList(colSizeList);
			// }
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid className="h-auto">
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} />
				<UiDetailViewArea>
					<Form form={form} initialValues={initialValues}>
						<UiDetailViewGroup>
							<li>
								<DatePicker
									name="docdt"
									label={t('lbl.APPROVALREQDT')} // 결재요청일자
									required
									rules={[{ required: true, validateTrigger: 'none' }]}
								/>
							</li>
							<li>
								<SelectBox
									name="processmain"
									span={24}
									options={getCommonCodeList('YN', '전체', '')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									label={t('lbl.OTHER05_DMD_AJ')} // 물류귀책배부
								/>
							</li>
							<li>
								<SelectBox
									name="reasoncode"
									span={24}
									options={comReasonCode}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									label={t('lbl.REASONCODE_AJ')} // 발생사유
								/>
							</li>
							<li>
								<InputText name="other05" />
							</li>
							<li>
								<SelectBox
									name="stocktranstype"
									span={24}
									options={getCommonCodeList('MOVEMENTTYPE_AJ', t('lbl.SELECT'), '')}
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									label={t('lbl.MOVEMENTTYPE')} // 이동유형
									required
								/>
							</li>
						</UiDetailViewGroup>
					</Form>
				</UiDetailViewArea>
			</AGrid>
			<AGrid className="mt20" style={{ height: 'calc(100vh - 480px)' }}>
				<AUIGrid columnLayout={gridCol} gridProps={gridProps} ref={ref} footerLayout={footerCol} />
			</AGrid>
			<CmSearchWrapper ref={refModal} />
			<CustomModal ref={refModal2} width="1000px">
				<StAdjustmentRequestDetail1UploadExcelPopup close={closeExcelPopup} ref={excelRef} />
			</CustomModal>
			{/* 팝업.ZERO 재고생성 */}
			<CustomModal ref={refModal3} width="700px">
				<StAdjustmentPopUp01 popupParams={zeroStockParam} close={closeCreatZeroStockPopup} />
			</CustomModal>
		</>
	);
});

export default StAdjustmentRequestDetail1;
