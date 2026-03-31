/*
############################################################################
# FiledataField : WDInspectMntPopforDp.tsx
# Description   : 출고결품현황_PDP용 팝업
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
import { Checkbox, Form } from 'antd';
import { v4 as uuidv4 } from 'uuid';

// component
import { InputText, SearchForm, SelectBox } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

interface PropsType {}

const WDInspectMntPopforDp = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	const [form] = Form.useForm();

	const [searchBox] = useState();
	const [titleName, setTitleName] = useState<any>(null);

	const { t } = useTranslation();
	const gridRef = useRef(null);
	const [totalCount, setTotalCount] = useState(0);
	const gridId = uuidv4() + '_gridWrap';

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

	const gridProps = {
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
				<PopupMenuTitle name={`출고검수기준 결품현황`} />
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

				{/* 그리드 영역 */}
				<AGrid className="contain-wrap pm-blue">
					<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
				</AGrid>

				{/* <ButtonWrap data-props="single">
					<Button onClick={close}>{t('lbl.CLOSE')}</Button>
				</ButtonWrap> */}
			</div>
		</>
	);
};

export default WDInspectMntPopforDp;
