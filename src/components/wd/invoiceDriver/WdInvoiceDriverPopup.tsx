/*
 ############################################################################
 # FiledataField	: WdInvoiceDrivePopup.tsx
 # Description		: 정산 > 정산작업 > 센터별물동량
 # Author			: KimDongHyeon
 # Since			: 2025.10.24
 ############################################################################*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';
import { useEffect } from 'react';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import TotalCount from '@/assets/styled/Container/TotalCount';

// component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// Utils
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
import commUtil from '@/util/commUtil';
import { useTranslation } from 'react-i18next';
// API Call Function
type TabInfoType = {
	[key: string]: {
		[subKey: string]: {
			isBind: boolean;
			checkType: string;
			masterkey: string;
			gridRef: any;
		};
	};
};

const WdInvoiceDrivePopup = forwardRef(({ closeModal, gridData, gridRef, printDetailListPart }: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const [totalCnt, setTotalCnt] = useState(0);
	const { t } = useTranslation();
	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	const gridCol = [
		{
			dataField: 'dcname',
			headerText: t('lbl.DCNAME'),
			dataType: 'string',
			editable: false,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'deliverydt',
			headerText: t('lbl.DELIVERYDT'),
			editable: false,
			dataType: 'date',
		},
		{
			dataField: 'priority',
			headerText: t('lbl.PRIORITY'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'deliverygroup',
			headerText: t('lbl.DELIVERYGROUP'),
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.TRUTH_CUSTKEY'),
			dataField: 'truthcustkey',
			dataType: 'code',
			// width: 150,
		},
		{
			headerText: t('lbl.TRUTH_CUSTNAME'),
			dataField: 'truthcustname',
			// width: 400,
		},
	];

	const gridProps = {
		editable: false,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true, //체크박스
		showCustomRowCheckColumn: true,
		fillColumnSizeMode: true, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
		isLegacyRemove: true, // 기존행 삭제 가능 옵션
	};

	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	const initEvent = () => {};

	// 그리드 다음 페이지 Data 조회되면 그리드에 추가
	useEffect(() => {
		let prevKey: any = null;
		const filtered: any[] = [];

		gridData.forEach((item: any) => {
			if (item.truthcustkey !== prevKey) {
				filtered.push(item);
				prevKey = item.truthcustkey;
			}
		});
		gridRef.current?.setGridData(filtered);
		setTotalCnt(filtered?.length);

		// 조회된 결과에 맞게 칼럼 넓이를 구한다.
		const colSizeList = gridRef.current?.getFitColumnSizeList(true);
		// 구해진 칼럼 사이즈를 적용 시킴.
		gridRef.current?.setColumnSizeList(colSizeList);
	}, [gridData]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={`부분출력`} />

			<TotalCount>
				<span>총 {commUtil.changeNumberFormatter(totalCnt)}건</span>
			</TotalCount>

			{/* 그리드 영역 */}
			<AGrid>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={{ ...gridProps }} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={closeModal}>닫기</Button>
				<Button type="primary" onClick={printDetailListPart}>
					납품서
				</Button>
			</ButtonWrap>
		</>
	);
});

export default WdInvoiceDrivePopup;
