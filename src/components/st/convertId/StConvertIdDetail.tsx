/*
 ############################################################################
 # FiledataField	: StConvertIdDetail.tsx
 # Description		: 재고 > 재고현황 > PLT-ID변경(Detail)
 # Author			: Canal Frame
 # Since			: 25.08.04
 ############################################################################
*/

//Api

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { v4 as uuidv4 } from 'uuid';
// Utils
//types
import { GridBtnPropsType } from '@/types/common';
// API Call Function
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import InputText from '@/components/common/custom/form/InputText';
import SelectBox from '@/components/common/custom/form/SelectBox';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import { Form } from 'antd';
const StConvertIdDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { formRef } = props; // Antd Form
	ref.gridRef = useRef();
	const gridId = uuidv4() + '_gridWrap';
	const user = useAppSelector(state => state.user.userInfo); // 사용자 정보 가져오기
	const globalVariable = useAppSelector(state => state.global.globalVariable); // 전역 변수
	const [dsExpedit, setDsExpedit] = useState<any[]>([]); // EXPEDIT 권한 데이터 상태 추가
	const [loopTrParams, setLoopTrParams] = useState({});

	// Declare react Ref(2/4)
	const lottable01Ref = useRef<any>(null);
	const modalRef = useRef(null);

	// Declare init value(3/4)

	//그리드 Props
	const gridProps = {
		editable: true,
		fillColumnSizeMode: false, // 자동 컬럼 크기 조정 비활성화
		enableFilter: true,
		showFooter: true,
		groupingFields: [] as string[], // 로케이션/상품별 합계 표시 여부
		// 합계(소계) 설정
		groupingSummary: {
			dataFields: ['qty', 'openqty', 'qtyallocated', 'qtypicked'],
		},
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true, //체크박스 스페이스 일괄적용 2026-01-19
		// 최초 보여질 때 모두 열린 상태로 출력 여부
		displayTreeOpen: false,
		// 그룹핑 후 셀 병합 실행
		enableCellMerge: true,
		// enableCellMerge 할 때 실제로 rowspan 적용 시킬지 여부
		// 만약 false 설정하면 실제 병합은 하지 않고(rowspan 적용 시키지 않고) 최상단에 값만 출력 시킵니다.
		cellMergeRowSpan: false,
		// 브랜치에 해당되는 행을 출력 여부
		showBranchOnGrouping: false,
		// 그리드 ROW 스타일 함수 정의
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (item._$isGroupSumField) {
				// 그룹핑으로 만들어진 합계 필드인지 여부
				// 그룹핑을 더 많은 필드로 하여 depth 가 많아진 경우는 그에 맞게 스타일을 정의하십시오.
				// 현재 3개의 스타일이 기본으로 정의됨.(AUIGrid_style.css)
				switch (
					item._$depth // 계층형의 depth 비교 연산
				) {
					case 2:
						return 'aui-grid-row-depth1-style';
					case 3:
						return 'aui-grid-row-depth2-style';
					case 4:
						return 'aui-grid-row-depth3-style';
					default:
						return 'aui-grid-row-depth-default-style';
				}
			}
		}, // end of rowStyleFunction
	};

	// 그리드 컬럼 세팅
	const gridCol = [
		{ dataField: 'dccode', headerText: t('lbl.DCCODE'), width: 80, dataType: 'code', editable: false }, // 물류센터
		{ dataField: 'organize', headerText: t('lbl.ORGANIZE'), width: 80, dataType: 'code', editable: false }, // 창고
		{ dataField: 'stockgradename', headerText: t('lbl.STOCKGRADE'), width: 80, dataType: 'code', editable: false }, // 재고속성
		{
			headerText: t('lbl.SKUINFO'),
			width: 320, // 상품정보
			children: [
				{ dataField: 'skugroup', headerText: t('lbl.SKUGROUP'), width: 80, dataType: 'code', editable: false }, // 상품분류
				{
					dataField: 'sku',
					headerText: t('lbl.SKU'),
					width: 80,
					editable: false,
					filter: { showIcon: true },
					dataType: 'code',
					commRenderer: {
						type: 'popup',
						onClick: function (e: any) {
							ref.gridRef.current.openPopup(e.item, 'sku');
						},
					},
				}, // 상품코드
				{
					dataField: 'skuname',
					headerText: t('lbl.SKUNAME'),
					width: 120,
					editable: false,
					dataType: 'name',
					filter: { showIcon: true },
				}, // 상품명
			],
		},
		{ dataField: 'fromLoc', headerText: t('lbl.LOC'), width: 80, dataType: 'code', editable: false }, // LOC
		{ dataField: 'uom', headerText: t('lbl.UOM_ST'), width: 80, dataType: 'code', editable: false }, // 이체단위
		{
			headerText: t('lbl.QTYINFO'),
			width: 400, // 수량정보
			children: [
				{
					dataField: 'qty',
					headerText: t('lbl.QTY_ST'),
					width: 80,
					dataType: 'number',
					style: 'right',
					editable: false,
				}, // 수량
				{
					dataField: 'openqty',
					headerText: t('lbl.OPENQTY_ST'),
					width: 80,
					dataType: 'number',
					style: 'right',
					editable: false,
				}, // 가용재고수량
				{
					dataField: 'qtyallocated',
					headerText: t('lbl.QTYALLOCATED_ST'),
					width: 80,
					dataType: 'number',
					style: 'right',
					editable: false,
				}, // 재고할당수량
				{
					dataField: 'qtypicked',
					headerText: t('lbl.QTYPICKED_ST'),
					width: 80,
					dataType: 'number',
					style: 'right',
					editable: false,
				}, // 피킹재고
				{
					dataField: 'tranqty',
					headerText: t('lbl.TRANQTY'),
					width: 80,
					dataType: 'number',
					style: 'right',
					editable: true,
				}, // 작업수량
			],
		},
		{
			dataField: 'neardurationyn',
			headerText: t('lbl.NEARDURATIONYN'),
			width: 80,
			editable: false,
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		}, // 소비임박여부
		// START.제조일자/소비일자/유효기간/소비기한잔여(%)
		{
			headerText: t('lbl.MANUFACTUREDT'), // 제조일자
			dataField: 'manufacturedt',
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			headerText: t('lbl.EXPIREDT'), // 소비일자
			dataField: 'expiredt',
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		},
		{
			dataField: 'durationTerm',
			headerText: t('lbl.DURATION_TERM'),
			width: 80,
			editable: false,
			dataType: 'code',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				return commUtil.gfnDurationColor(item?.lottable01, item?.duration, item?.durationtype, '');
			},
		}, // 소비기간(잔여/전체)
		{ dataField: 'fromStockid', headerText: t('lbl.FROM_STOCKID'), width: 80, dataType: 'code', editable: false }, // 재고ID
	];

	// 그리드 footer - 합계 설정
	const footerLayout = [
		{
			labelText: t('lbl.TOTAL'), // 합계
			positionField: gridCol[0].dataField, // 체크여부
		},
		{
			dataField: 'qty',
			positionField: 'qty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 수량
		{
			dataField: 'openqty',
			positionField: 'openqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 가용재고수량
		{
			dataField: 'qtyallocated',
			positionField: 'qtyallocated',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 재고할당수량
		{
			dataField: 'qtypicked',
			positionField: 'qtypicked',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 피킹재고
		{
			dataField: 'tranqty',
			positionField: 'tranqty',
			operation: 'SUM',
			formatString: '#,##0.##',
			style: 'right',
		}, // 작업수량
	];

	/**
	 * =====================================================================
	 * 02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * 저장
	 */
	const saveMasterList = async () => {
		const gridRef = ref.gridRef.current; // 그리드

		// const menus = gridRef.getChangedData();
		// if (!menus || menus.length < 1) {
		// 	showAlert(null, t('msg.noChange')); // 변경사항이 없습니다.
		// 	return;
		// }

		if (gridRef.getCheckedRowItemsAll().length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		const isValid = await validateForm(formRef);
		if (!isValid) {
			return;
		}

		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			const params = {
				apiUrl: '/api/st/convertId/v1.0/saveMasterList',
				avc_COMMAND: 'CONFIRM',
				converttype: 'CI', // ID변경유형(CI:PLT-ID, CL:LOT-ID)
				toStockid: formRef.getFieldValue('stockid'), // 재고ID
				reasoncode: formRef.getFieldValue('reasoncode'), // 사유코드
				reasonmsg: formRef.getFieldValue('reasonmsg'), // 사유메시지
				//
				dataKey: 'saveList',
				saveDataList: gridRef.getCheckedRowItemsAll(), // 선택된 행의 데이터
			};

			setLoopTrParams(params);
			modalRef.current.handlerOpen();

			// apiPostSaveMasterList(params).then(res => {
			// 	if (res.statusCode > -1) {
			// 		showAlert(null, t('msg.save1')); // 저장되었습니다
			// 	}
			// });
		});
	};

	/**
	 * 저장 - 구현
	 * @param {object} params - 저장할 파라미터 객체
	 * @returns {Promise<any>} Axios response data
	 */
	// const apiPostSaveMasterList = (params: any) => {
	// 	return axios.post('/api/st/convertLot/v1.0/saveMasterList', params).then(res => res.data);
	// };

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef,
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList,
			},
		],
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		modalRef.current.handlerClose();
		props.search();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	// 화면 초기 세팅
	useEffect(() => {
		try {
			const codeList = getCommonCodeList('EXP_DATE_EDIT'); // 유통기한변경가능자확인
			//console.log(('codeList', codeList);
			if (codeList) {
				setDsExpedit(codeList || []);
			}
		} catch (error) {
			setDsExpedit([]);
		}
	}, []);

	// 그리드 초기 데이터 세팅
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
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} gridBtn={gridBtn}>
					<Form form={formRef} layout="inline">
						{/* 사유코드 */}
						<SelectBox
							name="reasoncode"
							label={t('lbl.REASONCODE')} /*사유코드*/
							options={getCommonCodeList('REASONCODE_CI', t('lbl.SELECT'))}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							span={20}
							required
							rules={[{ required: true, validateTrigger: 'none' }]}
							className="bg-white"
							style={{ width: '200px' }}
							initval={getCommonCodeList('REASONCODE_CI', t('lbl.SELECT'))?.[0]?.comCd}
						/>
						<InputText
							name="reasonmsg"
							className="bg-white"
							span={20}
							required
							style={{ width: '300px', marginLeft: '-10px' }}
							placeholder={t('msg.placeholder1', [t('lbl.REASONMSG')])}
							rules={[{ required: true, message: t('msg.placeholder1', [t('lbl.REASONMSG')]) }]} /*사유메세지*/
						/>
						{/* 재고ID */}
						<InputText
							label={t('lbl.FROM_STOCKID')} // 재고ID
							name="stockid"
							onPressEnter={null}
							required
							rules={[{ required: true, message: '재고ID를 입력해주세요.' }]}
							className="bg-white"
						/>

						<CustomModal ref={modalRef} width="1000px">
							<CmLoopTranPopup popupParams={loopTrParams} close={closeEvent} />
						</CustomModal>
					</Form>
				</GridTopBtn>

				<AUIGrid
					ref={ref.gridRef}
					name={gridId}
					columnLayout={gridCol}
					gridProps={gridProps}
					footerLayout={footerLayout}
				/>
			</AGrid>
		</>
	);
});
export default StConvertIdDetail;
