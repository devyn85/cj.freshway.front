// React
import { forwardRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// CSS

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Type

// Component

// Store
import GridAutoHeight from '@/components/common/GridAutoHeight';
import { getCommonCodebyCd } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';

const OmInplanMonitoringTab3 = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	// 다국어
	const { t } = useTranslation();

	const userDccodeList = getUserDccodeList('') ?? [];

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'dcCode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: userDccodeList,
				keyField: 'dccode', // key 에 해당되는 필드명
				valueField: 'dcname',
			},
			filter: {
				showIcon: true,
			},
			cellMerge: true,
		},
		{
			dataField: 'dcName',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				const dcCode = item.dcCode;
				return userDccodeList.find((item: any) => item.dccode === dcCode)?.dcname.split(']')[1] || '';
			},
			filter: {
				showIcon: true,
			},
			cellMerge: true,
		},
		{
			dataField: 'deliveryDate',
			headerText: t('lbl.DELIVERYDATE'),
			dataType: 'date',
			cellMerge: true,
			mergeRef: 'dcCode',
			mergePolicy: 'restrict',
		},
		{
			dataField: 'docType',
			headerText: t('lbl.DOCTYPE'),
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('DOCTYPE', value)?.cdNm;
			},
		},
		{
			dataField: 'ifSendType',
			headerText: '작업유형',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const codeList = [
					{ comCd: 'PO', cdNm: '입고' },
					{ comCd: 'SO', cdNm: '출고' },
					{ comCd: 'JASO', cdNm: '자소' },
					{ comCd: 'STOFS', cdNm: 'STO점포' },
					{ comCd: 'STODC', cdNm: '센터' },
					{ comCd: 'WMSPO', cdNm: '협력사반품' },
				];
				const result = codeList.find((el: any) => {
					if (el.comCd === value) {
						return el;
					}
				});
				return result?.cdNm || '';
			},
		},
		{
			dataField: 'orderType',
			headerText: '오더유형',
			dataType: 'code',
		},
		{
			dataField: 'plant',
			headerText: t('lbl.PLANT'),
			dataType: 'code',
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'custOrderCloseType',
			headerText: '마감유형',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('CUSTORDERCLOSETYPE', value)?.cdNm;
			},
		},
		{
			dataField: 'custKey',
			headerText: t('lbl.CUSTKEY'),
			dataType: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					props.gridRef.current.openPopup(
						{
							custkey: e.item.custKey,
							custtype: 'C',
						},
						'cust',
					);
				},
			},
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'orderCnt',
			headerText: t('lbl.ORDERCNT'),
			dataType: 'numeric',
		},
		{
			dataField: 'orderDelCnt',
			headerText: '삭제건수',
			dataType: 'numeric',
		},
		{
			dataField: 'orderOmsflagCnt',
			headerText: '마감건수',
			dataType: 'numeric',
		},
		{
			dataField: 'orderOpenCnt',
			headerText: '오픈건수',
			dataType: 'numeric',
		},
		{
			dataField: 'orderQty',
			headerText: t('lbl.ORDERQTY'),
			dataType: 'numeric',
		},
		{
			dataField: 'orderDelQty',
			headerText: '삭제수량',
			dataType: 'numeric',
		},
		{
			dataField: 'orderOmsflagQty',
			headerText: '마감수량',
			dataType: 'numeric',
		},
		{
			dataField: 'orderOpenQty',
			headerText: '확정수량',
			dataType: 'numeric',
		},
		{
			dataField: 'wmsCloseChk',
			headerText: '마감상태',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
		},
		// {
		// 	dataField: 'fsCntChk',
		// 	headerText: t('lbl.FSCNTCHK'),
		// },
		// {
		// 	dataField: 'fsCntRate',
		// 	headerText: t('lbl.FSCNTRATE'),
		// 	dataType: 'numeric',
		// },
		// {
		// 	dataField: 'checkYn',
		// 	headerText: t('lbl.CHECKYN'),
		// },
	];

	// 그리드 속성
	const gridProps = {
		editable: false,
		showRowCheckColumn: false,
		enableFilter: true,
		showFooter: true,
		enableCellMerge: true,
	};

	// FooterLayout Props
	const footerLayout = [
		{
			dataField: 'dcCode',
			positionField: 'dcCode',
			operation: 'COUNT',
			formatString: '#,##0',
			postfix: ' rows',
		},
		{
			dataField: 'orderCnt',
			positionField: 'orderCnt',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'orderDelCnt',
			positionField: 'orderDelCnt',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'orderOmsflagCnt',
			positionField: 'orderOmsflagCnt',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'orderOpenCnt',
			positionField: 'orderOpenCnt',
			operation: 'SUM',
			formatString: '#,##0',
		},
		{
			dataField: 'orderQty',
			positionField: 'orderQty',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			dataField: 'orderDelQty',
			positionField: 'orderDelQty',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			dataField: 'orderOmsflagQty',
			positionField: 'orderOmsflagQty',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
		{
			dataField: 'orderOpenQty',
			positionField: 'orderOpenQty',
			operation: 'SUM',
			formatString: '#,##0.##',
		},
	];

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
		 */
		gridRef?.current.bind('ready', () => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
		});
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
		const gridRefCur = props.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	return (
		<GridAutoHeight style={{ paddingTop: 10 }}>
			<AUIGrid ref={props.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
		</GridAutoHeight>
	);
});

export default OmInplanMonitoringTab3;
