/*
 ############################################################################
 # FiledataField	: CmIndividualPopup.tsx
 # Description		: 개인정보상세 팝업
 # Author			: sss
 # Since			: 25.05.09
 ############################################################################
*/
// lib
import { Button } from 'antd';
// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { Form } from 'antd';
// Utils
import axios from '@/api/Axios';

// API Call Function

interface PropsType {
	titleName?: string; // 팝업 타이틀
	popUpParams?: any; // 팝업에 전달할 파라미터
	close: any; // 팝업 닫기 함수
}

const CmIndividualPopup = forwardRef((props: PropsType, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation(); // 다국어 처리
	const [form] = Form.useForm(); // Antd Form

	const { titleName, popUpParams } = props;

	// Define the shape of your data
	interface DataType {
		userIdDisp?: string;
		name?: string;
		userName?: string;
		userNm?: string;
		telNo?: string;
		handphoneNo?: string;
		empNo?: string;
		engName?: string;
		addr?: string;
		dtAddr?: string; // 상세주소
		email?: string;
		mailId?: string;
		drvLicenseNo?: string; // 운전면허번호
		bizNo?: string; // 사업자등록번호
		accountNo?: string; // 계좌번호
		idNo?: string; // 아이디
		reference07?: string; // 키맨번호
		// Add other fields as necessary
		// e.g., email?: string;
		//       birthDate?: string;
	}
	const [data, setData] = useState<DataType>({});
	const labelList = useMemo(
		() => [
			{
				key: 'userIdDisp',
				label: '사용자ID',
				value: data?.[(popUpParams?.individualColId || 'userIdDisp') as keyof DataType] ?? '',
			},
			{ key: 'name', label: '이름', value: data?.[(popUpParams?.individualColId || 'name') as keyof DataType] ?? '' },
			{
				key: 'userName',
				label: '사용자명',
				value: data?.[(popUpParams?.individualColId || 'userName') as keyof DataType] ?? '',
			},
			{
				key: 'userNm',
				label: '사용자명',
				value: data?.[(popUpParams?.individualColId || 'userNm') as keyof DataType] ?? '',
			},
			{
				key: 'engName',
				label: '영문이름',
				value: data?.[(popUpParams?.individualColId || 'engName') as keyof DataType] ?? '',
			},
			{ key: 'addr', label: '주소', value: data?.[(popUpParams?.individualColId || 'addr') as keyof DataType] ?? '' },
			{
				key: 'telNo',
				label: '전화번호',
				value: data?.[(popUpParams?.individualColId || 'telNo') as keyof DataType] ?? '',
			},
			{
				key: 'handphoneNo',
				label: '핸드폰번호',
				value: data?.[(popUpParams?.individualColId || 'handphoneNo') as keyof DataType] ?? '',
			},
			{
				key: 'email',
				label: '이메일',
				value: data?.[(popUpParams?.individualColId || 'email') as keyof DataType] ?? '',
			},
			{
				key: 'mailId',
				label: '이메일',
				value: data?.[(popUpParams?.individualColId || 'mailId') as keyof DataType] ?? '',
			},
			{
				key: 'reference07',
				label: '키맨번호',
				value: data?.[(popUpParams?.individualColId || 'reference07') as keyof DataType] ?? '',
			},
		],
		[data, popUpParams],
	);
	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 조회
	 */
	const searchMaster = async () => {
		// 조회 조건 설정
		const params = {
			...popUpParams,
			empNo: form.getFieldValue('empNo'),
			userId: form.getFieldValue('userId'),
			noMasking: true, // 마스킹 여부(true: 마스킹 해제, false: 마스킹(default))
			noMaskingLabel: getIndividualLabel(popUpParams?.individualKey),
		};

		searchMasterImp(params);
	};

	/**
	 * 조회 구현 함수
	 * @param params
	 */
	const searchMasterImp = (params: any) => {
		// API 호출
		apiSearchMasterImp(params).then(res => {
			if (res.data != null) {
				if (Array.isArray(res.data) && res.data.length > 0) {
					setData(res?.data[0] || {});
				} else if (commUtil.isNotEmpty(res.data)) {
					setData(res?.data || {});
				}
			}
		});
	};

	const apiSearchMasterImp = (params: any) => {
		if (params.method === 'post') {
			return axios.post(popUpParams.url, params).then(res => res.data);
		}
		return axios.get(popUpParams.url, { params }).then(res => res.data);
	};

	/**
	 * 개인정보 노출 라벨명 가져오기
	 * @param {string} individualKey 개인정보 노출 키
	 * @returns {string} 라벨명
	 */
	const getIndividualLabel = (individualKey: string): string => {
		const item = labelList.find(i => i.key === individualKey);
		return item ? item.label : '';
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		form.setFieldsValue(popUpParams);

		searchMaster();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={titleName || '개인정보상세'} />
			<Form form={form}>
				{/* <InputText type="hidden" name="empNo" /> */}

				<table className="data-table">
					<colgroup>
						<col style={{ width: '15%' }} />
						<col style={{ width: '35%' }} />
						<col style={{ width: '15%' }} />
						<col style={{ width: '35%' }} />
					</colgroup>
					<thead>
						<tr>
							<th colSpan={4}>개인정보</th>
						</tr>
					</thead>
					<tbody>
						{(() => {
							const item = labelList.find(i => i.key === popUpParams?.individualKey);
							const label = item?.label;
							const value = item?.value;

							return commUtil.isNotEmpty(label) ? (
								<tr>
									<th>{label}</th>
									<td colSpan={3}>{value}</td>
								</tr>
							) : null;
						})()}
					</tbody>
				</table>
			</Form>
			<ButtonWrap data-props="single">
				<Button onClick={props.close}>닫기</Button>
			</ButtonWrap>
		</>
	);
});

export default CmIndividualPopup;
