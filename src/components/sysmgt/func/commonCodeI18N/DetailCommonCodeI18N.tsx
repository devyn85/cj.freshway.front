// Lib
import AGrid from '@/assets/styled/AGrid/AGrid';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Utils
import commUtil from '@/util/commUtil';

// Store

// Component
import PageGridBtn from '@/components/common/PageGridBtn';

// API Call Function
import { apiGetCommonI18NCommonCode } from '@/api/common/apiSysmgt';

const DetailCommonCodeI18N = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	const { t } = useTranslation();

	ref.gridRef1 = useRef();
	ref.gridRef2 = useRef();

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
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
			},
			width: '100',
		},
		{
			dataField: 'modId',
			headerText: t('com.col.modId'), //수정자
			width: '150',
		},
		{
			dataField: 'modDt',
			headerText: t('com.col.modYmd'), //수정일자
			width: '150',
		},
	];

	const gridProps = {
		editable: false,
	};

	const gridCol2: any[] = [];

	const gridBtn = {};
	const gridBtn2 = {};

	const gridProps2 = {
		editable: true,
		enterKeyColumnBase: true,
		useContextMenu: true,
		enableFilter: true,
		showStateColumn: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 * @param {Array} langCds 다국어 공통 코드 목록
	 */
	const initGridCol = (langCds: any) => {
		const langCols: any[] = [];
		langCds.forEach((el: { comCd: any; cdNm: any }) => {
			langCols.push({
				dataField: el.comCd,
				headerText: el.cdNm,
			});
		});

		const gridCol: any[] = [
			{
				dataField: 'comCd',
				headerText: t('sysmgt.commoncode.code.comCd'),
				width: '200',
				editable: false,
			},
		].concat(langCols);

		ref.gridRef2.current.changeColumnLayoutData(gridCol);
	};

	const searchDtl = (comGrpCd: string) => {
		ref.gridRef2.current.clearGridData();

		if (commUtil.isNull(comGrpCd)) {
			const selectedRow = ref.gridRef1.current.getSelectedRows();
			if (selectedRow.length > 0 && !ref.gridRef1.current.isAddedById(selectedRow[0]._$uid)) {
				comGrpCd = selectedRow[0].comGrpCd; // 현재 행
			} else {
				return;
			}
		}

		const params = { comGrpCd: comGrpCd };
		apiGetCommonI18NCommonCode(params).then(res => {
			const gridData = res.data;
			ref.gridRef2.current.setGridData(gridData);
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		/**
		 * 다국어 컬럼 설정
		 */
		// apiGetCommonCdList({
		// 	comGrpCd: 'LANG_CD', // 공지사항 게시 구분
		// }).then(res => {
		// 	initGridCol(res.data);
		// });

		apiGetCommonI18NCommonCode({
			comGrpCd: 'LANG_CD', // 공지사항 게시 구분
		}).then(res => {
			initGridCol(res.data);
		});

		const gridRefCur1 = ref.gridRef1.current;
		// 에디팅 시작 이벤트 바인딩
		gridRefCur1.bind('cellEditBegin', function (event: any) {
			const rowIdField = gridRefCur1.getProp('rowIdField');
			// 신규행만 수정 가능
			if (event.dataField == 'grpCd') {
				return gridRefCur1.isAddedById(event.item[rowIdField]);
			} else {
				return true; // 다른 필드들은 편집 허용
			}
		});

		// 행 변경 시
		gridRefCur1.bind('selectionChange', function () {
			// 상세코드 조회
			searchDtl(null);
		});
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRef1.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<PageGridBtn gridBtn={gridBtn} gridTitle={t('sysmgt.commoncode.group.title')} />
				<AUIGrid ref={ref.gridRef1} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<AGrid>
				<PageGridBtn gridBtn={gridBtn2} gridTitle={t('sysmgt.commoncode.code.title')} />
				<AUIGrid ref={ref.gridRef2} columnLayout={gridCol2} gridProps={gridProps2} />
			</AGrid>
		</>
	);
});

export default DetailCommonCodeI18N;
