/**
 * @file tabs.tsx
 * @description tabs 페이지
 */

// import IcoSvg from '@/publish/components/common/ui/IcoSvg';
// import icoSvgData from '@/publish/components/common/ui/json/icoSvgData.json';
// import { PageType } from '~/types/common';

const Sample = () => {
	const tabs = [
		{ name: '전체', count: 20 },
		{ name: '커버리지', count: 20 },
		{ name: '클립북', count: 5 },
		{ name: '보도자료', count: 4 },
		{ name: '이메일', count: 20 },
		{ name: '노트', count: 20 },
		{ name: '약속', count: 20 },
		{ name: '전화', count: 20 },
		{ name: '문의', count: 20 },
	];

	return (
		<>
			<section className="guide__section">
				<h2 className="guide__title">tabs Type1 small</h2>
				<code className="guide__code">
					1. 스크롤 : 상황에 따라 왼쪽 / 오른쪽 화살표 나옴
					<br />
					2. 클릭 시 해당 메뉴 가운데로 이동
				</code>

				<div style={{ marginTop: '30px' }}>
					<h2 className="guide__item--title">기본</h2>
					<div className="guide__group">
						<div className="tabs__section type1-small">
							<div className="tabs-menu__group">
								<ul className="tabs-menu__list">
									{tabs.map((tab, i) => {
										return (
											<li className={`${i === 0 ? 'is-active' : ''}`} key={i}>
												<button type="button" className="tabs-menu__btn">
													<span className="tabs-menu__name">{tab.name}</span>
													<span className="tabs-menu__number">{tab.count}</span>
												</button>
											</li>
										);
									})}
								</ul>
							</div>
							<div className="tabs-panel__section">
								<div className="tabs-panel__group"></div>
							</div>
						</div>
					</div>
					<h2 className="guide__item--title" style={{ marginTop: '30px' }}>
						왼쪽 화살표 있을 때
					</h2>
					<div className="guide__group">
						<div className="tabs__section type1-small">
							<div className="tabs-menu__group">
								<button type="button" className="tabs-menu__arrow arrow-prev">
									{/*<IcoSvg data={icoSvgData.chevronThickLeft} />*/}
									<span className="hidden">이전</span>
								</button>

								<ul className="tabs-menu__list">
									{tabs.map((tab, i) => {
										return (
											<li className={`${i === 0 ? 'is-active' : ''}`} key={i}>
												<button type="button" className="tabs-menu__btn">
													<span className="tabs-menu__name">{tab.name}</span>
													<span className="tabs-menu__number">{tab.count}</span>
												</button>
											</li>
										);
									})}
								</ul>
							</div>
						</div>
					</div>
					<h2 className="guide__item--title" style={{ marginTop: '30px' }}>
						오른쪽 화살표 있을 때
					</h2>
					<div className="guide__group">
						<div className="tabs__section type1-small">
							<div className="tabs-menu__group">
								<ul className="tabs-menu__list">
									{tabs.map((tab, i) => {
										return (
											<li className={`${i === 0 ? 'is-active' : ''}`} key={i}>
												<button type="button" className="tabs-menu__btn">
													<span className="tabs-menu__name">{tab.name}</span>
													<span className="tabs-menu__number">{tab.count}</span>
												</button>
											</li>
										);
									})}
								</ul>

								<button type="button" className="tabs-menu__arrow arrow-next">
									{/*<IcoSvg data={icoSvgData.chevronThickRight} />*/}
									<span className="hidden">다음</span>
								</button>
							</div>
						</div>
					</div>
				</div>

				<h2 className="guide__title">tabs Type1 medium</h2>
				<div style={{ marginTop: '30px' }}>
					<h2 className="guide__item--title">기본</h2>
					<div className="guide__group">
						<div className="tabs__section type1-medium">
							<div className="tabs-menu__group">
								<ul className="tabs-menu__list">
									<li className="is-active">
										<button type="button" className="tabs-menu__btn">
											<span className="tabs-menu__name">언론인 검색</span>
										</button>
									</li>
									<li>
										<button type="button" className="tabs-menu__btn">
											<span className="tabs-menu__name">매체 검색</span>
										</button>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

				<h2 className="guide__title">tabs Type2</h2>
				<div style={{ marginTop: '30px' }}>
					<h2 className="guide__item--title">기본</h2>
					<div className="guide__group">
						<div className="tabs__section type2">
							<div className="tabs-menu__group">
								<ul className="tabs-menu__list">
									<li>
										<button type="button" className="tabs-menu__btn">
											<span className="tabs-menu__name">탭01</span>
										</button>
									</li>
									<li className="is-active">
										<button type="button" className="tabs-menu__btn">
											<span className="tabs-menu__name">탭02</span>
										</button>
									</li>
									<li>
										<button type="button" className="tabs-menu__btn">
											<span className="tabs-menu__name">탭03</span>
										</button>
									</li>
									<li>
										<button type="button" className="tabs-menu__btn">
											<span className="tabs-menu__name">탭04</span>
										</button>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default Sample;
Sample.PublishingLayout = 'BLANK';
