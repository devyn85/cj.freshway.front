/*
 ############################################################################
 # FiledataField  : NewMasterDetail.tsx
 # Description    : 신규 마스터 그리드 (리사이즈 최적화)
 ############################################################################
 */
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';

// API
import { apiGetKpDcNewMasterDetailList } from '@/api/kp/apiDcMonitoring';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import styled from 'styled-components';

const NewMasterDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	// grid Ref
	ref.gridRefGrp = useRef();
	ref.gridRefDtl = useRef();

	const gridCol = [
		{
			headerText: t('구분'),
			dataField: 'gubunNm',
		},
		{
			headerText: t('전일'),
			dataField: 'preCnt',
			dataType: 'numeric',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any) {
				if (value > 0) {
					return 'body-link';
				} else {
					return '';
				}
			},
			// renderer: {
			// 	type: 'LinkRenderer',
			// 	baseUrl: 'javascript',
			// 	jsCallback: function () {
			// 		// "0" 일때 없애는 방법?
			// 	},
			// },
		},
		{
			headerText: t('금일'),
			dataField: 'curCnt',
			dataType: 'numeric',
			styleFunction: function (rowIndex: any, columnIndex: any, value: any) {
				if (value > 0) {
					return 'body-link';
				} else {
					return '';
				}
			},
			// renderer: {
			// 	type: 'LinkRenderer',
			// 	baseUrl: 'javascript',
			// 	jsCallback: function () {
			// 		// "0" 일때 없애는 방법?
			// 	},
			// },
		},
	];

	// 신규 마스터 그리드 속성 설정
	const gridProps = {
		editable: false,
		// fillColumnSizeMode: true,
	};

	// 신규 마스터 상세 그리드 칼럼 레이아웃 설정
	const gridColDtl = [
		{
			headerText: t('코드'),
			dataField: 'code',
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					if (e?.item?.gubun === 'SKU') {
						ref.gridRefGrp?.current?.openPopup(
							{
								sku: e.item.code,
								skuDescr: e.item.name,
							},
							'sku',
						);
					} else if (e?.item?.gubun === 'CUST') {
						const selectedRow = ref.gridRefGrp?.current?.getSelectedRows();
						ref.gridRefGrp?.current?.openPopup(
							{ custkey: e.item.code, custtype: selectedRow?.[0]['gubunType'] || 'C' },
							'cust',
						);
					}
				},
			},
		},
		{
			headerText: t('명'),
			dataField: 'name',
		},
	];

	// 신규 마스터 상세 그리드 속성 설정
	const gridPropsDtl = {
		editable: false,
		// fillColumnSizeMode: true,
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 신규 마스터 상세 정보 조회
	 * @param {any} item 선택된 Row
	 * @returns {void}
	 */
	const searchDtl = (item: any) => {
		ref.gridRefDtl?.current?.clearGridData();

		if (commUtil.isNotEmpty(item?.['rowIndex'])) {
			const selectedRow = ref.gridRefGrp?.current?.getItemByRowIndex(item?.['rowIndex']);
			if (commUtil.isNotEmpty(selectedRow) && !ref.gridRefGrp?.current?.isAddedById(selectedRow._$uid)) {
				const params = {
					gubun: selectedRow.gubun,
					gubunType: selectedRow.gubunType,
					preYn: item?.['dataField'] === 'preCnt' ? 'Y' : 'N',
				};
				apiGetKpDcNewMasterDetailList(params).then(res => {
					const gridData = res.data;
					ref.gridRefDtl?.current?.setGridData(gridData);

					// 조회된 결과에 맞게 칼럼 넓이 적용 시킴
					ref.gridRefDtl?.current?.setColumnSizeList(ref.gridRefDtl?.current?.getFitColumnSizeList(true));
				});
			} else {
				return;
			}
		}
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = ref.gridRefGrp.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);
			searchDtl(0);
		}
	}, [props.data]);

	useEffect(() => {
		const gridRefCur = ref.gridRefGrp?.current;

		// 그룹 코드 그리드 행 변경 시
		gridRefCur?.bind('selectionChange', function (event: any) {
			if (event.primeCell?.['dataField'] !== 'gubunNm' && event.primeCell?.['value'] !== '0') {
				searchDtl(event.primeCell);
			}
		});
	}, []);

	return (
		<Wrap>
			<Item>
				<GridTopBtn gridTitle={t('신규 마스터')} style={{ marginBottom: '10px' }} />
				<GridAutoHeight id="newMasterGrid">
					<AUIGrid ref={ref.gridRefGrp} columnLayout={gridCol} gridProps={gridProps} />
				</GridAutoHeight>
			</Item>
			<Item>
				<GridTopBtn gridTitle={t('상세 내역')} style={{ marginBottom: '10px' }} />
				<GridAutoHeight id="newMasterDetailGrid">
					<AUIGrid ref={ref.gridRefDtl} columnLayout={gridColDtl} gridProps={gridPropsDtl} />
				</GridAutoHeight>
			</Item>
		</Wrap>
	);
});

const Wrap = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
	gap: 8px;
`;

const Item = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export default NewMasterDetail;
