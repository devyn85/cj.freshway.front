/*
 ############################################################################
 # FiledataField	: CmCarInfoPopup.tsx
 # Description		: 차량 정보 단건 팝업 조회
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
import { apiGetCarInfoPopup } from '@/api/cm/apiCmSearch';
import { useMoveMenu } from '@/hooks/useMoveMenu';

// API Call Function

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
	apiParams?: any;
	linkUrl?: any;
}

const CmCustInfoPopup = forwardRef((props: PropsType, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close, apiParams, linkUrl, titleName } = props;

	interface CarDataType {
		serialkey?: string; // 데이터번호
		carno?: string; // 차량번호 전체
		cargroup?: string; // 차량그룹
		cartype?: string; // 차량종류
		carcategory?: string; // 차량형태
		carcapacity?: string; // 차량용적
		carcubedescr?: string; // 차량체적(장폭고)
		brandname?: string; // 차량브랜드
		driver1?: string; // 운전자 1 이름
		driver2?: string; // 운전자 2 이름
		phone1?: string; // 운전자 1 전화번호
		phone2?: string; // 운전자 2 전화번호
		owner?: string; // 차량 소유주명
		contracttype?: string; // 계약유형
		contractdate?: string; // 계약일자
		expiredate?: string; // 계약만료일
		caragentkey?: string; // 차량 소유 업체
		insurance?: string; // 보험회사
		insucontdate?: string; // 보험계약일
		insuexpidate?: string; // 보험만료일
		mincube?: string; // 최소체적
		maxcube?: string; // 최대체적
		minweight?: string; // 최소중량
		maxweight?: string; // 최대중량
		status?: string; // 상태
		del_yn?: string; // 삭제여부
		adddate?: string; // 최초등록시간
		editdate?: string; // 최종변경시간
		addwho?: string; // 최초등록자
		editwho?: string; // 최종변경자
	}

	const [data, setData] = useState<CarDataType>({});

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

	const callRefresh = useCallback(() => callApi(apiGetCarInfoPopup, apiParams, resCallback), []);
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
		moveMenu(linkUrl || '/ms/msCar', { carno: data?.carno });
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
			<PopupMenuTitle name={titleName || t('lbl.CARDETAILINFO')} func={titleFunc} />
			{/* {children} */}

			<table className="data-table">
				<colgroup>
					<col style={{ width: '15%' }} />
					<col style={{ width: '35%' }} />
					<col style={{ width: '15%' }} />
					<col style={{ width: '35%' }} />
				</colgroup>
				<thead>
					<tr>
						<th colSpan={4}>차량 정보</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th>{t('lbl.CARNO')}</th>
						<td>{data?.carno}</td>
						<th>{t('lbl.CARAGENTKEY')}</th>
						<td>{data?.caragentkey}</td>
					</tr>
					<tr>
						<th>{t('lbl.CARTYPE')}</th>
						<td>{data?.cartype}</td>
						<th>{t('lbl.CARCATEGORY')}</th>
						<td>{data?.carcategory}</td>
					</tr>
					<tr>
						<th>{t('lbl.MINWEIGHT')}</th>
						<td>{data?.minweight}</td>
						<th>{t('lbl.MAXWEIGHT')}</th>
						<td>{data?.maxweight}</td>
					</tr>
					<tr>
						<th>{t('lbl.DRIVER1')}</th>
						<td>{data?.driver1}</td>
						<th>{t('lbl.PHONE1')}</th>
						<td>{data?.phone1}</td>
					</tr>
					<tr>
						<th>{t('lbl.DRIVER2')}</th>
						<td>{data?.driver2}</td>
						<th>{t('lbl.PHONE2')}</th>
						<td>{data?.phone2}</td>
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
