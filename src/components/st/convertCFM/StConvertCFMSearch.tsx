/*
 ############################################################################
 # FiledataField	: StConvertCFMSearch.tsx
 # Description		: 중계영업확정처리
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.11
 ############################################################################
*/

// CSS

// Lib
import { Form } from 'antd';

// Utils

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Component
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { Button, InputText, MultiInputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

// API
import { apiGetExDCStatusDtl } from '@/api/ms/apiMsExDCStatus';

interface StConvertCFMSearchProps {
	form: any;
}

const StConvertCFMSearch = (props: StConvertCFMSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// 달력 표시 형식
	const [dateFormat] = useState('YYYY-MM-DD');

	const organize = Form.useWatch('organize', props.form);
	const dccode = Form.useWatch('fixdccode', props.form);

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 가중량여부 조건 생성
	 * @returns {any[]}
	 */
	const getTempWeightStatus = () => {
		const statusList = [
			{ cdNm: '전체', comCd: '' },
			{ cdNm: '가중량', comCd: 'Y' },
			{ cdNm: '실중량', comCd: 'N' },
			{ cdNm: '추가중량', comCd: '3' },
			{ cdNm: '반품중량', comCd: '2' },
		];

		return statusList;
	};

	/**
	 * '속성' 코드에서는 '중계영업매입매출'만을 기본값으로 세팅
	 * @returns
	 */
	const getMapDiv = () => {
		const types = getCommonCodeList('MAP_DIV', t('lbl.ALL'), null).filter((item: any) => item.comCd === '20');

		return types;
	};

	/**
	 * 창고 URL 팝업
	 */
	const openUrl = () => {
		if (organize == null || organize == '') {
			showAlert('', '선택된 창고가 없습니다.');
			return;
		}
		const searchParam = {
			plant: dccode,
			organize: organize,
			storageloc: organize.replace(/^[^-]+-/, ''),
		};
		// const width = 1200;
		// const height = 900;
		// const left = window.screenX + (window.outerWidth - width) / 2;
		// const top = window.screenY + (window.outerHeight - height) / 2;
		// const windowFeatures = `width=${width},height=${height},left=${left},top=${top},popup=yes`;

		apiGetExDCStatusDtl(searchParam).then(res => {
			if (!res.data.siteaddr) {
				showAlert('', '사이트 정보가 존재하지 않습니다');
			} else {
				const fileLink = document.createElement('a');
				fileLink.href = res.data.siteaddr;

				fileLink.setAttribute('target', '_blank');
				document.body.appendChild(fileLink);
				fileLink.click();
				fileLink.remove();
			}
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			<li>
				<Rangepicker //입고일자
					label={t('lbl.DOCDT_DP')}
					name="slipdtRange"
					//defaultValue={dates} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
					span={24}
					allowClear
					showNow={false}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<CmGMultiDccodeSelectBox data-type={''} name={'fixdccode'} label={t('lbl.DCCODENAME')} required disabled />
			</li>
			<li className="flex-wrap">
				<CmOrganizeSearch //창고
					form={props.form}
					selectionMode="multipleRows"
					name="organizeName"
					code="organize"
					returnValueFormat="name"
					dccode={props.form.getFieldValue('fixdccode')}
				/>
				<span>
					<Button onClick={openUrl} size="small">
						{t('lbl.LINK')}
					</Button>
				</span>
			</li>
			<li>
				<MultiInputText //구매번호
					name="docno"
					label={t('lbl.PONO')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.PONO')])}
					allowClear
				/>
			</li>
			<li>
				<CmPartnerSearch //협력사코드
					form={props.form}
					name="custkeyName"
					code="custkey"
					selectionMode="multipleRows"
					returnValueFormat="name"
					label={t('lbl.VENDOR')}
				/>
			</li>
			<li>
				<CmSkuSearch //상품코드
					form={props.form}
					name="skuName"
					code="sku"
					selectionMode="multipleRows"
					returnValueFormat="name"
				/>
			</li>

			<li>
				<SelectBox //속성
					name="mapDiv"
					label={t('lbl.ATTRIBUTE')}
					span={24}
					options={getMapDiv()}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				<InputText //구매요청번호
					name="mapkeyNo"
					label={t('lbl.POREQNO')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.POREQNO')])}
					allowClear
				/>
			</li>
			<li>
				<InputText //BL번호/
					name="blno"
					label={t('lbl.BLNO')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.BLNO')])}
					allowClear
				/>
			</li>
			<li>
				<InputText //이력번호
					name="serialno"
					label={t('lbl.SERIALNO')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.SERIALNO')])}
					allowClear
				/>
			</li>

			<li>
				<SelectBox //가중량여부
					name="tempYn"
					span={24}
					options={getTempWeightStatus()}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.TEMPWEIGHTSTATUS')}
				/>
			</li>
			<li>
				<SelectBox //진행상태
					name="serialinfoCfmYn"
					span={24}
					options={getCommonCodeList('EXDC_AUTO_STATUS', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.STATUS_WD')}
				/>
			</li>
			<li>
				<SelectBox //이체여부
					name="moveYn"
					span={24}
					options={getCommonCodeList('YN2', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.MOVEYN')}
				/>
			</li>
		</>
	);
};

export default StConvertCFMSearch;
