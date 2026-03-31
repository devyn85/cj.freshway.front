//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import AGridWrap from '@/assets/styled/AGridWrap/AGridWrap';

//API

//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';

//Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Col, Row, Tabs } from 'antd';
const { TabPane } = Tabs;

// Utils
// API Call Function

const orderCreationSTOOrdBaseDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	ref.gridRef = useRef();
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	//그리드 컬럼
	const gridCol = [
		{
			headerText: t('title'), //물류센터
		},
	];

	// 그리드 Props
	const gridProps = {
		editable: false,
		showStateColumn: true, // row 편집 여부
		fillColumnSizeMode: false,
		showFooter: false,
	};

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelUpload', // 엑셀업로드
			},
			{
				btnType: 'plus', // 행추가
			},
			{
				btnType: 'delete', // 행삭제
			},
			{
				btnType: 'save', // 저장
			},
		],
	};

	return (
		<>
			{/* 그리드 영역 */}

			<AGridWrap>
				<Row gutter={16}>
					<Col>
						<Tabs defaultActiveKey="11">
							<TabPane tab="피킹유형  자동 설정" key="11">
								<AGrid>
									<GridTopBtn gridBtn={gridBtn} />
									<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
								</AGrid>
							</TabPane>
						</Tabs>
					</Col>
					<Col>
						<Tabs defaultActiveKey="21">
							<TabPane tab="상품제외" key="21">
								<AGrid>
									<GridTopBtn gridBtn={gridBtn} />
									<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
								</AGrid>
							</TabPane>
							<TabPane tab="센터제외" key="22">
								<AGrid>
									<GridTopBtn gridBtn={gridBtn} />
									<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
								</AGrid>
							</TabPane>
						</Tabs>
					</Col>
					<Col>
						<Tabs defaultActiveKey="31">
							<TabPane tab="수급 센터 우선 순위 설정" key="31">
								<AGrid>
									<GridTopBtn gridBtn={gridBtn} />
									<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} />
								</AGrid>
							</TabPane>
						</Tabs>
					</Col>
				</Row>
			</AGridWrap>
		</>
	);
});

export default orderCreationSTOOrdBaseDetail;
