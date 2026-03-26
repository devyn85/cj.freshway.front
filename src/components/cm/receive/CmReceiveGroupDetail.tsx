// Lib
import AGrid from '@/assets/styled/AGrid/AGrid';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import { apiGetRcvGrpDetailList, apiPostSaveRcvGrpDetail, apiPostSaveRcvGrpHeader } from '@/api/cm/apiCmReceiveGroup';
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';
import { Button } from 'antd';

// Store
import CmReceivePopup from '@/components/cm/popup/CmReceivePopup';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import { getCommonCodeList } from '@/store/core/comCodeStore';

const CmReceiveGroupDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// grid Ref
	const { t } = useTranslation();
	ref.gridRefMaster = useRef();
	ref.gridRefDtl = useRef();
	const modalRef = useRef(null);

	// grid data
	const [totalCntDtl, setTotalCntDtl] = useState(0);
	const [selItem, setSelItem] = useState<any>({});

	const emptypeList = getCommonCodeList('EMPTYPE2', '전체', '');

	// 수신그룹 그리드 칼럼 레이아웃 설정
	const gridColMaster = [
		{
			headerText: t('그룹 No.'), // 수신그룹ID
			dataField: 'recvGroupId',
			editable: false,
		},
		{
			headerText: t('사용자 정의 그룹명'), // 수신그룹
			dataField: 'recvGroupNm',
			required: true,
		},
		{
			headerText: t('비고'), // 메모
			dataField: 'memo',
		},
		{
			headerText: t('lbl.USE_YN'), // 사용여부
			dataField: 'useYn',
			required: true,
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('YN'),
			},
		},
		{
			headerText: t('lbl.ADDWHO'), // 등록자
			dataField: 'regNm',
			dataType: 'manager',
			editable: false,
			managerDataField: 'addWho',
		},
		{
			dataField: 'addWho',
			visible: false,
		},
		{
			headerText: t('lbl.ADDDATE'), // 등록일시
			dataField: 'addDate',
			dataType: 'date',
			editable: false,
		},
		{
			headerText: t('lbl.EDITWHO'), // 최종변경자
			dataField: 'updNm',
			dataType: 'manager',
			editable: false,
			managerDataField: 'editWho',
		},
		{
			dataField: 'editWho',
			visible: false,
		},
		{
			headerText: t('lbl.EDITDATE'), // 최종변경시간
			dataField: 'editDate',
			dataType: 'date',
			editable: false,
		},
	];

	// 수신그룹 그리드 속성 설정
	const gridPropsMaster = {
		editable: true,
		// showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
	};

	// 그룹 상세 그리드 칼럼 레이아웃 설정
	const gridColDetail = [
		{
			headerText: t('소속'), // 소속
			dataField: 'empType',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return emptypeList.filter((empType: any) => empType.comCd === value).map((obj: any) => obj.cdNm);
			},
		},
		{
			headerText: t('부서'), // 부서
			dataField: 'department',
		},
		// {
		// 	headerText: t('lbl.RECV_GROUP'), // 수신그룹
		// 	dataField: 'recvGroupNm',
		// },
		{
			headerText: t('lbl.USER_ID'), // 사용자ID
			dataField: 'userIdDisp',
		},
		{
			headerText: t('lbl.USER_NM'), // 사용자명
			dataField: 'userNm',
		},
		// {
		// 	headerText: t('lbl.CELLULAR'), // 핸드폰번호
		// 	dataField: 'handphoneNo',
		// },
		// {
		// 	headerText: t('lbl.EMAIL_CNT'), // 이메일
		// 	dataField: 'mailId',
		// },
	];

	// 그룹 상세 그리드 속성 설정
	const gridPropsDetail = {
		// showRowCheckColumn: true,
		isLegacyRemove: true,
		showCustomRowCheckColumn: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 수신그룹 상세 조회
	 * @param {number} rowIndex 선택된 Row Index
	 * @returns {void}
	 */
	const searchDtl = (rowIndex: number) => {
		ref.gridRefDtl.current.clearGridData();

		if (commUtil.isNotEmpty(rowIndex)) {
			const selectedRow = ref.gridRefMaster.current.getItemByRowIndex(rowIndex);
			if (commUtil.isNotEmpty(selectedRow) && !ref.gridRefMaster.current.isAddedById(selectedRow._$uid)) {
				setSelItem(selectedRow);

				const params = {
					recvGroupId: selectedRow.recvGroupId,
				};
				apiGetRcvGrpDetailList(params).then(res => {
					const gridData = res.data;
					ref.gridRefDtl.current.setGridData(gridData);
					setTotalCntDtl(res.data.length);

					// 조회된 결과에 맞게 칼럼 넓이 적용 시킴
					// ref.gridRefDtl.current.setColumnSizeList(ref.gridRefDtl.current.getFitColumnSizeList(true));
				});
			} else {
				return;
			}
		}
	};

	/**
	 * 수신그룹 저장
	 * @returns {void}
	 */
	const saveGrpCode = () => {
		// 변경 데이터 확인
		const codeGrpList = ref.gridRefMaster.current.getChangedData({ validationYn: false });
		if (!codeGrpList || codeGrpList.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		// validation
		if (!ref.gridRefMaster.current.validateRequiredGridData()) {
			return;
		}

		ref.gridRefMaster.current.showConfirmSave(() => {
			const params = {
				dtlList: codeGrpList,
			};
			apiPostSaveRcvGrpHeader(params).then(() => {
				// 콜백 처리
				if (props.callBackFn && props.callBackFn instanceof Function) {
					props.callBackFn();
				}
			});
		});
	};

	/**
	 * 수신그룹-사용자 저장
	 * @returns {void}
	 */
	const saveCmDtlCode = () => {
		// 변경 데이터 확인
		const codeDtlList = ref.gridRefDtl.current.getChangedData({ validationYn: false });
		if (!codeDtlList || codeDtlList.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		// validation
		if (!ref.gridRefDtl.current.validateRequiredGridData()) {
			return;
		}

		ref.gridRefDtl.current.showConfirmSave(() => {
			const params = {
				dtlList: codeDtlList,
			};
			apiPostSaveRcvGrpDetail(params).then(() => {
				// 콜백 처리
				if (props.callBackFn && props.callBackFn instanceof Function) {
					props.callBackFn();
				}
			});
		});
	};

	/**
	 * 팝업 확인
	 * @param {object} params Request Params
	 */
	const confirmEvent = (params: any) => {
		// popup에서 선택된 데이터와 그리드 컬럼 매핑
		const allRows = ref.gridRefDtl.current.getGridData();

		// allRows의 userId와 params의 userId가 일치하는 항목을 제외한 params만 추가
		const allUserIds = allRows.map((row: any) => row.userId);
		const filteredParams = params.filter((item: any) => !allUserIds.includes(item.userId));

		filteredParams.forEach((item: any) => {
			item.recvGroupId = selItem.recvGroupId;
			item.recvGroupNm = selItem.recvGroupNm;
		});

		// popup에서 선택된 데이터를 신규행으로 추가
		if (filteredParams.length > 0) {
			ref.gridRefDtl.current.addRow(filteredParams);
		}

		modalRef.current.handlerClose();
	};

	/**
	 * 사용자 검색 팝업
	 */
	const onClickUserPopup = () => {
		modalRef.current.handlerOpen();
	};

	/**
	 * 사용자 검색 팝업 닫기
	 */
	const closeEvent = () => {
		modalRef.current.handlerClose();
	};
	// 수신그룹 그리드 버튼 설정
	const gridBtnMaster: GridBtnPropsType = {
		tGridRef: ref.gridRefMaster, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
				initValues: {
					rowStatus: 'I', // 신규 행 상태로 설정
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveGrpCode,
			},
		],
	};

	// 그룹 상세 그리드 버튼 설정
	const gridBtnDetail: GridBtnPropsType = {
		tGridRef: ref.gridRefDtl, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'save', // 저장
				callBackFn: saveCmDtlCode,
			},
		],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	let prevRowIndex: any = null;
	useEffect(() => {
		const gridRefCur = ref.gridRefMaster.current;

		// 그룹 코드 그리드 행 변경 시
		gridRefCur.bind('selectionChange', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell.rowIndex === prevRowIndex) return;

			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell.rowIndex;

			searchDtl(event.primeCell.rowIndex);
		});
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = ref.gridRefMaster.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);
			searchDtl(0);

			// 상세 총건수 초기화
			if (props.data?.length < 1) {
				setTotalCntDtl(0);
			}
		}
	}, [props.data]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRefMaster?.current?.resize?.('100%', '100%');
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
							<GridTopBtn gridBtn={gridBtnMaster} gridTitle={'목록'} totalCnt={props.totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRefMaster} columnLayout={gridColMaster} gridProps={gridPropsMaster} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridBtn={gridBtnDetail} gridTitle={'공지대상'} totalCnt={totalCntDtl}>
								<Button onClick={onClickUserPopup}>공지대상 추가</Button>
							</GridTopBtn>
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRefDtl} columnLayout={gridColDetail} gridProps={gridPropsDetail} />
						</GridAutoHeight>
					</>,
				]}
			/>

			{/* POP 조회 팝업 */}
			<CustomModal ref={modalRef} width="1280px">
				<CmReceivePopup callBack={confirmEvent} close={closeEvent} defaultActiveKey={'2'} tab1Disabled={true} />
			</CustomModal>
		</>
	);
});

export default CmReceiveGroupDetail;
