/*
 ############################################################################
 # FiledataField	: StTransactionSnDetail.tsx
 # Description		: 재고 > 재고현황 > 이력재고처리현황 조회 Grid
 # Author			: YangChangHwan
 # Since			: 25.06.01
 ############################################################################
*/

import { forwardRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// Type
import { GridBtnPropsType } from '@/types/common';

// Components
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// API

// Store

// Libs

// Utils

const DvDataviewSingleSpDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { data, totalCount, refModal } = props;

	const { t } = useTranslation();

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			/* 
			{
				btnType: 'down', // 아래로
			},
			{
				btnType: 'up', // 위로
			},
			{
				btnType: 'excelForm', // 엑셀양식
			},
			{
				btnType: 'excelUpload', // 엑셀업로드
			},
			{
				btnType: 'excelDownload', // 엑셀다운로드
			},
			{
				btnType: 'copy', // 행복사
				initValues: {
					menuId: '',
					regId: '',
					regDt: '',
				},
			},
			{
				btnType: 'curPlus', // 행삽입 (선택된 row 바로 아래 행추가)
			},
			{
				btnType: 'plus', // 행추가
				initValues: {
					menuYn: 0,
					useYn: 0,
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'detailView', // 상세보기
			},
			{
				btnType: 'btn1', // 사용자 정의버튼1
			},
			{
				btnType: 'btn2', // 사용자 정의버튼2
			},
			{
				btnType: 'btn3', // 사용자 정의버튼3
			},
			{
				btnType: 'print', // 인쇄
			},
			{
				btnType: 'new', // 신규
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveFunc,
			},
			{
				btnType: 'elecApproval', // 전자결재
			}, 
			*/
		],
	};

	// 그리드 초기화
	const gridCol = useMemo(
		() => [
			{ dataField: 'serialkey', headerText: t('lbl.SERIALKEY'), style: 'center' },
			{ dataField: 'asrsSn', headerText: t('lbl.ASRS_SN'), style: 'center' },
			{ dataField: 'doctype', headerText: t('lbl.DOCTYPE'), style: 'center' },
			{ dataField: 'status', headerText: t('lbl.STATUS'), style: 'center' },
			{ dataField: 'sku', headerText: t('lbl.SKU'), style: 'center' },
			{ dataField: 'skuname', headerText: t('lbl.SKUNAME'), style: 'center' },
			{ dataField: 'fromloc', headerText: t('lbl.FROMLOC'), style: 'center' },
			{ dataField: 'toloc', headerText: t('lbl.TOLOC'), style: 'center' },
			{ dataField: 'stockid', headerText: t('lbl.STOCKID'), style: 'center' },
			{ dataField: 'caseqty', headerText: t('lbl.CASEQTY'), dataType: 'numeric' },
			{ dataField: 'eaqty', headerText: t('lbl.EAQTY'), dataType: 'numeric' },
			{ dataField: 'totqty', headerText: t('lbl.TOTQTY'), dataType: 'numeric' },
			{ dataField: 'sourcekey', headerText: t('lbl.SOURCEKEY'), style: 'center' },
			{ dataField: 'qtyperbox', headerText: t('lbl.QTYPERBOX'), dataType: 'numeric' },
			{ dataField: 'packkey', headerText: t('lbl.PACKKEY'), style: 'center' },
			{ dataField: 'asrsno', headerText: t('lbl.ASRSNO'), style: 'center' },
			{ dataField: 'ifSendFile', headerText: t('lbl.IF_SEND_FILE'), style: 'center' },
			{ dataField: 'ifReceiveFile', headerText: t('lbl.IF_RECEIVE_FILE'), style: 'center' },
			{ dataField: 'adddate', headerText: t('lbl.ADDDATE'), style: 'center' },
			{ dataField: 'editdate', headerText: t('lbl.EDITDATE'), style: 'center' },
			{ dataField: 'addwho', headerText: t('lbl.ADDWHO'), style: 'center' },
			{ dataField: 'editwho', headerText: t('lbl.EDITWHO'), style: 'center' },
			{ dataField: 'storerkey', headerText: t('lbl.STORERKEY'), style: 'center' },
		],
		[t],
	);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *	02. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 그리드 속성
	const gridProps = useMemo(
		() => ({
			editable: false,

			showStateColumn: false, // row 편집 여부
			enableColumnResize: true, // 열 사이즈 조정 여부

			fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		}),
		[],
	);

	/**
	 * ==========================================================================
   -  AUI Grid Event Initailize
   - [참고]https://www.auisoft.net/documentation/auigrid/DataGrid/Events.html
	 * ==========================================================================
	 */

	useEffect(() => {
		// [중요] aui grid의 bind 함수는 updated hook 안에서 호출합니다.
		// aui grid의 bind함수는 상태 관리(ref, state) 객체/변수가 동기화되지 않으므로 update 될 때마다 bind 해줍니다.
		// 단, eventhandler 내부에 상태 관리 객체/변수가 없을 경우 mount 시에만 bind 해주어도 됩니다.
	});

	useEffect(() => {
		const gRef = gridRef.current;
		if (gRef) {
			// 그리드 초기화
			gRef?.appendData(data);
			gRef?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gRef.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gRef.setColumnSizeList(colSizeList);
			}
		}
	}, [data]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle="인터페이스 LIST" gridBtn={gridBtn} totalCnt={totalCount} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
});

export default DvDataviewSingleSpDetail;
