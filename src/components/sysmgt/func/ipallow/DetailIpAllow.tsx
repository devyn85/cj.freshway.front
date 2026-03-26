// Lib
import AGrid from '@/assets/styled/AGrid/AGrid';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Utils

// Store

// Component
import PageGridBtn from '@/components/common/PageGridBtn';

// API Call Function

const DetailIpAllow = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */

	const { t } = useTranslation();
	// 그리드 컬럼
	const gridCol = [
		{
			dataField: 'userId',
			headerText: t('com.col.userId'),
			width: 120,
			required: true,
		},
		{
			dataField: 'ipAddr',
			headerText: t('com.col.ipAddr'), //IP addr
			width: 150,
			required: true,
			maxlength: 16,
		},
		{
			dataField: 'reason',
			headerText: t('com.col.reason'), // 사유
			width: 300,
			style: 'left',
			maxlength: 30,
		},
		{
			dataField: 'regId',
			headerText: t('com.col.regId'),
			width: 100,
			editable: false,
		},
		{
			dataField: 'regDt',
			headerText: t('com.col.regDt'),
			width: 100,
			editable: false,
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: true,
		showStateColumn: false,
	};

	// 그리드 버튼
	const gridBtn = {
		isPlus: true,
		plusFunction: function () {
			ref.current.addRow({});
		},
		isMinus: true,
		minusFunction: function () {
			ref.current.removeRow('selectedIndex');
		},
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		// 에디팅 시작 이벤트 바인딩
		ref.current.bind('cellEditBegin', function (event: any) {
			const rowIdField = ref.current.getProp('rowIdField');
			// 신규행만 수정 가능
			if (event.dataField == 'userId' || event.dataField == 'ipAddr') {
				return ref.current.isAddedById(event.item[rowIdField]);
			} else {
				return true; // 다른 필드들은 편집 허용
			}
		});
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRef = ref.current;
		if (gridRef) {
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);
		}
	}, [props.data]);

	return (
		<>
			<AGrid>
				<PageGridBtn gridBtn={gridBtn} gridTitle={t('sysmgt.ipallow.title')} />
				<AUIGrid ref={ref} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
});

export default DetailIpAllow;
