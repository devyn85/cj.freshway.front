/*
 ############################################################################
 # FiledataField : TmDispatchListCustomer.tsx
 # Description   : 배차목록 거래처별 그리드
*/
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { Form } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';

// hooks
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';

// components
import CustomModal from '@/components/common/custom/CustomModal';
import TmPlanCustomerDispatchHistoryPopup from '@/components/tm/popup/TmPlanCustomerDispatchHistoryPopup';

// utils
import TmClaimModal from '@/components/tm/TmClaimModal';
import dateUtils from '@/util/dateUtil';
import dayjs from 'dayjs';

interface ITmDispatchListCustomerProps {
	data: any[];
	totalCnt: number;
	onLoadMore?: () => void;
	customerCurrentPage: number;
	pForm: any;
}

// 타입 정의
type OrderRow = Record<string, any>;

const TmDispatchListCustomer = ({
	data,
	totalCnt,
	onLoadMore,
	customerCurrentPage,
	pForm,
}: ITmDispatchListCustomerProps) => {
	const gridRef: any = useRef(null);

	const [selectedRow, setSelectedRow] = useState<OrderRow | null>(null);
	const [gridSelectRow, setGridSelectRow] = useState<any>(undefined);
	
	const downloadExcel = (e: any) => {
		// 그리드 데이터 체크
		const gridData = gridRef.current.getGridData();
		if (!gridData || gridData.length === 0) {
			showAlert(null, '다운로드할 데이터가 없습니다.');
			return;
		}

		// 엑셀 다운로드 파라미터 설정
		const params = {
			fileName: '배차목록_거래처별_' + dateUtils.getToDay('YYYYMMDD'),
			progressBar: true, // 진행바 표시 여부
		};

		// 엑셀 다운로드
		gridRef.current.exportToXlsxGrid(params);
	};

	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef,
		btnArr: [
			{
				btnType: 'excelDownload',
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: downloadExcel,
			},
		],
	};

	// 모달 ref
	const customerDetailPopupRef = useRef<any>(null);
	const historyPopupRef = useRef<any>(null);
	const refClaimModal: any = (useRef as any)(null);

	const gridProps = {
		editable: false,
		fillColumnSizeMode: false,
		showFooter: true,
		height: 600,
		showRowAllCheckBox: true,
		enableFilter: true,
		// selectionMode: 'singleRow',
	} as any;

	//푸터 설정
	const footerLayout = [
		{
			labelText: '합계',
			positionField: 'dccode',
		},
		{
			dataField: 'truthcustkey',
			positionField: 'truthcustkey',
			operation: 'COUNT',
			expFunction: function (columnValues: any) {
				const uniqueKeys = new Set(columnValues);
				return uniqueKeys.size;
			},
		},
		{
			dataField: 'custkey',
			positionField: 'custkey',
			operation: 'COUNT',
			expFunction: function (columnValues: any) {
				const uniqueKeys = new Set(columnValues);
				return uniqueKeys.size;
			},
		},
		{
			dataField: 'weight',
			positionField: 'weight',
			operation: 'SUM',
			formatString: '#,##0.00',
		},
		{
			dataField: 'cube',
			positionField: 'cube',
			operation: 'SUM',
			formatString: '#,##0.00',
		},
	];

	const gridCol = [
		// 물류센터 (단일 컬럼)
		{
			headerText: '물류코드',
			dataField: 'dccode',
			dataType: 'code',
		},
		{
			headerText: '물류센터',
			dataField: 'dcname',
			dataType: 'code',
		},
		// 배송일자 (단일 컬럼)
		{
			headerText: '배송일자',
			dataField: 'deliverydt',
			dataType: 'date',
			editable: false,
		},
		{
			headerText: 'POP',
			dataField: 'popno',
			dataType: 'code',
		},
		// 권역정보 (부모 - 자식 4개)
		{
			headerText: '권역정보',
			children: [
				{
					headerText: '권역그룹명',
					dataField: 'districtgroup',
					dataType: 'text',
				},
				{
					headerText: '권역',
					dataField: 'districtcode',
					dataType: 'text',
				},
				{
					headerText: '행정동코드',
					dataField: 'hjdongCd',
					dataType: 'code',
				},
				{
					headerText: '우편번호',
					dataField: 'zipcode',
					dataType: 'code',
				},
			],
		},
		// 고객정보 (부모 - 자식 6개)
		{
			headerText: '고객정보',
			children: [
				{
					headerText: '실착지코드',
					dataField: 'truthcustkey',
					dataType: 'code',
				},
				{
					headerText: '실착지명',
					dataField: 'truthcustname',
					dataType: 'text',
				},
				{
					headerText: '실착지주소',
					dataField: 'truthaddress',
					dataType: 'text',
				},
				{
					headerText: '관리처코드',
					dataField: 'custkey',
					dataType: 'code',
				},
				{
					headerText: '관리처명',
					dataField: 'custname',
					dataType: 'text',
				},
				{
					headerText: '관리처주소',
					dataField: 'custaddress',
					dataType: 'text',
				},
				{
					headerText: '경로',
					dataField: 'route',
					dataType: 'text',
				},
				{
					headerText: '주문마감경로',
					dataField: 'ordercloseroute',
					dataType: 'text',
				},
			],
		},
		{
			headerText: '배차이력',
			dataField: 'dispatchhistory',
			style: 'aui_comm_search--center',
			labelFunction: (_ri: number, _ci: number, value: any) => {
				const v = (value ?? '').toString();
				return v === '' ? '' : v;
			},
			renderer: {
				type: 'IconRenderer',
				iconPosition: 'right',
				iconTableRef: { default: '/img/icon/icon-pc-search-20-px.svg' },
				iconHeight: 14,
				iconWidth: 14,
			},
		},
		// 클레임 (단일 컬럼 - Y/N 표시)
		{
			headerText: '클레임',
			dataField: 'claimyn',
			dataType: 'code',
			// 클릭 시 클레임 내역 표시 이벤트 추가 가능
		},
		// 차량정보 (부모 - 자식 7개)
		{
			headerText: '차량정보',
			children: [
				{
					headerText: '차량번호',
					dataField: 'carno',
					dataType: 'code',
				},
				{
					headerText: '운송사',
					dataField: 'couriername',
					dataType: 'text',
				},
				{
					headerText: '2차운송사',
					dataField: 'carriername',
					dataType: 'text',
				},
				{
					headerText: '기사명',
					dataField: 'drivername',
					dataType: 'text',
				},
				{
					headerText: '계약유형',
					dataField: 'contractname',
					dataType: 'code',
				},
				{
					headerText: '회차',
					dataField: 'priority',
					dataType: 'code',
				},
			],
		},
		// 물량정보 (부모 - 자식 2개)
		{
			headerText: '물량',
			children: [
				{
					headerText: '중량(kg)',
					dataField: 'weight',
					dataType: 'numeric',
					formatString: '#,##0.00',
				},
				{
					headerText: '체적(m³)',
					dataField: 'cube',
					dataType: 'numeric',
					formatString: '#,##0.00',
				},
			],
		},
		// 배송조건
		{
			headerText: '배송조건',
			children: [
				{
					headerText: '대면검수여부',
					dataField: 'faceinspect',
					dataType: 'code',
				},
				{
					headerText: 'OTD',
					dataField: 'otd', // otdYn → otd
					dataType: 'code',
					minWidth: 120,
				},
				{
					headerText: '특수조건',
					dataField: 'specialcondition',
					dataType: 'code',
				},
				{
					headerText: '키 유무',
					dataField: 'keytype',
					dataType: 'code',
				},
				{
					headerText: '키 상세조건',
					dataField: 'keydetail',
					dataType: 'text',
				},
			],
		},
		// 반품여부
		{
			headerText: '반품여부',
			dataField: 'returnYn',
			dataType: 'code',
		},
	];

	useScrollPagingAUIGrid({
		gridRef,
		callbackWhenScrollToEnd: () => {
			if (onLoadMore) {
				onLoadMore();
			}
		},
		totalCount: totalCnt,
	});

	useEffect(() => {
		if (gridRef.current && data) {
			if (customerCurrentPage === 1) {
				gridRef.current.setGridData(data);
			} else {
				gridRef.current.appendData(data);
			}

			// 컬럼 사이즈 자동 조정
			setTimeout(() => {
				if (data.length > 0) {
					gridRef.current.setFooter(footerLayout);
					const colSizeList = gridRef.current.getFitColumnSizeList(true);
					gridRef.current.setColumnSizeList(colSizeList);
				}
			}, 10);
			// .(myGridID, );
		}
	}, [data]);

	// 이벤트 처리 관련
	useEffect(() => {
		if (!gridRef.current) return;
		const handleCellClick = (event: any) => {
			if (event?.dataField === 'dispatchhistory') {
				const row = event?.item ?? {};
				setGridSelectRow({
					...row,
					custkey: row?.truthcustkey ?? row?.custkey,
					custname: row?.truthcustname ?? row?.custname,
					dccode: row?.dccode,
					deliverydt: row?.deliverydt,
					tmDeliverytype: pForm?.getFieldValue?.('tmDeliverytype') ?? '',
				});
				pForm.setFieldValue('deliverydtFrom', dayjs(row?.deliverydt));
				pForm.setFieldValue('deliverydtTo', dayjs(row?.deliverydt));
				
				historyPopupRef?.current?.handlerOpen?.();
			}
		};
		const handleCellDoubleClick = (event: any) => {
			// TODO: custkey, custname 컬럼 더블클릭 시 팝업 오픈
			if (event?.dataField === 'custkey' || event?.dataField === 'custname') {
				if (customerDetailPopupRef.current) {
					customerDetailPopupRef?.current?.handlerOpen?.();
					// TODO: 추후 후지쯔거 봐서 해당 정보 넣던가 해야함
				}
			}

			if (event?.dataField === 'claimyn') {
				const row = event?.item;
				if (row?.claimyn === 'Y') {
					handleClickClaim(row);
				}
			}
		};

		try {
			gridRef.current.bind('cellClick', handleCellClick);
			gridRef.current.bind('cellDoubleClick', handleCellDoubleClick);
		} catch (error) {
			//console.warn('[TmPlanList] grid bind error:', error);
		}
	}, []);

	// 클레임 모달 열기
	const handleClickClaim = useCallback((row: OrderRow) => {
		const claimRow = row
			? {
					...row,
					deliverydate: row?.deliverydt,
					toCustkey: row?.custkey,
					toCustname: row?.custname,
			  }
			: null;
		setSelectedRow(claimRow);
	}, []);

	useEffect(() => {
		if (!selectedRow) return;
		refClaimModal?.current?.handlerOpen?.();
	}, [selectedRow]);

	return (
		<>
			<Form form={pForm}>
				<Form.Item name="deliverydtFrom" hidden></Form.Item>
				<Form.Item name="deliverydtTo" hidden></Form.Item>
			</Form>
			<AGrid>
				<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={totalCnt} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			{/* 후지쯔 거래처 상세 팝업 (관리처코드-custkey, 관리처명-custname)- 더블클릭 시 (TmPlanCustomerDetailPopup) 넣기 */}
			<CustomModal ref={customerDetailPopupRef} width="1280px">
				<>후지쯔 거래처 상세 팝업 예정</>
			</CustomModal>
			{/* 돋보기 버튼 클릭 시 배차이력 팝업(TmPlanCustomerDispatchHistoryPopup) */}
			<CustomModal ref={historyPopupRef} width="1280px">
				<TmPlanCustomerDispatchHistoryPopup
					close={() => historyPopupRef?.current?.handlerClose?.()}
					params={gridSelectRow}
					pForm={pForm}
				/>
			</CustomModal>
			{/* 배송 클레임 내역 모달 */}
			<CustomModal ref={refClaimModal} width="1000px">
				{selectedRow && <TmClaimModal row={selectedRow} />}
			</CustomModal>
		</>
	);
};

export default TmDispatchListCustomer;
