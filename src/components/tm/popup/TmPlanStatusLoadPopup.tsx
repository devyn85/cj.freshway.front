/*
 ############################################################################
 # FiledataField	: TmPlanStatusLoadPopup.tsx
 # Description		: 상차지시 팝업 설정
 # Author			: 손인성
 # Since			: 2025.12.27
 ############################################################################
*/

// lib
import { Button, Form } from 'antd';
import dayjs from 'dayjs';
//Store
import { getCommonCodeList } from '@/store/core/comCodeStore';
// component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { Datepicker, SearchForm, SelectBox } from '@/components/common/custom/form';
// css
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
// api
import { saveLoadStatusSetting } from '@/api/wd/apiWdLoadPop';

interface ITmPlanStatusLoadPopupProps {
	callBack?: any;
	close?: any;
	search?: any;
	parentFormValues?: any;
}

const TmPlanStatusLoadPopup = forwardRef(
	({ callBack, close, search, parentFormValues }: ITmPlanStatusLoadPopupProps, ref: any) => {
		const { t } = useTranslation();
		const statusLoadCodeList = getCommonCodeList('STATUS_LOAD', '', '') ?? [];
		const [form] = Form.useForm();

		/**
		 * 부모에서 호출할 수 있는 함수 노출
		 */
		useImperativeHandle(ref, () => ({
			setMultiDcCode: (value: any) => {
				form.setFieldValue('gDccode', value);
			},
			setShipDt: (value: any) => {
				form.setFieldValue('shipDt', value);
			},
			setStatusLoadCode: (value: any) => {
				form.setFieldValue('statusLoadCode', value);
			},
		}));

		const handleSaveLoadStatus = async (reqValues: any) => {
			const reqParams = {
				dccode: reqValues.gDccode,
				shipDt: dayjs(reqValues.shipDt).format('YYYYMMDD'),
				loadStatus: reqValues.statusLoadCode,
			};
			const res = await saveLoadStatusSetting(reqParams);
			if (res.statusCode === 0) {
				showAlert(null, '상차지시 팝업 설정이 완료되었습니다.');
				close?.();
			}
		};

		return (
			<>
				{/* 상단 타이틀 및 페이지버튼 */}
				<PopupMenuTitle name="상차지시 팝업 설정" />
				{/* 조회 컴포넌트 */}
				<SearchForm form={form} initialValues={{}} isAlwaysVisible>
					<UiFilterArea>
						<UiFilterGroup className="grid-column-3">
							{/* 물류센터 */}
							<li>
								<CmGMultiDccodeSelectBox mode={'single'} name={'gDccode'} disabled={true} />
							</li>
							{/* 배송일자 선택 */}
							<li>
								<Datepicker label={t('lbl.DELIVERYDATE_WD')} name={'shipDt'} />
							</li>
							{/* 배차상태 선택 */}
							<li>
								<SelectBox
									label={'LOADSTATUS'}
									name={'statusLoadCode'}
									allowClear
									fieldNames={{ label: 'cdNm', value: 'comCd' }}
									options={statusLoadCodeList}
								/>
							</li>
						</UiFilterGroup>
					</UiFilterArea>
				</SearchForm>
				{/* 버튼 영역 */}
				<ButtonWrap data-props="single">
					<Button onClick={close}>{t('lbl.CLOSE')}</Button>
					<Button
						type="primary"
						onClick={() => {
							const values = form.getFieldsValue();

							handleSaveLoadStatus(values);
						}}
					>
						{t('lbl.BTN_CONFIRM')}
					</Button>
				</ButtonWrap>
			</>
		);
	},
);

export default TmPlanStatusLoadPopup;
