import { apiGetCommonI18NCommonCode } from '@/api/common/apiSysmgt';
import AGrid from '@/assets/styled/AGrid/AGrid';
import PageGridBtn from '@/components/common/PageGridBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

const DetailMenuI18N = forwardRef((props: any, gridRef: any) => {
	const { t } = useTranslation();
	// 그리드 추가 함수
	const initGridCol = (langCds: any) => {
		const langCols: any[] = [];
		langCds.forEach((el: { comCd: any; cdNm: any }) => {
			langCols.push({
				dataField: el.comCd,
				headerText: el.cdNm,
			});
		});
		let gridCol: any[] = [
			{
				dataField: 'menuId',
				headerText: t('sysmgt.menu.menuId'),
				style: 'left',
				editable: false,
			},
		].concat(langCols);
		gridCol = gridCol.concat([
			{
				dataField: 'regId',
				headerText: t('com.col.regId'),
				editable: false,
			},
			{
				dataField: 'regDt',
				headerText: t('com.col.regYmd'),
				editable: false,
			},
		]);
		gridRef.current.changeColumnLayoutData(gridCol);
	};

	const initGrid = () => {
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
	};

	useEffect(() => {
		initGrid();
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);
		}
	}, [props.data]);

	// ==========================================================================
	// Grid 생성 영역
	// ==========================================================================
	/*
	### 그리드 초기화 ###
	*/
	const gridCol: object[] = [];
	// 그리드 속성
	const gridProps = {
		editable: true,
		enterKeyColumnBase: true,
		useContextMenu: true,
		enableFilter: true,
		showStateColumn: true,
	};

	return (
		<AGrid>
			<PageGridBtn />
			<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
});

export default DetailMenuI18N;
