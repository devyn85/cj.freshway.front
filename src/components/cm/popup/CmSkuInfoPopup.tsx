/*
 ############################################################################
 # FiledataField	: CmSkuDetailPopup.tsx
 # Description		: 상픔상세 팝업
 # Author			: jh.jang
 # Since			: 25.05.09
 ############################################################################
*/
// lib
import { Button } from 'antd';
// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';

// Utils
import { useMoveMenu } from '@/hooks/useMoveMenu';

// API Call Function
import { apiGetSkuPopup } from '@/api/cm/apiCmSearch';
import { SearchOutlined } from '@ant-design/icons';
import { useAppSelector } from '@/store/core/coreHook';
import { showAlert } from '@/util/MessageUtil';
import { apiGetUserBySelType } from '@/api/cm/apiCmMain';
import commUtil from '@/util/commUtil';
import store from '@/store/core/coreStore';

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

const { VITE_EDMS_IMG_URL } = import.meta.env; // EDMS 이미지 URL

const CmSkuInfoPopup = forwardRef((props: PropsType, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const user = useAppSelector(state => state.user.userInfo); // 사용자 정보 가져오기
	const { close, apiParams, linkUrl, titleName } = props;
	const workplaceId = '101';
	const [menu, setMenu] = useState({ visible: false, x: 0, y: 0 });
	const [rcvrId, setRcvrId] = useState('');

	interface SkuDataType {
		storerkey?: string;
		sku?: string;
		description?: string;
		barcode1?: string;
		barcode2?: string;
		barcode3?: string;
		skugroupdescr?: string;
		skutypedescr?: string;
		duration?: string;
		serialyndescr?: string;
		fileId?: string;
		storagetypenm?: string;
		netweight?: string;
		grossweight?: string;
		serialtypenm?: string;
		boxperplt?: string;
		line01?: string;
		line02?: string;
		usernm?: string;
		buyername?: string;
		userid?: string;
		buyerkey?: string;
		// Add other fields as needed
	}

	const [data, setData] = useState<SkuDataType>({});

	const { moveMenu } = useMoveMenu();

	// 다국어
	const { t } = useTranslation();

	/**
	 * =====================================================================
	 *  02. 함수
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

	const callRefresh = useCallback(() => callApi(apiGetSkuPopup, apiParams, resCallback), []);
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
		const { sku, skuDescr } = apiParams;
		//skuDescr 값이 없을 경우 data에서 가져옴
		const linkSkuDescr = skuDescr || data?.description || '';
		moveMenu(linkUrl || '/ms/msSku', { sku: sku, skuDescr: linkSkuDescr });
		close();
	};

	const handleClickEdms = () => {
		const params = {
			aprvflag: '2',
			attrid: '100',
			id: user.userNo,
			pw: user.userNo,
			mode: '2',
			doctype: '1309',
			requestno: data.sku, // sku 속성 사용
			procflag: '1',
		};
		extUtil.openEdms(params);
	};

	//담당자우클릭
	const handleContextMenu = (e: React.MouseEvent, rcvrType: string) => {
		e.preventDefault();
		// 1: 담당MD/MA
		// 2: 수급담당자
		setRcvrId(rcvrType == '1' ? data?.userid.toLowerCase() : data?.buyerkey.toLowerCase());
		setMenu({
			visible: true,
			x: e.clientX,
			y: e.clientY,
		});
	};

	//담당자우클릭팝업제거
	const handleClickMenu = () => {
		setMenu({
			visible: false,
			x: 0,
			y: 0,
		});
	};

	//AUIGridReactCanal.tsx 복사. 수정시 동기화 필요
	const openDialPopup = (telType: string) => {
		const { VITE_CLICK_TO_DIAL_URL } = import.meta.env;
		const user = store.getState().user.userInfo; // Redux store에서 직접 가져오기

		if (!rcvrId) {
			showAlert(null, '담당자 정보가 없습니다.');
			return;
		}

		// 담당자 전화번호 조회
		apiGetUserBySelType({ selType: 'telNo', userId: rcvrId }).then(res => {
			if (res.statusCode === 0) {
				if (
					(telType === 'phone' && commUtil.isNotEmpty(res.data?.mobNo)) ||
					(telType === 'cotel' && commUtil.isNotEmpty(res.data?.telNo))
				) {
					const params = {
						REQ: 'C2C',
						caller: user.telNo?.replaceAll('-', ''),
						called: telType === 'phone' ? res.data?.mobNo?.replaceAll('-', '') : res.data?.telNo?.replaceAll('-', ''),
					};
					const options = {
						width: '200',
						height: '200',
					};
					extUtil.openWindowAndPost(VITE_CLICK_TO_DIAL_URL, params, options);
				} else {
					showAlert(null, '담당자 정보가 없습니다.');
				}
			}
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		callSearch();

		document.addEventListener('click', handleClickMenu);
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			{/* <PopupMenuTitle name={titleName || t('lbl.SKUDETAILINFO')} func={titleFunc} /> */}
			{/* {children} */}

			<table className="data-table">
				<colgroup>
					<col style={{ width: '10%' }} />
					<col style={{ width: '23%' }} />
					<col style={{ width: '10%' }} />
					<col style={{ width: '23%' }} />
					<col style={{ width: '10%' }} />
					<col style={{ width: '23%' }} />
				</colgroup>
				<thead>
					<tr>
						<th colSpan={6}>상품정보</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th>{t('lbl.SKUCD')}</th>
						<td>{data?.sku}</td>
						{/* 상품명칭*/}
						<th>{t('lbl.SKUNAME')}</th>
						<td>{data?.description}</td>
						<th rowSpan={6}>
							이미지
							<SearchOutlined onClick={handleClickEdms} />
						</th>
						<td rowSpan={6}>
							<div className="img-preview">
								<img key={data?.fileId} src={`${VITE_EDMS_IMG_URL}/${workplaceId}/${data?.fileId}`} alt={''} />
							</div>
						</td>
					</tr>
					<tr>
						{/* 저장조건 */}
						<th>{t('lbl.STORAGETYPE')}</th>
						<td>{data?.storagetypenm}</td>
						{/* 유통기간 */}
						<th>{t('lbl.DURATION')}</th>
						<td>{data?.duration}</td>
					</tr>
					<tr>
						{/* 상품중량 */}
						<th>{t('상품중량')}</th>
						<td>{data?.line01 != 'Y' ? data?.netweight : ''}</td>
						{/* 평균중량값(비정량) */}
						<th>{t(' 평균중량값(비정량) ')}</th>
						<td>{data?.line01 == 'Y' ? data?.line02 : ''}</td>
					</tr>
					<tr>
						{/* 식별번호유무*/}
						<th>{t('lbl.SERIALYN')}</th>
						<td>{data?.serialyndescr}</td>
						{/* 유통이력신고기관*/}
						<th>{t('유통이력신고기관')}</th>
						<td>{data?.serialtypenm}</td>
					</tr>
					<tr>
						{/* 담당MD/MA*/}
						<th>{t(' 담당MD/MA')}</th>
						<td onContextMenu={e => handleContextMenu(e, '1')}>{data?.usernm}</td>
						{/* 수급담당자*/}
						<th>{t('수급담당자')}</th>
						<td onContextMenu={e => handleContextMenu(e, '2')}>{data?.buyername}</td>
					</tr>
					<tr>
						{/*PLT당BOX수 */}
						<th>{t(' PLT당BOX수')}</th>
						<td>{data?.boxperplt}</td>
						<th></th>
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
			{menu.visible && (
				<div
					className="aui-grid-context-popup-layer"
					style={{
						position: 'fixed',
						left: menu.x,
						top: menu.y,
						background: 'white',
						border: '1px solid #ccc',
						padding: 10,
					}}
				>
					<ul className="aui-grid-context-list-ul">
						<li className="aui-grid-context-item" onClick={() => openDialPopup('phone')}>
							담당자 - 전화(핸드폰)
						</li>
						<li className="aui-grid-context-item" onClick={() => openDialPopup('cotel')}>
							담당자 - 전화(사무실)
						</li>
						{/*<li className="aui-grid-context-item" onClick={openSendEmailPopup}>*/}
						{/*	담당자 - 이메일*/}
						{/*</li>*/}
						{/*<li className="aui-grid-context-item" onClick={openSendSmsPopup}>*/}
						{/*	담당자 - 문자*/}
						{/*</li>*/}
						{/*<li className="aui-grid-context-item" onClick={openTeamsPopup}>*/}
						{/*	담당자 - Teams대화*/}
						{/*</li>*/}
					</ul>
				</div>
			)}
		</>
	);
});

export default CmSkuInfoPopup;
