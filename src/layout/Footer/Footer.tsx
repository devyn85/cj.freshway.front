import UiFooterGroup from '@/assets/styled/Container/UiFooterGroup';
import { QRCodeCanvas } from 'qrcode.react';
import React, { useEffect, useRef, useState } from 'react';

// Store & API
import { apiGetLoginHistory } from '@/api/cm/apiCmLogin';
import { useAppSelector } from '@/store/core/coreHook';

import driverPRD from '@/assets/img/WayLo 배송기사 App QR(PRD).png';
import driverQR from '@/assets/img/WayLo 배송기사 App QR(QA).png';
import centerPRD from '@/assets/img/WayLo 센터운영 App QR(PRD).png';
import centerQR from '@/assets/img/WayLo 센터운영 App QR(QA).png';

// 패밀리 사이트 데이터 구조 정의
const FAMILY_SITES = [
	{
		category: 'SCM Community',
		links: [
			{ name: 'SCM혁신담당 Confluence', url: 'https://cjfw.atlassian.net/wiki/spaces/SCM2/overview' },
			{ name: 'SCM혁신담당 CoP', url: 'https://cjwcop.cj.net/CoP/CoM/home_frame.aspx?cpi=8610' },
		],
	},
	{
		category: '배송 연계 관리',
		links: [
			{ name: 'ROOUTY_경로/배차 최적화 Simulation', url: 'https://roouty.com/' },
			{ name: '퀵 배송 접수', url: 'https://cjfreshway.stnlogis.com/index.html' },
			{ name: 'CJL 택배', url: 'https://loisparcelp.cjlogistics.com/index.do' },
			{ name: '사방넷', url: 'https://www.sabangnet.co.kr/index.html' },
		],
	},
	{
		category: 'PLT 수불관리',
		links: [
			{ name: 'AJ PLT', url: 'http://edi.ajuprs.com/index.do' },
			{ name: 'KPP PLT', url: 'https://wpps.logisall.net/login' },
		],
	},
	{
		category: '타사 수급 정보',
		links: [
			{ name: 'Smart SCM_CJCJ 재고관리', url: 'https://scm.cj.net:7012/common/syscommon/authority/loginPage.fo' },
			{ name: 'Single Visibility_CJL 재고관리', url: 'https://sv.cjlogistics.com/' },
		],
	},
	{
		category: '관공서',
		links: [
			{ name: '기상청', url: 'https://www.weather.go.kr/' },
			{ name: '행정안전부', url: 'https://www.mois.go.kr/frt/a01/frtMain.do' },
			{ name: '유니패스', url: 'https://unipass.customs.go.kr/csp/index.do' },
		],
	},
	{
		category: 'Automation Monitoring Hub',
		links: [{ name: 'Sorter Operation Monitoring_이천/양산센터', url: 'http://10.67.0.44:25000/' }],
	},
];

const Footer: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const initialized = useAppSelector(state => state.menu.initialized); // fetchInitApi 초기값 설정 완료 여부
	const userInfo: any = useAppSelector(state => state.user.userInfo); // 사용자 정보 가져오기
	const [loginInfo, setLoginInfo] = useState(null);

	// QR 관련 state
	const { VITE_ENVIRONMENT } = import.meta.env; // APP 다운로드 URL
	const [qrOpen, setQrOpen] = useState(false);
	const [activeQr, setActiveQr] = useState<number | null>(null);
	const qrRef = useRef<HTMLDivElement>(null);
	const [barcodeValue, setBarcodeValue] = useState('');

	const getQrClassName = (index: number) => {
		if (activeQr === null) return '';
		if (activeQr === index) return 'active';
		return 'blur';
	};

	/**
	 * 로그인 이력 조회
	 */
	const getLoginHistory = () => {
		apiGetLoginHistory().then(res => {
			if (res.statusCode === 0) {
				const resultData = res?.data;
				const filterData = resultData?.filter((data: any) => data.loginSuccYn === 'success');
				if (commUtil.isNotEmpty(filterData) && filterData.length > 1) {
					setLoginInfo(filterData[1]);
				}
			}
		});
	};

	/**
	 * 바코드 값 생성
	 */
	const makeBarcodeValue = () => {
		const userId = userInfo.userId;
		if (commUtil.isNotEmpty(userId)) {
			const now = new Date();
			const hhmmss =
				`${String(now.getHours()).padStart(2, '0')}` +
				`${String(now.getMinutes()).padStart(2, '0')}` +
				`${String(now.getSeconds()).padStart(2, '0')}`;

			// 문자열 길이 맞추기
			const fitLength = (str: string, length: number) => {
				return str.repeat(Math.ceil(length / str.length)).slice(0, length);
			};

			// 난수 생성
			// const makeRandom = (length: number) => {
			// 	return Math.floor(Math.random() * Math.pow(10, length))
			// 		.toString()
			// 		.padStart(length, '0');
			// };

			const len = Math.max(userId.length, 6);

			const datePart = fitLength(hhmmss, len);
			//const randomPart = makeRandom(len);

			// 3개 값 한 글자씩 섞기
			const mixThree = (id: string, date: string, rand?: string) => {
				let mixed = '';

				for (let i = 0; i < date.length; i++) {
					if (commUtil.isNotEmpty(id[i])) {
						mixed += id[i];
					}
					mixed += date[i];
					if (commUtil.isNotEmpty(rand)) {
						mixed += rand[i];
					}
				}

				return mixed;
			};

			setBarcodeValue(mixThree(userId, datePart));
		}
	};

	useEffect(() => {
		getLoginHistory();
		makeBarcodeValue();
	}, [initialized]);

	// 외부 클릭 시 닫기 로직
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	useEffect(() => {
		const handleClickOutside = (e: any) => {
			if (qrRef.current && !qrRef.current.contains(e.target as Node) && !e.target.closest('.footer-qr')) {
				setQrOpen(false);
				setActiveQr(null);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<UiFooterGroup>
			{commUtil.isNotEmpty(loginInfo) && (
				<div className="log-info">
					<p>이전 로그인 일시 : {loginInfo.loginDt}</p>
					<p>접근 IP주소 : {loginInfo.loginIp}</p>
				</div>
			)}
			<p className="copyright">Copyright © 2026 CJ Freshway Corp. All rights reserved.</p>

			<div className="barcode" ref={qrRef}>
				{qrOpen && (
					<ul className="qr-cont">
						<li>
							<h2>물류센터 App</h2>
							<p className={getQrClassName(0)} onClick={() => setActiveQr(0)}>
								<img src={VITE_ENVIRONMENT === 'prod' ? centerPRD : centerQR} alt="물류센터 App QR" />
								{/* <QRCodeCanvas value={VITE_CENTER_APP_QR_URL} size={240} /> */}
							</p>
						</li>

						<li>
							<h2>배송기사 App</h2>
							<p className={getQrClassName(1)} onClick={() => setActiveQr(1)}>
								<img src={VITE_ENVIRONMENT === 'prod' ? driverPRD : driverQR} alt="배송기사 App QR" />
								{/* <QRCodeCanvas value={VITE_DRIVER_APP_QR_URL} size={240} /> */}
							</p>
						</li>
					</ul>
				)}
			</div>

			<div className="footer-qr">
				<a
					href="#"
					className="jumpmenu-toggler js-jumpmenu"
					onClick={(event: any) => {
						event.preventDefault();
						setQrOpen(!qrOpen);
						setActiveQr(null);
					}}
				>
					<span>Scan QR</span>
					<i className="icon">
						<QRCodeCanvas value={barcodeValue} size={18} />
					</i>
				</a>
			</div>

			<div className="familysites" ref={containerRef}>
				<div className={`combobox combobox-inline-wrap ${isOpen ? 'in' : ''}`}>
					<a
						href="#"
						className="jumpmenu-toggler js-jumpmenu"
						aria-expanded={isOpen}
						onClick={e => {
							e.preventDefault();
							setIsOpen(!isOpen);
						}}
					>
						<span>Quick Link</span>
						<i className="icon">
							<em>{isOpen ? '목록 닫기' : '목록 열기'}</em>
						</i>
					</a>

					<div className="combobox-scroll-wrap">
						<div className="combobox-scroll-inner">
							<ul className="reset jumpmenu kor-title">
								{FAMILY_SITES.map((group, idx) => (
									<li className="d1" key={idx}>
										<strong className="d1-name">{group.category}</strong>
										<ul className="reset d2">
											{group.links.map((link, lIdx) => (
												<li className="d2" key={lIdx}>
													<a href={link.url} className="d2" target="_blank" rel="noopener noreferrer" title="새창열기">
														<span>{link.name}</span>
													</a>
												</li>
											))}
										</ul>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</UiFooterGroup>
	);
};

export default Footer;
