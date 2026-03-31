/*
 ############################################################################
 # FiledataField	: RtQCConfirmResultDetail.tsx
 # Description		: 입고 > 입고작업 > 반품판정현황 조회 Grid Header
 # Author			: KimDongHyeon
 # Since			: 2025.07.21
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const RtQCConfirmResultDetail = ({ gridData, gridRef }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [],
	};

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'docnoWd',
			headerText: t('lbl.DOCNO_RT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'docno',
			headerText: t('lbl.SOURCEKEY_RT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'slipdt',
			headerText: t('lbl.DOCDT_RT'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'fromCustkey',
			headerText: t('lbl.FROM_CUSTKEY_RT'),
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef.current.openPopup(
						{
							custkey: e.item.fromCustkey,
							custtype: 'C' /* C:거래처,P:협력사 ( 거래처는 custtype 생략가능) */,
						},
						'cust',
					);
				},
			},
		},
		{
			dataField: 'fromCustname',
			headerText: t('lbl.FROM_CUSTNAME_RT'),
			dataType: 'string',
			editable: false,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'billtocustkey',
			headerText: t('lbl.TO_VATNO'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'billtocjustname',
			headerText: t('lbl.TO_VATOWNER'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'other03',
			headerText: t('lbl.CLAIMDTLIDS'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'other04',
			headerText: t('lbl.CLAIMDTLID'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'reasoncode',
			headerText: t('lbl.NOTRECALLREASON_RT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'reasonmsg',
			headerText: t('lbl.REASONMSG_RT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: '',
			headerText: t('lbl.REASONTYPE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'blngdeptname',
			headerText: t('lbl.BLNGDEPTCD'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'vendor',
			headerText: t('lbl.VENDOR'),
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef.current.openPopup(
						{
							custkey: e.item.vendor,
							custtype: 'P' /* C:거래처,P:협력사 ( 거래처는 custtype 생략가능) */,
						},
						'cust',
					);
				},
			},
		},
		{
			dataField: 'vendorname',
			headerText: t('lbl.VENDORNAME'),
			dataType: 'code',
			editable: false,
			filter: {
				showIcon: true,
			},
		},
		{
			dataField: 'carno',
			headerText: t('lbl.CARNO'),
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.SKUINFO'),
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'),
					dataType: 'code',
					editable: false,
					filter: {
						showIcon: true,
					},
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							gridRef.current.openPopup(e.item, 'sku');
						},
					},
				},
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'),
					dataType: 'string',
					editable: false,
					filter: {
						showIcon: true,
					},
				},
			],
		},
		{
			dataField: 'plantDescr',
			headerText: t('lbl.PLANT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'storagetype',
			headerText: t('lbl.STORAGETYPE'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'channel',
			headerText: t('lbl.CHANNEL_DMD'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'venreturnyn',
			headerText: t('lbl.VENDORETURNYN'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM'),
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.CALQTY'),
			children: [
				{
					dataField: 'avgweight',
					headerText: t('lbl.AVGWEIGHT'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'calorderbox',
					headerText: t('lbl.CALORDERBOX'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'calconfirmbox',
					headerText: t('lbl.CALCONFIRMBOX'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'realbox',
					headerText: t('lbl.REALBOX'),
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			dataField: 'confirmqty',
			headerText: t('lbl.RETURNQTY_RT'),
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.QCQTY'),
			children: [
				{
					dataField: 'returnoutqty',
					headerText: t('lbl.RETURNQTY_RO'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'disuseqty',
					headerText: t('lbl.DISUSEQTY'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'goodqty',
					headerText: t('lbl.GOODCONFIRMQTY_RT'),
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.QCCONFIRMQTY_RT'),
			children: [
				{
					dataField: 'returnoutcfmqty',
					headerText: t('lbl.RETURNQTY_RO'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'disusecfmqty',
					headerText: t('lbl.DISUSEQTY'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'goodcfmqty',
					headerText: t('lbl.GOODCONFIRMQTY_RT'),
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			dataField: 'unconfirmqty',
			headerText: t('lbl.UNCONFIRMQTY_RT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'lotManufacture',
			headerText: '기준일(제조)',
			align: 'center',
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'calender',
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				gridRef?.current?.removeEditClass(columnIndex);
				return commUtil.gfnDurationColor(item?.lotTable01, item?.duration, item?.durationType, 'gc-user32');
			},
		},
		{
			dataField: 'lotExpire',
			headerText: '기준일(소비)',
			align: 'center',
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'calender',
			},
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				gridRef?.current?.removeEditClass(columnIndex);
				return commUtil.gfnDurationColor(item?.lotTable01, item?.duration, item?.durationType, 'gc-user32');
			},
		},
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM'),
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.SERIALINFO'),
			children: [
				{
					dataField: 'serialno',
					headerText: t('lbl.SERIALNO'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'stockid',
					headerText: t('lbl.BARCODE'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'convserialno',
					headerText: t('lbl.BLNO'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'butcherydt',
					headerText: t('lbl.BUTCHERYDT'),
					dataType: 'date',
					editable: false,
				},
				{
					dataField: 'factoryname',
					headerText: t('lbl.FACTORYNAME'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'contracttype',
					headerText: t('lbl.CONTRACTTYPE'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'contractcompany',
					headerText: t('lbl.CONTRACTCOMPANY'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'contractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'fromvaliddt',
					headerText: t('lbl.FROM'),
					dataType: 'date',
					editable: false,
				},
				{
					dataField: 'tovaliddt',
					headerText: t('lbl.TO'),
					dataType: 'date',
					editable: false,
				},
				{
					dataField: 'serialorderqty',
					headerText: t('lbl.SERIALORDERQTY'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'serialinspectqty',
					headerText: t('lbl.SERIALINSPECTQTY'),
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'serialscanweight',
					headerText: t('lbl.SERIALSCANWEIGHT'),
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			dataField: 'confirmdate',
			headerText: t('lbl.CONFIRMDATE_RT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'qcdt',
			headerText: t('lbl.TASKDT_RT'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'packingmethod',
			headerText: t('lbl.PACKINGMETHOD'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'status',
			headerText: t('lbl.QCSTATUS_RT'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'qcdocno',
			headerText: t('lbl.QCDOCNO'),
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'reasonmsg',
			headerText: t('lbl.REASONMSG_RTQC'),
			dataType: 'code',
			editable: false,
		},
	];

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
	const gridProps = {
		editable: false,
		showStateColumn: false, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: true, //체크박스
		showCustomRowCheckColumn: true,
		showFooter: true,
		fillColumnSizeMode: false, // 가로 스크롤 없이 현재 그리드 영역에 채우기 모드
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
	const initEvent = () => {};

	useEffect(() => {
		initEvent();
	}, []);

	useEffect(() => {
		if (gridRef.current) {
			// 그리드 초기화
			gridRef.current?.setGridData(
				gridData.map((item: any) => ({
					...item,
					other03: item.other03 == 'UNKNOWN' ? '' : item.other03,
					other04: item.other04 == 'UNKNOWN' ? '' : item.other04,
				})),
			);
			gridRef.current?.setSelectionByIndex(0, 0);

			if (gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef.current.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.current.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={gridData?.length} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
};

export default RtQCConfirmResultDetail;
