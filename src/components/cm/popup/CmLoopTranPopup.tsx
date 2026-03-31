/*
 ############################################################################
 # FiledataField	: CmLoopTranPopup.tsx
 # Description		: 특정 데이터셋의 변경된 row들을 대상으로, loop를 돌면서 transaction을 수행하는 팝업
 # Author			: jangjaehyun
 # Since			: 25.07.01
 ############################################################################
*/
// lib
import axios from '@/api/Axios';
import { Button, Col, Form, Progress, Row, Statistic } from 'antd';

// Store
import { fetchAccessTokenRefresh } from '@/store/core/userStore';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import Title from '@/assets/styled/Title/Title';
import { InputTextArea } from '@/components/common/custom/form';
interface PropsType {
	titleName?: string; // 팝업 타이틀
	popupParams: any; // 팝업에 전달할 파라미터
	close: any; // 팝업 닫기 함수
	onResultChange?: (success: number, fail: number, total: number) => void; // 성공/실패 건수 업데이트 함수
}

const CmLoopTranPopup = forwardRef((props: PropsType, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation(); // 다국어 처리
	const [form] = Form.useForm(); // Antd Form
	const [successCnt, setSuccessCnt] = useState(0); // 성공 카운트
	const [failCnt, setFailCnt] = useState(0); // 실패 카운트
	const [totalCnt, setTotalCnt] = useState(0); // 전체 카운트
	const [progress, setProgress] = useState(0); // 전체 카운트
	const [status, setStatus] = useState<'normal' | 'exception' | 'active' | 'success'>('normal'); // 진행상태
	const saveDataListRef = useRef<any>([]); // 저장 목록
	let progressCnt = 0; // 진행상태 카운트
	const [disabledCloseBtn, setDisabledCloseBtn] = useState(true); // 닫기 버튼 비활성화 상태값

	const { titleName, popupParams } = props;

	// ★ 핵심: 'resultMessage' 필드 값을 실시간으로 구독(Watch)합니다.
	const resultMessage1 = Form.useWatch('resultMessage', form);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 연쇄 트랜젝션 호출 함수
	 * @param params
	 * @param index
	 * @param total
	 */
	const loopTransaction = (params: any, index: number, total: number) => {
		let final = false;

		if (index == 0) {
			setDisabledCloseBtn(true);
			// const btn = document.getElementById('btn_close');
			// if (btn) {
			// 	btn.style.display = 'none';
			// }
		}

		if (total === index + 1) {
			final = true;
		}
		const dataKey = params.dataKey || 'saveList';
		if (index < total) {
			const currentParams = {
				...params,
				[dataKey]: [saveDataListRef.current[index]],
				noErrorMsg: true,
			};

			const nextParams = {
				...params,
				[dataKey]: final ? [''] : [saveDataListRef.current[index + 1]],
			};

			axios.post(params.apiUrl, currentParams).then(res => {
				if (res.data.statusCode > -1) {
					setSuccessCnt(prev => prev + 1);

					// 진행률 업데이트 (성공시에만)
					progressCnt++;
					setProgress(Math.floor((progressCnt / total) * 100));
				} else {
					setFailCnt(prev => prev + 1);
				}

				// 각 순번별 처리결과 표시
				let resultMessage = '';
				if (commUtil.isEmpty(form.getFieldValue('resultMessage'))) {
					resultMessage = `${index + 1}:${res.data.statusMessage}`;
				} else {
					resultMessage = form.getFieldValue('resultMessage') + `\n${index + 1}:${res.data.statusMessage}`;
				}
				form.setFieldsValue({ resultMessage: resultMessage });

				// 진행률 업데이트
				// setProgress(Math.floor(((index + 1) / total) * 100));

				if (!final) {
					loopTransaction(nextParams, index + 1, total);
				} else {
					setDisabledCloseBtn(false);
					// const btn = document.getElementById('btn_close');
					// if (btn) {
					// 	btn.style.display = 'block';
					// }

					// 진행 결과에 따라 프로그레스바 색상 변경
					if (progressCnt === total) {
						setStatus('success');
					} else {
						setStatus('exception');
					}
				}
			});
		}
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */

	useEffect(() => {
		setTotalCnt(popupParams.saveDataList.length);

		// saveDataList 매번 복사되지 않게 useRef에 정적 DATA 세팅 후 삭제
		// saveDataList DATA가 많을 경우 "...params" 사용시 느려지는 이슈 해결
		saveDataListRef.current = [...popupParams.saveDataList];
		delete popupParams.saveDataList;

		// 강제로 access 토큰 재발행 후 아래 로직 처리
		fetchAccessTokenRefresh().then(() => {
			loopTransaction(popupParams, 0, saveDataListRef.current.length);
		});
	}, []);

	useEffect(() => {
		// 성공/실패 카운트 변경 시 부모 콜백 호출
		if (props.onResultChange) {
			props.onResultChange(successCnt, failCnt, totalCnt);
		}
	}, [successCnt, failCnt]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<Title>
				<h2>{titleName || '진행 상태'}</h2>
			</Title>
			<Form form={form}>
				<Row gutter={18}>
					<Col span={24}>
						<Progress
							percent={progress}
							percentPosition={{ align: 'end', type: 'inner' }}
							strokeWidth={30}
							status={status}
							strokeColor={'#bbbbbb'}
						/>
					</Col>
				</Row>
				<Row gutter={18} className="pd10">
					<Col span={8} className="ta-l">
						<Statistic title="시작" value={totalCnt} />
					</Col>
					<Col span={8} className="ta-c">
						<Statistic title="실패" value={failCnt} />
					</Col>
					<Col span={8} className="ta-r">
						<Statistic title="성공" value={successCnt} />
					</Col>
				</Row>
				<Row gutter={18}>
					<Col span={24}>
						<div
							style={{
								position: 'relative',
								width: '100%',
								height: '200px', // 높이 고정
								marginBottom: '-30px',
								padding: '10px',
								overflowY: 'auto', // 스크롤 생성
								backgroundColor: '#f5f5f5', // 읽기 전용 느낌의 배경색
								border: '1px solid #d9d9d9', // 테두리 (Input과 비슷하게)
								whiteSpace: 'pre-wrap', // ★ 텍스트 줄바꿈 유지
								wordBreak: 'break-all', // 긴 단어도 줄바꿈
								zIndex: 9,
							}}
						>
							{/* 여기에 결과 메세지 변수를 넣으세요 */}
							{resultMessage1}
						</div>
						<InputTextArea
							name="resultMessage"
							placeholder="입력"
							//autoSize={{ minRows: 5, maxRows: 10 }}
							style={{
								display: 'none',
								width: '100%',
								overflowY: 'auto', // 항상 스크롤바 트랙을 표시하고 싶다면 scroll, 자동이면 auto
								height: '0px',
								// (선택) 사용자가 임의로 크기 조절 못하게
								resize: 'none',
								// ★ 핵심 해결책: 마우스 동작 강제 허용
								pointerEvents: 'auto',

								// (옵션) 커서 모양이 금지 표시로 나오면 기본으로 변경
								cursor: 'default',
							}}
							readOnly
						/>
					</Col>
				</Row>
			</Form>
			<ButtonWrap data-props="single">
				<Button id="btn_close" onClick={props.close} disabled={disabledCloseBtn}>
					닫기
				</Button>
			</ButtonWrap>
		</>
	);
});

export default CmLoopTranPopup;
