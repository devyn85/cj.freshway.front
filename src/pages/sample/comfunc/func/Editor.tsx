/*
 ############################################################################
 # FiledataField	: Editor.tsx
 # Description		: 에디터
 # Author			: Canal Frame
 # Since			: 23.08.21
 ############################################################################
*/
// component
import MenuTitle from '@/components/common/custom/MenuTitle';
import QuillEditor from '@/components/common/custom/QuillEditor';
import { Button } from 'antd';
import purify from 'dompurify';

const Editor = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// const { menu } = useLocation().state;

	// editor data 관리를 위한 state
	const [data, setData] = useState(
		'<blockquote><strong class="ql-font-batang ql-size-12" style="color: rgb(153, 51, 255); background-color: rgb(235, 214, 255);"><em>Quill Editor Component in the Canalframe.</em></strong></blockquote>',
	);
	// editor 객체 관리를 위한 state
	const [editor, setEditor] = useState<any>(null);
	// editor 편집 가능 여부 관리를 위한 state
	const [readOnly, setReadOnly] = useState(false);

	const [btnText, setBtnText] = useState('저장');

	const onSwitch = () => {
		setReadOnly(readOnly => !readOnly);
		setBtnText(btnText => (btnText === '저장' ? '편집' : '저장'));

		// 현재 editor 내용 가져오기

		// TO-DO API 포함한 저장 로직 구현
	};

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle slotLocation="left">
				<Button onClick={onSwitch} type={readOnly ? 'default' : 'primary'}>
					{btnText}
				</Button>
			</MenuTitle>

			{/* editor */}
			<QuillEditor height={'270px'} onChange={setData} data={data} editor={setEditor}></QuillEditor>
			<br />
			{/* editor readOnly 버전 */}
			<div>
				<h3>에디터 ReadOnly</h3>
				<QuillEditor height={'270px'} theme={'bubble'} onChange={setData} data={data} readOnly></QuillEditor>
			</div>
			<br />
			{/* 상세보기 */}
			<div>
				<h3>에디터 상세</h3>
				<br />
				<div dangerouslySetInnerHTML={{ __html: purify.sanitize(data) }}></div>
			</div>
		</>
	);
};

export default Editor;
