/*
 ############################################################################
 # FiledataField	: StStockOutOrgDetail.tsx
 # Description		: 외부비축재고조회
 # Author			    : Jinwoo Park(jwpark1104@cj.net)
 # Since			    : 25.07.04
 ############################################################################
*/
//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//Component
import GridTopBtn from '@/components/common/GridTopBtn';

//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Form } from 'antd';
import { isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

// Utils
import commUtil from '@/util/commUtil';

//types
import { GridBtnPropsType } from '@/types/common';

// API Call Function
import { apiGetgetSkuSpecForMsExDcRate } from '@/api/ms/apiMsExDcRate';
import { apiSendEmail } from '@/api/st/apiStStockOutOrg';

const StStockOutOrgDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	ref.gridRef = useRef();
	const gridId = uuidv4() + '_gridWrap';
	const { t } = useTranslation();
	const [specCodeMap, setspecCodeMap] = useState<{ [key: string]: string }>({});
	const styleCache: any = {};
	const stockStatus = Form.useWatch('stockStatus', props.form);

	//그리드 컬럼 세팅
	const gridCol = [
		{ dataField: 'dcCode', headerText: '물류센터', width: 80, dataType: 'code' },
		{ dataField: 'organize', headerText: '창고', width: 80, dataType: 'code' },
		{ dataField: 'organizeName', headerText: '창고명', width: 120 },
		{ dataField: 'stockGrade', headerText: '재고속성', width: 80, dataType: 'code' },
		{ dataField: 'loc', headerText: '로케이션', width: 90, dataType: 'code' },
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
		{
			dataField: 'skuL',
			headerText: '상품분류(대)',
			width: 80,
			labelFunction: (
				rowIndex: number,
				colIndex: number,
				value: any,
				headerText: string,
				item: { skuGroup?: string },
			) => {
				return setSepecCodeDetail(0, 2, item.skuGroup);
			},
			dataType: 'code',
		},
		{
			dataField: 'skuM',
			headerText: '상품분류(중)',
			width: 80,
			dataType: 'code',
			labelFunction: (
				rowIndex: number,
				colIndex: number,
				value: any,
				headerText: string,
				item: { skuGroup?: string },
			) => {
				return setSepecCodeDetail(0, 4, item.skuGroup);
			},
		},
		{
			dataField: 'skuS',
			headerText: '상품분류(소)',
			width: 80,
			dataType: 'code',
			labelFunction: (
				rowIndex: number,
				colIndex: number,
				value: any,
				headerText: string,
				item: { skuGroup?: string },
			) => {
				return setSepecCodeDetail(0, 6, item.skuGroup);
			},
		},
		{
			dataField: 'skuD',
			headerText: '상품분류(세)',
			width: 80,
			dataType: 'code',
			labelFunction: (
				rowIndex: number,
				colIndex: number,
				value: any,
				headerText: string,
				item: { skuGroup?: string },
			) => {
				return setSepecCodeDetail(0, 8, item.skuGroup);
			},
		},
		{ dataField: 'storageType', headerText: '저장조건', width: 100, dataType: 'code' },
		{
			headerText: '현재고',
			children: [
				{
					dataField: 'stockStatus',
					headerText: '재고상태',
					dataType: 'code',
					width: 80,
					disableMoving: true,
				},
				{ dataField: 'qtyPerBox', headerText: '박스입수', dataType: 'numeric', width: 80, disableMoving: true },
				{
					dataField: 'qty1',
					headerText: '수량',
					dataType: 'numeric',
					width: 80,
					disableMoving: true,
					formatString: '#,##0.##',
				},
				{ dataField: 'uom1', headerText: '단위', width: 60, dataType: 'code', disableMoving: true },
				{
					dataField: 'qty2',
					headerText: '수량',
					dataType: 'numeric',
					width: 80,
					disableMoving: true,
					formatString: '#,##0.##',
				},
				{ dataField: 'uom2', headerText: '단위', width: 60, dataType: 'code', disableMoving: true },
			],
		},
		{
			headerText: '환산재고',
			children: [
				{
					dataField: 'avgWeight',
					headerText: '평균중량',
					dataType: 'numeric',
					width: 90,
					disableMoving: true,
					formatString: '#,##0.##',
				},
				{ dataField: 'calBox', headerText: '환산박스', dataType: 'numeric', width: 90, disableMoving: true },
				{ dataField: 'realBox', headerText: '실박스', dataType: 'numeric', width: 90, disableMoving: true },
			],
		},
		{
			headerText: '재고정보',
			children: [
				{ dataField: 'uom', headerText: '단위', width: 60, dataType: 'code', disableMoving: true },
				{
					dataField: 'qty',
					headerText: '현재수량',
					dataType: 'numeric',
					width: 90,
					disableMoving: true,
					formatString: '#,##0.##',
				},
				{
					dataField: 'openQty',
					headerText: '가용재고수량',
					dataType: 'numeric',
					width: 90,
					disableMoving: true,
					formatString: '#,##0.##',
				},
				{ dataField: 'qtyAllocated', headerText: '재고할당수량', dataType: 'numeric', width: 90, disableMoving: true },
				{ dataField: 'qtyPicked', headerText: '피킹재고', dataType: 'numeric', width: 90, disableMoving: true },
			],
		},
		{ dataField: 'stockPrice', headerText: '단가', dataType: 'numeric', width: 90 },
		{ dataField: 'stockamt', headerText: '금액', dataType: 'numeric', width: 90 },
		{
			dataField: 'nearDurationYn',
			headerText: '소비기한임박여부',
			width: 80,
			dataType: 'code',
			align: 'center',
			styleFunction(rowIndex: any, columnIndex: any, value: any, headerText: any, item: any, dataField: any) {
				if (item?.duration === null) {
					const style = { background: 'white' };
					return style;
				}
				// 변경 소스
				const key = `${rowIndex}-${columnIndex}`;
				if (styleCache[key]) {
					return styleCache[key];
				}
				const color = durationCheck(item);
				const style = { background: color };
				styleCache[key] = style;
				return style;
			},
		},
		{
			dataField: 'expiredt',
			headerText: t('lbl.EXPIREDT'),
			width: 100,
			dataType: 'code',
			styleFunction(rowIndex: any, columnIndex: any, value: any, headerText: any, item: any, dataField: any) {
				if (item?.duration === null) {
					const style = { background: 'white' };
					return style;
				}
				// 변경 소스
				const key = `${rowIndex}-${columnIndex}`;
				if (styleCache[key]) {
					return styleCache[key];
				}
				const color = durationCheck(item);
				const style = { background: color };
				styleCache[key] = style;
				return style;
			},
		},
		{
			dataField: 'manufacturedt',
			headerText: t('lbl.MANUFACTUREDT'),
			width: 110,
			dataType: 'numeric',
			styleFunction(rowIndex: any, columnIndex: any, value: any, headerText: any, item: any, dataField: any) {
				if (item.duration === null) {
					const style = { background: 'white' };
					return style;
				}
				// 변경 소스
				const key = `${rowIndex}-${columnIndex}`;
				if (styleCache[key]) {
					return styleCache[key];
				}
				const color = durationCheck(item);
				const style = { background: color };
				styleCache[key] = style;
				return style;
			},
		},
		{
			dataField: 'durationTerm',
			headerText: '소비기한(잔여/잔재)',
			width: 110,
			dataType: 'code',
			styleFunction(rowIndex: any, columnIndex: any, value: any, headerText: any, item: any, dataField: any) {
				if (item.duration === null) {
					const style = { background: 'white' };
					return style;
				}
				// 변경 소스
				const key = `${rowIndex}-${columnIndex}`;
				if (styleCache[key]) {
					return styleCache[key];
				}
				const color = durationCheck(item);
				const style = { background: color };
				styleCache[key] = style;
				return style;
			},
		},
		{
			headerText: '상품이력정보',
			children: [
				{ dataField: 'serialNo', headerText: '이력번호', width: 110, disableMoving: true },
				{ dataField: 'barcode', headerText: '바코드', width: 120, disableMoving: true },
				{ dataField: 'convSerialNo', headerText: 'B/L 번호', width: 120, disableMoving: true },
				{ dataField: 'contractType', headerText: '계약유형', width: 90, dataType: 'code', disableMoving: true },
				{ dataField: 'contractCompany', headerText: '계약업체', width: 120, dataType: 'code', disableMoving: true },
				{ dataField: 'contractCompanyName', headerText: '계약업체명', width: 140, disableMoving: true },
				{
					dataField: 'contractCompanyEmpName1',
					headerText: '관리 사원명',
					width: 120,
					dataType: 'code',
					disableMoving: true,
				},
				{ dataField: 'fromValidDt', headerText: '유효일자(FROM)', width: 110, dataType: 'code', disableMoving: true },
				{ dataField: 'toValidDt', headerText: '유효일자(TO)', width: 110, disableMoving: true },
			],
		},
		{ dataField: 'poKey', headerText: 'POKEY', dataType: 'code', width: 120 },
		{ dataField: 'poLine', headerText: 'POLINE', dataType: 'code', width: 80 },
		{
			dataField: 'realYn',
			headerText: '가/진PO 여부',
			dataType: 'code',
			width: 100,
		},
		{
			dataField: 'duration',
			headerText: '소비기한',
			width: 90,
			visible: false,
			dataType: 'numeric',
			styleFunction(rowIndex: any, columnIndex: any, value: any, headerText: any, item: any, dataField: any) {
				if (item.duration === null) {
					const style = { background: 'white' };
					return style;
				}
				const key = `${rowIndex}-${columnIndex}`;
				if (styleCache[key]) {
					return styleCache[key];
				}

				const color = durationCheck(item);
				const style = { background: color };
				styleCache[key] = style;
				return style;
			},
		},
		{
			dataField: 'somdcode',
			visible: false,
		},
		{
			dataField: 'somdname',
			visible: false,
		},
	];

	//그리드 Props
	const gridProps = {
		editable: false,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
	};

	//그리드 footer
	const footerLayout = [
		{
			dataField: 'slipDt',
			positionField: 'slipDt',
			operation: 'COUNT',
			postfix: ' rows',
		},
	];

	/**
	 * =====================================================================
	 * 02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * 그리드row의 소비기한에 따라 color 세팅
	 * @param row
	 * @param item
	 * @returns
	 */
	const durationCheck = (item: any) => {
		if (!isEmpty(item.duration)) {
			return 'white';
		} else {
			return commUtil.gfnDurationCheck(item.lotTable01, item.duration, item.durationType, 'default');
		}
	};

	/**
	 * 상품코드 세팅
	 * @param startIndex
	 * @param endIndex
	 * @param specCode
	 * @returns
	 */
	const setSepecCodeDetail = (startIndex: number, endIndex: number, specCode: string) => {
		if (specCode === '' || specCode === undefined) return;
		const code = specCode;
		if (isEmpty(specCode)) return '';
		const prefix = code.substring(startIndex, endIndex); // 대분류 예시
		if (typeof code !== 'string' || prefix.length != endIndex) return '';

		return specCodeMap[prefix] ?? '';
	};

	/**
	 * 이메일 발송
	 */
	const sendEmail = () => {
		const chkDataList = ref.gridRef.current.getCheckedRowItemsAll();
		if (chkDataList.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_007', ['이메일 전송대상 ']), // 이메일 전송 대상 을(를) 선택해 주십시오.
				modalType: 'warning',
			});
			return;
		}

		// 담당자에게 이메일 발송하시겠습니까?
		showConfirm(null, t('msg.MSG_COM_VAL_240'), () => {
			const param = {
				saveList: chkDataList,
			};

			apiSendEmail(param).then(res => {
				if (res.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_VAL_220'), // 이메일이 발송됐습니다.
						modalType: 'info',
					});
				}
			});
		});
	};

	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'btn1',
				callBackFn: sendEmail,
			},
		],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	// 그리드 초기 데이터 세팅
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);
			if (props.data?.length > 0) {
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	//상품 코드 세팅(전체)
	useEffect(() => {
		const param = {
			specCategory: 'SKUGROUP',
		};
		apiGetgetSkuSpecForMsExDcRate(param).then(res => {
			const map: { [key: string]: string } = {};
			res.data.forEach((item: { specCode: string; specDescr: string }) => {
				map[item.specCode] = item.specDescr;
			});

			setspecCodeMap(map);
		});
	}, []);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt} gridBtn={gridBtn}></GridTopBtn>
				{Object.keys(specCodeMap).length > 0 && (
					<AUIGrid
						ref={ref.gridRef}
						name={gridId}
						columnLayout={gridCol}
						gridProps={gridProps}
						footerLayout={footerLayout}
					/>
				)}
			</AGrid>
		</>
	);
});

export default StStockOutOrgDetail;
