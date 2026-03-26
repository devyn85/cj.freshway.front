/*
 ############################################################################
 # FiledataField	: WdVsrModifyDetail.tsx
 # Description		: 출고 > 출고 > CS 출고 정정 요청 대응 Grid
 # Author			: KimDongHan
 # Since			: 2025.10.21
 ############################################################################
*/

import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import { useMoveMenu } from '@/hooks/useMoveMenu';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { GridBtnPropsType } from '@/types/common';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const WdVsrModifyDetail = ({ gridData, gridRef, saveMasterList }: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { moveMenu } = useMoveMenu();

	const { t } = useTranslation();

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save',
				callBackFn: () => {
					saveMasterList();
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
			// 02. 물류센터명
			dataField: 'dcname',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 03. 처리구분
			dataField: 'status',
			headerText: t('lbl.QCTYPE_RT'),
			dataType: 'code',
			editable: true,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('WD_AMEND', t('lbl.SELECT'), ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
				disabledFunction: (rowIndex: number, columnIndex: number, value: any, item: any, dataField: string) => {
					// 여기서 조건에 따라 비활성화 처리
					if (item.ifFlag === 'Y') {
						return true; // 비활성화
					}
					//return true;
				},
			},
			width: 100,
		},
		{
			// 04. 답변
			dataField: 'reasonmsg',
			headerText: t('lbl.ANSWER'),
			dataType: 'text',
			editable: true,
			width: 150,
		},
		{
			// 05. 일자
			dataField: 'ifDate',
			headerText: t('lbl.DATE'),
			dataType: 'date',
			editable: false,
			width: 100,
		},
		{
			// 06. 문서번호
			dataField: 'docno',
			headerText: t('lbl.DOCNO'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 07. 품목번호
			dataField: 'docline',
			headerText: t('lbl.DOCLINE'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 06. 원주문번호
			dataField: 'sourcekey',
			headerText: t('lbl.SOURCEKEY'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 07. 원주문라인
			dataField: 'sourceline',
			headerText: t('원주문라인'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 08. 상세
			dataField: 'claimdtlnm',
			headerText: t('lbl.DETAIL_TAB'),
			dataType: 'text',
			editable: false,
			width: 100,
		},
		{
			// 09. 납품일자
			dataField: 'deliverydate',
			headerText: t('lbl.INVOICEDT_WD'),
			dataType: 'date',
			editable: false,
			width: 100,
		},
		{
			// 10. VSR번호
			dataField: 'vsrno',
			headerText: t('lbl.VSR_NO'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 11. VOC번호
			dataField: 'vocno',
			headerText: t('lbl.VOC_NO'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 12. VOC순번
			dataField: 'vocseq',
			headerText: t('lbl.VOC_SEQ'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 13. VOC사유
			dataField: 'memo',
			headerText: t('lbl.VOC_REASON'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 14. 거래처
			dataField: 'custkey',
			headerText: t('lbl.CUST_CODE'),
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					gridRef.current?.openPopup(
						{
							custkey: e.item.custkey,
							custtype: e.item.custtype,
						},
						'cust',
					);
				},
			},
			width: 100,
		},
		{
			// 15. 거래처명
			dataField: 'custname',
			headerText: t('lbl.CUST_NAME'),
			dataType: 'text',
			editable: false,
			width: 150,
		},
		{
			// 16. 상품코드
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
					const params = {
						sku: e.item.sku,
						skuDescr: e.item.skuname,
					};
					gridRef.current?.openPopup(params, 'sku');
				},
			},
			width: 80,
		},
		{
			// 17. 상품명칭
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'),
			dataType: 'text',
			editable: false,
			width: 250,
		},
		{
			// 18. 저장유무
			dataField: 'channel',
			headerText: t('lbl.CHANNEL_DMD'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 19. 입고번호
			dataField: 'pokey',
			headerText: t('lbl.INBOUND_NO'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 20. 입고라인
			dataField: 'poline',
			headerText: t('lbl.INBOUND_LINE'),
			dataType: 'code',
			editable: false,
			width: 100,
		},
		{
			// 21. 주문량
			dataField: 'orderqty',
			headerText: t('lbl.STOREROPENQTY'),
			dataType: 'numeric',
			editable: false,
			width: 80,
		},
		{
			// 22. 납품량
			dataField: 'confirmqty',
			headerText: t('lbl.DELIVERY_QTY2'),
			dataType: 'numeric',
			editable: false,
			width: 80,
		},
		{
			// 23. 주문단위
			dataField: 'orderuom',
			headerText: t('lbl.ORDERUNIT'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			// 24. VOC수량
			dataField: 'claimqty',
			headerText: t('lbl.VOC_QTY'),
			dataType: 'numeric',
			editable: false,
			width: 80,
		},
		{
			// 25. VOC단위
			dataField: 'claimuom',
			headerText: t('lbl.VOC_UNIT'),
			dataType: 'code',
			editable: false,
			width: 80,
		},
		{
			// 26. 요구사항
			dataField: 'rmk',
			headerText: t('lbl.REQUIREMENT'),
			dataType: 'text',
			editable: false,
			width: 100,
		},
		// {
		// 	// 27. SU/사업부
		// 	dataField: 'imputedevcd',
		// 	headerText: t('lbl.SU_BUS'),
		// 	dataType: 'code',
		// 	editable: false,
		// 	width: 100,
		// },
		{
			// 28. VOC등록자
			dataField: 'writer',
			headerText: t('lbl.VOC_REGISTRANT'),
			dataType: 'manager',
			editable: false,
			width: 100,
			managerDataField: 'writerId',
		},
		{
			// 29. VOC등록일시
			dataField: 'writedate',
			headerText: t('lbl.VOC_REG_DT'),
			dataType: 'code',
			editable: false,
			width: 150,
		},
		{
			dataField: 'writerId',
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
		gridRef.current?.bind('cellDoubleClick', (event: any) => {
			// 주문번호
			if (['docno','sourcekey'].includes(event.dataField)) {
				if (commUtil.isNull(event.item.sourcekey)) {
					return;
				}

				// 출고 > 출고작업 > 출고확정처리
				moveMenu('/wd/wdShipmentBatch', {
					fromSlipdt: event.item.deliverydate,
					toSlipdt: event.item.deliverydate,
					docno: event.item.sourcekey,
					sku: event.item.sku,
					skuName: event.item.skuname,
				});
			}

			// 입고번호
			if (event.dataField == 'pokey') {
				if (commUtil.isNull(event.item.pokey)) {
					return;
				}

				// 입고 > 입고작업 > 입고확정처리
				moveMenu('/dp/dpReceipt', {
					slipdtFrom: event.item.deliverydate,
					slipdtTo: event.item.deliverydate,
					docno: event.item.pokey,
					sku: event.item.sku,
					skuName: event.item.skuname,
				});
			}
		});

		gridRef.current?.bind('cellEditBegin', (event: any) => {
			if (event.item.ifFlag !== 'Y') {
				// 수정가능
				return true;
			} else {
				// 수정불가
				return false;
			}
		});
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

export default WdVsrModifyDetail;
