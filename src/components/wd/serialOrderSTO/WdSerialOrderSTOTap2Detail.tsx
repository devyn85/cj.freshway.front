/*
 ############################################################################
 # FiledataField	: WdSerialOrderSTOTap2Detail.tsx
 # Description		: 피킹작업지시-조회생성 Detail
 # Author			: 공두경
 # Since			: 25.08.29
 ############################################################################
*/
import { Form, Tabs } from 'antd';
const { TabPane } = Tabs;
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
import { getCommonCodeList } from '@/store/core/comCodeStore';

//Component
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputText, SelectBox } from '@/components/common/custom/form';
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Utils
// API Call Function
import {
	apiGetPickingList,
	apiGetTab2DetailShortageList,
	apiGetTab2DetailWDList,
	apiSaveBatchCancelLine,
	apiSaveBatchConfirmLine,
	apiSaveDistribute,
} from '@/api/wd/apiWdSerialOrderSTO';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import TabsArray from '@/components/common/TabsArray';
import commUtil from '@/util/commUtil';

const WdSerialOrderSTOTap2Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();
	ref.gridRef = useRef();
	ref.gridRef2 = useRef(null);
	ref.gridRef3 = useRef(null);
	const { t } = useTranslation();
	const [totalCnt, setTotalCnt] = useState(0);
	const [loopTrParams, setLoopTrParams] = useState({});
	const [activeKey, setActiveKey] = useState('1');
	const modalRef = useRef(null);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	const searchDtl = (key: string) => {
		const selectedRow = ref.gridRef.current.getSelectedRows();
		const searchParams = props.form.getFieldsValue();
		const params = {
			dccode: selectedRow[0].dccode,
			storerkey: selectedRow[0].storerkey,
			slipdt: selectedRow[0].slipdt,
			docnoSTO: selectedRow[0].docno,

			ordertype: searchParams.ordertype,
			toCustkey: searchParams.toCustkey,
			sku: searchParams.sku,
			skugroup: searchParams.skugroup,
			storagetype: searchParams.storagetype,
			plant: searchParams.plant,
			docno: searchParams.docno,
		};

		if (key === '1') {
			apiGetTab2DetailWDList(params).then(res => {
				const gridData = res.data;
				ref.gridRef2.current?.resize('100%', '100%');
				ref.gridRef2.current?.setGridData(gridData);
				const colSizeList = ref.gridRef2.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.gridRef2.current?.setColumnSizeList(colSizeList);
			});
		} else if (key === '2') {
			apiGetTab2DetailShortageList(params).then(res => {
				const gridData = res.data;
				ref.gridRef3.current?.resize('100%', '100%');
				ref.gridRef3.current?.setGridData(gridData);
				const colSizeList = ref.gridRef3.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.gridRef3.current?.setColumnSizeList(colSizeList);
			});
		}

		ref.gridRef.current?.setFocus();
	};

	/**
	 * 저장
	 */
	const onSave = async () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_003', []), () => {
			const params = {
				apiUrl: '/api/wd/serialOrderSTO/v1.0/saveBatchConfirm',
				avc_COMMAND: 'BATCHCONFIRM_STO_DOCNO',
				dataKey: 'saveBatchConfirmList',
				saveDataList: checkedRows, // 선택된 행의 데이터
			};

			setLoopTrParams(params);
			modalRef.current.handlerOpen();
		});
	};

	/**
	 * 출력
	 */
	const onPrintList = async () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_007', ['출력 항목'])); // {0}을(를) 선택해 주십시오.
			return;
		}

		if (checkedRows.length > 1) {
			showAlert(null, t('msg.MSG_COM_VAL_011')); // 2건 이상 체크되었습니다. 1건만 선택되어야 합니다.
			return;
		}

		const params = {
			dccode: checkedRows[0].dccode,
			storerkey: checkedRows[0].storerkey,
			organize: checkedRows[0].organize,
			taskdt: checkedRows[0].slipdt,
			docno: checkedRows[0].docno,
		};

		// apiGetPickingList(params).then(res => {
		// 	const gridData = res.data;
		// 	//console.log('gridData', gridData);
		// 	viewRdReportMaster(gridData);

		// 	showConfirm(null, t('msg.MSG_COM_CFM_023', [t('lbl.PRINT')]), () => {
		// 		viewRdReportMaster(gridData);
		// 	});

		// });
		// 인쇄 를/을 처리하시겠습니까?
		//showConfirm(null, t('msg.MSG_COM_CFM_023', [t('lbl.PRINT')]), () => {
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			apiGetPickingList(params).then(res => {
				const gridData = res.data;

				viewRdReportMaster(gridData);
			});
		});
	};

	/**
	 * 리포트 뷰어 열기
	 * @param params
	 */
	const viewRdReportMaster = (params: any) => {
		// 1. 리포트 파일명
		const fileName = 'WD_SerialOrderSTO.mrd';

		// 2. 리포트에 XML 생성을 위한 DataSet 생성
		const dataSet = {
			ds_report: params,
		};

		// 3. 리포트에 전송할 파라미터
		const reprotParams = {};

		reportUtil.openAgentReportViewer(fileName, dataSet, reprotParams);
	};
	/**
	 * 출고 대상확정
	 */
	const onSaveBatchConfirmLine = async () => {
		const checkedRows = ref.gridRef2.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_003', []), () => {
			const params = {
				avc_COMMAND: 'BATCHCONFIRM_STO_DOCLINE',
				saveBatchConfirmLine: checkedRows, // 선택된 행의 데이터
			};

			apiSaveBatchConfirmLine(params).then(res => {
				if (res.statusCode > -1) {
					showAlert('', t('msg.MSG_COM_SUC_003'), () => {
						ref.gridRef2.current.clearGridData();
						//						searchDtl('1');
						props.search(); // 검색 함수 호출
					});
				}
			});
		});
	};

	/**
	 * 결품 대상확정
	 */
	const onSaveBatchCancelLine = async () => {
		const checkedRows = ref.gridRef3.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_003', []), () => {
			const params = {
				avc_COMMAND: 'BATCHCONFIRM_STO_DOCLINE',
				saveBatchCancelLine: checkedRows, // 선택된 행의 데이터
			};

			apiSaveBatchCancelLine(params).then(res => {
				if (res.statusCode > -1) {
					showAlert('', t('msg.MSG_COM_SUC_003'), () => {
						ref.gridRef3.current.clearGridData();
						searchDtl('2');
					});
				}
			});
		});
	};
	/**
	 * SO&STO 분리
	 */
	const onSaveDistribute = async () => {
		const checkedRows = ref.gridRef2.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		const invalidRowIndex = checkedRows.findIndex(
			(row: any) => commUtil.isNull(row.docno) || row.pickedqty !== row.confirmqty,
		);

		if (invalidRowIndex > -1) {
			showAlert(null, `SO&STO 분리대상이 아닙니다.[${invalidRowIndex + 1}번째 항목]`);
			return;
		}

		showConfirm(null, 'SO&STO 분리하시겠습니까?', () => {
			const params = {
				avc_COMMAND: 'DISTRIBUTE_SOSTO',
				saveDistributeList: checkedRows, // 선택된 행의 데이터
			};

			apiSaveDistribute(params).then(res => {
				if (res.statusCode > -1) {
					showAlert('', t('msg.MSG_COM_SUC_003'), () => {
						ref.gridRef2.current.clearGridData();
						searchDtl('1');
					});
				}
			});
		});
	};

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string) => {
		setActiveKey(key);
		if (ref.gridRef.current?.getGridData?.().length > 0) {
			searchDtl(key);
		} else {
			if (key === '1') {
				ref.gridRef2.current?.resize('100%', '100%');
			} else if (key === '2') {
				ref.gridRef3.current?.resize('100%', '100%');
			}
		}
	};

	/**
	 * 결품사유, 처리결과 입력
	 * @param {*} key 탭번호
	 */
	const onClickInsert = () => {
		const currentGrid = ref.gridRef3.current;

		if (!currentGrid) return;

		// 폼 인스턴스에서 현재 탭에 맞는 값을 가져옵니다.
		const formValues = props.form.getFieldsValue();

		// getCheckedRowItems()는 현재 페이지에서 체크된 행들의 item과 rowIndex를 함께 반환합니다.
		const checkedItems = currentGrid.getCheckedRowItems();

		if (!checkedItems || checkedItems.length === 0) {
			showAlert('', t('msg.noSelect')); // 필요시 주석 해제하여 사용
			return;
		}

		// 체크된 각 행에 대해 반복
		for (const checkedItem of checkedItems) {
			const { rowIndex } = checkedItem;
			currentGrid.setCellValue(rowIndex, 'reasoncode', formValues.reasoncode2);
			currentGrid.setCellValue(rowIndex, 'reasonmsg', formValues.reasonmsg2);
		}
	};
	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		modalRef.current.handlerClose();
		props.search(); // 검색 함수 호출
	};

	/**
	 *
	 * @param ref
	 * @param callback
	 * @param deps
	 */
	function useWaitForRef(ref: any, callback: any, deps: any = []) {
		useEffect(() => {
			let cancelled = false;

			/**
			 *
			 */
			function check() {
				if (ref.current) {
					if (!cancelled) callback(ref.current);
				} else {
					// 계속 감시
					if (!cancelled) requestAnimationFrame(check);
				}
			}

			check();

			return () => {
				cancelled = true;
			};
		}, deps); // ref는 의존성에 넣지 않아도 됨
	}

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			dataField: 'slipdt',
			headerText: t('lbl.DOCDT_WD'), // 출고일자
			dataType: 'date',
		},
		{
			dataField: 'status',
			headerText: t('lbl.STATUS'), //진행상태
			dataType: 'code',
		},
		{
			dataField: 'docno',
			headerText: t('lbl.DOCNO_WD_STO'), //광역주문번호
			dataType: 'code',
		},
		{
			headerText: t('lbl.FROM_DCCODE'), //공급센터
			children: [
				{
					dataField: 'fromDccode',
					headerText: t('lbl.DCCODE'), //물류센터
					dataType: 'code',
				},
				{
					dataField: 'fromDcname',
					headerText: t('lbl.DCNAME'), //물류센터명
					dataType: 'code',
				},
			],
		},
		{
			headerText: t('lbl.TO_DCCODE'), //공급받는센터
			children: [
				{
					dataField: 'toDccode',
					headerText: t('lbl.DCCODE'), //물류센터
					dataType: 'code',
				},
				{
					dataField: 'toDcname',
					headerText: t('lbl.DCNAME'), //물류센터명
					dataType: 'code',
				},
			],
		},
		{
			dataField: 'skucnt',
			headerText: t('lbl.SKUCNT'), //상품수
			dataType: 'numeric',
		},
		{
			dataField: 'weight',
			headerText: t('lbl.WEIGHT_KG'), //중량
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: false, // row 편집 여부
		fillColumnSizeMode: true,
		showFooter: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'slipdt',
		},
		{
			dataField: 'skucnt',
			positionField: 'skucnt',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'weight',
			positionField: 'weight',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save',
				callBackFn: onSave,
			},
			{
				btnType: 'print', // 인쇄
				callBackFn: onPrintList,
			},
		],
	};

	//그리드 컬럼(출고대상 그리드)
	const gridCol2 = [
		{
			dataField: 'docnoSto',
			headerText: t('lbl.DOCNO_WD_STO'), //광역주문번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'doclineSto',
			headerText: t('lbl.DOCLINE'), //품목번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'), //상품코드
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'), //상품명칭
			editable: false,
		},
		{
			dataField: 'orderqty',
			headerText: t('lbl.ORDERQTY'), //주문수량
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'cancelqty',
			headerText: t('lbl.SHORTAGEQTY'), //결품수량
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'toCustkey',
			headerText: t('lbl.TO_CUSTKEY_WD'), //관리처코드
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'toCustname',
			headerText: t('lbl.TO_CUSTNAME_WD'), //관리처명
			editable: false,
		},
		{
			dataField: 'docno',
			headerText: t('lbl.DOCNO_WD'), //주문번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'docline',
			headerText: t('lbl.DOCLINE'), //품목번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'status',
			headerText: t('lbl.STATUS'), //진행상태
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'pickedqty',
			headerText: t('lbl.WORKQTY_WD'), //피킹량
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'confirmqty',
			headerText: t('lbl.CONFIRMQTY'), //확정수량
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM'), //단위
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'tranqty',
			headerText: t('lbl.TRANQTY'), //작업수량
			dataType: 'numeric',
			formatString: '#,##0.##',
		},
		{
			dataField: 'serialno',
			headerText: t('lbl.SERIALNO'), //이력번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'stockid',
			headerText: t('lbl.STOCKID'), //개체식별/소비이력
			dataType: 'code',
			editable: false,
		},
	];

	// 그리드 Props(거래처별 그리드)
	const gridProps2 = {
		editable: true,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
	};

	// FooterLayout Props(거래처별 그리드)
	const footerLayout2 = [
		{
			labelText: '합계',
			positionField: 'docnoSto',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'cancelqty',
			positionField: 'cancelqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'pickedqty',
			positionField: 'pickedqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'tranqty',
			positionField: 'tranqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	// 그리드 버튼
	const gridBtn2: GridBtnPropsType = {
		tGridRef: ref.gridRef2, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1',
				btnLabel: 'SO&STO분리', // SO&STO분리
				callBackFn: onSaveDistribute,
			},
			{
				btnType: 'btn2',
				btnLabel: '출고대상확정', // 피킹분리
				callBackFn: onSaveBatchConfirmLine,
			},
		],
	};

	//그리드 컬럼(출고대상 그리드)
	const gridCol3 = [
		{
			dataField: 'docnoSto',
			headerText: t('lbl.DOCNO_WD_STO'), //광역주문번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'doclineSto',
			headerText: t('lbl.DOCLINE'), //품목번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'), //상품코드
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'), //상품명칭
			editable: false,
		},
		{
			dataField: 'orderqty',
			headerText: t('lbl.ORDERQTY'), //주문수량
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'cancelqty',
			headerText: t('lbl.SHORTAGEQTY'), //결품수량
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'toCustkey',
			headerText: t('lbl.TO_CUSTKEY_WD'), //관리처코드
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'toCustname',
			headerText: t('lbl.TO_CUSTNAME_WD'), //관리처명
			editable: false,
		},
		{
			dataField: 'docno',
			headerText: t('lbl.DOCNO_WD'), //주문번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'docline',
			headerText: t('lbl.DOCLINE'), //품목번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'status',
			headerText: t('lbl.STATUS'), //진행상태
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'pickedqty',
			headerText: t('lbl.WORKQTY_WD'), //피킹량
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'confirmqty',
			headerText: t('lbl.CONFIRMQTY'), //확정수량
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM'), //단위
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'tranqty',
			headerText: t('lbl.TRANQTY'), //작업수량
			dataType: 'numeric',
			formatString: '#,##0.##',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				allowPoint: true, // 기본적으로 소수점 비허용 (KG일 때만 동적으로 허용)
				validator: function (oldValue: any, newValue: any, item: any) {
					const isKg = item.uom?.toUpperCase() === 'KG';
					if (!isKg && String(newValue).includes('.')) {
						return { validate: false, message: 'KG 단위만 소수점 입력이 가능합니다.' };
					}
					return { validate: true };
				},
			},
		},
		{
			dataField: 'reasoncode',
			headerText: t('lbl.REASONCODE_WD'), //결품사유
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('REASONCODE_WD'),
			},
		},
		{
			dataField: 'reasonmsg',
			headerText: t('lbl.REASONRESULTMSG'), //결품처리결과
		},
		{
			dataField: 'serialno',
			headerText: t('lbl.SERIALNO'), //이력번호
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'stockid',
			headerText: t('lbl.STOCKID'), //개체식별/소비이력
			dataType: 'code',
			editable: false,
		},
	];

	// 그리드 Props(거래처별 그리드)
	const gridProps3 = {
		editable: true,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
	};

	// FooterLayout Props(거래처별 그리드)
	const footerLayout3 = [
		{
			labelText: '합계',
			positionField: 'docnoSto',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'cancelqty',
			positionField: 'cancelqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'pickedqty',
			positionField: 'pickedqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'confirmqty',
			positionField: 'confirmqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
		{
			dataField: 'tranqty',
			positionField: 'tranqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			dataType: 'numeric',
			style: 'right',
		},
	];

	// 그리드 버튼
	const gridBtn3: GridBtnPropsType = {
		tGridRef: ref.gridRef2, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn3',
				btnLabel: '선택적용', // 선택적용
				callBackFn: onClickInsert,
			},
			{
				btnType: 'btn2',
				btnLabel: '결품대상확정', // 결품대상확정
				callBackFn: onSaveBatchCancelLine,
			},
		],
	};

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 1);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	let prevRowItem: any = null;
	useEffect(() => {
		ref.gridRef.current.bind('selectionChange', function (event: any) {
			// 선택된 Row의 item이 다를 경우에만 검색
			if (event.primeCell.item === prevRowItem || event.primeCell.dataField === 'customRowCheckYn') return;

			// 이전 행 item 갱신
			prevRowItem = event.primeCell.item;

			searchDtl(activeKey);
		});
	}, [activeKey]);

	useWaitForRef(
		ref.gridRef3,
		(gridRef3: any) => {
			if (activeKey === '2') {
				// 이벤트 중복 방지
				gridRef3.unbind?.('cellEditBegin');

				gridRef3.bind('cellEditBegin', (event: any) => {
					return ['tranqty', 'reasoncode', 'reasonmsg'].includes(event.dataField);
				});
			}
			/**
			 * 출고대상 그리드 엑스트라 행 체크
			 * @param {any} event 이벤트
			 */
			gridRef3.bind('rowCheckClick', (event: any) => {
				const { item, checked, rowIndex } = event;
				if (checked) {
					gridRef3.setCellValue(rowIndex, 'tranqty', item.pickedqty - item.confirmqty);
				}
			});
			/**
			 * 출고대상 그리드 전체 체크
			 * @param {boolean} chkFlag chkFlag
			 */
			gridRef3.bind('rowAllCheckClick', function (checked: any) {
				const gridAllData = gridRef3.getGridData();

				gridAllData.forEach((item: any, rowIndex: number) => {
					if (checked) {
						const updateItem = {
							...item,
							tranqty: item.pickedqty - item.confirmqty,
						};

						gridRef3.updateRow(updateItem, rowIndex);
					}
				});
			});
		},
		[activeKey],
	);

	useEffect(() => {
		ref.gridRef2.current.bind('cellEditBegin', function (event: any) {
			if (event.dataField == 'tranqty') {
				return true;
			} else {
				return false; // 다른 필드들은 편집 허용 안함
			}
		});
		/**
		 * 출고대상 그리드 엑스트라 행 체크
		 * @param {any} event 이벤트
		 */
		ref.gridRef2?.current.bind('rowCheckClick', (event: any) => {
			const { item, checked, rowIndex } = event;
			if (checked) {
				ref.gridRef2?.current.setCellValue(rowIndex, 'tranqty', item.pickedqty - item.confirmqty);
			}
		});
		/**
		 * 출고대상 그리드 전체 체크
		 * @param {boolean} chkFlag chkFlag
		 */
		ref.gridRef2?.current.bind('rowAllCheckClick', function (checked: any) {
			const gridAllData = ref.gridRef2?.current.getGridData();

			gridAllData.forEach((item: any, rowIndex: number) => {
				if (checked) {
					const updateItem = {
						...item,
						tranqty: item.pickedqty - item.confirmqty,
					};

					ref.gridRef2?.current.updateRow(updateItem, rowIndex);
				}
			});
		});
	}, []);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef3?.current?.resize?.('100%', '100%');
		ref.gridRef2?.current?.resize?.('100%', '100%');
	}, []);

	// * 탭 목록
	const tabItems = [
		{
			key: '1',
			label: '출고대상',
			children: (
				<>
					<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
						<GridTopBtn gridBtn={gridBtn2} gridTitle="출고대상목록" />
					</AGrid>
					<GridAutoHeight>
						<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps2} footerLayout={footerLayout2} />
					</GridAutoHeight>
				</>
			),
		},
		{
			key: '2',
			label: '결품대상',
			children: (
				<>
					<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
						<GridTopBtn gridBtn={gridBtn3} gridTitle="결품대상목록">
							<Form layout="inline">
								<li>
									<SelectBox
										label={t('lbl.REASONCODE_DP')} //결품사유
										name="reasoncode2"
										className="bg-white"
										options={getCommonCodeList('REASONCODE_WD', '--- 전체 ---')}
										fieldNames={{ label: 'cdNm', value: 'comCd' }}
										style={{ width: '180px' }}
									/>
								</li>
								<li>
									<InputText
										label={t('lbl.RESULTMSG')} //처리결과
										name="reasonmsg2"
										className="bg-white"
									/>
								</li>
							</Form>
						</GridTopBtn>
					</AGrid>
					<GridAutoHeight>
						<AUIGrid ref={ref.gridRef3} columnLayout={gridCol3} gridProps={gridProps3} footerLayout={footerLayout3} />
					</GridAutoHeight>
				</>
			),
		},
	];

	return (
		<>
			{/* 그리드 영역 */}
			<Form form={props.form} className="h100">
				<Splitter
					direction="vertical"
					onResizing={resizeAllGrids}
					onResizeEnd={resizeAllGrids}
					items={[
						<>
							<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
								<GridTopBtn gridBtn={gridBtn} gridTitle="출고확정목록" totalCnt={props.totalCnt} />
							</AGrid>
							<GridAutoHeight>
								<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
							</GridAutoHeight>
						</>,
						<TabsArray
							key="WdSerialOrderSTOTap2Detail-tabs"
							activeKey={activeKey}
							onChange={tabClick}
							items={tabItems}
						/>,
					]}
				/>
			</Form>
			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>
		</>
	);
});

export default WdSerialOrderSTOTap2Detail;
