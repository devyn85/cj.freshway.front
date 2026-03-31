/*
 ############################################################################
 # FiledataField    : KpKxCloseT08Detail.tsx
 # Description      : KX 실적 미수신 상세 조회 컴포넌트
 # Author           : 
 # Since            : 26.02.11
 #
 # ■ 주요 기능
 # --------------------------------------------------
 # 1. KX 실적 미수신 상세 조회 및 처리
 #    - 오더강제결품: 미수신 주문을 강제 결품 처리
 #    - KX메일링: 담당자에게 미수신 현황 메일 발송
 #
 # ■ 주요 함수
 # --------------------------------------------------
 # - saveOrderClear()           : 오더강제결품 처리
 # - openKxEmailPopup()         : KX메일 팝업 열기
 # - closeKxEmailPopup()        : KX메일 팝업 닫기
 #
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';
import KpKxCloseT08PopupEmail from '@/components/kp/kxClose/KpKxCloseT08PopupEmail';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';

// API
import { apiGetKxAcceptYn, apiSaveOrderClear } from '@/api/kp/apiKpKxClose';

// util
import GridAutoHeight from '@/components/common/GridAutoHeight';
import dayjs from 'dayjs';
import styled from 'styled-components';

const KpKxCloseT08Detail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { setActiveTabKey, setSelectedEvent } = props;
	const { t } = useTranslation();
	const [emailPopupDetailData, setEmailPopupDetailData] = useState<any[]>([]);
	const [emailPopupReceiverData, setEmailPopupReceiverData] = useState<any[]>([]);

	// Declare react Ref(2/4)
	ref.gridRef = useRef<any>(null);
	const refEmailModal = useRef(null);

	// Declare init value(3/4)

	// 기타(4/4)

	// 그리드 컬럼 정의
	const gridCol = [
		{ dataField: 'doctype', headerText: '문서구분', width: 80, dataType: 'text', cellMerge: true }, // 문서구분
		{ dataField: 'deliverydate', headerText: '입/출고일자', width: 80, dataType: 'date', cellMerge: true }, // 입/출고일자
		{ dataField: 'docno', headerText: t('lbl.DOCNO'), width: 80, dataType: 'text', cellMerge: true }, // 문서번호
		{ dataField: 'docline', headerText: '항목번호', width: 80, dataType: 'text' }, // 항목번호
		{ dataField: 'sku', headerText: t('lbl.SKU'), width: 80, dataType: 'code' }, // 상품코드
		{
			dataField: 'openqty',
			headerText: t('lbl.OPENQTY'),
			width: 75,
			dataType: 'numeric',
			formatString: '#,##0.##',
		}, // 미결량
		{
			dataField: 'confirmqty',
			headerText: t('lbl.CONFIRMQTY'),
			width: 75,
			dataType: 'numeric',
			formatString: '#,##0.##',
		}, // 확정수량
		{ dataField: 'organize', headerText: t('lbl.ORGANIZE'), width: 75, dataType: 'code' }, // 창고
		{ dataField: 'etcTxt', headerText: '비고', width: 75, dataType: 'text' }, // 비고
		{ dataField: 'ifCfmYn', headerText: '실적수신여부', width: 75, dataType: 'text' }, // 실적수신여부
		{ dataField: 'kxAcceptYn', headerText: 'KX접수여부', width: 75, dataType: 'code' }, // KX접수여부
		{ dataField: 'adddate', headerText: '등록일', width: 75, dataType: 'date' }, // 등록일
		{ dataField: 'rcvrEmail', headerText: '수신자이메일', width: 75, dataType: 'text' }, // 수신자이메일
		{ dataField: 'rcvrNm', headerText: '수신자', width: 75, dataType: 'text' }, // 수신자
	];

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/** 오더강제결품 저장 */
	const saveOrderClear = () => {
		const checkedItems = ref.gridRef.current.getCheckedRowItems();

		if (checkedItems.length === 0) {
			showMessage({
				content: t('msg.MSG_COM_VAL_061'), // 체크된 항목이 없습니다.
				modalType: 'info',
			});
			return;
		}

		// 저장하시겠습니까? - 오더강제결품
		showConfirm(null, t('msg.confirmSave'), () => {
			const saveData = checkedItems.map((row: any) => row.item);
			const formData = props.form?.getFieldsValue?.() ?? {};
			const [fromDate, toDate] = formData?.deliveryDateRange ?? [];
			const params = {
				avc_COMMAND: 'KX_ORDERCLEAR',
				saveList8: saveData,
				deliverydateFrom: fromDate ? dayjs(fromDate).format('YYYYMMDD') : '',
				deliverydateTo: toDate ? dayjs(toDate).format('YYYYMMDD') : '',
				sku: formData?.sku ?? '',
				docno: formData?.docno ?? '',
			};

			apiSaveOrderClear(params).then(res => {
				if (res.statusCode === 0) {
					showAlert(null, t('msg.save1')); // 저장되었습니다
					props.search();
				}
			});
		});
	};

	// KX메일 팝업 열기
	const openKxEmailPopup = () => {
		const checkedItems = ref.gridRef.current?.getCheckedRowItems?.() ?? [];
		if (checkedItems.length === 0) {
			showMessage({
				content: t('msg.MSG_COM_VAL_061'), // 체크된 항목이 없습니다.
				modalType: 'info',
			});
			return;
		}

		const detailData = checkedItems.map((row: any) => row.item ?? row);
		const receiverMap = new Map<string, { rcvrNm: string; rcvrEmail: string }>();
		detailData.forEach((item: any) => {
			const rcvrEmail = item.rcvrEmail ?? '';
			const rcvrNm = item.rcvrNm ?? '';
			if (rcvrEmail || rcvrNm) {
				const key = `${rcvrEmail}|${rcvrNm}`;
				if (!receiverMap.has(key)) {
					receiverMap.set(key, { rcvrNm, rcvrEmail });
				}
			}
		});

		setEmailPopupDetailData(detailData);
		setEmailPopupReceiverData(Array.from(receiverMap.values()));
		refEmailModal.current?.handlerOpen();
	};

	// KX메일 팝업 닫기
	const closeKxEmailPopup = () => {
		refEmailModal.current?.handlerClose();
	};

	// 그리드 속성 설정
	const gridProps = {
		showCustomRowCheckColumn: true,
		editable: false,
		enableCellMerge: true,
	};

	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef,
		btnArr: [
			{
				btnType: 'btn1',
				btnLabel: '오더강제결품',
				callBackFn: saveOrderClear,
			},
			{
				btnType: 'btn2',
				btnLabel: 'KX메일링',
				callBackFn: openKxEmailPopup,
			},
		],
	};

	const initEvent = () => {
		ref.gridRef.current.bind('cellDoubleClick', async (event: any) => {
			//문서내역으로 이동
			if (['docno'].includes(event.dataField)) {
				setSelectedEvent({ docno: event.item.docno });
				setActiveTabKey('3');
			}

			//디비링크 -> api
			if (['kxAcceptYn'].includes(event.dataField)) {
				const params = {
					docno: event.item.docno,
					sku: event.item.sku,
					docline: event.item.docline,
				};

				const { statusMessage } = await apiGetKxAcceptYn(params);
				ref.gridRef.current?.setCellValue(event.rowIndex, 'kxAcceptYn', statusMessage);
			}
		});
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		initEvent();
	}, []);

	// grid data 변경 감지
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
			<CustomAGrid className="contain-wrap">
				<GridTopBtn gridBtn={gridBtn} gridTitle="실적미수신" totalCnt={props.totalCnt} />
			</CustomAGrid>
			<GridAutoHeight>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</GridAutoHeight>
			<CustomModal ref={refEmailModal} width="800px">
				<KpKxCloseT08PopupEmail
					close={closeKxEmailPopup}
					receiverData={emailPopupReceiverData}
					detailData={emailPopupDetailData}
				/>
			</CustomModal>
		</>
	);
});

export default KpKxCloseT08Detail;

const CustomAGrid = styled(AGrid)`
	height: auto;
	padding: 10px 0;
	margin-bottom: 0;
`;
