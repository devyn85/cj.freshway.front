/*
 ############################################################################
 # FiledataField	: TmWorklogByCarDetail.tsx
 # Description		: 배차작업로그(차량) 상세
 # Author			: jungyunkwon(jungyun8667@cj.net)
 # Since			: 2025.06.23
 ############################################################################
*/

// API Call Function
import { apiGetWorkLogByCarDetailList } from '@/api/tm/apiTmWorklogByCar';

// Style & CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Components
import { default as CmCarInfoPopup } from '@/components/cm/popup/CmCarInfoPopup';
import { default as CmCustInfoPopup } from '@/components/cm/popup/CmCustInfoPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';

// Libs
import GridAutoHeight from '@/components/common/GridAutoHeight';
import Splitter from '@/components/common/Splitter';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { v4 as uuidv4 } from 'uuid';

//Utils
interface TmWorklogByCarProps {
	form?: any;
	data: any;
	totalCnt: any;
	callBackFn: any;
}
const TmWorklogByCarDetail = forwardRef((props: TmWorklogByCarProps, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	// grid Ref
	ref.gridRef = useRef();
	ref.gridRef1 = useRef();

	const refCustModal = useRef(null);
	const [custModalParam, setCustModalParam] = useState<any>({});

	const refCarModal = useRef(null);
	const [carModalParam, setCarModalParam] = useState<any>({});

	const [dtlGridCnt, setDtlGridCnt] = useState(0);

	//그리드 컬럼
	const gridId = uuidv4() + '_gridWrap';
	const gridCol = [
		{
			dataField: 'dccode',
			headerText: t('lbl.DCCODE'),
			dataType: 'code',
		},
		{
			dataField: 'deliverydt',
			headerText: t('lbl.DELIVERYDT'),
			dataType: 'date',
		},
		{
			dataField: 'districtgroup',
			headerText: t('lbl.DISTRICTGROUP'),
			dataType: 'code',
		},
		{
			dataField: 'deliverygroup',
			headerText: t('lbl.DELIVERYGROUP'),
			dataType: 'code',
		},
		{
			dataField: 'priority',
			headerText: t('lbl.PRIORITY'),
			dataType: 'code',
		},
		{
			dataField: 'custtype',
			headerText: t('lbl.CUSTTYPE'),
			dataType: 'text',
			width: '10%',
			visible: false,
		},
		{
			dataField: 'carno',
			headerText: t('lbl.CARNO'),
			dataType: 'text',
		},
		{
			dataField: 'slipcnt',
			headerText: t('lbl.SLIPCNT'),
			dataType: 'numeric',
		},
		{
			dataField: 'custcnt',
			headerText: t('lbl.CUSTCNT'),
			dataType: 'numeric',
		},
		{
			dataField: 'cube',
			headerText: t('lbl.CUBE_UOM'),
			dataType: 'numeric',
		},
		{
			dataField: 'weight',
			headerText: t('lbl.WEIGHT_KG_UOM'),
			dataType: 'numeric',
		},
		{
			dataField: 'status',
			headerText: t('lbl.STATUS'),
			dataType: 'code',
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		//selectionMode: 'singleRow',
		showRowCheckColumn: false,
		// clickable: true,
	};

	// 그리드 상세 컬럼
	const gridId1 = uuidv4() + '_gridWrap';
	const gridCol1 = [
		{
			dataField: 'serialkey',
			headerText: t('lbl.SERIALKEY'),
			dataType: 'code',
		},
		{
			dataField: 'deliveryno',
			headerText: t('lbl.DELIVERYNO'),
			dataType: 'code',
		},
		{
			dataField: 'precarno',
			headerText: t('lbl.PRECARNO'),
			dataType: 'code',
		},
		{
			dataField: 'predeliverygroup',
			headerText: t('lbl.PREDELIVERYGROUP'),
			dataType: 'code',
		},
		{
			dataField: 'prepriority',
			headerText: t('lbl.PREPRIORITY'),
			dataType: 'code',
		},
		{
			dataField: 'districtgroup',
			headerText: t('lbl.DISTRICTGROUP'),
			dataType: 'code',
		},
		{
			dataField: 'deliverygroup',
			headerText: t('lbl.DELIVERYGROUP'),
			dataType: 'code',
		},
		{
			dataField: 'priority',
			headerText: t('lbl.PRIORITY'),
			dataType: 'code',
		},
		{
			dataField: 'carno',
			headerText: t('lbl.CARNO'),
			dataType: 'text',
		},
		{
			dataField: 'modifylog',
			headerText: t('lbl.MODIFYLOG'),
			dataType: 'code',
		},
		{
			dataField: 'slipno',
			headerText: t('lbl.SLIPNO'),
			dataType: 'code',
		},
		{
			dataField: 'route',
			headerText: t('lbl.ROUTE'),
			dataType: 'text',
		},
		{
			dataField: 'custkey',
			headerText: '거래처코드',
			dataType: 'code',
		},
		{
			dataField: 'custname',
			headerText: '거래처명',
			dataType: 'code',
		},
		{
			dataField: 'docno',
			headerText: t('lbl.DOCNO'),
			dataType: 'code',
		},
		{
			dataField: 'orderqty',
			headerText: t('lbl.ORDERQTY'),
			dataType: 'numeric',
		},
		{
			dataField: 'cube',
			headerText: t('lbl.CUBE_UOM'),
			dataType: 'numeric',
		},
		{
			dataField: 'weight',
			headerText: t('lbl.WEIGHT_KG_UOM'),
			dataType: 'numeric',
		},
		{
			dataField: 'status',
			headerText: t('lbl.STATUS'),
			dataType: 'text',
		},
		{
			dataField: 'delyn',
			headerText: t('lbl.DEL_YN'),
			dataType: 'code',
		},
		{
			dataField: 'logdate',
			headerText: t('lbl.LOGDATE'),
			dataType: 'code',
		},
		{
			dataField: 'logwho',
			headerText: t('lbl.LOGWHO'),
			dataType: 'text',
		},
	];

	// 그리드 Props`
	const gridProps1 = {
		editable: false,
		// //selectionMode: 'singleRow',
		showRowCheckColumn: false,
		// clickable: true,
	};

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * 상세 목록 조회
	 * @param param
	 * @param params
	 * @param row
	 */
	const searchDetailList = (row: any) => {
		if (!row || !row.deliverydt) return;
		const formData = props.form.getFieldsValue();
		const params = { ...row, ...formData };
		ref.gridRef1.current.clearGridData();
		apiGetWorkLogByCarDetailList(params).then(res => {
			const gridData = res.data;
			ref.gridRef1.current.setGridData(gridData);
			setDtlGridCnt(gridData.length);
			if (gridData.length > 0) {
				const colSizeList = ref.gridRef1.current.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				ref.gridRef1.current.setColumnSizeList(colSizeList);
			}
		});
	};

	/**
	 * 그리드 버튼 함수 설정
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const setGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: ref.gridRef1, // 타겟 그리드 Ref
			btnArr: [],
		};

		return gridBtn;
	};
	// 거래처 팝업 열기
	const onOpenCustModal = (row: any) => {
		const params = {
			custkey: row?.custkey,
			custtype: row?.custtype,
			storerkey: row?.storerkey,
		};
		setCustModalParam(params);
		refCustModal.current.handlerOpen();
	};
	// 차량 팝업 열기
	const onOpenCarModal = (row: any) => {
		const params = { carno: row?.carno };
		setCarModalParam(params);
		refCarModal.current.handlerOpen();
	};
	// 거래처 팝업 닫기
	const onCloseCustModal = () => {
		refCustModal?.current.handlerClose();
		setCustModalParam({});
	};
	// 차량 팝업 닫기
	const onCloseCarModal = () => {
		refCarModal?.current.handlerClose();
		setCarModalParam({});
	};
	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		ref.gridRef.current.bind('selectionChange', function (event: any) {
			// 상세코드 조회
			searchDetailList(ref.gridRef.current.getSelectedRows()[0]);
		});
		ref.gridRef.current?.bind('cellDoubleClick', function (event: any) {
			if (event.dataField == 'carno') {
				onOpenCarModal(event.item);
			}
		});
		ref.gridRef1.current?.bind('cellDoubleClick', function (event: any) {
			if (event.dataField == 'custkey') {
				onCloseCustModal();
			}
			if (event.dataField == 'carno') {
				onCloseCarModal();
			}
		});
	};
	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// 부모 컴포넌트로 전달할 함수
	useImperativeHandle(ref, () => ({
		resetDetail: () => {
			ref.gridRef.current.clearGridData();
			ref.gridRef1.current.clearGridData();
		},
	}));
	// 최초 마운트시 초기화
	useEffect(() => {
		initEvent();
	});

	//마스터 그리드 데이터 변경시 렌더링
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;

		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);
			if (props.data.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRefCur.getFitColumnSizeList(true);
				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRefCur.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef?.current?.resize?.('100%', '100%');
		ref.gridRef1?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<>
						<AGrid>
							<GridTopBtn gridBtn={setGridBtn()} gridTitle={'목록'} totalCnt={props.totalCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} name={gridId} />
						</GridAutoHeight>
					</>,
					<>
						<AGrid>
							<GridTopBtn gridBtn={setGridBtn()} gridTitle={'상세'} totalCnt={dtlGridCnt} />
						</AGrid>
						<GridAutoHeight>
							<AUIGrid ref={ref.gridRef1} columnLayout={gridCol1} gridProps={gridProps1} name={gridId1} />
						</GridAutoHeight>
					</>,
				]}
			/>

			{/* 차량 info 팝업 */}
			<CustomModal ref={refCarModal} width="1000px">
				<CmCarInfoPopup titleName="차량상세" refModal={refCarModal} apiParams={carModalParam} close={onCloseCarModal} />
			</CustomModal>
			{/* 거래처 info 팝업 */}
			<CustomModal ref={refCustModal} width="1000px">
				<CmCustInfoPopup
					titleName={'거래처상세'}
					refModal={refCustModal}
					apiParams={custModalParam}
					close={onCloseCustModal}
				/>
			</CustomModal>
		</>
	);
});
export default TmWorklogByCarDetail;
