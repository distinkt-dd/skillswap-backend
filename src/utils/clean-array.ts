export const cleanStringArray = (
	arr: (string | undefined)[] | undefined
): string[] => {
	if (!arr) return []
	return arr.filter((item): item is string => typeof item === 'string')
}
