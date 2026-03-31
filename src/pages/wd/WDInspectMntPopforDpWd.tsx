/*
############################################################################
# FiledataField : WDInspectMntPopforDpWd.tsx
# Description   : 출고결품현황_PDP 입고+출고용 팝업
# Author        : 
# Since         : 
############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Checkbox, Col, Form, Row } from 'antd';

// component
import { InputText, SearchForm, SelectBox } from '@/components/common/custom/form';
import GridTopBtn from '@/components/common/GridTopBtn';

interface PropsType {}

const WDInspectMntPopforDpWd = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	const [form] = Form.useForm();

	const [searchBox] = useState();

	const { t } = useTranslation();
	const gridRef = useRef(null);
	const gridRef1 = useRef(null);
	const [totalCount, setTotalCount] = useState(0);

	// window.open으로 열렸는지 확인
	const isWindowPopup = typeof window !== 'undefined' && window.opener && window.opener !== window;

	const gridCol = [
		{
			headerText: t('POP'),
		},
		{
			headerText: t('협력사명'),
		},
		{
			headerText: t('거래처명'),
		},
		{
			headerText: t('상품명'),
		},
		{
			headerText: t('단위'),
		},
		{
			headerText: t('예정량'),
		},
		{
			headerText: t('입고량'),
		},
	];

	const gridCol1 = [
		{
			headerText: t('POP'),
		},
		{
			headerText: t('협력사명'),
		},
		{
			headerText: t('거래처명'),
		},
		{
			headerText: t('상품명'),
		},
		{
			headerText: t('단위'),
		},
		{
			headerText: t('예정량'),
		},
		{
			headerText: t('입고량'),
		},
	];

	const gridProps = {
		editable: false,
		fillColumnSizeMode: true,
	};

	const gridProps1 = {
		editable: false,
		fillColumnSizeMode: true,
	};

	const gridBtn = {
		tGridRef: gridRef,
		btnArr: [
			{
				btnType: null as any,
			},
		],
	};

	const gridBtn1 = {
		tGridRef: gridRef,
		btnArr: [
			{
				btnType: null as any,
			},
		],
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 팝업 닫기
	 */
	// const handleClose = () => {
	// 	if (isWindowPopup) {
	// 		window.close();
	// 	} else {
	// 		propsClose?.();
	// 	}
	// };

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			<div className="pdp-monitor">
				{/* 상단 타이틀 및 페이지버튼 */}
				<SearchForm form={form} initialValues={searchBox} isAlwaysVisible>
					<UiFilterArea>
						<UiFilterGroup className="grid-column-4">
							<li>
								<InputText value={'2025-11-14'} />
							</li>
							<li>
								<SelectBox value={'냉동'} />
							</li>
							<li className="flex-wrap pl10" style={{ gridColumn: 'span 2' }}>
								<Checkbox>On</Checkbox>
							</li>
						</UiFilterGroup>
					</UiFilterArea>
				</SearchForm>
				<Row className="h100">
					<Col span={12} className="pm-blue">
						<AGrid className="h100">
							<GridTopBtn gridTitle={t('입고검수기준 결품현황')} gridBtn={gridBtn} />
							<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
						</AGrid>
					</Col>
					<Col span={12} className="pm-red">
						<AGrid className="h100">
							<GridTopBtn gridTitle={'출고검수기준 결품현황'} gridBtn={gridBtn1} />
							<AUIGrid ref={gridRef1} columnLayout={gridCol1} gridProps={gridProps1} />
						</AGrid>
					</Col>
				</Row>
				{/* <ButtonWrap data-props="single">
					<Button onClick={close}>{t('lbl.CLOSE')}</Button>
				</ButtonWrap> */}
			</div>
		</>
	);
};

export default WDInspectMntPopforDpWd;
