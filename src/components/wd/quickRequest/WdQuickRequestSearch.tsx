/* eslint-disable react/jsx-no-undef */
/*
 ############################################################################
 # FiledataField	: StInoutResultSearch.tsx
 # Description		: 출고 > 출고작업 > 퀵접수(VSR)및처리 Search
 # Author			: sss
 # Since			: 25.12.10
 ############################################################################
*/

//Component
import { MultiInputText, RadioBox, SelectBox } from '@/components/common/custom/form';
import { Rangepicker } from '@/components/common/custom/form/Datepicker';
//Lib
import dayjs from 'dayjs';

// API Call Function
import CmCustSearch from '@/components/cm/popup/CmCustSearch';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { getCommonCodeList } from '@/store/core/comCodeStore';
//Util

const dateFormat = 'YYYY-MM-DD';

const WdQuickRequestSearch = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation(); // 다국어 처리
	const { search, form, activeKey } = props; // Antd Form
	const [dates, setDates] = useState([dayjs().startOf('month'), dayjs()]); //  당월 1일 ~ 오늘

	// Declare react Ref(2/4)

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
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
		//const dt1 = dayjs().startOf('month'); // 당월 1일
		const dt1 = dayjs(); // 오늘
		const dt2 = dayjs(); // 오늘
		setDates([dt1, dt2]);
		form.setFieldValue('docdt', [dt1, dt2]);
		//form.setFieldValue('docdt', [dayjs('2026-01-02'), dayjs('2026-01-02')]);

		form.setFieldValue('status', null);
		form.setFieldValue('vsrtype', null);
		form.setFieldValue('urgentYn', ''); // 기본값: 긴급여부 라디오 전체('')로 세팅
	}, []);

	if (activeKey === '1') {
		// activeKey가 '1'일 때는 일부만 표시
		return (
			<>
				<li>
					<CmGMultiDccodeSelectBox
						name="fixdccode"
						placeholder={t('lbl.SELECT')} // 선택
						fieldNames={{ label: 'dcname', value: 'dccode' }}
						label={t('lbl.DCCODE')} // 물류센터
						mode={'single'}
						onChange={async () => {
							//loadZone(); // 센터에 해당되는 zone 정보 조회
						}}
					/>
				</li>
				<li>
					<Rangepicker
						label="조회기간" // 조회기간
						name="docdt"
						defaultValue={dates}
						format={dateFormat}
						span={24}
						allowClear
						showNow={false}
						required
						rules={[{ required: true, validateTrigger: 'none' }]} /*  */
					/>
				</li>

				<li>
					<RadioBox
						label="긴급여부"
						name="urgentYn"
						options={[
							{ label: '전체', value: '' },
							{
								label: '예',
								value: '1',
							},
							{
								label: '아니오',
								value: '0',
							},
						]}
					/>
				</li>

				<li>
					<SelectBox
						label={t('VOC퀵진행사항')} // VOC퀵진행사항
						name="status"
						options={getCommonCodeList('STATUS_QUICK', t('lbl.ALL'))}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				<li>
					<SelectBox
						label={t('VSR유형')} // VSR유형
						name="vsrtype"
						options={getCommonCodeList('VSR_TYPE', t('lbl.ALL'))}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>

				<li>
					<MultiInputText
						label={t('VOC번호')} // VOC번호
						name="vocno"
						placeholder={t('msg.placeholder1', [t('lVOC번호')])}
						onPressEnter={search}
					/>
				</li>
				<li>
					<CmCustSearch
						label={t('lbl.CONTRACTCOMPANY')} // "계약업체"
						form={form}
						name="contractcustkeyname"
						code="contractcustkey"
						returnValueFormat="name"
						selectionMode="multipleRows"
					/>
				</li>
				<li>
					<MultiInputText
						label={t('센터접수번호')} // 센터접수번호
						name="rcptNo"
						placeholder={t('msg.placeholder1', [t('센터접수번호')])}
						onPressEnter={search}
					/>
				</li>
			</>
		);
	} else {
		// activeKey가 '1'일 때는 일부만 표시
		return (
			<>
				<li>
					<CmGMultiDccodeSelectBox
						name="fixdccode"
						placeholder={t('lbl.SELECT')} // 선택
						fieldNames={{ label: 'dcname', value: 'dccode' }}
						label={t('lbl.DCCODE')} // 물류센터
						mode={'single'}
						required
						onChange={async () => {
							//loadZone(); // 센터에 해당되는 zone 정보 조회
						}}
					/>
				</li>
				<li>
					<Rangepicker
						label="조회기간" // 조회기간
						name="docdt"
						defaultValue={dates}
						format={dateFormat}
						span={24}
						allowClear
						showNow={false}
						required
						rules={[{ required: true, validateTrigger: 'none' }]} /*  */
					/>
				</li>

				<li>
					<RadioBox
						label="긴급여부"
						name="urgentYn"
						options={[
							{ label: '전체', value: '' },
							{
								label: '예',
								value: '1',
							},
							{
								label: '아니오',
								value: '0',
							},
						]}
					/>
				</li>

				<li>
					<SelectBox
						label={t('VOC퀵진행사항')} // VOC퀵진행사항
						name="status"
						options={getCommonCodeList('STATUS_QUICK', t('lbl.ALL'))}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>
				<li>
					<SelectBox
						label={t('VSR유형')} // VSR유형
						name="vsrType"
						options={getCommonCodeList('VSR_TYPE', t('lbl.ALL'))}
						fieldNames={{ label: 'cdNm', value: 'comCd' }}
					/>
				</li>

				<li>
					<MultiInputText
						label={t('VOC번호')} // VOC번호
						name="vocno"
						placeholder={t('msg.placeholder1', [t('lVOC번호')])}
						onPressEnter={search}
					/>
				</li>
				<li>
					<CmCustSearch
						label={t('lbl.CONTRACTCOMPANY')} // "계약업체"
						form={form}
						name="contractcustkeyname"
						code="contractcustkey"
						returnValueFormat="name"
						selectionMode="multipleRows"
					/>
				</li>

				<li>
					<MultiInputText
						label={t('센터접수번호')} // 센터접수번호
						name="quickDocno"
						placeholder={t('msg.placeholder1', [t('센터접수번호')])}
						onPressEnter={search}
					/>
				</li>
			</>
		);
	}
});

export default WdQuickRequestSearch;
