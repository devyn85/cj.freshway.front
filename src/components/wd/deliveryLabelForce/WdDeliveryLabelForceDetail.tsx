/*
 ############################################################################
 # FiledataField	: WdDeliveryLabelForceDetail.tsx
 # Description		: 출고 > 출고 > 배송 라벨 출력(예외 기준 적용)_분류표출력_탭 Grid
 # Author			: KimDongHan
 # Since			: 2025.10.17
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import { Button, SelectBox } from '@/components/common/custom/form';
import InputText from '@/components/common/custom/form/InputText';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { GridBtnPropsType } from '@/types/common';
import Form from 'antd/lib/form/Form';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const WdDeliveryLabelForceDetail = ({
	gridData,
	gridRef,
	downloadExcel,
	openStoPop,
	printLabel,
	form1,
	applyReason,
	gridSort,
	uploadExcel,
}: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelDownload', // 엑셀다운로드
				//isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: downloadExcel,
			},
			{
				btnType: 'excelUpload', // 엑셀업로드
				isActionEvent: false,
				callBackFn: () => {
					uploadExcel();
				},
			},
			{
				btnType: 'btn1', // 사용자 정의버튼1
				btnLabel: t('lbl.STO_REG'),
				authType: 'new',
				callBackFn: openStoPop,
			},
			{
				btnType: 'print', // 사용자 정의버튼1
				callBackFn: () => {
					printLabel();
				},
			},
		],
	};

	// 그리드 속성
	const gridProps = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false,, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true, // 체크박스
		//showFooter: true,         // 불필요한 경우 삭제 해도 됨
		fillColumnSizeMode: false, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		showCustomRowCheckColumn: true, // 2025.12.04 김동한 방향키 스페이스 이벤트 일괄적용
	};

	// 그리드 초기화
	const gridCol = [
		{
			// 01. 물류센터
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			// 01. 물류센터
			dataField: 'dcname',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 02. 관리처코드
			dataField: 'toCustkey',
			headerText: t('lbl.TO_CUSTKEY_WD'),
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef.current?.openPopup(
						{
							custkey: e.item.toCustkey,
							custtype: 'C',
						},
						'cust',
					);
				},
			},
			width: 100,
		},
		{
			// 03. 납품처명1
			dataField: 'lblCustname1',
			headerText: t('lbl.LBL_CUSTNAME1'),
			dataType: 'text',
			editable: false,
			width: 150,
		},
		{
			// 04. 납품처명2
			dataField: 'lblCustname2',
			headerText: t('lbl.LBL_CUSTNAME2'),
			dataType: 'text',
			editable: false,
			width: 100,
		},
		{
			// 05. 상품코드
			dataField: 'lblSku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					const params = {
						sku: e.item.sku,
						skuDescr: e.item.lblSkuname1,
					};
					gridRef.current?.openPopup(params, 'sku');
				},
			},
			width: 80,
		},
		{
			// 06. 상품명1
			dataField: 'lblSkuname1',
			headerText: t('lbl.LBL_SKUNAME1'),
			dataType: 'text',
			editable: false,
			width: 250,
		},
		{
			// 07. 상품명2
			dataField: 'lblSkuname2',
			headerText: t('lbl.LBL_SKUNAME2'),
			dataType: 'text',
			editable: false,
			width: 250,
		},
		{
			// 08. 수량
			dataField: 'lblQty',
			headerText: t('lbl.LBL_QTY'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 09. 수량2
			dataField: 'lblQty_2',
			headerText: t('lbl.QTY2'),
			dataType: 'code',
			editable: true,
			width: 100,
		},
		{
			// 10. 차량번호
			dataField: 'lblPageno1',
			headerText: t('lbl.LBL_PAGENO1'),
			dataType: 'code',
			editable: true,
			width: 100,
		},
		{
			// 11. 출차조
			dataField: 'lblCargroup',
			headerText: t('lbl.OUTTEAM'),
			dataType: 'code',
			editable: true,
			width: 100,
		},
		{
			// 12. POP
			dataField: 'lblDeliverygroup',
			headerText: t('lbl.LBL_DELIVERYGROUP'),
			dataType: 'code',
			editable: true,
			width: 100,
		},
		{
			// 13. POP2
			dataField: 'lblDeliverygroupChg',
			headerText: t('lbl.DELIVERYGROUP2'),
			dataType: 'code',
			editable: true,
			width: 100,
		},
		{
			// 14. 특이사항
			dataField: 'lblMemo',
			headerText: t('lbl.LBL_MEMO'),
			dataType: 'text',
			editable: true,
			width: 200,
		},
		{
			// 15. 로케이션
			dataField: 'lblLoc',
			headerText: t('lbl.LBL_LOC'),
			dataType: 'code',
			editable: true,
			width: 100,
		},
		{
			// 16. 실제저장조건
			dataField: 'lblRealStoragetype',
			headerText: t('lbl.MS_STORAGETYPE'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 16. 저장조건
			dataField: 'lblStoragetype',
			headerText: t('lbl.LBL_STORAGETYPE'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 17. 저장조건1
			dataField: 'lblStoragetype_1',
			headerText: t('lbl.LBL_STORAGETYPE1'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 18. 저장조건2
			dataField: 'lblStoragetype_2',
			headerText: t('lbl.LBL_STORAGETYPE2'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 19. 배송일자
			dataField: 'lblDeliverydt',
			headerText: t('lbl.LBL_DELIVERYDT'),
			dataType: 'date',
			editable: false,
			width: 100,
		},
		{
			// 20. 업체명
			dataField: 'lblFromCustname',
			headerText: t('lbl.LBL_FROM_CUSTNAME'),
			dataType: 'text',
			editable: true,
			width: 150,
		},
		{
			// 21. 배송차량명
			dataField: 'lblFromCarname',
			headerText: t('lbl.DELIVERY_CARNM'),
			dataType: 'code',
			editable: true,
			width: 100,
		},
		{
			// 22. 라벨유형
			dataField: 'lblTitle',
			headerText: t('lbl.LABEL_TP'),
			dataType: 'code',
			editable: true,
			width: 80,
		},
		{
			// 23. 타센터sto수량
			dataField: 'lblStoqty',
			headerText: t('lbl.OTHER_CENTER_STO_QTY'),
			dataType: 'code',
			editable: true,
			width: 100,
		},
		{
			// 24. 출고센터명
			dataField: 'lblDcname',
			headerText: t('lbl.WD_CENTER'),
			dataType: 'code',
			editable: true,
			width: 130,
		},
		{
			// 25. 페이지번호
			dataField: 'lblPageno2',
			headerText: t('lbl.LBL_PAGENO2'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 26. 바코드텍스트
			dataField: 'lblBarcodetxt',
			headerText: t('lbl.LBL_BARCODETXT'),
			dataType: 'code',
			editable: false,
			width: 150,
		},
		{
			// 27. 바코드1
			dataField: 'lblBarcode1',
			headerText: t('lbl.LBL_BARCODE1'),
			dataType: 'code',
			editable: false,
			width: 150,
		},
		{
			// 28. 바코드2
			dataField: 'lblBarcode2',
			headerText: t('lbl.LBL_BARCODE2'),
			dataType: 'code',
			editable: false,
			width: 150,
		},
		{
			// 29. Sorter대상
			dataField: 'lblSmsYn',
			headerText: t('lbl.SORTER_TARGET'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 30. 피킹번호
			dataField: 'pickNo',
			headerText: t('lbl.PICK_NO'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 31. 대배치키
			dataField: 'pickBatchNo',
			headerText: t('lbl.PICK_BATCH_NO'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 32. 온푸비고란
			dataField: 'lblMemoOfn',
			headerText: t('lbl.MEMO_OFN'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 33. 특별관리고객표기
			dataField: 'lblMarkword',
			headerText: t('lbl.MARKWORD'),
			dataType: 'code',
			editable: false,
			width: 150,
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
		// 그리드 이벤트 설정
	};

	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		if (gridRef.current) {
			// 그리드 초기화
			gridRef.current?.setGridData(gridData);
			gridRef.current?.setSelectionByIndex(0, 0);

			if (gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				//const colSizeList = gridRef.current?.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef.current?.setColumnSizeList(colSizeList);
				gridSort();
			}
		}
	}, [gridData]);

	return (
		<>
			<AGrid>
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length}>
					<Form form={form1} layout="inline" initialValues={{ searchlabelCol: '' }}>
						<InputText
							name="fromCustname"
							placeholder={t('msg.placeholder1', [t('lbl.LBL_FROM_CUSTNAME')])}
							label={t('lbl.LBL_FROM_CUSTNAME')}
							className="bg-white"
						/>
						<SelectBox
							name="searchlabelCol"
							options={getCommonCodeList('SEARCHLABEL_TEXT', t('lbl.SELECT'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							className="bg-white w-full"
						/>
						<InputText name="searchlabelText" className="bg-white" />
					</Form>
					<Button onClick={() => applyReason()}>{t('lbl.SELECT_APPLY')}</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
};

export default WdDeliveryLabelForceDetail;
