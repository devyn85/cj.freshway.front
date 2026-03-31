/*
 ############################################################################
 # FiledataField : TmDispatchListHistory.tsx
 # Description   : 배차목록 차량 변경내역 그리드
*/
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { useEffect, useRef, useState } from 'react';

// components

// utils
import dateUtils from '@/util/dateUtil';

// hooks
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';
import { Button, Select } from 'antd';
import dayjs from 'dayjs';

interface ITmDispatchListHistoryProps {
	data: any[];
	totalCnt: number;
	onLoadMore?: () => void;
	customerCurrentPage: number;
}

const TmDispatchListHistory = ({ data, totalCnt, onLoadMore, customerCurrentPage }: ITmDispatchListHistoryProps) => {
	const { t } = useTranslation(); // 다국어 처리
	const gridRef: any = useRef(null);
	const [printType, setPrintType] = useState('1'); // 출력유형

	// 출력유형 옵션
	const printTypeOptions = [
		{ value: '1', label: '차량변경출력' },
		{ value: '2', label: '슈트차량변경출력(변경전)' },
		{ value: '3', label: '슈트차량변경출력(변경후)' },
	];

	/**
	 * 그리드 프린트
	 * @returns {void}
	 */
	const printMasterList = async () => {
		const gridData = gridRef.current.getGridData();

		if (gridData?.length === 0) {
			showAlert('', t('msg.noQueriedData')); // 조회된 데이터가 없습니다.
			return false;
		}

		const params = gridRef.current.getGridData().map((item: any) => {
			// //console.log('item:', item);
			return {
				dccode: item.dcname, // 물류센터
				deliverydt: item.deliverydt, // 배송일자
				deliverydtnm: item.deliverydt, // 배송일자
				to_custkey: item.custkey, // 관리처코드
				to_custname: item.custname, // 관리처명

				docknoF: item.docknoF, // 변경전 > 슈트번호
				prepriority: item.priorityOld, // 변경전 > 회차번호
				predeliverygroup: item.popnoOld, // 변경전 > POP번호
				precarno: item.carnoOld, // 변경전 > 차량번호
				prerolltainer_no: item.rolltainerNoOld, // 변경전 > 롤테이너

				docknoB: item.docknoB, // 변경후 > 슈트번호
				priority: item.priority, // 변경후 > 회차번호
				deliverygroup: item.popno, // 변경후 > POP번호
				carno: item.carno, // 변경후 > 차량번호
				rolltainer_no: item.rolltainerNo, // 변경후 > 롤테이너
			};
		});
		// 인쇄 하시겠습니까? 2026.01.08 김동한 수정
		showConfirm(null, t('msg.MSG_COM_PRT_003'), async () => {
			//showConfirm(null, t('msg.MSG_COM_CFM_023', ['인쇄']), () => {
			viewRdReportMaster(params, printType);
		});
	};

	/**
	 * 리포트 뷰어 열기
	 * @param params
	 */
	const viewRdReportMaster = (params: any, code: string) => {
		// 리포트 파일명
		let fileName = 'TM_ModifyList.mrd';
		if (code === '2') {
			fileName = 'TM_BeforeChuteList.mrd';
		} else if (code === '3') {
			fileName = 'TM_AfterChuteList.mrd';
		}
		// 리포트에 전송할 파라미터
		const reprotParams = {
			TITLE: dayjs().format('MM월DD일') + ' 차량변경 리스트',
		};
		// 리포트에 XML 생성을 위한 DataSet 생성
		const dataSet = { ds_reportHeader: params };
		reportUtil.openAgentReportViewer(fileName, dataSet, reprotParams);
	};

	const downloadExcel = (e: any) => {
		// 그리드 데이터 체크
		const gridData = gridRef.current.getGridData();
		if (!gridData || gridData.length === 0) {
			showAlert(null, '다운로드할 데이터가 없습니다.');
			return;
		}

		// 엑셀 다운로드 파라미터 설정
		const params = {
			fileName: '배차목록_차량 변경내역_' + dateUtils.getToDay('YYYYMMDD'),
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

	const gridProps = {
		editable: false, // 변경내역은 수정 불가
		fillColumnSizeMode: false,
		height: 600,
		showRowAllCheckBox: true,
		enableFilter: true,
		// selectionMode: 'singleRow',
	} as any;

	//  화면 정의서에 맞는 컬럼 구조로 변경
	const gridCol = [
		{
			headerText: '물류코드',
			dataField: 'dccode',
			dataType: 'code',
		},
		{
			headerText: '물류센터',
			dataField: 'dcname', // dcNm → dcname
			dataType: 'code',
		},
		{
			headerText: '배송일자',
			dataField: 'deliverydt', // shipDate → deliverydt
			dataType: 'date',
		},
		{
			headerText: '변경 전',
			children: [
				{
					headerText: '슈트번호',
					dataField: 'docknoF',
					dataType: 'code',
				},
				{
					headerText: 'POP 번호',
					dataField: 'popnoOld', // beforePopCd → beforepopno
					dataType: 'code',
				},
				{
					headerText: '롤테이너 번호',
					dataField: 'rolltainerNoOld', //  새로 추가
					dataType: 'code',
				},
				{
					headerText: '차량번호',
					dataField: 'carnoOld', // beforeCarNo → beforecarno
					dataType: 'code',
				},
				{
					headerText: '회차',
					dataField: 'priorityOld', //  새로 추가
					dataType: 'code',
				},
			],
		},
		{
			headerText: '고객',
			children: [
				{
					headerText: '실착지코드',
					dataField: 'truthcustkey', // shipToCd → truthcustkey
					dataType: 'code',
				},
				{
					headerText: '실착지명',
					dataField: 'truthcustname', // custNm → truthcustname
					dataType: 'text',
				},
				{
					headerText: '관리처코드',
					dataField: 'custkey', //  새로 추가
					dataType: 'code',
				},
				{
					headerText: '관리처명',
					dataField: 'custname', //  새로 추가
					dataType: 'text',
				},
				{
					headerText: '키 유형',
					dataField: 'keytype2Name', // keyYn → keytype
					dataType: 'code',
				},
			],
		},
		{
			headerText: '변경 후',
			children: [
				{
					headerText: '슈트번호',
					dataField: 'docknoB',
					dataType: 'code',
				},
				{
					headerText: 'POP 번호',
					dataField: 'popno', // afterPopCd → afterpopno
					dataType: 'code',
				},
				{
					headerText: '롤테이너 번호',
					dataField: 'rolltainerNo', //  새로 추가
					dataType: 'code',
				},
				{
					headerText: '차량번호',
					dataField: 'carno', // afterCarNo → aftercarno
					dataType: 'code',
				},
				{
					headerText: '회차',
					dataField: 'priority', //  새로 추가
					dataType: 'code',
				},
			],
		},
	];

	//  스크롤 페이징 훅 적용
	useScrollPagingAUIGrid({
		gridRef,
		callbackWhenScrollToEnd: () => {
			if (data.length >= totalCnt) {
				return;
			}

			if (onLoadMore) {
				onLoadMore();
			}
		},
		totalCount: totalCnt,
	});

	//  데이터 변경 시 그리드 업데이트
	useEffect(() => {
		if (gridRef.current && data) {
			if (customerCurrentPage === 1) {
				gridRef.current.setGridData(data);
			} else {
				gridRef.current.appendData(data);
			}

			// 컬럼 사이즈 자동 조정
			if (data.length > 0) {
				const colSizeList = gridRef.current.getFitColumnSizeList(true);
				gridRef.current.setColumnSizeList(colSizeList);
			}
		}
	}, [data]);

	return (
		<AGrid>
			<GridTopBtn gridTitle="목록" totalCnt={totalCnt} gridBtn={gridBtn}>
				<span style={{ marginRight: 4 }}>출력유형</span>
				<Select
					value={printType}
					onChange={(value: string) => setPrintType(value)}
					options={printTypeOptions}
					style={{ width: 200, marginRight: 4 }}
				/>
				<Button onClick={printMasterList}>인쇄</Button>
			</GridTopBtn>
			<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
};

export default TmDispatchListHistory;
