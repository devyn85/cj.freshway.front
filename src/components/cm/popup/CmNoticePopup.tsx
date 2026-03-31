/*
 ############################################################################
 # FiledataField	: CmNoticePopup.tsx
 # Description		: 공지사항 팝업
 # Author			: JGS
 # Since			: 25.12.10
 ############################################################################
*/
// Lib
import { Button, Checkbox, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';

// CSS
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';

// Store
import { useMoveMenu } from '@/hooks/useMoveMenu';
import { getCommonCodeList } from '@/store/core/comCodeStore';

// Component
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

const CmNoticePopup = (props: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const { moveMenu } = useMoveMenu();

	const { data, close } = props;
	const [activeTabKey, setActiveTabKey] = useState('ALL');
	const [tabs, setTabs] = useState([]);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 노출되는 HTML 생성
	 * @param {any} data 아이템
	 * @returns {any} HTML
	 */
	const makeHtml = (data: any): any => {
		return (
			<div className="inbox">
				<ul>
					{data.map((item: any) => (
						<li key={item.brdnum}>
							<p className={item.brdDocKndCd === 'EMERGENCY' ? 'part gc-user41' : 'part'}>
								{getCommonCodeList('DOC_KND_CD').find(obj => obj.comCd === item.brdDocKndCd)?.cdNm}
							</p>
							<dl>
								<dt>
									<b>{item.brdtit}</b>
									{commUtil.isNotEmpty(item?.redirectUrl) && (
										<button className="url-link" onClick={() => goNoticeDetail(item)}></button>
									)}
									{item?.readYn === 'N' && <span className="badge">NEW</span>}
								</dt>
								<dd dangerouslySetInnerHTML={{ __html: item.brdcntt }} />
							</dl>
							{item?.fileList && item?.fileList?.length > 0 && (
								<>
									{item.fileList.map((file: any) => (
										<>
											<br />
											<a key={item.uploadedFileNm} className="file-link" onClick={() => fileDownloadEvent(file)}>
												[첨부파일] {file.sourceFileNm}
											</a>
										</>
									))}
								</>
							)}
						</li>
					))}
				</ul>
			</div>
		);
	};

	/**
	 * 오늘 날짜 가져오기
	 * @returns {string} 날자값
	 */
	const getToday = () => {
		const today = new Date();
		return today.toISOString().slice(0, 10); // yyyy-mm-dd
	};

	/**
	 * 파일 다운로드
	 * @param {object} file 파일 정보
	 */
	const fileDownloadEvent = (file: any) => {
		const params = {
			dirType: 'savePath',
			saveFileNm: file?.sourceFileNm,
			savePathNm: file?.uploadedDirPath,
			attchFileNm: file?.uploadedFileNm,
		};
		fileUtils.downloadFile(params);
	};

	/**
	 * TAB 변경시
	 * @param {any} e TAB 키값
	 */
	const onTabChange = (e: any) => {
		setActiveTabKey(e);

		// TAB 변경시 상단으로 스크롤 이동
		const holder = document.querySelector('.ant-tabs-content-holder');
		holder?.scrollTo({ top: 0, behavior: 'smooth' });
	};

	/**
	 * 공지사항 업무 페이지로 이동
	 */
	const goNotice = () => {
		close();
		moveMenu('/cb/cbNotice');
	};

	/**
	 * 공지사항 업무 상세 페이지로 이동
	 * @param {any} item 아이템
	 */
	const goNoticeDetail = (item: any) => {
		if (commUtil.isNotEmpty(item?.['redirectUrl']) && item?.['redirectUrl'].includes('http')) {
			window.open(item?.['redirectUrl'], '_blank');
		} else {
			close();
			moveMenu(item['redirectUrl'] || '/cb/cbNotice', { state: { brdNum: item.brdnum } });
		}
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		if (commUtil.isNotEmpty(data)) {
			const order = getCommonCodeList('DOC_KND_CD').map((code: any) => code.comCd);

			// TAB 노출 순서에 맞게 정렬
			const dataTmp = [...data];
			dataTmp.sort((a: any, b: any) => {
				return order.indexOf(a.brdDocKndCd) - order.indexOf(b.brdDocKndCd);
			});

			// 유형별 그룹핑
			const grouped = dataTmp.reduce((acc: any, cur: any) => {
				const key = cur.brdDocKndCd;
				if (!acc[key]) {
					acc[key] = [];
				}
				acc[key].push(cur);
				return acc;
			}, {});
			const groupedByIndex: any[] = Object.values(grouped);

			const tabsTmp = [
				{
					key: 'ALL',
					label: '전체',
					children: makeHtml(data),
				},
			];

			for (const grouped of groupedByIndex) {
				tabsTmp.push({
					key: grouped[0]?.['brdDocKndCd'],
					label: getCommonCodeList('DOC_KND_CD').find(obj => obj.comCd === grouped[0]?.['brdDocKndCd'])?.cdNm,
					children: makeHtml(grouped),
				});
			}

			setTabs(tabsTmp);
		}
	}, [data]);

	return (
		<div className="notice-home">
			<PopupMenuTitle name="공지사항" showButtons={false} />

			{/* TAB 영역 */}
			<Tabs items={tabs} activeKey={activeTabKey} onChange={onTabChange} className="ntc-conts" />
			<div className="alt-today">
				<Checkbox
					onChange={(e: any) => {
						if (e.target.checked) {
							localStorage.setItem('noticeHideDate', getToday());
							close();
						}
					}}
				>
					오늘 하루 그만보기
				</Checkbox>
			</div>
			<ButtonWrap data-props="single">
				<Button size={'middle'} type="primary" onClick={goNotice}>
					{t('공지사항 더보기')}
				</Button>
			</ButtonWrap>
		</div>
	);
};

export default CmNoticePopup;
