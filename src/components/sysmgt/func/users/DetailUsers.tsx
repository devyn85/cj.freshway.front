import AGrid from '@/assets/styled/AGrid/AGrid';
import PageGridBtn from '@/components/common/PageGridBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodeList } from '@/store/core/comCodeStore';

const DetailUsers = forwardRef((props: any, gridRef: any) => {
	const { t } = useTranslation();

	/**
	 * 그리드 컬럼
	 * @returns {Array} 그리드 컬럼 데이터
	 */
	const gridCol = [
		{
			dataField: 'userId',
			headerText: t('sysmgt.users.user.userId'),
			required: true,
			maxlength: 12,
		},
		{
			dataField: 'userNm',
			headerText: t('sysmgt.users.user.userNm'),
			//				style: 'left',
			required: true,
			maxlength: 200,
		},
		{
			dataField: 'mailAddr',
			headerText: t('sysmgt.users.user.mailAddr'),
			required: true,
			maxlength: 100,
		},
		{
			dataField: 'empNo',
			headerText: t('sysmgt.users.user.empNo'),
			maxlength: 20,
		},
		{
			dataField: 'userStatus',
			headerText: t('sysmgt.users.user.userStatus'),
			required: true,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('USER_STATUS'),
			},
		},
		{
			dataField: 'userEnable',
			headerText: t('sysmgt.users.user.userEnable'),
			commRenderer: {
				type: 'checkBox',
			},
		},
		{
			dataField: 'regId',
			headerText: t('com.col.regId'),
			editable: false,
		},
		{
			dataField: 'regDt',
			headerText: t('com.col.regDt'),
			editable: false,
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: true,
		showStateColumn: true,
	};

	// 그리드 버튼
	const gridBtn = {
		isPlus: true,
		plusFunction: function () {
			gridRef.current.addRow({ userStatus: '01', userEnable: '1' });
		},
		isMinus: true,
		minusFunction: function () {
			gridRef.current.removeRow('selectedIndex');
		},
	};

	useEffect(() => {
		// 그리드 초기화
		// 에디팅 시작 이벤트 바인딩
		const gridRefCur = gridRef.current;
		// 에디팅 시작 이벤트 바인딩
		gridRefCur.bind('cellEditBegin', function (event: any) {
			const rowIdField = gridRefCur.getProp('rowIdField');
			// 신규행만 수정 가능
			if (event.dataField == 'userId') {
				return gridRefCur.isAddedById(event.item[rowIdField]);
			} else {
				return true; // 다른 필드들은 편집 허용
			}
		});
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<PageGridBtn gridBtn={gridBtn} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
});

export default DetailUsers;
