/*
 ############################################################################
 # FiledataField	: StSkuLabelUploadExcelPopup.tsx
 # Description		: 상품이력번호등록 엑셀 업로드 팝업
 # Author			    : Baechan
 # Since			    : 25.08.25
 ############################################################################
*/
// CSS
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// utils

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { apiGetDurationTypeListByExcelUploadList } from '@/api/st/apiStSkuLabel';
import { GridBtnPropsType } from '@/types/common';
import dayjs from 'dayjs';

// API

interface PropsType {
	close?: any;
	gridCol?: any;
	gridProps?: any;
	gridInitValue?: any;
	title?: string;
	saveMasterList?: any;
}

const StSkuLabelUploadExcelPopup = (props: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close, gridCol, title, gridProps, saveMasterList, gridInitValue, saveMasterListPop, gridExcelPopupRef } =
		props;

	//const gridExcelPopupRef = useRef(null);
	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 엑셀 저장
	 * @param gridRef
	 */
	const saveExcelList = (gridRef?: any) => {
		//saveMasterList(gridRef);
		saveMasterListPop(gridRef);
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridExcelPopupRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn2', // 사용자 정의버튼2
				btnLabel: '유효성검증',
				authType: 'new',
				callBackFn: () => {
					//
				},
			},
			{
				btnType: 'excelSelect',
			},
			{
				btnType: 'save',
				callBackFn: () => saveExcelList(gridExcelPopupRef),
			},
		],
	};

	const columnResize = (ref: any) => {
		const refCurrent = ref?.current;

		if (!refCurrent) {
			return;
		}

		const colSizeList = refCurrent.getFitColumnSizeList(true);
		refCurrent.setColumnSizeList(colSizeList);
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */

	useEffect(() => {
		gridExcelPopupRef.current.bind('addRow', (event: any) => {
			if (!event?.items?.length) {
				return;
			}
			apiGetDurationTypeListByExcelUploadList({ excelUploadList: event?.items }).then((res: any) => {
				// 현재 그리드 데이터 가져오기
				const currentGridData = gridExcelPopupRef.current.getGridData();

				// response 데이터와 매칭하여 업데이트할 행들 준비
				const updatedItems = currentGridData
					.map((gridItem: any) => {
						const matchedResponse = res.data?.find((responseItem: any) => responseItem.sku === gridItem.sku);

						if (matchedResponse) {
							return {
								...gridItem,
								...gridInitValue,
								durationtype: matchedResponse.durationtype,
								lottable01:
									matchedResponse.durationtype === '1'
										? dayjs(gridItem.expiredt).format('YYYYMMDD')
										: dayjs(gridItem.manufacturedt).format('YYYYMMDD'),
								...(gridItem.barcode && { barcode: gridItem.barcode }),
							};
						}
						return gridItem;
					})
					.filter((item: any) => {
						// 실제로 변경된 행들만 필터링
						return res.data?.some((responseItem: any) => responseItem.sku === item.sku);
					});

				// setGridData 대신 updateRowsById 사용
				if (updatedItems.length > 0) {
					gridExcelPopupRef.current.updateRowsById(updatedItems, true); // isMarkEdited: true
				}

				gridExcelPopupRef.current.setAllCheckedRows(true);
				columnResize(gridExcelPopupRef);
			});
		});
	}, []);

	useEffect(() => {
		columnResize(gridExcelPopupRef);
	}, [gridExcelPopupRef.current]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={`${title} 일괄업로드`} showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '} />
				<AUIGrid ref={gridExcelPopupRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>취소</Button>
			</ButtonWrap>
		</>
	);
};

export default StSkuLabelUploadExcelPopup;
