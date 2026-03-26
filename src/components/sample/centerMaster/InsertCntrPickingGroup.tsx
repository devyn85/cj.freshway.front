import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import { InputText, SelectBox } from '@/components/common/custom/form';
import { Button, Form } from 'antd';
const InsertCntrPickingGroup = (props: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const isInsert = props.state;

	const { data, onFormChange, insertForm, onClickNext, onClickPrev, dcList } = props;
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	useEffect(() => {
		if (data && Object.keys(data).length > 0) {
			insertForm.setFieldsValue({ ...data });
		} else {
			insertForm.resetFields(); // 신규 입력 시 필드 초기화
		}
	}, [data]);

	return (
		<Form form={insertForm} onValuesChange={onFormChange}>
			<UiFilterArea>
				<UiFilterGroup>
					<li>
						{isInsert ? <label>물류센터</label> : <label data-required>물류센터</label>}
						<span>
							<SelectBox
								name="dccode"
								//임시 데이터
								options={dcList}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								defaultValue="선택"
								disabled={isInsert}
								onChange={(value: string) => {
									insertForm.setFieldsValue({ organize: value });
									// //console.log(value);
								}}
							/>
						</span>
					</li>
					<li>
						{isInsert ? <label>플랜트</label> : <label data-required>플랜트</label>}
						<span>
							<SelectBox
								name="plant"
								//임시 데이터
								options={dcList}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								defaultValue="선택"
								disabled={isInsert}
							/>
						</span>
					</li>
					<li>
						<label>창고</label>
						<span>
							<InputText name="organize" disabled />
						</span>
					</li>
					<li>
						<label>작업구역</label>
						<span>
							<InputText name="area" disabled />
						</span>
					</li>
				</UiFilterGroup>
				<UiFilterGroup>
					<li>
						<label data-required>배치그룹</label>
						<span>
							<InputText name="batchgroup" />
						</span>
					</li>
					<li>
						<label data-required>내역</label>
						<span>
							<InputText name="description" span={24} />
						</span>
					</li>
				</UiFilterGroup>
				<UiFilterGroup>
					<li>
						{isInsert ? <label>저장조건</label> : <label data-required>저장조건</label>}
						<span>
							<SelectBox
								name="storagetype"
								//
								options={[
									{ cdNm: '선택', comCd: '' },
									{ cdNm: '실온', comCd: '10' },
									{ cdNm: '냉장', comCd: '20' },
									{ cdNm: '냉동', comCd: '30' },
									{ cdNm: '특수', comCd: '40' },
								]}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								defaultValue="선택"
								disabled={isInsert}
							/>
						</span>
					</li>
					<li>
						{isInsert ? <label>원거리유형</label> : <label data-required>원거리유형</label>}
						<span>
							<InputText name="distancetype" disabled={isInsert} />
						</span>
					</li>
				</UiFilterGroup>
				<UiFilterGroup>
					<li>
						<label>etcode1</label>
						<span>
							<InputText name="etcode1" disabled={isInsert} />
						</span>
					</li>
					<li>
						<label>etcode2</label>
						<span>
							<InputText name="etcode2" disabled={isInsert} />
						</span>
					</li>
					<li>
						<label>etcode3</label>
						<span>
							<InputText name="etcode3" disabled={isInsert} />
						</span>
					</li>
					<li>
						<label>etcode4</label>
						<span>
							<InputText name="etcode4" disabled={isInsert} />
						</span>
					</li>
				</UiFilterGroup>
				<UiFilterGroup>
					<li>
						<label data-required>진행상태</label>
						<span>
							<InputText name="status" />
						</span>
					</li>
					<li>
						<label data-required>삭제여부</label>
						<span>
							<SelectBox
								name="delyn"
								//
								options={[
									{ cdNm: '삭제', comCd: 'N' },
									{ cdNm: '정상', comCd: '10' },
									{ cdNm: '삭제요청', comCd: '20' },
									{ cdNm: '삭제보류', comCd: '30' },
									// { cdNm: '특수', comCd: '40' },
								]}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								defaultValue="선택"
							/>
						</span>
					</li>
				</UiFilterGroup>
				<UiFilterGroup>
					<li>
						<label>등록일자</label>
						<span>
							<InputText name="editdate" disabled />
						</span>
					</li>
					<li>
						<label>생성인</label>
						<span>
							<InputText name="addwho" disabled />
						</span>
					</li>
					<li>
						<label>최종변경시간</label>
						<span>
							<InputText name="editdate" disabled />
						</span>
					</li>
					<li>
						<label>최종변경자</label>
						<span>
							<InputText name="editwho" disabled />
						</span>
					</li>
				</UiFilterGroup>
			</UiFilterArea>

			<InputText name="flag" disabled={isInsert} type={'hidden'} />
			{/* <InputText name="delyn" disabled={isInsert} type={'hidden'} /> */}
			<InputText name="ordertype" disabled={isInsert} type={'hidden'} />

			<Button onClick={onClickPrev}>이전</Button>
			<Button onClick={onClickNext}>다음</Button>
		</Form>
	);
};
export default InsertCntrPickingGroup;
