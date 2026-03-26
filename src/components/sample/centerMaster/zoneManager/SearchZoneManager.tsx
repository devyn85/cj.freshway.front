// Lib
import { InputText } from '@/components/common/custom/form';

// Utils
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// Store

// Component

// API Call Function

const SearchZoneManager = (props: any) => {
	const { search } = props;
	const { t } = useTranslation();
	return (
		<>
			<UiFilterArea>
				<UiFilterGroup className="grid-column-2">
					<li>
						<label>피킹존</label>
						<span>
							<InputText
								name="schZone"
								placeholder={t('msg.placeholder2', [t('com.col.regId')])}
								onPressEnter={search}
							/>
						</span>
					</li>
					<li>
						<label>내역</label>
						<span>
							<InputText
								name="schDescription"
								placeholder={t('msg.placeholder2', [t('com.col.regId')])}
								onPressEnter={search}
							/>
						</span>
					</li>
				</UiFilterGroup>
			</UiFilterArea>
		</>
	);
};

export default SearchZoneManager;
