/*
 ############################################################################
 # FiledataField	: OmCkApprovalDetail.tsx
 # Description		: 주문 > 주문요청 > CK주문결재내역
 # Author			: JeongHyeongCheol
 # Since			: 25.09.29
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Components
import GridTopBtn from '@/components/common/GridTopBtn';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// store
import { getCommonCodebyCd } from '@/store/core/comCodeStore';

// API Call Function
import { apiPostSaveMasterList } from '@/api/om/apiOmCkApproval';

// util

// types
import { GridBtnPropsType } from '@/types/common';
interface OmCkApprovalDetailProps {
	gridData?: Array<object>;
	search?: any;
}

const OmCkApprovalDetail = forwardRef((props: OmCkApprovalDetailProps, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { gridData, search } = props;
	const [totalCnt, setTotalCnt] = useState(0);
	const { t } = useTranslation();

	// 승인/반려여부
	const apprStatusLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('STATUS_APPR_CK', value)?.cdNm;
	};

	// 그리드 컬럼
	const gridCol = [
		{
			dataField: 'requestno',
			headerText: t('lbl.REQUESTNO'),
		},
		{
			dataField: 'requestline',
			headerText: t('lbl.LINENO'),
			dataType: 'code',
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU2'),
			filter: {
				showIcon: true,
			},
			dataType: 'code',
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNM'),
			filter: {
				showIcon: true,
			},
		},

		{
			dataField: 'orderqty',
			headerText: t('lbl.QTY'),
			dataType: 'numeric',
			filter: {
				showIcon: true,
			},
		},

		{
			dataField: 'uom',
			headerText: t('lbl.UOM'),
		},
		{
			dataField: 'deliverydate',
			headerText: '납품일',
			dataType: 'date',
			formatString: 'yyyymmdd',
		},
		{
			dataField: 'adddate',
			headerText: t('lbl.APPROVALREQDT'),
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
		},
		{
			dataField: 'apprStatus',
			headerText: '승인/반려여부',
			dataType: 'code',
			labelFunction: apprStatusLabelFunc,
		},
		{
			dataField: 'editwho',
			headerText: t('lbl.APPROVALWHO'),
			visible: false,
		},
		{
			dataField: 'updNm',
			headerText: t('lbl.APPROVALWHO'),
			dataType: 'manager', // dataType을 'manager'로 설정
			managerDataField: 'editwho', // 노출시킨 사용자명에 해당하는 사용자ID dataField 설정
			editable: false,
		},
	];
	// 그리드 속성
	const gridProps = {
		editable: false,
		enableFilter: true,
		fillColumnSizeMode: true,
		enableColumnResize: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
		rowCheckDisabledFunction: (rowIndex: any, isChecked: any, item: any) => {
			if (item.apprStatus === 'E' || item.apprStatus === 'S') {
				return false;
			}
			return true;
		},
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 승인/반려
	 * @param type
	 * @returns {void}
	 */
	const saveMaster = (type: string) => {
		// 변경 데이터 확인
		const params = gridRef.current.getCheckedRowItemsAll();

		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_ERR_008'),
				modalType: 'info',
			});
			return;
		}

		const checkDuplicate = params.some((item: any) => {
			return item.apprStatus !== 'I';
		});

		if (checkDuplicate) {
			showMessage({
				content: '승인/반려처리 된 건입니다.',
				modalType: 'info',
			});
			return;
		}
		const updateParams = params.map((item: any) => {
			return {
				serialkey: item.serialkey,
				apprStatus: type,
			};
		});
		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			apiPostSaveMasterList(updateParams).then(() => {
				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
				});
				search();
			});
		});
	};
	/**
	 * =====================================================================
	 *	grid button set
	 * =====================================================================
	 */

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const setGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'btn1',
					btnLabel: t('lbl.REJECT'),
					callBackFn: () => {
						saveMaster('E');
					},
				},
				{
					btnType: 'btn2',
					btnLabel: '승인',
					callBackFn: () => {
						saveMaster('S');
					},
				},
			],
		};
		return gridBtn;
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		if (gridData.length > 0) {
			gridRef.current.setGridData(gridData);
			setTotalCnt(gridData.length);
			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			const colSizeList1 = gridRef.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRef.current.setColumnSizeList(colSizeList1);
			gridRef?.current.setSelectionByIndex(0);
		}
	}, [gridData]);

	return (
		<AGrid className="contain-wrap">
			<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={setGridBtn()} totalCnt={totalCnt} />
			<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
});

export default OmCkApprovalDetail;
