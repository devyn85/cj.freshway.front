import CustomTooltip from '@/components/common/custom/CustomTooltip';
import IcoSvg from '@/components/common/IcoSvg';
import icoSvgData from '@/components/common/icoSvgData.json';
import { useAppSelector } from '@/store/core/coreHook';
import { fetchMyMenuList } from '@/store/core/menuStore';
import { Button } from 'antd';

const BookmarkMenuShowButton = ({ isActive, onClick }: { isActive: boolean; onClick: () => void }) => {
	const myMenuList = useAppSelector(state => state.menu.myMenuList);

	const handleClick = () => {
		onClick();
	};

	useEffect(() => {
		if (isActive && myMenuList.length === 0) {
			fetchMyMenuList();
		}
	}, [isActive]);

	return (
		<CustomTooltip placement="bottomLeft" title={'북마크'}>
			<Button
				className="btn-menu "
				onClick={handleClick}
				label={'북마크'}
				icon={
					<IcoSvg
						data={isActive ? icoSvgData.icoFillBookmark : icoSvgData.icoBookmark}
						fill={isActive ? '#007651' : 'currentColor'}
					/>
				}
			/>
		</CustomTooltip>
	);
};

export default BookmarkMenuShowButton;
