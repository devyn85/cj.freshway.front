/*
 ############################################################################
 # FiledataField	: VerticalGridSample.tsx
 # Description		: 멀티(수직) 그리드 샘플 
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */

// API Call Function
import { apiGetCmmCdSearchCmmCd, apiGetCmmCdSearchGrpCd } from '@/api/common/apiSysmgt';

// Style & CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Components
import PageGridBtn from '@/components/common/PageGridBtn';

// Libs
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Col, Row } from 'antd';

// Utils
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

const VerticalGridSample = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	const gridRef1 = useRef(null);
	const gridRef2 = useRef(null);

	/*
	### 그리드 변수 ###
	*/
	const gridCol = [
		{
			dataField: 'comGrpCd',
			headerText: t('sysmgt.commoncode.group.comGrpCd'),
			width: '150',
		},
		{
			dataField: 'comGrpCdOrig',
			headerText: '',
			visible: false,
		},
		{
			dataField: 'grpCdNm',
			headerText: t('sysmgt.commoncode.group.grpCdNm'),
			width: '200',
		},
		{
			dataField: 'grpCdDesc',
			headerText: t('sysmgt.commoncode.group.grpCdDesc'),
			style: 'left',
		},
		{
			dataField: 'useYn',
			headerText: t('com.col.useYn'),
			commRenderer: {
				type: 'checkBox',
			},
			width: '100',
		},
		{
			dataField: 'modId',
			headerText: t('com.col.modId'), //수정자
			width: '150',
			editable: false,
		},
		{
			dataField: 'modDt',
			headerText: t('com.col.modYmd'), //수정일자
			width: '150',
			editable: false,
		},
	];

	const gridProps = {
		editable: true,
		showStateColumn: true,
	};

	const gridCol2 = [
		{
			headerText: t('sysmgt.commoncode.code.comCd'),
			dataField: 'comCd',
			width: '150',
		},
		{
			headerText: '',
			dataField: 'comCdOrig',
			visible: false,
		},
		{
			headerText: t('sysmgt.commoncode.code.cdNm'),
			dataField: 'cdNm',
			style: 'center',
			width: '200',
		},
		{
			headerText: t('sysmgt.commoncode.code.sortNo'),
			dataField: 'sortNo',
			style: 'center',
		},
		{
			headerText: t('sysmgt.commoncode.code.cdDesc'),
			dataField: 'cdDesc',
			style: 'left',
			width: '150',
		},
		{
			headerText: t('com.col.useYn'),
			dataField: 'useYn',
			commRenderer: {
				type: 'checkBox',
			},
			width: '80',
		},
		{
			headerText: t('sysmgt.commoncode.code.rsvStrVal') + '1',
			dataField: 'rsvStr1Val',
			style: 'center',
		},
		{
			headerText: t('sysmgt.commoncode.code.rsvStrVal') + '2',
			dataField: 'rsvStr2Val',
			style: 'center',
		},
		{
			headerText: t('sysmgt.commoncode.code.rsvStrVal') + '3',
			dataField: 'rsvStr3Val',
			style: 'center',
		},
		{
			headerText: t('sysmgt.commoncode.code.rsvStrVal') + '4',
			dataField: 'rsvStr4Val',
			style: 'center',
		},
		{
			headerText: t('sysmgt.commoncode.code.rsvStrVal') + '5',
			dataField: 'rsvStr5Val',
			style: 'center',
		},
		{
			headerText: t('sysmgt.commoncode.code.rsvStrVal') + '6',
			dataField: 'rsvStr6Val',
			style: 'center',
		},
		{
			headerText: t('sysmgt.commoncode.code.rsvStrVal') + '7',
			dataField: 'rsvStr7Val',
			style: 'center',
		},
		{
			headerText: t('sysmgt.commoncode.code.rsvStrVal') + '8',
			dataField: 'rsvStr8Val',
			style: 'center',
		},
		{
			headerText: t('sysmgt.commoncode.group.comGrpCd'),
			dataField: 'comGrpCd',
			style: 'center',
		},
		{
			headerText: t('sysmgt.commoncode.group.grpCdNm'),
			dataField: 'comCdOrig',
			style: 'center',
			editable: false,
		},
	];

	const gridBtn = {
		isPlus: true,
		plusFunction: function () {
			gridRef1.current.addRow({});
		},
		isMinus: true,
		minusFunction: function () {
			const gridRefCur1 = gridRef1.current;
			const rowIdField = gridRefCur1.getProp('rowIdField');
			const selectedRow = gridRef1.current.getSelectedRows();
			if (gridRefCur1.isAddedById(selectedRow[0][rowIdField])) {
				gridRef1.current.removeRow('selectedIndex');
			} else {
				showAlert(null, t('com.msg.newDelSelect')); //신규행만 삭제가 가능합니다
				return;
			}
		},
	};
	const gridBtn2 = {
		isPlus: true,
		isMinus: true,
		isCopy: true,
		plusFunction: function () {
			const selectedRow = gridRef1.current.getSelectedRows();
			const item = {
				comGrpCd: selectedRow[0].comGrpCd,
			};
			gridRef2.current.addRow(item);
		},
		minusFunction: function () {
			const gridRefCur2 = gridRef2.current;
			const rowIdField = gridRefCur2.getProp('rowIdField');
			const selectedRow = gridRef1.current.getSelectedRows();
			if (gridRefCur2.isAddedById(selectedRow[0][rowIdField])) {
				gridRef2.current.removeRow('selectedIndex');
			} else {
				showAlert(null, t('com.msg.newDelSelect')); //신규행만 삭제가 가능합니다
				return;
			}
		},
		copyFunction: function () {
			const selectedRow = gridRef2.current.getSelectedRows();
			if (selectedRow && selectedRow.length > 0) {
				const item = selectedRow[0];
				item.comCd = '';
				gridRef2.current.addRow(item, 'selectionDown');
			}
		},
	};

	const gridProps2 = {
		editable: true,
		showStateColumn: true,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/*
	### 조회 ###
	*/
	/**
	 *
	 */
	function search() {
		//그리드 초기화
		gridRef1.current.clearGridData();
		gridRef2.current.clearGridData();

		apiGetCmmCdSearchGrpCd({}).then(res => {
			gridRef1.current.setGridData(res.data);
			//그리드 첫번째 행 선택
			gridRef1.current.setSelectionByIndex(0, 0);
		});
	}

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// Component Mounted
	useEffect(() => {
		const gridRefCur1 = gridRef1.current;
		// 에디팅 시작 이벤트 바인딩
		gridRefCur1.bind('cellEditBegin', function (event: any) {
			const rowIdField = gridRefCur1.getProp('rowIdField');
			// 신규행만 수정 가능
			if (event.dataField == 'comGrpCd') {
				return gridRefCur1.isAddedById(event.item[rowIdField]);
			} else {
				return true; // 다른 필드들은 편집 허용
			}
		});
		/**
		 * 공통코드 상세 목록 조회
		 * @param {string} comGrpCd 그룹공통코드
		 */
		function searchDtl(comGrpCd: string) {
			gridRef2.current.clearGridData();

			if (commUtil.isNull(comGrpCd)) {
				const selectedRow = gridRef1.current.getSelectedRows();
				if (selectedRow.length > 0 && !gridRef1.current.isAddedById(selectedRow[0]._$uid)) {
					comGrpCd = selectedRow[0].comGrpCd;
				} else {
					return;
				}
			}

			const params = { comGrpCd: comGrpCd };
			apiGetCmmCdSearchCmmCd(params).then(res => {
				const gridData = res.data;
				gridRef2.current.setGridData(gridData);
			});
		}
		// 행 변경 시
		gridRefCur1.bind('selectionChange', function () {
			// 상세코드 조회
			searchDtl(null);
		});

		const gridRefCur2 = gridRef2.current;
		// 에디팅 시작 이벤트 바인딩
		gridRefCur2.bind('cellEditBegin', function (event: any) {
			const rowIdField = gridRefCur2.getProp('rowIdField');
			// 신규행만 수정 가능
			if (event.dataField == 'comGrpCd') {
				return gridRefCur2.isAddedById(event.item[rowIdField]);
			} else {
				return true; // 다른 필드들은 편집 허용
			}
		});

		// 조회
		search();
	}, []);

	return (
		<Row gutter={12} className="contain-wrap">
			<Col span={12}>
				<AGrid>
					<PageGridBtn gridBtn={gridBtn} gridTitle={t('sysmgt.commoncode.group.title')} />
					<AUIGrid ref={gridRef1} columnLayout={gridCol} gridProps={gridProps} />
				</AGrid>
			</Col>
			<Col span={12}>
				<AGrid>
					<PageGridBtn gridBtn={gridBtn2} gridTitle={t('sysmgt.commoncode.code.title')} />
					<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={gridProps2} />
				</AGrid>
			</Col>
		</Row>
	);
};
export default VerticalGridSample;
