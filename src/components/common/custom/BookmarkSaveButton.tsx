import { apiPostAddCmFavoriteMenu, apiPostRemoveCmFavoriteMenu } from '@/api/cm/apiCmMenu';
import CustomTooltip from '@/components/common/custom/CustomTooltip';
import IcoSvg from '@/components/common/IcoSvg';
import icoSvgData from '@/components/common/icoSvgData.json';
import { fetchMenuList, fetchMyMenuList, getFindMenu } from '@/store/core/menuStore';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';

/**
 * 즐겨찾기 저장 버튼
 * @description UI만 분리하였습니다
 * @returns {React.ReactElement} 즐겨찾기 버튼 컴포넌트
 */
export const BookmarkSaveButton = () => {
	const currentMenu = getFindMenu(location.pathname);

	const [isBookmarked, setIsBookmarked] = useState(false);

	const [isClickable, setIsClickable] = useState(true);

	useEffect(() => {
		const isAlreadyBookmarked = currentMenu?.favoriteYn === 'Y';
		setIsBookmarked(isAlreadyBookmarked);
	}, [currentMenu]);

	const handleClick = () => {
		if (!isClickable) return;

		if (isBookmarked) {
			handleRemoveBookmark();
		} else {
			handleAddBookmark();
		}
	};

	/**
	 * 즐겨찾기 처리 공통 함수
	 * @param {(params: {progCd?: string}) => Promise<any>} apiFunction - 실행할 API 함수
	 * @param {boolean} bookmarkState - 설정할 북마크 상태
	 */
	const handleBookmarkOperation = async (
		apiFunction: (params: { progCd?: string }) => Promise<any>,
		bookmarkState: boolean,
	) => {
		setIsClickable(false);

		try {
			await apiFunction({
				progCd: currentMenu?.progCd,
			});

			setIsBookmarked(bookmarkState);
			fetchMyMenuList();
			fetchMenuList();
		} finally {
			setIsClickable(true);
		}
	};

	const handleAddBookmark = () => {
		handleBookmarkOperation(apiPostAddCmFavoriteMenu, true);
	};

	const handleRemoveBookmark = () => {
		handleBookmarkOperation(apiPostRemoveCmFavoriteMenu, false);
	};

	return (
		<CustomTooltip placement="bottomLeft" title={'즐겨찾기'}>
			<Button
				icon={
					<IcoSvg
						data={isBookmarked ? icoSvgData.icoFillBookmark : icoSvgData.icoBookmark}
						label={'즐겨찾기'}
						fill={isBookmarked ? '#007651' : 'currentColor'}
					/>
				}
				onClick={handleClick}
			/>
		</CustomTooltip>
	);
};
