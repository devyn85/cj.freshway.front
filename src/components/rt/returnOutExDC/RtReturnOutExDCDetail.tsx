/*
 ############################################################################
 # FiledataField	: RtReturnOutExDCDetail.tsx
 # Description		: 외부비축협력사반품지시
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.06.27
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';
import dayjs from 'dayjs';

// Utils
import { showAlert, showConfirm, showMessage } from '@/util/MessageUtil';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store
import { useAppSelector } from '@/store/core/coreHook';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';
import DatePicker from '@/components/common/custom/form/Datepicker';
import { validateForm } from '@/util/FormUtil';

// API
import { apiPostSaveConfirm } from '@/api/rt/apiRtReturnOutExDC';

interface RtReturnOutExDCDetailProps {
	dccode: any;
	gridData: any;
	totalCount: any;
	search: any;
}

const RtReturnOutExDCDetail = forwardRef((props: RtReturnOutExDCDetailProps, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// antd Form 사용
	const [form] = Form.useForm();

	// 전역 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// grid Ref
	ref.gridRef = useRef();

	// 그리드 컬럼 설정 (dataField 기준 한 줄 + 주석)
	const gridCol = [
		{ dataField: 'organize', headerText: t('lbl.ORGANIZE'), dataType: 'code', editable: false }, // 창고
		{ dataField: 'organizename', headerText: t('lbl.ORGANIZENAME'), dataType: 'string', editable: false }, // 창고명
		{ dataField: 'custkey', headerText: t('lbl.CUSTKEY_KP'), editable: false, dataType: 'code' }, // 협력사코드
		{ dataField: 'custname', headerText: t('lbl.CUSTNAME_KP'), editable: false, dataType: 'string' }, // 협력사명
		{
			headerText: t('lbl.SKUINFO'),
			children: [
				{ dataField: 'sku', headerText: t('lbl.SKU'), dataType: 'code', editable: false }, // 상품코드
				{ dataField: 'skuname', dataType: 'string', headerText: t('lbl.SKUNM'), editable: false }, // 상품명
			],
		}, // 상품정보
		{ dataField: 'storagetypename', headerText: t('lbl.STORAGETYPE'), editable: false, dataType: 'code' }, // 저장조건
		{
			dataField: 'qty',
			headerText: t('lbl.HOLDSTOCK'),
			editable: false,
			dataType: 'numeric',
			formatString: '#,##0.###',
		}, // 보류재고
		{
			dataField: 'wdQty',
			headerText: t('lbl.CONFIRMQTY_RT'), // 반품수량
			dataType: 'numeric',
			formatString: '#,##0.###',
			editable: true,
			editRenderer: {
				type: 'ConditionRenderer',
				conditionFunction: (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) => {
					if (item?.uom === 'KG') {
						return { type: 'InputEditRenderer', onlyNumeric: true, allowPoint: true, allowNegative: false };
					}
					return { type: 'InputEditRenderer', onlyNumeric: true, allowPoint: false, allowNegative: false };
				},
			},
		},
		{ dataField: 'uom', headerText: t('lbl.UOM'), dataType: 'code', editable: false }, // 단위
		{
			headerText: t('lbl.CALSTOCK'),
			children: [
				{
					dataField: 'avgweight',
					headerText: t('lbl.AVGWEIGHT'),
					dataType: 'numeric',
					editable: false,
					formatString: '#,##0.###',
				}, // 평균중량
				{ dataField: 'realcfmbox', headerText: t('lbl.REALCFMBOX'), dataType: 'numeric', editable: false }, // 실박스확정
				{
					dataField: 'etcqty1',
					headerText: t('lbl.TRANBOXQTY'),
					dataType: 'numeric',
					formatString: '#,###',
					editable: true,
					styleFunction: (
						rowIndex: number,
						columnIndex: number,
						value: any,
						headerText: string,
						item: any,
						dataField: any,
					) => {
						if (item.boxflag === 'Y') {
							return 'isEdit';
						}
						ref.gridRef.current.removeEditClass(columnIndex);
					},
					editRenderer: {
						type: 'InputEditRenderer',
						showEditorBtnOver: false,
						onlyNumeric: true,
						allowPoint: false,
						allowNegative: true,
						textAlign: 'right',
						maxlength: 10,
						autoThousandSeparator: true,
					},
				}, // 작업박스수량
			],
		}, // 박스환산정보
		{
			dataField: 'usebydateFreeRt',
			headerText: t('lbl.USEBYDATE_FREE_RT'),
			dataType: 'numeric',
			editable: false,
			formatString: '#,##0',
		}, // 소비기한잔여(%)
		{
			dataField: 'lottable01',
			headerText: t('lbl.LOTTABLE01'),
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			editable: false,
		}, // 기준일(유통,제조)
		{ dataField: 'durationTerm', headerText: t('lbl.DURATION_TERM2'), dataType: 'code', editable: false }, // 소비기간(잔여/전체)
		{
			headerText: t('lbl.SERIALINFO'),
			children: [
				{ dataField: 'serialno', headerText: t('lbl.SERIALNO'), dataType: 'code', editable: false }, // 이력번호
				{ dataField: 'barcode', headerText: t('lbl.BARCODE'), dataType: 'code', editable: false }, // 바코드
				{ dataField: 'convserialno', headerText: t('lbl.BLNO'), dataType: 'code', editable: false }, // B/L번호
				{ dataField: 'contracttypename', headerText: t('lbl.CONTRACTTYPE'), dataType: 'code', editable: false }, // 계약유형
				{ dataField: 'contractcompany', headerText: t('lbl.CONTRACTCOMPANY'), dataType: 'code', editable: false }, // 계약업체
				{ dataField: 'contractcompanyname', headerText: t('lbl.CONTRACTCOMPANYNAME'), editable: false }, // 계약업체명
			],
		}, // 상품이력정보
		{ dataField: 'editwho', headerText: t('lbl.EDITWHO'), editable: false, visible: false }, // 수정자
		{
			dataField: 'editwhoNm',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager',
			managerDataField: 'editwho',
			editable: false,
		}, // 수정자명
		{ dataField: 'editdate', headerText: t('lbl.EDITDATE'), dataType: 'date', editable: false }, // 수정일자
		{ dataField: 'serialkey', visible: false }, // SERIALKEY
		{ dataField: 'dccode', visible: false }, // 센터
		{ dataField: 'dcname', visible: false }, // 센터명
		{ dataField: 'storerkey', visible: false }, // 고객사
		{ dataField: 'area', visible: false }, // 권역
		{ dataField: 'loc', visible: false }, // 로케이션
		{ dataField: 'lot', visible: false }, // LOT
		{ dataField: 'stockid', visible: false }, // 재고ID
		{ dataField: 'stocktype', visible: false }, // 재고위치
		{ dataField: 'stockgrade', visible: false }, // 재고등급
		{ dataField: 'reasoncode', visible: false }, // 사유코드
		{ dataField: 'other01', visible: false }, // 기타01
		{ dataField: 'blngdeptcd', visible: false }, // 소속부서코드
		{ dataField: 'other03', visible: false }, // 기타03
		{ dataField: 'other04', visible: false }, // 기타04
		{ dataField: 'other05', visible: false }, // 기타05
		{ dataField: 'plant', visible: false }, // 플랜트
		{ dataField: 'storageloc', visible: false }, // 저장위치
		{ dataField: 'serialyn', visible: false }, // 식별번호유무
		{ dataField: 'boxflag', visible: false }, // 박스처리유무
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: true,
		fillColumnSizeMode: false,
		enableColumnResize: true,
		showRowCheckColumn: true,
		enableFilter: true,
		showFooter: true,
	};

	// 그리드 푸터 설정
	const footerLayout = [
		{ labelText: t('lbl.TOTAL'), positionField: 'organize' },
		{ dataField: 'qty', positionField: 'qty', operation: 'SUM', formatString: '#,##0.###', style: 'right' },
		{ dataField: 'wdQty', positionField: 'wdQty', operation: 'SUM', formatString: '#,##0.###', style: 'right' },
	];

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 선택된 행의 데이터를 기반으로 특정 칼럼의 값을 계산한다.
	 * @param {any} event 이벤트
	 */
	const calculateColumnValue = (event: any) => {
		const rowIndex = event.rowIndex;

		// 선택된 행의 데이터를 가져온다.
		if (event.dataField === 'wdQty') {
			const wdQty = event.item.wdQty;

			if (wdQty <= 0) {
				ref.gridRef.current.setCellValue(rowIndex, 'wdQty', 0);
				ref.gridRef.current.setCellValue(rowIndex, 'etcqty1', 0);
			} else {
				if (event.item.boxflag === 'Y' && event.item.avgweight > 0) {
					// 소수점 3자리까지 반올림
					const etcqty1 = Math.round((wdQty / event.item.avgweight) * 1000) / 1000;
					ref.gridRef.current.setCellValue(rowIndex, 'etcqty1', etcqty1);
				} else {
					ref.gridRef.current.setCellValue(rowIndex, 'etcqty1', 1);
				}
			}
		}

		if (event.dataField === 'etcqty1') {
			//
		}
	};

	/**
	 * 그리드에서 변경된 데이터를 확인하고, 유효성 검사를 거쳐 저장을 진행합니다.
	 * 저장 후 재 조회 실행.
	 */
	const saveMasterList = async () => {
		// 필수 입력 값 검증
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		// 2170 물류센터만 처리 가능
		if (props.dccode !== '2170') {
			return;
		}

		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const checkedItems = ref.gridRef.current.getCheckedRowItemsAll();

		if (!checkedItems || checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'));
			return;
		}

		const updatedItems: any[] = [];

		// 그리드 입력 값 검증
		for (const item of checkedItems) {
			const uom = item.uom;
			const qty = item.qty;
			const wdQty = item.wdQty;

			// 반품요청수량이 재고수량보다 많은지 확인한다.
			if (qty < wdQty) {
				showMessage({
					content: '반품요청수량이 재고수량보다 많습니다.',
					modalType: 'warning',
				});
				return;
			}

			// 반품수량 소수 입력은 단위가 KG일 때만 가능하다.
			if (uom !== 'KG') {
				if (wdQty > 0 && wdQty < 1) {
					const sku = item.sku;
					showMessage({
						content: '[상품코드 : ' + sku + ']' + ' KG단위가 아닌 상품의 반품수량은 정수로만 입력 가능합니다.',
						modalType: 'warning',
					});
					return;
				}
			}

			// 중복 건은 제외한다
			const exists = updatedItems.find((el: any) => {
				return (
					el.dccode === item.dccode &&
					el.storerkey === item.storerkey &&
					el.organize === item.organize &&
					el.custkey === item.custkey
				);
			});

			if (!exists) {
				updatedItems.push(item);
			}
		}

		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			const params = {
				avc_DCCODE: props.dccode,
				avc_COMMAND: 'CONFIRM',
				fixdccode: props.dccode,
				wdDate: form.getFieldValue('docdt').format('YYYYMMDD'),
				docExistYn: 'N',
				saveHeaderList: updatedItems, //ds_in
				saveDetailList: checkedItems, //ds_detail
			};

			apiPostSaveConfirm(params).then(res => {
				if (res.statusCode === 0) {
					props.search();
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});
				}
			});
		});
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
			if (event.dataField === 'etcqty1') {
				//박스수량 컬럼 편집 가능 여부
				if (event.item.boxflag === 'Y') {
					return true;
				} else {
					return false;
				}
			}
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		ref.gridRef.current?.bind('cellEditEnd', (event: any) => {
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
	 * 그리드 이벤트 바인딩
	 */
	useEffect(() => {
		initEvent();
	});

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		form.setFieldsValue({
			docdt: dayjs(),
		});
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
		}
	}, [props.gridData, ref.gridRef]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={getGridBtn()} totalCnt={props.totalCount}>
					<Form form={form} layout="inline" className="sect">
						<DatePicker //협력사반품일자
							name="docdt"
							label={t('lbl.VENDORETURNDT')}
							showSearch
							allowClear
							showNow={false}
							required
							className="bg-white"
						/>
					</Form>
				</GridTopBtn>

				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</AGrid>
		</>
	);
});

export default RtReturnOutExDCDetail;
