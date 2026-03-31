/*
 ############################################################################
 # FiledataField	: CmPartnerInfoPopup.tsx
 # Description		: 협력사 정보 단건 팝업 조회
 # Author			: 
 # Since			: 2026.01.23
 ############################################################################
*/
// lib
import { Button } from 'antd';
// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// Utils
import { apiGetPartnerInfoPopup } from '@/api/cm/apiCmSearch';
import { useMoveMenu } from '@/hooks/useMoveMenu';

// API Call Function

interface ApiParams {
	custkey: string;
	custtype: string;
	storerkey: string;
	dlv_dccode?: string;
}
interface PropsType {
	callBack?: any;
	searchParam?: string;
	searchName?: string;
	gridData?: Array<object>;
	search?: any;
	data?: any;
	selectionMode?: string;
	close?: any;
	setCurrentPage?: any;
	gridRef?: any;
	form?: any;
	name?: string;
	totalCount?: number;

	titleName?: any;
	refModal?: any;
	children?: any;
	apiParams: ApiParams;
	linkUrl?: any;
}

const CmPartnerInfoPopup = forwardRef((props: PropsType, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close, apiParams, linkUrl, titleName } = props;

	interface CustDataType {
		custkey?: string; // 고객사코드
		custname?: string; // 고객사명
		addr?: string; // 주소
		vatno?: string; // 사업자등록번호
		vattype?: string; // 사업자등록업태
		pl3UseYn?: string; // PL3 사용여부
		pl3nm?: string; // PL3 사명
		pl3Mngempnm?: string; // PL3 담당자명
		pl3Phone?: string; // PL3 담당자 전화번호
		rpstPhone?: string; // 대표 전화번호
		vatcategory?: string; // 사업자 등록 종목

		deliveryYn?: string; // 조달여부
		deliverySaveYn?: string; // 조달상품 저장유무
		deliveryInTime?: string; // 조달시간
		deliveryCtrtTerm: string; // 조달계약기간

		addwhonm?: string; // 등록자명
		editwhonm?: string; // 수정자명
		adddate?: string; // 등록일시
		editdate?: string; // 수정일시
	}

	const [data, setData] = useState<CustDataType>({});

	const { moveMenu } = useMoveMenu();

	// 다국어
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	// Response Callback
	const resCallback = useCallback((res: any) => {
		setData(res?.data || {});
	}, []);

	const callApi = useCallback(async (apiFunc: any, params: any, callback?: any) => {
		const a = {
			...apiParams,
			dlvcustkey: apiParams.custkey,
			dropcustkey: apiParams.custkey,
			toCustkey: apiParams.custkey,
		};
		const res = await apiFunc(a);
		callback?.(res);
	}, []);

	const callRefresh = useCallback(() => callApi(apiGetPartnerInfoPopup, apiParams, resCallback), []);
	const callSearch = callRefresh;

	/**
	 * 검색 버튼 클릭
	 */
	const onClickSearchButton = () => {
		callSearch();
	};

	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickRefreshButton = () => {
		callRefresh();
	};

	// 메뉴 타이틀에 연결할 함수
	const titleFunc = {
		searchYn: onClickSearchButton,
		refresh: onClickRefreshButton,
	};

	// 바로가기 url Event
	const gotoUrlEvent = () => {
		moveMenu(linkUrl || '/ms/msCustDeliveryInfoP', apiParams);
		close();
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		callSearch();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={titleName || t('lbl.CUSTDETAILINFO')} />
			{/* {children} */}

			<table className="data-table">
				<colgroup>
					<col style={{ width: '15%' }} />
					<col style={{ width: '35%' }} />
					<col style={{ width: '15%' }} />
					<col style={{ width: '35%' }} />
				</colgroup>
				<tbody>
					<tr>
						<th>협력사코드</th>
						{/*협력사코드*/}
						<td>{data?.custkey}</td>
						<th>고객사명</th>
						{/*고객사명*/}
						<td>{data?.custname}</td>
					</tr>
					<tr>
						<th>{t('lbl.ADDRESS')}</th> {/*주소*/}
						<td colSpan={3}>{data?.addr}</td>
					</tr>
					<tr>
						<th>사업자 등록번호</th> {/*사업자 등록번호*/}
						<td>{data?.vatno}</td>
						<th>대표 전화번호</th>
						{/*대표 전화번호*/}
						<td>{data?.rpstPhone}</td>
					</tr>
					<tr>
						<th>사업자 등록 업태</th> {/*사업자 등록 업태*/}
						<td>{data?.vattype}</td>
						<th>사업자 등록 종목</th> {/*사업자 등록 종목*/}
						<td>{data?.vatcategory}</td>
					</tr>
					<tr>
						<th>3PL 사용유무</th> {/*3PL 사용유무*/}
						<td>{data?.pl3UseYn}</td>
						<th>3PL사명</th> {/*3PL사명*/}
						<td>{data?.pl3nm}</td>
					</tr>
					<tr>
						<th>3PL 담당자명</th> {/*3PL 담당자명*/}
						<td>{data?.pl3Mngempnm}</td>
						<th>3PL담당자 전화번호</th> {/*3PL담당자 전화번호*/}
						<td>{data?.pl3Phone}</td>
					</tr>
					<tr>
						<th>조달여부</th> {/*조달여부*/}
						<td>{data?.deliveryYn}</td>
						<th>조달입차시간</th> {/*조달입차시간*/}
						<td>{data?.deliveryInTime}</td>
					</tr>
					<tr>
						<th>조달계약기간</th> {/*조달계약기간*/}
						<td>{data?.deliveryCtrtTerm}</td>
						<th></th> {/*조달계약기간*/}
						<td></td>
					</tr>
				</tbody>
			</table>

			<ButtonWrap data-props="single">
				<Button onClick={close}>취소</Button>
				<Button type="primary" onClick={gotoUrlEvent}>
					바로가기
				</Button>
			</ButtonWrap>
		</>
	);
});

export default CmPartnerInfoPopup;
