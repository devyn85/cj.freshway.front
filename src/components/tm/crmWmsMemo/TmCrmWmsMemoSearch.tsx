import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import { CheckBox, SelectBox } from '@/components/common/custom/form';
import Datepicker, { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import { useAppSelector } from '@/store/core/coreHook';
import { Form, Input } from 'antd';

const TmCrmWmsMemoSearch = (props: any) => {
	const { form, activeKey } = props;
	const { t } = useTranslation();
	// 사용자 정보
	const storerKey = useAppSelector(state => {
		return state.global.globalVariable.gStorerkey;
	});
	// 사용자 정보
	const searchDcCode = useAppSelector(state => {
		return state.global.globalVariable.gDccode;
	});
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	useEffect(() => {
		form.setFieldsValue({
			schStorerKey: storerKey,
			schDcCode: searchDcCode,
		});
	}, [form, storerKey, searchDcCode]);

	return (
		<>
			{activeKey === '1' ? (
				<>
					{/* 조회일자 */}
					<li>
						<Form.Item name="schStorerKey" hidden>
							<Input />
						</Form.Item>
						<Form.Item name="schDcCode" hidden>
							<Input />
						</Form.Item>
						<Rangepicker name="dateRange" label="조회일자" format="YYYY-MM-DD" allowClear required />
					</li>
					{/* 관리처코드 */}
					<li>
						<CmCustSearch
							form={form}
							name="schCustName"
							code="schCustKey"
							label={t('lbl.FROM_CUSTKEY_RT')}
							selectionMode="multipleRows"
						/>
					</li>
					{/* 차량번호 */}
					<li>
						<CmCarSearch
							form={form}
							name="schCarName"
							code="schCarCode"
							label={t('lbl.CARNO')}
							selectionMode="multipleRows"
						/>
					</li>
					{/* 작성출처 */}
					<li>
						<SelectBox
							label="작성출처"
							name="schSourceSystem"
							options={getCommonCodeList('CRM_MEMO_SOURCE', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
					{/* 진행상태 */}
					<li className="flex-wrap">
						<SelectBox
							label={t('lbl.STATUS')}
							name="schStatus"
							options={getCommonCodeList('CRM_MEMO_STATUS', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							span={18}
						/>
						<CheckBox className="no-wrap-checkbox" name="schExcludConfirm" trueValue={'1'} falseValue={''} span={6}>
							{'확정제외'}
						</CheckBox>
					</li>
					{/* 메모유형 */}
					<li>
						<SelectBox
							label={t('lbl.MEMO_TYPE')}
							name="schMemoType"
							options={getCommonCodeList('CRM_MEMO_TYPE', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
				</>
			) : (
				<>
					{/* 배송일자 */}
					<li>
						<Form.Item name="schStorerKey" hidden>
							<Input />
						</Form.Item>
						<Form.Item name="schDcCode" hidden>
							<Input />
						</Form.Item>
						<Datepicker name="schDeliveryDt" label={t('lbl.DELIVERYDATE')} format="YYYY-MM-DD" required />
					</li>
					{/* 관리처코드 */}
					<li>
						<CmCustSearch
							form={form}
							name="schCustName"
							code="schCustKey"
							label={t('lbl.FROM_CUSTKEY_RT')}
							selectionMode="multipleRows"
						/>
					</li>
					{/* 진행상태 */}
					<li>
						<SelectBox
							width={'100px'}
							name="schStatus"
							label={t('lbl.STATUS')}
							span={24}
							options={getCommonCodeList('STATUS_CODE', t('lbl.ALL'), '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							placeholder="선택해주세요"
						/>
					</li>
				</>
			)}
		</>
	);
};

export default TmCrmWmsMemoSearch;
