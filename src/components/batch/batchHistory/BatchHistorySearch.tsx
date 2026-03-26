/*
 ############################################################################
 # FiledataField	: BatchHistorySearch.tsx
 # Description		: 배치 > 배치관리 > 배치 이력 > 검색
 # Author			: yewon.kim
 # Since			: 25.07.08
 ############################################################################
*/
// component
import { InputText, Rangepicker, SelectBox } from '@/components/common/custom/form';

// CSS

// store
import { getCommonCodeList } from '@/store/core/comCodeStore';

// lib
import dayjs from 'dayjs';

const dateFormat = 'YYYY-MM-DD';

const BatchHistorySearch = (props: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { search, form, exception } = props;
	const [dates, setDates] = useState([dayjs(), dayjs()]);

	const { t } = useTranslation(); // 다국어

	//검색영역 초기 세팅
	const [searchBox] = useState({
		timezoneCd: 'Asia/Seoul',
	});

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * data onChange Event Handler
	 * @param  {string} value 변경 후 data
	 */
	const onChange = (value: string) => {};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	/**
	 * 현재날짜를 셋팅한다.
	 */
	useEffect(() => {
		// 초기값 설정 (컴포넌트 마운트 시)
		const initialStart = dayjs();
		const initialEnd = dayjs();
		setDates([initialStart, initialEnd]);
		form.setFieldValue('excutionDt', [initialStart, initialEnd]);
	}, []);

	return (
		<>
			<li>
				<Rangepicker
					label={'실행일자'} //실행일자
					name="excutionDt"
					defaultValue={dates} // 초기값 설정
					format={dateFormat} // 화면에 표시될 형식
					span={24}
					allowClear
					showNow={false}
					//nChange={handleDateChange}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li>
				{/* JOB 이름 */}
				<InputText label={'JOB ID/명'} name="jobName" placeholder={t('msg.MSG_COM_VAL_054', ['JOB ID/명'])} />
			</li>
			<li>
				{/* 작업 구분 */}
				<SelectBox
					name="stepResult"
					placeholder="선택해주세요"
					options={getCommonCodeList('JOB_GUBUN', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={t('lbl.JOBGUBUN')}
				/>
			</li>
			<li>
				{/* JOB 수행 결과 */}
				<SelectBox
					name="jobResult"
					span={24}
					placeholder="선택해주세요"
					options={getCommonCodeList('JOB_RESULT_CD', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'JOB 수행 결과'}
				/>
			</li>

			<li>
				{/* JOB 실행 ID */}
				<InputText
					label={'JOB 실행 ID'}
					name="jobExecutionId"
					placeholder={t('msg.MSG_COM_VAL_054', ['JOB 실행 ID'])}
				/>
			</li>
			<li>
				{/* JOB 인스턴스 ID */}
				<InputText
					label={'JOB 인스턴스 ID'}
					name="jobInstanceId"
					placeholder={t('msg.MSG_COM_VAL_054', ['JOB 인스턴스 ID'])}
				/>
			</li>
			<li>
				{/* JOB 이름 */}
				<InputText
					label={'JOB ID/명[AS-IS]'}
					name="asisJobName"
					placeholder={t('msg.MSG_COM_VAL_054', ['JOB ID/명[AS-IS]'])}
				/>
			</li>
			<li>
				{/* 오류발생상태 */}
				<SelectBox
					name="errorStatus"
					span={24}
					placeholder="선택해주세요"
					options={getCommonCodeList('JOB_RESULT_CD', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
					label={'오류발생상태'}
				/>
			</li>
		</>
	);
};

export default BatchHistorySearch;
