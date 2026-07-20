export const SITE_TITLE = '梅爾 Merle';
export const SITE_DESCRIPTION = '梅爾 Merle 的個人網站：記錄澳洲靈性瑜伽村與露營生活、素食探索、內容創作，以及與 AI 協作完成的網站與數位工具。';

export const withBase = (path = '') => {
	const base = import.meta.env.BASE_URL;
	return `${base}${path.replace(/^\//, '')}`;
};
