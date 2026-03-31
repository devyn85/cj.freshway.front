// Lib
import dayjs from 'dayjs';

// Component
import { InputText, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';

// Store
import { getCommonCodeList } from '@/store/core/comCodeStore';

const CbNoticeSearch = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		props.form.setFieldValue('brdDt', [dayjs().add(-90, 'day'), dayjs().add(90, 'day')]);
	}, []);

	return (
		<>
			<li>
				<Rangepicker label={t('공지기간')} name="brdDt" />
			</li>
			<li>
				<SelectBox
					name="brdDocKndCd"
					label={t('lbl.GUBUN_2')}
					initval={''}
					options={getCommonCodeList('DOC_KND_CD', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<InputText name="updNm" label={t('lbl.WRITER')} />
			</li>
			{/* <li>
				<InputText name="brdTit" label={t('lbl.TITLE')} />
			</li>
			<li>
				<InputText name="brdCntt" label={t('lbl.CONTENT')} />
			</li> */}
			<li>
				<SelectBox
					name="popYn"
					label={t('팝업노출여부')}
					initval={''}
					options={getCommonCodeList('YN', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			<li>
				<SelectBox
					name="delYn"
					label={t('lbl.DEL_YN')}
					initval={''}
					options={getCommonCodeList('DEL_YN', '전체', '')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
			{/* <li>
				<InputText name="brdNum" label={t('공지번호')} />
			</li> */}
		</>
	);
});

export default CbNoticeSearch;
