/*
 ############################################################################
 # FiledataField	: CmZipSearch.tsx
 # Description		: 우편번호 조회 팝업
 # Author			: sss	
 # Since			: 25.12.09
 ############################################################################
*/
// lib
import IcoSvg from '@/components/common/IcoSvg';
import { Button } from '@/components/common/custom/form';
import icoSvgData from '@/components/common/icoSvgData.json';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';
// utils
// component
// API Call Function

interface SearchProps {
	form: any;
	callback: (addressInfo: { fullAddress: string }) => void;
}

const CmZipSearch = (props: SearchProps) => {
	const scriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
	const open = useDaumPostcodePopup(scriptUrl);
	const addressInfo = { fullAddress: '', zonecode: '' };

	const handleComplete = (data: Address) => {
		let fullAddress = data.address;
		let extraAddress = '';

		if (data.addressType === 'R') {
			if (data.bname !== '') {
				extraAddress += data.bname;
			}
			if (data.buildingName !== '') {
				extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
			}
			fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
		}

		addressInfo.zonecode = data.zonecode;
		addressInfo.fullAddress = fullAddress;
		props.callback(addressInfo); // fullAddress를
	};

	const handleClick = () => {
		open({ onComplete: handleComplete });
	};

	return <Button onClick={handleClick} icon={<IcoSvg data={icoSvgData.icoSearch} label={'주소검색'} />} />;
};

export default CmZipSearch;
