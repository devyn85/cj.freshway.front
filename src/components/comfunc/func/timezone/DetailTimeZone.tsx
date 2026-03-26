/*
 ############################################################################
 # FiledataField	: DetailTimeZone.tsx
 # Description		: 타임존 상세
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// component
import AGrid from '@/assets/styled/AGrid/AGrid';
import PageGridBtn from '@/components/common/PageGridBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

interface Props {
	data?: any;
	search?: any;
}

const DetailTimeZone = forwardRef((props: Props, ref: any) => {
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
			headerText: 'Client IP',
			dataField: 'ipAddr',
		},
		{
			headerText: 'LOG_DTM',
			dataField: 'logDtm',
		},
		{
			headerText: 'LOG_DTM(TimeZone)',
			dataField: 'logDtm2',
			headerStyle: 'att_column_style',
		},
		{
			headerText: 'LOG_TYPE',
			dataField: 'logType',
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
			<AGrid dataProps={'row-single'}>
				<PageGridBtn gridTitle={t('etc.history.title')} />
				<AUIGrid ref={ref} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
});

export default DetailTimeZone;
