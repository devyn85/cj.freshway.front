/*
############################################################################
# FiledataField : MsCustHistPopup.tsx
# Description   : CBM이력정보 상세정보 팝업
# Author        : YeoSeungCheol
# Since         : 25.07.29
############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import TotalCount from '@/assets/styled/Container/TotalCount';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';
import { v4 as uuidv4 } from 'uuid';

// component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// API Call Function
import { apiGetCustHistList } from '@/api/ms/apiMsCustHist';
import { getCommonCodebyCd } from '@/store/core/comCodeStore';

interface PropsType {
	sku: string;
	callBack?: any;
	close?: any;
}

const MsCustHistPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { sku, callBack, close } = props;

	const { t } = useTranslation();
	const gridRef = useRef(null);
	const [totalCount, setTotalCount] = useState(0);
	const gridId = uuidv4() + '_gridWrap';

	const gridCol = [
		{
			headerText: t('lbl.DATE'),
			dataField: 'histDate',
			dataType: 'date',
			// formatString: 'yyyy-MM-dd',
		},
		{
			headerText: t('lbl.SKU'),
			dataField: 'sku',
			dataType: 'code',
		},
		{
			headerText: t('lbl.SKUNM'),
			dataField: 'description',
			dataType: 'string',
		},
		{
			// 저장조건
			headerText: t('lbl.STORAGETYPE'),
			dataField: 'storagetype',
			dataType: 'code',
			// 라벨펑션 공통코드 STORAGETYPE
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('STORAGETYPE', value)?.cdNm;
			},
		},
		{
			headerText: t('lbl.BASEUOM'),
			dataField: 'baseUom',
			dataType: 'code',
		},
		{
			headerText: t('lbl.MMLENGTH'),
			dataField: 'length',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.MMWIDTH'),
			dataField: 'width',
			dataType: 'numeric',
		},
		{
			headerText: t('lbl.MMHEIGHT'),
			dataField: 'height',
			dataType: 'numeric',
		},
	];

	const gridProps = {
		editable: false,
		selectionMode: 'singleRow',
		extraColumnOrders: 'showRowNumColumn',
		showRowCheckColumn: false,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 데이터 조회
	 */
	const fetchData = () => {
		gridRef.current?.clearGridData();

		const params = {
			sku: sku,
		};

		apiGetCustHistList(params).then(res => {
			if (res.statusCode === 0) {
				setTotalCount(res.data.totalCount || res.data.length);
				gridRef.current?.setGridData(res.data || []);
			}
		});
	};

	/**
	 * 행 선택
	 */
	const selectRowData = () => {
		const selectedRow = gridRef.current?.getSelectedRows();
		if (selectedRow && selectedRow.length > 0) {
			callBack?.(selectedRow[0]);
			close?.();
		}
	};

	/**
	 * 확인 버튼 클릭 시
	 */
	const checkRowData = () => {
		const selectedRow = gridRef.current?.getSelectedRows();
		if (!selectedRow || selectedRow.length === 0) {
			return;
		}
		callBack?.(selectedRow[0]);
		close?.();
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 그리드 더블클릭시 해당 로우 부모페이지에 표시
	 */
	useEffect(() => {
		gridRef.current?.bind('cellDoubleClick', function () {
			selectRowData();
		});
	}, []);

	// 컴포넌트 마운트 시 자동 검색
	useEffect(() => {
		if (sku) {
			fetchData();
		}
	}, [sku]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={`CBM이력정보 상세정보 팝업`} />

			<TotalCount>
				<span>총 {commUtil.changeNumberFormatter(totalCount || 0)}건</span>
			</TotalCount>

			{/* 그리드 영역 */}
			<AGrid>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} name={gridId} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>{t('lbl.BTN_CANCEL')}</Button>
				<Button type="primary" onClick={checkRowData}>
					{t('lbl.BTN_CONFIRM')}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default MsCustHistPopup;
