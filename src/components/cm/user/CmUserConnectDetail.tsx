// Lib
import AGrid from '@/assets/styled/AGrid/AGrid';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';

// Util

// Type
import { GridBtnPropsType, TableBtnPropsType } from '@/types/common';

// Component
import { CheckBox, Datepicker, InputSearch, InputText, RadioBox, SelectBox } from '@/components/common/custom/form';
import GridTopBtn from '@/components/common/GridTopBtn';
import TableTopBtn from '@/components/common/TableTopBtn';

// Store

// API

// CSS
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

const CmUserConnectDetail = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// grid Ref
	ref.gridRef = useRef();
	ref.gridRef1 = useRef();

	// 그룹코드 그리드 칼럼 레이아웃 설정
	const gridCol = [
		{
			headerText: '사용자아이디',
			dataField: '사용자아이디',
		},
		{
			headerText: '물류센터',
			dataField: '물류센터',
		},
		{
			headerText: '회사',
			dataField: '회사',
		},
		{
			headerText: '창고',
			dataField: '창고',
		},
		{
			headerText: '작업구역',
			dataField: '작업구역',
		},
		{
			headerText: '권한코드',
			dataField: '권한코드',
		},
		{
			headerText: '접속서버',
			dataField: '접속서버',
		},
		{
			headerText: '접속데이터베이스',
			dataField: '접속데이터베이스',
		},
		{
			headerText: '접속유형',
			dataField: '접속유형',
		},
		{
			headerText: '진행상태',
			dataField: '진행상태',
		},
		{
			headerText: '삭제여부',
			dataField: '삭제여부',
		},
	];

	// 사용자 목록 그리드 속성 설정
	const gridPropsUser = {
		// scrollHeight: 10, // 스크롤의 높이
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	// 마스터 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
	};

	// 사용자 상세 버튼 설정
	const tableBtn: TableBtnPropsType = {
		tGridRef: ref.gridRef, // 사용자 목록 그리드 Ref
		btnArr: [
			{
				btnType: 'pre', // 이전
			},
			{
				btnType: 'post', // 다음
			},
			{
				btnType: 'new', // 신규
			},
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
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		const gridRefCurDtl = ref.gridRefDtl.current;

		// 마스터 그리드 행 변경 시
		gridRefCur.bind('selectionChange', function () {
			// 상세코드 조회
		});

		// 상세 그리드 행 변경 시
		gridRefCurDtl?.bind('cellEditBegin', function (event: any) {
			if (!'storerkey/codelist'.includes(event.dataField)) {
				return true;
			} else {
				return false;
			}
		});
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = ref.gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
			gridRefCur?.setSelectionByIndex(0, 0);
		}
	}, [props.data]);

	return (
		<>
			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={'접근권한 목록'} totalCnt={props.totalCnt} />
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridPropsUser} />
			</AGrid>

			<Form>
				<AGrid>
					<TableTopBtn tableTitle={'접근권한 상세'} tableBtn={tableBtn} />
					<UiDetailViewArea>
						<UiDetailViewGroup className="grid-column-4">
							<li>
								<Datepicker label={'코너코드'} required />
							</li>
							<li>
								<span>
									<InputText label={'input 2단'} readOnly /> ~
									<InputText readOnly span={7} />
								</span>
							</li>

							<li>
								<span>
									<InputText label={'상품코드'} />
									<Button type={'default'}>버튼</Button>
								</span>
							</li>
							<li>
								<RadioBox
									label="RadioBox"
									name="radioBasic1"
									required
									rules={[{ required: true, validateTrigger: 'none' }]}
								/>
							</li>
							<li>
								<SelectBox label={'재고위치'} />
							</li>
							<li>
								<span>
									<CheckBox label={'CheckBox단일'} name="cbxBasic1">
										사용
									</CheckBox>
									<CheckBox name="cbxBasic2">미사용</CheckBox>
									<CheckBox name="cbxBasic2">미사용</CheckBox>
									<CheckBox name="cbxBasic2">미사용</CheckBox>
								</span>
							</li>
							<li>
								<span>
									<InputText label={'코너대표 이미지'} placeholder="검색어 입력" />
									~
									<InputText placeholder="검색어 입력" />
								</span>
							</li>
							<li>
								<InputSearch label={'코너명'} placeholder="검색어 입력" required />
							</li>
							<li>
								<SelectBox label={'코너설명'} />
							</li>
							<li>
								<SelectBox label={'코너대표 이미지\n'} />
							</li>
							<li>
								<SelectBox label={'표시순서'} />
							</li>
							<li>
								<SelectBox label={'재고위치'} />
							</li>
							<li>
								<SelectBox label={'재고숙성'} />
							</li>
							<li>
								<InputText label={'이력번호'} placeholder="입력" />
							</li>
							<li>
								<InputSearch label={'피킹존'} placeholder="검색어 입력" />
							</li>
							<li>
								<SelectBox label={'로케이션종류'} />
							</li>
							<li>
								<InputSearch label={'기준일(유통,제조)'} placeholder="검색어 입력" />
							</li>
						</UiDetailViewGroup>
					</UiDetailViewArea>
				</AGrid>
			</Form>
		</>
	);
});

export default CmUserConnectDetail;
