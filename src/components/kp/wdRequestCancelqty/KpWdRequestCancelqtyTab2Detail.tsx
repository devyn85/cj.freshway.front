/*
 ############################################################################
 # FiledataField	: KpWdRequestCancelqtyTab2Detail.tsx
 # Description		: 분류피킹(출고센터)
 # Author			: 공두경
 # Since			: 25.11.18 
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import { apiStoRequest } from '@/api/kp/apiKpWdRequestCancelqty';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
// Utils
// API Call Function

const KpWdRequestCancelqtyTab2Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const { t } = useTranslation();
	const [totalCnt, setTotalCnt] = useState(0);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param authority
	 */
	/**
	 * 편집 가능한 상태인지 확인하는 함수
	 * @param {any} item - 그리드 행 아이템
	 * @returns {boolean} - 편집 가능 여부
	 */
	const isDisabled = (item: any): boolean => {
		if (commUtil.nvl(item?.stoStatus, '') === '90') {
			// STO진행상태가 미등록이면 활성화
			return true;
		}
		return false;
	};

	/**
	 * STO 요청
	 */
	const onStoRequest = () => {
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (!checkedRows || checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		if (checkedRows.some((row: any) => row.reqStatus === '65')) {
			showAlert(null, '이미 STO요청한 건입니다.');
			return;
		}

		if (checkedRows.some((row: any) => row.stoOrderqty == 0 || row.stoOrderqty == null)) {
			showAlert(null, 'STO요청수량을 입력하십시오.');
			return;
		}

		showConfirm(null, t('msg.MSG_COM_CFM_020', ['STO 요청']), () => {
			const params = {
				saveDataTab2List: checkedRows, // 선택된 행의 데이터
			};

			apiStoRequest(params).then(res => {
				if (res.statusCode > -1) {
					showAlert('', '저장되었습니다');
				}
				props.search();
			});
		});
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			headerText: t('lbl.DOCNO'), //*문서번호*/
			dataField: 'docno',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.WD_CENTER'), //*출고센터*/
			dataField: 'fromDccode',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.DCCODE_RT_STO'), //*광역이체센터*/
			dataField: 'wdDccode',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.LOC'), //*출고센터로케이션*/
			dataField: 'fromLoc',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.SKU'),
			/*상품코드*/ dataField: 'sku',
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
			editable: false,
		},
		{
			headerText: t('lbl.SKUNM'),
			/*상품명*/ dataField: 'skuname',
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{
			headerText: t('lbl.UOM'), //*단위*/
			dataField: 'uom',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.ORDERQTY'), //*주문수량*/
			dataField: 'orderqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			headerText: t('lbl.MOBILE_REQQTY'), //*모바일요청수량*/
			dataField: 'missOrderqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			headerText: t('lbl.STO_REQQTY'), //STO요청수량
			/*입고검수량*/ dataField: 'stoOrderqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				return item.stoStatus === '90' ? ref.gridRef.current.removeEditClass(columnIndex) : 'isEdit';
			},
			editRenderer: {
				type: 'InputEditRenderer',
				//allowNegative: true, // 음수허용
				allowPoint: true, // onlyNumeric 인 경우 소수점(.) 도 허용
			},
		},
		{
			headerText: t('lbl.STO_REQ_STATUS'),
			/*STO요청상태*/ dataField: 'reqStatusNm',
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.OPENQTY_ST2'), //*가용재고*/
			dataField: 'stockqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			headerText: '이체센터(재고수량)', //*현재고*/
			dataField: 'wdStockqty',
			dataType: 'numeric',
			formatString: '#,##0.##',
			editable: false,
		},
		{
			dataField: 'addwhonm',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager', // dataType을 'manager'로 설정
			managerDataField: 'addwho', // 노출시킨 사용자명에 해당하는 사용자ID dataField 설정
			editable: false,
		},
		{
			dataField: 'addwho',
			visible: false,
		},
		{ headerText: t('lbl.ADDDATE'), dataField: 'adddate', dataType: 'date', editable: false },
		{
			dataField: 'editwhonm',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager', // dataType을 'manager'로 설정
			managerDataField: 'editwho', // 노출시킨 사용자명에 해당하는 사용자ID dataField 설정
			editable: false,
		},
		{
			dataField: 'editwho',
			visible: false,
		},
		{ headerText: t('lbl.EDITDATE'), dataField: 'editdate', dataType: 'date', editable: false },
		/*START.hidden 컬럼*/
		{ dataField: 'flag', editable: false, visible: false }, // 구분(1:취소,2:누락분)
		{ dataField: 'docdt', editable: false, visible: false }, // docdt
		{ dataField: 'priority', editable: false, visible: false }, // priority
		{ dataField: 'reqStatus', editable: false, visible: false }, // reqStatus - 이거의 용도 알아볼 필요 있음
		{ dataField: 'moveQty', editable: false, visible: false }, // moveQty - 수급센터처리수량
		{ dataField: 'serialkey', editable: false, visible: false }, // serialkey - WD_REQUESTMISSQTY PK
		{ dataField: 'missDccode', editable: false, visible: false }, // missDccode - WD_REQUESTMISSQTY PK
		/*END.hidden 컬럼*/
	];

	// 그리드 Props
	const gridProps = {
		editable: true,
		//autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: false,
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (isDisabled(item)) {
				return 'aui-grid-row-disabled'; // 행 전체 비활성화 스타일
			}
			return '';
		},
		rowCheckDisabledFunction: (rowIndex: number, isChecked: boolean, item: any) => {
			return !isDisabled(item); // status > '00'이면 체크박스 비활성화
		},
	};

	// FooterLayout Props
	const footerLayout = [{}];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn2',
				btnLabel: 'STO요청', // STO요청
				callBackFn: onStoRequest,
			},
		],
	};

	useEffect(() => {
		ref.gridRef.current.bind('cellEditBegin', (event: any) => {
			if (event.dataField === 'stoOrderqty') {
				return event.item.stoStatus != '90';
			}
		});
	}, []);

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

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid className="contain-wrap">
				<GridTopBtn gridBtn={gridBtn} gridTitle="분류피킹(출고센터) 목록" totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});

export default KpWdRequestCancelqtyTab2Detail;
