/*
 ############################################################################
 # FiledataField	: MsPboxDetail.tsx
 # Description		: 재고 > 공용기 관리업 > PLT 수불 관리 Grid
 # Author			: KimDongHan
 # Since			: 2025.09.22
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import CmSearchPopup from '@/components/cm/popup/CmSearchPopup';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { getUserDccodeList } from '@/store/core/userStore';
import { GridBtnPropsType } from '@/types/common';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const WdPltDpDetail = ({ gridRef, gridData, form, saveMasterList, stockRef }: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	const refModalPop = useRef(null);
	const refModal = useRef(null);

	const [popupType, setPopupType] = useState('');

	const gDccode = Form.useWatch('dccode', form);

	const gPltComDv = Form.useWatch('pltComDv', form);

	const gDcname = useMemo(
		() => getUserDccodeList().find((o: any) => o.dccode == gDccode)?.dcnameOnlyNm || '',
		[gDccode],
	);

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		// 타겟 그리드 Ref
		tGridRef: gridRef,
		btnArr: [
			{
				// 행추가
				btnType: 'plus' as const,
				initValues: {
					dccode: gDccode,
					dcname: gDcname,
					deliverydate: dayjs().format('YYYYMMDD'),
					pltComDv: gPltComDv,
					inoutDv: '',
					qty: 0,
				},
			},
			{
				// 행삭제
				btnType: 'delete',
			},

			{
				// 저장
				btnType: 'save',
				callBackFn: () => {
					saveMasterList();
				},
			},
		],
	};

	// 그리드 속성
	const gridProps = {
		editable: true, // true 설정시 수정 안할 컬럼에 editable: false, 로 설정.
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		//showRowCheckColumn: true, // 체크박스
		showFooter: true, // 불필요한 경우 삭제 해도 됨
		footerRowCount: 2,
		fillColumnSizeMode: true, // 가로 스크롤 없는 경우 true로 할 것 (2025.8.21 황준기님 가이드)
		isLegacyRemove: true, // 기존행 삭제 가능 옵션
		showCustomRowCheckColumn: true, // 2025.12.04 김동한 방향키 스페이스 이벤트 일괄적용
	};

	// 그리드 초기화
	const gridCol = [
		{
			// 물류센터
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editable: false,
			required: true,
			width: 80,
		},
		{
			// 물류센터명
			dataField: 'dcname',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			editable: false,
			required: true,
			width: 100,
		},
		{
			/* 02. 입출고일자 */
			dataField: 'deliverydate',
			headerText: t('lbl.DOCDT_PLT'),
			dataType: 'date',
			editable: true,
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			commRenderer: {
				type: 'calender',
				onlyCalendar: false, // true: 텍스트 입력 비활성화, false: 입력 가능
				showExtraDays: false,
				align: 'center',
			},
			style: 'isEdit',
			showIcon: true,
			required: true,
			width: 100,
		},
		{
			/* 03. 파렛트 구분 */
			dataField: 'pltComDv',
			headerText: t('lbl.PLT_TYPE'),
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('PLT_COMPANY', t('lbl.SELECT'), ''),
			},
			required: true,
			width: 100,
		},
		{
			/* 04. 입출고 구분 */
			dataField: 'inoutDv',
			headerText: t('lbl.PLT_INOUT_TYPE'),
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('DOCTYPE_VESSEL', t('lbl.SELECT'), '').filter(item =>
					['WD', 'DP', ''].includes(item.comCd),
				),
			},
			required: true,
			width: 100,
		},
		{
			/* 05. 수량 */
			dataField: 'qty',
			headerText: t('lbl.QTY'),
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
				allowPoint: true,
			},
			editable: true,
			width: 80,
		},
		// {
		// 	/* 06. 협력사코드 */
		// 	dataField: 'custkey',
		// 	headerText: t('lbl.VENDOR'),
		// 	dataType: 'code',
		// 	editable: true,
		// 	commRenderer: {
		// 		type: 'search',
		// 		onClick: function (e: any) {
		// 			const rowIndex = e.rowIndex;
		// 			refModal.current?.open({
		// 				gridRef: gridRef,
		// 				codeName: e.text,
		// 				rowIndex,
		// 				dataFieldMap: {
		// 					custkey: 'code',
		// 					custkeyname: 'name',
		// 				},
		// 				popupType: 'partner',
		// 			});
		// 		},
		// 	},
		// 	style: 'isEdit',
		// 	filter: {
		// 		showIcon: true,
		// 	},
		// 	required: true,
		// 	width: 110,
		// },
		{
			/* 06. 협력사코드 */
			dataField: 'custkey',
			headerText: t('lbl.VENDOR'),
			dataType: 'code',
			editable: true,
			commRenderer: {
				type: 'search',
				popupType: 'partner',
				searchDropdownProps: {
					dataFieldMap: {
						custkey: 'code',
						custkeyname: 'name',
					},
				},
				onClick: function (e: any) {
					refModal.current?.open({
						gridRef: gridRef,
						codeName: e.text,
						rowIndex: e.rowIndex,
						dataFieldMap: {
							custkey: 'code',
							custkeyname: 'name',
						},
						popupType: 'partner',
					});
				},
			},
			style: 'isEdit',
			filter: {
				showIcon: true,
			},
			required: true,
			width: 110,
		},

		{
			/* 07. 협력사명 */
			dataField: 'custkeyname',
			headerText: t('lbl.FROM_CUSTNAME_DP'),
			dataType: 'text',
			editable: false,
			width: 180,
		},
		{
			/* 07. 비고 */
			dataField: 'rmk',
			headerText: t('lbl.REMARK'),
			dataType: 'text',
			editable: true,
			width: 200,
			//required: true,
		},
		{
			/* 08. 파렛트 전표 */
			dataField: 'pltSlipno',
			headerText: t('lbl.PLT_VOUCHER'),
			dataType: 'code',
			editable: false,
			width: 150,
			//required: true,
		},
		{
			/* 08. 등록자 */
			dataField: 'addwho',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager',
			managerDataField: 'addId',
			editable: false,
			width: 100,
		},
		{
			dataField: 'addId',
			visible: false,
		},
		{
			/* 09. 등록일시 */
			dataField: 'adddate',
			headerText: t('lbl.ADDDATE'),
			dataType: 'code',
			editable: false,
			width: 180,
		},
		{
			/* 10. 수정자 */
			dataField: 'editwho',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager',
			managerDataField: 'updId',
			editable: false,
			width: 100,
		},
		{
			dataField: 'updId',
			visible: false,
		},
		{
			/* 11. 수정일시 */
			dataField: 'editdate',
			headerText: t('lbl.EDITDATE'),
			dataType: 'code',
			editable: false,
			width: 180,
		},
	];

	const footerLayout = [];
	footerLayout[0] = [
		{
			positionField: 'inoutDv',
			labelText: t('lbl.BASE_STOCK'),
		},
		{
			positionField: 'qty',
			dataField: 'qty',
			formatString: '#,##0',
			style: 'right',
			expFunction: function () {
				return stockRef.current?.[0]?.qty;
			},
		},
	];
	footerLayout[1] = [
		{
			positionField: 'inoutDv',
			labelText: t('lbl.END_STOCK'),
		},
		{
			positionField: 'qty',
			dataField: 'qty',
			formatString: '#,##0',
			style: 'right',
			expFunction: function () {
				return stockRef.current?.[1]?.qty;
			},
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
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 `
				//const colSizeList = gridRef.current?.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				//gridRef.current?.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	const confirmPopup = (selectedRow: any) => {
		if (popupType === 'partner') {
			gridRef.current?.setCellValue(gridRef.current?.getSelectedIndex()[0], 'custkey', selectedRow[0].code);
			gridRef.current?.setCellValue(gridRef.current?.getSelectedIndex()[0], 'custkeyname', selectedRow[0].name);
		}

		closeEvent();
	};

	const closeEvent = () => {
		refModalPop.current?.handlerClose();
	};

	return (
		<>
			{/* 파렛트 입출고 관리 LIST */}
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>

			<CustomModal ref={refModalPop} width="1000px">
				<CmSearchPopup type={popupType} callBack={confirmPopup} close={closeEvent} />
			</CustomModal>
			<CmSearchWrapper ref={refModal} />
		</>
	);
};

export default WdPltDpDetail;
