export const getAllMonthsInPortuguese = Array.from({ length: 12 }, (_, i) => {
    const monthName = new Date(0, i).toLocaleString("pt-BR", { month: "long" });
    const monthNameFirsLetter = monthName.charAt(0);
    const monthNameFirsLetterCap = monthNameFirsLetter.toUpperCase();
    const remainingLetters = monthName.slice(1);
    const capitalizedMonthName = monthNameFirsLetterCap + remainingLetters;

    return {
        value: i + 1,
        label: capitalizedMonthName,
    }
});


export const formatDateString = (dateString: string): string => {
    if (!dateString) return "";
    return dateString.split('-').reverse().join('-').replaceAll('-', '/');
};
