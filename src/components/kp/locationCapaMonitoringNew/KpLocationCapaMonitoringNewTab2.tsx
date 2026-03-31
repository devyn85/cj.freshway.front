/*
 ############################################################################
 # FiledataField	: KpLocationCapaMonitoringNewTab2.tsx
 # Description		: 센터capa현황(new) - 렉별 상세 탭
 # Author			: YeoSeungCheol
 # Since			: 25.11.06
 ############################################################################
*/

import GridAutoHeight from '@/components/common/GridAutoHeight';
import ScrollBox from '@/components/common/ScrollBox';
import Splitter from '@/components/common/Splitter';
import TableTopBtn from '@/components/common/TableTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { TableBtnPropsType } from '@/types/common';
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const KpLocationCapaMonitoringNewTab2 = forwardRef((props: any, ref: any) => {
	// 다국어
	const { t } = useTranslation();

	// 선택한 셀
	const [activeCellKey, setActiveCellKey] = useState<string | null>(null);

	// 선택한 셀 데이터
	const [selectedCellData, setSelectedCellData] = useState<any>(null);

	// 그리드 초기화
	const gridCol = useMemo(
		() => [
			{ headerText: '물류센터', dataField: 'dccode', dataType: 'code' },
			{ headerText: '회사', dataField: 'storerkey', dataType: 'code' },
			{ headerText: '창고', dataField: 'organize', dataType: 'code' },
			{ headerText: '작업구역', dataField: 'area', dataType: 'code' },
			{ headerText: '창고명', dataField: 'areaname', dataType: 'string' },
			{ headerText: '상품코드', dataField: 'sku', dataType: 'code' },
			{
				headerText: '상품정보',
				children: [
					{ headerText: '내역', dataField: 'description', dataType: 'string' },
					// { headerText: '스타일', dataField: 'stylecode' }, -- 양준영님 요청 03/19
					// { headerText: '컬러', dataField: 'colorcode', dataType: 'code' },
					// { headerText: '사이즈', dataField: 'sizecode', dataType: 'code' },
					{ headerText: '상품분류', dataField: 'skugroup', dataType: 'code' },
				],
			},
			{ headerText: '단위', dataField: 'uom', dataType: 'code' },
			{ headerText: '로케이션', dataField: 'loc', dataType: 'code' },
			{
				headerText: '로트정보',
				children: [
					{ headerText: '로트', dataField: 'lot', dataType: 'code' },
					{
						headerText: '기준일(유통,제조)',
						dataField: 'lottable01',
						dataType: 'code',
					},
				],
			},
			{ headerText: '개체식별/유통이력', dataField: 'stockid', dataType: 'string' },
			{ headerText: '재고속성', dataField: 'stockgrade', dataType: 'code' },
			{
				headerText: '수량정보',
				children: [
					{ headerText: '수량', dataField: 'qty', dataType: 'numeric', formatString: '#,##0.##' },
					{ headerText: '분배량', dataField: 'qtyallocated', dataType: 'numeric', formatString: '#,##0.##' },
					{ headerText: '피킹재고수량', dataField: 'qtypicked', dataType: 'numeric', formatString: '#,##0.##' },
					{ headerText: '진행예정수량', dataField: 'openqty', dataType: 'numeric', formatString: '#,##0.##' },
				],
			},
			{
				headerText: '출고',
				children: [
					{ headerText: '출고', dataField: 'orderqty', dataType: 'numeric', formatString: '#,##0.##' },
					{ headerText: '이체출고', dataField: 'transferqty', dataType: 'numeric', formatString: '#,##0.##' },
				],
			},
		],
		[],
	);

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = useCallback(() => {
		const gridRef = props.gridRef;

		gridRef?.current?.bind?.('ready', () => {
			if (props.data && props.data.length > 0) {
				gridRef?.current?.setSelectionByIndex?.(0);
			}
		});
	}, [props.data, props.gridRef]);

	/**
	 * 렉 별 테이블 셀의 status 값에 따른 색상 클래스 반환
	 * @param status
	 * @param qty
	 */
	const getStatusClass = (status: any, qty: any) => {
		const st = status ? String(status).trim() : '';

		if (qty === 0) return 'gc-user0';

		if (st === 'R') return 'gc-user39';

		if (st === '') return 'gc-user38';

		return 'gc-user51';
	};

	/**
	 * 선택한 셀 고유 키 비교
	 * @param zone
	 * @param rack
	 * @param line
	 * @param col
	 */
	const isActiveCell = (zone: any, rack: any, line: any, col: any) => {
		return activeCellKey === `${zone}-${rack}-${line}-${col}`;
	};

	/**
	 * 렉 별 테이블 동적 렌더링
	 */
	const renderRackTables = () => {
		const originalRows = Array.isArray(props.data) ? props.data : [];

		const rows = originalRows.filter((r: any) => {
			const col = Number(r.RACKCOLUMN);
			const line = Number(r.RACKLINE);
			return col >= 1 && col <= 100 && line >= 1 && line <= 100;
		});

		const groups = new Map<string, any[]>();
		rows.forEach((r: any) => {
			const key = `${r.DCCODE}::${r.ZONE}::${r.RACK}`;
			if (!groups.has(key)) groups.set(key, []);
			groups.get(key)!.push(r);
		});

		const result: JSX.Element[] = [];

		groups.forEach((list, key) => {
			const [dccode, zone, rack] = key.split('::');
			const maxLine = list.reduce((m, r) => Math.max(m, Number(r.RACKLINE)), 1);
			const maxCol = list.reduce((m, r) => Math.max(m, Number(r.RACKCOLUMN)), 1);

			const map = new Map<string, any>();
			list.forEach(r => map.set(`${r.RACKLINE}-${r.RACKCOLUMN}`, r));

			result.push(
				<div className="rack-block" key={`tbl-${key}`} style={{ marginBottom: 20 }}>
					<table className="tbl-list auto" width={'100%'}>
						<colgroup>
							<col style={{ width: '60px' }} />
							{Array.from({ length: maxCol }).map((_, i) => (
								<col key={`cg-${key}-${i}`} />
							))}
						</colgroup>

						<thead>
							<tr>
								<th>구분</th>
								<th colSpan={maxCol + 1} style={{ textAlign: 'center', fontWeight: 600 }}>
									{`${zone} / ${rack}`}
								</th>
							</tr>
							<tr>
								<th></th>
								{Array.from({ length: maxCol }).map((_, c) => (
									<th key={`th-${key}-${c}`}>{c + 1}</th>
								))}
							</tr>
						</thead>

						<tbody>
							{Array.from({ length: maxLine }).map((_, li) => {
								const lineNo = li + 1;

								return (
									<tr key={`r-${key}-${lineNo}`}>
										<td>{`${lineNo}단`}</td>
										{Array.from({ length: maxCol }).map((__, cj) => {
											const colNo = cj + 1;
											const cell = map.get(`${lineNo}-${colNo}`);

											const qty = Number(cell?.QTY || 0);
											const st = cell?.STATUS;

											return (
												<td
													key={`c-${key}-${lineNo}-${colNo}`}
													className={`${getStatusClass(st, qty)} ${!cell ? 'gc-user38' : ''} ${
														isActiveCell(zone, rack, lineNo, colNo) ? 'active' : ''
													}`}
													style={{ textAlign: 'center' }}
													onClick={() => {
														setActiveCellKey(`${zone}-${rack}-${lineNo}-${colNo}`);
														setSelectedCellData(cell);
														props.onCellClick(zone, rack, cell?.LOC);
														props.onRackClick(dccode, zone, rack, cell?.LOC);
													}}
												>
													{!cell ? '' : ''}
												</td>
											);
										})}
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>,
			);
		});

		return result;
	};

	/**
	 * 그리드 속성을 설정한다.
	 */
	const gridProps = useMemo(
		() => ({
			editable: false,
			showRowCheckColumn: false,
			fillColumnSizeMode: false,
			showRowNumColumn: true,
		}),
		[],
	);

	// 표 버튼 설정
	const getGridBtn = useMemo(
		() =>
			({
				tGridRef: props.gridRef2,
				btnArr: [],
			} as TableBtnPropsType),
		[props.gridRef2],
	);

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();
	}, [initEvent]);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefToUse = props.gridRef2;
		const gridRefCur = gridRefToUse?.current;

		if (!gridRefCur) return;

		gridRefCur?.setGridData?.(props.gridData2 || []);

		if (props.gridData2 && props.gridData2.length > 0) {
			const colSizeList = gridRefCur.getFitColumnSizeList(true);
			gridRefCur.setColumnSizeList(colSizeList);
		}
	}, [props.gridData2, props.gridRef2]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		props.gridRef2?.current?.resize?.('100%', '100%');
		props.gridRef?.current?.resize?.('100%', '100%');
	}, [props.gridRef, props.gridRef2]);

	return (
		<PageFill>
			<Splitter
				items={[
					<TopPane key="top">
						<TopGridTitleWrap>
							<TableTopBtn tableTitle={'목록'} tableBtn={getGridBtn} className="fix-title" />
							<div className="cp-label">
								<div className="box">빈공간</div>
								<div className="gc-user51">보관중</div>
								<div className="gc-user39">소비기한임박</div>
							</div>
						</TopGridTitleWrap>

						<TopGridBodyWrap>
							<ScrollBox direction="both" height="100%">
								{renderRackTables()}
							</ScrollBox>
						</TopGridBodyWrap>
					</TopPane>,
					<BottomPane key="bottom">
						<BottomGridWrap>
							<BottomLeftWrap>
								<div className="cp-inner">
									<dl className="result">
										<dt>잔여Capa.</dt>
										<dd>{props.capaData?.empLoc || 0}</dd>
										<dt>전체Capa.</dt>
										<dd>{props.capaData?.totLoc || 0}</dd>
									</dl>
									<ul className="cp-case">
										<li>
											<span className="gc-user39">{props.statusData?.W || 0}</span>
											<p>소비기한임박</p>
										</li>
										<li>
											<span className="gc-user0">{props.statusData?.B || 0}</span>
											<p>빈로케이션</p>
										</li>
										<li>
											<span className="gc-user51">{props.statusData?.K || 0}</span>
											<p>보관로케이션</p>
										</li>
									</ul>
								</div>
							</BottomLeftWrap>

							<BottomRightWrap>
								<SelectedCellBar>
									<strong>현재 셀 데이터:</strong>{' '}
									{selectedCellData
										? `로케이션명 : ${selectedCellData.LOC_DESCRIPTION || '-'}, 렉 : ${
												selectedCellData.RACK || '-'
										  }, 셀 : ${selectedCellData.RACKLINE || '-'}-${selectedCellData.RACKCOLUMN || '-'}, 재고 : ${
												selectedCellData.QTY || 0
										  }`
										: '셀을 선택해주세요'}
								</SelectedCellBar>

								<BottomGridBodyWrap>
									<GridAutoHeight id="logistics-status-detail-grid">
										<AUIGrid ref={props.gridRef2} columnLayout={gridCol} gridProps={gridProps} />
									</GridAutoHeight>
								</BottomGridBodyWrap>
							</BottomRightWrap>
						</BottomGridWrap>
					</BottomPane>,
				]}
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
			/>
		</PageFill>
	);
});

const PageFill = styled.div`
	width: 100%;
	height: 100%;
	min-height: 0;
`;

const TopPane = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	min-height: 0;
`;

const TopGridTitleWrap = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 10px;
	margin-bottom: 10px;
	flex: 0 0 auto;
`;

const TopGridBodyWrap = styled.div`
	flex: 1 1 auto;
	min-height: 0;
`;

const BottomPane = styled.div`
	width: 100%;
	height: 100%;
	min-height: 0;
`;

const BottomGridWrap = styled.div`
	display: flex;
	width: 100%;
	height: 100%;
	min-height: 0;
`;

const BottomLeftWrap = styled.div`
	display: flex;
	flex-direction: column;
	flex: 0 0 15%;
	width: 15%;
	min-height: 0;
`;

const BottomRightWrap = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1 1 auto;
	width: 85%;
	min-height: 0;
`;

const SelectedCellBar = styled.div`
	padding: 10px;
	background: #f5f5f5;
	border-bottom: 1px solid #ddd;
	flex: 0 0 auto;
`;

const BottomGridBodyWrap = styled.div`
	flex: 1 1 auto;
	min-height: 0;
`;

export default KpLocationCapaMonitoringNewTab2;
