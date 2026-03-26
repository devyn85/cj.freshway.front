import UiAGridGroup from '@/assets/styled/Container/UiAGridGroup';
import UiCeckboxGroup from '@/assets/styled/Container/UiCeckboxGroup';
import UiContentGroup from '@/assets/styled/Container/UiContentGroup';
import UiDetailTableGroup from '@/assets/styled/Container/UiDetailTableGroup';
import UiDetailViewArea from '@/assets/styled/Container/UiDetailViewArea';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import UiListTitleGroup from '@/assets/styled/Container/UiListTitleGroup';

import AGrid from '@/assets/styled/AGrid/AGrid';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

import Footer from '@/layout/Footer/Footer';

import { SearchFormResponsive, InputSearch, InputText, SelectBox } from '@/components/common/custom/form';

import CheckboxGroup from '@/components/common/custom/form/CheckboxGroup';
import { Button, Tabs } from 'antd';
import React from 'react';

const { TabPane } = Tabs;

const PubTemplate: React.FC = () => {
	const getGridCol = () => {
		return [
			{
				dataField: 'empNo',
				headerText: '세부내역',
				width: '10%',
				maxlength: 20,
			},
			{
				headerText: '구매처',
				dataField: 'period',
				dataType: 'numeric',
				postfix: '년',
				width: '10%',
				position: 'middle',
			},
			{
				dataField: 'mailAddr',
				headerText: '구매처명',
				width: '15%',
				maxlength: 20,
			},
			{
				headerText: '실공급 현력사코드',
				dataField: 'salary',
				width: '10%',
				dataType: 'numeric',
				formatString: '#,##0',
				postfix: '원',
			},
			{
				dataField: 'userStatus',
				headerText: '실공급센터',
				width: '10%',
				required: true,
				commRenderer: {
					type: 'dropDown',
					list: '',
				},
			},
			{
				dataField: 'userEnable',
				headerText: '경유지조직',
				width: '10%',
				renderer: {
					type: 'CheckBoxEditRenderer',
					checkValue: '1',
					unCheckValue: '0',
					editable: true,
				},
			},
			{
				dataField: 'regId',
				headerText: '졍유지조직명',
				width: '10%',
				editable: false,
			},
			{
				dataField: 'regDt',
				headerText: '참고',
				width: '10%',
				editable: false,
			},
		];
	};

	const getGridCol2 = () => {
		return [
			{
				dataField: 'empNo',
				headerText: '코너코드',
			},
			{
				headerText: '코너명',
			},
			{
				headerText: '표시순서',
			},
			{
				headerText: '사용여부',
			},
		];
	};

	const cbxGrpopts = [
		{ label: '현재고 0인 상품 제외', value: '' },
		{ label: '로케이션/상품 별 합계표시', value: '' },
	];

	return (
		<>
			<UiContentGroup>
				<Tabs defaultActiveKey="1">
					<TabPane tab="생성 및 체크" key="1">
						<UiFilterArea>
							<UiFilterGroup>
								<li>
									<label data-required>물류센터</label>
									<span>
										<SelectBox />
									</span>
								</li>
								<li>
									<label data-required>창고</label>
									<span>
										<InputSearch placeholder="검색어 입력" />
									</span>
								</li>
								<li>
									<label>정렬순서</label>
									<span>
										<SelectBox />
									</span>
								</li>
								<li>
									<label>상품코드</label>
									<span>
										<InputSearch placeholder="검색어 입력" />
									</span>
								</li>
								<li>
									<label>저장조건</label>
									<span>
										<SelectBox />
									</span>
								</li>
								<li>
									<label>유통기한여부</label>
									<span>
										<SelectBox />
									</span>
								</li>
								<li>
									<label>재고위치</label>
									<span>
										<SelectBox />
									</span>
								</li>
								<li>
									<label>재고숙성</label>
									<span>
										<SelectBox />
									</span>
								</li>
								<li>
									<label>이력번호</label>
									<span>
										<InputText placeholder="입력" />
									</span>
								</li>
								<li>
									<label>피킹존</label>
									<span>
										<InputSearch placeholder="검색어 입력" />
									</span>
								</li>
								<li>
									<label>로케이션종류</label>
									<span>
										<SelectBox />
									</span>
								</li>
								<li>
									<label>기준일(유통,제조)</label>
									<span>
										<InputSearch placeholder="검색어 입력" />
									</span>
								</li>
							</UiFilterGroup>
						</UiFilterArea>

						<UiCeckboxGroup>
							<CheckboxGroup options={cbxGrpopts} />
						</UiCeckboxGroup>

						<UiListTitleGroup>
							<h3>재고 목록</h3>
							<em>총 315건</em>
							<span className="msg">상품 조회 시 속도가 많이 느려지며 서버에 많은 부담을 주게 됩니다.</span>
							<div className="flex-end">
								<em>가이드 판매가:</em>
								<InputText placeholder="판매가 입력" />
								<Button>일괄적용</Button>
								<Button type="primary">저장</Button>
							</div>
						</UiListTitleGroup>

						<UiAGridGroup>
							<AGrid>
								<AUIGrid columnLayout={getGridCol()} />
							</AGrid>
						</UiAGridGroup>

						<div className="rows-bottom-area">test</div>
					</TabPane>

					<TabPane tab="일괄배차" key="2">
						<UiListTitleGroup>
							<h3>코너 목록</h3>
							<em>총 315건</em>
						</UiListTitleGroup>

						<UiAGridGroup>
							<AGrid>
								<AUIGrid columnLayout={getGridCol2()} />
							</AGrid>
							<UiDetailViewArea>
								<h4>
									<span>재고 목록</span>
									<Button>신규</Button>
									<Button type="primary">저장</Button>
								</h4>
								<UiDetailTableGroup>
									<colgroup>
										<col width={100} />
									</colgroup>
									<tr>
										<th>
											<label>코너코드</label>
										</th>
										<td>test</td>
									</tr>
									<tr>
										<th>
											<label data-required>코너명</label>
										</th>
										<td>test</td>
									</tr>
									<tr>
										<th>
											<label data-required>코너설명</label>
										</th>
										<td>test</td>
									</tr>
									<tr>
										<th>
											<label>코너대표 이미지</label>
										</th>
										<td>test</td>
									</tr>
									<tr>
										<th>
											<label>코너대표 이미지</label>
										</th>
										<td>test</td>
									</tr>
									<tr>
										<th>
											<label>표시순서</label>
										</th>
										<td>test</td>
									</tr>
									<tr>
										<th>
											<label>운영시작시간</label>
										</th>
										<td>test</td>
									</tr>
									<tr>
										<th>
											<label>라벨</label>
										</th>
										<td>test</td>
									</tr>
								</UiDetailTableGroup>
							</UiDetailViewArea>
						</UiAGridGroup>
					</TabPane>

					<TabPane tab="배차취소" key="3">
						Content of Tab 3
					</TabPane>
				</Tabs>
			</UiContentGroup>

			<Footer />
		</>
	);
};

export default PubTemplate;
