export const SITE_TITLE = '梅爾 Merle';
export const SITE_DESCRIPTION = '梅爾 Merle 關於創作、設計與網路生活的個人筆記。';

export const withBase = (path = '') => {
	const base = import.meta.env.BASE_URL;
	return `${base}${path.replace(/^\//, '')}`;
};
