/**
 * 메뉴 : 공통기능 > 기능템플릿 > 공지사항 > 상세 공지사항
 * @module comfunc/func/bbsAdminMng/DetailBbsAdminMng
 * @author canalFrame <canalframe@cj.net>
 * @since 1.0.0
 */
// component
import AGrid from '@/assets/styled/AGrid/AGrid';
import PageGridBtn from '@/components/common/PageGridBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

/**
 * @component
 * @param {any} props search props
 * @param {any }ref ref
 */
const DetailBbsAdminMng = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// props
	const { data, setBbsSeq, setOpen } = props;
	// 다국어
	const { t } = useTranslation();

	// 그리드 버튼
	const gridBtn = {};
	// 그리드 Props
	const gridProps = {
		editable: false,
		showStateColumn: false,
	};

	//그리드 컬럼
	const gridCol = [
		{
			dataField: 'bbsSeq',
			headerText: t('comfunc.bbs.grid.bbsSeq'),
			width: 80,
		},
		{
			dataField: 'bbsTp',
			headerText: t('comfunc.bbs.grid.bbsTp'),
			width: 100,
		},
		{
			dataField: 'bbsTitle',
			headerText: t('comfunc.bbs.grid.bbsTitle'),
			width: 150,
			style: 'left',
		},
		{
			dataField: 'attchYn',
			headerText: t('comfunc.bbs.grid.attchYn'),
			width: 70,
			commRenderer: {
				type: 'checkBox',
			},
		},
		{
			dataField: 'vwCnt',
			headerText: t('comfunc.bbs.grid.vwCnt'),
			width: 80,
		},
		{
			dataField: 'regDt',
			headerText: t('comfunc.bbs.grid.regDt'),
			width: 100,
		},
		{
			dataField: 'regrNm',
			headerText: t('comfunc.bbs.grid.regrNm'),
			width: 100,
		},
	];

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 그리드 이벤트 설정
	 */
	const initGridEvent = () => {
		// 셀 더블 클릭
		ref.current.bind('cellDoubleClick', (event: { dataField: string; item: any }) => {
			const bbsSeq = event.item.bbsSeq;
			setBbsSeq(bbsSeq);
			setOpen();
		});
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		initGridEvent();
	});

	useEffect(() => {
		ref.current.setGridData(data);
	}, [data]);

	return (
		<>
			<div className="flex-wrap ">
				<AGrid>
					<PageGridBtn gridTitle={t('comfunc.bbs.grid.title')} gridBtn={gridBtn} />
					<AUIGrid ref={ref} columnLayout={gridCol} gridProps={gridProps} />
				</AGrid>
			</div>
		</>
	);
});

export default DetailBbsAdminMng;
