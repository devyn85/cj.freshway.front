/*
 ############################################################################
 # FiledataField	: WdAllocationBatchGroupTap7Detail.tsx
 # Description		: 거래처상품 상미율 Detail
 # Author			: 공두경
 # Since			: 25.11.21
 ############################################################################
*/
import { Form } from 'antd';
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
import { getCommonCodeList } from '@/store/core/comCodeStore';

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import { apiSaveTab7MasterList } from '@/api/wd/apiWdAllocationBatchGroup';
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import styled from 'styled-components';

// Utils
// API Call Function

const WdAllocationBatchGroupTap7Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();
	ref.gridRef = useRef();
	const { t } = useTranslation();

	const modalRef = useRef(null);
	const [popupType, setPopupType] = useState('');

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */

	const confirmPopup = (selectedRow: any) => {
		if (popupType === 'sku') {
			ref.gridRef.current.setCellValue(ref.gridRef.current.getSelectedIndex()[0], 'sku', selectedRow[0].code);
			ref.gridRef.current.setCellValue(ref.gridRef.current.getSelectedIndex()[0], 'skuname', selectedRow[0].name);
		}

		modalRef.current.handlerClose();

		// const gridData = ref.gridRef.current.getGridData();
		// if (gridData.some((row: any) => !row.sku)) {
		// 	return;
		// }

		// // PK validation
		// if (!ref.gridRef.current.validatePKGridData(['dccode', 'storerkey', 'sku'])) {
		// 	return;
		// }

		// PK validation
		if (!commUtil.validatePKData(ref.gridRef, ['dccode', 'storerkey', 'sku'])) {
			ref.gridRef.current.setCellValue(ref.gridRef.current.getSelectedIndex()[0], 'sku', '');
			ref.gridRef.current.setCellValue(ref.gridRef.current.getSelectedIndex()[0], 'skuname', '');
			return;
		}
	};

	const closeEvent = () => {
		modalRef.current.handlerClose();
	};

	/**
	 * 저장
	 */
	const saveMasterList = async () => {
		// 수정된 데이터
		const updatedItems = ref.gridRef.current.getChangedData({ validationYn: false });
		// 변경 데이터 확인
		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		if (updatedItems.length > 0 && !ref.gridRef.current.validateRequiredGridData()) {
			return;
		}
		// 전체 행 (삭제된 행 제외됨) - 기간 중복 검증을 위해 전체 데이터 필터
		const gridData = ref.gridRef.current.getGridData();

		const searchParams = props.form.getFieldsValue();

		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			const itemsToSave = updatedItems.map((item: any) => ({ ...item, dccode: searchParams.fixdccode }));
			apiSaveTab7MasterList(itemsToSave).then(res => {
				if (res.statusCode == 0) {
					showAlert('', t('msg.MSG_COM_SUC_003'), () => {
						ref.gridRef.current.clearGridData();
						props.callBackFn(); // 검색 함수 호출
					});
				}
			});
		});
	};

	// const validatePKData = (columnList: string[]) => {
	// 	if (columnList.length < 1) return false;

	// 	const columnInfoList: any[] = []; // 체크 컬럼
	// 	const collectRequiredColumns = (columns: any[]) => {
	// 		for (const item of columns) {
	// 			// 체크 칼럼 추가
	// 			if (columnList.includes(item.dataField)) {
	// 				columnInfoList.push(item);
	// 			}

	// 			// 자식 칼럼도 체크
	// 			if (item.children && item.children.length > 0) {
	// 				collectRequiredColumns(item.children);
	// 			}
	// 		}
	// 	};
	// 	const allColumnLayout: any = ref.gridRef.current.getColumnLayout();
	// 	collectRequiredColumns(allColumnLayout);

	// 	const gridData = ref.gridRef.current.getGridData();
	// 	const existingRows = gridData.filter((r: any) => columnInfoList.some((col: any) => r[col.dataField]));

	// 	const map = new Map();
	// 	for (const i in existingRows) {
	// 		let value = '';
	// 		for (const j in columnInfoList) {
	// 			value += `${existingRows[i][columnInfoList[j].dataField]}`;
	// 		}

	// 		// 중복된 값이 있을 경우
	// 		if (map.has(value)) {
	// 			showAlert(null, `[ ${value} ] 중복된 값입니다.`);

	// 			return false;
	// 		} else {
	// 			map.set(value, i);
	// 		}
	// 	}

	// 	return true;
	// };

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			headerText: t('lbl.SKU'), //상품코드
			dataField: 'sku',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(
						{
							sku: e.item.sku,
						},
						'sku',
					);
				},
			},
			required: true,
			editable: true,
		},
		{
			headerText: t('lbl.SKUNAME'), //상품명칭
			dataField: 'skuname',
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{ headerText: t('lbl.REMARK'), /*비고*/ dataField: 'rmk1' /*RMK로 하면 FOCUSOUT이 안됨*/ },
		{
			headerText: t('lbl.USE_YN'),
			/*사용여부*/ dataField: 'useYn',
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('YN'),
			},
		},
		{
			headerText: t('lbl.ADDWHO'),
			/*등록자*/ dataField: 'addwho',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.ADDDATE'),
			/*등록일시*/ dataField: 'adddate',
			dataType: 'date',
			editable: false,
		},
		{
			headerText: t('lbl.EDITWHO'),
			/*수정자*/ dataField: 'editwho',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.EDITDATE'),
			/*수정일시*/ dataField: 'editdate',
			dataType: 'date',
			editable: false,
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: true,
		autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: true,
		showFooter: false,
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		enableFilter: true,
		isLegacyRemove: true,
	};

	// FooterLayout Props
	const footerLayout = [{}];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
				initValues: commUtil.gfnCreateInitValue(gridCol, {
					rowStatus: 'I',
					useYn: 'Y',
				}),
			},
			{
				btnType: 'btn8',
				btnLabel: '삭제',
				callBackFn: () => {
					const updatedItems = ref.gridRef.current.getCheckedRowItems();
					if (updatedItems || updatedItems.length > 0) {
						updatedItems.reverse().forEach((item: any) => {
							ref.gridRef.current.removeRow(item.rowIndex);
						});
					}
				},
			},
			{
				btnType: 'save',
				callBackFn: saveMasterList,
			},
		],
	};

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		/**
		 * 그리드 셀 클릭 이벤트 조회 팝업 호출
		 * @param {any} event 이벤트
		 */
		ref.gridRef?.current.bind('cellClick', (event: any) => {
			if (ref.gridRef.current.getCellValue(event.rowIndex, 'rowStatus') === 'I' || commUtil.isEmpty(event.item.sku)) {
				if (event.dataField === 'sku') {
					setPopupType('sku');
				} else {
					// sku 또는 custkey가 아닌 경우 팝업 호출하지 않음
					return;
				}

				if (commUtil.isEmpty(event.item.sku)) {
					ref.gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'I');
					ref.gridRef.current.setCellValue(event.rowIndex, 'useYn', 'Y');
				}

				modalRef.current.handlerOpen();
			}
		});

		ref.gridRef?.current.bind('cellEditBegin', function (event: any) {
			const rowIdField = ref.gridRef.current.getProp('rowIdField');
			if (event.dataField != 'rmk1' /*RMK로 하면 FOCUSOUT이 안됨*/ && event.dataField != 'useYn') {
				return false;
			}
		});
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<CustomForm>
				<AGrid style={{ marginTop: '15px', marginBottom: '10px' }}>
					<GridTopBtn gridBtn={gridBtn} gridTitle="분배예외처리상품 목록" totalCnt={props.totalCnt} />
				</AGrid>
				<GridAutoHeight id="WdAllocationBatchGroupTap7Detail-grid">
					<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
				</GridAutoHeight>
			</CustomForm>
			<CustomModal ref={modalRef} width="1000px">
				<CmSearchPopup type={popupType} callBack={confirmPopup} close={closeEvent}></CmSearchPopup>
			</CustomModal>
		</>
	);
});

const CustomForm = styled(Form)`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
`;

export default WdAllocationBatchGroupTap7Detail;
