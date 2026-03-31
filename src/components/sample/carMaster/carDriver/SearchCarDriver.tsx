import { InputText, SelectBox } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';

import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

import { Button } from 'antd';

// API Call Function
import { getCommonCodeList } from '@/store/core/comCodeStore';

const SearchCarDriver = (props: any) => {
	const { search } = props;
	const { t } = useTranslation();
	return (
		<>
			<UiFilterArea>
				<UiFilterGroup>
					<li>
						<label data-required>물류센터</label>
						<span>
							<SelectBox
								name="defDccode"
								placeholder="선택해주세요"
								//options={getCommonCodeList('BBS_TP', '--- 선택 ---')}
								options={[
									{ cdNm: '이천물류센터', comCd: '2600' },
									{ cdNm: '수원물류센터', comCd: '2620' },
									{ cdNm: '동탄2물류센터', comCd: '2660' },
								]}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								// defaultValue={'2600'}
								// onChange={}
								// required
								// rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						</span>
					</li>
					<li>
						<label data-required>{t('lbl.CARNO')}</label>
						<span>
							<InputText
								name="carNo"
								placeholder={t('msg.placeholder2', [t('sysmgt.roles.group.authority')])}
								onPressEnter={search}
							/>
						</span>
					</li>
					<li>
						<label>운전자이름</label>
						<span>
							<InputText
								name="driverName"
								placeholder={t('msg.placeholder2', [t('sysmgt.roles.group.authority')])}
								onPressEnter={search}
							/>
						</span>
					</li>
					<li>
						<label>삭제여부</label>
						<span>
							<SelectBox
								name="delYn"
								placeholder="선택해주세요"
								options={getCommonCodeList('DEL_YN', '--- 전체 ---')}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								// onChange={}
								// required
								// rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						</span>
					</li>
					<li>
						<label>계약유형</label>
						<span>
							<SelectBox
								name="contractType"
								placeholder="선택해주세요"
								options={getCommonCodeList('CONTRACTTYPE', '--- 선택 ---')}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								// onChange={}
								// required
								// rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						</span>
					</li>
					<li>
						<label>차량소독증 유효기간TO</label>
						<span>
							<DatePicker
								name="datePickerBasic1"
								// onChange={onChange}
								required
								allowClear
								showNow={true}
								rules={[{ required: true, validateTrigger: 'none' }]}
							/>
							<Button
								type="default"
								onClick={() => {
									return;
								}}
							>
								선택적용
							</Button>
						</span>
					</li>
					<li>
						<label>보건증 유효기간TO</label>
						<span>
							<DatePicker
								name="datePickerBasic2"
								// onChange={onChange}
								required
								allowClear
								showNow={true}
								rules={[{ required: true, validateTrigger: 'none' }]}
							/>
							<Button
								type="default"
								onClick={() => {
									return;
								}}
							>
								선택적용
							</Button>
						</span>
					</li>
				</UiFilterGroup>
			</UiFilterArea>
		</>
	);
};

export default SearchCarDriver;
