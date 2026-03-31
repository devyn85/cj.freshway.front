/*
 ############################################################################
 # FiledataField	: MsPboxSearch.tsx
 # Description		: 재고 > 공용기 관리 > P-BOX 관리/사용 현황 조회 조건 화면
 # Author			: KimDongHan
 # Since			: 2025.09.18
 ############################################################################
*/

// Components
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import { SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
import { getUserDccodeList } from '@/store/core/userStore';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// Store

// Libs

// Utils

const MsPboxSearch = ({ form, dates, setDates, gDccode, activeKey }: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */

	const { t } = useTranslation();

	const dateFormat = 'YYYY-MM-DD';

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	/**
	 * 현재날짜를 셋팅한다.
	 */
	useEffect(() => {
		form.setFieldValue('dccode', gDccode);
		const today = dayjs();
		const firstDay = today.startOf('month');
		const lastDay = today.endOf('month');
		setDates([firstDay, lastDay]);
		form.setFieldValue('carAllocateDt', [firstDay, lastDay]);
		form.setFieldValue('deliverydt', [firstDay, lastDay]);
	}, []);

	return (
		<>
			{/* 물류센터 */}
			<li>
				<SelectBox
					label={t('lbl.DCCODE')}
					name="dccode"
					options={[{ dcname: t('lbl.SELECT'), dccode: '' }, ...getUserDccodeList()]}
					fieldNames={{ label: 'dcname', value: 'dccode' }}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			{activeKey === '1' && (
				<>
					{/* 할당여부 */}
					<li>
						<SelectBox
							label={t('lbl.ALLOCATED_YN')}
							name="allocatedYn"
							options={[
								{ cdNm: t('lbl.ALL'), comCd: '' },
								{ cdNm: 'Yes', comCd: 'Y' },
								{ cdNm: 'No', comCd: 'N' },
							]}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
				</>
				// <li>
				// 	{/* 차량할당일 */}
				// 	<Rangepicker
				// 		label={t('lbl.CAR_ALLOCATE_DT')}
				// 		name="carAllocateDt"
				// 		defaultValue={dates}
				// 		format={dateFormat}
				// 		allowClear
				// 		showNow={false}
				// 		required
				// 		rules={[{ required: true, validateTrigger: 'none' }
				// 		]}
				// 	/>
				// </li>
			)}
			{activeKey === '2' && (
				<li>
					{/* 출고일자 */}
					<Rangepicker
						label={t('lbl.DOCDT_WD')}
						name="deliverydt"
						defaultValue={dates}
						format={dateFormat}
						allowClear
						showNow={false}
						required
						rules={[{ required: true, validateTrigger: 'none' }]}
					/>
				</li>
			)}

			{/* 차량번호 */}
			<li>
				<CmCarSearch form={form} name="carnoNm" code="carno" label={t('lbl.CARNO')} selectionMode="multipleRows" />
			</li>
			{activeKey === '1' && (
				<>
					{/* 재출력
						<li>
							<SelectBox
								label={t('lbl.RE_PRINT')}
								name="reprint"
								options={[
									{ cdNm: t('lbl.ALL'), comCd: '' },
									{ cdNm: 'Yes', comCd: 'Y' },
									{ cdNm: 'No', comCd: 'N' },
								]}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
							/>
						</li> */}
					{/* 재출력 */}
					<li>
						<SelectBox
							label={t('lbl.USE_YN')}
							name="useYn"
							options={[
								{ cdNm: t('lbl.ALL'), comCd: '' },
								{ cdNm: 'Yes', comCd: 'Y' },
								{ cdNm: 'No', comCd: 'N' },
							]}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
						/>
					</li>
				</>
			)}
		</>
	);
};

export default MsPboxSearch;
