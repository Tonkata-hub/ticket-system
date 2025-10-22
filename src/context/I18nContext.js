"use client";

import { createContext, useContext, useMemo } from "react";

const I18nContext = createContext({
	t: (key) => key,
	locale: "en",
});

function getByPath(object, path) {
	if (!object || !path) return undefined;
	const segments = path.split(".");
	let current = object;
	for (const segment of segments) {
		if (current && Object.prototype.hasOwnProperty.call(current, segment)) {
			current = current[segment];
		} else {
			return undefined;
		}
	}
	return current;
}

export function I18nProvider({ locale, dictionary, children }) {
	const value = useMemo(() => {
		const translate = (key, replacements) => {
			const raw = getByPath(dictionary, key);
			if (raw == null) return key;
			if (!replacements) return raw;
			return Object.keys(replacements).reduce((acc, k) => acc.replaceAll(`{${k}}`, String(replacements[k])), raw);
		};
		return { t: translate, locale };
	}, [dictionary, locale]);

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
	return useContext(I18nContext);
}
