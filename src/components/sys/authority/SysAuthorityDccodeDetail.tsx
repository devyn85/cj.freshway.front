// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Util
import commUtil from '@/util/commUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// API
import { apiGetSysAuthorityProgramList, apiPostSaveSysAuthorityProgram } from '@/api/sys/apiSysAuthority';

const SysAuthorityDccodeDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 그리드 접근 Ref
	ref.gridRefGrp = useRef();
	ref.gridRefDtl = useRef();

	// 다국어
	const { t } = useTranslation();

	// grid data
	const [totalCntDtl, setTotalCntDtl] = useState(0);

	// 그룹권한 그리드 컬럼
	const gridColGrp = [
		// {
		// 	dataField: 'systemCl',
		// 	headerText: t('lbl.SYSTEM_CL'),
		// },
		{
			dataField: 'authCd',
			dataType: 'code',
			headerText: t('lbl.AUTH_CD'),
		},
		{
			dataField: 'authNm',
			headerText: t('lbl.AUTH_NM'),
		},
	];

	// 그룹권한 그리드 Props
	const gridPropsGrp = {
		editable: false,
		showStateColumn: false,
	};

	// 권한 상세 그리드 컬럼
	const gridColDtl = [
		{
			dataField: 'AAA0',
			headerText: '포함여부',
			commRenderer: {
				type: 'checkBox',
			},
		},
		{
			dataField: 'AAA1',
			headerText: '센터코드',
			editable: false,
		},
		{
			dataField: 'AAA2',
			headerText: '센터명',
			editable: false,
		},
		{
			dataField: 'AAA4',
			headerText: '등록자ID',
			editable: false,
		},
		{
			dataField: 'AAA5',
			headerText: '등록일자',
			editable: false,
		},
	];

	// 권한 상세 그리드 Props
	const gridPropsDtl = {
		editable: true,
		showRowCheckColumn: true,
		fillColumnSizeMode: false,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 권한 상세 조회
	 * @param {string} authority 그룹 권한 코드
	 * @returns {void}
	 */
	const searchDtl = (authority: string) => {
		ref.gridRefDtl.current.clearGridData();
		if (commUtil.isEmpty(authority)) {
			const selectedRow = ref.gridRefGrp.current.getSelectedRows();
			if (selectedRow.length > 0 && !ref.gridRefGrp.current.isAddedById(selectedRow[0]._$uid)) {
				const params = {
					systemCl: 'LOGISONE',
					authCd: selectedRow[0].authCd,
				};
				apiGetSysAuthorityProgramList(params).then(res => {
					const gridData = res.data;
					ref.gridRefDtl.current.setGridData(gridData);
					setTotalCntDtl(res.data.length);

					// 조회된 결과에 맞게 칼럼 넓이를 구한다.
					const colSizeList = ref.gridRefDtl.current.getFitColumnSizeList(true);
					// 구해진 칼럼 사이즈를 적용 시킴.
					ref.gridRefDtl.current.setColumnSizeList(colSizeList);
				});
			} else {
				return;
			}
		}
	};

	/**
	 * 그룹 상세 저장
	 * @returns {void}
	 */
	const saveDtlFunc = () => {
		// 변경 데이터 확인
		const authDtlList = ref.gridRefDtl.current.getChangedData();
		if (!authDtlList || authDtlList.length < 1) {
			showAlert(null, t('msg.noChange'));
			return;
		}

		showConfirm(null, t('msg.confirmSave'), () => {
			const params = {
				authDtlList: authDtlList,
			};
			apiPostSaveSysAuthorityProgram(params).then(() => {
				// 콜백 처리
				props.callBackFn && props.callBackFn instanceof Function ? props.callBackFn() : null;
			});
		});
	};

	// 그룹권한 그리드 버튼 설정
	const gridBtnGrp: GridBtnPropsType = {
		tGridRef: ref.gridRefGrp, // 타겟 그리드 Ref
	};

	// 그룹 상세 그리드 버튼 설정
	const gridBtnDtl: GridBtnPropsType = {
		tGridRef: ref.gridRefGrp, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveDtlFunc,
			},
		],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		ref.gridRefGrp.current.bind('selectionChange', function () {
			// 권한 상세 조회
			searchDtl(null);
		});
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRefGrp.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);

			// 상세 총건수 초기화
			if (props.data?.length < 1) {
				setTotalCntDtl(0);
			}
		}
	}, [props.data]);

	return (
		<>
			<AGrid>
				<GridTopBtn gridBtn={gridBtnGrp} gridTitle={'그룹권한'} totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRefGrp} columnLayout={gridColGrp} gridProps={gridPropsGrp} />
			</AGrid>
			<AGrid>
				<GridTopBtn gridBtn={gridBtnDtl} gridTitle={'센터'} totalCnt={totalCntDtl} />
				<AUIGrid ref={ref.gridRefDtl} columnLayout={gridColDtl} gridProps={gridPropsDtl} />
			</AGrid>
		</>
	);
});

export default SysAuthorityDccodeDetail;
