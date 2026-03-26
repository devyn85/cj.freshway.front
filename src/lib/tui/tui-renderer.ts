import commUtil from '@/util/commUtil';
import fileUtil from '@/util/fileUtils';
import { showAlert } from '@/util/MessageUtil';

type RendererProps = {
	grid: any;
	rowKey: number;
	value: any;
	disabled?: boolean;
	columnInfo: any;
	editable: boolean | undefined | null;
};

class CheckboxRenderer {
	private el: HTMLInputElement;

	constructor(props: RendererProps) {
		const { grid, rowKey } = props;
		const columnName = props.columnInfo?.renderer?.options?.columnName ?? props?.columnInfo?.name;
		const editable = props.columnInfo?.renderer?.options?.editable ?? true;
		const isAdded = (grid.getRow(rowKey).rowStatus ?? '') === 'I';
		const hiddenInput = document.createElement('input');
		hiddenInput.type = 'checkbox';
		hiddenInput.id = columnName + String(rowKey);
		if (!editable) {
			hiddenInput.disabled = !isAdded;
		} else {
			hiddenInput.disabled = false;
		}
		hiddenInput.className = 'grid-checkbox';

		hiddenInput.addEventListener('click', () => {
			if (editable || isAdded) {
				if (hiddenInput.checked) {
					grid.setValue(rowKey, columnName, '1');
					if (columnName === 'checkStatus') {
						grid.check(rowKey);
					}
				} else {
					grid.setValue(rowKey, columnName, '0');
					if (columnName === 'checkStatus') {
						grid.uncheck(rowKey);
					}
				}
			}
		});

		this.el = hiddenInput;
		this.render(props);
	}

	getElement() {
		return this.el;
	}

	render(props: RendererProps) {
		const { value } = props;
		const checked = Boolean(value == true);

		this.el.checked = checked;
	}
}

class IconRenderer {
	private el: HTMLImageElement;

	constructor(props: RendererProps) {
		this.el = document.createElement('img');
		this.el.src = props.columnInfo.renderer.options.src;
	}

	getElement() {
		return this.el;
	}
}

class PlaceholderTextEditor {
	private el: HTMLInputElement;

	constructor(props: RendererProps) {
		const el = document.createElement('input');

		el.type = 'text';
		el.className = 'tui-grid-content-text';
		el.style.width = '100%';
		el.style.border = 'none';
		el.style.textAlign = 'center';
		el.placeholder = props.columnInfo.renderer.options.placeholder;
		el.value = String(commUtil.isNotEmpty(props.value) ? props.value : '');
		this.el = el;

		this.render(props);
	}

	getElement() {
		return this.el;
	}

	getValue() {
		return this.el.value;
	}
	render(props: RendererProps) {
		const { grid, rowKey } = props;
		const columnName = props.columnInfo.name;

		this.el.value = String(String(commUtil.isNotEmpty(props.value) ? props.value : ''));
		grid.setValue(rowKey, columnName, String(commUtil.isNotEmpty(props.value) ? props.value : ''));
	}
}

// Custom Renderer - Button
// {
// 	header: 'btn',
// 	name: 'btn',
// 	align: 'center',
// 	renderer: {
// 		type: ButtonRenderer,
// 		options: {
// 			content: 'click',
// 			style: {
// 				backgroundColor: '#000',
// 				color: '#fff',
// 				borderRadius: '4px',
// 				fontWeight: 'bold',
// 			},
// 			handlerFn: () => {
// 				alert('button click');
// 			},
// 		},
// 	},
// 	width: '60',
// },
class ButtonRenderer {
	private el: HTMLButtonElement;
	constructor(props: RendererProps) {
		const { handlerFn, content } = props.columnInfo.renderer.options;
		const el = document.createElement('button');
		el.innerText = content ?? 'button';

		if (commUtil.isNotEmpty(props.columnInfo.renderer.options.style)) {
			const style = props.columnInfo.renderer.options.style;
			Object.entries(style).map(([key, value]: Array<any>) => {
				el.style[key] = value;
			});
		}
		if (commUtil.isNotEmpty(props.columnInfo.renderer.options.className)) {
			el.classList?.add(props.columnInfo.renderer.options.className);
		}
		if (commUtil.isNotEmpty(handlerFn)) {
			el.addEventListener('click', handlerFn);
		}
		this.el = el;
	}
	getElement() {
		return this.el;
	}
}

// Custom Renderer - Image
class ImageRenderer {
	private el: HTMLImageElement;
	constructor(props: RendererProps) {
		// 썸네일이 존재할 경우에만 image를 render
		this.render(props);
	}
	getElement() {
		return this.el;
	}

	render(props: RendererProps) {
		const el = document.createElement('img');
		el.setAttribute('width', String(props.columnInfo.renderer.options?.width ?? 110) + 'px');
		el.setAttribute('height', String(props.columnInfo.renderer.options?.height ?? 110) + 'px');
		el.alt = '이미지 없음';
		el.src = String(props.value) ?? null;

		el.addEventListener('click', () => {
			if (props.value) {
				// 클릭 시 미리보기 팝업 호출
				this.openImgPreview(props.value);
			}
		});

		this.el = el;
	}

	// 이미지 미리보기 팝업
	openImgPreview(imgUrl: string) {
		// 새 창 크기 설정
		const width = 800;
		const height = 600;
		const left = window.innerWidth / 2 - width / 2;
		const top = window.innerHeight / 2 - height / 2;

		// 새 창 옵션 설정
		const option = `
			toolbar=no,
			location=no,
			directories=no,
			status=no,
			menubar=no,
			scrollbars=no,
			resizable=yes,
			width=${width},
			height=${height},
			top=${top},
			left=${left}
		`;

		// 새 창 열기
		const imagePreviewPopup = window.open('', 'Image Preview', option);
		imagePreviewPopup.document.write(`<img src="${imgUrl}" />`);
	}
}

// Custom Renderer - Button
// 공통화 진행 X, IMAGE upload용 button
class ImageButtonRenderer {
	private el: HTMLButtonElement;
	constructor(props: RendererProps) {
		const { grid, rowKey } = props;
		const { targetColumn } = props.columnInfo.renderer.options;
		const imgValue = grid.getValue(rowKey, targetColumn);
		const el = document.createElement('button');
		el.textContent = !imgValue ? '이미지 추가' : '이미지 삭제'; //props.columnInfo.renderer.options.buttonText;
		el.addEventListener('click', function () {
			if (!imgValue) {
				// image uploader 호출
				const input = document.createElement('input');
				input.type = 'file';
				input.accept = 'image/*'; // 이미지 파일만 선택 가능하도록 설정

				input.addEventListener('change', function () {
					const file = input.files[0];
					const reader = new FileReader();

					reader.readAsDataURL(file);

					reader.addEventListener('load', () => {
						const imageUrl = reader.result;
						grid.setValue(rowKey, targetColumn, imageUrl);

						grid.setWidth('auto');
						grid.setHeight('auto');
						setTimeout(() => {
							grid.refreshLayout();
						}, 0);
						grid.resetData(grid.getData());
					});
				});
				input.click();
			} else {
				grid.setValue(rowKey, targetColumn, null);
				grid.setWidth('auto');
				grid.setHeight('auto');
				setTimeout(() => {
					grid.refreshLayout();
				}, 0);
				grid.resetData(grid.getData());
			}
		});
		this.el = el;
	}
	getElement() {
		return this.el;
	}
}

class ImageNButtonRenderer {
	private el: HTMLElement;
	private imgEl: HTMLImageElement;

	constructor(props: RendererProps) {
		const { grid, rowKey } = props;
		const columnName = props.columnInfo.name;
		const el = document.createElement('div');
		// ==========================================================================
		// Image 영역
		// ==========================================================================
		if (props.value) {
			this.render(props);
		}
		// ==========================================================================
		// Button 영역
		// ==========================================================================
		/**
		 * button wrapper
		 */
		const btnSpanEl = document.createElement('span');
		/**
		 * add button
		 */
		const addBtnEl = document.createElement('button');
		addBtnEl.classList.add('btn-tui-primary');
		addBtnEl.textContent = '추가';
		addBtnEl.addEventListener('click', () => {
			const input = document.createElement('input');
			input.type = 'file';
			input.accept = 'image/*'; // 이미지 파일만 선택 가능하도록 설정

			input.addEventListener('change', function () {
				const file = input.files[0];
				const reader = new FileReader();

				reader.readAsDataURL(file);

				reader.addEventListener('load', () => {
					// validatiaon
					if (!fileUtil.isImage(file) && !fileUtil.isVideo(file)) {
						showAlert('', '이미지/비디오 파일만 업로드 가능합니다.');
						return false;
					}

					// server 저장
					fileUtil.upload(file).then(res => {
						const imageUrl = res;
						grid.setValue(rowKey, columnName, imageUrl);
						grid.setWidth('auto');
						grid.setHeight('auto');
						setTimeout(() => {
							grid.refreshLayout();
						}, 0);
						// grid.resetData(grid.getData());
					});
				});
			});
			input.click();
		});

		/**
		 * remove button
		 */
		const removeBtnEl = document.createElement('button');
		removeBtnEl.classList.add('btn-tui-second');
		removeBtnEl.textContent = '삭제';
		removeBtnEl.addEventListener('click', () => {
			grid.setValue(rowKey, columnName, null);
			grid.setWidth('auto');
			grid.setHeight('auto');
			setTimeout(() => {
				grid.refreshLayout();
			}, 0);
			grid.resetData(grid.getData());
		});

		btnSpanEl.appendChild(addBtnEl);
		btnSpanEl.appendChild(removeBtnEl);
		if (props.value) {
			el.appendChild(this.imgEl);
		}
		el.appendChild(btnSpanEl);

		el.style.display = 'flex';
		el.style.flexDirection = 'column';
		el.style.alignItems = 'center';

		this.el = el;
	}
	getElement() {
		return this.el;
	}

	render(props: RendererProps) {
		const imgEl = document.createElement('img');
		imgEl.setAttribute('width', String(props.columnInfo.renderer.options?.width ?? 110) + 'px');
		imgEl.setAttribute('height', String(props.columnInfo.renderer.options?.height ?? 110) + 'px');
		imgEl.alt = '이미지 없음';
		imgEl.src = String(props.value) ?? null;
		imgEl.addEventListener('click', () => {
			if (props.value) {
				// 클릭 시 미리보기 팝업 호출
				this.openImgPreview(props.value);
			}
		});
		imgEl.style.marginBottom = '5px';
		this.imgEl = imgEl;
		//파일 width, height 규격 체크
		// console.log('>>>>>width:', imgEl.naturalWidth);
		// console.log('>>>>>height:', imgEl.naturalHeight);
	}

	// 이미지 미리보기 팝업
	openImgPreview(imgUrl: string) {
		// 새 창 크기 설정
		const width = 800;
		const height = 600;
		const left = window.innerWidth / 2 - width / 2;
		const top = window.innerHeight / 2 - height / 2;

		// 새 창 옵션 설정
		const option = `
			toolbar=no,
			location=no,
			directories=no,
			status=no,
			menubar=no,
			scrollbars=no,
			resizable=yes,
			width=${width},
			height=${height},
			top=${top},
			left=${left}
		`;

		// 새 창 열기
		const imagePreviewPopup = window.open('', 'Image Preview', option);
		imagePreviewPopup.document.write(`<img src="${imgUrl}" />`);
	}
}

/**
 * textarea renderer
 * 사용 예시
 * {
			header: 'TextArea',
			name: 'textarea',
			whiteSpace: 'pre-line',
			editor: {
				type: TextareaEditor,
			},
		},
 */
class TextareaEditor {
	private el: HTMLTextAreaElement;

	constructor(props: RendererProps) {
		const el = document.createElement('textarea');
		el.classList.add('tui-textarea');
		el.value = String(props.value || '');

		this.el = el;
	}

	getElement() {
		return this.el;
	}

	getValue() {
		return this.el.value;
	}
}

/**
 * textarea renderer
 * 사용 예시
 * header: 'number(InputNumberEditor)',
	 name: 'number',
	 editor: {
		type: InputNumberEditor,
		options: {
			min: 0,
			max: 1000,
			step: 10,
			},
		},
	  align: 'center',
 */
class InputNumberEditor {
	private el: HTMLInputElement;

	constructor(props: RendererProps) {
		const { min, max, step } = props.columnInfo.editor.options;
		const el = document.createElement('input');
		el.type = 'number';
		el.step = step ?? 1;
		el.min = min ?? 0;
		el.max = max ?? 1000000000;

		el.className = 'tui-grid-content-text';
		el.style.width = '100%';
		el.style.height = '100%';
		el.style.border = 'none';
		el.style.textAlign = 'center';

		el.value = String(props.value);

		this.el = el;
	}

	getElement() {
		return this.el;
	}

	getValue() {
		return this.el.value;
	}
}

class CustomColumnHeader {
	private el: HTMLElement;

	constructor(props: RendererProps) {
		const columnInfo = props.columnInfo;
		const el = document.createElement('div');
		el.className = 'tui-custom';
		// el.style.whiteSpace = 'normal';
		el.innerHTML = `<div>${columnInfo?.header}</div>`;
		this.el = el;
	}

	getElement() {
		return this.el;
	}

	render(props: RendererProps) {
		this.el.innerHTML = `<div>${props.columnInfo?.header}</div>`;
	}
}

// class SwitchRenderer {
// 	// constructor(props) {
// 	// 	this.el = document.createElement('a-switch');
// 	// }
// }

export {
	ButtonRenderer,
	CheckboxRenderer,
	CustomColumnHeader,
	IconRenderer,
	ImageButtonRenderer,
	ImageNButtonRenderer,
	ImageRenderer,
	InputNumberEditor,
	PlaceholderTextEditor,
	TextareaEditor,
};
