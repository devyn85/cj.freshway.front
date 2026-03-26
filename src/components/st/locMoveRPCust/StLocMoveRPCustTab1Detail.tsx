/*
 ############################################################################
 # FiledataField	: StLocMoveRPCustTab1Detail.tsx
 # Description		: 보충생성(Detail)
 # Author			: 공두경
 # Since			: 25.07.18
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API

import axios from '@/api/Axios';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
// Utils
// API Call Function

const StLocMoveRPCustTab1Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	ref.gridRef2 = useRef(null);
	const { t } = useTranslation();
	const [totalCnt, setTotalCnt] = useState(0);
	const uploadFile = useRef(null);
	const modalRef = useRef(null);
	const [loopTrParams, setLoopTrParams] = useState({});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */
	/**
	 * 보충생성
	 */
	const onCreation = () => {
		// 보충생성 로직 구현
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		const searchParams = props.form.getFieldsValue();
		let msg = '보충생성';
		if (checkedRows.length > 100) {
			msg = '보충생성(100건씩)';
		}

		showConfirm(null, t('msg.MSG_COM_CFM_020', [msg]), () => {
			const list = [];
			const allCustKeys = checkedRows.map((row: any) => row.toCustkey);
			const chunkSize = 100;

			for (let i = 0; i < allCustKeys.length; i += chunkSize) {
				const chunk = allCustKeys.slice(i, i + chunkSize);
				list.push({
					slipdt: searchParams.secrchDate.format('YYYYMMDD'),
					sku: searchParams.sku,
					fromzone: searchParams.fromzone,
					tozone: searchParams.tozone,
					fixdccode: searchParams.fixdccode,
					custkey: chunk.join(','), // 선택된 관리처 코드
				});
			}

			const params = {
				apiUrl: '/api/st/locMoveRP/v1.0/saveCreate',
				avc_COMMAND: 'CREATION',
				fixdccode: searchParams.fixdccode,
				dataKey: 'saveCreationList',
				saveDataList: list, // 선택된 행의 데이터
			};

			setLoopTrParams(params);
			modalRef.current.handlerOpen();
		});
	};

	/**
	 * ASRS지시
	 */
	const onDiraction = () => {
		// ASRS지시 로직 구현
		const checkedRows = ref.gridRef2.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		const searchParams = props.form.getFieldsValue();
		showConfirm(null, '자동창고로 보충지시 하시겠습니까?', () => {
			const rowDataList1 = checkedRows.filter(
				(item: any) => ['Y'].includes(item.asrsyn) && ['N'].includes(item.ifFlag),
			);

			if (rowDataList1.length > 0) {
				const params = {
					apiUrl: '/api/st/locMoveRP/v1.0/saveDiraction',
					avc_COMMAND: 'SETTASK',
					fixdccode: searchParams.fixdccode,
					saveDataList: rowDataList1, // 선택된 행의 데이터
				};
				setLoopTrParams(params);
				modalRef.current.handlerOpen();
			}
		});
	};

	/**
	 * 일반보충이동
	 */
	const onMove = () => {
		// 일반보충이동 로직 구현
		const checkedRows = ref.gridRef2.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		showConfirm(null, '보충이동하시겠습니까?', () => {
			const rowDataList1 = checkedRows.filter(
				(item: any) => (['Y'].includes(item.asrsyn) && ['Y'].includes(item.ifFlag)) || ['N'].includes(item.asrsyn),
			);
			const searchParams = props.form.getFieldsValue();

			if (rowDataList1.length > 0) {
				const params = {
					apiUrl: '/api/st/locMoveRP/v1.0/saveMove',
					avc_COMMAND: 'CONFIRM',
					fixdccode: searchParams.fixdccode,
					saveDataList: rowDataList1, // 선택된 행의 데이터
				};

				setLoopTrParams(params);
				modalRef.current.handlerOpen();
			}
		});
	};

	/**
	 * 리스트
	 */
	const onList = () => {
		// 리스트 로직 구현
		const checkedRows = ref.gridRef2.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			const searchParams = props.form.getFieldsValue();
			const params = {
				avc_COMMAND: 'PRINT',
				fixdccode: searchParams.fixdccode,
				saveDataList: checkedRows, // 선택된 행의 데이터
			};
			apiGetPrint(params).then(res => {
				//rd리포트 호출
				if (res.statusCode > -1) {
					viewRdReportMaster(res); // 리포트 뷰어 열기)
				}
			});
		});
	};

	/**
	 * 리포트 뷰어 열기
	 * @param {any} res API 응답 데이터
	 */
	const viewRdReportMaster = (res: any) => {
		const { data } = res;

		// 1. 리포트 파일명
		const fileName = 'ST_LocMoveRP.mrd';

		// 2. 리포트에 XML 생성을 위한 DataSet 생성
		const dataSet = {
			ds_report: data, // 헤더 정보
		};

		// 3. 리포트에 전송할 파라미터
		const params = {};

		reportUtil.openAgentReportViewer(fileName, dataSet, params);
	};

	/**
	 * 리스트 조회
	 * @param {any} params 등록 파라미터
	 * @returns {object} 성공여부 결과값
	 */
	const apiGetPrint = (params: any) => {
		return axios.post('/api/st/locMoveRP/v1.0/getPrint', params).then(res => res.data);
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		modalRef.current.handlerClose();
		props.search(); // 검색 함수 호출
	};
	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{ headerText: '관리처코드', dataField: 'toCustkey', dataType: 'code' }, //관리처코드
		{ headerText: '관리처명', dataField: 'custname' }, //관리처명
		{ headerText: '피킹유형', dataField: 'distancetype', dataType: 'code' }, //피킹유형
		{ headerText: '상품수', dataField: 'skuCnt', dataType: 'numeric', style: 'right' }, //상품수
		{ headerText: '예정량', dataField: 'orderqty', dataType: 'numeric', style: 'right' }, //예정량
		{ headerText: '분배량', dataField: 'processqty', dataType: 'numeric', style: 'right' }, //분배량
		{ headerText: '미분배량', dataField: 'unprocessqty', dataType: 'numeric', style: 'right' }, //미분배량
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: true,
		showFooter: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		height: 270,
	};

	// FooterLayout Props
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'toCustkey',
		},
		{
			dataField: 'skuCnt',
			positionField: 'skuCnt',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'orderqty',
			positionField: 'orderqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'processqty',
			positionField: 'processqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'unprocessqty',
			positionField: 'unprocessqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			style: 'right',
		},
	];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1',
				btnLabel: '보충생성', // 보충생성
				callBackFn: onCreation,
			},
		],
	};

	//그리드 컬럼
	const gridCol2 = [
		{ headerText: '물류센터', dataField: 'dcname', dataType: 'code' },
		{
			headerText: '상품정보',
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'),
					width: 80,
					editable: false,
					filter: { showIcon: true },
					dataType: 'code',
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.gridRef.current.openPopup(e.item, 'sku');
						},
					},
				}, // 상품코드
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'),
					width: 120,
					editable: false,
					dataType: 'name',
					filter: { showIcon: true },
				}, // 상품명
				{ headerText: 'MC', dataField: 'mc', dataType: 'code' },
				{ headerText: '저장조건', dataField: 'storagetypename', dataType: 'code' },
				{ headerText: '단위', dataField: 'uom', dataType: 'code' },
				{ headerText: '재고ID', dataField: 'stockid', dataType: 'code' },
			],
		},
		{
			headerText: 'FROM 로케이션',
			children: [
				{ headerText: '로케이션종류', dataField: 'loccategory', dataType: 'code' },
				{ headerText: 'FROM 로케이션', dataField: 'fromloc', dataType: 'code' },
			],
		},
		{ headerText: 'TO 로케이션', dataField: 'toloc', dataType: 'code' },
		{
			headerText: '보충예정량',
			children: [
				{ headerText: '박스입수', dataField: 'qtyperbox', dataType: 'numneric', style: 'right' },
				{ headerText: 'BOX', dataField: 'openqtyBox', dataType: 'numneric', style: 'right' },
				{ headerText: 'EA', dataField: 'openqtyEa', dataType: 'numneric', style: 'right' },
				{ headerText: '재고속성', dataField: 'stockgradename', dataType: 'code' },
			],
		},
		{
			headerText: '보충량',
			children: [
				{ headerText: 'BOX', dataField: 'confirmqtyBox', dataType: 'numneric', style: 'right' },
				{ headerText: 'EA', dataField: 'confirmqtyEa', dataType: 'numneric', style: 'right' },
			],
		},
		{
			headerText: '기준일(소비,제조)',
			children: [
				{ headerText: '기준일(소비,제조)', dataField: 'lottable01', dataType: 'code' },
				{ headerText: '소비기간(잔여/전체)', dataField: 'durationTerm', dataType: 'code' },
			],
		},
		{ headerText: '발행여부', dataField: 'printynname', dataType: 'code' },
		{ headerText: '작업상태', dataField: 'status', dataType: 'code' },
		{ headerText: '지시여부', dataField: 'ifFlag', dataType: 'code' },
		{ headerText: '처리결과', dataField: 'ifSendFile', dataType: 'code' },
		{ headerText: '전송시간', dataField: 'ifDate', dataType: 'date' },
		{ headerText: '보충번호', dataField: 'supplno', dataType: 'code' },
		{ headerText: '보충라인', dataField: 'supplline', dataType: 'code' },
	];

	// 그리드 Props
	const gridProps2 = {
		editable: false,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: true,
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
	};

	// FooterLayout Props
	const footerLayout2 = [
		{
			labelText: '합계',
			positionField: 'dcname',
		},
		{
			dataField: 'openqtyBox',
			positionField: 'openqtyBox',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'openqtyEa',
			positionField: 'openqtyEa',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'confirmqtyBox',
			positionField: 'confirmqtyBox',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			style: 'right',
		},
		{
			dataField: 'confirmqtyEa',
			positionField: 'confirmqtyEa',
			operation: 'SUM',
			formatString: '#,##0.##',
			postfix: '',
			style: 'right',
		},
	];

	// 그리드 버튼
	const gridBtn2: GridBtnPropsType = {
		tGridRef: ref.gridRef2, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn2',
				btnLabel: '일반보충이동', // 일반보충이동
				callBackFn: onMove,
			},
			{
				btnType: 'btn3',
				btnLabel: '리스트', // 리스트
				callBackFn: onList,
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

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef2.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data2);
			gridRefCur1?.setSelectionByIndex(0, 0);

			if (props.data2.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur1.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data2]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef2?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
							<GridTopBtn gridBtn={gridBtn} gridTitle="관리처 목록" totalCnt={props.totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
							<GridTopBtn gridBtn={gridBtn2} gridTitle="상품 목록" />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps2} footerLayout={footerLayout2} />
						</GridAutoHeight>
					</>,
				]}
			/>
			<CustomModal ref={modalRef} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
			</CustomModal>
		</>
	);
});

export default StLocMoveRPCustTab1Detail;
