/*
 ############################################################################
 # FiledataField	: CmImageViewerPopup.tsx
 # Description		: 이미지 팝업 (EDMS 전용)
 # Author			: jgs
 # Since			: 25.09.24
 ############################################################################
*/
// component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

interface PropsType {
	workplaceId: string;
	fileId: string[];
}

const { VITE_EDMS_IMG_URL } = import.meta.env; // EDMS 이미지 URL

const CmImageViewerPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { workplaceId = '101', fileId = [] } = props;

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="이미지" />
			<div className="img-preview">
				{fileId.length > 0 &&
					fileId.map((hash: string) => {
						return <img key={hash} src={`${VITE_EDMS_IMG_URL}/${workplaceId}/${hash}`} alt={''} />;
					})}
			</div>
		</>
	);
};

export default CmImageViewerPopup;
