/*
 ############################################################################
 # FiledataField	: BookMark.tsx
 # Description		: 즐겨찾기
 # Author			: Canal Frame
 # Since			: 23.10.02
 ############################################################################
*/
// lib
import { Button } from 'antd';
import React from 'react';
// utils
import { useMoveMenu } from '@/hooks/useMoveMenu';
import { MenuType } from '@/store/core/menuStore';
import { UserType } from '@/store/core/userStore';
// component
import Icon from '@/components/common/Icon';
// API Call Function
import { apiGetSearchUsersMyMenu, apiPostDeleteUsersMyMenu, apiPostInsertUsersMyMenu } from '@/api/common/apiCommon';
import commUtil from '@/util/commUtil';

interface BookMarkProps {
	menu?: MenuType;
	user?: UserType;
}

const BookMark = ({ menu, user }: BookMarkProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [myMenuList, setMyMenuList] = useState([]); // 즐겨찾기 메뉴 리스트
	const { moveMenu } = useMoveMenu();
	const getAccessToken = localStorage.getItem('accessToken');

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 북마크 삭제
	 * @param {object} event 북마크 삭제 버튼 클릭 이벤튼
	 * @param {object} menuId 삭제 대상 메뉴 id
	 */
	const deleteMyMenu = (event: React.MouseEvent<SVGSVGElement, MouseEvent>, menuId: string) => {
		event.stopPropagation();
		const param = {
			menuId: menuId,
		};

		apiPostDeleteUsersMyMenu(param).then(() => {
			selectBookMark();
		});
	};

	/**
	 * 북마크 추가
	 * @returns {void}
	 */
	const insertMyMenu = () => {
		if (!menu || !menu.menuId || menu.menuId == 'HOME') {
			return;
		}
		const param = {
			menuId: menu.menuId,
			menuNm: menu.menuNm,
			menuUrl: menu.menuUrl,
		};

		apiPostInsertUsersMyMenu(param).then(() => {
			selectBookMark();
		});
	};

	/**
	 * 북마크 조회
	 */
	const selectBookMark = () => {
		const param = { userId: user.userNm || '' };
		apiGetSearchUsersMyMenu(param).then(res => {
			const ret = res.data;
			setMyMenuList(ret);
		});
	};

	/**
	 * 메뉴 선택
	 * @param {object} menu 선택된 메뉴 객체
	 */
	const selectMenu = (menu: any) => {
		moveMenu(menu.menuUrl);
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		if (!commUtil.isEmpty(getAccessToken)) {
			selectBookMark();
		}
	}, []);

	return (
		<>
			<ul>
				<li>
					{/* 즐겨찾기 */}
					{t('com.bookmark.title')}
					<Icon icon="icon-lnb-star" />
				</li>
				<Button className="secondary" shape="round" block onClick={insertMyMenu}>
					<Icon icon="icon-plus" />
					{t('com.bookmark.addBtn')}
				</Button>
			</ul>
			<dl>
				{myMenuList || myMenuList.length > 0
					? myMenuList.map(menu => {
							return (
								<dd key={menu.menuId} onClick={() => selectMenu(menu)}>
									<Icon icon="icon-lnb-star" />
									{menu.menuNm}
									<Icon
										icon="icon-close"
										onClick={(event: any) => {
											deleteMyMenu(event, menu.menuId);
										}}
									/>
								</dd>
							);
					  })
					: null}
			</dl>
		</>
	);
};

export default BookMark;
