/*
 ############################################################################
 # FiledataField	: WdShipmentExDCSearch.tsx
 # Description		: 외부비축출고처리
 # Author			    : KimSunHo(sunhokim6229@cj.net)
 # Since			    : 25.06.30
 ############################################################################
*/

// CSS

// Lib
import { Form } from 'antd';

// Utils

// Store
import { getCommonCodeList, getCommonCodeListByData } from '@/store/core/comCodeStore';

// Component
import CmMngPlcSearch from '@/components/cm/popup/CmMngPlcSearch';
import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { Button, CheckBox, InputText, MultiInputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

// API
import { apiGetExDCStatusDtl } from '@/api/ms/apiMsExDCStatus';
import { apiPostAuthority } from '@/api/st/apiStExDCStorage';
import { apiPostScmUserList } from '@/api/wd/apiWdShipmentExDC';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
interface WdShipmentExDCSearchProps {
	form: any;
}

const WdShipmentExDCSearch = (props: WdShipmentExDCSearchProps) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// 달력 표시 형식
	const [dateFormat] = useState('YYYY-MM-DD');

	// SCM담당자 목록
	const [scmUserList, setScmUserList] = useState<any[]>([]);

	// 창고
	const organize = Form.useWatch('organize', props.form);
	const organizeName = Form.useWatch('organizeName', props.form);

	// 물류센터
	const dccode = Form.useWatch('fixdccode', props.form);

	// 권한 정보
	const authorityRef = useRef<any>(null);
	const [dcCodeList, setDcCodeList] = useState(null);
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * SCM담당자 목록 조회
	 */
	const getScmUserList = () => {
		const params = {};

		// API 호출
		let res = {};
		apiPostScmUserList(params).then(response => {
			res = response;

			if (res?.statusCode === 0) {
				res?.data.unshift({ userId: null, userNm: '전체' });
			}

			setScmUserList(res.data);
		});
	};

	/**
	 * 창고 홈페이지 열기
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
		getScmUserList();

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
				<Rangepicker
					label={t('lbl.DOCDT_WD')} //출고일자
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
				<CmOrganizeSearch
					form={props.form} //창고
					selectionMode="multipleRows"
					name="organizeName"
					code="organize"
					returnValueFormat="name"
					dccode={props.form.getFieldValue('fixdccode')}
				/>
				<span>
					<Button size="small" onClick={openUrl}>
						{t('lbl.LINK')}
					</Button>
				</span>
			</li>
			<li>
				<MultiInputText
					name="docno" //주문번호
					label={t('lbl.ORDRNUM')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.ORDRNUM')])}
					allowClear
				/>
			</li>
			<li>
				<CmMngPlcSearch
					form={props.form} //관리처코드
					selectionMode="multipleRows"
					name="fromCustkeyName"
					code="fromCustkey"
					label={t('lbl.TO_CUSTKEY_WD')}
					returnValueFormat="name"
				/>
			</li>
			<li>
				<CmSkuSearch
					form={props.form} //상품
					selectionMode="multipleRows"
					name="skuName"
					code="skuCode"
					returnValueFormat="name"
				/>
			</li>
			<li>
				<SelectBox
					name="storagetype" //저장조건
					span={24}
					options={getCommonCodeList('STORAGETYPE', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.STORAGETYPE')}
				/>
			</li>
			<li>
				<MultiInputText
					name="blno" //BL번호
					label={t('lbl.BLNO')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.BLNO')])}
					allowClear
				/>
			</li>
			<li>
				<InputText
					name="serialno" //이력번호
					label={t('lbl.SERIALNO')}
					placeholder={t('msg.MSG_COM_VAL_054', [t('lbl.SERIALNO')])}
					allowClear
				/>
			</li>
			<li>
				<CmCustSearch
					form={props.form} //계약업체
					selectionMode="multipleRows"
					name="wdCustkeyName"
					code="wdCustkey"
					label={t('lbl.CONTRACTCOMPANY')}
					returnValueFormat="name"
				/>
			</li>
			<li>
				<SelectBox
					name="status" //진행상태
					span={24}
					options={getCommonCodeListByData('STATUS_WD', null, 'EX', null, null, t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.STATUS_WD')}
				/>
			</li>
			<li>
				<SelectBox
					name="contracttypeSn" //계약유형
					span={24}
					options={getCommonCodeList('CONTRACTTYPE_SN', t('lbl.ALL'), null)}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					placeholder="선택해주세요"
					label={t('lbl.CONTRACTTYPE')}
				/>
			</li>
			<li>
				<SelectBox
					name="scmUser" //SCM담당자
					span={24}
					options={scmUserList}
					fieldNames={{ label: 'userNm', value: 'userId' }}
					placeholder="선택해주세요"
					label="SCM 담당자	"
				/>
			</li>

			<li>
				<CheckBox name="sto" trueValue={'1'} falseValue={'0'}>
					STO오더만 조회
				</CheckBox>
			</li>
		</>
	);
};

export default WdShipmentExDCSearch;
