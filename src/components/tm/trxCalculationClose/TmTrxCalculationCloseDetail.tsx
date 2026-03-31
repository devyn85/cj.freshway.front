/*
 ############################################################################
 # FiledataField	: TmTrxCalculationCloseDetail.tsx
 # Description		: 운송비정산마감
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 26.02.04
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CmSearchWrapper from '@/components/cm/popup/CmSearchWrapper';
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';

//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
// Utils

// API Call Function

//types
import { GridBtnPropsType } from '@/types/common';

//store
import { apiPostSaveClosing } from '@/api/tm/apiTmTrxCalculationClose';
import { getCommonCodeList } from '@/store/core/comCodeStore';

const TmTrxCalculationCloseDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const { t } = useTranslation();
	const gridId = uuidv4() + '_gridWrap';

	//
	const refModal = useRef(null);

	// 트랜잭션 팝업 Ref
	const refTranModal = useRef(null);

	// loop transaction params
	const [loopTrParams, setLoopTrParams] = useState({});

	// transaction 처리 건수
	const [trProcessCnt, setTrProcessCnt] = useState({});

	// 기준년월 조회조건
	const dccode = Form.useWatch('dcCode', props.form);

	// 물류센터 조회조건
	const sttlYm = Form.useWatch('sttlYm', props.form);

	/**
	 * 공통 코드 호출([comCd]cdNm)
	 * @param owIndex
	 * @param columnIndex
	 * @param value
	 * @returns
	 */
	const getCustomCommonCodeList = (owIndex: any, columnIndex: any, value: any) => {
		const list = getCommonCodeList('WMS_MNG_DC', '공통', 'STD');
		const convert = list.map(item => ({
			...item,
			display: item.comCd && item.comCd !== 'STD' ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
		}));
		let result = null;
		if (!commUtil.isEmpty(convert)) {
			result = convert.find((el: any) => {
				if (el.comCd === value) {
					return el;
				}
			});
		}
		return result ? result.display : null;
	};

	const gridCol = [
		{
			dataField: 'sttlYm',
			headerText: t('lbl.CLOSEMONTH'), // 마감월
			width: 90,
			editable: false,
			dataType: 'code',
			labelFunction: (rowIndex: any, colIndex: any, value: any, headerText: any, item: any) => {
				// value: '202504'
				if (!value || value.length !== 6) return value;
				return `${value.slice(0, 4)}-${value.slice(4, 6)}`;
			},
		},
		{
			dataField: 'dcCode',
			headerText: t('lbl.DCCODE'), // 물류센터
			width: 200,
			dataType: 'code',
			editable: false,
			labelFunction: getCustomCommonCodeList,
		},
		{
			dataField: 'courierName',
			headerText: t('lbl.CARRIER'), // 운송사
			width: 200,
			editable: false,
			dataType: 'text',
		},
		{
			dataField: 'closeYn',
			headerText: t('lbl.CLOSEYN'), // 마감여부
			width: 90,
			editable: false,
			dataType: 'code',
		},
		{
			dataField: 'editwhoname',
			headerText: t('lbl.EDITWHO'), // 수정자
			width: 90,
			dataType: 'manager',
			managerDataField: 'editwho',
			editable: false,
		},
		{ dataField: 'editdate', headerText: t('lbl.EDITDATE'), dataType: 'date', editable: false },
		{
			dataField: 'closeAction',
			headerText: t('lbl.ACCOUNTS_N_CANCEL'), // '마감/취소',
			width: 150,
			type: 'code',
			renderer: {
				type: 'ButtonRenderer',
				onClick: function (event: any) {
					// API 실행
					showConfirm(null, t('msg.KP_CLOSE_MSG_002'), () => {
						// 파라미터에 처리 대상 설정
						const params = {
							avc_COMMAND: 'CLOSE_MONTHLY',
							dcCode: event.item.dcCode,
							sttlYm: event.item.sttlYm,
							courier: event.item.courier,
							closeYn: event.item.closeYn === 'N' ? 'Y' : 'N',
						};
						apiPostSaveClosing(params).then(res => {
							if (res.statusCode === 0) {
								showMessage({
									content: t('msg.MSG_COM_SUC_009'),
									modalType: 'info',
								});
								props.fnCallBack();
							}
						});
					});
				},
			},

			labelFunction: (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) => {
				if (item.btnFlag === 'N') return '';
				return item.closeYn === 'Y' ? t('lbl.ACCOUNTS_CANCEL') : t('lbl.ACCOUNTS_EXECUTE');
			},
		},
	];

	const gridProps = {
		editable: false,
	};
	const footerLayout = [{}];

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * 운송비정산 저장
	 */
	const saveMasterList = async () => {
		// 입력 값 검증
		const isValid = await validateForm(props.form);
		if (!isValid) {
			return;
		}

		const checkedItems: any[] = [];

		// 조회조건의 기준 월의 1일부터 말일까지의 날짜를 YYYYMMDD 형식으로 저장
		// sttlYm (YYYYMM 형식)
		const today = dayjs(sttlYm, 'YYYYMM');
		const startOfMonth = today.startOf('month');
		const endOfMonth = today.endOf('month');
		let current = startOfMonth;
		while (current.isSameOrBefore(endOfMonth)) {
			checkedItems.push({
				avc_DCCODE: dccode,
				avc_COMMAND: 'CALCULATION',
				dcCode: dccode,
				deliverydate: current.format('YYYYMMDD'),
			});
			current = current.add(1, 'day');
		}

		showConfirm(null, t('msg.MSG_COM_CFM_025'), () => {
			loopTransaction(checkedItems);
		});

		// showConfirm(null, t('msg.MSG_COM_CFM_025'), () => {
		// 	// 파라미터에 처리 대상 설정
		// 	const params = {
		// 		avc_DCCODE: props.form.getFieldValue('fixdccode'),
		// 		avc_COMMAND: 'CALCULATION',
		// 		fixdccode: props.form.getFieldValue('fixdccode'),
		// 		deliverydate: props.form.getFieldValue('deliverydate').format('YYYYMMDD'),
		// 	};

		// 	apiPostSaveCalculation(params).then(res => {
		// 		if (res.statusCode === 0) {
		// 			showMessage({
		// 				content: t('msg.MSG_COM_SUC_009'),
		// 				modalType: 'info',
		// 			});
		// 			props.callBackFn?.();
		// 		}
		// 	});
		// });
	};

	/**
	 * 연쇄 트랜잭션 호출 함수
	 * @param {any} rowItems 전송 대상
	 * @param {number} index 현재 순번
	 * @param {number} total 전체 대상 건수
	 */
	const loopTransaction = (rowItems: any) => {
		const saveParams = {
			apiUrl: '/api/tm/trxCalculationClose/v1.0/saveCalculation',
			avc_DCCODE: dccode,
			avc_COMMAND: 'CALCULATION',
			saveDataList: rowItems,
		};

		setLoopTrParams(saveParams);
		refTranModal.current.handlerOpen();
	};

	/**
	 * 트랜잭션 팝업 닫기
	 */
	const closeEventTranPopup = () => {
		refTranModal.current.handlerClose();

		if (trProcessCnt) {
			if (trProcessCnt.total === trProcessCnt?.success) {
				props.callBackFn?.();
			}
		}
	};

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1', // 월정산
				callBackFn: saveMasterList,
			},
		],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);

			gridRefCur?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);
	return (
		<>
			{/* 그리드 영역 정의 */}
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} gridBtn={gridBtn} />
				<AUIGrid
					ref={ref.gridRef}
					name={gridId}
					columnLayout={gridCol}
					gridProps={gridProps}
					footerLayout={footerLayout}
				/>
			</AGrid>
			<CmSearchWrapper ref={refModal} />

			{/* 트랜잭션 팝업 영역 정의 */}
			<CustomModal ref={refTranModal} width="1000px">
				<CmLoopTranPopup
					popupParams={loopTrParams}
					close={closeEventTranPopup}
					onResultChange={(success: number, fail: number, total: number) => {
						const tr = { total: total, success: success, fail: fail };
						setTrProcessCnt(tr);
					}}
				/>
			</CustomModal>
		</>
	);
});
export default TmTrxCalculationCloseDetail;
