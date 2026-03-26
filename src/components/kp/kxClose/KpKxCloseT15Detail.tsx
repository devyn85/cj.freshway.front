// Lib
import { Button, Form } from 'antd';

// API
import { apiSaveInplanZero } from '@/api/kp/apiKpKxClose';

// Component
import { InputText } from '@/components/common/custom/form';

// Asset
import AGrid from '@/assets/styled/AGrid/AGrid';

// CSS
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import UiDetailViewGroup from '@/assets/styled/Container/UiDetailViewGroup';

const KpKxCloseT15Detail = forwardRef((props: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { form } = props;
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */
	/**
	 * 전표 수정 버튼
	 */
	const onClickStockIdInit = async () => {
		const isValid = await validateForm(form);
		if (!isValid) return;

		const params = form.getFieldsValue();

		showConfirm(null, t('msg.MSG_COM_CFM_026', [t('lbl.SLIP')]), () => {
			apiSaveInplanZero(params).then((res: any) => {
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'), // 전표 수정하시겠습니까?
						modalType: 'info',
					});
				}
			});
		});
	};

	return (
		<AGrid className="h100" style={{ paddingTop: 10 }}>
			<Form form={form}>
				<UiDetailViewGroup>
					<li>
						<InputText
							name="docno"
							label={t('lbl.R_DOCNO')} // 전표번호
							required
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
					<li>
						<InputText
							name="docline"
							label={t('lbl.R_DOCLINE')} // 라인번호
							required
							rules={[{ required: true, validateTrigger: 'none' }]}
						/>
					</li>
					<li>
						<InputText
							name="memo"
							label={t('lbl.MEMO')} // 메모
						/>
					</li>
				</UiDetailViewGroup>

				<ButtonWrap data-props="single" className="flex-just-cen">
					<Button type="primary" size="middle" onClick={onClickStockIdInit}>
						{t('lbl.SLIPMODIFY')}
					</Button>
				</ButtonWrap>
			</Form>
		</AGrid>
	);
});

export default KpKxCloseT15Detail;
