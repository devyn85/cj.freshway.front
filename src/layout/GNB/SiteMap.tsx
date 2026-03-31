import Icon from '@/components/common/Icon';
import { useMoveMenu } from '@/hooks/useMoveMenu';
import { useAppSelector } from '@/store/core/coreHook';
import { MenuType } from '@/store/core/menuStore';
import dataTransform from '@/util/dataTransform';
import { useState } from 'react';
import sample4depth from './sample4depth.json';
const SiteMap = ({ closePop }: any) => {
	/**
	 * 메뉴 이동
	 * @param menu 메뉴
	 * @returns {*} 사이트맵 컴포넌트
	 */
	const { moveMenu } = useMoveMenu();

	const onClickMoveMenu = (menu: MenuType) => {
		moveMenu(menu.menuUrl);
		closePop();
	};
	const menus = dataTransform.makeTreeMenuData([...useAppSelector(state => state.menu.menuList), sample4depth]);

	const [isLike] = useState(true);
	const [isLikeLeftOn] = useState(false);

	return (
		<div className={`site-map ${isLikeLeftOn ? 'left' : 'right'}`}>
			{menus.map((menu: any) => {
				return (
					<div className="site-item" key={`site_${menu.menuId}`}>
						<h2>{menu.menuNm}</h2>

						{/* 중메뉴 */}
						{menu.children?.map((middle: any) => {
							return (
								<ul className="middle-item" key={`middle-drop-${middle.menuId}`}>
									<h2>{middle.menuNm}</h2>
									{middle.children?.length && (
										<>
											{middle.children.map((sub: any) => {
												if (sub.children?.length) {
													return (
														<li key={sub.menuId}>
															<div>
																<a>{sub.menuNm}</a>
																<ul className="sub-item">
																	{sub.children.map((detail: any) => {
																		return (
																			<li key={detail.menuId}>
																				<a>
																					{isLike ? <Icon icon="icon-lnb-star" /> : null}
																					{detail.menuNm}
																				</a>
																			</li>
																		);
																	})}
																</ul>
															</div>
														</li>
													);
												} else {
													return (
														<li key={sub.menuId}>
															<a key={`a-sitemap-${sub.menuId}`} onClick={() => onClickMoveMenu(sub)}>
																{isLike ? <Icon icon="icon-lnb-star" /> : null}
																{sub.menuNm}
															</a>
														</li>
													);
												}
											})}
										</>
									)}
								</ul>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};

export default SiteMap;
