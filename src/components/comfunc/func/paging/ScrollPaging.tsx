/*
 ############################################################################
 # FiledataField	: ScrollPaging.tsx
 # Description		: 스크롤 페이징
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// component
import AGrid from '@/assets/styled/AGrid/AGrid';
import PageGridBtn from '@/components/common/PageGridBtn';
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

interface Props {
	data?: any;
	search?: any;
	setCurrentPage?: any;
}

const ScrollPaging = forwardRef((props: Props, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { data, search, setCurrentPage } = props;
	//다국어
	const { t } = useTranslation();

	const gridCol = [
		{
			dataField: 'exnNo',
			headerText: t('sysmgt.exclog.grid.exnNo'), // 일련번호
		},
		{
			dataField: 'excptCnts',
			headerText: t('sysmgt.exclog.grid.excptCnts'), // 예외내용
		},
		{
			dataField: 'occrDy',
			headerText: t('sysmgt.exclog.grid.occrDy'), // 발생일자
		},
		{
			dataField: 'clntAddr',
			headerText: t('sysmgt.exclog.grid.clntAddr'), // 클라이언트주소
		},
		{
			dataField: 'svrAddr',
			headerText: t('sysmgt.exclog.grid.svrAddr'), // 서버주소
		},
		{
			dataField: 'callUri',
			headerText: t('sysmgt.exclog.grid.callUri'), // 호출URL
		},
	];

	const gridProps2 = {
		editable: false,
		showStateColumn: false,
	};

	const gridBtn = {
		isAddBtn1: true,
		addLabel1: t('com.btn.search'),
		addFunction1: function () {
			search();
		},
	};

	/**
	 * =====================================================================
	 *	02. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useScrollPagingAUIGrid({
		gridRef: ref.current,
		callbackWhenScrollToEnd: () => {
			setCurrentPage((currentPageScr: any) => currentPageScr + 1);
		},
		totalCount: data.totalCount,
	});

	useEffect(() => {
		ref.current.addRow(data);
	}, [data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<PageGridBtn gridBtn={gridBtn} gridTitle={t('sysmgt.exclog.title')} />
				<AUIGrid ref={ref} columnLayout={gridCol} gridProps={gridProps2} />
			</AGrid>
		</>
	);
});

export default ScrollPaging;
