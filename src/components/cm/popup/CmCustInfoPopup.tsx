/*
 ############################################################################
 # FiledataField	: CmCustInfoPopup.tsx
 # Description		: 거래처 정보 단건 팝업 조회
 # Author			: jungyunkwon(jungyun8667@cj.net)
 # Since			: 2025.06.23
 ############################################################################
*/
// lib
import { Button } from 'antd';
// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// Utils
import { apiGetCustInfoPopup } from '@/api/cm/apiCmSearch';
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

const CmCustInfoPopup = forwardRef((props: PropsType, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close, apiParams, linkUrl, titleName } = props;

	interface CustDataType {
		custkey?: string; // 고객사코드
		custname?: string; // 고객사명
		custgroupname?: string; // 고객유형
		custstrategy4?: string; // 거래처 마감유형
		addressmatchyn?: string; // 주소매칭여부
		address?: string; // 주소
		address1?: string; // 본 주소
		address2?: string; // 상세주소
		faceinspect?: string; // 대면검수여부
		reqdlvtime2?: string; // OTD(배송요구시간)
		reqdlvtime2From?: string; // OTD 시작시간
		reqdlvtime2To?: string; // OTD 종료시간
		deliveryavailabletime?: string; // 납품가능시간
		buildingopentime?: string; // 건물개방시간
		distantYn?: string; // 격오지여부
		dlvWaitYn?: string; // 납품대기여부
		kidsClYn?: string; // 키즈분류여부
		lngDistantYn?: string; // 장거리여부
		unloadLvlCd?: string; // 하차난이도코드
		specialConditions?: string; // 특수조건 통합표기
		tempertype?: string; // 온도기록지 제출대상
		tempertypename?: string; // 온도기록지 제출대상
		keytype?: string; // 출입KEY정보
		keydetail?: string; // 출입KEY세부정보
		phone1?: string; // 고객사 연락처
		deliverynotiyn?: string; // 배송도착 알림 수신 여부
		truthempname?: string; // 담당MA명
		truthphone?: string; // 담당MA연락처
		memo?: string; // 메모
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
		const res = await apiFunc(apiParams);
		callback?.(res);
	}, []);

	const callRefresh = useCallback(() => callApi(apiGetCustInfoPopup, apiParams, resCallback), []);
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
		moveMenu(linkUrl || '/ms/msCust', apiParams);
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
						<th>{t('lbl.STORERCODE')}</th>
						{/*고객사코드*/}
						<td>{data?.custkey}</td>
						<th>{t('lbl.STORERNAME')}</th>
						{/*고객사명*/}
						<td>{data?.custname}</td>
					</tr>
					<tr>
						<th>{t('lbl.ADDRESS')}</th> {/*주소*/}
						<td colSpan={3}>{data?.address}</td>
					</tr>
					<tr>
						<th>{t('lbl.CUSTTYPE')}</th> {/*고객 유형*/}
						<td>{data?.custgroupname}</td>
						<th>{t('lbl.CUST_CLOSETYPE')}</th>
						{/*거래처 마감유형*/}
						<td>{data?.custstrategy4}</td>
					</tr>
					<tr>
						<th>{t('lbl.OTD_DELIVERYREQTIME')}</th> {/*OTD(배송요구시간)*/}
						<td>{data?.reqdlvtime2}</td>
						<th>{t('lbl.FACE_TO_FACE_INSPECTION_YN ')}</th> {/*대면검수여부*/}
						<td>{data?.faceinspect}</td>
					</tr>
					<tr>
						<th>{t('lbl.DLV_YN_TIME')}</th> {/*납품가능시간*/}
						<td>{data?.deliveryavailabletime}</td>
						<th>{t('lbl.BLDG_OPEN_TIME')}</th> {/*건물 개방 시간*/}
						<td>{data?.buildingopentime}</td>
					</tr>
					<tr>
						<th>{t('lbl.SPECIAL_CONDITION')}</th> {/*특수조건*/}
						<td>{data?.specialConditions}</td>
						<th>{t('lbl.VLT_TEMP_SUBMIT_YN')}</th> {/*온도기록지 제출대상*/}
						<td>{data?.tempertypename}</td>
					</tr>
					<tr>
						<th>{t('lbl.ENTRANCEKEYINFO')}</th> {/*출입KEY정보*/}
						<td>{data?.keytype}</td>
						<th>{t('lbl.ENTRANCEKEYDETAILINFO')}</th> {/*출입KEY 세부정보*/}
						<td>{data?.keydetail}</td>
					</tr>
					<tr>
						<th>{t('lbl.STORER_CONTACT')}</th> {/*고객사연락처*/}
						<td>{data?.phone1}</td>
						<th>{t('lbl.INALARM_RECEIVE_YN')}</th> {/*도착알림 수신여부*/}
						<td>{data?.deliverynotiyn}</td>
					</tr>
					<tr>
						<th>{t('lbl.MACODEANME')}</th> {/*담당MA명*/}
						<td>{data?.truthempname}</td>
						<th>{t('lbl.MACODECONTACT')}</th> {/*담당MA 연락처*/}
						<td>{data?.truthphone}</td>
					</tr>
					<tr>
						<th>{t('lbl.MEMO_NOREFLECTION')}</th> {/*메모(미반영)*/}
						<td colSpan={3}>{data?.memo}</td>
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

export default CmCustInfoPopup;
