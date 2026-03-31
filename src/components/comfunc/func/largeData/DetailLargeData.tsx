/*
 ############################################################################
 # FiledataField	: DetailLargeData.tsx
 # Description		: 대량데이터처리 상세
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// component
import AGrid from '@/assets/styled/AGrid/AGrid';
import PageGridBtn from '@/components/common/PageGridBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

const DetailLargeData = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { data } = props;

	// 다국어
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

	const gridProps = {
		editable: true,
		showStateColumn: true,
	};

	/**
	 * =====================================================================
	 *	02. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		ref.current.setGridData(data);
	}, [data]);

	return (
		<>
			<div className="flex-wrap ">
				<AGrid>
					<PageGridBtn gridTitle={t('comfunc.largedata.title')} />
					<AUIGrid ref={ref} columnLayout={gridCol} gridProps={gridProps} />
				</AGrid>
			</div>
		</>
	);
});

export default DetailLargeData;
