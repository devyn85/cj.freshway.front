/*
############################################################################
# FiledataField : OmPurchaseStorageAutoTotalPopup.tsx
# Description   : 저장품자동발주 출고추이 팝업
############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';

// lib
import { Button } from 'antd';

// component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

interface PropsType {
	callBack?: any;
	close?: any;
}

const OmPurchaseStorageAutoTotalPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { callBack, close: propsClose } = props;

	const [imgSrc, setImgSrc] = useState('');
	const { t } = useTranslation();
	// window.open으로 열렸는지 확인
	const isWindowPopup = typeof window !== 'undefined' && window.opener && window.opener !== window;

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 팝업 닫기
	 */
	const handleClose = () => {
		if (isWindowPopup) {
			window.close();
		} else {
			propsClose?.();
		}
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		if (!isWindowPopup) return;

		// URL에서 쿼리 파라미터를 읽어옵니다.
		const searchParams = new URLSearchParams(window.location.search);
		const filename = searchParams.get('filename');

		if (filename) {
			// const imgSrcValue = `https://d1e0imw84mhtx9.cloudfront.net/${filename}.svg?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kMWUwaW13ODRtaHR4OS5jbG91ZGZyb250Lm5ldC8qLnN2ZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6NDEwMjM1ODQwMH19fV19&Signature=JCXP6Z2o9Ru5ZN67oCGHL7pMfaptMstfkOwxMSm1zW1nbKJOtvRzMehdXtB-tI3jpu1ii5IfeLkiobYDWbcn-1YF58COPRiixPlGRc-futz2bRpbd-3PvRpuPz3EJ6f5xqouSNQbDAGcC6obAIe-JLnopXhzJK29g~jgRFQjRHWaIVoEVSUYv57XEqg5rZkrLE-BpAZ9J8CSEoJKDquYjr8a0ajIonRMkzRZI5aVRONRHJlkXfBxW7IN6So3T0rdkgo8NVqeIZ4gw3~tUUMdWPhlFppjMvLEBkMfsNfgjNmqpgkCWwrQTcZ~iz935lt03r1bv0zJgBQu9zmey2xF1w__&Key-Pair-Id=K2B98S489DMA2W`;
			const imgSrcValue = `https://cjfwdap-prd-dap-ae-atn.s3.ap-northeast-2.amazonaws.com/databases/dta/11.scm_prophet/seasonality_plot/${filename}.svg`;
			setImgSrc(imgSrcValue);
		}
	}, [isWindowPopup]);

	return (
		<div className="pop-title">
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={`출고 추이`} />

			{/* 그리드 영역 */}
			<AGrid>
				<div className="preview full">
					<img className="" src={imgSrc} />
				</div>
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={handleClose}>{t('lbl.CLOSE')}</Button>
			</ButtonWrap>
		</div>
	);
};

export default OmPurchaseStorageAutoTotalPopup;
