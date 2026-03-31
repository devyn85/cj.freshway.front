/*
 ############################################################################
 # FiledataField	: CmImageViewerPopup.tsx
 # Description		: 이미지 팝업
 # Author			: jgs
 # Since			: 25.07.21
 ############################################################################
*/
// component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// Utils
import fileUtil from '@/util/fileUtils';

interface PropsType {
	dirType: string;
	attchFileNm: string;
	savePathNm?: string;
	saveFileNm?: string;
	readOnly?: boolean;
}

const CmImageViewerPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const [imgUrl, setImgUrl] = useState('');

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		const params = {
			dirType: props.dirType,
			attchFileNm: props.attchFileNm,
			savePathNm: props.savePathNm,
			saveFileNm: props.saveFileNm,
			readOnly: props.readOnly ?? true,
		};
		fileUtil.downloadFile(params).then((data: string) => {
			setImgUrl(data);
		});
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="이미지" />
			<div className="img-preview">
				<img src={imgUrl} alt={''} />
			</div>
		</>
	);
};

export default CmImageViewerPopup;
