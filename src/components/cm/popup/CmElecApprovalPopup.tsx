/*
 ############################################################################
 # FiledataField	: CmElecApprovalPopup.tsx
 # Description		: 전자결재 팝업
 # Author			    : Canal Frame
 # Since			    : 25.07.02
 ############################################################################
*/

// Lib
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

// Component
import CmWebViewPopup from '@/components/cm/popup/CmWebViewPopup';
import CustomModal from '@/components/common/custom/CustomModal';

interface CmElecApprovalPopupProps {
	url: string;
	height?: string;
	width?: string;
}

const CmElecApprovalPopup = forwardRef((_, ref) => {
	// const CmElecApprovalPopup = forwardRef((props: CmElecApprovalPopupProps, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const modalRef = useRef<any>(null);
	const [popupParams, setPopupParams] = useState<CmElecApprovalPopupProps | null>(null);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */

	// 외부에서 호출할 수 있는 open 메서드
	useImperativeHandle(ref, () => ({
		open: (params: CmElecApprovalPopupProps) => {
			setPopupParams(params);
			// 다음 tick에 modal open
			setTimeout(() => modalRef.current?.handlerOpen(), 0);
		},
	}));

	return (
		<CustomModal ref={modalRef} width={popupParams && popupParams.width ? popupParams.width : '600px'}>
			{popupParams && (
				<CmWebViewPopup
					url={popupParams.url ? popupParams.url : ''}
					height={popupParams.height ? popupParams.height : '600px'}
				/>
			)}
		</CustomModal>
	);
});

export default CmElecApprovalPopup;
