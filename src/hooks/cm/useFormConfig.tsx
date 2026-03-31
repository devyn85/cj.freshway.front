import ConfigProvider from 'antd/es/config-provider';

/**
 * useFormConfig hook
 * antd config provider 에서 사용하는 componentDisabled 값을 반환
 * @returns { formDisabled: boolean }
 */
export const useFormConfig = () => {
	const { componentDisabled: formDisabled } = ConfigProvider.useConfig();
	return { formDisabled };
};
