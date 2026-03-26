/*
 ############################################################################
 # FiledataField	: IbAllWeightDetail.tsx
 # Description		: 정산 > 정산작업 > 센터별물동량 정산 조회 Grid Header
 # Author			: KimDongHyeon
 # Since			: 2025.11.12
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import { GridBtnPropsType } from '@/types/common';
import { Form } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const IbAllWeightDetail2 = ({ gridRef, gridData, copyMasterList, saveMasterList, addRow, searchExcel }: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const [summary, setSummary] = useState<any>({});
	const userDccodeList = getUserDccodeList('') ?? [];
	const MS_MULDONG_BASE1_LIST = getCommonCodeList('MS_MULDONG_BASE1'); //대분류
	const MS_MULDONG_BASE2_LIST = getCommonCodeList('MS_MULDONG_BASE2'); //중분류
	const PUTAWAYTYPE_LIST = getCommonCodeList('PUTAWAYTYPE'); //저장유무
	const MS_MULDONG_BASE3_LIST = getCommonCodeList('MS_MULDONG_BASE3'); //단가구분
	const MS_MULDONG_BASE4_LIST = getCommonCodeList('MS_MULDONG_BASE4'); //단위
	const refModal = useRef(null);
	const excelParams = {
		fileName: '센터별물동량 정산',
		exportWithStyle: true, // 스타일 적용 여부
		progressBar: true, // 진행바 표시 여부
	};
	const { t } = useTranslation();

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelDownload', // excelDownload
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: searchExcel,
			},
		],
	};

	const gridCol = [
		{
			dataField: 'viewName',
			headerText: '',
			required: false,
			dataType: 'string',
		},
		{
			dataField: 'amt',
			headerText: t('lbl.AMT'),
			editable: true,
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'price',
			headerText: t('lbl.FACTORYPRICE'),
			editable: false,
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'qty',
			headerText: `${t('lbl.QTY')}/${t('lbl.DELIVERYWEIGHT')}`,
			editable: false,
			dataType: 'numeric',
			formatString: '#,##0.###',
		},
		{
			dataField: 'upperId',
			visible: false,
		},
		{
			dataField: 'id',
			visible: false,
		},
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  02. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	const gridProps = {
		// 트리 구조 관련 속성
		// treeColumnIndex: 1, // 계층형 그리드(트리 그리드) 에서 트리 아이콘을 출력시킬 칼럼 인덱스를 지정
		treeIdField: 'id',
		treeIdRefField: 'upperId',
		flat2tree: true,
		displayTreeOpen: true,
		//아이콘 없애기
		treeIconFunction: (rowIndex: any, isBranch: any, isOpen: any, depth: any, item: any) => {
			return '';
		},
		editable: false, // true 설정시 수정 안할 컬럼에 editable: false, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		showRowNumColumn: false,
		showBranchOnGrouping: false, // 여백 윗줄 지우기.
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item.level == '0') {
				//1depth
				return {
					backgroundColor: 'yellow',
					fontWeight: 'bold',
					fontSize: '14px',
				};
			} else if (item.level == '1') {
				//2depth
				return {
					backgroundColor: 'lightblue',
					fontWeight: 'bold',
					fontSize: '14px',
				};
			}
		}, // end of rowStyleFunction
	};

	/**
	 * ==========================================================================
   -  AUI Grid Event Initailize
   - [참고]https://www.auisoft.net/documentation/auigrid/DataGrid/Events.html
	 * ==========================================================================
	 */
	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		// 셀 더블 클릭 이벤트
	};

	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		if (gridRef.current) {
			if (gridData.length > 0) {
				// 그리드 초기화
				const totalAmt = gridData
					.filter((item: any) => item.upperId == '0')
					.reduce((prev: any, curr: any) => {
						return prev + parseInt(curr.amt);
					}, 0);
				setSummary({
					totalAmt: totalAmt,
					tax: Math.round(totalAmt * 0.1),
					totalAmtWithTax: totalAmt + Math.round(totalAmt * 0.1),
				});

				gridRef.current?.setGridData([
					{ upperId: '', viewName: '총공급가액', amt: totalAmt, id: 0, level: '0' },
					...gridData,
				]);
				// gridRef.current?.setGridData(gridData);
				gridRef.current?.setSelectionByIndex(0, 0);

				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.current.setColumnSizeList(colSizeList);
			} else {
				gridRef.current?.setGridData(gridData);
			}
		}
	}, [gridData]);

	return (
		<>
			<AGrid>
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length}>
					<Form layout="inline">
						총금액 : {(summary?.totalAmtWithTax || 0).toLocaleString('en')}원 / 공급가액 :{' '}
						{(summary?.totalAmt || 0).toLocaleString('en')}원 / 부가세 : {(summary?.tax || 0).toLocaleString('en')}원
					</Form>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			{/* 그리드 컬럼 팝업 영역 정의 */}
			<CmSearchWrapper ref={refModal} />
		</>
	);
};

export default IbAllWeightDetail2;
