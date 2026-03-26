/**
 * 메뉴 : 공통기능 > 기능템플릿 > 공지사항 > 검색영역 컴포넌트
 * @module comfunc/func/bbsAdminMng/SearchBbsAdminMng
 * @author canalFrame <canalframe@cj.net>
 * @since 1.0.0
 */
// lib
import { Input, Row } from 'antd';
import { ReactElement } from 'react';
// utils
import { getCommonCodeList } from '@/store/core/comCodeStore';
// component
import { DateRange, InputText, SelectBox } from '@/components/common/custom/form';

/**
 * SearchFromProps property
 * @property {any} data data
 * @property {any} setData setData
 * @property {any} search search
 */
interface SearchFromProps {
	data?: any;
	setData?: any;
	search?: any;
}

/**
 * @component
 * @param {SearchFromProps} props search props
 * @returns {object} SearchBbsAdminMng 컴포넌트
 */
const SearchBbsAdminMng = (props: SearchFromProps): ReactElement => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// props
	const { search }: any = props;
	// 다국어
	const { t } = useTranslation();
	// form 인스턴스
	// const form = Form.useFormInstance();

	const viewOptions = [
		{
			label: '---전체---',
			value: '',
		},
		{
			label: '공개',
			value: '1',
		},
		{
			label: '비공개',
			value: '0',
		},
	];

	const searchTypeOptions = [
		{
			label: t('comfunc.bbs.search.term.searchType.title'),
			value: '1',
		},
		{
			label: t('comfunc.bbs.search.term.searchType.titleContent'),
			value: '2',
		},
	];

	return (
		<>
			<Row>
				<DateRange
					label={t('comfunc.bbs.search.daterange')}
					span={10}
					format="YYYY-MM-DD"
					fromName="fromDt"
					toName="thruDt"
				/>
				<SelectBox
					name="bbsTpCd"
					span={7}
					label="공지구분"
					placeholder="선택해주세요"
					options={getCommonCodeList('BBS_TP', '--- 전체 ---')}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
				<SelectBox name="viewYn" span={7} label="공지대상" placeholder="선택해주세요" options={viewOptions} />
			</Row>
			<Row>
				<Input.Group compact>
					<SelectBox
						name="searchType"
						span={12}
						label={t('comfunc.bbs.search.searchText')}
						placeholder="선택해주세요"
						options={searchTypeOptions}
					/>
					<InputText name="bbsTitleNote" onPressEnter={search} />
				</Input.Group>
			</Row>
		</>
	);
};

export default SearchBbsAdminMng;
