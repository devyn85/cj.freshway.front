/*
 ############################################################################
 # FiledataField	: StConvertLotExDCDetail.tsx
 # Description		: 외부비축소비기한변경
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.06.16
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';
import dayjs from 'dayjs';

// Utils
import { validateForm } from '@/util/FormUtil';
import { showAlert, showMessage } from '@/util/MessageUtil';
import commUtil from '@/util/commUtil';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store

// Component
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputText, SelectBox } from '@/components/common/custom/form';
import { getCommonCodeList } from '@/store/core/comCodeStore';

// API

interface StConvertLotExDCDetailProps {
	dccode: any;
	gridData: any;
	totalCount: any;
	search: any;
}

const StConvertLotExDCDetail = forwardRef((props: StConvertLotExDCDetailProps, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const [form] = Form.useForm();

	// 그리드 표시된 데이터 건수
	const [currentCount, setCurrentCount] = useState(0);

	// grid Ref
	ref.gridRef = useRef();

	// 트랜잭션 팝업 Ref
	const refTranModal = useRef(null);

	// loop transaction params
	const [loopTrParams, setLoopTrParams] = useState({});

	// transaction 처리 건수
	const [trProcessCnt, setTrProcessCnt] = useState({});

	const [initialValues] = useState({
		reasoncode: '2', //유통기한 입력오류(입고)
	});

	// 그리드 컬럼 설정
	const gridCol = [
		{
			dataField: 'organize',
			headerText: t('lbl.ORGANIZE'), //창고
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'stockgradename',
			headerText: t('lbl.STOCKGRADE'), //재고속성
			editable: false,
			dataType: 'code',
		},

		{
			headerText: t('lbl.SKUINFO'), //상품정보
			children: [
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'), //상품코드
					dataType: 'code',
					editable: false,
					filter: {
						showIcon: true,
					},
				},
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNM'), //상품명
					editable: false,
					filter: {
						showIcon: true,
					},
				},
			],
		},
		{
			dataField: 'uom',
			headerText: t('lbl.UOM'), //단위
			dataType: 'code',
			editable: false,
		},
		{
			headerText: t('lbl.QTYINFO'), //수량정보
			children: [
				{
					dataField: 'qty',
					headerText: t('lbl.QTY_ST'), //현재고수량
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
				{
					dataField: 'openqty',
					headerText: t('lbl.OPENQTY_ST'), //가용재고수량
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
				{
					dataField: 'qtyallocated',
					headerText: t('lbl.QTYALLOCATED_ST'), //재고할당수량
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
				{
					dataField: 'qtypicked',
					headerText: t('lbl.QTYPICKED_ST'), //피킹재고
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				},
				{
					dataField: 'tranqty',
					headerText: t('lbl.TRANQTY'), //작업수량
					dataType: 'numeric',
					editable: true,
					formatString: '#,##0.###',
				},
			],
		},
		{
			headerText: t('lbl.CALSTOCK'), //환산재고
			children: [
				{
					dataField: 'avgweight',
					headerText: t('lbl.AVGWEIGHT'), //평균중량
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'calbox',
					headerText: t('lbl.CALBOX'), //환산박스
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'realcfmbox',
					headerText: t('lbl.REALBOX'), //실박스
					dataType: 'numeric',
					editable: false,
				},
				{
					dataField: 'tranbox',
					headerText: t('lbl.TRANBOXQTY'), //작업박스수량
					dataType: 'numeric',
					editable: true,
				},
			],
		},
		{
			headerText: t('lbl.LOTINFO'), //로트정보
			children: [
				{
					dataField: 'usebydateFreeRt',
					headerText: t('lbl.USEBYDATE_FREE_RT'), //소비기한잔여(%)
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0',
				},
				{
					dataField: 'fromLottable01',
					headerText: t('lbl.LOTTABLE01'), //기준일(유통,제조)
					dataType: 'code',
					editable: false,
					labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
						return commUtil.isEmpty(value) || value === 'STD' ? 'STD' : dayjs(value).format('YYYY-MM-DD') ?? '';
					},
				},
				{
					dataField: 'durationTerm',
					headerText: t('lbl.DURATION_TERM2'), //소비기간(잔여/전체)
					dataType: 'code',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.SERIALINFO'), //상품이력정보
			children: [
				{
					dataField: 'serialno',
					headerText: t('lbl.SERIALNO'), //이력번호
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'barcode',
					headerText: t('lbl.BARCODE'), //바코드
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'convserialno',
					headerText: t('lbl.BLNO'), //B/L번호
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'contracttype',
					headerText: t('lbl.CONTRACTTYPE'), //계약유형
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'contractcompany',
					headerText: t('lbl.CONTRACTCOMPANY'), //계약업체
					dataType: 'code',
					editable: false,
				},
				{
					dataField: 'contractcompanyname',
					headerText: t('lbl.CONTRACTCOMPANYNAME'), //계약업체명
					editable: false,
				},
				{
					dataField: 'fromvaliddt',
					headerText: t('lbl.FROMVALIDDT'), //유효일자(FROM)
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
					editable: false,
				},
				{
					dataField: 'tovaliddt',
					headerText: t('lbl.TOVALIDDT'), //유효일자(TO)
					dataType: 'date',
					formatString: 'yyyy-mm-dd',
					editable: false,
				},
			],
		},
		{
			dataField: 'editwhoNm',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager',
			managerDataField: 'editwho',
			editable: false,
		},
		{
			dataField: 'editdate',
			headerText: t('lbl.EDITDATE'),
			dataType: 'date',
			editable: false,
		},
		{
			dataField: 'serialkey',
			headerText: '',
			visible: false,
		},
		{
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'), //물류센터
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{
			dataField: 'addwho',
			visible: false,
		},
		{
			dataField: 'addwhoNm',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager',
			managerDataField: 'addwho',
			editable: false,
			visible: false,
		},
		{
			dataField: 'adddate',
			headerText: t('lbl.ADDDATE'),
			dataType: 'date',
			editable: false,
			visible: false,
		},
		{
			dataField: 'editwho',
			visible: false,
		},
		{
			dataField: 'skugroup',
			headerText: t('lbl.SKUGROUP'), //상품분류
			editable: false,
			visible: false,
		},
		{
			dataField: 'fromLoc',
			headerText: t('lbl.LOC_ST'), //로케이션
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{
			dataField: 'boxflag',
			visible: false,
		},
		{
			dataField: 'storerkey',
			visible: false,
		},
		{
			dataField: 'fromStockgrade',
			visible: false,
		},

		{
			dataField: 'duration',
			visible: false,
		},

		{
			dataField: 'durationtype',
			visible: false,
		},
		{
			dataField: 'butcherydt',
			headerText: t('lbl.BUTCHERYDT'), //도축일자
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			editable: false,
			visible: false,
		},
		{
			dataField: 'factoryname',
			headerText: t('lbl.FACTORYNAME'), //도축장
			dataType: 'string',
			editable: false,
			visible: false,
		},
		{
			dataField: 'fromLot',
			headerText: t('lbl.LOT'), //로트
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{
			dataField: 'fromStockid',
			headerText: t('lbl.TO_STOCKID'), //재고ID
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{
			dataField: 'fromStocktypedescr',
			headerText: t('lbl.TO_STOCKTYPE'), //재고위치
			dataType: 'code',
			editable: false,
			visible: false,
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		enableFilter: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 공통코드 사유코드 목록을 조회한다.
	 * @returns
	 */
	const getReasonCodeList = () => {
		return getCommonCodeList('REASONCODE_CL').filter((v: any) => v.comCd === '2');
	};

	/**
	 * 선택된 행의 데이터를 기반으로 특정 칼럼의 값을 계산한다.
	 * @param {any} event 이벤트
	 */
	const calculateColumnValue = (event: any) => {
		const rowIndex = event.rowIndex;

		if (event.dataField === 'tranqty') {
			if (commUtil.isEmpty(event.value) || event.value === 0) {
				ref.gridRef.current.setCellValue(rowIndex, 'tranqty', 0);
				ref.gridRef.current.setCellValue(rowIndex, 'tranbox', 0);
			} else if (!commUtil.isEmpty(event.item.avgweight) && event.item.avgweight !== 0) {
				if (event.item.boxflag === 'Y' && event.item.avgweight > 0) {
					ref.gridRef.current.setCellValue(rowIndex, 'tranbox', Math.round(event.value / event.item.avgweight));
				}

				if (event.value > 0 && event.value / event.item.avgweight < 1) {
					ref.gridRef.current.setCellValue(rowIndex, 'tranbox', 1);
				}

				if (event.value < 0 && event.value / event.item.avgweight > -1) {
					ref.gridRef.current.setCellValue(rowIndex, 'tranbox', -1);
				}
			}
		}

		if (event.dataField === 'tranbox') {
			if (commUtil.isEmpty(event.value) || event.value === 0) {
				ref.gridRef.current.setCellValue(rowIndex, 'tranbox', 0);
			}
		}
	};

	/**
	 * 그리드에서 변경된 데이터를 확인하고, 유효성 검사를 거쳐 저장을 진행합니다.
	 * 저장 후 재 조회 실행.
	 * @param {any} rowItems 저장할 그리드 행
	 * @param {any} info 저장할 사유 정보
	 */
	const saveMasterList = async () => {
		// 필수 입력 값 검증
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = ref.gridRef.current.getCheckedRowItemsAll();

		if (!updatedItems || updatedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		// 그리드 입력 값 검증
		for (const item of updatedItems) {
			const durationtype = item.durationtype;

			if (commUtil.isEmpty(item.duration)) {
				continue;
			}

			const lottable01 = form.getFieldValue('lottable01');
			const year = lottable01.substring(0, 4);
			const month = lottable01.substring(4, 6);
			const day = lottable01.substring(6, 8);
			const lotDate = new Date(`${year}-${month}-${day}`); // 기준일 (문자열 → Date 변환)
			const duration = Number(item.duration); // 유통기간 (숫자 변환)
			const todayDate = new Date(); // 오늘 날짜

			if (durationtype === '1') {
				// 소비기한
				const adjustedDate = new Date(lotDate);
				adjustedDate.setDate(adjustedDate.getDate() - duration);

				if (adjustedDate > todayDate || lotDate < todayDate) {
					showMessage({
						content: '법적 소비기한이 초과된 일자입니다. 수정 후 저장 부탁드립니다.',
						modalType: 'warning',
					});
					return;
				}
			} else if (durationtype === '2') {
				// 제조일자
				// LOT 날짜 + DURATION
				const endDate = new Date(lotDate);
				endDate.setDate(endDate.getDate() + duration);

				if (lotDate > todayDate || endDate < todayDate) {
					showMessage({
						content: '법적 소비기한이 초과된 일자입니다. 수정 후 저장 부탁드립니다.',
						modalType: 'warning',
					});
					return;
				}
			}

			// 비정량이고 작업수량을 입력되었을 경우 작업박스수량은 0이상이어야한다.
			if (item.boxflag === 'Y' && item.tranqty > 0 && item.tranbox === 0) {
				showMessage({
					content: '작업박스수량은 0보다 커야합니다.',
					modalType: 'warning',
				});
				return;
			}
		}

		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			loopTransaction(updatedItems, 0, updatedItems.length, form.getFieldsValue());
		});
	};

	/**
	 * 연쇄 트랜잭션 호출 함수
	 * @param {any} rowItems 전송 대상
	 * @param {number} index 현재 순번
	 * @param {number} total 전체 대상 건수
	 * @param {any} info 저장할 사유 정보
	 */
	const loopTransaction = (rowItems: any, index: number, total: number, info: any) => {
		// loop transaction
		const saveParams = {
			apiUrl: '/api/st/convertlotexdc/v1.0/saveStockConvertLot',
			avc_DCCODE: props.dccode,
			avc_COMMAND: 'CONFIRM',
			fixdccode: props.dccode,
			inReasoncode: info.reasoncode,
			inReasonmsg: info.reasonmsg,
			inLottable01: info.lottable01,
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
			if (trProcessCnt.total === trProcessCnt.success) {
				props.search?.();
			}
		}
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: ref.gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'save', // 저장
					callBackFn: saveMasterList,
				},
			],
		};

		return gridBtn;
	};

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref.gridRef.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 편집 시작
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellEditBegin', (event: any) => {
			if (event.dataField === 'tranbox') {
				if (event.item.boxflag !== 'Y') {
					return false;
				}
			}
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellEditEnd', (event: any) => {
			calculateColumnValue(event);
		});

		/**
		 * 그리드 셀 더블클릭
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current.bind('cellDoubleClick', (event: any) => {
			if (event.dataField === 'sku') {
				// 상품코드 셀 더블클릭하면 상품상세팝업 표시
				ref.gridRef.current.openPopup(event.item, 'sku');
			}
		});
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

	/**
	 * 데이터를 조회하면 그리드에 추가한다.
	 */
	useEffect(() => {
		if (ref.gridRef?.current && props.gridData) {
			ref.gridRef.current.setGridData(props.gridData);

			if (props.gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = ref.gridRef.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.gridRef.current.setColumnSizeList(colSizeList);
			}

			setCurrentCount(ref.gridRef.current.getRowCount());
		}
	}, [props.gridData, ref.gridRef]);

	return (
		<>
			{/* 그리드 영역 정의 */}
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={getGridBtn()} totalCnt={props.totalCount}>
					<Form form={form} layout="inline" initialValues={initialValues}>
						<SelectBox
							name="reasoncode"
							label={t('lbl.REASONCODE')}
							span={24}
							placeholder={t('msg.selectBox')}
							options={getReasonCodeList()}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							required
							disabled
							className="bg-white"
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
						<InputText
							name="reasonmsg"
							label={t('lbl.REASONMSG')}
							placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.REASONMSG')])}
							maxLength={40}
							showSearch
							allowClear
							required
							className="bg-white"
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
						<InputText
							name="lottable01"
							label={t('lbl.LOTTABLE01')}
							placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.LOTTABLE01')])}
							maxLength={8}
							showSearch
							allowClear
							required
							className="bg-white"
							rules={[
								{ required: true, validateTrigger: 'none' },
								{ pattern: /^\d{8,}$/, message: t('msg.MSG_COM_VAL_055', [t('lbl.LOTTABLE01')]) },
							]}
						/>
					</Form>
				</GridTopBtn>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

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

export default StConvertLotExDCDetail;
