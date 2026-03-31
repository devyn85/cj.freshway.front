import { bindInitImp } from '@/api/cm/apiCmSearch';
import { TmVehiclesDto } from '@/api/tm/apiTmDispatch';
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import TotalCount from '@/assets/styled/Container/TotalCount';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import { InputText, SearchForm, SelectBox } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { showAlert } from '@/util/MessageUtil';
import { Button, Form } from 'antd';
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TmBulkDispatchCarPopupProps {
	vehicles: TmVehiclesDto[];
	onSelect: (vehicleUniqueId: string) => void;
	onClose?: () => void;
}

export interface TmBulkDispatchCarPopupHandle {
	open: () => void;
	close: () => void;
}

const VehicleTypeFullNameMap = {
	지입: '지입차',
	월대: '월대용차',
	고정: '고정용차',
	임시: '임시용차',
	실비: '실비용차',
	자차: '고객자차',
};

/** 타임라인 vehicles → 그리드 행 데이터 변환 */
const toGridRows = (vehicles: TmVehiclesDto[]) =>
	vehicles
		.filter(v => !v.carno?.includes('unassigned'))
		.map(v => {
			const firstStep = v.steps?.find(s => s.type === 'job');
			const rawType = v.vehicleType || v.contractType || '';
			const typeLabel =
				rawType in VehicleTypeFullNameMap
					? VehicleTypeFullNameMap[rawType as keyof typeof VehicleTypeFullNameMap]
					: rawType;
			return {
				uniqueId: v.uniqueId,
				popNo: firstStep?.defPop || firstStep?.basePop || '',
				carno: v.carno,
				roundSeq: v.roundSeq ?? 1,
				drivername: v.drivername || '',
				contractType: rawType,
				contractTypeLabel: typeLabel,
				carCapacity: v.carCapacity || '',
			};
		});

const TmBulkDispatchCarPopup = forwardRef<TmBulkDispatchCarPopupHandle, TmBulkDispatchCarPopupProps>(
	({ vehicles, onSelect, onClose }, ref) => {
		const { t } = useTranslation();
		const [form] = Form.useForm();
		const gridRef = useRef<any>(null);
		const [rowCount, setRowCount] = useState(0);

		// 전체 행 데이터
		const allRows = useMemo(() => toGridRows(vehicles), [vehicles]);
		// ref로 최신값을 항상 참조 (클로저 stale 방지)
		const allRowsRef = useRef(allRows);
		allRowsRef.current = allRows;

		// 차량유형 필터 옵션 (실제 데이터 기반)
		const vehicleTypeOptions = useMemo(() => {
			const types = [...new Set(allRows.map(r => r.contractType).filter(Boolean))];
			return [
				{ label: '전체', value: '' },
				...types.map(t => ({
					label: t in VehicleTypeFullNameMap ? VehicleTypeFullNameMap[t as keyof typeof VehicleTypeFullNameMap] : t,
					value: t,
				})),
			];
		}, [allRows]);

		const handleSearch = useCallback(() => {
			const currentRows = allRowsRef.current;
			const contracttype = form.getFieldValue('contracttype');
			const keyword = (form.getFieldValue('searchKeyword') || '').trim().toLowerCase();

			const filtered = currentRows.filter(row => {
				if (contracttype && row.contractType !== contracttype) return false;
				if (keyword) {
					const matchCarno = row.carno?.toLowerCase().includes(keyword);
					const matchDriver = row.drivername?.toLowerCase().includes(keyword);
					if (!matchCarno && !matchDriver) return false;
				}
				return true;
			});

			if (gridRef.current) {
				gridRef.current.setGridData(filtered);
				gridRef.current.resize();
				if (gridRef.current.clearSelection) {
					gridRef.current.clearSelection(); // 검색 시에도 선택 초기화
				}
				setRowCount(filtered.length);
			}
		}, [form]);

		// 마운트 시 데이터 세팅 및 그리드 더블클릭 바인딩
		useEffect(() => {
			form.resetFields();
			handleSearch();
			bindInitImp(gridRef, handleConfirm);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		// vehicles 변경 시 그리드 갱신
		useEffect(() => {
			form.resetFields(); // 검색 폼 초기화
			handleSearch(); // 초기화된 상태로 전체 검색 실행
			if (gridRef.current?.clearSelection) {
				gridRef.current.clearSelection(); // 그리드 선택 초기화
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [allRows]);

		/** 새로고침 */
		const handleRefresh = useCallback(() => {
			form.resetFields();
			const currentRows = allRowsRef.current;
			if (gridRef.current) {
				gridRef.current.setGridData(currentRows);
				gridRef.current.resize();
				if (gridRef.current.clearSelection) {
					gridRef.current.clearSelection(); // 새로고침 시에도 선택 초기화
				}
			}
			setRowCount(currentRows.length);
		}, [form]);

		const titleFunc = useMemo(
			() => ({
				searchYn: handleSearch,
				refresh: handleRefresh,
			}),
			[handleSearch, handleRefresh],
		);

		/** 적용 버튼 클릭 – 선택된 row 적용 */
			const handleConfirm = useCallback(() => {
			const selectedRows = gridRef.current?.getSelectedRows?.() ?? [];
			if (selectedRows.length === 0) {
				showAlert('알림', '배차할 차량을 선택해주세요.');
				return;
			}
			const selected = selectedRows[0];
			onSelect(selected.uniqueId);
			onClose?.();
		}, [onSelect, onClose]);

		/** 닫기 */
		const handleClose = useCallback(() => {
			onClose?.();
		}, [onClose]);

		const gridCol = [
			{
				headerText: 'POP번호',
				dataField: 'popNo',
				width: 100,
				style: 'renderer-ta-c',
			},
			{
				headerText: t('lbl.CARNO') || '차량번호',
				dataField: 'carno',
				width: 120,
				style: 'renderer-ta-c',
			},
			{
				headerText: '회차',
				dataField: 'roundSeq',
				width: 50,
				style: 'renderer-ta-c',
			},
			{
				headerText: t('lbl.DRIVER') || '운전자',
				dataField: 'drivername',
				style: 'renderer-ta-c',
				width: 100,
			},
			{
				headerText: t('lbl.CONTRACTTYPE') || '계약유형',
				dataField: 'contractTypeLabel',
				width: 100,
				style: 'renderer-ta-c',
			},
			{
				headerText: '톤급',
				dataField: 'carCapacity',
				width: 80,
				style: 'renderer-ta-c',
			},
		];

		const gridProps = {
			editable: false,
			selectionMode: 'singleRow',
			showRowNumColumn: true,
			fillColumnSizeMode: true,
		};

		return (
			<>
				{/* 상단 타이틀 */}
				<PopupMenuTitle name="차량조회" func={titleFunc} />

				{/* 검색 영역 */}
				<SearchForm form={form} isAlwaysVisible>
					<UiFilterArea>
						<UiFilterGroup className="grid-column-2">
							<li>
								<SelectBox
									name="contracttype"
									placeholder={t('msg.placeholder2', ['계약유형'])}
									options={vehicleTypeOptions}
									fieldNames={{ label: 'label', value: 'value' }}
									label={t('lbl.CONTRACTTYPE')}
								/>
							</li>
							<li>
								<InputText
									label={t('lbl.CARNO') + '/' + t('lbl.DRIVER')}
									name="searchKeyword"
									placeholder="차량번호/기사명"
									onPressEnter={handleSearch}
								/>
							</li>
						</UiFilterGroup>
					</UiFilterArea>
				</SearchForm>

				{/* 총 건수 */}
				<TotalCount>
					<span>총 {rowCount}건</span>
				</TotalCount>

				{/* 그리드 */}
				<AGrid>
					<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
				</AGrid>

				{/* 하단 버튼 */}
				<ButtonWrap data-props="single">
					<Button size="middle" onClick={handleClose}>
						{t('lbl.BTN_CANCEL')}
					</Button>
					<Button size="middle" type="primary" onClick={handleConfirm}>
						적용
					</Button>
				</ButtonWrap>
			</>
		);
	},
);

export default TmBulkDispatchCarPopup;
