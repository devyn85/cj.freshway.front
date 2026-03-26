/*
 ############################################################################
 # FiledataField : TmDispatchListSearch.tsx
 # Description   : 배차목록 검색 영역
*/
import { DateRange, InputSearch, SelectBox } from '@/components/common/custom/form';

const TmDispatchListSearch = ({ form }: any) => {
	return (
		<>
			<li>
				<DateRange label={'배송일자'} name={'rangeShipDt'} />
			</li>
			<li>
				<SelectBox
					label={'물류센터'}
					name={'dcCd'}
					allowClear
					options={
						[
							/* 물류센터 옵션 */
						]
					}
				/>
			</li>
			<li>
				<InputSearch label={'POP'} name={'pop'} placeholder={'POP 검색'} />
			</li>
			<li>
				<InputSearch label={'권역그룹'} name={'areaGroup'} placeholder={'권역그룹 검색'} />
			</li>
			<li>
				<InputSearch label={'권역'} name={'area'} placeholder={'권역 검색'} />
			</li>
			<li>
				<InputSearch label={'관리처코드'} name={'manageCd'} placeholder={'관리처코드 검색'} />
			</li>
			<li>
				<SelectBox
					label={'배송유형'}
					name={'shipType'}
					allowClear
					options={[
						{ label: '배송', value: '배송' },
						{ label: '조달', value: '조달' },
					]}
				/>
			</li>
			<li>
				<InputSearch label={'차량번호'} name={'carNo'} placeholder={'차량번호 검색'} />
			</li>
			<li>
				<InputSearch label={'주문마감경로'} name={'orderClosePath'} placeholder={'주문마감경로 검색'} />
			</li>
		</>
	);
};

export default TmDispatchListSearch;
