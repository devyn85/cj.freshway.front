// Lib
import AGrid from '@/assets/styled/AGrid/AGrid';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import TextArea from 'antd/es/input/TextArea';

// Component
import PageGridBtn from '@/components/common/PageGridBtn';
import commUtil from '@/util/commUtil';

// API Call Function

const DetailExcLog = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	const [excptCnts, setExcptCnts] = useState('');
	const { t } = useTranslation();
	/*
    ### 그리드 변수 ###
    */
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

	// 그리드 Props
	const gridProps = {
		editable: false,
		showStateColumn: false,
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		// 행 변경 시
		ref.current.bind('selectionChange', function (event: any) {
			if (event.selectedItems.length > 0) {
				setExcptCnts(event.selectedItems[0].item.excptCnts);
			}
		});
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRef = ref.current;
		if (gridRef) {
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);
			if (commUtil.isEmpty(props.data)) {
				setExcptCnts('');
			}
		}
	}, [props.data]);

	return (
		<>

				<AGrid>
					<PageGridBtn gridTitle={t('sysmgt.exclog.title')} />
					<AUIGrid ref={ref} columnLayout={gridCol} gridProps={gridProps} />
				</AGrid>
				<div>
					{/* 예외내용 */}
					<h3>{t('sysmgt.exclog.grid.excptCnts')}</h3>
					<TextArea placeholder={t('sysmgt.exclog.grid.excptCnts')} rows={25} value={excptCnts} />
				</div>

		</>
	);
});

export default DetailExcLog;
