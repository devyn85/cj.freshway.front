/*
	############################################################################
	# FiledataField	: NoticePopup.tsx
	# Description		: ###
	# Author			: ###
	# Since			: ###
	############################################################################
*/
// React
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

import { Tabs } from 'antd';

interface propsTypes {
	close: () => void;
}

const NoticePopup = (props: propsTypes) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close } = props;
	const { t } = useTranslation();
	const [activeTabKey, setActiveTabKey] = useState('1');
	const activeTabKeyRef = useRef(activeTabKey);

	// 탭 아이템 영역
	const tabs = [
		{
			key: '1',
			label: '전체',
			children: (
				<>
					<div className="inbox">
						<ul>
							<li>
								<p className="part">시스템</p>
								<dl>
									<dt>
										타이틀 영역 타이틀 영역 타이틀 영역 타이틀 영역 <span className="badge">NEW</span>
										<button className="url-link"></button>
									</dt>
									<dd>
										안녕하세요, ###입니다
										<br />
										<br />
										모바일 앱 인증서가 업데이트됨에 따라, 일부 사용자분들께서는
										<br />
										<b>온리원푸드넷 앱 실행이 불가한 현상이 발생할 수 있습니다.</b>
										<br />
										<br />
										<a href="#n" target="_blank" className="file-link">
											[앱 다운로드 바로가기]
										</a>
									</dd>
								</dl>
							</li>
							<li>
								<p className="part">상품</p>
								<dl>
									<dt>
										타이틀 영역 타이틀 영역 타이틀 영역 타이틀 영역 <span className="badge">NEW</span>
										<button className="url-link"></button>
									</dt>
									<dd>
										안녕하세요, ###입니다
										<br />
										<br />
										모바일 앱 인증서가 업데이트됨에 따라, 일부 사용자분들께서는
										<br />
										<b>온리원푸드넷 앱 실행이 불가한 현상이 발생할 수 있습니다.</b>
									</dd>
								</dl>
							</li>
							<li>
								<p className="part">시스템</p>
								<dl>
									<dt>
										타이틀 영역 타이틀 영역 타이틀 영역 타이틀 영역
										<button className="url-link"></button>
									</dt>
									<dd>
										안녕하세요, ###입니다
										<br />
										<br />
										모바일 앱 인증서가 업데이트됨에 따라, 일부 사용자분들께서는
										<br />
										<b>온리원푸드넷 앱 실행이 불가한 현상이 발생할 수 있습니다.</b>
									</dd>
								</dl>
							</li>
							<li>
								<p className="part">상품</p>
								<dl>
									<dt>
										타이틀 영역 타이틀 영역 타이틀 영역 타이틀 영역
										<button className="url-link"></button>
									</dt>
									<dd>
										안녕하세요, ###입니다
										<br />
										<br />
										모바일 앱 인증서가 업데이트됨에 따라, 일부 사용자분들께서는
										<br />
										<b>온리원푸드넷 앱 실행이 불가한 현상이 발생할 수 있습니다.</b>
									</dd>
								</dl>
							</li>
							<li>
								<p className="part">상품</p>
								<dl>
									<dt>타이틀 영역 타이틀 영역 타이틀 영역 타이틀 영역</dt>
									<dd>
										안녕하세요, ###입니다
										<br />
										<br />
										모바일 앱 인증서가 업데이트됨에 따라, 일부 사용자분들께서는
										<br />
										<b>온리원푸드넷 앱 실행이 불가한 현상이 발생할 수 있습니다.</b>
									</dd>
								</dl>
							</li>
							<li>
								<p className="part">상품</p>
								<dl>
									<dt>타이틀 영역 타이틀 영역 타이틀 영역 타이틀 영역</dt>
									<dd>
										안녕하세요, ###입니다
										<br />
										<br />
										모바일 앱 인증서가 업데이트됨에 따라, 일부 사용자분들께서는
										<br />
										<b>온리원푸드넷 앱 실행이 불가한 현상이 발생할 수 있습니다.</b>
									</dd>
								</dl>
							</li>
							<li>
								<p className="part">상품</p>
								<dl>
									<dt>타이틀 영역 타이틀 영역 타이틀 영역 타이틀 영역</dt>
									<dd>
										안녕하세요, ###입니다
										<br />
										<br />
										모바일 앱 인증서가 업데이트됨에 따라, 일부 사용자분들께서는
										<br />
										<b>온리원푸드넷 앱 실행이 불가한 현상이 발생할 수 있습니다.</b>
									</dd>
								</dl>
							</li>
							<li>
								<dl>
									<dt>타이틀 영역 타이틀 영역 타이틀 영역 타이틀 영역</dt>
									<dd>
										안녕하세요, ###입니다
										<br />
										<br />
										모바일 앱 인증서가 업데이트됨에 따라, 일부 사용자분들께서는
										<br />
										<b>온리원푸드넷 앱 실행이 불가한 현상이 발생할 수 있습니다.</b>
									</dd>
								</dl>
							</li>
						</ul>
					</div>
				</>
			),
		},
		{
			key: '2',
			label: 'Tab11',
			children: <>111</>,
		},
		{
			key: '3',
			label: 'Tab22',
			children: <>222</>,
		},
		{
			key: '4',
			label: 'Tab33',
			children: <>333</>,
		},
	];

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			<div className="notice-home">
				<PopupMenuTitle name="공지사항" showButtons={false} />

				{/* 지도 영역 */}
				<Tabs items={tabs} activeKey={activeTabKey} onChange={setActiveTabKey} className="ntc-conts" />
				{/* <div className="alt-today">
					<Checkbox>오늘 하루 그만보기</Checkbox>
				</div> */}
				<ButtonWrap data-props="single">
					<Button size={'middle'} type="primary">
						{t('공지사항 더보기')}
					</Button>
				</ButtonWrap>
			</div>
		</>
	);
};

export default NoticePopup;
