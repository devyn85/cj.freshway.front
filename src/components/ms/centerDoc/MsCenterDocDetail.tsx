// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import MsCenterDocFileUploadPopup from '@/components/comfunc/func/filePage/MsCenterDocFileUploadPopup';
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';

// Utils
import { useMoveMenu } from '@/hooks/useMoveMenu';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { useReqTempReport } from '@/hooks/tm/useReqTempReport';
import { getCommonCodeList, getCommonCodebyCd } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import { getUserDccodeList } from '@/store/core/userStore';

// API Call Function
import { apiPostSaveMasterList } from '@/api/ms/apiMsCenterDoc';

const MsCenterDocDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const userDccodeList = getUserDccodeList('') ?? [];
	const fileUploadModal = useRef(null);
	const [attchFileGrpNo, setAttchFileGrpNo] = useState(null);
	const [popUpParams, setPopUpParams] = useState({}); // 팝업 파라미터
	const { VITE_ENVIRONMENT } = import.meta.env; // 서버 환경 변수

	const user = useAppSelector(state => state.user.userInfo);

	const { moveMenu } = useMoveMenu();

	// set, clear store 요청정보
	const { setReqTempReport, clearReqTempReport } = useReqTempReport();

	// 그리드 초기화
	const gridCol = [
		// {
		// 	dataField: 'dcCode',
		// 	headerText: t('lbl.DCCODE'),
		// 	dataType: 'code',
		// 	editRenderer: {
		// 		type: 'DropDownListRenderer',
		// 		list: userDccodeList,
		// 		keyField: 'dccode', // key 에 해당되는 필드명
		// 		valueField: 'dcname',
		// 	},
		// 	labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
		// 		return userDccodeList.find((item: any) => item.dccode === value)?.dcname || '';
		// 	},
		// 	editable: false,
		// },
		{
			dataField: 'dcCode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: userDccodeList,
				keyField: 'dccode', // key 에 해당되는 필드명
				valueField: 'dcname',
			},
			filter: {
				showIcon: true,
			},
			required: true,
			editable: false,
		},
		{
			dataField: 'dcName',
			headerText: t('lbl.DCNAME'),
			dataType: 'code',
			editable: false,
			// labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
			// 	const dcCode = item.dcCode;
			// 	return userDccodeList.find((item: any) => item.dccode === dcCode)?.dcname.split(']')[1] || '';
			// },
			// filter: {
			// 	showIcon: true,
			// },
		},
		{
			dataField: 'reqDate',
			headerText: '요청일자',
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'custKey',
			headerText: t('lbl.FROM_CUSTKEY_RT'),
			dataType: 'code',
			editable: false,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					e.item.custkey = e.item.custKey;
					e.item.storekey = e.item.storerKey;
					gridRef.current.openPopup(e.item, 'cust');
				},
			},
		},
		{
			dataField: 'custName',
			headerText: t('lbl.FROM_CUSTNAME_RT'),
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'other02',
			headerText: '요청자',
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'reqDoc',
			headerText: '요청서류',
			dataType: 'string',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('COP_FILE_GUBUN', value)?.cdNm;
			},
			editable: false,

			renderer: {
				type: 'LinkRenderer',
				baseUrl: 'javascript',
				jsCallback: (rowIndex: any, columnIndex: any, value: any) => {
					if (value === '1321') {
						const rowData = gridRef.current?.getItemByRowIndex(rowIndex);
						if (!rowData) return;

						// 온도기록지 화면으로 이동
						goTempRecordDoc(rowData, value);
					}
				},
			},
			styleFunction: (rowIndex: any, columnIndex: any, value: any) => {
				if (value !== '1321') {
					return 'disabled-link';
				}
				return '';
			},
		},
		{
			dataField: 'centerFile',
			headerText: '파일첨부',
			dataType: 'code',
			editable: false,
			renderer: {
				type: 'ButtonRenderer',
				labelText: '파일첨부',
				onClick: (event: any) => {
					let doctype = event.item.reqDoc;
					if (doctype.split('-').length > 1) {
						doctype = doctype.split('-')[0];
					}
					const params = {
						aprvflag: '2',
						attrid: '100',
						id: user.userNo,
						pw: user.userNo,
						mode: '1',
						doctype: doctype,
						requestno: event.item.reqNo,
						procflag: '1',
					};

					// 임시적으로 개발서버에서만 "센터서류 파일 업로드 팝업" 사용
					// if (VITE_ENVIRONMENT === 'dev' || VITE_ENVIRONMENT === 'local') {
					setPopUpParams({
						serialKey: event.item.serialKey,
						reqDoc: event.item.reqDoc,
						reqNo: event.item.reqNo,
					});
					onClickFileUploader(event);
					// } else {
					// 	extUtil.openEdms(params);
					// }
				},
				// disabledFunction: (rowIndex: any, columnIndex: any, value: any, item: any) => {
				// 	if (item.regYn === 'N') {
				// 		return true;
				// 	}
				// 	return false;
				// },
			},
		},
		// {
		// 	dataField: 'reqId',
		// 	headerText: t('lbl.REQID'),
		// 	dataType: 'code',
		// },
		{
			dataField: 'regMemo',
			headerText: '비고',
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'other01',
			headerText: '입고일자(온도기록지)',
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'regYn',
			headerText: '등록완료여부',
			dataType: 'code',
			editRenderer: {
				type: 'DropDownListRenderer',
				list: getCommonCodeList('YN', ''),
				keyField: 'comCd', // key 에 해당되는 필드명
				valueField: 'cdNm',
			},
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('YN', value)?.cdNm;
			},
		},
		{
			dataField: 'addWho',
			visible: false,
		},
		{
			dataField: 'addWhoNm',
			headerText: t('lbl.ADDWHO'),
			editable: false,
			dataType: 'manager',
			managerDataField: 'addWho',
		},
		{
			dataField: 'addDate',
			headerText: t('lbl.ADDDATE'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'editWho',
			visible: false,
		},
		{
			dataField: 'editWhoNm',
			headerText: t('lbl.EDITWHO'),
			editable: false,
			dataType: 'manager',
			managerDataField: 'editWho',
		},
		{
			dataField: 'editDate',
			headerText: t('lbl.EDITDATE'),
			dataType: 'date',
			editable: false,
		},
		// {
		// 	dataField: 'docCnt',
		// 	headerText: t('lbl.DOCCNT'),
		// 	dataType: 'numeric',
		// },
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		enableFilter: true,
		copyDisplayValue: true,
		// fillColumnSizeMode: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		gridRef?.current.bind('cellEditEnd', (event: any) => {
			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.
			gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'U');
		});
	};

	//온도기록시 화면으로 이동 함수
	const goTempRecordDoc = (rowData: any, reqDoc: string) => {
		if (!rowData) return;

		// 요청서류명 가져오기
		const cdNm = getCommonCodebyCd('COP_FILE_GUBUN', reqDoc)?.cdNm || '';

		// 요청 정보 설정
		setReqTempReport({
			reqNo: rowData.reqNo || '',
			reqDoc: reqDoc || '',
			serialKey: rowData.serialKey || '',
			deliveryDt: rowData.other01 || '',
			custKey: rowData.custKey || '',
			custNm: rowData.custName || '',
			dcCode: rowData.dcCode || '',
			cdNm: cdNm,
			targetTab: 'detail',
		});

		// 온도기록모니터링 페이지로 이동
		showConfirm(null, '온도기록 정보 등록 화면으로 이동하시겠습니까?', () => {
			moveMenu('/tm/TmTempMonitor', {});
		});
	};

	/**
	 * 저장
	 * @returns {void}
	 */
	const saveMasterList = () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = gridRef.current.getChangedData({ validationYn: false });

		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		if (!gridRef.current.validateRequiredGridData()) return;

		// 저장 실행
		// showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
		gridRef.current.showConfirmSave(() => {
			apiPostSaveMasterList(updatedItems).then(res => {
				gridRef.current.getCheckedRowItems().map((item: any, index: any) => {
					gridRef.current.setCellValue(item.rowIndex, 'rowStatus', 'R');
				});
				gridRef.current.setAllCheckedRows(false);
				gridRef.current.resetUpdatedItems();

				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});
				}
			});
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList,
			},
		],
	};

	//파일업로드 팝업 열기
	const onClickFileUploader = (item: any) => {
		fileUploadModal.current.handlerOpen();
		// setAttchFileGrpNo(item.ATTCH_FILE_GRP_NO);
		return;
	};

	//파일업로드 팝업 닫기
	const uploadPopCloseEvent = () => {
		fileUploadModal.current.handlerClose();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
		}
	}, [props.data]);

	return (
		<>
			<style>{`
				.disabled-link a {
					color: inherit !important;
					text-decoration: none !important;
					cursor: default !important;
					pointer-events: none !important;
				}
			`}</style>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={props.totalCnt} position={'postfix'} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			{/* 센터서류 파일업로드 */}
			<CustomModal ref={fileUploadModal} width="1084px">
				<MsCenterDocFileUploadPopup
					ref={fileUploadModal}
					paramAttchFileGrpNo={attchFileGrpNo}
					popUpParams={popUpParams}
					callBack={uploadPopCloseEvent}
				/>
			</CustomModal>
		</>
	);
});

export default MsCenterDocDetail;
