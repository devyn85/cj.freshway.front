// lib

// component
import { Button, InputText } from '@/components/common/custom/form';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { GridBtnPropsType } from '@/types/common';
import { Form } from 'antd';

// store

// API Call Function

// util

// hook

// type

// asset
import { apiGetDocumentKx, apiGetKxCloseDocPopupTCS } from '@/api/kp/apiKpKxCloseDocPopup';
import AGrid from '@/assets/styled/AGrid/AGrid';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import GridTopBtn from '@/components/common/GridTopBtn';
import Splitter from '@/components/common/Splitter';

const KpKxClosePopupKxInfo = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	// grid Ref
	ref.gridRef1 = useRef();
	ref.gridRef2 = useRef();
	const [form] = Form.useForm();
	const [totalCntDocDtl, setTotalCntDocDtl] = useState(0);

	//마스터 그리드 생성시 필요한 변수들
	const gridCol = [
		{
			headerText: t('소유권이전번호'), // 소유권이전번호
			dataField: 'transferkey',
			dataType: 'text',
		},
		{
			headerText: t('창고명'), // 창고명
			dataField: 'organizeName',
			dataType: 'text',
		},
		{
			headerText: t('센터코드(KX)'), // 센터코드(KX)
			dataField: 'kxDccode',
			dataType: 'text',
		},
		{
			headerText: t('품목번호'), // 품목번호
			dataField: 'docline',
			dataType: 'text',
		},
		{
			headerText: t('출고수량'), // 출고수량
			dataField: 'shippedqty',
			dataType: 'numeric',
		},
		{
			headerText: t('최초 실적 처리시간'), // 최초 실적 처리시간
			dataField: 'procTime',
			dataType: 'text',
		},
	];

	// 그리드 버튼
	const gridBtn1: GridBtnPropsType = {
		tGridRef: ref.gridRef1, // 타겟 그리드 Ref
	};

	// AUIGrid 옵션
	const gridProps = {
		fillColumnSizeMode: false,
		enableColumnResize: true,
		enableFilter: true,
	};

	const gridColIF = [
		{
			headerText: t('I/F내역 생성시간'), // I/F내역 생성시간
			dataField: 'createTime',
			dataType: 'text',
		},
		{
			headerText: t('소유권이전번호'), // 소유권이전번호
			dataField: 'orderkey',
			dataType: 'text',
		},
		{
			headerText: t('소유권이전품목번호'), // 소유권이전품목번호
			dataField: 'orderlinenumber',
			dataType: 'text',
		},
		{
			headerText: t('상품코드'), // 상품코드
			dataField: 'sku',
			dataType: 'text',
		},
		{
			headerText: t('실적수량'), // 실적수량
			dataField: 'shippedqty',
			dataType: 'numeric',
		},
		{
			headerText: t('단위'), // 단위
			dataField: 'uom',
			dataType: 'text',
		},
	];

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * 그리드 이벤트 초기화
	 */
	// const initEvent = () => {};

	/**
	 * KX마감진행 현황 상세 조회
	 * @param {number} rowIndex 선택된 Row Index
	 * @returns {void}
	 */
	const searchDtl = () => {
		const selectedRow = ref.gridRef1.current?.getSelectedRows();
		if (selectedRow.length > 0 && !ref.gridRef1.current.isAddedById(selectedRow[0]._$uid)) {
			// setSelectedRowIndex(ref.gridRef.current.getSelectedIndex()[0]); // rowIndex 저장

			const params = {
				transferkey: selectedRow[0].transferkey,
				kxDccode: selectedRow[0].kxDccode,
			};

			apiGetKxCloseDocPopupTCS(params).then(res => {
				const gridData = res.data;
				ref.gridRef2.current.setGridData(gridData);
				setTotalCntDocDtl(gridData.length);
				// 조회된 결과에 맞게 칼럼 넓이 적용 시킴
				ref.gridRef2.current.setColumnSizeList(ref.gridRef2.current.getFitColumnSizeList(true));
			});
		} else {
			return;
		}
	};

	const onClickSaveInspectAll = () => {
		const params = {
			docno: form.getFieldValue('inputDocno'),
		};

		apiGetDocumentKx(params).then(res => {
			if (res.data?.length > 0) {
				ref.gridRef1.current.setGridData(res.data);
			} else {
				ref.gridRef1.current.clearGridData();
				ref.gridRef2.current.clearGridData();
			}
		});
	};

	let prevRowIndex: any = null;
	useEffect(() => {
		const gridRefCur = ref.gridRef1.current;

		// 그룹 코드 그리드 행 변경 시
		gridRefCur.bind('selectionChange', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell.rowIndex === prevRowIndex) return;

			// 이전 행 인덱스 갱신
			prevRowIndex = event.primeCell.rowIndex;

			searchDtl();
		});

		let prevRowIndex2: any = null;
		// 그룹 코드 그리드 행 변경 시
		ref.gridRef2?.current.bind('selectionChange', function (event: any) {
			// 선택된 Row가 다를 경우에만 검색
			if (event.primeCell.rowIndex === prevRowIndex2) return;

			// 이전 행 인덱스 갱신
			prevRowIndex2 = event.primeCell.rowIndex;
		});
	}, []);

	useEffect(() => {
		// 상세 초기화
		ref.gridRef2.current.clearGridData();
		const gridRefCur1 = ref.gridRef1.current;

		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				const colSizeList = gridRefCur1.getFitColumnSizeList(true);
				gridRefCur1.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		ref.gridRef1?.current?.resize?.('100%', '100%');
		ref.gridRef2?.current?.resize?.('100%', '100%');
	}, []);

	return (
		<>
			<div style={{ height: '500px', minHeight: '710px' }}>
				<Splitter
					direction="vertical"
					onResizing={resizeAllGrids}
					onResizeEnd={resizeAllGrids}
					items={[
						<>
							<AGrid className="h-auto">
								<GridTopBtn gridBtn={gridBtn1} gridTitle={'내역'} totalCnt={props.totalCnt}>
									<Form layout="inline" form={form} initialValues={{ inputDocno: props.docno }}>
										<li className="flex-wrap">
											<InputText name="inputDocno" />
											<Button onClick={onClickSaveInspectAll} className="ml5">
												조회
											</Button>
										</li>
									</Form>
								</GridTopBtn>
							</AGrid>
							<GridAutoHeight>
								<AUIGrid ref={ref.gridRef1} columnLayout={gridCol} gridProps={gridProps} />
							</GridAutoHeight>
						</>,
						<>
							<AGrid>
								<GridTopBtn gridBtn={gridBtn1} gridTitle={'TCS 소유권처리상태'} />
							</AGrid>
							<GridAutoHeight>
								<AUIGrid ref={ref.gridRef2} columnLayout={gridColIF} />
							</GridAutoHeight>
						</>,
					]}
				/>
			</div>
		</>
	);
});

export default KpKxClosePopupKxInfo;
