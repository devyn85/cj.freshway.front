import { apiGetUserRoleList, apiGetUserRoleMapping, apiPostSaveRoleAndUser } from '@/api/common/apiSysmgt';
import AGrid from '@/assets/styled/AGrid/AGrid';
import PageGridBtn from '@/components/common/PageGridBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { showAlert, showConfirm } from '@/util/MessageUtil';

interface PropsType {
	form?: any;
}
const UserAuthGrid = forwardRef(({ form }: PropsType, ref: any) => {
	const { t } = useTranslation();

	const gridRef1 = useRef(null);
	const gridRef2 = useRef(null);

	useEffect(() => {
		initGrid();
		searchUserAuth();
	}, []);

	const searchUserAuth = () => {
		gridRef1.current.clearGridData();
		const page = { startRow: 0, listCount: 500, skipCount: false };
		const param = { ...form.getFieldsValue(), ...page };
		apiGetUserRoleList(param).then(res => {
			gridRef1.current.setGridData(res.data.list);
			gridRef1.current.setSelectionByIndex(0, 0);
		});
	};
	const searchUserAuthDtl = () => {
		gridRef2.current.clearGridData();
		let params = {};
		const selectedRow = gridRef1.current.getSelectedRows();
		if (selectedRow.length > 0 && !gridRef1.current.isAddedById(selectedRow[0]._$uid)) {
			params = { ...form.getFieldsValue(), userId: selectedRow[0].userId };
		} else {
			return;
		}
		apiGetUserRoleMapping(params).then(res => {
			gridRef2.current.setGridData(res.data);
		});
	};

	const saveUserAuth = () => {
		const roleUsers = gridRef2.current.getChangedData();
		if (!roleUsers || roleUsers.length < 1) {
			showAlert(null, t('com.msg.noChange')); // 변경사항이 없습니다
			return;
		}

		//저장하시겠습니까
		showConfirm(null, t('com.msg.confirmSave'), () => {
			const params = {
				roleUsers: roleUsers,
			};
			apiPostSaveRoleAndUser(params).then(() => {
				searchUserAuth();
			});
		});
	};

	const gridCol1 = [
		{
			dataField: 'userNm',
			headerText: t('com.col.userNm'),
		},
		{
			dataField: 'userId',
			headerText: t('com.col.userId'),
		},
	];

	const gridProps1 = {
		editable: false,
	};

	const gridBtn1 = {};

	const gridCol2 = [
		{
			headerText: t('sysmgt.rolesmappingusers.search.include'),
			dataField: 'include',
			commRenderer: {
				type: 'checkBox',
			},
			width: '70',
		},
		{
			// 권한그룹코드
			dataField: 'authority',
			headerText: t('com.col.authority'),
			editable: false,
			width: '100',
		},
		{
			// 권한그룹명
			dataField: 'roleNm',
			headerText: t('com.col.roleNm'),
			editable: false,
			width: '100',
		},
		{
			// 권한그룹정보
			dataField: 'description',
			headerText: t('com.col.authGroupDesc'),
			editable: false,
			width: '150',
		},
		{
			// 등록자ID
			dataField: 'regId',
			headerText: t('com.col.regId'),
			editable: false,
			width: '100',
		},
		{
			// 등록일자
			dataField: 'regDt',
			headerText: t('com.col.regDt'),
			editable: false,
			width: '100',
		},
	];

	const gridProps2 = {
		editable: true,
		showStateColumn: true,
	};

	const gridBtn2 = {};

	const initGrid = () => {
		const gridRefCur1 = gridRef1.current;

		gridRefCur1.bind('selectionChange', function () {
			// 상세코드 조회
			searchUserAuthDtl();
		});
	};

	useImperativeHandle(ref, () => ({ searchUserAuth, saveUserAuth }));

	return (
		<>
			<AGrid>
				<PageGridBtn gridBtn={gridBtn1} gridTitle={t('sysmgt.rolesmappingusers.common.user')} />
				<AUIGrid ref={gridRef1} columnLayout={gridCol1} gridProps={gridProps1} />
			</AGrid>
			<AGrid>
				<PageGridBtn gridBtn={gridBtn2} gridTitle={t('sysmgt.rolesmappingusers.common.auth')} />
				<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={gridProps2} />
			</AGrid>
		</>
	);
});

export default UserAuthGrid;
