/**
 * @file Guide.tsx
 * @description 가이드 메인 페이지
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import '../../assets/styles/styles.scss';
import componentData from './componentData.json';
import pageData from './pageData.json';
import pageData1 from './pageData1.json';
import pageData2 from './pageData2.json';
import pageData3 from './pageData3.json';
import pageData4 from './pageData4.json';
import pageData5 from './pageData5.json';
import pageData6 from './pageData6.json';
import pageData7 from './pageData7.json';

const Guide = () => {
	const allList = [
		...pageData.data,
		...pageData1.data,
		...pageData2.data,
		...pageData3.data,
		...pageData4.data,
		...pageData5.data,
		...pageData6.data,
		...pageData7.data,
	];

	const DATA = [
		{ id: 0, menu: '전체', list: allList },
		{ id: 1, menu: '기준정보', list: pageData.data },
		{ id: 2, menu: '주문/배송/입고', list: pageData1.data },
		{ id: 3, menu: '출고', list: pageData2.data },
		{ id: 4, menu: '반품/재고', list: pageData3.data },
		{ id: 5, menu: '지표/모니터링', list: pageData4.data },
		{ id: 6, menu: '정산', list: pageData5.data },
		{ id: 7, menu: 'Admin/배치/마감', list: pageData6.data },
		{ id: 8, menu: '팝업', list: pageData7.data },
		{ id: 9, menu: 'UI 컴포넌트', list: componentData.data },
	];

	const [index, setIndex] = useState(0);
	const [total, setTotal] = useState(0);
	const [del, setDel] = useState(0);
	const [ing, setIng] = useState(0);
	const [mod, setMod] = useState(0);
	const [finish, setFinish] = useState(0);
	const [selectedState, setSelectedState] = useState<number | null>(null);

	const initCount = () => {
		setTotal(0);
		setDel(0);
		setIng(0);
		setMod(0);
		setFinish(0);
		calcProgress();
	};

	const calcProgress = () => {
		const $list = DATA[index].list;
		const counts = $list.reduce(
			(acc, item) => {
				switch (item.state) {
					case 1:
						acc.ing += 1;
						break;
					case 2:
						acc.mod += 1;
						break;
					case 3:
						acc.finish += 1;
						break;
					case 4:
						acc.del += 1;
						break;
					case 5:
						acc.del += 1;
						break;
				}
				return acc;
			},
			{ total: 0, ing: 0, mod: 0, finish: 0, del: 0 },
		);

		setTotal($list.length);
		setIng(counts.ing);
		setMod(counts.mod);
		setFinish(counts.finish);
		setDel(counts.del);
	};

	const calcProgressWidth = (key: number) => {
		return Math.ceil((key / (total - del)) * 100) + '%';
	};

	const STATE_MAP: { [key: number]: { label: string; color: string } } = {
		0: { label: '대기', color: 'secondary' },
		1: { label: '우선진행', color: 'info' },
		2: { label: '진행예정', color: 'success' },
		3: { label: '완료', color: 'danger' },
		4: { label: '취소', color: 'warning' },
		5: { label: '개발완료', color: 'line-through' },
	};

	const getLink = (d: any, index: number) => {
		if (d.state === 4 || !d.url?.length) return null;

		//if (index === 4) return <Link to={`/${d.url}`}>{d.url}</Link>;
		//if (index === 3) return <Link to={`/email/${d.url}.html`}>{d.url}</Link>;
		return (
			<Link to={`/publish/example/p/${d.url}`} target="_blank">
				{d.url}
			</Link>
		);
	};

	const progressBars = [
		{ key: 'ing', count: ing, className: 'bg-info' },
		{ key: 'mod', count: mod, className: 'bg-success' },
		{ key: 'finish', count: finish, className: 'bg-danger' },
	];

	useEffect(() => {
		initCount();
	}, [index]);

	return (
		<>
			<div className="guide__section">
				<h1 className="guide__title">가이드 페이지</h1>
				<ul className="guide-tab__menus">
					{DATA.map(item => (
						<li key={item.id} className="guide-tab__menu">
							<button
								type="button"
								className={`guide-tab__item ${index === item.id ? 'is-active' : ''}`}
								onClick={() => setIndex(item.id)}
							>
								{item.menu}
							</button>
						</li>
					))}
				</ul>

				<div className="guide-tab__panel">
					<div className="guide-count__section">
						<button className="guide-count__item" onClick={() => setSelectedState(null)}>
							전체 : {total}건
						</button>
						<button className="guide-count__item color-info" onClick={() => setSelectedState(1)}>
							우선진행 : {ing}건
						</button>
						<button className="guide-count__item color-primary" onClick={() => setSelectedState(2)}>
							진행예정 : {mod}건
						</button>
						<button className="guide-count__item color-danger" onClick={() => setSelectedState(3)}>
							완료 : {finish}건
						</button>
						<button className="guide-count__item color-secondary" onClick={() => setSelectedState(0)}>
							대기 : {total - ing - mod - finish - del}건
						</button>
						<button className="guide-count__item" onClick={() => setSelectedState(5)}>
							개발이미완료 : {del}건
						</button>
					</div>

					<div>
						<div className="guide-progress">
							{progressBars.map(({ key, count, className }) => (
								<div
									key={key}
									className={`guide-progress-bar ${className}`}
									style={{ width: calcProgressWidth(count) }}
								>
									{calcProgressWidth(count)}
								</div>
							))}
						</div>

						<table>
							<colgroup>
								<col width="10%" />
								<col width="10%" />
								<col width="15%" />
								<col width="20%" />
								<col width="20%" />
								<col width="10%" />
								<col width="10%" />
								<col />
							</colgroup>
							<thead>
								<tr>
									<th scope="col">1 depth</th>
									<th>2 depth</th>
									<th>3 depth</th>
									<th>URL</th>
									<th>Date</th>
									<th>상태</th>
									<th>비고</th>
								</tr>
							</thead>
							<tbody>
								{DATA[index].list
									?.filter(d => selectedState === null || d.state === selectedState) // <- 필터 조건 추가
									.map((d, idx) => (
										<tr key={idx}>
											<th scope="row">{d.depth1}</th>
											<td>{d.depth2}</td>
											<td>{d.depth3}</td>

											<td className={`color-${STATE_MAP[d.state]?.color}`}>{getLink(d, index)}</td>
											<td>{d.date}</td>

											<td className={`color-${STATE_MAP[d.state]?.color}`}>{STATE_MAP[d.state]?.label}</td>
											<td>{d.etc}</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
};

export default Guide;
