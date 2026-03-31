/*
 ############################################################################
 # FiledataField	: TmLocationMonitorLeftDetail.tsx
 # Description		: 지표모니터링 > 차량관제 > 차량위치모니터링 Left Detail (요약 + 목록)
 # Author			: BS.kim, Refactor by AI
 # Since			: 2025.09.10 / 2026.03.03
 ############################################################################
*/
import { Card, Collapse, FormInstance, Tooltip } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { getCommonCodeList } from '@/store/core/comCodeStore';
import {
	LocationMonitorSearchForm,
	SummaryDataItem,
	VehicleCenterListItem,
	VehicleShippingStatusItem,
} from '@/types/tm/locationMonitor';

type SummaryCardType = 'ALL' | 'BEFORE' | 'SHIPPING' | 'COMPLETED';

interface SummaryCardConfig {
	type: SummaryCardType;
	labelKey: string;
	statusCode: string | null;
	color: string;
}

const SUMMARY_CARDS: SummaryCardConfig[] = [
	{ type: 'ALL', labelKey: 'lbl.ALL', statusCode: '00', color: 'black' },
	{ type: 'BEFORE', labelKey: 'lbl.BEFORE_DEPARTURE', statusCode: '10', color: 'orange' },
	{ type: 'SHIPPING', labelKey: 'lbl.SHIPPING', statusCode: '20', color: 'blue' },
	{ type: 'COMPLETED', labelKey: 'lbl.DELIVERY_COMPLETED', statusCode: '30', color: 'gray' },
];

interface TmLocationMonitorLeftDetailProps {
	form: FormInstance<LocationMonitorSearchForm>;
	summData: SummaryDataItem[];
	data: VehicleCenterListItem[];
	search: (deliveryStatus?: string) => void | Promise<void>;
	onVehicleSelect?: (vehicleInfo: VehicleShippingStatusItem, priority?: number) => void;
	selectedVehicle?: VehicleShippingStatusItem | null;
}

interface ShippingStatusRow {
	carno: string;
	deliveryStatus: string;
	contracttype: string;
	contractname: string;
	drivername: string;
	appDisconnectedYn: string;
}

interface FoundSelection {
	rowId: string;
	centerKey: string;
	groupKey: string;
}

const buildRowId = (masterIdx: number, childIdx: number, childChildIdx: number) =>
	`row@${masterIdx}-${childIdx}-${childChildIdx}`;

const normalizeCollapseKeys = (keys: string | string[]): string[] => (Array.isArray(keys) ? keys : [keys]);

const getDeliveryStatusNm = (code: string, statusCodeList: any[]) => {
	return statusCodeList.find((row: any) => row.comCd === code)?.cdNm || '';
};

const getDeliveryStatusBackgroundColor = (deliveryStatus: string): string => {
	if (deliveryStatus === '10') return '#FFF5E2';
	if (deliveryStatus === '20') return '#EAF0FF';
	return '#ECEEF4';
};

const getDeliveryStatusTextColor = (deliveryStatus: string): string => {
	if (deliveryStatus === '10') return '#FFA217';
	if (deliveryStatus === '20') return '#1C48CD';
	return '#50545F';
};

const findSelectionInGroup = (
	rows: ShippingStatusRow[] | undefined,
	carno: string,
	masterIdx: number,
	childIdx: number,
): FoundSelection | null => {
	if (!rows) return null;
	const rowIdx = rows.findIndex(row => row?.carno === carno);
	if (rowIdx < 0) return null;
	return {
		rowId: buildRowId(masterIdx, childIdx, rowIdx),
		centerKey: `${masterIdx}`,
		groupKey: `${masterIdx}-${childIdx}`,
	};
};

const findSelectionByCarNo = (data: VehicleCenterListItem[], carno?: string | null): FoundSelection | null => {
	if (!carno) return null;
	for (let masterIdx = 0; masterIdx < data.length; masterIdx++) {
		const masterRow = data[masterIdx];
		if (!masterRow?.list) continue;
		for (let childIdx = 0; childIdx < masterRow.list.length; childIdx++) {
			const childRow = masterRow.list[childIdx];
			const found = findSelectionInGroup(
				childRow?.shippingStatusList as ShippingStatusRow[] | undefined,
				carno,
				masterIdx,
				childIdx,
			);
			if (found) return found;
		}
	}
	return null;
};

interface RenderShippingRowsParams {
	childRows: ShippingStatusRow[];
	masterIdx: number;
	childIdx: number;
	selectedRowId: string | null;
	statusCodeList: any[];
	onSelectRow: (rowId: string, item: ShippingStatusRow) => void;
}

const renderShippingRows = ({
	childRows,
	masterIdx,
	childIdx,
	selectedRowId,
	statusCodeList,
	onSelectRow,
}: RenderShippingRowsParams) => {
	return childRows.map((item: ShippingStatusRow, childChildIdx: number) => {
		const rowId = buildRowId(masterIdx, childIdx, childChildIdx);
		const isSelected = selectedRowId === rowId;
		return (
			<RowItem id={rowId} $selected={isSelected} onClick={() => onSelectRow(rowId, item)} key={`tr${rowId}`}>
				<RowCellStatus>
					<StatusBadge $deliveryStatus={item.deliveryStatus}>
						{getDeliveryStatusNm(item.deliveryStatus, statusCodeList)}
					</StatusBadge>
				</RowCellStatus>
				<RowCellMain>
					<ContractBadge $contractType={item.contracttype}>{item.contractname}</ContractBadge>
					<VehicleInfoWrap>
						<CarNoText>{item.carno}</CarNoText>
						<NameDivider> | </NameDivider>
						<DriverNameText>{item.drivername}</DriverNameText>
					</VehicleInfoWrap>
				</RowCellMain>
				<RowCellFlag>
					{item?.appDisconnectedYn === 'Y' && (
						<Tooltip title="앱 확인 필요" placement="topLeft" arrow={{ pointAtCenter: true }}>
							<AlertDot>!</AlertDot>
						</Tooltip>
					)}
				</RowCellFlag>
			</RowItem>
		);
	});
};

const TmLocationMonitorLeftDetail = ({
	form,
	summData,
	data,
	search,
	onVehicleSelect,
	selectedVehicle,
}: TmLocationMonitorLeftDetailProps) => {
	/*
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [selectedCard, setSelectedCard] = useState<SummaryCardType>('ALL');
	const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
	const [activeCenterKeys, setActiveCenterKeys] = useState<string[]>([]);
	const [activeGroupKeysByCenter, setActiveGroupKeysByCenter] = useState<Record<string, string[]>>({});
	const isCardSearchRef = useRef(false);
	const commCarLocMtrStatusList = getCommonCodeList('CAR_LOC_MTR_STATUS');

	/*
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	const statusMap = useMemo(() => {
		return summData.reduce<Record<string, SummaryDataItem>>((acc, row) => {
			if (row.deliveryStatus) {
				acc[row.deliveryStatus] = row;
			}
			return acc;
		}, {});
	}, [summData]);

	const showMainNumberOnly = useMemo(() => {
		const contracttype = form.getFieldValue('contracttype') || [];
		const carno = form.getFieldValue('carno') || '';
		const allContractTypes = ['DELIVERY', 'MONTHLY', 'FIX', 'FIXTEMPORARY', 'TEMPORARY'];
		const isAllContractType =
			contracttype.length === allContractTypes.length && allContractTypes.every(type => contracttype.includes(type));
		const isCarnoEmpty = carno === '' || carno === null || carno === undefined;
		return isAllContractType && isCarnoEmpty;
	}, [form, summData]);

	const onCardClick = (card: SummaryCardConfig) => {
		setSelectedCard(card.type);
		const deliveryStatus = card.type === 'ALL' ? null : card.statusCode;
		form.setFieldsValue({ deliveryStatus });
		isCardSearchRef.current = true;
		search(deliveryStatus || undefined);
	};

	const handleSelectRow = (rowId: string, item: ShippingStatusRow) => {
		setSelectedRowId(rowId);
		onVehicleSelect?.(item as VehicleShippingStatusItem, 1);
	};

	const handleGroupKeysChange = (masterKey: string, keys: string | string[]) => {
		setActiveGroupKeysByCenter(prev => ({
			...prev,
			[masterKey]: normalizeCollapseKeys(keys),
		}));
	};

	const items = useMemo(() => {
		return data.map((masterRow: any, masterIdx: number) => {
			const masterKey = `${masterIdx}`;
			const childItems =
				masterRow?.list?.map((childRow: any, childIdx: number) => {
					const childKey = `${masterIdx}-${childIdx}`;
					const childRows = childRow?.shippingStatusList || [];
					if (childRows.length === 0) return null;
					return {
						key: childKey,
						label: `${childRow.cargroupName} | ${childRow.carCount}${t('lbl.UNIT2')}`,
						style: { fontWeight: '600' },
						children: (
							<table>
								<tbody key={`tbody${childKey}`}>
									{renderShippingRows({
										childRows,
										masterIdx,
										childIdx,
										selectedRowId,
										statusCodeList: commCarLocMtrStatusList,
										onSelectRow: handleSelectRow,
									})}
								</tbody>
							</table>
						),
					};
				}) || [];

			const defaultChildKeys = childItems.map((item: any) => item.key);
			const activeChildKeys = activeGroupKeysByCenter[masterKey] ?? defaultChildKeys;

			return {
				key: masterKey,
				label: `${masterRow.centerNm} | ${masterRow.carCount}${t('lbl.UNIT2')}`,
				style: { fontWeight: '600' },
				children: childItems.length > 0 && (
					<StyledCollapse
						style={{ padding: 0 }}
						items={childItems}
						activeKey={activeChildKeys}
						onChange={keys => handleGroupKeysChange(masterKey, keys as string | string[])}
					/>
				),
			};
		});
	}, [activeGroupKeysByCenter, data, selectedRowId, t]);

	/*
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		if (isCardSearchRef.current) {
			isCardSearchRef.current = false;
		} else {
			setSelectedCard('ALL');
			form.setFieldsValue({ deliveryStatus: null });
		}

		// 조회 결과가 갱신되면 이전 선택 하이라이트를 초기화한다.
		setSelectedRowId(null);

		const centerKeys = data
			.map((masterRow: any, masterIdx: number) => {
				const hasChildItems = (masterRow?.list?.length || 0) > 0;
				return hasChildItems ? `${masterIdx}` : null;
			})
			.filter((key): key is string => key !== null);
		const groupKeysByCenter: Record<string, string[]> = {};
		data.forEach((masterRow: any, masterIdx: number) => {
			groupKeysByCenter[`${masterIdx}`] =
				masterRow?.list?.map((_: any, childIdx: number) => `${masterIdx}-${childIdx}`) || [];
		});
		setActiveCenterKeys(centerKeys);
		setActiveGroupKeysByCenter(groupKeysByCenter);
	}, [data]);

	useEffect(() => {
		if (!selectedVehicle || data.length === 0) {
			setSelectedRowId(null);
			return;
		}
		const found = findSelectionByCarNo(data, selectedVehicle.carno);
		if (!found) return;

		setSelectedRowId(found.rowId);
		setActiveCenterKeys(prev => (prev.includes(found.centerKey) ? prev : [...prev, found.centerKey]));
		setActiveGroupKeysByCenter(prev => ({
			...prev,
			[found.centerKey]: prev[found.centerKey]?.includes(found.groupKey)
				? prev[found.centerKey]
				: [...(prev[found.centerKey] || []), found.groupKey],
		}));

		setTimeout(() => {
			const findEl = document.getElementById(found.rowId);
			findEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}, 0);
	}, [selectedVehicle, data]);

	/*
	 * =====================================================================
	 *  04. jsx
	 * =====================================================================
	 */
	return (
		<>
			<SummaryRow>
				{SUMMARY_CARDS.map(card => {
					const cardData = card.statusCode ? statusMap[card.statusCode] : undefined;
					const mainCnt = cardData?.subCnt || 0;
					const subCnt = cardData?.cnt || 0;
					const isSelected = selectedCard === card.type;
					return (
						<SummaryCard
							key={card.type}
							title={t(card.labelKey)}
							$selected={isSelected}
							onClick={() => onCardClick(card)}
						>
							<CountBox>
								<MainCount $color={card.color}>{mainCnt}</MainCount>
								{!showMainNumberOnly && <SubCount $color={card.color}>/{subCnt}</SubCount>}
							</CountBox>
						</SummaryCard>
					);
				})}
			</SummaryRow>
			<div className="monitoring-list">
				{items.length !== 0 && (
					<Collapse
						items={items}
						activeKey={activeCenterKeys}
						onChange={keys => setActiveCenterKeys(normalizeCollapseKeys(keys as string | string[]))}
					/>
				)}
			</div>
		</>
	);
};

export default TmLocationMonitorLeftDetail;

/*
 * =====================================================================
 *  05. styled component
 * =====================================================================
 */

const SummaryRow = styled.div`
	display: flex;
	gap: 10px;
	margin-bottom: 20px;
`;

const SummaryCard = styled(Card)<{ $selected: boolean }>`
	flex: 1;
	text-align: center;
	box-shadow: 3px 3px 10px -5px #666;
	background-color: ${({ $selected }) => ($selected ? '#f3f7ff' : '#fff')};
	border-color: ${({ $selected }) => ($selected ? '#afc6ff' : '#d9d9d9')};

	& > .ant-card-body {
		padding: 16px 0;
	}
`;

const CountBox = styled.div`
	display: flex;
	align-items: flex-end;
	justify-content: center;
`;

const MainCount = styled.div<{ $color: string }>`
	font-size: 2.5em;
	color: ${({ $color }) => $color};
	font-weight: 700;
	line-height: 0.9;
`;

const SubCount = styled.div<{ $color: string }>`
	font-size: 1.2em;
	color: ${({ $color }) => $color};
	font-weight: 700;
	line-height: 1.1;
	margin-left: 2px;
`;

const StyledCollapse = styled(Collapse)`
	.ant-collapse-content-box {
		padding: 0 !important;
	}
`;

const RowItem = styled.tr<{ $selected: boolean }>`
	display: flex;
	padding: 12px 16px;
	cursor: pointer;
	gap: 8px;
	align-items: center;
	background-color: ${({ $selected }) => ($selected ? '#cce2fcff' : 'transparent')};
`;

const RowCellStatus = styled.td`
	display: flex;
`;

const RowCellMain = styled.td`
	flex: 1;
	font-size: 0.9em;
	display: flex;
	align-items: center;
	gap: 8px;
`;

const VehicleInfoWrap = styled.div`
	display: flex;
	align-items: center;
	flex: 1;
	gap: 8px;
`;

const CarNoText = styled.div`
	font-weight: 700;
	max-width: 50%;
	word-break: break-all;
`;

const NameDivider = styled.div`
	color: lightgray;
`;

const DriverNameText = styled.div`
	max-width: 40%;
	word-break: break-all;
`;

const RowCellFlag = styled.td`
	width: 8%;
	display: flex;
`;

const AlertDot = styled.div`
	width: calc(1em / 0.7);
	height: calc(1em / 0.7);
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 0.9em;
	color: rgba(255, 255, 255, 1);
	border: 0 solid rgba(0, 0, 0, 1);
	background-color: red;
`;

const StatusBadge = styled.span<{ $deliveryStatus: string }>`
	background-color: ${({ $deliveryStatus }) => getDeliveryStatusBackgroundColor($deliveryStatus)};
	color: ${({ $deliveryStatus }) => getDeliveryStatusTextColor($deliveryStatus)};
	width: 60px;
	font-weight: 700;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 12px;
	height: 24px;
	border-radius: 4px;
`;

const ContractBadge = styled.div<{ $contractType: string }>`
	border-color: ${({ $contractType }) => ($contractType === 'FIXTEMPORARY' ? '#FF7E07' : '#434753')};
	background-color: #ffffff;
	color: ${({ $contractType }) => ($contractType === 'FIXTEMPORARY' ? '#FF7E07' : '#434753')};
	border-style: solid;
	border-width: 1px;
	border-radius: 4px;
	font-weight: 700;
	font-size: 0.9em;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 24px;
	padding: 0 7px;
	white-space: nowrap;
`;
