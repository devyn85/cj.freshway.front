/*
 ############################################################################
 # FiledataField	: QuillEditor.tsx
 # Description		: QuillEditor
 # Author			: Canal Frame
 # Since			: 22.11.02
 ############################################################################
*/
// lib
import React from 'react';
// ReactQuill
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter';
import QuillImageDropAndPaste from 'quill-image-drop-and-paste';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import 'src/lib/quill/quill.snow.css';

// utils
import useDidMountEffect from '@/hooks/useDidMountEffect';
import commUtil from '@/util/commUtil';
import fileUtil from '@/util/fileUtils';
import { showAlert } from '@/util/MessageUtil';

// 이미지 리사이징
Quill.register('modules/blotFormatter', BlotFormatter);
Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);
// Quill.register('modules/imageDrop', ImageDrop);

type Prop = {
	value: string;
	onChange?: any;
	height?: string;
	type?: string;
	useApi?: boolean;
	readOnly?: boolean;
	editor?: any; // editor 객체 반환 함수
	theme?: 'snow' | 'bubble';
};

const QuillEditor = (props: Prop) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { value, type = 'html', onChange, height, useApi = false, readOnly = false, theme = 'snow' } = props;

	const ref = useRef(null);

	const [isView, setIsView] = useState(false);

	const fileMaxSize = 10;

	const Font = Quill.import('formats/font');
	const Size = Quill.import('formats/size');
	Font.whitelist = ['dotum', 'gullim', 'batang', 'NanumGothic'];
	Size.whitelist = ['8', '9', '10', '11', '12', '14', '18', '24', '36'];
	Quill.register(Size, true);
	Quill.register(Font, true);

	const modules = React.useMemo(
		() => ({
			toolbar: {
				container: [
					[{ font: Font.whitelist }],
					[{ size: Size.whitelist }],
					[{ header: [1, 2, 3, 4, 5, 6, false] }, { align: [] }], // 글자 크기 영역
					['bold', 'italic', 'underline', 'strike'], // 굵기,취소선 등등
					['blockquote', 'code-block'], // 인용, 코드
					[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
					['link', 'image'], // 링크, 이미지
					[{ align: [] }, { color: [] }, { background: [] }], // dropdown with defaults from theme
					['clean'],
				],
				// custom 핸들러 설정 (API 사용시)
				handlers: {
					image: imageClickHandler, // 이미지 tool 사용에 대한 핸들러 설정
				},
			},
			// 이미지 리사이징
			blotFormatter: {},
			// 이미지 D&D (폴더에서)
			imageDropAndPaste: {
				handler: imageDropHandler,
			},
		}),
		[],
	);

	const formats = [
		'font',
		'size',
		'header',
		'bold',
		'italic',
		'underline',
		'strike',
		'blockquote',
		'list',
		'bullet',
		'indent',
		'link',
		'image',
		'video',
		'align',
		'color',
		'background',
	];

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 이미지 클릭 적용 (이미지 선택 이벤트)
	 */
	function imageClickHandler() {
		// 이미지
		const input = document.createElement('input');
		input.setAttribute('type', 'file');
		input.setAttribute('accept', 'image/*');
		input.click();

		input.onchange = async () => {
			const fileData = input.files ? input.files[0] : null;

			if (useApi) {
				applyImage('', fileData);
			} else {
				// image base64 변환
				await fileUtil.convertByBase64(fileData, (url: string) => {
					applyImage(url, fileData);
				});
			}
		};
	}

	/**
	 * 이미지 드래그앤드랍 이벤트
	 * @param {string} imageDataUrl 이미지 url
	 * @param {string} type 이미지 파일 type
	 * @param {File} file 이미지 파일 객체
	 */
	function imageDropHandler(imageDataUrl: string, type: string, file: any) {
		// file type 확인
		if (!type) type = 'image/png';
		// 파일 정보
		const fileData = file.toFile();
		applyImage(imageDataUrl, fileData);
	}

	/**
	 * 이미지 파일 적용
	 * @param {string} imageUrl 이미지 url
	 * @param {File} file 이미지 파일
	 * @returns {void}
	 */
	const applyImage = async (imageUrl: string | ArrayBuffer, file: File) => {
		if (!fileUtil.isImage(file) && !fileUtil.isVideo(file)) {
			showAlert('', '이미지/비디오 파일만 업로드 가능합니다.');
			return false;
		}

		if (commUtil.isEmpty(fileMaxSize) && fileUtil.fileSizeValid(file, fileMaxSize)) {
			showAlert('', `파일은 ${fileMaxSize}MB 이하로 업로드 가능합니다.`);
			return false;
		}
		// 파일 저장 API
		if (useApi) {
			await fileUtil.upload(file).then(res => {
				setQuillImageValue(res);
			});
		} else {
			setQuillImageValue(imageUrl);
		}
	};

	/**
	 * quill image 값 저장
	 * @param {string} imageUrl 이미지 url
	 */
	const setQuillImageValue = (imageUrl: string | ArrayBuffer) => {
		// URL 정보 Editor 적용 (base64 또는 url 정보)
		const quillObj = ref.current.getEditor();
		// 이미지 화면 이동
		const range = quillObj.getSelection();
		quillObj.editor.insertEmbed(range.index, 'image', imageUrl);
		// 데이터 셋팅
		onChange(quillObj.root.innerHTML);
	};

	/**
	 * 에디어 변경 감지
	 * @param {object} editor editor Element
	 * @param {*} source source
	 * @param {string} content content
	 */
	const editorOnChange = (editor: any, source: any, content: any) => {
		// 필요한 정보 사용
		// //console.log('1.editor getText', editor.getText());
		// //console.log('2.editor getHTML', editor.getHTML());
		// //console.log('3.editor getContents', editor.getContents());
		// //console.log('4.source', source);
		// //console.log('5.content', content);
		onChange(content);
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		if (type === 'text') {
			// text인경우 link, image, video 배열을 필터링으로 제거
			modules.toolbar.container = modules.toolbar.container.filter((item: any) => {
				// ['link', 'image', 'video'] 배열이 아닌 경우만 유지
				return !(Array.isArray(item) && (item.includes('link') || item.includes('image') || item.includes('video')));
			});
		}
		// ReactQuill 실행
		setIsView(true);
	}, []);

	useEffect(() => {
		if (typeof value !== 'undefined') {
			onChange(value);
		}
	}, [value]);

	useDidMountEffect(() => {
		if (props.editor) {
			// 에디터 객체 반환
			props.editor(ref.current.getEditor());
		}
	}, [ref.current]);

	return (
		<div className="text-editor">
			{isView && (
				<ReactQuill
					ref={ref}
					style={{ height: height, overflow: 'hidden' }}
					theme={theme}
					modules={modules}
					formats={formats}
					value={value}
					onChange={(content, delta, source, editor) => editorOnChange(editor, source, content)}
					onBlur={(range, source, quill) => {
						onChange(quill.getHTML());
					}}
					readOnly={readOnly}
				/>
			)}
		</div>
	);
};

export default QuillEditor;
