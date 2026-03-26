/*
############################################################################
# FiledataField : MsPurchaseCustPopup.tsx
# Description   : 기준정보 > 상품기준정보 > 수발주정보 수정 팝업
# Author        : YeoSeungCheol
# Since         : 25.07.30
############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';
import { v4 as uuidv4 } from 'uuid';

// component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// store
import { getCommonCodebyCd } from '@/store/core/comCodeStore';

// api
import { apiGetPurchaseCust, apiPostSavePurchaseCust } from '@/api/ms/apiMsPurchaseCustPopup';

interface PropsType {
	serialKey: string;
	buyerKey?: string;
	close: () => void;
}

const MsPurchaseCustPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	//console.log('buyerkey: ', props.buyerKey); // 수정 시 필수 값
	const { t } = useTranslation();

	const { serialKey, close } = props;
	const gridRef = useRef(null);
	const [totalCount, setTotalCount] = useState(0);
	const gridId = uuidv4() + '_gridWrap';

	// 그리드 컬럼 정의 (백엔드 DTO에 맞춰서)
	const gridCol = [
		{
			// 수급센터
			headerText: t('lbl.PODCCODE'),
			dataField: 'dcCode',
			dataType: 'code',
			editable: false,
		},
		{
			// 상품코드
			headerText: t('lbl.SKUCD'),
			dataField: 'sku',
			dataType: 'code',
			editable: false,
		},
		{
			// 상품명
			headerText: t('lbl.SKUNM'),
			dataField: 'description',
			dataType: 'string',
			editable: false,
		},
		{
			// 플랜트코드
			headerText: t('lbl.PLANTCD'),
			dataField: 'plant',
			dataType: 'code',
			editable: false,
		},
		{
			// 플랜트
			headerText: t('lbl.PLANT'),
			dataField: 'plantDescr',
			dataType: 'string',
			editable: false,
		},
		{
			// 시작일자
			headerText: t('lbl.FROMDATE'),
			dataField: 'fromDate',
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			commRenderer: {
				type: 'calender',
				onlyCalendar: false,
			},
		},
		{
			// 구매처
			headerText: t('lbl.CUSTKEY_PO'),
			// dataField: 'buyerKey',
			dataField: 'custKey',
			dataType: 'code',
		},
		{
			// 실공급센터
			headerText: t('lbl.ROUTE_PO'),
			dataField: 'route',
			dataType: 'code',
		},
		{
			// 경유지조직
			headerText: t('lbl.ROUTEORGANIZE'),
			dataField: 'routeOrganize',
			dataType: 'code',
		},
		{
			dataField: 'uom',
			visible: false,
		},
		{
			dataField: 'storerKey',
			visible: false,
		},
		{
			dataField: 'toDate',
			visible: false,
		},
		{
			dataField: 'channel',
			visible: false,
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('PUTAWAYTYPE', value)?.cdNm;
			},
		},
		{
			dataField: 'custType',
			visible: false,
		},
		{
			dataField: 'buyerKey',
			visible: false,
		},
	];

	const gridProps = {
		editable: true,
		showRowCheckColumn: false,
		extraColumnOrders: 'showRowNumColumn',
	};

	// 버튼 설정
	const gridBtn = {
		tGridRef: gridRef,
		btnArr: [
			{
				btnType: 'save' as const,
				callBackFn: () => onSave(),
			},
		],
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	// 데이터 조회
	const fetchData = () => {
		gridRef.current?.clearGridData();

		const params = {
			serialKey: serialKey,
		};

		apiGetPurchaseCust(params).then(res => {
			if (res.statusCode === 0) {
				setTotalCount(res.data.totalCount || res.data.length);
				gridRef.current?.setGridData(res.data || []);

				// 데이터 설정 후 컬럼 크기 자동 조정
				if (res.data && res.data.length > 0) {
					const colSizeList = gridRef.current.getFitColumnSizeList(true);
					gridRef.current.setColumnSizeList(colSizeList);
				}
			}
		});
	};

	// 저장
	const onSave = () => {
		const changed = gridRef.current.getChangedData({ validationYn: false });
		if (!changed || changed.length < 1) {
			showAlert(null, '변경사항이 없습니다.');
			return;
		}

		changed.forEach((item: any) => {
			item.rowStatus = 'I';
		});

		showConfirm(null, '저장하시겠습니까?', () => {
			apiPostSavePurchaseCust(changed).then(res => {
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							close();
						},
					});
				}
			});
		});
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		fetchData();
	}, [serialKey]);

	return (
		<>
			<PopupMenuTitle name={'수발주정보 수정'} />

			<AGrid>
				<GridTopBtn
					// gridBtn={{ tGridRef: gridRef, btnArr: [{ btnType: 'save', callBackFn: onSave }] }}
					gridBtn={gridBtn}
					gridTitle={'수발주정보 목록'}
					totalCnt={totalCount}
				/>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} name={gridId} />
			</AGrid>
			<ButtonWrap data-props="single">
				<Button onClick={close}>닫기</Button>
			</ButtonWrap>
		</>
	);
};

export default MsPurchaseCustPopup;
