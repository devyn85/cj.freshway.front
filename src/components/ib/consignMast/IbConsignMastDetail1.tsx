/*
 ############################################################################
 # FiledataField	: IbConsignMastDetail1.tsx
 # Description		: 정산 > 3PL물류대행수수료정산 > 위탁 물류 처리 - 수수료 정산[품목별정산료TAB]
 # Author		    	: 고혜미
 # Since			    : 25.10.14
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
import { apiPostSaveTab1MasterList, apiPostTab1CreatDataList } from '@/api/ib/apiIbConsignMast';
import { getUserDccodeList } from '@/store/core/userStore';

// Component

import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { useEffect } from 'react';
//types
import { Button, Form } from 'antd';

const IbConsignMastDetail1 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form } = props;
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	// Declare react Ref(2/4)
	ref.gridRef = useRef();
	const userDccodeList = getUserDccodeList('') ?? [];
	// Declare init value(3/4)

	// 기타(4/4)

	// 그리드 컬럼
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
			width: 200,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				const found = userDccodeList.find(opt => opt.dccode === value);
				return found ? found.dcname : value; // dcname(명칭) 보여주기
			},
			editable: false,
		}, // 물류센터

		{ dataField: 'stockmonth', headerText: t('lbl.STOCKMONTH'), editable: false, width: 80, dataType: 'code' }, // 재고월
		{ dataField: 'sku', headerText: t('lbl.SKU'), editable: false, width: 80, dataType: 'code' }, // 상품코드
		{ dataField: 'skunm', headerText: t('lbl.SKUNM'), editable: false, width: 500, dataType: 'string' }, // 상품명
		{ dataField: 'baseuom', headerText: t('lbl.UOM'), editable: false, width: 80, dataType: 'string	' }, // 단위
		{ dataField: 'storagetype', headerText: t('lbl.STORAGETYPE'), editable: false, width: 80, dataType: 'code' }, // 저장조건
		{ dataField: 'qtyperbox', headerText: t('lbl.QTYPERBOX'), editable: false, width: 80, dataType: 'numeric' }, // 박스입수
		{
			headerText: '현재고 (해당월 말일자)', // 현재고수량(해당월 말일자)
			children: [
				{ dataField: 'stock', headerText: t('lbl.QTY_ST'), editable: false, width: 120, dataType: 'numeric' }, // 현재고수량
				{ dataField: 'stockBox', headerText: t('lbl.BOX_ENG'), editable: false, width: 80, dataType: 'numeric' }, // BOX
				{ dataField: 'stockEa', headerText: t('lbl.EA_ENG'), editable: false, width: 80, dataType: 'numeric' }, // EA
			],
		},
		{ dataField: 'grConfirmqty', headerText: '총입고수량', editable: false, width: 100, dataType: 'numeric' }, // 총입고수량
		{ dataField: 'giConfirmqty', headerText: '총출고수량', editable: false, width: 100, dataType: 'numeric' }, // 총출고수량
		{ dataField: 'grTotal', headerText: t('lbl.DP_PRICE'), editable: true, width: 120, dataType: 'numeric' }, // 입고료
		{ dataField: 'giTotal', headerText: t('lbl.WD_PRICE'), editable: true, width: 120, dataType: 'numeric' }, // 출고료
		{
			dataField: 'stTotal',
			headerText: t('lbl.STORAGEPRICE'),
			editable: true,
			width: 100,
			dataType: 'numeric',
		}, // 창고료
		{ dataField: 'wghTotal', headerText: t('lbl.WGHPRICE'), editable: true, width: 100, dataType: 'numeric' }, // 계근료
		{
			dataField: 'workTotal',
			headerText: t('lbl.WORK_AMOUNT'),
			editable: true,
			width: 100,
			dataType: 'numeric',
		}, // 작업료
		{
			dataField: 'total',
			headerText: t('lbl.SUM_STORAGEFEE'),
			editable: false,
			width: 150,
			dataType: 'numeric',
		}, // 보관료합계
	];

	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		exportToXlsxGridCustom: () => {
			const params = {
				drmUseYn: 'N', // DRM 해제
			};
			ref.current?.exportToXlsxGrid(params);
		},
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 자료생성 버튼 클릭 시
	 * @param flag
	 */
	const createData = () => {
		ref.current?.clearGridData();

		const custkey = form.getFieldsValue().custkey;
		const month = form.getFieldsValue().month?.format('YYYYMM');

		if (!custkey) {
			showAlert(null, t('msg.required', ['협력사코드']));
			return;
		}
		if (!month) {
			showAlert(null, t('msg.required', ['정산월']));
			return;
		}

		const params = {
			custkey: custkey,
			month: month,
		};

		apiPostTab1CreatDataList(params).then(res => {
			const gridRefCur = ref.current;
			if (!gridRefCur) return;

			const data = res.data || [];
			if (data.length === 0) {
				gridRefCur.clearGridData();
				setTotalCnt(0);
				return;
			}

			const newData = data.map((item: any) => ({
				...item,
				rowStatus: 'I',
			}));

			gridRefCur.addRow(newData);
			setTotalCnt(newData.length);
		});
	};

	/**
	 * 저장
	 * @returns {void}
	 */
	const saveMasterList = () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = ref.current.getChangedData({ validationYn: false });

		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		if (!ref.current.validateRequiredGridData()) return;

		// 저장 실행
		ref.current.showConfirmSave(() => {
			apiPostSaveTab1MasterList(updatedItems).then(res => {
				if (res.statusCode === 0) {
					// 전체 체크 해제
					ref.current.setAllCheckedRows(false);
					// AUIGrid 변경이력 Cache 삭제
					ref.current.resetUpdatedItems();

					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							props.callBackFn?.(); // 콜백 함수 호출
						},
					});
				}
			});
		});
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 바인딩 완료
		 * @param {any} event 이벤트
		 */
		ref?.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			ref?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 편집 시작 (신규일때만 편집 허용)
		 * @param {any} event 이벤트
		 */
		ref?.current.bind('cellEditBegin', (event: any) => {
			if (event.item.rowStatus !== 'I') {
				// false를 반환하여 편집 모드 진입을 막는다.
				//return false;
			}
			return true;
		});

		/**
		 * 그리드 셀 편집 종료
		 * @param {any} event 이벤트
		 */
		ref?.current.bind('cellEditEnd', (event: any) => {
			// total = 입고료 + 출고료 + 창고료 + 계근료
			const grTotal = ref.current.getCellValue(event.rowIndex, 'grTotal'); // 입고료
			const giTotal = ref.current.getCellValue(event.rowIndex, 'giTotal'); // 출고료
			const stockAmountTotal = ref.current.getCellValue(event.rowIndex, 'stTotal'); // 창고료
			const wghAmountTotal = ref.current.getCellValue(event.rowIndex, 'wghTotal'); // 계근료
			const workAmountTotal = ref.current.getCellValue(event.rowIndex, 'workTotal'); // 작업료
			const total =
				commUtil.nvl(grTotal, 0) +
				commUtil.nvl(giTotal, 0) +
				commUtil.nvl(stockAmountTotal, 0) +
				commUtil.nvl(wghAmountTotal, 0) +
				commUtil.nvl(workAmountTotal, 0);

			ref.current.setCellValue(event.rowIndex, 'total', total);
		});
	};

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList,
			},
		],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
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
		const gridRefCur = ref.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle="품목별정산료LIST" totalCnt={props.totalCnt}>
					{/* START.자료생성영역 */}
					<Form form={form} layout="inline">
						<div className="sect">
							<Button size={'small'} style={{ marginRight: 0 }} onClick={() => createData()}>
								{'자료생성'}
							</Button>
						</div>
					</Form>
				</GridTopBtn>
				{/* END.자료생성영역 */}
				{/* 상품 LIST 그리드 */}
				<AUIGrid ref={ref} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
		</>
	);
});
export default IbConsignMastDetail1;
