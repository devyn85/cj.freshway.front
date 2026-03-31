/*
 ############################################################################
 # FiledataField	: MsSkuChainMoqDetail.tsx
 # Description		: 기준정보 > 상품기준정보 > MOQ/LT 마스터
 # Author			: JeongHyeongCheol
 # Since			: 25.06.26
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Components
import CmSkuInfoPopup from '@/components/cm/popup/CmSkuInfoPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { Button } from '@/components/common/custom/form';
import GridTopBtn from '@/components/common/GridTopBtn';
import MsSkuChainMoqUploadExcelPopup from '@/components/ms/skuChainMoq/MsSkuChainMoqUploadExcelPopup';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// util

// API Call Function
import { apiPostSaveMasterList } from '@/api/ms/apiMsSkuChainMoq';

// types
import { getUserDccodeList } from '@/store/core/userStore';
import { GridBtnPropsType } from '@/types/common';
interface MsSkuChainMoqDetailProps {
	gridData?: Array<object>;
	search?: any;
}
const MsSkuChainMoqDetail = forwardRef((props: MsSkuChainMoqDetailProps, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [custModalParam, setCustModalParam] = useState<any>({});
	const [totalCount, setTotalCount] = useState(0);
	const refCustModal = useRef(null);
	const refModalExcel = useRef(null);

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: '물류센터',
			dataType: 'code',
			commRenderer: {
				type: 'dropDown',
				keyField: 'dccode',
				valueField: 'dccode',
				list: getUserDccodeList('ONLYALL'),
				disabledFunction: function (rowIndex: any, columnIndex: any, value: any, item: any, dataField: any) {
					// moq테이블에 저장된 상태면 수정 불가
					return commUtil.isNotEmpty(item.addwho);
				},
			},
			filter: {
				showIcon: true,
			},
			styleFunction: function (rowIndex: number, columnIndex: number, value: any, headerText: string, item: any) {
				if (commUtil.isNotEmpty(item.addwho)) {
					// 편집 가능 class 삭제
					gridRef.current.removeEditClass(columnIndex);
				} else {
					// 편집 가능 class 추가
					return 'isEdit';
				}
			},
		},
		{
			dataField: 'dcname',
			headerText: '물류센터명',
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{
			dataField: 'custkey',
			headerText: '협력사코드',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{
			dataField: 'custname',
			headerText: '협력사명',
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{
			dataField: 'sku',
			headerText: '상품코드',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{
			dataField: 'description',
			headerText: '상품명',
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{
			dataField: 'boxperplt',
			headerText: 'PLT당 BOX수',
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'leadtime',
			headerText: '리드타임',
			dataType: 'numeric',
			editable: false,
		},
		{
			dataField: 'moqSku',
			headerText: '상품MOQ(BOX)',
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
			},
		},
		{
			dataField: 'moqSkuPlt',
			headerText: '상품MOQ(PLT)',
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
			},
		},
		{
			dataField: 'moqVenderBox',
			headerText: '협력사MOQ(BOX)',
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
			},
		},
		{
			dataField: 'moqVenderPlt',
			headerText: '협력사MOQ(PLT)',
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
			},
		},
		{
			dataField: 'delYn',
			headerText: t('lbl.DEL_YN'),
			commRenderer: {
				type: 'dropDown',
				list: getCommonCodeList('DEL_YN').filter((item: any) => item.comCd === 'Y' || item.comCd === 'N'),
			},

			dataType: 'code',
		},
		{
			dataField: 'addwho',
			headerText: '등록자',
			visible: false,
		},
		{
			dataField: 'regNm',
			headerText: t('lbl.ADDWHO'),
			dataType: 'manager',
			managerDataField: 'addwho',
			editable: false,
		},
		{
			dataField: 'adddate',
			headerText: '등록일시',
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
		{
			dataField: 'editwho',
			headerText: '수정자',
			visible: false,
		},
		{
			dataField: 'updNm',
			headerText: t('lbl.EDITWHO'),
			dataType: 'manager',
			managerDataField: 'editwho',
			editable: false,
		},
		{
			dataField: 'editdate',
			headerText: '수정일시',
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
	];
	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		enableFilter: true,
		showCustomRowCheckColumn: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	// 유효성 검사
	const validateItem = (item: any): string | null => {
		// 0을 null로 처리하여 유효성 검사에 사용
		const moqSku = item.moqSku === 0 ? null : item.moqSku;
		const moqSkuPlt = item.moqSkuPlt === 0 ? null : item.moqSkuPlt;
		const moqVenderBox = item.moqVenderBox === 0 ? null : item.moqVenderBox;
		const moqVenderPlt = item.moqVenderPlt === 0 ? null : item.moqVenderPlt;

		// 1. 필수 데이터 검사
		const isAnyDataPresent = moqSku || moqSkuPlt || moqVenderBox || moqVenderPlt;
		if (!isAnyDataPresent) {
			// sku를 포함하여 어떤 데이터에 에러가 났는지 명확히 표시
			return `MOQ 4개 컬럼 중 하나는 반드시 입력해야 합니다.`;
		}

		// 2. 상호 배타적 검사 1
		if (moqSku && moqSkuPlt) {
			return `'상품MOQ(BOX)'와 '상품MOQ(PLT)'는 동시에 입력할 수 없습니다.`;
		}

		// 3. 상호 배타적 검사 2
		if (moqVenderBox && moqVenderPlt) {
			return `'협력사MOQ(BOX)'와 '협력사MOQ(PLT)'는 동시에 입력할 수 없습니다.`;
		}

		return null;
	};

	/**
	 * MOQ/LT 마스터 정보 변경사항 저장
	 * @returns {void}
	 */
	const saveMasterList = () => {
		const params = gridRef.current.getChangedData().map((item: any) => {
			return {
				dccode: item.dccode,
				sku: item.sku,
				moqSku: item.moqSku === 0 ? null : item.moqSku,
				moqSkuPlt: item.moqSkuPlt === 0 ? null : item.moqSkuPlt,
				moqVenderBox: item.moqVenderBox === 0 ? null : item.moqVenderBox,
				moqVenderPlt: item.moqVenderPlt === 0 ? null : item.moqVenderPlt,
				leadtime: item.leadtime,
				rowStatus: item.rowStatus,
				delYn: item.delYn,
			};
		});
		// 변경 데이터 확인
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		let checkMoq = null;
		for (const item of params) {
			checkMoq = validateItem(item);
			if (checkMoq) {
				break;
			}
		}
		// validation
		if (checkMoq) {
			showMessage({
				content: checkMoq,
				modalType: 'info',
			});
			return;
		}
		// 저장하시겠습니까?
		gridRef.current.showConfirmSave(() => {
			apiPostSaveMasterList(params).then((res: any) => {
				if (res.data.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							props.search();
						},
					});
				}
			});
		});
	};
	// 페이지 버튼 함수 바인딩
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
				callBackFn: saveMasterList,
			},
		],
	};
	// 상품정보상세 팝업 열기
	const onOpenCustModal = (row: any) => {
		const params = row;
		setCustModalParam(params);
		refCustModal.current.handlerOpen();
	};

	/**
	 * 엑셀 upload popup
	 */
	const excelUpload = () => {
		refModalExcel.current.handlerOpen();
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		refModalExcel?.current.handlerClose();
		refCustModal?.current.handlerClose();
		setCustModalParam({});
	};

	const initEvent = () => {
		//상품정보상세 호출
		gridRef.current?.bind('cellDoubleClick', function (event: any) {
			if (event.dataField == 'sku') {
				onOpenCustModal(event.item);
			}
		});
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 에디팅 시작 이벤트
	useEffect(() => {
		initEvent();
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.gridData);
			gridRefCur?.setSelectionByIndex(0, 0);

			if (props.gridData.length > 0) {
				setTotalCount(props.gridData.length);
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.gridData]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={'목록'} gridBtn={gridBtn} totalCnt={totalCount}>
					<Button onClick={excelUpload}>엑셀업로드</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<CustomModal ref={refCustModal} width="1000px">
				<CmSkuInfoPopup titleName={'상품상세'} refModal={refCustModal} apiParams={custModalParam} close={closeEvent} />
			</CustomModal>
			<CustomModal ref={refModalExcel} width="1000px">
				<MsSkuChainMoqUploadExcelPopup search={props.search} close={closeEvent}></MsSkuChainMoqUploadExcelPopup>
			</CustomModal>
		</>
	);
});

export default MsSkuChainMoqDetail;
