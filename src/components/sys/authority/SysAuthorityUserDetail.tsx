// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Component
import CmIndividualPopup from '@/components/cm/popup/CmIndividualPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';

// API
import { apiGetSysAuthorityUserList, apiPostSaveSysAuthorityUser } from '@/api/sys/apiSysAuthority';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';

const SysAuthorityUserDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// props 초기화
	const { form, data, totalCnt, callBackFn } = props;

	// Ref
	ref.gridRefGrp = useRef();
	ref.gridRefDtl = useRef();
	const refModal = useRef<any>(null); // 개인정보 팝업

	// 다국어
	const { t } = useTranslation();

	// DATA 초기화
	const [totalCntDtl, setTotalCntDtl] = useState(0);
	const [popUpParams, setPopUpParams] = useState({}); // 팝업 파마리터
	const emptypeList = getCommonCodeList('EMPTYPE2');

	// 그룹권한 그리드 컬럼
	const gridColGrp = [
		{
			dataField: 'authCd',
			dataType: 'code',
			headerText: t('lbl.AUTH_CD'),
		},
		{
			dataField: 'authNm',
			headerText: t('lbl.AUTH_NM'),
		},
		{
			dataField: 'upAuthGroupCd',
			headerText: t('lbl.UP_AUTH_GROUP_CD'),
			dataType: 'code',
		},
		{
			dataField: 'lowAuthYn',
			headerText: t('lbl.LOW_AUTH_YN'),
			dataType: 'code',
		},
	];

	// 그룹권한 그리드 Props
	const gridPropsGrp = {
		editable: false,
		showStateColumn: false,
		fillColumnSizeMode: true,
	};

	// 권한 상세 그리드 컬럼
	const gridColDtl = [
		{
			dataField: 'useYn',
			headerText: t('lbl.USE_YN'),
			commRenderer: {
				type: 'checkBox',
				disabledFunction: (rowIndex: number, columnIndex: number, value: any, isChecked: boolean, item: any) => {
					if ('01,02,03'.includes(item.empType)) {
						return true;
					} else {
						return false;
					}
				},
			},
		},
		{
			dataField: 'userIdDisp',
			headerText: t('lbl.USER_ID'),
			editable: false,
		},
		{
			dataField: 'userId',
			visible: false,
		},
		{
			dataField: 'userNm',
			headerText: t('lbl.USER_NM'),
			editable: false,
		},
		{
			dataField: 'empType',
			headerText: t('lbl.EMPTYPE'),
			dataType: 'code',
			editable: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return emptypeList.filter((empType: any) => empType.comCd === value).map((obj: any) => obj.cdNm);
			},
		},
		{
			dataField: 'updNm',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager',
			managerDataField: 'updId',
			editable: false,
		},
		{
			dataField: 'updId',
			visible: false,
		},
		{
			dataField: 'updDtm',
			headerText: t('lbl.EDITDATE'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'regNm',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager',
			managerDataField: 'regId',
			editable: false,
		},
		{
			dataField: 'regId',
			visible: false,
		},
		{
			dataField: 'regDtm',
			headerText: t('lbl.ADDDATE'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'authCd',
			visible: false,
		},
	];

	// 권한 상세 그리드 Props
	const gridPropsDtl = {
		editable: true,
		// showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
		fillColumnSizeMode: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 권한그룹별 사용자 목록 조회
	 * @param {number} rowIndex 선택된 Row Index
	 * @returns {void}
	 */
	const searchUserList = (rowIndex: number) => {
		ref.gridRefDtl.current.clearGridData();
		if (commUtil.isNotEmpty(rowIndex)) {
			const selectedRow = ref.gridRefGrp.current.getItemByRowIndex(rowIndex);
			if (commUtil.isNotEmpty(selectedRow) && !ref.gridRefGrp.current.isAddedById(selectedRow._$uid)) {
				const params = {
					...form.getFieldsValue(),
					authCd: selectedRow.authCd,
				};
				apiGetSysAuthorityUserList(params).then(res => {
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
	 * 권한그룹별 사용자 저장
	 * @returns {void}
	 */
	const saveAuthUser = () => {
		// 변경 데이터 확인
		const authUserList = ref.gridRefDtl.current.getChangedData({ validationYn: false });
		if (!authUserList || authUserList.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		ref.gridRefDtl.current.showConfirmSave(() => {
			const params = {
				authUserList: authUserList,
			};
			apiPostSaveSysAuthorityUser(params).then(() => {
				// 콜백 처리
				if (callBackFn && callBackFn instanceof Function) {
					callBackFn();
				}
			});
		});
	};

	// 그룹권한 그리드 버튼 설정
	const gridBtnGrp: GridBtnPropsType = {
		tGridRef: ref.gridRefGrp, // 타겟 그리드 Ref
	};

	// 그룹 상세 그리드 버튼 설정
	const gridBtnDtl: GridBtnPropsType = {
		tGridRef: ref.gridRefDtl, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveAuthUser,
			},
		],
	};

	/**
	 * 개인정보 팝업 열기
	 * @param {any} params 파라미터
	 */
	const openIndividualPopup = (params: any) => {
		if (params.dataField === 'userIdDisp') {
			params.individualKey = 'userIdDisp'; // 개인정보 키 설정 - 사용자ID
		} else if (params.dataField === 'userNm') {
			params.individualKey = 'userNm'; // 개인정보 키 설정 - 이름
		}

		if (commUtil.isNotEmpty(params.individualKey)) {
			fnCmIndividualPopup(params);
		}
	};

	/**
	 * 팝업 열기 이벤트
	 * @param {any} params 파라미터
	 */
	const fnCmIndividualPopup = (params: any) => {
		setPopUpParams(params);
		refModal.current.handlerOpen();
	};

	/**
	 * 팝업 닫기 이벤트
	 */
	const closeEvent = () => {
		refModal.current.handlerClose();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		ref.gridRefGrp?.current?.bind('selectionConstraint', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.rowIndex !== event.toRowIndex) {
				searchUserList(event.toRowIndex);
			}
		});
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.gridRefGrp?.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(data);
			gridRefCur1?.setSelectionByIndex(0, 0);
			searchUserList(0);

			// 상세 총건수 초기화
			if (data?.length < 1) {
				setTotalCntDtl(0);
			}
		}
	}, [data]);

	useEffect(() => {
		// 더블 클릭 시
		ref.gridRefDtl?.current?.bind(
			'cellDoubleClick',
			async (event: { dataField: string; value: any; rowIndex: number }) => {
				const params = { url: '', dataField: '', userId: '' }; // 팝업 파라미터 초기화
				params.url = '/api/sys/authorityUser/v1.0/getAuthorityUserList'; // 팝업 URL 설정
				params.userId = ref.gridRefDtl.current.getCellValue(event.rowIndex, 'userId'); // 사용자ID 설정
				params.dataField = event.dataField;
				openIndividualPopup(params);
			},
		);
	}, []);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRefGrp?.current?.resize?.('100%', '100%');
		ref.gridRefDtl?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtnGrp} gridTitle={t('lbl.AUTHORITYGRP')} totalCnt={totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRefGrp} columnLayout={gridColGrp} gridProps={gridPropsGrp} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtnDtl} gridTitle={t('lbl.USER')} totalCnt={totalCntDtl} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRefDtl} columnLayout={gridColDtl} gridProps={gridPropsDtl} />
						</GridAutoHeight>
					</>,
				]}
			/>

			<CustomModal ref={refModal} width="700px">
				<CmIndividualPopup popUpParams={popUpParams} close={closeEvent} />
			</CustomModal>
		</>
	);
});

export default SysAuthorityUserDetail;
