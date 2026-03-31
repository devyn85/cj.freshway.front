/*
 ############################################################################
 # FiledataField	: HorizonGridSample.tsx
 # Description		: 멀티(수평) 그리드 샘플 
 # Author			: Canal Frame
 # Since			: 23.09.25
 ############################################################################
 */

// API Call Function
import { apiGetRoleList, apiGetRolesMappingMenuList, apiPostCopyRole } from '@/api/common/apiSysmgt';

// Style & CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Components
import PageGridBtn from '@/components/common/PageGridBtn';

// Libs
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { showAlert, showConfirm } from '@/util/MessageUtil';
import { Button, Input } from 'antd';

//Utils
import commUtil from '@/util/commUtil';

const HorizonGridSample = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	const gridRef1 = useRef(null);
	const gridRef2 = useRef(null);

	const newAuthCdRef = useRef(null);
	const newAuthNmRef = useRef(null);

	// 현재 선택된 행 상태
	const [selectedRowNm, setSelectedRowNm] = useState();

	const [customBtn, setCustomBtn] = useState(<></>);

	//그리드 컬럼
	const gridCol1 = [
		{
			dataField: 'authority',
			headerText: t('sysmgt.roles.group.authority'),
		},
		{
			dataField: 'roleNm',
			headerText: t('sysmgt.roles.group.roleNm'),
		},
		{
			dataField: 'description',
			headerText: t('sysmgt.roles.group.description'),
		},
		{
			dataField: 'regId',
			headerText: t('com.col.regId'),
		},
		{
			dataField: 'regDt',
			headerText: t('com.col.regDt'),
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		showStateColumn: false,
	};

	//그리드 컬럼
	const gridCol2 = [
		{
			dataField: 'menuId',
			headerText: t('sysmgt.menu.menuId'),
			width: 200,
			style: 'left',
			editable: false,
		},
		{
			dataField: 'menuNm',
			headerText: t('sysmgt.menu.menuNm'),
			width: 200,
			style: 'left',
			editable: false,
		},
		{
			dataField: 'menuYn',
			headerText: t('sysmgt.menu.menuYn'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
			},
		},
		{
			dataField: 'useYn',
			headerText: t('sysmgt.roles.menu.useYn'),
			commRenderer: {
				type: 'checkBox',
			},
			editable: false,
		},
		{
			dataField: 'searchYn',
			headerText: t('sysmgt.roles.menu.searchYn'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{
			dataField: 'newYn',
			headerText: t('sysmgt.roles.menu.newYn'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{
			dataField: 'deleteYn',
			headerText: t('sysmgt.roles.menu.deleteYn'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{
			dataField: 'saveYn',
			headerText: t('sysmgt.roles.menu.saveYn'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{
			dataField: 'printYn',
			headerText: t('sysmgt.roles.menu.printYn'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{
			dataField: 'excelYn',
			headerText: t('sysmgt.roles.menu.excelYn'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{
			dataField: 'btn1Yn',
			headerText: t('sysmgt.roles.menu.btn1Yn'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{
			dataField: 'btn2Yn',
			headerText: t('sysmgt.roles.menu.btn2Yn'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{
			dataField: 'btn3Yn',
			headerText: t('sysmgt.roles.menu.btn3Yn'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{
			dataField: 'btn4Yn',
			headerText: t('sysmgt.roles.menu.btn4Yn'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{
			dataField: 'btn5Yn',
			headerText: t('sysmgt.roles.menu.btn5Yn'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{
			dataField: 'btn6Yn',
			headerText: t('sysmgt.roles.menu.btn6Yn'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{
			dataField: 'btn7Yn',
			headerText: t('sysmgt.roles.menu.btn7Yn'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{
			dataField: 'btn8Yn',
			headerText: t('sysmgt.roles.menu.btn8Yn'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{
			dataField: 'btn9Yn',
			headerText: t('sysmgt.roles.menu.btn9Yn'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{
			dataField: 'btn10Yn',
			headerText: t('sysmgt.roles.menu.btn10Yn'),
			renderer: {
				type: 'CheckBoxEditRenderer',
				checkValue: '1',
				unCheckValue: '0',
				editable: true,
			},
		},
		{
			dataField: 'regId',
			headerText: t('com.col.regId'),
		},
		{
			dataField: 'regDt',
			headerText: t('com.col.regDt'),
		},
	];

	// 그리드 Props
	const gridProps2 = {
		editable: true,
		showStateColumn: true,
		fillColumnSizeMode: false,
	};

	// ==========================================================================
	// 함수
	// ==========================================================================

	/*
    ### gridCustomBtn 함수 ###
    */
	const clickNewAuth = (): void => {
		const newAuthCd = newAuthCdRef.current.input.value;
		const newAuthNm = newAuthNmRef.current.input.value;
		if (commUtil.isNull(newAuthCd)) {
			const msg = t('com.msg.requiredInput', [t('sysmgt.roles.group.authority')]);
			showAlert(null, msg); // 권한코드 항목은 필수값입니다.
			return;
		}
		if (commUtil.isNull(newAuthNm)) {
			const msg = t('com.msg.requiredInput', [t('sysmgt.roles.group.roleNm')]);
			showAlert(null, msg); // 권한명 항목은 필수값입니다.
			return;
		}
		const authority = gridRef1.current.getSelectedRows()[0].authority;
		if (commUtil.isNull(authority)) {
			showAlert(null, t('com.msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		showConfirm(null, t('com.msg.confirmSave'), () => {
			const params = {
				authority: authority,
				authCd: newAuthCd,
				authNm: newAuthNm,
			};
			apiPostCopyRole(params).then(() => {
				newAuthCdRef.current.input.value = '';
				newAuthNmRef.current.input.value = '';
				// search();
			});
		});
	};

	/*
    ### 조회 ###
    */
	const search = () => {
		gridRef1.current.clearGridData();
		gridRef2.current.clearGridData();
		apiGetRoleList({}).then(res => {
			gridRef1.current.setGridData(res.data);
			gridRef1.current.setSelectionByIndex(0, 0);
		});
	};

	// 그리드 초기화
	const searchDtl = (authority: string) => {
		gridRef2.current.clearGridData();
		if (commUtil.isEmpty(authority)) {
			const selectedRow = gridRef1.current.getSelectedRows();
			if (selectedRow.length > 0 && !gridRef1.current.isAddedById(selectedRow[0]._$uid)) {
				authority = selectedRow[0].authority; // 현재 행
			} else {
				return;
			}
		}
		const params = { authority: authority };
		apiGetRolesMappingMenuList(params).then(res => {
			const gridData = res.data;
			gridRef2.current.setGridData(gridData);
		});
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// Component Mounted
	useEffect(() => {
		search();
		gridRef1.current.bind('selectionChange', function () {
			// 상세코드 조회
			searchDtl(null);
			setSelectedRowNm(gridRef1.current.getSelectedRows()[0].roleNm);
		});
	}, []);

	// 선택된 행 변경 감지 useEffect
	useEffect(() => {
		setCustomBtn(
			<>
				<span>{t('sysmgt.roles.menu.copyBy', [selectedRowNm])}</span>
				<Input placeholder={t('sysmgt.roles.menu.newAuthority')} id="newAuthCd" name="newAuthCd" ref={newAuthCdRef} />
				<span>|</span>
				<Input placeholder={t('sysmgt.roles.menu.newRoleNm')} id="newAuthNm" name="newAuthNm" ref={newAuthNmRef} />
				<Button onClick={clickNewAuth}> {t('sysmgt.roles.menu.btnNewYn')} </Button>
			</>,
		);
	}, [selectedRowNm]);

	return (
		<>

				<AGrid>
					<PageGridBtn gridTitle={t('sysmgt.roles.group.authority')} />
					<AUIGrid ref={gridRef1} columnLayout={gridCol1} gridProps={gridProps} />
				</AGrid>
				<AGrid>
					<PageGridBtn gridTitle={t('sysmgt.menu.title')}>{customBtn}</PageGridBtn>
					<AUIGrid ref={gridRef2} columnLayout={gridCol2} gridProps={gridProps2} />
				</AGrid>

		</>
	);
};
export default HorizonGridSample;
