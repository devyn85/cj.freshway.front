/*
 ############################################################################
 # FiledataField	: DpReceiptExDCSearch.tsx
 # Description		: 외부비축입고처리
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.07.15
 ############################################################################
*/

// CSS

// Lib
import { Form } from 'antd';

// Utils

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';

// Component
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { Button, InputText, MultiInputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// API
import { apiGetExDCStatusDtl } from '@/api/ms/apiMsExDCStatus';
import { apiPostAuthority } from '@/api/st/apiStExDCStorage';

interface DpReceiptExDCSearchhProps {
	form: any;
}

const DpReceiptExDCSearch = (props: DpReceiptExDCSearchhProps) => {
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
	const globalVariable = useAppSelector(state => state.global.globalVariable);
	// 권한 정보
	const authorityRef = useRef<any>(null);
	const [dcCodeList, setDcCodeList] = useState(null);

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
	 * 물류센터 조회
	 * @returns {any[]}
	 */
	const getDccodeList = async () => {
		let auth: any[] = [];
		if (!authorityRef?.current) {
			auth = await searchAuthority();
		}

		const list = getCommonCodeList('WMS_MNG_DC')
			.map(item => ({
				...item,

				cdNm: item.comCd ? `[${item.comCd}] ${item.cdNm}` : item.cdNm,
			}))
			.filter((v: any) => {
				if (authorityRef?.current) {
					const res = authorityRef.current.filter((x: any) => x.authCd === 'WAYLO_000');

					if (res && res.length > 0) {
						return v.comCd === '2170' || v.comCd === '1000';
					} else {
						return v.comCd === '2170';
					}
				} else {
					return false;
				}
			});

		return list;
	};

	/**
	 * 진행상태 조회 (조회조건용)
	 */
	const getStatusDP = () => {
		const list = getCommonCodeList('STATUS_DP');

		list.unshift({ cdNm: '전체', comCd: null });
		list.push({ cdNm: '이력확정예정', comCd: 'AA' });
		list.push({ cdNm: '이력확정', comCd: 'BB' });
		list.push({ cdNm: '이력반려', comCd: 'CC' });

		return list;
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
	 * 권한 조회
	 */
	const searchAuthority = async () => {
		// API 호출
		const params = {};
		const res = await apiPostAuthority(params);

		authorityRef.current = res.data;

		return res.data;
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */

	/**
	 * 초기화
	 */
	useEffect(() => {
		const init = async () => {
			await searchAuthority(); // 권한 먼저 가져오기
			const list = await getDccodeList();
			setDcCodeList(list);
		};
		init();
	}, []);

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
				<SelectBox
					name="fixdccode"
					span={24}
					options={dcCodeList}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.DCCODENAME')}
					required
					//disabled={globalVariable.gAuthority !== '00'}
				/>
			</li>
			<li className="flex-wrap">
				<CmOrganizeSearch //창고
					dccodeDisabled={true}
					form={props.form}
					selectionMode="multipleRows"
					name="organizeName"
					code="organize"
					returnValueFormat="name"
					dccode={dccode}
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
				<SelectBox //저장조건
					name="storagetype"
					label={t('lbl.STORAGETYPE')}
					span={24}
					options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
				/>
			</li>
			<li>
				<SelectBox //저장유무
					name="channel"
					label={t('lbl.CHANNEL_DMD')}
					span={24}
					options={getCommonCodeList('PUTAWAYTYPE', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
				/>
			</li>
			<li>
				<MultiInputText //BL번호/
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
				<CmCustSearch //계약업체
					form={props.form}
					name="dpCustkeyName"
					code="dpCustkey"
					selectionMode="multipleRows"
					returnValueFormat="name"
					label={t('lbl.CONTRACTCOMPANY')}
				/>
			</li>
			<li>
				<SelectBox //진행상태
					name="status"
					span={24}
					options={getStatusDP()}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.STATUS_DP')}
				/>
			</li>
			<li>
				<SelectBox //진오더생성여부
					name="sokeyYn"
					label="진오더생성여부"
					span={24}
					options={getCommonCodeList('YN2', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
				/>
			</li>
			<li>
				<SelectBox //구매유형
					name="ordertype"
					label={t('lbl.POTYPE')}
					span={24}
					options={getCommonCodeList('ORDERTYPE_DP', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
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
				<InputText //구매요청번호
					name="mapkeyNo"
					label={t('lbl.POREQNO')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.POREQNO')])}
					allowClear
				/>
			</li>
		</>
	);
};

export default DpReceiptExDCSearch;
