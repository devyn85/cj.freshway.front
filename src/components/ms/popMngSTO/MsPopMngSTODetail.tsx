/*
 ############################################################################
 # FiledataField	: MsPopMngSTODetail.tsx
 # Description		: 기준정보 > 권역기준정보 > 거래처별POP관리(광역일배)
 # Author			: JeongHyeongCheol
 # Since			: 25.07.18
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Components
import GridTopBtn from '@/components/common/GridTopBtn';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// store
import { useAppSelector } from '@/store/core/coreHook';

// util

// API Call Function
import { apiPostSaveMasterList } from '@/api/ms/apiMsPopMngSTO';

// types
import { GridBtnPropsType } from '@/types/common';

interface MsPopMngSTODetailProps {
	gridData?: Array<object>;
	dccode?: string;
	search?: any;
}
const MsPopMngSTODetail = forwardRef((props: MsPopMngSTODetailProps, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	// 글로벌 변수
	const globalVariable = useAppSelector(state => state.global.globalVariable);

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: '광역센터',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			editable: false,
		},
		{
			dataField: 'toDccode',
			headerText: '실주문센터',
			// editRenderer: {
			// 	type: 'DropDownListRenderer',
			// 	list: getUserDccodeList(),
			// 	keyField: 'dccode',
			// 	valueField: 'dcname',
			// },
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			required: true,
		},
		{
			dataField: 'popno',
			headerText: t('lbl.POPNO'), // POP번호
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
			},
			required: true,
		},
		{
			dataField: 'toDeliverydt',
			headerText: t('lbl.DATE'), // 일자
			dataType: 'numeric',
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true,
			},
		},
		{
			dataField: 'addwho',
			headerText: t('lbl.ADDWHO'),
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
			headerText: t('lbl.ADDDATE'), // 등록일시
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
		{
			dataField: 'editwho',
			headerText: t('lbl.EDITWHO'), // 수정자
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
			headerText: t('lbl.EDITDATE'), // 수정일시
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
	];
	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
		enableFilter: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 거래처별 POP관리(광역일배) 정보 변경사항 저장
	 * @returns {void}
	 */
	const saveMasterList = () => {
		const params = gridRef.current.getChangedData();

		// validation
		if (params.length > 0 && !gridRef.current.validateRequiredGridData()) {
			return;
		}
		// 변경 데이터 확인
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		// POP번호 길이체크
		const isPopLength = params.some((item: any) => {
			const popnoValue = String(item.popno).trim();
			return popnoValue.length !== 5;
		});

		if (isPopLength) {
			showMessage({
				content: '지정된 자리수에 맞춰 입력하시기 바랍니다.\n(기본 : 숫자5자리[00000])',
				modalType: 'info',
			});
			return;
		}
		// 저장하시겠습니까?
		gridRef.current.showConfirmSave(() => {
			apiPostSaveMasterList(params).then(() => {
				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
					onOk: () => {
						props.search(); // 콜백 함수 호출
					},
				});
			});
		});
	};

	// 페이지 버튼 함수 바인딩
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'plus', // 행추가
				initValues: {
					rowStatus: 'I',
					dccode: props.dccode,
				},
			},
			{
				btnType: 'delete', // 행삭제
			},
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

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.gridData);
			gridRefCur?.setSelectionByIndex(0, 0);

			if (props.gridData.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.gridData]);

	return (
		<AGrid className="contain-wrap">
			<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} />
			<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
		</AGrid>
	);
});

export default MsPopMngSTODetail;
