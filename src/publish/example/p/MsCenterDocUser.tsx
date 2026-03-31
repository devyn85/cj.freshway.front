// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Col, Form, Row } from 'antd';
// Util

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Component
import { InputText, SearchFormResponsive, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import MenuTitle from '@/components/common/custom/MenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';
import TableTopBtn from '@/components/common/TableTopBtn';

// Store

// API

const MsCenterDocUser = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const groupRef = useRef<HTMLUListElement>(null);
	const [expanded, setExpanded] = useState(false);

	//검색영역 초기 세팅
	const [searchBox] = useState({
		timezoneCd: 'Asia/Seoul',
	});

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 그리드 컬럼을 설정한다.
	 * @returns {object[]} 그리드 컬럼 설정 객체
	 */
	const getGridCol = () => {
		return [
			{
				dataField: 'empNo',
				headerText: '순번',
			},
			{
				headerText: '사용자이름',
			},
			{
				headerText: '물류센터',
			},
			{
				headerText: 'EMAIL',
			},
			{
				headerText: '삭제여부',
			},
			{
				headerText: '등록자',
			},
			{
				headerText: '등록시간',
			},
		];
	};

	/**
	 * 그리드 속성을 설정한다.
	 * @returns {object} 그리드 속성 설정 객체
	 */
	const getGridProps = () => {
		return {
			editable: true,
			fillColumnSizeMode: false,
			enableColumnResize: true,
			showRowCheckColumn: true,
			enableFilter: true,
		};
	};

	/**
	 * 그리드 버튼 함수를 설정한다.
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'save', // 저장
				},
			],
		};

		return gridBtn;
	};

	// 표 버튼 설정
	const tableBtn: TableBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 저장
			},
		],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle authority="searchYn|saveYn" name={'센터서류 담당자관리'} />

			<SearchFormResponsive form={form} initialValues={searchBox}>
				<li>
					<InputText label={'사용자이름'} />
				</li>
				<li>
					<SelectBox label={'삭제여부'} />
				</li>
			</SearchFormResponsive>
			<Row gutter={8}>
				<Col span={12}>
					<AGrid>
						<GridTopBtn gridTitle={'센터서류담당자 목록'} gridBtn={getGridBtn()} totalCnt={props.totalCnt} />
						<AUIGrid columnLayout={getGridCol()} gridProps={getGridProps()} />
					</AGrid>
				</Col>
				<Col span={12}>
					<AGrid>
						<TableTopBtn tableTitle={'물류센터내역'} tableBtn={tableBtn} />
						<Row gutter={0}>
							<Col span={24}>
								<UiDetailViewArea>
									<UiDetailViewGroup className="grid-column-2" ref={groupRef}>
										<li>
											<InputText label={'사용자이름'} placeholder="사용자이름 입력" />
										</li>
										<li>
											<SelectBox label={'물류센터'} placeholder="물류센터 입력" />
										</li>
										<li>
											<InputText label={'EMAIL'} placeholder="EMAIL 입력" />
										</li>
										<li>
											<SelectBox label={'삭제여부'} placeholder="삭제여부 입력" />
										</li>
										<li>
											<DatePicker label={'등록일자'} />
										</li>
										<li>
											<DatePicker label={'최종변경시간'} />
										</li>
										<li>
											<InputText label={'생성인'} placeholder="생성인 입력" />
										</li>
										<li>
											<InputText label={'최정변경자'} placeholder="최정변경자 입력" />
										</li>
									</UiDetailViewGroup>
								</UiDetailViewArea>
							</Col>
						</Row>
					</AGrid>
				</Col>
			</Row>
		</>
	);
});

export default MsCenterDocUser;
