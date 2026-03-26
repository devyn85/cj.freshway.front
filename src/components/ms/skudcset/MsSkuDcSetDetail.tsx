/*
 ############################################################################
 # FiledataField	: MsSkuDcSetDetail.tsx
 # Description		: 센터상품속성
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.05.23
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form, Input } from 'antd';

// Utils
import { validateForm } from '@/util/FormUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Store
import { getCommonCodeList, getCommonCodebyCd } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import { getUserDccodeList } from '@/store/core/userStore';

// Component
import AGridWrap from '@/assets/styled/AGridWrap/AGridWrap';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputNumber, InputText, SelectBox } from '@/components/common/custom/form';
import GridTopBtn from '@/components/common/GridTopBtn';
import TableTopBtn from '@/components/common/TableTopBtn';
import MsSkuDcSetUploadExcelPopup from '@/components/ms/skudcset/MsSkuDcSetUploadExcelPopup';
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';

// API

interface MsSkuDcSetDetailProps {
	searchForm: any;
	form: any;
	gridData: any;
	totalCount: any;
	setCurrentPage: any;
	searchDtl: any;
	detailData: any;
	saveMasterList: any;
	saveMaster: any;
}

const MsSkuDcSetDetail = forwardRef((props: MsSkuDcSetDetailProps, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// antd Form 사용
	//const [form] = Form.useForm();

	// grid Ref
	ref.gridRef = useRef();

	// 엑셀 업로드 팝업 Ref
	const modalExcelRef = useRef(null);

	// 글로벌 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// rowStatus 값을 실시간 감시
	const rowStatus = Form.useWatch('rowStatus', props.form);

	const sku = Form.useWatch('sku', props.form);
	const skuName = Form.useWatch('skuName', props.form);

	// 센터상품속성 상세 정의
	interface DetailInfo {
		rowStatus: string | null;
		serialkey: string | null;
		dccode: string | null;
		storerkey: string | null;
		sku: string | null;
		skuName: string | null;
		skuDescr: string | null;
		crossdocktype: string | null;
		putawaytype: string | null;
		wharea: string | null;
		whareafloor: number | null;
		loccategory: string | null;
		loclevel: string | null;
		zone: string | null;
		loc: string | null;
		abc: string | null;
		minpoqty: number | null;
		targetpoqty: number | null;
		effectivedate: string | null;
		other01: string | null;
		other02: string | null;
		other03: string | null;
		other04: string | null;
		other05: string | null;
		status: string | null;
		cpYn: string | null;
		smsYn: string | null;
		invoiceCrtType: string | null;
		delYn: string | null;
		cubeYn: string | null;
		adddate: string | null;
		editdate: string | null;
		addwho: string | null;
		editwho: string | null;
		addwhoNm: string | null;
		editwhoNm: string | null;
		inputMode: string | null;
	}

	// 그리드 표시된 데이터 건수
	const [currentCount, setCurrentCount] = useState(0);

	// 그리드 컬럼 설정
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'storerkey',
			headerText: t('lbl.STORERKEY'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKUCD'),
			editable: false,
			dataType: 'code',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'skuDescr',
			headerText: t('lbl.SKUNM'),
			editable: false,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'crossdocktype',
			headerText: t('lbl.CROSSDOCKTYPE'),
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('CROSSDOCKTYPE', value)?.cdNm;
			},
		},
		{
			dataField: 'putawaytype',
			headerText: t('lbl.PUTAWAYTYPE'),
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('PUTAWAYTYPE', value)?.cdNm;
			},
		},
		{
			dataField: 'wharea',
			headerText: t('lbl.WHAREA'),
			editable: false,
		},
		{
			dataField: 'whareafloor',
			headerText: t('lbl.WHAREAFLOOR'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'loccategory',
			headerText: t('lbl.LOCCATEGORY'),
			editable: false,
		},
		{
			dataField: 'loclevel',
			headerText: t('lbl.LOCLEVEL'),
			editable: false,
		},
		{
			dataField: 'zone',
			headerText: t('lbl.ZONE'),
			editable: false,
		},
		{
			dataField: 'loc',
			headerText: t('lbl.LOC'),
			editable: false,
		},
		{
			dataField: 'abc',
			headerText: t('lbl.ABC'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'minpoqty',
			headerText: t('lbl.MINPOQTY'),
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'targetpoqty',
			headerText: t('lbl.TARGETPOQTY'),
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'effectivedate',
			headerText: t('lbl.EFFECTIVEDATE'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'other01',
			headerText: t('lbl.INVOICE_CRT_PRT_SEQ'),
			editable: false,
		},
		{
			dataField: 'other02',
			headerText: t('lbl.ALLOCFIXTYPE'),
			editable: false,
		},
		{
			dataField: 'other03',
			headerText: t('lbl.OTHER03'),
			editable: false,
		},
		{
			dataField: 'other04',
			headerText: t('lbl.OTHER04'),
			editable: false,
		},
		{
			dataField: 'other05',
			headerText: t('lbl.OTHER05'),
			editable: false,
		},
		{
			dataField: 'status',
			headerText: t('lbl.STATUS'),
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('STATUS_SKU', value)?.cdNm;
			},
		},
		{
			dataField: 'smsYn',
			headerText: t('lbl.SORTER_YN'),
			renderer: {
				// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
				type: 'DropDownListRenderer',
				list: getCommonCodeList('YN2', t('lbl.SELECT'), ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
		},
		{
			dataField: 'invoiceCrtType',
			headerText: t('lbl.INVOICE_CRT_TYPE'),
			renderer: {
				// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
				type: 'DropDownListRenderer',
				list: getCommonCodeList('INVOICE_CRT_TYPE', t('lbl.SELECT'), ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
		},
		{
			dataField: 'cubeYn',
			headerText: t('lbl.CUBE_YN'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'delYnname',
			headerText: t('lbl.DEL_YN'),
			editable: false,
		},
		{
			dataField: 'addwhoNm',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager',
			managerDataField: 'addwho',
			editable: false,
		},
		{
			dataField: 'adddate',
			headerText: t('lbl.ADDDATE'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'editwhoNm',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager',
			managerDataField: 'editwho',
			editable: false,
		},
		{
			dataField: 'editdate',
			headerText: t('lbl.EDITDATE'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'delYn',
			visible: false,
		},
		{
			dataField: 'serialkey',
			visible: false,
		},
		{
			dataField: 'addwho',
			visible: false,
		},
		{
			dataField: 'editwho',
			visible: false,
		},
	];

	// 그리드 속성 설정
	const gridProps = {
		editable: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		enableFilter: true,
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'copy', // 행복사
			// 	isActionEvent: false,
			// 	callBackFn: () => {
			// 		copyRow();
			// 	},
			// },
			// {
			// 	btnType: 'new', // 신규
			// 	callBackFn: () => {
			// 		addDeatilInfo();
			// 	},
			// },
			{
				btnType: 'excelUpload',
				isActionEvent: false,
				callBackFn: () => {
					uploadExcel();
				},
			},
			{
				btnType: 'save', // 저장
				callBackFn: () => {
					saveMasterList();
				},
			},
		],
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 외부에서 호출할 수 있는 open 메서드
	 */
	useImperativeHandle(ref, () => ({
		drawDtl: (row: any) => {
			drawDtl(row);
		},
	}));

	/**
	 * 상세 정보 행을 추가한다.
	 */
	const addNew = () => {
		// 이미 신규 행이 있는 경우 경고 메시지를 표시하고 함수를 종료한다.
		if (props.form.getFieldValue('rowStatus') === 'I') {
			showAlert(null, t('msg.MSG_COM_ERR_054'));
			return;
		}

		let dccode = '';
		if (ref.gridRef?.current.getRowCount() > 0) {
			dccode = ref.gridRef.current.getCellValue(0, 'dccode'); //그리드에 바인딩한 데이터의 물류센터
		} else {
			dccode = props.searchForm.getFieldValue('fixdccode'); //조회조건의 물류센터
		}

		// 초기화된 상세 정보 객체를 생성한다.
		const initValues: DetailInfo = {
			rowStatus: 'I',
			serialkey: null,
			dccode: dccode,
			storerkey: globalVariable.gStorerkey,
			sku: null,
			skuName: null,
			crossdocktype: 'STD',
			putawaytype: '',
			wharea: null,
			whareafloor: null,
			loccategory: null,
			loclevel: null,
			zone: null,
			loc: null,
			abc: null,
			minpoqty: 0,
			targetpoqty: 0,
			effectivedate: null,
			other01: null,
			other02: null,
			other03: null,
			other04: null,
			other05: null,
			status: '00',
			cpYn: null,
			smsYn: null,
			invoiceCrtType: null,
			delYn: 'N',
			cubeYn: null,
			adddate: null,
			editdate: null,
			addwho: null,
			editwho: null,
			inputMode: 'NEW',
		};

		// 폼에 초기화된 값을 설정한다.
		props.form.setFieldsValue(initValues);

		//상품 입력란에 포커스를 맞춘다.
		setTimeout(() => {
			const dccodeInput = document.querySelector('input[name="skuName"]') as HTMLInputElement;
			if (dccodeInput) {
				dccodeInput.focus();
			}
		}, 50);
	};

	/**
	 * 상세 정보 행을 추가한다.
	 */
	const addDeatilInfo = () => {
		// 그리드에서 수정 중이면 경고 메시지를 표시한다.
		const checkedItems = ref.gridRef.current.getCheckedRowItems();
		const changedItems = ref.gridRef.current.getChangedData({ validationYn: false });

		if (changedItems && changedItems.length > 0 && checkedItems && checkedItems.length > 0) {
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				addNew();
			});
		} else {
			addNew();
		}
	};

	/**
	 * 행 복사를 실행한다.
	 */
	const copyRow = () => {
		const initValues: Partial<DetailInfo> = {
			rowStatus: 'I',
			serialkey: null,
			sku: null,
			skuName: null,
			skuDescr: null,
			adddate: null,
			editdate: null,
			addwho: null,
			addwhoNm: null,
			editwho: null,
			editwhoNm: null,
			inputMode: 'COPY',
		};

		const selectedRow = gridBtn.tGridRef.current.getSelectedRows();
		if (selectedRow && selectedRow.length > 0) {
			const item: DetailInfo = Object.assign({}, selectedRow[0], initValues);
			gridBtn.tGridRef.current.addRow(item, 'selectionDown');

			const rowIndex = ref.gridRef.current.getSelectedIndex();
			setTimeout(() => {
				const selectedRow = ref.gridRef.current.getItemByRowIndex(rowIndex[0]);
				drawDtl(selectedRow);
			}, 100);
		}
	};

	/**
	 * 센터상품속성 상세 영역 데이터 설정
	 * @param {any} row 행
	 */
	const drawDtl = (row: any) => {
		if (row !== null && row !== undefined) {
			const item = {
				...row,
				rowStatus: commUtil.isEmpty(row.rowStatus) ? 'R' : row.rowStatus,
				skuName: row.sku ? '[' + row.sku + ']' + row.skuDescr : '',
			};
			setTimeout(() => {
				props.form.setFieldsValue({
					...item,
					//	sku: item.sku,
				});
			}, 50);
		}
	};

	/**
	 * 그리드에서 변경된 데이터를 확인하고, 유효성 검사를 거쳐 저장을 진행합니다.
	 * @returns {void}
	 */
	const saveMasterList = () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = ref.gridRef.current.getCheckedRowItems();
		if (!updatedItems || updatedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}
		// validation
		if (updatedItems.length > 0 && !ref.gridRef.current.validateRequiredGridData()) {
			return;
		}
		// update rowStatus forcelly
		for (const item of updatedItems) {
			if (commUtil.isEmpty(item.item.rowStatus) || item.item.rowStatus === 'R') {
				item.item.rowStatus = 'U';
			}
		}
		// save
		props.saveMasterList(updatedItems);
	};

	/**
	 * 상세 정보를 확인하고, 유효성 검사를 거쳐 저장을 진행한다.
	 */
	const saveMaster = async () => {
		try {
			const isValid = await validateForm(props.form);
			if (!isValid) {
				return;
			}

			if (props.form.getFieldValue('rowStatus') === 'R') {
				showAlert(null, t('msg.MSG_COM_VAL_020'));
				return;
			}

			props.saveMaster([props.form.getFieldsValue(true) as DetailInfo]);
		} catch (error: any) {
			showAlert(null, error.errorFields[0].errors[0]);
		}
	};

	/**
	 * 엑셀 업로드 팝업
	 */
	const uploadExcel = () => {
		modalExcelRef.current.handlerOpen();
	};

	/**
	 * 엑셀 업로드 팝업 닫기
	 */
	const closeEventExcel = () => {
		modalExcelRef.current.handlerClose();
	};

	/**
	 * 상세 표 버튼 설정
	 * @returns {TableBtnPropsType} 표 버튼 설정 객체
	 */
	const setTableBtn = () => {
		const tableBtn: TableBtnPropsType = {
			tGridRef: ref.gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'pre', // 이전
					isActionEvent: false,
					callBackFn: async () => {
						// 신규 입력 상태이면 변경 여부 확인
						if (props.form.getFieldValue('rowStatus') === 'I') {
							const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
							if (!isConfirm) {
								return;
							}
						}
						// 그리드의 이전 행을 선택
						ref.gridRef.current.setPrevRowSelected();
						const rowIndex = ref.gridRef.current.getSelectedIndex();
						const selectedRow = ref.gridRef.current.getItemByRowIndex(rowIndex[0]);
						drawDtl(selectedRow);
					},
				},
				{
					btnType: 'post', // 다음
					isActionEvent: false,
					callBackFn: async () => {
						// 신규 입력 상태이면 변경 여부 확인
						if (props.form.getFieldValue('rowStatus') === 'I') {
							const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
							if (!isConfirm) {
								return;
							}
						}
						// 그리드의 다음 행을 선택
						ref.gridRef.current.setNextRowSelected();
						const rowIndex = ref.gridRef.current.getSelectedIndex();
						const selectedRow = ref.gridRef.current.getItemByRowIndex(rowIndex[0]);
						drawDtl(selectedRow);
					},
				},
				// {
				// 	btnType: 'new', // 신규
				// 	callBackFn: addDeatilInfo,
				// },
				{
					btnType: 'save', // 저장
					callBackFn: saveMaster,
				},
			],
		};

		return tableBtn;
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		if (!ref.gridRef?.current) return;

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellEditEnd', (event: any) => {
			if (event.dataField === 'smsYn' || event.dataField === 'invoiceCrtType') {
				// SMSYN, INVOICE_CRT_TYPE 값 변경 시 상세에도 반영
				if (event.item.serialkey === props.form.getFieldValue('serialkey')) {
					// 현재 상세에 표시된 행이면 상세에도 반영
					props.form.setFieldsValue({
						smsYn: event.item.smsYn,
						invoiceCrtType: event.item.invoiceCrtType,
						rowStatus: event.item.rowStatus === 'I' ? 'I' : 'U',
					});
				}
			}
		});

		/**
		 * 그리드 셀 더블클릭
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellDoubleClick', (event: any) => {
			if (event.dataField === 'sku') {
				// 상품코드 셀 더블클릭하면 상품상세팝업 표시
				ref.gridRef.current.openPopup(event.item, 'sku');
			}
		});

		/**
		 * 그리드 셀 선택 변경
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('selectionConstraint', async function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.rowIndex !== event.toRowIndex) {
				// 신규 입력 상태이면 변경 여부 확인
				if (props.form.getFieldValue('rowStatus') === 'I') {
					const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
					if (!isConfirm) {
						return false;
					}
				}

				// 선택된 행의 상세 정보를 조회한다.
				const selectedRow = ref.gridRef.current.getItemByRowIndex(event.toRowIndex);
				drawDtl(selectedRow);
			}
		});
	};

	useScrollPagingAUIGrid({
		gridRef: ref.gridRef,
		callbackWhenScrollToEnd: () => {
			props.setCurrentPage((currentPageScr: any) => currentPageScr + 1);
		},
		totalCount: props.totalCount,
	});

	/**
	 * 대괄호([])로 둘러싸인 내용을 제거한다.
	 * @param str - 입력 문자열
	 * @returns
	 */
	const removeBracketContents = (str: string) => {
		if (!str && str !== '') return str;
		// 대괄호 내부(가장 가까운 닫는 대괄호까지)를 모두 제거
		const withoutBrackets = str.replace(/\[[^\]]*\]/g, '');
		// 앞뒤 공백 제거 및 연속 공백을 하나로 축소
		return withoutBrackets.replace(/\s{2,}/g, ' ').trim();
	};

	/**
	 * Form에서 값이 변경되면 호출되는 함수
	 * @param {any} changedValues 변경된 값
	 * @param {any} allValues 전체 값
	 */
	const onValuesChange = (changedValues: any, allValues: any) => {
		// 변경된 값이 있을 때만 처리
		if (Object.keys(changedValues).length > 0) {
			if (props.form.getFieldValue('rowStatus') === 'R') {
				props.form.setFieldValue('rowStatus', 'U');
			}
			// 그리드의 해당 행도 같이 변경
			const serialkey = props.form.getFieldValue('serialkey');
			if (serialkey && ref.gridRef?.current) {
				const rowIndex = ref.gridRef.current.getRowIndexesByValue('serialkey', serialkey);
				if (rowIndex > -1) {
					// 변경된 모든 필드에 대해 그리드 행 값 동기화
					Object.entries(changedValues).forEach(([field, value]) => {
						ref.gridRef.current.setCellValue(rowIndex, field, value);
					});
				}
			}
		}
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

	/**
	 * 데이터를 조회하면 그리드에 추가한다.
	 */
	useEffect(() => {
		if (ref.gridRef?.current && props.gridData) {
			const len = ref.gridRef.current.getGridData().length;

			ref.gridRef.current.appendData(props.gridData);

			if (props.gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = ref.gridRef.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.gridRef.current.setColumnSizeList(colSizeList);
			}

			// 그리드가 준비되면 첫 번째 행을 선택한다.
			if (len === 0) {
				const selectedRow = ref.gridRef.current.getItemByRowIndex(0);
				drawDtl(selectedRow);
			}
		}
	}, [props.gridData]);

	/**
	 * 상세 데이터를 조회하면 상세 영역에 바인딩한다.
	 */
	useEffect(() => {
		props.form.resetFields();

		props.form.setFieldsValue({
			...props.detailData,
		});
	}, [props.detailData]);

	/**
	 * 상품코드(sku) 값이 변경되면 그리드의 sku, skuDescr 컬럼 값을 자동으로 설정한다.
	 */
	useEffect(() => {
		if (!commUtil.isEmpty(sku)) {
			const rowStatus = props.form.getFieldValue('rowStatus');
			const inputMode = props.form.getFieldValue('inputMode');

			if (rowStatus === 'I' && inputMode === 'COPY') {
				const skuDescr = removeBracketContents(skuName || '');
				const rowIndex = ref.gridRef.current.getSelectedIndex();
				ref.gridRef.current.setCellValue(rowIndex[0], 'sku', sku);
				ref.gridRef.current.setCellValue(rowIndex[0], 'skuDescr', skuDescr);
			}
		}
	}, [sku]);

	return (
		<>
			<AGridWrap className="contain-wrap">
				<AGrid>
					<GridTopBtn gridBtn={gridBtn} totalCnt={props.totalCount} gridTitle={t('lbl.LIST')} />
					<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
				</AGrid>
				{/* 상세 영역 정의 */}
				<Form form={props.form} onValuesChange={onValuesChange}>
					<AGrid className="mt20">
						<TableTopBtn tableTitle={t('lbl.DETAIL')} tableBtn={setTableBtn()} />
						<UiDetailViewArea>
							<UiDetailViewGroup>
								<Form.Item name="rowStatus" hidden>
									<Input />
								</Form.Item>
								<li>
									<SelectBox
										name="dccode"
										label={t('lbl.DCCODE')}
										span={24}
										placeholder={t('msg.selectBox')}
										options={getUserDccodeList('')}
										fieldNames={{ label: 'dcname', value: 'dccode' }}
										required
										rules={[{ required: true, validateTrigger: 'none' }]}
										disabled={true}
									/>
								</li>
								<li>
									<InputText name="storerkey" label={t('lbl.STORERKEY')} required disabled={true} />
								</li>
								<li style={{ gridColumn: '3 / span 2' }}>
									<CmSkuSearch
										form={props.form}
										selectionMode="singleRow"
										name="skuName"
										label={t('lbl.SKUCD')}
										code="sku"
										returnValueFormat="name"
										required
										disabled={rowStatus !== 'I'}
									/>
								</li>
								<li>
									<InputText
										name="wharea"
										label={t('lbl.WHAREA')}
										placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.WHAREA')])}
										required
										rules={[{ required: true, validateTrigger: 'none' }]}
									/>
								</li>
								<li>
									<InputNumber
										name="whareafloor"
										label={t('lbl.WHAREAFLOOR')}
										placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.WHAREAFLOOR')])}
										min={0}
										required
										rules={[{ required: true, validateTrigger: 'none' }]}
									/>
								</li>
								<li>
									<InputText
										name="loccategory"
										label={t('lbl.LOCCATEGORY')}
										placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.LOCCATEGORY')])}
										required
										rules={[{ required: true, validateTrigger: 'none' }]}
									/>
								</li>
								<li>
									<InputText
										name="loclevel"
										label={t('lbl.LOCLEVEL')}
										placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.LOCLEVEL')])}
										required
										rules={[{ required: true, validateTrigger: 'none' }]}
									/>
								</li>
								<li>
									<InputText
										name="zone"
										label={t('lbl.ZONE')}
										placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.ZONE')])}
										required
										rules={[{ required: true, validateTrigger: 'none' }]}
									/>
								</li>
								<li>
									<InputText
										name="loc"
										label={t('lbl.LOC')}
										placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.LOC')])}
										required
										rules={[{ required: true, validateTrigger: 'none' }]}
									/>
								</li>
								<li>
									<SelectBox
										name="putawaytype"
										label={t('lbl.PUTAWAYTYPE')}
										span={24}
										placeholder={t('msg.selectBox')}
										options={getCommonCodeList('PUTAWAYTYPE', t('lbl.SELECT'), '')}
										fieldNames={{ label: 'cdNm', value: 'comCd' }}
									/>
								</li>
								<li>
									<SelectBox
										name="crossdocktype"
										label={t('lbl.CROSSDOCKTYPE')}
										span={24}
										placeholder={t('msg.selectBox')}
										options={getCommonCodeList('CROSSDOCKTYPE', '', '')}
										fieldNames={{ label: 'cdNm', value: 'comCd' }}
									/>
								</li>
								<li>
									<InputText
										name="other01"
										label={t('lbl.INVOICE_CRT_PRT_SEQ')}
										placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.INVOICE_CRT_PRT_SEQ')])}
									/>
								</li>
								<li>
									<SelectBox
										name="other02"
										label={t('lbl.ALLOCFIXTYPE')}
										span={24}
										placeholder={t('msg.selectBox')}
										options={getCommonCodeList('ALLOCFIXTYPE', t('lbl.SELECT'), '')}
										fieldNames={{ label: 'cdNm', value: 'comCd' }}
									/>
								</li>
								<li>
									<InputText
										name="other03"
										label={t('lbl.OTHER03')}
										placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.OTHER03')])}
									/>
								</li>
								<li>
									<InputText
										name="other04"
										label={t('lbl.OTHER04')}
										placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.OTHER04')])}
									/>
								</li>
								<li>
									<InputText
										name="other05"
										label={t('lbl.OTHER05')}
										placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.OTHER05')])}
									/>
								</li>
								<li>
									<SelectBox
										name="cpYn"
										label={t('lbl.CP_YN')}
										span={24}
										placeholder={t('msg.selectBox')}
										options={getCommonCodeList('YN2', t('lbl.SELECT'), '')}
										fieldNames={{ label: 'cdNm', value: 'comCd' }}
									/>
								</li>
								<li>
									<SelectBox
										name="smsYn"
										label={t('lbl.SORTER_YN')}
										span={24}
										placeholder={t('msg.selectBox')}
										options={getCommonCodeList('YN2', t('lbl.SELECT'), '')}
										fieldNames={{ label: 'cdNm', value: 'comCd' }}
									/>
								</li>
								<li>
									<SelectBox
										name="invoiceCrtType"
										label={t('lbl.INVOICE_CRT_TYPE')}
										span={24}
										placeholder={t('msg.selectBox')}
										options={getCommonCodeList('INVOICE_CRT_TYPE', t('lbl.SELECT'), '')}
										fieldNames={{ label: 'cdNm', value: 'comCd' }}
										required
										rules={[{ required: true, validateTrigger: 'none' }]}
									/>
								</li>
								<li>
									<SelectBox
										name="status"
										label={t('lbl.STATUS')}
										span={24}
										placeholder={t('msg.selectBox')}
										options={getCommonCodeList('STATUS_SKU', '', '')}
										fieldNames={{ label: 'cdNm', value: 'comCd' }}
										required
										rules={[{ required: true, validateTrigger: 'none' }]}
									/>
								</li>
								<li>
									<SelectBox
										name="delYn"
										label={t('lbl.DEL_YN')}
										span={24}
										placeholder={t('msg.selectBox')}
										options={getCommonCodeList('DEL_YN', '', '')}
										fieldNames={{ label: 'cdNm', value: 'comCd' }}
										required
									/>
								</li>
								<li>
									<SelectBox
										name="cubeYn"
										label={t('lbl.CUBE_YN')}
										span={24}
										placeholder={t('msg.selectBox')}
										options={getCommonCodeList('YN2', '', '')}
										fieldNames={{ label: 'cdNm', value: 'comCd' }}
									/>
								</li>
								<li></li>
								<li>
									<InputText name="addwhoNm" label={t('lbl.ADDWHO')} maxLength={20} disabled={true} />
								</li>
								<li>
									<InputText name="adddate" label={t('lbl.ADDDATE')} maxLength={20} disabled={true} />
								</li>
								<li>
									<InputText name="editwhoNm" label={t('lbl.EDITWHO')} maxLength={20} disabled={true} />
								</li>
								<li>
									<InputText name="editdate" label={t('lbl.EDITDATE')} maxLength={20} disabled={true} />
								</li>
							</UiDetailViewGroup>
						</UiDetailViewArea>
					</AGrid>
				</Form>
			</AGridWrap>
			{/* 엑셀 업로드 팝업 영역 정의 */}
			<CustomModal ref={modalExcelRef} width="1000px">
				<MsSkuDcSetUploadExcelPopup close={closeEventExcel} />
			</CustomModal>
		</>
	);
});

export default MsSkuDcSetDetail;
