/*
 ############################################################################
 # FiledataField	: CmWebViewPopup.tsx
 # Description		: 웹브라우저 팝업
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.04
 ############################################################################
*/

import React from 'react';

interface CmWebViewPopupProps {
	url: string;
	height?: string;
}

const CmWebViewPopup: React.FC<CmWebViewPopupProps> = ({ url, height = '600px' }) => (
	<iframe src={url} title="Popup WebView" width="100%" height={height} style={{ border: 'none' }} />
);

export default CmWebViewPopup;
