import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import { fetchMyMenuList } from '@/store/core/menuStore';
import { DeleteOutlined, EditOutlined, FolderAddOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Space, Transfer, Tree } from 'antd';
import { useState } from 'react';

// API
import { apiGetMyFavoriteMenuList, apiGetMyMenuPopupList, apiSaveMyMenuList } from '@/api/cm/apiCmMenu';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
interface PropsType {
	close?: any;
}
const CmMyMenuPopup = (props: PropsType) => {
	const [treeData, setTreeData] = useState<TreeNode[]>([]);
	const [rightTree, setRightTree] = useState<TreeNode[]>([]);
	const { t } = useTranslation();
	const { close } = props;

	interface TreeNode {
		title: string;
		key: string;
		children?: TreeNode[];
		menuType?: string;
		uprFolderId?: string;
		progCd?: string;
	}

	// 트리 평탄화 (Transfer용 데이터 생성)
	const flattenTree = (list: TreeNode[] = []): TreeNode[] =>
		list.reduce<TreeNode[]>((acc, item) => {
			acc.push(item);
			if (item.children) acc = acc.concat(flattenTree(item.children));
			return acc;
		}, []);

	interface TreeTransferProps {
		dataSource: TreeNode[];
	}

	// TreeTransfer 컴포넌트
	const TreeTransfer = ({ dataSource }: TreeTransferProps) => {
		const [targetKeys, setTargetKeys] = useState<string[]>([]);
		const [selectedFolderKey, setSelectedFolderKey] = useState<string>('root');

		// 왼쪽 리스트 → 오른쪽 트리로 이동 시
		const handleChange = (nextKeys: React.Key[], direction: 'left' | 'right', moveKeys: React.Key[]) => {
			// 중복 key 체크 함수 (트리 전체에서 key 존재 여부)
			/**
			 *
			 * @param nodes
			 * @param key
			 */
			function treeHasKey(nodes: TreeNode[], key: string): boolean {
				for (const node of nodes) {
					if (node.key === key) return true;
					if (node.children && treeHasKey(node.children, key)) return true;
				}
				return false;
			}
			// Convert all keys to string for internal logic
			const nextKeysStr = nextKeys.map(String);

			// moveKeys: 실제로 체크된(선택된) 노드의 key만 들어옴 (상위만 체크 시 하위는 포함X)
			// → 상위 노드가 체크되면 하위까지 모두 포함되도록 flatten
			// progNo가 10자리(leaf)인 노드만 이동
			/**
			 *
			 * @param keys
			 * @param nodes
			 */
			function collectLeafKeys(keys: string[], nodes: TreeNode[]): string[] {
				const leafSet = new Set<string>();
				/**
				 *
				 * @param nodeList
				 */
				function dfs(nodeList: TreeNode[]) {
					for (const node of nodeList) {
						if (keys.includes(node.key)) {
							collectLeafRecursively(node);
						} else if (node.children) {
							dfs(node.children);
						}
					}
				}
				/**
				 *
				 * @param node
				 */
				function collectLeafRecursively(node: TreeNode) {
					// progNo가 10자리(leaf)만 추가
					if (node.key && node.key.length === 10) {
						leafSet.add(node.key);
					}
					if (node.children) {
						node.children.forEach(collectLeafRecursively);
					}
				}
				dfs(nodes);
				return Array.from(leafSet);
			}
			const moveKeysStr = collectLeafKeys(moveKeys.map(String), dataSource);
			if (direction === 'right') {
				const newTree = structuredClone(rightTree);
				let added = false;

				/**
				 *
				 * @param tree
				 * @param childKey
				 * 현재 레벨의 상위폴더(부모) key 반환
				 */
				function findParentFolderKey(tree: TreeNode[], childKey: string): string | undefined {
					let result: string | undefined;

					/**
					 *
					 * @param nodes
					 * @param parentKey
					 */
					function dfs(nodes: TreeNode[], parentKey?: string) {
						for (const node of nodes) {
							if (node.key === childKey) {
								if (parentKey) result = parentKey;
								return;
							}
							if (node.children) dfs(node.children, node.key);
						}
					}
					dfs(tree);
					return result;
				}

				/**
				 *
				 * @param sourceNode
				 * @param key
				 * @param parentKey
				 */
				function createMenuNode(sourceNode: TreeNode, key: string, parentKey?: string) {
					if (parentKey) {
						return {
							title: sourceNode.title,
							key: `${key}_${parentKey}`,
							menuType: 'M',
							uprFolderId: parentKey,
							progCd: sourceNode.progCd,
						};
					} else {
						return {
							title: sourceNode.title,
							key: `${key}`,
							menuType: 'M',
							progCd: sourceNode.progCd,
						};
					}
				}

				const dfs = (nodes: TreeNode[], parent: TreeNode[] | null = null) => {
					for (const node of nodes) {
						if (node.key === selectedFolderKey) {
							if (node.menuType === 'F') {
								// 폴더일 때만 하위에 추가
								moveKeysStr.forEach(key => {
									const sourceNode = findNodeByKey(dataSource, key);
									if (sourceNode) {
										if (!node.children) node.children = [];
										const newNode = createMenuNode(sourceNode, key, selectedFolderKey);
										if (!treeHasKey(newTree, newNode.key)) {
											node.children.push(newNode);
										}
									}
								});
								added = true;
							} else if (parent) {
								// 메뉴일 때는 같은 레벨(부모의 children)에 추가
								// 상위 폴더 key를 찾아서 사용
								const parentFolderKey = findParentFolderKey(rightTree, selectedFolderKey);
								moveKeysStr.forEach(key => {
									const sourceNode = findNodeByKey(dataSource, key);
									if (sourceNode) {
										const newNode = createMenuNode(sourceNode, key, parentFolderKey);
										if (!treeHasKey(newTree, newNode.key)) {
											parent.push(newNode);
										}
									}
								});
								added = true;
							}
							return;
						}
						if (node.children) dfs(node.children, node.children);
					}
				};
				dfs(newTree);
				// 만약 parent가 없어서 추가가 안된 경우(루트 메뉴), 루트에 추가
				if (!added) {
					moveKeysStr.forEach(key => {
						const sourceNode = findNodeByKey(dataSource, key);
						if (sourceNode) {
							const newNode = createMenuNode(sourceNode, key);
							if (!treeHasKey(newTree, newNode.key)) {
								newTree.push(newNode);
							}
						}
					});
				}
				setRightTree(newTree);
				// 이동 후 체크 해제 및 화살표 활성화
				setTargetKeys([]);
			} else {
				setTargetKeys(nextKeysStr);
			}
		};

		// 소스 트리에서 특정 노드 찾기
		const findNodeByKey = (nodes: TreeNode[], key: string): TreeNode | null => {
			for (const node of nodes) {
				if (node.key === key) return node;
				if (node.children) {
					const found = findNodeByKey(node.children, key);
					if (found) return found;
				}
			}
			return null;
		};

		return (
			<Transfer
				dataSource={flattenTree(dataSource)}
				targetKeys={targetKeys}
				showSelectAll={false}
				render={item => item.title}
				onChange={handleChange}
				oneWay // LEFT -> RIGHT 화살표만 사용함
			>
				{({ direction, onItemSelect, selectedKeys }) => {
					const checkedKeys = [...selectedKeys, ...targetKeys].map(String);

					if (direction === 'left') {
						return (
							<div style={{ padding: 8 }}>
								<Tree
									style={{ height: 360, overflow: 'auto' }}
									checkable
									// defaultExpandAll
									checkedKeys={checkedKeys}
									onCheck={(keys, { node: { key } }) => onItemSelect(String(key), !checkedKeys.includes(String(key)))}
									onSelect={(keys, { node: { key } }) => onItemSelect(String(key), !checkedKeys.includes(String(key)))}
									treeData={dataSource}
								/>
							</div>
						);
					}

					// 오른쪽 (편집 가능 트리)
					return (
						<EditableTree
							// style={{ height: 360, overflow: 'auto' }}
							tree={rightTree}
							setTree={setRightTree}
							selectedFolderKey={selectedFolderKey}
							setSelectedFolderKey={setSelectedFolderKey}
						/>
					);
				}}
			</Transfer>
		);
	};

	interface EditableTreeProps {
		tree: TreeNode[];
		setTree: React.Dispatch<React.SetStateAction<TreeNode[]>>;
		selectedFolderKey: string;
		setSelectedFolderKey: React.Dispatch<React.SetStateAction<string>>;
	}

	// EditableTree 컴포넌트 (Right Tree, TreeTransfer 컴포넌트에서 사용)
	const EditableTree = ({ tree, setTree, selectedFolderKey, setSelectedFolderKey }: EditableTreeProps) => {
		const [editingKey, setEditingKey] = useState<string | null>(null);
		const [editingValue, setEditingValue] = useState<string>('');

		// 🔹 하위 폴더 추가
		const addChild = (key: string) => {
			const newTree = structuredClone(tree);

			/**
			 *
			 * @param nodes
			 * @param parentKey
			 */
			function dfs(nodes: TreeNode[], parentKey?: string): boolean {
				for (const node of nodes) {
					if (node.key === key) {
						node.children = node.children || [];
						// 새 폴더의 key는 고유하게 생성
						node.children.push({
							title: '새 폴더',
							key: `new-${Date.now()}`,
							children: [],
							menuType: 'F',
							uprFolderId: node.key,
							progCd: node.progCd,
						});
						return true;
					}
					if (node.children && dfs(node.children, node.key)) return true;
				}
				return false;
			}
			dfs(newTree);
			setTree(newTree);
		};

		// 🔹 삭제
		const deleteNode = (key: string) => {
			const removeNode = (nodes: TreeNode[]): TreeNode[] =>
				nodes
					.filter((node: TreeNode) => node.key !== key)
					.map((node: TreeNode) => ({
						...node,
						children: node.children ? removeNode(node.children) : [],
					}));
			setTree(removeNode(tree));
		};

		// 🔹 이름 수정
		const startEdit = (key: string, title: string) => {
			setEditingKey(key);
			setEditingValue(title);
		};

		const saveEdit = (key: string) => {
			const updateNode = (nodes: TreeNode[]): TreeNode[] =>
				nodes.map((node: TreeNode) => {
					if (node.key === key) return { ...node, title: editingValue };
					if (node.children) return { ...node, children: updateNode(node.children) };
					return node;
				});
			setTree(updateNode(tree));
			setEditingKey(null);
		};

		// 🔹 드래그 이동
		const onDrop = (info: any) => {
			const dragKey = info.dragNode.key;
			const dropKey = info.node.key;
			const dropPos = info.node.pos.split('-');
			const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

			// drop 대상 노드(menuType: 'F'만 허용)
			const dropNode =
				tree.find(node => node.key === dropKey) ||
				(() => {
					let found: TreeNode | undefined;
					const search = (nodes: TreeNode[]) => {
						for (const node of nodes) {
							if (node.key === dropKey) {
								found = node;
								break;
							}
							if (node.children) search(node.children);
						}
					};
					search(tree);
					return found;
				})();

			// menuType: 'M'인 노드에는 하위로 이동 불가
			if (dropNode && dropNode.menuType === 'M' && !info.dropToGap) {
				// 아무 동작도 하지 않음
				return;
			}

			const loop = (
				data: TreeNode[],
				key: string,
				callback: (item: TreeNode, index: number, arr: TreeNode[]) => void,
			) => {
				for (let i = 0; i < data.length; i++) {
					if (data[i].key === key) {
						return callback(data[i], i, data);
					}
					if (data[i].children) loop(data[i].children, key, callback);
				}
			};

			const data = structuredClone(tree);
			let dragObj: TreeNode | undefined;
			loop(data, dragKey, (item, index, arr) => {
				arr.splice(index, 1);
				dragObj = item;
			});

			if (!info.dropToGap) {
				loop(data, dropKey, item => {
					item.children = item.children || [];
					if (dragObj) item.children.push(dragObj);
				});
			} else {
				let parentArr: TreeNode[] | undefined;
				let index: number | undefined;
				loop(data, dropKey, (item, i, arr) => {
					parentArr = arr;
					index = i;
				});
				if (parentArr !== undefined && index !== undefined && dragObj) {
					parentArr.splice(dropPosition === -1 ? index : index + 1, 0, dragObj);
				}
			}

			setTree(data);
		};

		// 오른쪽 트리 데이터
		const renderTreeNodes = (nodes: TreeNode[]): any[] =>
			nodes.map((node: TreeNode) => ({
				title:
					editingKey === node.key ? (
						<input
							type="text"
							value={editingValue}
							autoFocus
							onChange={e => setEditingValue(e.target.value)}
							onBlur={() => saveEdit(node.key)}
							onKeyDown={(e: any) => {
								if (e.key === 'Enter') {
									saveEdit(node.key);
								}
							}}
							style={{ width: 150 }}
						/>
					) : (
						<Space>
							<span
								style={{
									fontWeight: node.key === selectedFolderKey ? 'bold' : 'normal',
								}}
							>
								{node.title}
							</span>

							{node.menuType === 'F' && (
								<Button size="small" icon={<EditOutlined />} onClick={() => startEdit(node.key, node.title)} />
							)}
							{node.menuType === 'F' && !node.uprFolderId && (
								<Button size="small" icon={<FolderAddOutlined />} onClick={() => addChild(node.key)} />
							)}
							{node.key !== 'root' && (
								<Button size="small" icon={<DeleteOutlined />} danger onClick={() => deleteNode(node.key)} />
							)}
						</Space>
					),
				key: node.key,
				children: node.children ? renderTreeNodes(node.children) : [],
			}));

		return (
			<div style={{ padding: 8, height: 400, overflow: 'auto' }}>
				<Button
					type="dashed"
					icon={<PlusOutlined />}
					onClick={() =>
						setTree(prev => [...prev, { title: '새 폴더', key: `new-${Date.now()}`, children: [], menuType: 'F' }])
					}
					style={{ marginBottom: 8 }}
				>
					새 폴더 추가
				</Button>

				<Tree
					draggable
					blockNode
					defaultExpandAll
					treeData={renderTreeNodes(tree)}
					onDrop={onDrop}
					onSelect={keys => {
						if (keys.length > 0) setSelectedFolderKey(String(keys[0]));
					}}
				/>
			</div>
		);
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 트리 구조로 변환 (왼쪽 트리용)
	 * @param list
	 */
	function listToTree(list: any[]) {
		// progNo 길이 오름차순 정렬 (부모가 먼저 오도록)
		const sorted = [...list].sort((a, b) => a.progNo.length - b.progNo.length);
		const map: { [key: string]: any } = {};
		const roots: any[] = [];

		sorted.forEach(item => {
			map[item.progNo] = {
				...item,
				key: item.progNo,
				title: item.progNm,
				children: [],
				menuType: item.menuType,
			};
		});

		sorted.forEach(item => {
			// 부모 progNo는 현재 progNo의 앞부분 (길이 - 3)만큼
			if (item.progNo.length > 6) {
				// 예: WM10100511 → 부모는 WM101005
				const parentKey = item.progNo.slice(0, item.progNo.length - 2);
				if (map[parentKey]) {
					map[parentKey].children.push(map[item.progNo]);
					return;
				}
			}
			// 최상위(부모 없음)
			roots.push(map[item.progNo]);
		});

		return roots;
	}

	/**
	 * 트리 구조로 변환 (오른쪽 트리용: uprFolderId를 부모 key로 사용)
	 * @param list
	 */
	function listToTreeRight(list: any[]) {
		const map: { [key: string]: any } = {};
		const roots: any[] = [];

		const newList = list.map(item => ({
			...item,
			key:
				item.menuType === 'F'
					? item.progCd // 폴더는 progCd만
					: item.progCd + (item.uprFolderId ? '_' + item.uprFolderId : ''), // 메뉴는 uprFolderId 포함
		}));

		list = newList;

		// 모든 노드를 map에 등록
		list.forEach(item => {
			map[item.key] = {
				...item,
				title: item.progNm,
				children: [],
				menuType: item.menuType,
			};
		});

		// 재귀적으로 children 구성
		list.forEach(item => {
			const parentKey = item.uprFolderId;
			if (parentKey && map[parentKey]) {
				map[parentKey].children.push(map[item.key]);
			} else {
				// 부모가 없으면 최상위
				roots.push(map[item.key]);
			}
		});

		return roots;
	}

	/**
	 * 확인버튼 클릭시 저장
	 */
	const save = () => {
		showConfirm(null, t('msg.confirmSave'), () => {
			apiSaveMyMenuList(rightTree).then(() => {
				fetchMyMenuList(); // 즐겨찾기 목록 동기화
				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
				});
				close();
			});
		});
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		// 초기데이터 로드
		const params = {};

		// LEFT 트리 데이터 조회
		apiGetMyMenuPopupList(params).then(res => {
			const tree = listToTree(res.data);
			setTreeData(tree);
		});

		// RIGHT 트리 데이터 조회
		apiGetMyFavoriteMenuList(params).then(res => {
			const tree = listToTreeRight(res.data);
			setRightTree(tree);
		});
	}, []);

	// 🔹 App Root
	/**
	 *
	 */
	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="메뉴 즐겨찾기" />
			{/* Tree 상단 카운트 hide처리 */}
			<style>
				{`
        .ant-transfer-list-header {
          display: none !important;
        }
				.ant-transfer {
					padding: 10px; 
				}
      `}
			</style>
			<TreeTransfer dataSource={treeData} />
			<ButtonWrap data-props="single">
				<Button type="primary" onClick={save}>
					{t('lbl.SAVE')} {/* 저장 */}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default CmMyMenuPopup;
