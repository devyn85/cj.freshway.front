/*
 ############################################################################
 # FiledataField	: StSkuLabelExDCSearch.tsx
 # Description		: 상품이력번호등록(재고생성)
 # Author			    : Baechan
 # Since			    : 25.09.03
 ############################################################################
*/

import CmOrganizeSearch from '@/components/cm/popup/CmOrganizeSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { InputText } from '@/components/common/custom/form';
import { showAlert } from '@/util/MessageUtil';
import { Button } from 'antd';
import { forwardRef, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const StSkuLabelExDCSearch = forwardRef((props: any, ref: any) => {
	const { t } = useTranslation();
	const inputLocRef = useRef(null);

	const handleSelectApply = () => {
		const checkedItems = ref?.current?.getCheckedRowItems();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		const locValue = props.form.getFieldValue('loc') ?? '';

		if (locValue.trim().length < 1) {
			showAlert(null, '재고생성할 로케이션을 입력하시기 바랍니다.');
			inputLocRef.current?.focus();
			return;
		}

		// 체크된 각 행에 대해 반복
		for (const item of checkedItems) {
			ref?.current?.setCellValue(item.rowIndex, 'loc', locValue);
		}
	};

	return (
		<>
			{/* 물류센터 */}
			<li>
				<CmGMultiDccodeSelectBox
					name="dccode"
					placeholder="선택해주세요"
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					mode="single"
					label={'물류센터'}
					required
					disabled
				/>
			</li>
			{/* 창고 */}
			<li>
				<CmOrganizeSearch
					form={props.form}
					selectionMode="multipleRows"
					name="organizeNm"
					code="organize"
					returnValueFormat="name"
					dccode={props.form.getFieldValue('dccode')}
					label="창고"
				/>
			</li>
			{/* 상품코드/명 */}
			<li>
				<CmSkuSearch
					form={props.form}
					selectionMode="multipleRows"
					name="skuName"
					code="sku"
					returnValueFormat="name"
				/>
			</li>
			{/* 로케이션 */}
			<li style={{ gridColumn: '0 / -1', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
				<span>
					<div style={{ flex: 1 }}>
						<InputText
							name="loc"
							label={t('lbl.LOC')}
							placeholder={t('msg.placeholder1', [t('lbl.LOC')])}
							refs={inputLocRef}
						/>
					</div>
					<Button type="default" className="sp-mr-1" onClick={handleSelectApply}>
						선택적용
					</Button>
				</span>
			</li>
		</>
	);
});

export default StSkuLabelExDCSearch;
